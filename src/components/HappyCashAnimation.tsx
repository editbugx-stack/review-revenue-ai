import { DollarSign, Sparkles, TrendingUp, Star } from "lucide-react";

const HappyCashAnimation = () => {
  return (
    <div className="relative w-80 h-80 flex items-center justify-center">
      {/* Main glow background */}
      <div className="absolute inset-0 bg-gradient-radial from-neon-green/20 via-neon-cyan/10 to-transparent rounded-full animate-pulse-neon" />
      
      {/* Floating money stack */}
      <div className="relative animate-cash-float">
        {/* Main dollar bill stack */}
        <div className="relative">
          {/* Bill shadows */}
          <div className="absolute -bottom-2 left-2 w-32 h-20 bg-neon-green/20 rounded-xl blur-sm" />
          <div className="absolute -bottom-1 left-1 w-32 h-20 bg-neon-green/30 rounded-xl" />
          
          {/* Main bill */}
          <div className="relative w-32 h-20 bg-gradient-to-br from-neon-green to-neon-cyan rounded-xl flex items-center justify-center shadow-neon">
            <DollarSign className="w-12 h-12 text-primary-foreground" />
          </div>
        </div>

        {/* Flying coins */}
        <div className="absolute -top-8 -right-8 animate-float" style={{ animationDelay: "0.5s" }}>
          <div className="w-10 h-10 rounded-full bg-gradient-neon flex items-center justify-center shadow-neon">
            <DollarSign className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
        
        <div className="absolute -top-4 -left-10 animate-float" style={{ animationDelay: "1s" }}>
          <div className="w-8 h-8 rounded-full bg-gradient-neon flex items-center justify-center shadow-neon">
            <DollarSign className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>

        <div className="absolute top-8 -right-12 animate-float" style={{ animationDelay: "1.5s" }}>
          <div className="w-6 h-6 rounded-full bg-neon-cyan flex items-center justify-center shadow-neon-cyan">
            <DollarSign className="w-3 h-3 text-secondary-foreground" />
          </div>
        </div>

        {/* Trending up arrow */}
        <div className="absolute -bottom-6 -right-6 animate-float" style={{ animationDelay: "0.7s" }}>
          <div className="w-12 h-12 rounded-xl bg-card/80 backdrop-blur-sm border border-primary/30 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>

      {/* Sparkles */}
      <Sparkles className="absolute top-4 right-8 w-6 h-6 text-neon-cyan animate-sparkle" />
      <Star className="absolute bottom-8 left-4 w-5 h-5 text-neon-purple animate-sparkle" style={{ animationDelay: "0.5s" }} />
      <Sparkles className="absolute top-12 left-8 w-4 h-4 text-primary animate-sparkle" style={{ animationDelay: "1s" }} />
      <Star className="absolute bottom-16 right-4 w-4 h-4 text-neon-cyan animate-sparkle" style={{ animationDelay: "1.5s" }} />
    </div>
  );
};

export default HappyCashAnimation;
