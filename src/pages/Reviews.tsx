import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Zap, 
  Star, 
  Search,
  ChevronDown,
  Eye,
  MoreHorizontal,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

const statusFilters = ["All", "Pending", "Replied", "Escalated"];
const sentimentFilters = ["All", "Positive", "Neutral", "Negative"];
const platformFilters = ["All", "Google", "Yelp", "Facebook", "Manual"];
const dateFilters = ["Last 7 Days", "Last 30 Days", "Custom Range"];

const mockReviews = [
  { 
    id: 1,
    reviewer: "Sarah Mitchell", 
    rating: 5, 
    source: "Google", 
    snippet: "Absolutely amazing experience! The team went above and beyond to help me. Would highly recommend to anyone looking for...", 
    sentiment: "Positive", 
    status: "Pending",
    urgency: "Low",
    date: "2 hours ago"
  },
  { 
    id: 2,
    reviewer: "John Davis", 
    rating: 3, 
    source: "Yelp", 
    snippet: "Service was okay but the wait time was longer than expected. The staff were friendly but I had to wait 45 minutes...", 
    sentiment: "Neutral", 
    status: "Pending",
    urgency: "Medium",
    date: "5 hours ago"
  },
  { 
    id: 3,
    reviewer: "Emily Rodriguez", 
    rating: 1, 
    source: "Facebook", 
    snippet: "Very disappointed with my experience. I was promised a call back and never received one. The quality of service...", 
    sentiment: "Negative", 
    status: "Escalated",
    urgency: "High",
    date: "1 day ago"
  },
  { 
    id: 4,
    reviewer: "Mike Thompson", 
    rating: 5, 
    source: "Google", 
    snippet: "Best service in town! I've been coming here for years and they never disappoint. The attention to detail is...", 
    sentiment: "Positive", 
    status: "Replied",
    urgency: "Low",
    date: "2 days ago"
  },
  { 
    id: 5,
    reviewer: "Lisa Chen", 
    rating: 4, 
    source: "Yelp", 
    snippet: "Great experience overall. The staff were very professional and helpful. Only minor issue was parking...", 
    sentiment: "Positive", 
    status: "Replied",
    urgency: "Low",
    date: "3 days ago"
  },
];

const Reviews = () => {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedSentiment, setSelectedSentiment] = useState("All");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedDate, setSelectedDate] = useState("Last 7 Days");
  const [selectedReviews, setSelectedReviews] = useState<number[]>([]);

  const toggleSelectAll = () => {
    if (selectedReviews.length === mockReviews.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(mockReviews.map(r => r.id));
    }
  };

  const toggleSelectReview = (id: number) => {
    if (selectedReviews.includes(id)) {
      setSelectedReviews(selectedReviews.filter(r => r !== id));
    } else {
      setSelectedReviews([...selectedReviews, id]);
    }
  };

  return (
    <AppLayout title="Reviews" subtitle="Manage and respond to customer reviews">
      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search reviews..." className="pl-10" />
        </div>
        <div className="flex gap-3">
          <Button variant="ghost">
            <Plus className="w-4 h-4" />
            Add Review
          </Button>
          <Button variant="neon">
            <Zap className="w-4 h-4" />
            Analyze & Generate Replies
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-card rounded-xl border border-border/50">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filters:</span>
        </div>
        
        {/* Status Filter */}
        <div className="flex gap-2">
          {statusFilters.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-lg transition-all",
                selectedStatus === status
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-border hidden sm:block" />

        {/* Sentiment Filter */}
        <div className="flex gap-2">
          {sentimentFilters.map((sentiment) => (
            <button
              key={sentiment}
              onClick={() => setSelectedSentiment(sentiment)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-lg transition-all",
                selectedSentiment === sentiment
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              {sentiment}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-border hidden sm:block" />

        {/* Platform Dropdown */}
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-muted/50 text-muted-foreground rounded-lg hover:bg-muted transition-colors">
          {selectedPlatform}
          <ChevronDown className="w-3 h-3" />
        </button>

        {/* Date Dropdown */}
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-muted/50 text-muted-foreground rounded-lg hover:bg-muted transition-colors">
          {selectedDate}
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Reviews Table */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-border/50 bg-muted/30 text-sm font-medium text-muted-foreground">
          <div className="col-span-1 flex items-center">
            <input 
              type="checkbox" 
              checked={selectedReviews.length === mockReviews.length}
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded border-border bg-muted accent-primary"
            />
          </div>
          <div className="col-span-2">Reviewer</div>
          <div className="col-span-1">Rating</div>
          <div className="col-span-1">Source</div>
          <div className="col-span-3">Snippet</div>
          <div className="col-span-1">Sentiment</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Urgency</div>
          <div className="col-span-1">Action</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border/50">
          {mockReviews.map((review) => (
            <div 
              key={review.id} 
              className={cn(
                "grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/20 transition-colors group",
                selectedReviews.includes(review.id) && "bg-primary/5"
              )}
            >
              <div className="col-span-1">
                <input 
                  type="checkbox" 
                  checked={selectedReviews.includes(review.id)}
                  onChange={() => toggleSelectReview(review.id)}
                  className="w-4 h-4 rounded border-border bg-muted accent-primary"
                />
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground font-medium text-sm">
                    {review.reviewer[0]}
                  </div>
                  <span className="font-medium text-foreground text-sm truncate">{review.reviewer}</span>
                </div>
              </div>
              <div className="col-span-1">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-3 h-3 ${j < review.rating ? 'text-primary fill-primary' : 'text-muted'}`} />
                  ))}
                </div>
              </div>
              <div className="col-span-1">
                <span className="text-sm text-muted-foreground">{review.source}</span>
              </div>
              <div className="col-span-3">
                <p className="text-sm text-muted-foreground truncate">{review.snippet}</p>
              </div>
              <div className="col-span-1">
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full font-medium",
                  review.sentiment === "Positive" && "bg-primary/20 text-primary",
                  review.sentiment === "Neutral" && "bg-secondary/20 text-secondary",
                  review.sentiment === "Negative" && "bg-destructive/20 text-destructive"
                )}>
                  {review.sentiment}
                </span>
              </div>
              <div className="col-span-1">
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full font-medium",
                  review.status === "Pending" && "bg-secondary/20 text-secondary",
                  review.status === "Replied" && "bg-primary/20 text-primary",
                  review.status === "Escalated" && "bg-destructive/20 text-destructive"
                )}>
                  {review.status}
                </span>
              </div>
              <div className="col-span-1">
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full font-medium",
                  review.urgency === "Low" && "bg-muted text-muted-foreground",
                  review.urgency === "Medium" && "bg-secondary/20 text-secondary",
                  review.urgency === "High" && "bg-destructive/20 text-destructive"
                )}>
                  {review.urgency}
                </span>
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <Link to={`/reviews/${review.id}`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Reviews;
