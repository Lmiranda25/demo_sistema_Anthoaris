import type { User } from "@/domain/entities";

/** Sesión local simulada (SSD 4.1). No hay token ni autenticación real. */
export interface DemoSession {
  user: User;
  startedAt: string;
}
