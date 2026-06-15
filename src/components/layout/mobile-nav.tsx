import { NavLink } from "react-router-dom";
import { APP_NAV, SPECIALIST_NAV } from "@/app/navigation";
import { useCurrentUser } from "@/features/auth/auth.store";
import { can } from "@/lib/permissions";
import { cn } from "@/lib/cn";

/**
 * Navegación inferior para móvil (SSD 7.4 - "Navegación inferior para
 * especialistas"). Para administrador y recepción mostramos los accesos
 * principales de forma compacta.
 */
export function MobileNav({ variant }: { variant: "app" | "specialist" }) {
  const user = useCurrentUser();
  const source = variant === "specialist" ? SPECIALIST_NAV : APP_NAV;
  const items = source
    .filter((item) => !item.capability || can(user?.role, item.capability))
    .slice(0, 5);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-card/95 backdrop-blur-sm md:hidden"
      aria-label="Navegación inferior"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
