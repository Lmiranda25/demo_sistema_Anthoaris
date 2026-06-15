import * as React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { initDatabase } from "@/data/reset-demo";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";

/**
 * Proveedores globales y arranque de la base local.
 * Antes de renderizar la app, garantiza que la base exista y esté sembrada
 * (SSD 12).
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = React.useState<"loading" | "ready" | "error">("loading");

  React.useEffect(() => {
    let active = true;
    initDatabase()
      .then(() => active && setStatus("ready"))
      .catch((err) => {
        console.error("Error inicializando la base de la demo:", err);
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-md px-4 py-24">
        <LoadingState rows={3} />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto max-w-md px-4 py-24">
        <ErrorState
          title="No se pudo iniciar la demo"
          description="Tu navegador podría estar bloqueando IndexedDB (modo privado). Intenta recargar."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      {children}
      <Toaster />
    </TooltipProvider>
  );
}
