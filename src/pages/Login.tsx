import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, ArrowRight } from "lucide-react";

const Login = () => {
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

        {/* Login Card */}
        <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-soft backdrop-blur-sm">
          <h1 className="text-2xl font-display font-bold text-center mb-2">
            Login to Manage Reviews
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Welcome back! Enter your credentials to continue.
          </p>

          <form className="space-y-5">
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
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
              />
            </div>

            <Link to="/dashboard">
              <Button variant="neon" className="w-full" size="lg">
                Login
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </form>

          <div className="mt-6 pt-6 border-t border-border/50 text-center">
            <p className="text-muted-foreground text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
