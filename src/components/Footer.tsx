import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card/50 border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col items-center gap-6 sm:gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-neon flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              AI Review<span className="text-primary">Reply</span>
            </span>
          </Link>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            <a href="#features" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">
              Pricing
            </a>
            <Link to="/login" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">
              Login
            </Link>
            <Link to="/register" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">
              Register
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-muted-foreground text-xs sm:text-sm text-center">
            © 2024 AI Review Reply Manager. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
