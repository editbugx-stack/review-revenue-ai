import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  Crown, 
  Zap,
  CreditCard,
  Calendar,
  ArrowRight
} from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for trying out",
    features: [
      "50 reviews/month",
      "Basic AI replies",
      "1 location",
      "Email support"
    ],
    current: false
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For growing businesses",
    features: [
      "500 reviews/month",
      "Advanced AI + Sentiment",
      "3 locations",
      "Priority support",
      "Custom templates",
      "Analytics dashboard"
    ],
    current: true,
    popular: true
  },
  {
    name: "Agency",
    price: "$149",
    period: "/month",
    description: "For agencies & franchises",
    features: [
      "Unlimited reviews",
      "White-label options",
      "Unlimited locations",
      "API access",
      "Dedicated manager",
      "Custom integrations"
    ],
    current: false
  }
];

const Billing = () => {
  return (
    <AppLayout title="Billing" subtitle="Manage your subscription and payment">
      {/* Current Plan Card */}
      <div className="bg-card rounded-2xl border border-primary/30 p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-primary/10 to-transparent" />
        <div className="relative">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-primary" />
                <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-medium">
                  Current Plan
                </span>
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground">Pro Trial</h2>
              <p className="text-muted-foreground">14-day free trial • 12 days remaining</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-display font-bold text-foreground">$49</p>
              <p className="text-sm text-muted-foreground">/month after trial</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4 text-primary" />
              <span>247 / 500 reviews used</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Renews Dec 20, 2024</span>
            </div>
          </div>

          {/* Usage Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Monthly Review Usage</span>
              <span className="text-foreground font-medium">247 / 500</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-gradient-neon h-2 rounded-full" style={{ width: '49.4%' }} />
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="neon-outline">
              <CreditCard className="w-4 h-4" />
              Update Payment Method
            </Button>
            <Button variant="ghost">
              Cancel Subscription
            </Button>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <h3 className="font-display font-bold text-xl mb-6">All Plans</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`relative bg-card rounded-2xl p-6 border transition-all duration-300 ${
              plan.popular
                ? "border-primary shadow-neon"
                : "border-border/50 hover:border-primary/30"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-neon text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                MOST POPULAR
              </span>
            )}
            
            {plan.current && (
              <span className="absolute top-4 right-4 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-medium">
                Current
              </span>
            )}

            <h4 className="font-display font-bold text-xl mb-1">{plan.name}</h4>
            <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
            
            <div className="mb-6">
              <span className="text-4xl font-display font-bold text-foreground">{plan.price}</span>
              <span className="text-muted-foreground">{plan.period}</span>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              variant={plan.current ? "neon-outline" : plan.popular ? "neon" : "neon-outline"}
              className="w-full"
              disabled={plan.current}
            >
              {plan.current ? "Current Plan" : "Upgrade"}
              {!plan.current && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        ))}
      </div>

      {/* Billing History */}
      <div className="mt-12">
        <h3 className="font-display font-bold text-xl mb-6">Billing History</h3>
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          <div className="grid grid-cols-4 gap-4 p-4 border-b border-border/50 bg-muted/30 text-sm font-medium text-muted-foreground">
            <div>Date</div>
            <div>Description</div>
            <div>Amount</div>
            <div>Status</div>
          </div>
          {[
            { date: "Dec 6, 2024", desc: "Pro Trial Started", amount: "$0.00", status: "Active" },
            { date: "Nov 6, 2024", desc: "Starter Plan", amount: "$0.00", status: "Completed" },
          ].map((item, i) => (
            <div key={i} className="grid grid-cols-4 gap-4 p-4 border-b border-border/50 last:border-0">
              <div className="text-sm text-foreground">{item.date}</div>
              <div className="text-sm text-muted-foreground">{item.desc}</div>
              <div className="text-sm text-foreground">{item.amount}</div>
              <div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  item.status === "Active" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Billing;
