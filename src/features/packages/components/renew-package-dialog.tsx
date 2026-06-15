import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { renewPackage } from "@/features/packages/package.service";
import { useServices } from "@/hooks/use-demo-data";
import type { SessionPackage } from "@/domain/entities";
import { formatCurrency } from "@/lib/currency";

interface RenewPackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pkg: SessionPackage | null;
}

/** Renovación ficticia de un paquete (SSD 4.7). */
export function RenewPackageDialog({ open, onOpenChange, pkg }: RenewPackageDialogProps) {
  const services = useServices();
  const [additional, setAdditional] = useState(8);
  const [submitting, setSubmitting] = useState(false);

  const service = services?.find((s) => s.id === pkg?.serviceId);
  const price = service ? service.defaultSessionPrice * additional : 0;

  useEffect(() => {
    if (open) setAdditional(8);
  }, [open]);

  async function handleRenew() {
    if (!pkg) return;
    setSubmitting(true);
    try {
      await renewPackage({ packageId: pkg.id, additionalSessions: additional, price });
      toast.success("Paquete renovado");
      onOpenChange(false);
    } catch {
      toast.error("No se pudo renovar el paquete");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renovar paquete</DialogTitle>
          <DialogDescription>
            Agrega sesiones al paquete de {service?.name ?? "servicio"}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="mb-1.5 block">Sesiones a agregar</Label>
            <Input
              type="number"
              min={1}
              max={40}
              value={additional}
              onChange={(e) => setAdditional(Math.max(1, Number(e.target.value)))}
            />
          </div>
          <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="text-base font-semibold">{formatCurrency(price)}</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleRenew} disabled={submitting}>
            Confirmar renovación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
