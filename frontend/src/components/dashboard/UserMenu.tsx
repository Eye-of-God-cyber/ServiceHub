"use client";

/**
 * UserMenu — dropdown menu for the authenticated user in the Header.
 *
 * Displays user info and provides actions (Profile, Settings, Logout).
 * Currently, only Logout is fully functional.
 */

import { useRouter } from "next/navigation";
import { LogOut, User, Settings, HelpCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/providers/AuthProvider";

export function UserMenu() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) return null;

  // Fallback initials (e.g. "admin@example.com" -> "A")
  const initials = user.email[0].toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full">
        <Avatar className="h-9 w-9 border border-border">
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 mt-1">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none truncate">
              {user.email}
            </p>
            <p className="text-[10px] uppercase font-bold text-primary mt-1">
              {user.role}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem disabled>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Support</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
