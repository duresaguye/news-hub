"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User, ChevronDown } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function UserDropdown() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // ✅ same pattern as Navbar
  const {
    data: session,
    isPending: sessionLoading,
    error: sessionError,
    refetch: refetchSession,
  } = authClient.useSession();

  if (sessionLoading || !session?.user) return null;
  const user = session.user;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/auth/login");
            refetchSession(); // same as Navbar flow
          },
          onError: (error) => {
            console.error("Logout failed:", error);
          },
        },
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative flex items-center gap-1 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors px-2"
          disabled={isLoggingOut}
        >
          <Avatar className="h-7 w-7">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name || "User"} />
            ) : (
              <AvatarFallback className="bg-[var(--brand-accent)] text-white text-xs">
                {getInitials(user.name || user.email)}
              </AvatarFallback>
            )}
          </Avatar>
          <ChevronDown className="w-3.5 h-3.5 text-white/70" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.name || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email || "No email"}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
