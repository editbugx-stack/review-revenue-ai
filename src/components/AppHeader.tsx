import { ChevronDown, LogOut, User, Crown, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useBusinessData";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

const AppHeader = ({ title, subtitle, onMenuClick }: AppHeaderProps) => {
  const { signOut } = useAuth();
  const { data: profile } = useProfile();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="h-14 sm:h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
      {/* Left: Menu button (mobile) + Page Title */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-muted text-foreground"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="min-w-0">
          <h1 className="font-display font-bold text-base sm:text-lg text-foreground truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground truncate hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      {/* User Profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-xl hover:bg-muted transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-neon flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
              {profile?.name?.[0] || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-foreground truncate max-w-[120px]">
                {profile?.name || 'User'}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium capitalize">
                  {profile?.plan_type || 'trial'}
                </span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-card border-border">
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to="/settings" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to="/billing" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Upgrade Plan
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem 
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default AppHeader;
