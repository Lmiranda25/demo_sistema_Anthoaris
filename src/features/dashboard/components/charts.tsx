import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";
import type { RevenueByMonth, RevenueByService } from "@/features/dashboard/dashboard.types";
import { EmptyState } from "@/components/feedback/empty-state";

const PIE_COLORS = ["#0f766e", "#7c3aed", "#0891b2", "#ca8a04", "#db2777"];

/** Gráfico de ingresos por mes (SSD 4.2). */
export function RevenueTrendChart({ data }: { data: RevenueByMonth[] }) {
  const hasData = data.some((d) => d.amount > 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos por mes</CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis
                tickFormatter={(v) => `${v / 1000}k`}
                tickLine={false}
                axisLine={false}
                fontSize={12}
                width={36}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Ingresos"]}
                cursor={{ fill: "rgba(15,118,110,0.06)" }}
              />
              <Bar dataKey="amount" fill="#0f766e" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState title="Sin ingresos en el periodo" />
        )}
      </CardContent>
    </Card>
  );
}

/** Gráfico de ingresos por tipo de servicio (SSD 4.2). */
export function RevenueByServiceChart({ data }: { data: RevenueByService[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos por servicio</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <ResponsiveContainer width="100%" height={220} className="max-w-[240px]">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="amount"
                  nameKey="serviceName"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="w-full space-y-2 text-sm">
              {data.map((d, i) => (
                <li key={d.serviceName} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                    />
                    {d.serviceName}
                  </span>
                  <span className="font-medium">{formatCurrency(d.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <EmptyState title="Sin datos de servicios" />
        )}
      </CardContent>
    </Card>
  );
}
