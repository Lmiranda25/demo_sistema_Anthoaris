import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/domain/entities";
import type { DemoSession } from "@/features/auth/auth.types";

interface AuthState {
  session: DemoSession | null;
  /** Inicia una sesión local ficticia seleccionando un perfil (SSD 4.1). */
  login: (user: User) => void;
  logout: () => void;
}

/**
 * Estado de sesión. Se persiste en localStorage para que la sesión sobreviva a
 * recargas (coherente con el criterio "los datos sobreviven al recargar", SSD 18).
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      login: (user) =>
        set({ session: { user, startedAt: new Date().toISOString() } }),
      logout: () => set({ session: null }),
    }),
    {
      name: "anthoaris-demo-session",
    },
  ),
);

/** Selector de conveniencia: usuario actual o undefined. */
export function useCurrentUser(): User | undefined {
  return useAuthStore((s) => s.session?.user);
}
