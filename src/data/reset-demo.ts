import { db } from "@/data/database";
import { seedDatabase } from "@/data/seed";

/**
 * Reinicia la demo (SSD 12): elimina la base local por completo, la vuelve a
 * abrir vacía y carga de nuevo los datos semilla.
 */
export async function resetDemo(): Promise<void> {
  await db.delete();
  await db.open();
  await seedDatabase();
}

/**
 * Inicializa la base al arrancar la aplicación (SSD 12):
 *   ¿Existe la base local?
 *     Sí -> usar datos existentes
 *     No -> cargar datos semilla
 *
 * Comprobamos la existencia mirando si hay sedes (la entidad ancla del seed).
 */
export async function initDatabase(): Promise<void> {
  if (!db.isOpen()) {
    await db.open();
  }
  const branchCount = await db.branches.count();
  if (branchCount === 0) {
    await seedDatabase();
  }
}
