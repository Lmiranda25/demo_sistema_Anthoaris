import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { DemoBanner } from "@/components/common/demo-banner";

/**
 * Estructura principal de la aplicación (SSD 7.4): sidebar + topbar + contenido.
 * `variant` define qué navegación se muestra (administrativa o de especialista).
 */
export function AppShell({ variant }: { variant: "app" | "specialist" }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <DemoBanner />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar variant={variant} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar showBranchSelector={variant === "app"} />
          <main className="flex-1 overflow-y-auto px-4 py-6 pb-24 sm:px-6 md:pb-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <MobileNav variant={variant} />
    </div>
  );
}
