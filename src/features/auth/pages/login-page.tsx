import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ShieldCheck, Building2, Stethoscope } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUsers } from "@/hooks/use-demo-data";
import { useAuthStore } from "@/features/auth/auth.store";
import { homePathForRole } from "@/app/route-guards";
import { USER_ROLE_LABELS, type UserRole } from "@/domain/enums";
import type { User } from "@/domain/entities";
import { useBranches } from "@/hooks/use-demo-data";
import { LoadingState } from "@/components/feedback/loading-state";

const roleIcon: Record<UserRole, typeof ShieldCheck> = {
  owner: ShieldCheck,
  receptionist: Building2,
  specialist: Stethoscope,
};

/**
 * Pantalla de acceso con perfiles predefinidos (SSD 4.1). Sin contraseñas: al
 * seleccionar un perfil se crea una sesión local ficticia.
 */
export function LoginPage() {
  const users = useUsers();
  const branches = useBranches();
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  function handleSelect(user: User) {
    login(user);
    navigate(homePathForRole(user.role), { replace: true });
  }

  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="w-full max-w-2xl"
        >
          <div className="mb-8 text-center">
            <img
              src={`${import.meta.env.BASE_URL}logo-anthoaris.png`}
              alt="Centro Anthoaris"
              className="mx-auto mb-4 h-24 w-auto rounded-xl object-contain shadow-sm"
            />
            <h1 className="text-2xl font-semibold tracking-tight">
              Sistema de Gestión Multi-Sede
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Selecciona un perfil para ingresar a la demostración
            </p>
            <Badge tone="warning" className="mt-3">
              Entorno demostrativo — información ficticia
            </Badge>
          </div>

          {!users || !branches ? (
            <LoadingState rows={4} />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {users.map((user, i) => {
                const Icon = roleIcon[user.role];
                const branch = branches.find((b) => b.id === user.branchId);
                return (
                  <motion.button
                    key={user.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: 0.05 * i }}
                    onClick={() => handleSelect(user)}
                    className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
                  >
                    <Card className="flex items-center gap-4 p-4 transition-all hover:border-primary/40 hover:shadow-md">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium leading-tight">{user.fullName}</div>
                        <div className="text-sm text-muted-foreground leading-tight">
                          {USER_ROLE_LABELS[user.role]}
                          {branch ? ` · ${branch.name}` : ""}
                        </div>
                      </div>
                    </Card>
                  </motion.button>
                );
              })}
            </div>
          )}

          <p className="mt-8 text-center text-xs text-muted-foreground">
            No se usan contraseñas reales. La sesión es local y ficticia.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
