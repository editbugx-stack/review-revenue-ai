import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured");
      return new Response(
        JSON.stringify({ success: false, error: "GEMINI_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { reviewId, reviewText, reviewerName, rating, businessContext } = await req.json() as ReviewAnalysisRequest;

    // Validate required fields
    if (!reviewText) {
      return new Response(
        JSON.stringify({ success: false, error: "Review text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Analyzing review ${reviewId} for business: ${businessContext?.name}`);

    // Build prompt for Gemini
    const prompt = `You are an AI assistant that analyzes customer reviews for businesses and generates professional responses.

Business Context:
- Business Name: ${businessContext?.name || "Unknown Business"}
- Category: ${businessContext?.category || "General"}
- Default Tone: ${businessContext?.defaultTone || "friendly"}

Review to Analyze:
- Reviewer: ${reviewerName || "Anonymous"}
- Rating: ${rating}/5 stars
- Review Text: "${reviewText}"

Please analyze this review and provide a JSON response with the following structure (respond ONLY with valid JSON, no markdown or extra text):

{
  "analysis": {
    "sentiment": "positive" OR "neutral" OR "negative",
    "themes": ["array", "of", "key", "themes", "from", "the", "review"],
    "priority": "high" OR "medium" OR "low"
  },
  "replies": [
    {
      "tone": "professional",
      "text": "A professional business response to the review"
    },
    {
      "tone": "friendly",
      "text": "A warm, friendly response to the review"
    },
    {
      "tone": "empathetic",
      "text": "An empathetic, understanding response to the review"
    }
  ]
}

Guidelines:
- Sentiment should reflect the overall feeling of the review
- Themes should be 2-5 key topics mentioned (e.g., "service", "quality", "price", "staff", "wait time")
- Priority: "high" for negative reviews or urgent issues, "medium" for neutral/mixed, "low" for positive reviews
- Each reply should be 2-4 sentences, address the reviewer by name if provided, and be appropriate for posting publicly
- Professional tone: formal, business-appropriate
- Friendly tone: warm, personable, uses the business name
- Empathetic tone: understanding, acknowledges feelings, shows care`;

    // Call Google Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    
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
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API error:", geminiResponse.status, errorText);
      
      if (geminiResponse.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
      // Remove markdown code blocks if present
      let cleanedResponse = responseText.trim();
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.slice(7);
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.slice(3);
      }
      if (cleanedResponse.endsWith("```")) {
        cleanedResponse = cleanedResponse.slice(0, -3);
      }
      cleanedResponse = cleanedResponse.trim();
      
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", responseText);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to parse AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate response structure
    const analysis = parsedResponse.analysis || {};
    const replies = parsedResponse.replies || [];

    const result: AnalysisResponse = {
      success: true,
      analysis: {
        sentiment: analysis.sentiment || "neutral",
        themes: Array.isArray(analysis.themes) ? analysis.themes : [],
        priority: analysis.priority || "medium",
      },
      replies: replies.map((r: any) => ({
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
