import { ChevronDown, LogOut, User, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

const AppHeader = ({ title, subtitle }: AppHeaderProps) => {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
      {/* Page Title */}
      <div>
        <h1 className="font-display font-bold text-lg text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      {/* User Profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-neon flex items-center justify-center text-primary-foreground font-bold text-sm">
              J
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-foreground">John Smith</p>
              <div className="flex items-center gap-1.5">
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                  Pro Trial
                </span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
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
          <DropdownMenuItem asChild className="cursor-pointer text-destructive focus:text-destructive">
            <Link to="/" className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Log out
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default AppHeader;
