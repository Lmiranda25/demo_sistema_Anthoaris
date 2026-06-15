import { useState } from "react";
import type { DateRange as RdpDateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";
import { startOfDay, endOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/dates";
import { useFiltersStore } from "@/stores/filters.store";
import { RANGE_SHORTCUTS, type DateRange } from "@/features/dashboard/date-ranges";

/**
 * Selector de rango de fechas con calendario y atajos rápidos (Hoy, Este mes,
 * Mes anterior, Últimos 3 meses). Reemplaza al antiguo dropdown de periodo.
 */
export function DateRangePicker() {
  const dateFrom = useFiltersStore((s) => s.dateFrom);
  const dateTo = useFiltersStore((s) => s.dateTo);
  const setDateRange = useFiltersStore((s) => s.setDateRange);
  const [open, setOpen] = useState(false);

  const selected: RdpDateRange = {
    from: new Date(dateFrom),
    to: new Date(dateTo),
  };

  function applyShortcut(range: DateRange) {
    setDateRange(range);
    setOpen(false);
  }

  function handleSelect(range: RdpDateRange | undefined) {
    if (!range?.from) return;
    // Normaliza: 'from' a inicio del día, 'to' a fin del día (o mismo día).
    const from = startOfDay(range.from);
    const to = endOfDay(range.to ?? range.from);
    setDateRange({ from, to });
  }

  const label = `${formatDate(selected.from!)} – ${formatDate(selected.to!)}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start gap-2 font-normal sm:w-auto")}
        >
          <CalendarIcon className="h-4 w-4 shrink-0 opacity-70" />
          <span className="truncate">{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="flex flex-col sm:flex-row">
        {/* Atajos rápidos */}
        <div className="flex flex-row gap-1 border-b border-border p-2 sm:flex-col sm:border-b-0 sm:border-r">
          {RANGE_SHORTCUTS.map((sc) => (
            <Button
              key={sc.id}
              variant="ghost"
              size="sm"
              className="justify-start whitespace-nowrap text-sm"
              onClick={() => applyShortcut(sc.getRange())}
            >
              {sc.label}
            </Button>
          ))}
        </div>
        {/* Calendario de rango */}
        <Calendar
          mode="range"
          numberOfMonths={1}
          selected={selected}
          onSelect={handleSelect}
          defaultMonth={selected.from}
        />
      </PopoverContent>
    </Popover>
  );
}
