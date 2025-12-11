import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReviewAnalysisRequest {
  reviewText: string;
  reviewerName: string;
  rating: number;
  businessContext?: {
    name: string;
    category: string;
    defaultTone: string;
    facts?: string[];
    refundPolicy?: string;
    openingHours?: string;
  };
  action: "analyze" | "generate_reply" | "both";
  tone?: "friendly" | "formal" | "apologetic";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { reviewText, reviewerName, rating, businessContext, action, tone } = await req.json() as ReviewAnalysisRequest;

    if (!reviewText) {
      return new Response(
        JSON.stringify({ error: "Review text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let systemPrompt = `You are an AI assistant specialized in analyzing customer reviews and generating professional responses for businesses.`;
    
    if (businessContext) {
      systemPrompt += `\n\nBusiness Context:
- Business Name: ${businessContext.name}
- Category: ${businessContext.category}
- Default Response Tone: ${businessContext.defaultTone}`;
      
      if (businessContext.facts?.length) {
        systemPrompt += `\n- Key Facts: ${businessContext.facts.join(", ")}`;
      }
      if (businessContext.refundPolicy) {
        systemPrompt += `\n- Refund Policy: ${businessContext.refundPolicy}`;
      }
      if (businessContext.openingHours) {
        systemPrompt += `\n- Business Hours: ${businessContext.openingHours}`;
      }
    }

    let userPrompt = "";
    const tools: any[] = [];
    let toolChoice: any = undefined;

    if (action === "analyze" || action === "both") {
      tools.push({
        type: "function",
        function: {
          name: "analyze_review",
          description: "Analyze the sentiment, urgency, and key topics of a customer review",
          parameters: {
            type: "object",
            properties: {
              sentiment: {
                type: "string",
                enum: ["positive", "neutral", "negative"],
                description: "Overall sentiment of the review"
              },
              urgency: {
                type: "string",
                enum: ["low", "medium", "high"],
                description: "How urgently this review needs attention"
              },
              category: {
                type: "string",
                description: "Main category/topic of the review (e.g., 'Service Quality', 'Wait Time', 'Pricing', 'Staff', 'Product Quality')"
              },
              summary: {
                type: "string",
                description: "Brief 1-2 sentence summary of the review's main points"
              },
              missingInfoRequired: {
                type: "boolean",
                description: "Whether more information from the business is needed to respond appropriately"
              },
              missingInfoFields: {
                type: "array",
                items: { type: "string" },
                description: "List of information fields needed from the business to respond (e.g., 'specific_policy', 'incident_details')"
              }
            },
            required: ["sentiment", "urgency", "category", "summary", "missingInfoRequired"],
            additionalProperties: false
          }
        }
      });
    }

    if (action === "generate_reply" || action === "both") {
      tools.push({
        type: "function",
        function: {
          name: "generate_reply",
          description: "Generate a professional response to the customer review",
          parameters: {
            type: "object",
            properties: {
              replyText: {
                type: "string",
                description: "The generated reply text to post in response to the review"
              },
              tone: {
                type: "string",
                enum: ["friendly", "formal", "apologetic"],
                description: "The tone used in the reply"
              }
            },
            required: ["replyText", "tone"],
            additionalProperties: false
          }
        }
      });
    }

    userPrompt = `Please ${action === "both" ? "analyze and generate a reply for" : action === "analyze" ? "analyze" : "generate a reply for"} the following customer review:

Reviewer: ${reviewerName}
Rating: ${rating}/5 stars
Review: "${reviewText}"`;

    if (tone && (action === "generate_reply" || action === "both")) {
      userPrompt += `\n\nPlease use a ${tone} tone for the reply.`;
    }

    if (action === "both") {
      toolChoice = "auto";
    } else {
      toolChoice = { type: "function", function: { name: action === "analyze" ? "analyze_review" : "generate_reply" } };
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools,
        tool_choice: toolChoice,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add more credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to analyze review" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const toolCalls = aiResponse.choices?.[0]?.message?.tool_calls || [];

    const result: any = {};

    for (const call of toolCalls) {
      if (call.function.name === "analyze_review") {
        result.analysis = JSON.parse(call.function.arguments);
      } else if (call.function.name === "generate_reply") {
        result.reply = JSON.parse(call.function.arguments);
      }
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-review function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
