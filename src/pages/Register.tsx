import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, ArrowRight, Check } from "lucide-react";

const Register = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-neon flex items-center justify-center shadow-neon">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            AI Review<span className="text-primary">Reply</span>
          </span>
        </Link>

        {/* Register Card */}
        <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-soft backdrop-blur-sm">
          <h1 className="text-2xl font-display font-bold text-center mb-2">
            Create Your Account
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Start automating your review replies in minutes.
          </p>

          <form className="space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Full Name
              </label>
              <Input
                type="text"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Email
              </label>
              <Input
                type="email"
                placeholder="you@business.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
              />
            </div>

            <Link to="/dashboard">
              <Button variant="neon" className="w-full" size="lg">
                Create Account
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </form>

          {/* Benefits */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <div className="space-y-3">
              {[
                "14-day free trial included",
                "No credit card required",
                "Cancel anytime"
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-primary" />
                  </div>
                  {benefit}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
