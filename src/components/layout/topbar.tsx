import { useNavigate } from "react-router-dom";
import { LogOut, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BranchSelector } from "@/components/common/branch-selector";
import { useAuthStore, useCurrentUser } from "@/features/auth/auth.store";
import { USER_ROLE_LABELS } from "@/domain/enums";

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

/** Barra superior: selector de sede, usuario y cierre de sesión (SSD 7.4). */
export function Topbar({ showBranchSelector = true }: { showBranchSelector?: boolean }) {
  const user = useCurrentUser();
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  if (!user) return null;

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-card/80 px-4 backdrop-blur-sm sm:px-6">
      {showBranchSelector ? <BranchSelector /> : <div />}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-auto gap-2 px-2 py-1.5">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{initials(user.fullName)}</AvatarFallback>
            </Avatar>
            <div className="hidden text-left sm:block">
              <div className="text-sm font-medium leading-tight">{user.fullName}</div>
              <div className="text-xs text-muted-foreground leading-tight">
                {USER_ROLE_LABELS[user.role]}
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4" />
              {user.fullName}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive">
            <LogOut className="h-4 w-4" />
            Cambiar de perfil
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
