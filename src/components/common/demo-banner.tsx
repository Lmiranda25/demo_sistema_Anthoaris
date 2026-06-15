import { FlaskConical } from "lucide-react";

/**
 * Etiqueta visible exigida por el SSD 13:
 * "Entorno demostrativo — información ficticia".
 */
export function DemoBanner() {
  return (
    <div className="flex items-center justify-center gap-2 bg-warning/20 px-4 py-1.5 text-center text-xs font-medium text-warning-foreground">
      <FlaskConical className="h-3.5 w-3.5" />
      Entorno demostrativo — información ficticia
    </div>
  );
}
