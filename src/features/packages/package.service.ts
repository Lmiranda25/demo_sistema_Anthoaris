import { repositories } from "@/data/repositories";
import type { Payment, SessionPackage } from "@/domain/entities";
import { newId } from "@/lib/identifiers";

export interface CreatePackageInput {
  patientId: string;
  serviceId: string;
  branchId: string;
  totalSessions: number;
  price: number;
}

/** Registra un nuevo paquete de sesiones y su pago inicial (SSD 4.7). */
export async function createPackage(input: CreatePackageInput): Promise<SessionPackage> {
  const now = new Date().toISOString();
  const pkg: SessionPackage = {
    id: newId("pk"),
    patientId: input.patientId,
    serviceId: input.serviceId,
    branchId: input.branchId,
    totalSessions: input.totalSessions,
    usedSessions: 0,
    price: input.price,
    purchasedAt: now,
    status: "active",
  };
  await repositories.packages.create(pkg);

  await registerPayment({
    packageId: pkg.id,
    patientId: pkg.patientId,
    branchId: pkg.branchId,
    amount: pkg.price,
    concept: "Compra de paquete",
  });

  return pkg;
}

export interface RenewPackageInput {
  packageId: string;
  additionalSessions: number;
  price: number;
}

/**
 * Renovación ficticia de un paquete (SSD 4.7 - "La recepcionista puede
 * registrar una renovación ficticia"). Suma sesiones al total, reactiva el
 * paquete y registra el pago.
 */
export async function renewPackage(input: RenewPackageInput): Promise<void> {
  const pkg = await repositories.packages.getById(input.packageId);
  if (!pkg) return;

  await repositories.packages.update(pkg.id, {
    totalSessions: pkg.totalSessions + input.additionalSessions,
    status: "active",
  });

  await registerPayment({
    packageId: pkg.id,
    patientId: pkg.patientId,
    branchId: pkg.branchId,
    amount: input.price,
    concept: "Renovación de paquete",
  });
}

interface RegisterPaymentInput {
  packageId: string;
  patientId: string;
  branchId: string;
  amount: number;
  concept: string;
}

async function registerPayment(input: RegisterPaymentInput): Promise<void> {
  const payment: Payment = {
    id: newId("py"),
    packageId: input.packageId,
    patientId: input.patientId,
    branchId: input.branchId,
    amount: input.amount,
    paidAt: new Date().toISOString(),
    concept: input.concept,
  };
  await repositories.payments.create(payment);
}
