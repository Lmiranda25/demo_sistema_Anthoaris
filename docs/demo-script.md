# Guion de demostración — Anthoaris

Recorrido sugerido para presentar la demo en ~10 minutos. Sigue las cuatro
escenas del SSD (sección 17) y muestra el flujo completo de una sesión.

> Antes de empezar: si quieres partir de datos limpios, entra como
> **Súper Administrador → Configuración → Reiniciar demo**.

---

## Escena 1 — Dueño (visión ejecutiva)

1. En la pantalla de acceso, selecciona **Carmen Salazar (Súper Administrador)**.
2. Se abre el **Dashboard consolidado**: ingresos del periodo, pacientes nuevos,
   sesiones realizadas, citas, ausentismo y paquetes por agotarse.
3. En la barra superior, cambia el selector de sede de **Consolidado** a
   **Sede Miraflores**. Observa cómo los KPIs y gráficos se recalculan.
4. Abre **Reportes** para ver el comparativo de ingresos y ausentismo por sede.
5. En el dashboard, revisa la tabla **Rendimiento de especialistas**.

> Punto a destacar: el dueño ve finanzas y clínica (solo lectura); la
> navegación incluye Reportes y Configuración.

---

## Escena 2 — Recepción (operación diaria)

1. Cierra sesión (menú de usuario → **Cambiar de perfil**) y entra como
   **Rosa Medina (Recepcionista Sede 1)**.
2. Nota que el selector de sede queda **fijo en Sede Miraflores** y que ya no
   aparecen Reportes ni Configuración.
3. Ve a **Pacientes → Nuevo paciente**. Completa los datos del paciente y de su
   apoderado (ambos son obligatorios) y guarda.
4. Ve a **Agenda → Nueva cita**. Elige el paciente recién creado; se asigna a su
   especialista. Intenta una hora ya ocupada para ver la **alerta de conflicto
   de horario**, luego elige una hora libre y crea la cita.
5. Ve a **Paquetes → Nuevo paquete**, registra un paquete para el paciente.
6. En la lista de paquetes, observa los que están en **advertencia** (queda 1)
   o **renovación requerida** (0) y usa **Renovar** en uno de ellos.

> Punto a destacar: recepción gestiona pacientes, citas, paquetes y pagos, pero
> no ve reportes globales ni el contenido clínico.

---

## Escena 3 — Especialista (valor clínico)

1. Cambia de perfil y entra como **Lucía Fernández (Especialista)**.
2. La navegación cambia: **Hoy** y **Mis pacientes**.
3. En **Hoy**, abre una cita del día con el botón **Abrir**.
4. Pulsa **Marcar atendida**. Aparece un aviso de que **se descontó una sesión**
   del paquete (el panel de paquete a la derecha se actualiza).
5. Registra la **evolución clínica**: objetivo, observaciones y nivel de
   progreso. Guarda.
6. Vuelve a marcar la misma cita como atendida: la sesión **no se descuenta de
   nuevo** (no hay doble descuento).

> Punto a destacar: el especialista solo ve sus pacientes y su agenda, nunca
> información financiera.

---

## Escena 4 — Resultado (cierre del ciclo)

1. Vuelve al perfil de **Carmen Salazar (Súper Administrador)**.
2. En el **Dashboard**, observa que el KPI de **sesiones realizadas** subió.
3. Abre la ficha del paciente atendido (**Pacientes → seleccionar paciente**) y
   revisa:
   - la pestaña **Citas** con la cita ahora **Atendida**,
   - la pestaña **Paquetes** con **una sesión menos**,
   - la pestaña **Evolución** con la evolución registrada (visible completa para
     el dueño).

---

## Datos de acceso (sin contraseña)

| Perfil | Rol |
|---|---|
| Carmen Salazar | Súper Administrador |
| Rosa Medina | Recepcionista Sede 1 |
| Pedro Quispe | Recepcionista Sede 2 |
| Lucía Fernández | Especialista |
