import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HappyCashAnimation from "@/components/HappyCashAnimation";
import { Check, ArrowRight, Star, BarChart3, MessageSquare, Clock, Zap, Building2, Scissors, UtensilsCrossed, Car, GraduationCap, Play } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="space-y-8 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                Turn Stressful Reviews Into{" "}
                <span className="gradient-text">Revenue</span> — Automatically.
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                AI that reads, understands, replies, and grows your business reputation while you sleep.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button variant="neon" size="xl" className="w-full sm:w-auto">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="neon-outline" size="xl" className="gap-2">
                  <Play className="w-5 h-5" />
                  Watch 60-second Demo
                </Button>
              </div>

              {/* Micro benefits */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {[
                  "1-click bulk replies",
                  "Understand customer emotions",
                  "Save 9 hours weekly"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Animation */}
            <div className="flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <HappyCashAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-12 border-y border-border/50 bg-card/30">
        <div className="container mx-auto px-6">
          <p className="text-center text-muted-foreground mb-8">Trusted by local businesses everywhere</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { icon: Building2, label: "Dental Clinics" },
              { icon: Scissors, label: "Salons" },
              { icon: UtensilsCrossed, label: "Restaurants" },
              { icon: Car, label: "Auto Repair" },
              { icon: GraduationCap, label: "Tutoring" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-muted-foreground/60 hover:text-muted-foreground transition-colors">
                <item.icon className="w-6 h-6" />
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Transform your review management in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-neon opacity-30" />
            
            {[
              { step: "01", icon: MessageSquare, title: "Paste or Sync Reviews", desc: "Import reviews from Google, Yelp, Facebook or paste them manually" },
              { step: "02", icon: Zap, title: "AI Analyzes & Drafts", desc: "Our AI understands sentiment, context and crafts perfect responses" },
              { step: "03", icon: Check, title: "Approve & Send", desc: "Review, edit if needed, and publish in one click" }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="bg-card rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-neon/20 h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-neon flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-neon">
                    <item.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="text-primary font-display font-bold text-sm">STEP {item.step}</span>
                  <h3 className="text-xl font-display font-bold mt-2 mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-24 bg-card/30 border-y border-border/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Powerful <span className="gradient-text">Dashboard</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to manage reviews in one beautiful interface
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Mock Dashboard Card */}
            <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold">Recent Reviews</h3>
                <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full">Live</span>
              </div>
              {[
                { name: "Sarah M.", rating: 5, preview: "Amazing service! The team was...", sentiment: "positive" },
                { name: "John D.", rating: 3, preview: "Wait time was longer than...", sentiment: "neutral" },
                { name: "Mike R.", rating: 1, preview: "Very disappointed with...", sentiment: "negative" }
              ].map((review, i) => (
                <div key={i} className="bg-muted/30 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground font-medium">
                    {review.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.name}</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className={`w-3 h-3 ${j < review.rating ? 'text-primary fill-primary' : 'text-muted'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{review.preview}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    review.sentiment === 'positive' ? 'bg-primary/20 text-primary' :
                    review.sentiment === 'negative' ? 'bg-destructive/20 text-destructive' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {review.sentiment}
                  </span>
                </div>
              ))}
            </div>

            {/* AI Insights Card */}
            <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold">AI Insights — Last 30 Days</h3>
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              
              {/* Sentiment Chart Placeholder */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-20">Positive</span>
                  <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                    <div className="h-full bg-gradient-neon rounded-full" style={{ width: '72%' }} />
                  </div>
                  <span className="text-sm font-medium text-primary">72%</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-20">Neutral</span>
                  <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                    <div className="h-full bg-neon-cyan rounded-full" style={{ width: '18%' }} />
                  </div>
                  <span className="text-sm font-medium text-secondary">18%</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-20">Negative</span>
                  <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                    <div className="h-full bg-destructive rounded-full" style={{ width: '10%' }} />
                  </div>
                  <span className="text-sm font-medium text-destructive">10%</span>
                </div>
              </div>

              {/* Top Complaints */}
              <div className="pt-4 border-t border-border/50">
                <h4 className="text-sm font-medium mb-3">Top Complaint Categories</h4>
                <div className="grid grid-cols-2 gap-3">
                  {["Wait Time", "Pricing", "Service Quality", "Communication"].map((cat, i) => (
                    <div key={i} className="bg-muted/30 rounded-lg px-3 py-2 text-sm flex items-center justify-between">
                      <span className="text-muted-foreground">{cat}</span>
                      <span className="text-foreground font-medium">{[24, 18, 12, 8][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Simple, Transparent <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Start free, scale as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "Free",
                desc: "Perfect for trying out",
                features: ["50 reviews/month", "Basic AI replies", "1 location", "Email support"]
              },
              {
                name: "Pro",
                price: "$49",
                desc: "For growing businesses",
                features: ["500 reviews/month", "Advanced AI + Sentiment", "3 locations", "Priority support", "Custom templates"],
                popular: true
              },
              {
                name: "Agency",
                price: "$149",
                desc: "For agencies & franchises",
                features: ["Unlimited reviews", "White-label options", "Unlimited locations", "API access", "Dedicated manager"]
              }
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative bg-card rounded-2xl p-8 border ${
                  plan.popular
                    ? "border-primary shadow-neon"
                    : "border-border/50"
                } transition-all duration-300 hover:border-primary/50`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-neon text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="font-display font-bold text-xl">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-4xl font-display font-bold">{plan.price}</span>
                  {plan.price !== "Free" && <span className="text-muted-foreground">/mo</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.popular ? "neon" : "neon-outline"}
                  className="w-full"
                >
                  Start 14-Day Trial
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-6 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Transform Your <span className="gradient-text">Reviews?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of local businesses saving time and growing revenue with AI-powered review management.
            </p>
            <Link to="/register">
              <Button variant="neon" size="xl">
                Start Your Free Trial
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
