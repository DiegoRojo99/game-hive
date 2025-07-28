import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Library, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SteamAuth as SteamAuthUtil } from "@/utils/steamAuth";
import { Link } from "react-router-dom";

export const SteamAuth = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleSteamLogin = () => {
    SteamAuthUtil.login();
  };

  if (!isAuthenticated) {
    return (
      <Button 
        variant="steam" 
        size="sm" 
        className="flex items-center space-x-2"
        onClick={handleSteamLogin}
      >
        <User className="h-4 w-4" />
        <span>Login with Steam</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.personaname} />
            <AvatarFallback>{user.personaname.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.personaname}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.realname || 'Steam User'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to="/steam-library">
          <DropdownMenuItem className="cursor-pointer">
            <Library className="mr-2 h-4 w-4" />
            <span>Steam Library</span>
          </DropdownMenuItem>
        </Link>
        <Link to="/achievements">
          <DropdownMenuItem className="cursor-pointer">
            <Trophy className="mr-2 h-4 w-4" />
            <span>Achievements</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
