import { db, SCHEMA_VERSION } from "@/data/database";
import type {
  Appointment,
  Branch,
  ClinicalProgress,
  Guardian,
  Patient,
  Payment,
  Service,
  SessionPackage,
  Specialist,
  Specialty,
  User,
} from "@/domain/entities";
import type { AppointmentStatus, ProgressLevel } from "@/domain/enums";

/*
  Datos semilla DETERMINISTAS de la demo (SSD 12).
  Todo es ficticio (SSD 13). Las fechas se calculan relativas a "ahora" para que
  el dashboard y la agenda siempre tengan datos recientes que mostrar.

  IDs estables (no aleatorios) para que las relaciones sean legibles y las
  pruebas reproducibles.
*/

// ---------- Helpers de fecha ----------
const MS_DAY = 24 * 60 * 60 * 1000;

function isoAt(daysFromNow: number, hour: number, minute = 0): string {
  const base = new Date();
  base.setHours(hour, minute, 0, 0);
  return new Date(base.getTime() + daysFromNow * MS_DAY).toISOString();
}

function birthDate(yearsAgo: number, month: number, day: number): string {
  const now = new Date();
  const d = new Date(now.getFullYear() - yearsAgo, month - 1, day);
  return d.toISOString().slice(0, 10);
}

/**
 * Fecha a N meses atrás. Con months = 0 cae en el mes ACTUAL; en ese caso el
 * día se limita a hoy o antes, para que represente "este mes hasta la fecha" y
 * los KPIs de "Este mes" muestren datos reales (no fechas futuras).
 */
function monthsAgoIso(months: number, day = 10): string {
  const now = new Date();
  let targetDay = day;
  if (months === 0) {
    // No generar fechas futuras dentro del mes en curso.
    targetDay = Math.min(day, now.getDate());
  }
  const d = new Date(now.getFullYear(), now.getMonth() - months, targetDay, 11, 0, 0, 0);
  return d.toISOString();
}

// ---------- Sedes ----------
const branches: Branch[] = [
  {
    id: "branch_1",
    name: "Sede San Martín de Porres (SMP)",
    address: "San Martín de Porres, Lima",
    phone: "01 555 1010",
    color: "#1D9E75", // teal de marca
  },
  {
    id: "branch_2",
    name: "Sede Comas",
    address: "Comas, Lima",
    phone: "01 555 2020",
    color: "#D85A30", // coral de marca
  },
];

// ---------- Especialidades ----------
const specialties: Specialty[] = [
  { id: "spec_lang", name: "Terapia de Lenguaje" },
  { id: "spec_occ", name: "Terapia Ocupacional" },
  { id: "spec_psy", name: "Psicología Infantil" },
  { id: "spec_phys", name: "Terapia Física" },
];

// ---------- Servicios ----------
const services: Service[] = [
  { id: "srv_lang", name: "Sesión de Lenguaje", defaultSessionPrice: 90 },
  { id: "srv_occ", name: "Sesión Ocupacional", defaultSessionPrice: 100 },
  { id: "srv_psy", name: "Sesión Psicológica", defaultSessionPrice: 120 },
  { id: "srv_phys", name: "Sesión Física", defaultSessionPrice: 85 },
];

// ---------- Especialistas ----------
const specialists: Specialist[] = [
  {
    id: "sp_1",
    firstName: "Lucía",
    lastName: "Fernández",
    specialtyId: "spec_lang",
    branchIds: ["branch_1"],
    schedule: "Lun a Vie, 09:00 - 14:00",
    status: "active",
    email: "lucia.fernandez@anthoaris.demo",
  },
  {
    id: "sp_2",
    firstName: "Diego",
    lastName: "Ramírez",
    specialtyId: "spec_occ",
    branchIds: ["branch_1", "branch_2"],
    schedule: "Lun a Sáb, 10:00 - 16:00",
    status: "active",
    email: "diego.ramirez@anthoaris.demo",
  },
  {
    id: "sp_3",
    firstName: "Valentina",
    lastName: "Castro",
    specialtyId: "spec_psy",
    branchIds: ["branch_2"],
    schedule: "Mar a Vie, 11:00 - 17:00",
    status: "active",
    email: "valentina.castro@anthoaris.demo",
  },
  {
    id: "sp_4",
    firstName: "Mateo",
    lastName: "Vargas",
    specialtyId: "spec_phys",
    branchIds: ["branch_1", "branch_2"],
    schedule: "Lun a Vie, 08:00 - 13:00",
    status: "active",
    email: "mateo.vargas@anthoaris.demo",
  },
];

// ---------- Usuarios (login simulado, SSD 4.1) ----------
const users: User[] = [
  {
    id: "user_owner",
    fullName: "Carmen Salazar",
    role: "owner",
    email: "carmen.salazar@anthoaris.demo",
  },
  {
    id: "user_recep_1",
    fullName: "Rosa Medina",
    role: "receptionist",
    branchId: "branch_1",
    email: "rosa.medina@anthoaris.demo",
  },
  {
    id: "user_recep_2",
    fullName: "Pedro Quispe",
    role: "receptionist",
    branchId: "branch_2",
    email: "pedro.quispe@anthoaris.demo",
  },
  {
    id: "user_spec",
    fullName: "Lucía Fernández",
    role: "specialist",
    branchId: "branch_1",
    specialistId: "sp_1",
    email: "lucia.fernandez@anthoaris.demo",
  },
];

// ---------- Apoderados (12) ----------
const guardianSeed: Array<[string, string, string]> = [
  ["María", "Torres", "Madre"],
  ["Jorge", "Mendoza", "Padre"],
  ["Ana", "Ríos", "Madre"],
  ["Luis", "Cárdenas", "Padre"],
  ["Patricia", "Núñez", "Madre"],
  ["Roberto", "Flores", "Padre"],
  ["Sofía", "Paredes", "Madre"],
  ["Carlos", "Aguilar", "Padre"],
  ["Elena", "Vega", "Madre"],
  ["Andrés", "Rojas", "Padre"],
  ["Gabriela", "Soto", "Madre"],
  ["Fernando", "Díaz", "Abuelo"],
];

const guardians: Guardian[] = guardianSeed.map(([firstName, lastName, relationship], i) => ({
  id: `gd_${i + 1}`,
  firstName,
  lastName,
  relationship,
  phone: `9${(8000000 + i * 13457).toString().slice(0, 8)}`,
  email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@correo.demo`,
  createdAt: monthsAgoIso(6 - (i % 6)),
}));

// ---------- Pacientes (12) ----------
interface PatientSeed {
  firstName: string;
  lastName: string;
  years: number;
  month: number;
  day: number;
  branchId: string;
  specialistId: string;
  reason: string;
}

const patientSeed: PatientSeed[] = [
  { firstName: "Tomás", lastName: "Torres", years: 6, month: 3, day: 12, branchId: "branch_1", specialistId: "sp_1", reason: "Retraso en el lenguaje expresivo" },
  { firstName: "Isabela", lastName: "Mendoza", years: 5, month: 7, day: 4, branchId: "branch_1", specialistId: "sp_1", reason: "Dificultad de articulación" },
  { firstName: "Joaquín", lastName: "Ríos", years: 8, month: 1, day: 22, branchId: "branch_1", specialistId: "sp_2", reason: "Integración sensorial" },
  { firstName: "Camila", lastName: "Cárdenas", years: 7, month: 11, day: 9, branchId: "branch_1", specialistId: "sp_2", reason: "Motricidad fina" },
  { firstName: "Benjamín", lastName: "Núñez", years: 4, month: 5, day: 30, branchId: "branch_1", specialistId: "sp_4", reason: "Fortalecimiento postural" },
  { firstName: "Antonella", lastName: "Flores", years: 9, month: 9, day: 15, branchId: "branch_1", specialistId: "sp_4", reason: "Rehabilitación de marcha" },
  { firstName: "Santiago", lastName: "Paredes", years: 6, month: 2, day: 18, branchId: "branch_2", specialistId: "sp_3", reason: "Manejo de ansiedad" },
  { firstName: "Emilia", lastName: "Aguilar", years: 7, month: 6, day: 7, branchId: "branch_2", specialistId: "sp_3", reason: "Habilidades sociales" },
  { firstName: "Mathías", lastName: "Vega", years: 5, month: 12, day: 1, branchId: "branch_2", specialistId: "sp_2", reason: "Autonomía en rutinas" },
  { firstName: "Valeria", lastName: "Rojas", years: 8, month: 4, day: 25, branchId: "branch_2", specialistId: "sp_2", reason: "Coordinación bilateral" },
  { firstName: "Sebastián", lastName: "Soto", years: 6, month: 8, day: 14, branchId: "branch_2", specialistId: "sp_4", reason: "Equilibrio y tono muscular" },
  { firstName: "Renata", lastName: "Díaz", years: 4, month: 10, day: 3, branchId: "branch_2", specialistId: "sp_3", reason: "Regulación emocional" },
];

const patients: Patient[] = patientSeed.map((p, i) => ({
  id: `pt_${i + 1}`,
  branchId: p.branchId,
  guardianId: `gd_${i + 1}`,
  assignedSpecialistId: p.specialistId,
  firstName: p.firstName,
  lastName: p.lastName,
  birthDate: birthDate(p.years, p.month, p.day),
  initialReason: p.reason,
  status: i === 11 ? "inactive" : "active", // un paciente archivado de ejemplo
  // i % 5 reparte entre el mes actual (0) y los 4 anteriores, de modo que el
  // KPI "Pacientes nuevos" de "Este mes" tenga datos.
  createdAt: monthsAgoIso(i % 5, 5 + (i % 20)),
}));

// ---------- Paquetes (12, uno por paciente) ----------
// Variamos el consumo para mostrar estados: normal, advertencia (1) y crítico (0).
function serviceForSpecialist(specialistId: string): Service {
  const spec = specialists.find((s) => s.id === specialistId)!;
  const map: Record<string, string> = {
    spec_lang: "srv_lang",
    spec_occ: "srv_occ",
    spec_psy: "srv_psy",
    spec_phys: "srv_phys",
  };
  const serviceId = map[spec.specialtyId];
  return services.find((s) => s.id === serviceId)!;
}

const usedByIndex = [3, 7, 9, 2, 5, 11, 1, 12, 0, 8, 4, 6]; // varía consumo
const totalByIndex = [12, 8, 10, 12, 8, 12, 8, 12, 10, 10, 8, 8];

const packages: SessionPackage[] = patients.map((pt, i) => {
  const service = serviceForSpecialist(pt.assignedSpecialistId!);
  const total = totalByIndex[i];
  const used = Math.min(usedByIndex[i], total);
  const remaining = total - used;
  return {
    id: `pk_${i + 1}`,
    patientId: pt.id,
    serviceId: service.id,
    branchId: pt.branchId,
    totalSessions: total,
    usedSessions: used,
    price: service.defaultSessionPrice * total,
    // i % 4 reparte la compra entre el mes actual (0) y los 3 anteriores, para
    // que el KPI de ingresos de "Este mes" no salga en cero.
    purchasedAt: monthsAgoIso(i % 4, 8 + (i % 15)),
    status: remaining === 0 ? "completed" : "active",
  };
});

// ---------- Pagos (ingresos de últimos meses, SSD 12) ----------
const payments: Payment[] = [];
packages.forEach((pkg, i) => {
  const pt = patients[i];
  // Pago inicial del paquete
  payments.push({
    id: `py_${i + 1}_a`,
    packageId: pkg.id,
    patientId: pt.id,
    branchId: pkg.branchId,
    amount: pkg.price,
    paidAt: pkg.purchasedAt,
    concept: "Compra de paquete",
  });
  // Algunas renovaciones repartidas en meses anteriores para poblar el dashboard
  if (i % 3 === 0) {
    payments.push({
      id: `py_${i + 1}_b`,
      packageId: pkg.id,
      patientId: pt.id,
      branchId: pkg.branchId,
      amount: Math.round(pkg.price * 0.5),
      paidAt: monthsAgoIso((i % 3) + 1, 20),
      concept: "Renovación parcial",
    });
  }
});

// ---------- Citas (30) ----------
// Mezcla de pasadas (atendidas/canceladas/no_show) y futuras (programadas/confirmadas).
interface ApptSeed {
  patientIdx: number;
  dayOffset: number;
  hour: number;
  status: AppointmentStatus;
}

const apptSeed: ApptSeed[] = [
  // --- Pasadas (atendidas) — generan consumo y evolución ---
  { patientIdx: 0, dayOffset: -14, hour: 9, status: "attended" },
  { patientIdx: 0, dayOffset: -7, hour: 9, status: "attended" },
  { patientIdx: 1, dayOffset: -10, hour: 10, status: "attended" },
  { patientIdx: 2, dayOffset: -12, hour: 11, status: "attended" },
  { patientIdx: 3, dayOffset: -9, hour: 12, status: "attended" },
  { patientIdx: 4, dayOffset: -8, hour: 8, status: "attended" },
  { patientIdx: 6, dayOffset: -11, hour: 11, status: "attended" },
  { patientIdx: 7, dayOffset: -6, hour: 12, status: "attended" },
  { patientIdx: 8, dayOffset: -13, hour: 10, status: "attended" },
  { patientIdx: 10, dayOffset: -5, hour: 9, status: "attended" },
  // --- Pasadas (canceladas / no_show) — alimentan ausentismo ---
  { patientIdx: 1, dayOffset: -4, hour: 11, status: "cancelled" },
  { patientIdx: 3, dayOffset: -3, hour: 13, status: "no_show" },
  { patientIdx: 5, dayOffset: -6, hour: 9, status: "no_show" },
  { patientIdx: 9, dayOffset: -2, hour: 12, status: "cancelled" },
  { patientIdx: 7, dayOffset: -3, hour: 13, status: "no_show" },
  // --- Hoy ---
  { patientIdx: 0, dayOffset: 0, hour: 9, status: "confirmed" },
  { patientIdx: 1, dayOffset: 0, hour: 10, status: "scheduled" },
  { patientIdx: 4, dayOffset: 0, hour: 8, status: "confirmed" },
  { patientIdx: 6, dayOffset: 0, hour: 11, status: "scheduled" },
  { patientIdx: 7, dayOffset: 0, hour: 12, status: "confirmed" },
  // --- Futuras ---
  { patientIdx: 2, dayOffset: 1, hour: 11, status: "scheduled" },
  { patientIdx: 3, dayOffset: 1, hour: 12, status: "scheduled" },
  { patientIdx: 5, dayOffset: 2, hour: 9, status: "scheduled" },
  { patientIdx: 8, dayOffset: 2, hour: 10, status: "confirmed" },
  { patientIdx: 9, dayOffset: 3, hour: 12, status: "scheduled" },
  { patientIdx: 10, dayOffset: 3, hour: 9, status: "scheduled" },
  { patientIdx: 0, dayOffset: 4, hour: 9, status: "scheduled" },
  { patientIdx: 6, dayOffset: 4, hour: 11, status: "scheduled" },
  { patientIdx: 4, dayOffset: 5, hour: 8, status: "scheduled" },
  { patientIdx: 2, dayOffset: 6, hour: 11, status: "confirmed" },
];

const appointments: Appointment[] = apptSeed.map((a, i) => {
  const pt = patients[a.patientIdx];
  const pkg = packages[a.patientIdx];
  const consumed = a.status === "attended"; // las atendidas ya consumieron sesión
  return {
    id: `ap_${i + 1}`,
    branchId: pt.branchId,
    patientId: pt.id,
    specialistId: pt.assignedSpecialistId!,
    packageId: pkg.id,
    startsAt: isoAt(a.dayOffset, a.hour),
    endsAt: isoAt(a.dayOffset, a.hour, 45),
    status: a.status,
    sessionConsumed: consumed,
    notes: undefined,
  };
});

// ---------- Evoluciones clínicas (10, una por cita atendida) ----------
const attendedAppointments = appointments.filter((a) => a.status === "attended");

const progressTemplates: Array<{ objective: string; observations: string; level: ProgressLevel }> = [
  {
    objective: "Aumentar vocabulario expresivo",
    observations: "El paciente incorporó nuevas palabras y mostró buena disposición.",
    level: "in_progress",
  },
  {
    objective: "Mejorar articulación de fonemas",
    observations: "Logró pronunciar correctamente los fonemas trabajados en sesión.",
    level: "achieved",
  },
  {
    objective: "Tolerancia a estímulos sensoriales",
    observations: "Se observa avance, aunque requiere continuar el refuerzo en casa.",
    level: "needs_reinforcement",
  },
  {
    objective: "Coordinación motriz fina",
    observations: "Buen desempeño en actividades de pinza y trazos.",
    level: "in_progress",
  },
  {
    objective: "Fortalecimiento postural",
    observations: "Mantiene la postura por más tiempo; objetivo en progreso.",
    level: "in_progress",
  },
];

const clinicalProgress: ClinicalProgress[] = attendedAppointments.map((appt, i) => {
  const tpl = progressTemplates[i % progressTemplates.length];
  return {
    id: `cp_${i + 1}`,
    appointmentId: appt.id,
    patientId: appt.patientId,
    specialistId: appt.specialistId,
    date: appt.startsAt,
    objective: tpl.objective,
    observations: tpl.observations,
    level: tpl.level,
    createdAt: appt.endsAt,
  };
});

/**
 * Inserta todos los datos semilla dentro de una transacción.
 * Asume que la base está vacía (la verificación se hace en el inicializador).
 */
export async function seedDatabase(): Promise<void> {
  await db.transaction(
    "rw",
    [
      db.branches,
      db.users,
      db.guardians,
      db.patients,
      db.specialties,
      db.specialists,
      db.services,
      db.appointments,
      db.clinicalProgress,
      db.packages,
      db.payments,
      db.settings,
    ],
    async () => {
      await db.branches.bulkAdd(branches);
      await db.users.bulkAdd(users);
      await db.guardians.bulkAdd(guardians);
      await db.patients.bulkAdd(patients);
      await db.specialties.bulkAdd(specialties);
      await db.specialists.bulkAdd(specialists);
      await db.services.bulkAdd(services);
      await db.appointments.bulkAdd(appointments);
      await db.clinicalProgress.bulkAdd(clinicalProgress);
      await db.packages.bulkAdd(packages);
      await db.payments.bulkAdd(payments);
      await db.settings.put({
        id: "singleton",
        seededAt: new Date().toISOString(),
        schemaVersion: SCHEMA_VERSION,
      });
    },
  );
}

/** Exportado para pruebas y para mostrar conteos en la pantalla de configuración. */
export const seedCounts = {
  branches: branches.length,
  users: users.length,
  guardians: guardians.length,
  patients: patients.length,
  specialists: specialists.length,
  appointments: appointments.length,
  clinicalProgress: clinicalProgress.length,
  packages: packages.length,
  payments: payments.length,
};
