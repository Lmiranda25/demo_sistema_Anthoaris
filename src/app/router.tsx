import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/app-shell";
import {
  RequireAuth,
  RequireCapability,
  RequireRoleArea,
} from "@/app/route-guards";

// Auth
import { LoginPage } from "@/features/auth/pages/login-page";

// Área administrativa
import { DashboardPage } from "@/features/dashboard/pages/dashboard-page";
import { PatientsPage } from "@/features/patients/pages/patients-page";
import { PatientDetailPage } from "@/features/patients/pages/patient-detail-page";
import { SpecialistsPage } from "@/features/specialists/pages/specialists-page";
import { AppointmentsPage } from "@/features/appointments/pages/appointments-page";
import { PackagesPage } from "@/features/packages/pages/packages-page";
import { ReportsPage } from "@/features/reports/pages/reports-page";
import { SettingsPage } from "@/features/settings/pages/settings-page";

// Área de especialista
import { SpecialistTodayPage } from "@/features/specialist-portal/pages/today-page";
import { SpecialistPatientsPage } from "@/features/specialist-portal/pages/my-patients-page";
import { SessionPage } from "@/features/specialist-portal/pages/session-page";

/** Mapa de rutas completo (SSD 8). */
export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Área administrativa: dueño y recepcionista */}
      <Route
        path="/app"
        element={
          <RequireAuth>
            <RequireRoleArea area="app">
              <AppShell variant="app" />
            </RequireRoleArea>
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <RequireCapability capability="view:dashboard">
              <DashboardPage />
            </RequireCapability>
          }
        />
        <Route
          path="patients"
          element={
            <RequireCapability capability="manage:patients">
              <PatientsPage />
            </RequireCapability>
          }
        />
        <Route
          path="patients/:patientId"
          element={
            <RequireCapability capability="manage:patients">
              <PatientDetailPage />
            </RequireCapability>
          }
        />
        <Route
          path="specialists"
          element={
            <RequireCapability capability="manage:specialists">
              <SpecialistsPage />
            </RequireCapability>
          }
        />
        <Route
          path="appointments"
          element={
            <RequireCapability capability="manage:appointments">
              <AppointmentsPage />
            </RequireCapability>
          }
        />
        <Route
          path="packages"
          element={
            <RequireCapability capability="manage:packages">
              <PackagesPage />
            </RequireCapability>
          }
        />
        <Route
          path="reports"
          element={
            <RequireCapability capability="view:reports">
              <ReportsPage />
            </RequireCapability>
          }
        />
        <Route
          path="settings"
          element={
            <RequireCapability capability="view:settings">
              <SettingsPage />
            </RequireCapability>
          }
        />
      </Route>

      {/* Área de especialista */}
      <Route
        path="/specialist"
        element={
          <RequireAuth>
            <RequireRoleArea area="specialist">
              <AppShell variant="specialist" />
            </RequireRoleArea>
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="today" replace />} />
        <Route path="today" element={<SpecialistTodayPage />} />
        <Route path="patients" element={<SpecialistPatientsPage />} />
        <Route path="session/:appointmentId" element={<SessionPage />} />
      </Route>

      {/* Cualquier otra ruta */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
