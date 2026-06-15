import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Filtro de sede del dashboard y listados. "all" = vista consolidada (SSD 4.2). */
export type BranchScope = "all" | string;

interface AppState {
  /** Sede activa para filtrar datos. El dueño puede cambiarla; otros roles
   *  quedan fijados a su sede (gestionado en la UI). */
  branchScope: BranchScope;
  setBranchScope: (scope: BranchScope) => void;

  /** Estado de la barra lateral en escritorio (colapsada o no). */
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      branchScope: "all",
      setBranchScope: (branchScope) => set({ branchScope }),
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
    }),
    { name: "anthoaris-demo-app" },
  ),
);
