import { useState } from "react";
import { RotateCcw, Database, Info } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { resetDemo } from "@/data/reset-demo";
import { seedCounts } from "@/data/seed";

/**
 * Configuración de la demo. Incluye el botón "Reiniciar demo" exigido por el
 * SSD 12: elimina la base local y vuelve a cargar los datos semilla.
 */
export function SettingsPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  async function handleReset() {
    setResetting(true);
    try {
      await resetDemo();
      toast.success("Demo reiniciada con datos semilla");
      setConfirmOpen(false);
      // Recarga para reconstruir todos los hooks reactivos desde cero.
      setTimeout(() => window.location.reload(), 400);
    } catch {
      toast.error("No se pudo reiniciar la demo");
      setResetting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Configuración" description="Opciones del entorno demostrativo" />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Acerca de esta demo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Este es un entorno demostrativo con información totalmente ficticia. Los datos
            viven únicamente en tu navegador (IndexedDB) y no se comparten con nadie.
          </p>
          <p>
            No contiene autenticación real, backend ni datos personales reales. Para una
            versión de producción debe sustituirse la capa de datos por una API real.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Datos semilla
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <Count label="Sedes" value={seedCounts.branches} />
            <Count label="Especialistas" value={seedCounts.specialists} />
            <Count label="Pacientes" value={seedCounts.patients} />
            <Count label="Citas" value={seedCounts.appointments} />
            <Count label="Paquetes" value={seedCounts.packages} />
            <Count label="Evoluciones" value={seedCounts.clinicalProgress} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <RotateCcw className="h-4 w-4" />
            Reiniciar demo
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Elimina todos los datos creados durante la demostración y recarga los datos
            semilla originales.
          </p>
          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
            <RotateCcw className="h-4 w-4" />
            Reiniciar demo
          </Button>
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Reiniciar la demo?</DialogTitle>
            <DialogDescription>
              Se borrarán todos los pacientes, citas y paquetes que hayas creado, y se
              restaurarán los datos de ejemplo. Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={resetting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleReset} disabled={resetting}>
              {resetting ? "Reiniciando…" : "Sí, reiniciar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Count({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border px-3 py-2">
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
