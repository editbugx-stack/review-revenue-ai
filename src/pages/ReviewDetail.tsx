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
  MessageSquare
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

const ReviewDetail = () => {
  const { id } = useParams();
  
  // Mock data for the review
  const review = {
    id,
    reviewer: "Emily Rodriguez",
    rating: 1,
    source: "Facebook",
    sentiment: "Negative",
    date: "December 5, 2024",
    fullText: `Very disappointed with my experience today. I was promised a callback within 24 hours regarding my service request, but I never received one. When I finally reached someone after calling multiple times, they seemed unaware of my previous complaint.

The quality of service was also below expectations. I've been a loyal customer for 3 years and this is the first time I've felt the need to leave a negative review. I hope management takes this feedback seriously.

I would have given zero stars if that was an option. Please improve your customer communication and follow-through.`,
  };

  const analysis = {
    summary: "Customer expresses frustration about lack of follow-up communication and perceived decline in service quality. Long-term customer showing signs of potential churn.",
    category: "Customer Service / Communication",
    urgency: "High",
    keyIssues: [
      "No callback as promised",
      "Poor internal communication",
      "Declining service quality perception"
    ]
  };

  const replyDrafts = [
    {
      tone: "Friendly",
      text: `Hi Emily,

Thank you so much for taking the time to share your experience with us. We're truly sorry to hear that we fell short of your expectations, especially as a valued customer of 3 years.

You're absolutely right - a callback was promised and we should have followed through. This is not the level of service we strive to provide, and I'm personally looking into what went wrong.

I'd love the opportunity to make this right. Could you please reach out to me directly at [email]? I want to ensure your concerns are addressed properly.

Thank you for your patience and for giving us the chance to improve.

Warm regards,
[Your Name]`
    },
    {
      tone: "Formal",
      text: `Dear Ms. Rodriguez,

Thank you for bringing this matter to our attention. We sincerely apologize for the lapse in communication regarding your service request and the subsequent difficulties you experienced when trying to reach our team.

As a valued customer of three years, you deserve better service than what you received. We are currently reviewing our internal processes to ensure this situation does not recur.

We would appreciate the opportunity to discuss this matter further and resolve your concerns. Please contact our customer service manager at your earliest convenience.

Sincerely,
[Your Name]
Customer Relations`
    },
    {
      tone: "Apologetic",
      text: `Emily,

I am deeply sorry for the experience you had with us. There's no excuse for failing to call you back as promised, and I understand how frustrating it must have been to have to reach out multiple times.

After 3 years of your loyalty, you deserved so much better. I take full responsibility for this breakdown in service.

Please allow me to make it up to you. I'd like to offer [specific compensation] and personally ensure your concerns are addressed. My direct line is [phone number] - please call me at your convenience.

We truly value your business and I hope to have the chance to restore your faith in us.

With sincere apologies,
[Your Name]`
    }
  ];

  return (
    <AppLayout title="Review Detail" subtitle="View and respond to customer feedback">
      {/* Back Button */}
      <Link to="/reviews" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Reviews
      </Link>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Panel - Full Review */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl border border-border/50 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-foreground font-bold text-lg">
                  {review.reviewer[0]}
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg">{review.reviewer}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={`w-4 h-4 ${j < review.rating ? 'text-destructive fill-destructive' : 'text-muted'}`} />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">·</span>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
                <Tag className="w-3 h-3" />
                {review.source}
              </span>
              <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-destructive/20 text-destructive">
                <TrendingUp className="w-3 h-3" />
                {review.sentiment}
              </span>
              <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {review.date}
              </span>
            </div>

            {/* Full Review Text */}
            <div className="prose prose-sm prose-invert max-w-none">
              <p className="text-foreground whitespace-pre-line leading-relaxed">
                {review.fullText}
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - AI Analysis & Drafts */}
        <div className="space-y-6">
          {/* AI Analysis */}
          <div className="bg-card rounded-2xl border border-border/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-neon flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold">AI Analysis</h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Summary</p>
                <p className="text-sm text-foreground">{analysis.summary}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Category</p>
                  <p className="text-sm text-foreground">{analysis.category}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Urgency</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-destructive/20 text-destructive font-medium">
                    {analysis.urgency}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Key Issues</p>
                <ul className="space-y-1">
                  {analysis.keyIssues.map((issue, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Warning Bar */}
          <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">More Business Info Required</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add your callback policy and compensation guidelines to generate more accurate replies.
              </p>
              <Link to="/settings?tab=business">
                <Button variant="neon-outline" size="sm" className="mt-3">
                  Add Business Info
                </Button>
              </Link>
            </div>
          </div>

          {/* Reply Drafts */}
          <div className="bg-card rounded-2xl border border-border/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold">AI-Generated Reply Drafts</h3>
            </div>

            <div className="space-y-4">
              {replyDrafts.map((draft, i) => (
                <div key={i} className="border border-border/50 rounded-xl p-4 hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      draft.tone === "Friendly" ? "bg-primary/20 text-primary" :
                      draft.tone === "Formal" ? "bg-secondary/20 text-secondary" :
                      "bg-accent/20 text-accent"
                    }`}>
                      {draft.tone}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-4">
                    {draft.text}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="ghost" size="sm">
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="w-3 h-3" />
                      Copy
                    </Button>
                    <Button variant="neon" size="sm">
                      <Check className="w-3 h-3" />
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ReviewDetail;
