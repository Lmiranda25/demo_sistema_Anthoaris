import { cn } from "@/lib/cn";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Acciones a la derecha (botones, filtros). */
  actions?: React.ReactNode;
  className?: string;
}

/** Encabezado de página consistente (SSD 7.1 - un objetivo principal por pantalla). */
export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
