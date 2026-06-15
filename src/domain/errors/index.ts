/** Error base de dominio. Permite distinguir errores de negocio de fallos técnicos. */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}

/** Se intentó una operación no permitida para el rol actual (SSD 10 - Permisos). */
export class PermissionError extends DomainError {
  constructor(message = "No tienes permiso para realizar esta acción.") {
    super(message);
    this.name = "PermissionError";
  }
}

/** Conflicto de horario: el especialista ya tiene una cita superpuesta (SSD 10 - Citas). */
export class ScheduleConflictError extends DomainError {
  constructor(message = "El especialista ya tiene una cita en ese horario.") {
    super(message);
    this.name = "ScheduleConflictError";
  }
}

/** Una regla de negocio impidió completar la operación. */
export class BusinessRuleError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = "BusinessRuleError";
  }
}

/** No se encontró una entidad esperada. */
export class NotFoundError extends DomainError {
  constructor(message = "No se encontró el registro solicitado.") {
    super(message);
    this.name = "NotFoundError";
  }
}
