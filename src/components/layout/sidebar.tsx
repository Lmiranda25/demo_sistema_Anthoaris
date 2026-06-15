import { NavLink } from "react-router-dom";
import { APP_NAV, SPECIALIST_NAV, type NavItem } from "@/app/navigation";
import { useCurrentUser } from "@/features/auth/auth.store";
import { can } from "@/lib/permissions";
import { cn } from "@/lib/cn";

/** Barra lateral del área administrativa y del especialista (SSD 7.4). */
export function Sidebar({ variant }: { variant: "app" | "specialist" }) {
  const user = useCurrentUser();
  const items = variant === "specialist" ? SPECIALIST_NAV : APP_NAV;

  const visibleItems = items.filter(
    (item) => !item.capability || can(user?.role, item.capability),
  );

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <div className="flex h-16 items-center gap-2 px-6">
        <img src={`${import.meta.env.BASE_URL}logo-anthoaris.svg`} alt="Anthoaris" className="h-7" />
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2" aria-label="Navegación principal">
        {visibleItems.map((item) => (
          <SidebarLink key={item.to} item={item} />
        ))}
      </nav>
      <div className="px-6 py-4 text-xs text-muted-foreground">
        Versión demo · v1.0
      </div>
    </aside>
  );
}

function SidebarLink({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent/60",
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      {item.label}
    </NavLink>
  );
}
