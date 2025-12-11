import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  Star,
  ArrowUpRight,
  BarChart3,
  Zap,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfile, useBusinesses, useDashboardStats } from "@/hooks/useBusinessData";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: businesses, isLoading: businessesLoading } = useBusinesses();
  const activeBusiness = businesses?.[0];
  const { data: stats, isLoading: statsLoading } = useDashboardStats(activeBusiness?.id);

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (!profileLoading && profile && !profile.onboarding_completed) {
      navigate("/onboarding");
    }
  }, [profile, profileLoading, navigate]);

  const isLoading = profileLoading || businessesLoading || statsLoading;

  if (isLoading) {
    return (
      <AppLayout title="Dashboard" subtitle="Overview of your review performance">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  if (!activeBusiness) {
    return (
      <AppLayout title="Dashboard" subtitle="Overview of your review performance">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">No business found. Please complete onboarding.</p>
          <Button variant="neon" onClick={() => navigate("/onboarding")}>
            Set up your business
          </Button>
        </div>
      </AppLayout>
    );
  }

  const statCards = [
    { 
      label: "Total Reviews", 
      value: stats?.total || 0, 
      icon: MessageSquare,
      color: "primary"
    },
    { 
      label: "Avg. Rating", 
      value: stats?.avgRating || "0.0", 
      icon: Star,
      color: "secondary"
    },
    { 
      label: "Response Rate", 
      value: `${stats?.responseRate || 0}%`, 
      icon: TrendingUp,
      color: "accent"
    },
    { 
      label: "Pending Reviews", 
      value: (stats?.total || 0) - (stats?.replied || 0), 
      icon: Clock,
      color: "primary"
    },
  ];

  return (
    <AppLayout title="Dashboard" subtitle={`Overview for ${activeBusiness.name}`}>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {statCards.map((stat, i) => (
          <div 
            key={i} 
            className="bg-card rounded-xl sm:rounded-2xl border border-border/50 p-4 sm:p-6 hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center ${
                stat.color === 'primary' ? 'bg-primary/10' :
                stat.color === 'secondary' ? 'bg-secondary/10' :
                'bg-accent/10'
              }`}>
                <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  stat.color === 'primary' ? 'text-primary' :
                  stat.color === 'secondary' ? 'text-secondary' :
                  'text-accent'
                }`} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-0.5 sm:mb-1">
              {stat.value}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Reviews */}
        <div className="lg:col-span-2 bg-card rounded-xl sm:rounded-2xl border border-border/50 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="font-display font-bold text-base sm:text-lg">Recent Reviews</h2>
            <Link to="/reviews">
              <Button variant="ghost" size="sm">
                View All
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          {stats?.recentReviews && stats.recentReviews.length > 0 ? (
            <div className="space-y-4">
              {stats.recentReviews.map((review) => (
                <Link 
                  key={review.id} 
                  to={`/reviews/${review.id}`}
                  className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors block"
                >
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground font-medium flex-shrink-0">
                    {review.reviewer_name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground">{review.reviewer_name}</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className={`w-3 h-3 ${j < review.rating ? 'text-primary fill-primary' : 'text-muted'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-1">{review.text}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${
                    review.status === 'pending' ? 'bg-secondary/20 text-secondary' :
                    review.status === 'replied' ? 'bg-primary/20 text-primary' :
                    'bg-destructive/20 text-destructive'
                  }`}>
                    {review.status}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No reviews yet</p>
              <Link to="/reviews">
                <Button variant="neon-outline">
                  <Plus className="w-4 h-4" />
                  Add your first review
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions & AI Insights */}
        <div className="space-y-4 sm:space-y-6">
          {/* Quick Actions */}
          <div className="bg-card rounded-xl sm:rounded-2xl border border-border/50 p-4 sm:p-6">
            <h2 className="font-display font-bold text-base sm:text-lg mb-3 sm:mb-4">Quick Actions</h2>
            <div className="space-y-2 sm:space-y-3">
              <Link to="/reviews" className="block">
                <Button variant="neon" className="w-full justify-start text-sm sm:text-base">
                  <Zap className="w-4 h-4" />
                  Generate AI Replies
                </Button>
              </Link>
              <Link to="/analyzer" className="block">
                <Button variant="neon-outline" className="w-full justify-start text-sm sm:text-base">
                  <BarChart3 className="w-4 h-4" />
                  View Analytics
                </Button>
              </Link>
            </div>
          </div>

          {/* Sentiment Overview */}
          {stats && (stats.sentiment.positive > 0 || stats.sentiment.neutral > 0 || stats.sentiment.negative > 0) && (
            <div className="bg-card rounded-xl sm:rounded-2xl border border-border/50 p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-neon flex items-center justify-center">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
                </div>
                <h2 className="font-display font-bold text-base sm:text-lg">Sentiment Overview</h2>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-16">Positive</span>
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${stats.total > 0 ? (stats.sentiment.positive / stats.total) * 100 : 0}%` }} 
                    />
                  </div>
                  <span className="text-sm font-medium w-8">{stats.sentiment.positive}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-16">Neutral</span>
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-secondary rounded-full" 
                      style={{ width: `${stats.total > 0 ? (stats.sentiment.neutral / stats.total) * 100 : 0}%` }} 
                    />
                  </div>
                  <span className="text-sm font-medium w-8">{stats.sentiment.neutral}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-16">Negative</span>
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-destructive rounded-full" 
                      style={{ width: `${stats.total > 0 ? (stats.sentiment.negative / stats.total) * 100 : 0}%` }} 
                    />
                  </div>
                  <span className="text-sm font-medium w-8">{stats.sentiment.negative}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
