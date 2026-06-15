import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/feedback/empty-state";
import type { SpecialistPerformance } from "@/features/dashboard/dashboard.types";

/** Rendimiento de especialistas (SSD 4.2). */
export function SpecialistPerformanceTable({ data }: { data: SpecialistPerformance[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendimiento de especialistas</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState title="Sin especialistas en el periodo" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Especialista</TableHead>
                <TableHead>Especialidad</TableHead>
                <TableHead className="text-right">Sesiones</TableHead>
                <TableHead className="text-right">Pacientes activos</TableHead>
                <TableHead className="text-right">Ausentismo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.specialistId}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-muted-foreground">{row.specialty}</TableCell>
                  <TableCell className="text-right">{row.attendedSessions}</TableCell>
                  <TableCell className="text-right">{row.activePatients}</TableCell>
                  <TableCell className="text-right">
                    <Badge tone={row.absenteeismRate > 0.2 ? "danger" : "neutral"}>
                      {Math.round(row.absenteeismRate * 100)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
