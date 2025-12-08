import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  TrendingUp,
  TrendingDown,
  MessageSquare,
  ThumbsUp,
  Zap,
  Calendar,
  ChevronDown
} from "lucide-react";
import { useState } from "react";

const stats = [
  { 
    label: "Average Rating", 
    value: "4.3", 
    change: "+0.2",
    trend: "up",
    icon: Star 
  },
  { 
    label: "Top Complaint", 
    value: "Wait Time", 
    change: "32 mentions",
    trend: "neutral",
    icon: TrendingDown 
  },
  { 
    label: "Total Reviews", 
    value: "1,284", 
    change: "+147 this month",
    trend: "up",
    icon: MessageSquare 
  },
  { 
    label: "Top Positive Theme", 
    value: "Staff Friendliness", 
    change: "89 mentions",
    trend: "up",
    icon: ThumbsUp 
  },
];

const sentimentData = [
  { label: "Positive", value: 68, color: "primary" },
  { label: "Neutral", value: 22, color: "secondary" },
  { label: "Negative", value: 10, color: "destructive" },
];

const categoryData = [
  { label: "Service Quality", positive: 45, negative: 12 },
  { label: "Wait Time", positive: 18, negative: 32 },
  { label: "Staff", positive: 52, negative: 8 },
  { label: "Pricing", positive: 28, negative: 15 },
  { label: "Cleanliness", positive: 38, negative: 5 },
];

const ratingDistribution = [
  { stars: 5, count: 542, percentage: 42 },
  { stars: 4, count: 389, percentage: 30 },
  { stars: 3, count: 194, percentage: 15 },
  { stars: 2, count: 97, percentage: 8 },
  { stars: 1, count: 62, percentage: 5 },
];

const Analyzer = () => {
  const [dateRange, setDateRange] = useState("Last 30 Days");

  return (
    <AppLayout title="Review Analyzer" subtitle="Understand patterns and insights from your reviews">
      {/* Date Range Selector */}
      <div className="flex justify-end mb-6">
        <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border/50 rounded-xl text-sm font-medium text-foreground hover:border-primary/30 transition-colors">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          {dateRange}
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="bg-card rounded-2xl border border-border/50 p-6 hover:border-primary/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-display font-bold text-foreground mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`text-xs mt-2 ${
              stat.trend === 'up' ? 'text-primary' : 
              stat.trend === 'down' ? 'text-destructive' : 
              'text-muted-foreground'
            }`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Sentiment Distribution */}
        <div className="bg-card rounded-2xl border border-border/50 p-6">
          <h3 className="font-display font-bold text-lg mb-6">Sentiment Distribution</h3>
          
          {/* Donut Chart Placeholder */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              {/* Outer ring */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="12"
                />
                {/* Positive segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="12"
                  strokeDasharray={`${68 * 2.51} ${100 * 2.51}`}
                  strokeLinecap="round"
                />
                {/* Neutral segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="hsl(var(--secondary))"
                  strokeWidth="12"
                  strokeDasharray={`${22 * 2.51} ${100 * 2.51}`}
                  strokeDashoffset={`${-68 * 2.51}`}
                  strokeLinecap="round"
                />
                {/* Negative segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="hsl(var(--destructive))"
                  strokeWidth="12"
                  strokeDasharray={`${10 * 2.51} ${100 * 2.51}`}
                  strokeDashoffset={`${-90 * 2.51}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-display font-bold text-foreground">68%</span>
                <span className="text-sm text-muted-foreground">Positive</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6">
            {sentimentData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  item.color === 'primary' ? 'bg-primary' :
                  item.color === 'secondary' ? 'bg-secondary' :
                  'bg-destructive'
                }`} />
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-medium text-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-card rounded-2xl border border-border/50 p-6">
          <h3 className="font-display font-bold text-lg mb-6">Rating Distribution</h3>
          
          <div className="space-y-4">
            {ratingDistribution.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium text-foreground">{item.stars}</span>
                  <Star className="w-4 h-4 text-primary fill-primary" />
                </div>
                <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-neon rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="w-20 text-right">
                  <span className="text-sm font-medium text-foreground">{item.count}</span>
                  <span className="text-xs text-muted-foreground ml-1">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Analysis */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border border-border/50 p-6">
          <h3 className="font-display font-bold text-lg mb-6">Category Sentiment Breakdown</h3>
          
          <div className="space-y-4">
            {categoryData.map((cat, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{cat.label}</span>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-primary">+{cat.positive}</span>
                    <span className="text-destructive">-{cat.negative}</span>
                  </div>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden bg-muted">
                  <div 
                    className="bg-primary"
                    style={{ width: `${(cat.positive / (cat.positive + cat.negative)) * 100}%` }}
                  />
                  <div 
                    className="bg-destructive"
                    style={{ width: `${(cat.negative / (cat.positive + cat.negative)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-card rounded-2xl border border-border/50 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-neon flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <h3 className="font-display font-bold text-lg">AI Insights</h3>
          </div>

          <div className="bg-muted/30 rounded-xl p-4 mb-4">
            <p className="text-sm text-foreground leading-relaxed">
              Based on the last 30 days of review data, here are the key findings:
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-sm text-foreground">
                <span className="font-semibold text-primary">Strength:</span> Staff friendliness is your biggest asset with 89 positive mentions
              </p>
            </div>
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-foreground">
                <span className="font-semibold text-destructive">Improvement Area:</span> Wait times account for 32% of negative feedback
              </p>
            </div>
            <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20">
              <p className="text-sm text-foreground">
                <span className="font-semibold text-secondary">Trend:</span> Overall sentiment improved 8% compared to previous period
              </p>
            </div>
            <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
              <p className="text-sm text-foreground">
                <span className="font-semibold text-accent">Recommendation:</span> Consider implementing a queue management system
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Analyzer;
