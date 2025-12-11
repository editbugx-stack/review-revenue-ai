import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Zap, 
  Star, 
  Search,
  Eye,
  MoreHorizontal,
  Filter,
  Loader2,
  ChevronDown
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useBusinesses, useReviews, useCreateReview, useAnalyzeReview, useUpdateReview } from "@/hooks/useBusinessData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusFilters = ["All", "pending", "replied", "escalated"];
const sentimentFilters = ["All", "positive", "neutral", "negative"];

const Reviews = () => {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedSentiment, setSelectedSentiment] = useState("All");
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [newReview, setNewReview] = useState({
    reviewer_name: "",
    rating: 5,
    text: "",
    source: "manual" as const,
  });
  const { toast } = useToast();

  const { data: businesses } = useBusinesses();
  const activeBusiness = businesses?.[0];
  const { data: reviews, isLoading } = useReviews(activeBusiness?.id);
  const createReview = useCreateReview();
  const analyzeReview = useAnalyzeReview();
  const updateReview = useUpdateReview();

  // Filter reviews
  const filteredReviews = reviews?.filter(review => {
    if (selectedStatus !== "All" && review.status !== selectedStatus) return false;
    if (selectedSentiment !== "All" && review.sentiment !== selectedSentiment) return false;
    if (searchQuery && !review.text.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !review.reviewer_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }) || [];

  const toggleSelectAll = () => {
    if (selectedReviews.length === filteredReviews.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(filteredReviews.map(r => r.id));
    }
  };

  const toggleSelectReview = (id: string) => {
    if (selectedReviews.includes(id)) {
      setSelectedReviews(selectedReviews.filter(r => r !== id));
    } else {
      setSelectedReviews([...selectedReviews, id]);
    }
  };

  const handleAddReview = async () => {
    if (!activeBusiness || !newReview.reviewer_name || !newReview.text) return;
    
    await createReview.mutateAsync({
      business_id: activeBusiness.id,
      reviewer_name: newReview.reviewer_name,
      rating: newReview.rating,
      text: newReview.text,
      source: newReview.source,
    });
    
    setIsAddOpen(false);
    setNewReview({ reviewer_name: "", rating: 5, text: "", source: "manual" });
  };

  const handleBulkAnalyze = async () => {
    if (!activeBusiness || selectedReviews.length === 0) return;
    
    toast({ title: "Analyzing reviews...", description: `Processing ${selectedReviews.length} reviews` });
    
    for (const reviewId of selectedReviews) {
      const review = reviews?.find(r => r.id === reviewId);
      if (!review) continue;
      
      try {
        const result = await analyzeReview.mutateAsync({
          reviewText: review.text,
          reviewerName: review.reviewer_name,
          rating: review.rating,
          businessContext: {
            name: activeBusiness.name,
            category: activeBusiness.category,
            defaultTone: activeBusiness.default_tone,
          },
          action: "analyze",
        });
        
        if (result.analysis) {
          await updateReview.mutateAsync({
            id: reviewId,
            sentiment: result.analysis.sentiment,
            analysis_urgency: result.analysis.urgency,
            analysis_category: result.analysis.category,
            analysis_summary: result.analysis.summary,
            missing_info_required: result.analysis.missingInfoRequired,
            missing_info_fields: result.analysis.missingInfoFields || [],
          });
        }
      } catch (error) {
        console.error("Failed to analyze review:", reviewId, error);
      }
    }
    
    toast({ title: "Analysis complete", description: "Reviews have been analyzed" });
    setSelectedReviews([]);
  };

  return (
    <AppLayout title="Reviews" subtitle="Manage and respond to customer reviews">
      {/* Top Actions */}
      <div className="flex flex-col gap-4 mb-4 sm:mb-6">
        {/* Search + Filter Toggle */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search reviews..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              className="sm:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={cn("w-4 h-4 transition-transform", showFilters && "rotate-180")} />
            </Button>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Review</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md mx-4">
                <DialogHeader>
                  <DialogTitle>Add Manual Review</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Reviewer Name</label>
                    <Input 
                      placeholder="Customer name"
                      value={newReview.reviewer_name}
                      onChange={(e) => setNewReview({ ...newReview, reviewer_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="p-1"
                        >
                          <Star className={`w-6 h-6 ${star <= newReview.rating ? 'text-primary fill-primary' : 'text-muted'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Review Text</label>
                    <textarea 
                      className="w-full h-32 rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Enter the review text..."
                      value={newReview.text}
                      onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                    />
                  </div>
                  <Button 
                    variant="neon" 
                    className="w-full"
                    onClick={handleAddReview}
                    disabled={createReview.isPending}
                  >
                    {createReview.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Add Review
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              variant="neon" 
              size="sm"
              onClick={handleBulkAnalyze}
              disabled={selectedReviews.length === 0 || analyzeReview.isPending}
              className="flex-shrink-0"
            >
              {analyzeReview.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              <span className="hidden xs:inline">Analyze</span>
              <span className="hidden sm:inline ml-1">({selectedReviews.length})</span>
            </Button>
          </div>
        </div>

        {/* Filters - Always visible on desktop, toggleable on mobile */}
        <div className={cn(
          "flex flex-wrap gap-3 p-3 sm:p-4 bg-card rounded-xl border border-border/50 transition-all",
          "sm:flex", // Always visible on sm+
          showFilters ? "flex" : "hidden sm:flex"
        )}>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground hidden sm:block" />
            <span className="text-sm text-muted-foreground">Status:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={cn(
                  "px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-all capitalize",
                  selectedStatus === status
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-px h-px sm:h-6 bg-border" />

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sentiment:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sentimentFilters.map((sentiment) => (
              <button
                key={sentiment}
                onClick={() => setSelectedSentiment(sentiment)}
                className={cn(
                  "px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-all capitalize",
                  selectedSentiment === sentiment
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                {sentiment}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No reviews found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table Header - Hidden on mobile */}
            <div className="hidden lg:grid grid-cols-12 gap-4 p-4 border-b border-border/50 bg-muted/30 text-sm font-medium text-muted-foreground">
              <div className="col-span-1 flex items-center">
                <input 
                  type="checkbox" 
                  checked={selectedReviews.length === filteredReviews.length && filteredReviews.length > 0}
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

            {/* Mobile Select All */}
            <div className="lg:hidden p-3 border-b border-border/50 bg-muted/30 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input 
                  type="checkbox" 
                  checked={selectedReviews.length === filteredReviews.length && filteredReviews.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-border bg-muted accent-primary"
                />
                Select all ({filteredReviews.length})
              </label>
            </div>

            {/* Table Body / Card List */}
            <div className="divide-y divide-border/50">
              {filteredReviews.map((review) => (
                <div key={review.id}>
                  {/* Desktop Row */}
                  <div 
                    className={cn(
                      "hidden lg:grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/20 transition-colors group",
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
                          {review.reviewer_name[0]}
                        </div>
                        <span className="font-medium text-foreground text-sm truncate">{review.reviewer_name}</span>
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
                      <span className="text-sm text-muted-foreground capitalize">{review.source}</span>
                    </div>
                    <div className="col-span-3">
                      <p className="text-sm text-muted-foreground truncate">{review.text}</p>
                    </div>
                    <div className="col-span-1">
                      {review.sentiment ? (
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full font-medium capitalize",
                          review.sentiment === "positive" && "bg-primary/20 text-primary",
                          review.sentiment === "neutral" && "bg-secondary/20 text-secondary",
                          review.sentiment === "negative" && "bg-destructive/20 text-destructive"
                        )}>
                          {review.sentiment}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                    <div className="col-span-1">
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full font-medium capitalize",
                        review.status === "pending" && "bg-secondary/20 text-secondary",
                        review.status === "replied" && "bg-primary/20 text-primary",
                        review.status === "escalated" && "bg-destructive/20 text-destructive"
                      )}>
                        {review.status}
                      </span>
                    </div>
                    <div className="col-span-1">
                      {review.analysis_urgency ? (
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full font-medium capitalize",
                          review.analysis_urgency === "low" && "bg-muted text-muted-foreground",
                          review.analysis_urgency === "medium" && "bg-secondary/20 text-secondary",
                          review.analysis_urgency === "high" && "bg-destructive/20 text-destructive"
                        )}>
                          {review.analysis_urgency}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
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

                  {/* Mobile Card */}
                  <div 
                    className={cn(
                      "lg:hidden p-4 hover:bg-muted/20 transition-colors",
                      selectedReviews.includes(review.id) && "bg-primary/5"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        checked={selectedReviews.includes(review.id)}
                        onChange={() => toggleSelectReview(review.id)}
                        className="w-4 h-4 rounded border-border bg-muted accent-primary mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground font-medium text-sm flex-shrink-0">
                            {review.reviewer_name[0]}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="font-medium text-foreground text-sm block truncate">{review.reviewer_name}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, j) => (
                                  <Star key={j} className={`w-3 h-3 ${j < review.rating ? 'text-primary fill-primary' : 'text-muted'}`} />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground capitalize">· {review.source}</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{review.text}</p>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          {review.sentiment && (
                            <span className={cn(
                              "text-xs px-2 py-1 rounded-full font-medium capitalize",
                              review.sentiment === "positive" && "bg-primary/20 text-primary",
                              review.sentiment === "neutral" && "bg-secondary/20 text-secondary",
                              review.sentiment === "negative" && "bg-destructive/20 text-destructive"
                            )}>
                              {review.sentiment}
                            </span>
                          )}
                          <span className={cn(
                            "text-xs px-2 py-1 rounded-full font-medium capitalize",
                            review.status === "pending" && "bg-secondary/20 text-secondary",
                            review.status === "replied" && "bg-primary/20 text-primary",
                            review.status === "escalated" && "bg-destructive/20 text-destructive"
                          )}>
                            {review.status}
                          </span>
                          {review.analysis_urgency && (
                            <span className={cn(
                              "text-xs px-2 py-1 rounded-full font-medium capitalize",
                              review.analysis_urgency === "low" && "bg-muted text-muted-foreground",
                              review.analysis_urgency === "medium" && "bg-secondary/20 text-secondary",
                              review.analysis_urgency === "high" && "bg-destructive/20 text-destructive"
                            )}>
                              {review.analysis_urgency}
                            </span>
                          )}
                          
                          <div className="flex-1" />
                          
                          <Link to={`/reviews/${review.id}`}>
                            <Button variant="ghost" size="sm" className="h-8">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Reviews;
