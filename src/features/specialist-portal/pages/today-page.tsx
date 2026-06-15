import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarCheck, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { AppointmentStatusBadge } from "@/components/common/status-badge";
import { useAppointments, usePatients } from "@/hooks/use-demo-data";
import { useCurrentUser } from "@/features/auth/auth.store";
import { formatDayLong, formatTime, isSameDay } from "@/lib/dates";

/** Agenda del día del especialista (SSD 8 - /specialist/today). */
export function SpecialistTodayPage() {
  const user = useCurrentUser();
  const appointments = useAppointments();
  const patients = usePatients();
  const navigate = useNavigate();

  const today = useMemo(
    () =>
      (appointments ?? [])
        .filter(
          (a) =>
            a.specialistId === user?.specialistId && isSameDay(new Date(a.startsAt), new Date()),
        )
        .sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
    [appointments, user?.specialistId],
  );

  const patientName = (id: string) => {
    const p = patients?.find((x) => x.id === id);
    return p ? `${p.firstName} ${p.lastName}` : "—";
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Hoy" description={formatDayLong(new Date())} />

      {!appointments ? (
        <LoadingState />
      ) : today.length === 0 ? (
        <EmptyState icon={CalendarCheck} title="No tienes citas para hoy" />
      ) : (
        <div className="space-y-3">
          {today.map((appt) => (
            <Card key={appt.id}>
              <CardContent className="flex items-center justify-between gap-3 py-4">
                <div className="flex items-center gap-4">
                  <div className="text-lg font-semibold">{formatTime(appt.startsAt)}</div>
                  <div className="font-medium">{patientName(appt.patientId)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <AppointmentStatusBadge status={appt.status} />
                  <Button size="sm" onClick={() => navigate(`/specialist/session/${appt.id}`)}>
                    Abrir
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
