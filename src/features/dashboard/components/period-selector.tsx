import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFiltersStore, type DashboardPeriod } from "@/stores/filters.store";

const labels: Record<DashboardPeriod, string> = {
  this_month: "Este mes",
  last_month: "Mes anterior",
  last_3_months: "Últimos 3 meses",
};

/** Selector de periodo simulado (SSD 4.2). */
export function PeriodSelector() {
  const period = useFiltersStore((s) => s.period);
  const setPeriod = useFiltersStore((s) => s.setPeriod);
  return (
    <Select value={period} onValueChange={(v) => setPeriod(v as DashboardPeriod)}>
      <SelectTrigger className="w-[170px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(labels).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
