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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ success: false, error: "API key is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { reviewId, reviewText, reviewerName, rating, businessContext } = await req.json() as ReviewAnalysisRequest;

    if (!reviewText) {
      return new Response(
        JSON.stringify({ success: false, error: "Review text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Analyzing review ${reviewId} for business: ${businessContext?.name}`);

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
    "themes": ["array", "of", "key", "themes"],
    "priority": "high" OR "medium" OR "low"
  },
  "replies": [
    {
      "tone": "professional",
      "text": "A professional business response"
    },
    {
      "tone": "friendly",
      "text": "A warm, friendly response"
    },
    {
      "tone": "empathetic",
      "text": "An empathetic, understanding response"
    }
  ]
}

Guidelines:
- Sentiment should reflect the overall feeling of the review
- Themes should be 2-5 key topics mentioned
- Priority: "high" for negative reviews, "medium" for neutral, "low" for positive
- Each reply should be 2-4 sentences and address the reviewer by name if provided`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a helpful AI that analyzes customer reviews and generates professional responses. Always respond with valid JSON only." },
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: "Payment required. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ success: false, error: "Failed to analyze review with AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content;
    
    if (!responseText) {
      console.error("No content in AI response:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ success: false, error: "No response from AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
      console.error("Failed to parse AI response as JSON:", responseText);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to parse AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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

    console.log(`Analysis complete for review ${reviewId}: sentiment=${result.analysis?.sentiment}`);

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
