import { useMemo, useState } from "react";
import { Plus, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/feedback/empty-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { AppointmentStatusBadge } from "@/components/common/status-badge";
import { AppointmentStatusMenu } from "@/features/appointments/components/status-menu";
import { AppointmentFormDialog } from "@/features/appointments/components/appointment-form-dialog";
import {
  useAppointments,
  usePatients,
  useSpecialists,
} from "@/hooks/use-demo-data";
import { useScopedBranch, filterByBranch } from "@/hooks/use-scoped-branch";
import { useFiltersStore } from "@/stores/filters.store";
import {
  formatDayLong,
  formatTime,
  isSameDay,
  startOfWeek,
  endOfWeek,
} from "@/lib/dates";
import { APPOINTMENT_STATUS_LABELS, type AppointmentStatus } from "@/domain/enums";
import type { Appointment } from "@/domain/entities";

type ViewMode = "day" | "week";

export function AppointmentsPage() {
  const appointments = useAppointments();
  const patients = usePatients();
  const specialists = useSpecialists();
  const scope = useScopedBranch();
  const statusFilter = useFiltersStore((s) => s.appointmentStatus);
  const setStatusFilter = useFiltersStore((s) => s.setAppointmentStatus);
  const specialistFilter = useFiltersStore((s) => s.appointmentSpecialistId);
  const setSpecialistFilter = useFiltersStore((s) => s.setAppointmentSpecialistId);

  const [view, setView] = useState<ViewMode>("day");
  const [cursor, setCursor] = useState(() => new Date());
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = filterByBranch(appointments, scope);
    if (statusFilter !== "all") list = list.filter((a) => a.status === statusFilter);
    if (specialistFilter !== "all") list = list.filter((a) => a.specialistId === specialistFilter);

    if (view === "day") {
      list = list.filter((a) => isSameDay(new Date(a.startsAt), cursor));
    } else {
      const ws = startOfWeek(cursor, { weekStartsOn: 1 }).getTime();
      const we = endOfWeek(cursor, { weekStartsOn: 1 }).getTime();
      list = list.filter((a) => {
        const t = new Date(a.startsAt).getTime();
        return t >= ws && t <= we;
      });
    }
    return [...list].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  }, [appointments, scope, statusFilter, specialistFilter, view, cursor]);

  function shift(direction: -1 | 1) {
    const next = new Date(cursor);
    next.setDate(next.getDate() + direction * (view === "day" ? 1 : 7));
    setCursor(next);
  }

  const scopedSpecialists = useMemo(() => {
    let list = specialists ?? [];
    if (scope !== "all") list = list.filter((s) => s.branchIds.includes(scope));
    return list;
  }, [specialists, scope]);

  const patientName = (id: string) => {
    const p = patients?.find((x) => x.id === id);
    return p ? `${p.firstName} ${p.lastName}` : "—";
  };
  const specialistName = (id: string) => {
    const s = specialists?.find((x) => x.id === id);
    return s ? `${s.firstName} ${s.lastName}` : "—";
  };

  const rangeLabel =
    view === "day"
      ? formatDayLong(cursor)
      : `Semana del ${startOfWeek(cursor, { weekStartsOn: 1 }).toLocaleDateString("es-PE")}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agenda"
        description="Citas, estados y disponibilidad"
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Nueva cita
          </Button>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => shift(-1)} aria-label="Anterior">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0 flex-1 text-center text-sm font-medium capitalize sm:min-w-[200px] sm:flex-none">
            {rangeLabel}
          </div>
          <Button variant="outline" size="icon" onClick={() => shift(1)} aria-label="Siguiente">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCursor(new Date())}>
            Hoy
          </Button>
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
            <TabsList>
              <TabsTrigger value="day">Día</TabsTrigger>
              <TabsTrigger value="week">Semana</TabsTrigger>
            </TabsList>
          </Tabs>

          <Select value={specialistFilter} onValueChange={setSpecialistFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Especialista" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los especialistas</SelectItem>
              {scopedSpecialists.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.firstName} {s.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as AppointmentStatus | "all")}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {(Object.keys(APPOINTMENT_STATUS_LABELS) as AppointmentStatus[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {APPOINTMENT_STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!appointments ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No hay citas en este rango"
          description="Crea una nueva cita o cambia los filtros."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((appt) => (
            <AppointmentRow
              key={appt.id}
              appt={appt}
              patientName={patientName(appt.patientId)}
              specialistName={specialistName(appt.specialistId)}
              showDay={view === "week"}
            />
          ))}
        </div>
      )}

      <AppointmentFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultDate={cursor.toISOString().slice(0, 10)}
      />
    </div>
  );
}

function AppointmentRow({
  appt,
  patientName,
  specialistName,
  showDay,
}: {
  appt: Appointment;
  patientName: string;
  specialistName: string;
  showDay: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold leading-none">{formatTime(appt.startsAt)}</div>
            {showDay && (
              <div className="mt-1 text-xs capitalize text-muted-foreground">
                {new Date(appt.startsAt).toLocaleDateString("es-PE", { weekday: "short", day: "numeric" })}
              </div>
            )}
          </div>
          <div>
            <div className="font-medium">{patientName}</div>
            <div className="text-sm text-muted-foreground">{specialistName}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AppointmentStatusBadge status={appt.status} />
          <AppointmentStatusMenu appointment={appt} />
        </div>
      </CardContent>
    </Card>
  );
}
