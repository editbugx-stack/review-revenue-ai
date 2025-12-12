import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Business = Tables<"businesses">;
export type Review = Tables<"reviews">;
export type Reply = Tables<"replies">;
export type Profile = Tables<"profiles">;

// Fetch user's profile
export function useProfile() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

// Fetch user's businesses
export function useBusinesses() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["businesses", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

// Fetch reviews for a business
export function useReviews(businessId?: string) {
  return useQuery({
    queryKey: ["reviews", businessId],
    queryFn: async () => {
      if (!businessId) return [];
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("business_id", businessId)
        .order("review_date", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!businessId,
  });
}

// Fetch a single review with replies
export function useReviewWithReplies(reviewId?: string) {
  return useQuery({
    queryKey: ["review", reviewId],
    queryFn: async () => {
      if (!reviewId) return null;
      
      const { data: review, error: reviewError } = await supabase
        .from("reviews")
        .select("*")
        .eq("id", reviewId)
        .single();
      
      if (reviewError) throw reviewError;
      
      const { data: replies, error: repliesError } = await supabase
        .from("replies")
        .select("*")
        .eq("review_id", reviewId)
        .order("created_at", { ascending: false });
      
      if (repliesError) throw repliesError;
      
      return { review, replies };
    },
    enabled: !!reviewId,
  });
}

// Create a new review
export function useCreateReview() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (review: TablesInsert<"reviews">) => {
      const { data, error } = await supabase
        .from("reviews")
        .insert(review)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", data.business_id] });
      toast({
        title: "Review added",
        description: "The review has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to add review",
        description: error.message,
      });
    },
  });
}

// Update a review
export function useUpdateReview() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"reviews"> & { id: string }) => {
      const { data, error } = await supabase
        .from("reviews")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["review", data.id] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to update review",
        description: error.message,
      });
    },
  });
}

// Create a reply
export function useCreateReply() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (reply: TablesInsert<"replies">) => {
      const { data, error } = await supabase
        .from("replies")
        .insert(reply)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["review", data.review_id] });
      toast({
        title: "Reply saved",
        description: "Your reply has been saved.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to save reply",
        description: error.message,
      });
    },
  });
}

// Types for AI analysis
interface AnalyzeReviewParams {
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

interface AnalysisResult {
  sentiment: "positive" | "neutral" | "negative";
  themes: string[];
  priority: "low" | "medium" | "high";
}

interface GeneratedReply {
  tone: "professional" | "friendly" | "empathetic";
  text: string;
}

interface AnalyzeReviewResponse {
  success: boolean;
  analysis: AnalysisResult;
  replies: GeneratedReply[];
}

// Map edge function tones to database enum values
const toneMapping: Record<string, "friendly" | "formal" | "apologetic"> = {
  professional: "formal",
  friendly: "friendly",
  empathetic: "apologetic",
};

// Analyze and generate reply using AI
export function useAnalyzeReview() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (params: AnalyzeReviewParams): Promise<AnalyzeReviewResponse> => {
      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke<AnalyzeReviewResponse>("analyze-review", {
        body: params,
      });
      
      if (error) {
        throw new Error(error.message || "Failed to analyze review");
      }
      
      if (!data?.success) {
        throw new Error("Analysis failed");
      }
      
      // Update the review with analysis results
      const { error: updateError } = await supabase
        .from("reviews")
        .update({
          sentiment: data.analysis.sentiment,
          analysis_urgency: data.analysis.priority,
          analysis_summary: data.analysis.themes.join(", "),
          analysis_category: data.analysis.themes[0] || null,
        })
        .eq("id", params.reviewId);
      
      if (updateError) {
        console.error("Failed to update review:", updateError);
      }
      
      // Save generated replies to the replies table
      const repliesToInsert = data.replies.map((reply) => ({
        review_id: params.reviewId,
        tone: toneMapping[reply.tone] || "friendly",
        text: reply.text,
        is_approved: false,
        created_by: "system_ai" as const,
      }));
      
      const { error: repliesError } = await supabase
        .from("replies")
        .insert(repliesToInsert);
      
      if (repliesError) {
        console.error("Failed to save replies:", repliesError);
      }
      
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["review", variables.reviewId] });
      
      toast({
        title: "Analysis complete",
        description: "AI has analyzed the review and generated reply suggestions.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: error.message || "Could not analyze review. Please try again.",
      });
    },
  });
}

// Dashboard stats
export function useDashboardStats(businessId?: string) {
  return useQuery({
    queryKey: ["dashboard-stats", businessId],
    queryFn: async () => {
      if (!businessId) return null;
      
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const { data: reviews, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("business_id", businessId)
        .gte("review_date", thirtyDaysAgo.toISOString());
      
      if (error) throw error;
      
      const total = reviews.length;
      const replied = reviews.filter(r => r.status === "replied").length;
      const avgRating = total > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / total 
        : 0;
      const responseRate = total > 0 ? (replied / total) * 100 : 0;
      
      const positive = reviews.filter(r => r.sentiment === "positive").length;
      const neutral = reviews.filter(r => r.sentiment === "neutral").length;
      const negative = reviews.filter(r => r.sentiment === "negative").length;
      
      return {
        total,
        replied,
        avgRating: avgRating.toFixed(1),
        responseRate: responseRate.toFixed(0),
        sentiment: { positive, neutral, negative },
        recentReviews: reviews.slice(0, 5),
      };
    },
    enabled: !!businessId,
  });
}
