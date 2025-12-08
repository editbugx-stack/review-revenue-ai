import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card/50 border-t border-border/50">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
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
          <div className="flex items-center gap-8">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors relative group">
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
            <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors relative group">
              Login
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
            <Link to="/register" className="text-muted-foreground hover:text-primary transition-colors relative group">
              Register
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-muted-foreground text-sm">
            © 2024 AI Review Reply Manager
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
