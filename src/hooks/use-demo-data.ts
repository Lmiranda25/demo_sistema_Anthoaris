import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/data/database";

/**
 * Hooks reactivos sobre la base local. Usan `useLiveQuery` de Dexie para que la
 * UI se actualice automáticamente tras cualquier operación (SSD 18 - "el
 * dashboard se actualiza después de operaciones relevantes").
 *
 * NOTA: estos hooks leen directamente las tablas para lecturas reactivas de la
 * demo. Las ESCRITURAS siempre pasan por servicios/repositorios (SSD 6.2).
 *
 * Mientras la consulta no ha resuelto, `useLiveQuery` devuelve `undefined`; los
 * componentes usan eso como señal de "cargando".
 */

export function usePatients() {
  return useLiveQuery(() => db.patients.toArray(), []);
}

/**
 * Carga un paciente por id distinguiendo tres estados:
 *  - undefined  -> aún cargando
 *  - null       -> no existe
 *  - Patient    -> encontrado
 */
export function usePatient(id: string | undefined) {
  return useLiveQuery(async () => {
    if (!id) return null;
    return (await db.patients.get(id)) ?? null;
  }, [id]);
}

export function useGuardians() {
  return useLiveQuery(() => db.guardians.toArray(), []);
}

export function useSpecialists() {
  return useLiveQuery(() => db.specialists.toArray(), []);
}

export function useSpecialties() {
  return useLiveQuery(() => db.specialties.toArray(), []);
}

export function useBranches() {
  return useLiveQuery(() => db.branches.toArray(), []);
}

export function useServices() {
  return useLiveQuery(() => db.services.toArray(), []);
}

export function useAppointments() {
  return useLiveQuery(() => db.appointments.toArray(), []);
}

export function usePackages() {
  return useLiveQuery(() => db.packages.toArray(), []);
}

export function usePayments() {
  return useLiveQuery(() => db.payments.toArray(), []);
}

export function useClinicalProgressList() {
  return useLiveQuery(() => db.clinicalProgress.toArray(), []);
}

export function useUsers() {
  return useLiveQuery(() => db.users.toArray(), []);
}
