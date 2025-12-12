import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReviewAnalysisRequest {
  reviewId: string;
  reviewText: string;
  reviewerName: string;
  rating: number;
  businessContext: {
    name: string;
    category: string;
    defaultTone: string;
  };
}

interface AnalysisResponse {
  success: boolean;
  analysis?: {
    sentiment: "positive" | "neutral" | "negative";
    themes: string[];
    priority: "high" | "medium" | "low";
  };
  replies?: Array<{
    tone: "professional" | "friendly" | "empathetic";
    text: string;
  }>;
  error?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured");
      return new Response(
        JSON.stringify({ success: false, error: "API key is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify auth token and get user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limiting: check usage_metrics for today's AI calls
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    
    const { data: usageData, error: usageError } = await supabase
      .from("usage_metrics")
      .select("ai_calls_used")
      .eq("user_id", user.id)
      .gte("period_start", startOfDay.split('T')[0])
      .single();

    const currentCalls = usageData?.ai_calls_used || 0;
    const DAILY_LIMIT = 50;

    if (currentCalls >= DAILY_LIMIT) {
      return new Response(
        JSON.stringify({ success: false, error: `Daily limit of ${DAILY_LIMIT} AI requests exceeded. Try again tomorrow.` }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update usage counter
    if (usageData) {
      await supabase
        .from("usage_metrics")
        .update({ ai_calls_used: currentCalls + 1, updated_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .gte("period_start", startOfDay.split('T')[0]);
    }

    const { reviewId, reviewText, reviewerName, rating, businessContext } = await req.json() as ReviewAnalysisRequest;

    if (!reviewText) {
      return new Response(
        JSON.stringify({ success: false, error: "Review text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Analyzing review ${reviewId} for business: ${businessContext?.name}`);

    // Build prompt for Gemini
    const prompt = `You are a review response assistant. Analyze this customer review and provide a JSON response with the following structure: {"sentiment": "positive|negative|neutral", "themes": ["theme1", "theme2"], "priority": "high|medium|low", "replies": [{"tone": "professional", "text": "reply text here"}, {"tone": "friendly", "text": "reply text here"}, {"tone": "empathetic", "text": "reply text here"}]}. 

Business: ${businessContext?.name || "Unknown Business"} (${businessContext?.category || "General"})
Reviewer: ${reviewerName || "Anonymous"}
Rating: ${rating}/5
Review: ${reviewText}

Generate thoughtful replies that match the business tone: ${businessContext?.defaultTone || "friendly"}. Keep replies concise (2-3 sentences) and authentic. Priority should be "high" for negative reviews (1-2 stars), "medium" for neutral (3 stars), "low" for positive (4-5 stars). Return ONLY valid JSON, no markdown.`;

    // Call Google Gemini API (FREE tier)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API error:", geminiResponse.status, errorText);
      
      if (geminiResponse.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: "Gemini API rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (geminiResponse.status === 400) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid request to Gemini API" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ success: false, error: "Failed to analyze review with AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const geminiData = await geminiResponse.json();
    console.log("Gemini response received");

    // Extract text from Gemini response
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      console.error("No text in Gemini response:", JSON.stringify(geminiData));
      return new Response(
        JSON.stringify({ success: false, error: "No response from AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse JSON from response (handle potential markdown code blocks)
    let parsedResponse;
    try {
      let cleanedResponse = responseText.trim();
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.slice(7);
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.slice(3);
      }
      if (cleanedResponse.endsWith("```")) {
        cleanedResponse = cleanedResponse.slice(0, -3);
      }
      parsedResponse = JSON.parse(cleanedResponse.trim());
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", responseText);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to parse AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build response in exact structure requested
    const result: AnalysisResponse = {
      success: true,
      analysis: {
        sentiment: parsedResponse.sentiment || "neutral",
        themes: Array.isArray(parsedResponse.themes) ? parsedResponse.themes : [],
        priority: parsedResponse.priority || "medium",
      },
      replies: (parsedResponse.replies || []).map((r: any) => ({
        tone: r.tone || "friendly",
        text: r.text || "",
      })),
    };

    console.log(`Analysis complete for review ${reviewId}: sentiment=${result.analysis?.sentiment}, priority=${result.analysis?.priority}`);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-review function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
