import AppLayout from "@/components/AppLayout";
import { 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  Star,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const stats = [
  { 
    label: "Total Reviews", 
    value: "1,284", 
    change: "+12%", 
    trend: "up",
    icon: MessageSquare,
    color: "primary"
  },
  { 
    label: "Avg. Rating", 
    value: "4.6", 
    change: "+0.3", 
    trend: "up",
    icon: Star,
    color: "secondary"
  },
  { 
    label: "Response Rate", 
    value: "94%", 
    change: "+8%", 
    trend: "up",
    icon: TrendingUp,
    color: "accent"
  },
  { 
    label: "Avg. Response Time", 
    value: "2.4h", 
    change: "-45%", 
    trend: "down",
    icon: Clock,
    color: "primary"
  },
];

const recentReviews = [
  { name: "Sarah M.", rating: 5, preview: "Absolutely loved the service! Will definitely come back...", time: "2 min ago", status: "pending" },
  { name: "John D.", rating: 3, preview: "The wait time was longer than expected but...", time: "1 hour ago", status: "replied" },
  { name: "Emily R.", rating: 5, preview: "Best experience I've had in a long time. The staff...", time: "3 hours ago", status: "replied" },
  { name: "Mike T.", rating: 2, preview: "Unfortunately I wasn't satisfied with...", time: "5 hours ago", status: "escalated" },
];

const Dashboard = () => {
  return (
    <AppLayout title="Dashboard" subtitle="Overview of your review performance">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="bg-card rounded-2xl border border-border/50 p-6 hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                stat.color === 'primary' ? 'bg-primary/10' :
                stat.color === 'secondary' ? 'bg-secondary/10' :
                'bg-accent/10'
              }`}>
                <stat.icon className={`w-5 h-5 ${
                  stat.color === 'primary' ? 'text-primary' :
                  stat.color === 'secondary' ? 'text-secondary' :
                  'text-accent'
                }`} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                stat.trend === 'up' ? 'text-primary' : 'text-destructive'
              }`}>
                {stat.change}
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
              </div>
            </div>
            <p className="text-3xl font-display font-bold text-foreground mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Reviews */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-lg">Recent Reviews</h2>
            <Link to="/reviews">
              <Button variant="ghost" size="sm">
                View All
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {recentReviews.map((review, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground font-medium flex-shrink-0">
                  {review.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground">{review.name}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={`w-3 h-3 ${j < review.rating ? 'text-primary fill-primary' : 'text-muted'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{review.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-1">{review.preview}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${
                  review.status === 'pending' ? 'bg-secondary/20 text-secondary' :
                  review.status === 'replied' ? 'bg-primary/20 text-primary' :
                  'bg-destructive/20 text-destructive'
                }`}>
                  {review.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & AI Insights */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-card rounded-2xl border border-border/50 p-6">
            <h2 className="font-display font-bold text-lg mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/reviews" className="block">
                <Button variant="neon" className="w-full justify-start">
                  <Zap className="w-4 h-4" />
                  Generate AI Replies
                </Button>
              </Link>
              <Link to="/analyzer" className="block">
                <Button variant="neon-outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4" />
                  View Analytics
                </Button>
              </Link>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-card rounded-2xl border border-border/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-neon flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <h2 className="font-display font-bold text-lg">AI Insights</h2>
            </div>
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <p className="text-sm text-foreground">
                  <span className="font-semibold text-primary">Trending:</span> 23% more reviews mention "fast service" this week
                </p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20">
                <p className="text-sm text-foreground">
                  <span className="font-semibold text-secondary">Suggestion:</span> Consider highlighting your quick turnaround in responses
                </p>
              </div>
              <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                <p className="text-sm text-foreground">
                  <span className="font-semibold text-accent">Alert:</span> 3 reviews require immediate attention
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
