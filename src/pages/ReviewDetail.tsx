import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  ArrowLeft,
  AlertTriangle,
  Zap,
  Copy,
  Edit3,
  Check,
  Calendar,
  Tag,
  TrendingUp,
  MessageSquare,
  Loader2
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useReviewWithReplies, useBusinesses, useAnalyzeReview, useUpdateReview, useCreateReply } from "@/hooks/useBusinessData";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const ReviewDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [generatedReplies, setGeneratedReplies] = useState<Array<{ tone: string; text: string }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { data, isLoading } = useReviewWithReplies(id);
  const { data: businesses } = useBusinesses();
  const activeBusiness = businesses?.[0];
  const analyzeReview = useAnalyzeReview();
  const updateReview = useUpdateReview();
  const createReply = useCreateReply();

  const review = data?.review;
  const replies = data?.replies || [];

  const handleGenerateReplies = async () => {
    if (!review || !activeBusiness) return;
    
    setIsGenerating(true);
    
    try {
      const result = await analyzeReview.mutateAsync({
        reviewId: review.id,
        reviewText: review.text,
        reviewerName: review.reviewer_name,
        rating: review.rating,
        businessContext: {
          name: activeBusiness.name,
          category: activeBusiness.category,
          defaultTone: activeBusiness.default_tone,
        },
      });
      
      // Map the replies to the format expected by the UI
      const newReplies = result.replies.map((reply) => ({
        tone: reply.tone === "professional" ? "formal" : reply.tone,
        text: reply.text,
      }));
      
      setGeneratedReplies(newReplies);
      toast({ title: "Replies generated", description: `${newReplies.length} reply drafts created` });
    } catch (error) {
      console.error("Failed to generate replies:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveReply = async (text: string, tone: string) => {
    if (!review) return;
    
    const toneValue = tone.toLowerCase() as "friendly" | "formal" | "apologetic";
    
    const reply = await createReply.mutateAsync({
      review_id: review.id,
      text,
      tone: toneValue,
      is_approved: true,
      created_by: "system_ai",
    });
    
    await updateReview.mutateAsync({
      id: review.id,
      status: "replied",
      approved_reply_id: reply.id,
      replied_at: new Date().toISOString(),
    });
    
    toast({ title: "Reply approved", description: "The reply has been saved and marked as approved." });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Reply copied to clipboard" });
  };

  if (isLoading) {
    return (
      <AppLayout title="Review Detail" subtitle="View and respond to customer feedback">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  if (!review) {
    return (
      <AppLayout title="Review Detail" subtitle="View and respond to customer feedback">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Review not found</p>
          <Link to="/reviews">
            <Button variant="neon-outline" className="mt-4">
              Back to Reviews
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Review Detail" subtitle="View and respond to customer feedback">
      {/* Back Button */}
      <Link to="/reviews" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Reviews
      </Link>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Panel - Full Review */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl border border-border/50 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-foreground font-bold text-lg">
                  {review.reviewer_name[0]}
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg">{review.reviewer_name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={`w-4 h-4 ${j < review.rating ? (review.rating <= 2 ? 'text-destructive fill-destructive' : 'text-primary fill-primary') : 'text-muted'}`} />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">·</span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(review.review_date), "MMMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground capitalize">
                <Tag className="w-3 h-3" />
                {review.source}
              </span>
              {review.sentiment && (
                <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full capitalize ${
                  review.sentiment === "positive" ? "bg-primary/20 text-primary" :
                  review.sentiment === "neutral" ? "bg-secondary/20 text-secondary" :
                  "bg-destructive/20 text-destructive"
                }`}>
                  <TrendingUp className="w-3 h-3" />
                  {review.sentiment}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {format(new Date(review.review_date), "MMM d, yyyy")}
              </span>
            </div>

            {/* Full Review Text */}
            <div className="prose prose-sm prose-invert max-w-none">
              <p className="text-foreground whitespace-pre-line leading-relaxed">
                {review.text}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* AI Analysis */}
          {/* AI Analysis */}
          {(review.analysis_summary || review.analysis_category || review.analysis_urgency) && (
            <div className="bg-card rounded-2xl border border-border/50 p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-neon flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary-foreground" />
                </div>
                <h3 className="font-display font-bold">AI Analysis</h3>
              </div>

              <div className="space-y-4">
                {review.analysis_summary && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Summary</p>
                    <p className="text-sm text-foreground">{review.analysis_summary}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  {review.analysis_category && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Category</p>
                      <p className="text-sm text-foreground">{review.analysis_category}</p>
                    </div>
                  )}
                  {review.analysis_urgency && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Urgency</p>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                        review.analysis_urgency === "high" ? "bg-destructive/20 text-destructive" :
                        review.analysis_urgency === "medium" ? "bg-secondary/20 text-secondary" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {review.analysis_urgency}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Generate Replies Button */}
          {generatedReplies.length === 0 && replies.length === 0 && (
            <Button 
              variant="neon" 
              className="w-full" 
              onClick={handleGenerateReplies}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating replies...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Generate AI Reply Drafts
                </>
              )}
            </Button>
          )}

          {/* Info Bar */}
          {review.missing_info_required && (
            <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">More Business Info Recommended</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add more business details to generate more accurate replies.
                </p>
                <Link to="/settings">
                  <Button variant="neon-outline" size="sm" className="mt-3">
                    Add Business Info
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Approved Replies */}
          {replies.filter(r => r.is_approved).length > 0 && (
            <div className="bg-card rounded-2xl border border-primary/30 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Check className="w-5 h-5 text-primary" />
                <h3 className="font-display font-bold">Approved Reply</h3>
              </div>
              {replies.filter(r => r.is_approved).map((reply) => (
                <div key={reply.id} className="bg-primary/10 rounded-xl p-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize mb-3 inline-block ${
                    reply.tone === "friendly" ? "bg-primary/20 text-primary" :
                    reply.tone === "formal" ? "bg-secondary/20 text-secondary" :
                    "bg-accent/20 text-accent"
                  }`}>
                    {reply.tone}
                  </span>
                  <p className="text-sm text-foreground whitespace-pre-line">
                    {reply.text}
                  </p>
                  <Button variant="ghost" size="sm" className="mt-3" onClick={() => copyToClipboard(reply.text)}>
                    <Copy className="w-3 h-3" />
                    Copy
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Generated Reply Drafts */}
          {generatedReplies.length > 0 && (
            <div className="bg-card rounded-2xl border border-border/50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h3 className="font-display font-bold">AI-Generated Reply Drafts</h3>
              </div>

              <div className="space-y-4">
                {generatedReplies.map((draft, i) => (
                  <div key={i} className="border border-border/50 rounded-xl p-4 hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                        draft.tone === "friendly" ? "bg-primary/20 text-primary" :
                        draft.tone === "formal" ? "bg-secondary/20 text-secondary" :
                        "bg-accent/20 text-accent"
                      }`}>
                        {draft.tone}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-6">
                      {draft.text}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(draft.text)}>
                        <Copy className="w-3 h-3" />
                        Copy
                      </Button>
                      <Button 
                        variant="neon" 
                        size="sm" 
                        onClick={() => handleApproveReply(draft.text, draft.tone)}
                        disabled={createReply.isPending}
                      >
                        <Check className="w-3 h-3" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default ReviewDetail;
