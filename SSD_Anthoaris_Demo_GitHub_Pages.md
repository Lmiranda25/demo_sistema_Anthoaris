# SSD — Demo del Sistema de Gestión Multi-Sede Anthoaris

**Documento:** Software/System Design Document  
**Proyecto:** Sistema de Gestión Multi-Sede – Centro de Terapias Integrales Anthoaris  
**Tipo de entrega:** Demo frontend desplegable manualmente en GitHub Pages  
**Versión:** 2.0  
**Estado:** Implementada y desplegada  
**Repositorio:** https://github.com/Lmiranda25/demo_sistema_Anthoaris  
**Demo en vivo:** https://lmiranda25.github.io/demo_sistema_Anthoaris/  

---

## 1. Propósito del documento

Este documento define la arquitectura, alcance, experiencia de usuario, estructura del repositorio y estrategia de despliegue para construir una demo navegable del Sistema de Gestión Multi-Sede Anthoaris.

La demo permitirá presentar el funcionamiento esperado del sistema mediante información ficticia y persistencia local en el navegador. No será todavía un sistema clínico ni financiero listo para producción.

> **Estado de implementación (v2.0):** la demo está construida, probada y
> desplegada. Este documento se actualizó para reflejar las decisiones tomadas
> durante la implementación (sedes reales, especialidades reales, identidad de
> marca y filtro de fechas por calendario). Ver el registro de cambios en la
> sección 23.

---

## 2. Objetivo del producto

Permitir que el dueño del centro controle la operación de sus dos sedes, los ingresos, los pacientes, los especialistas, las sesiones y el progreso terapéutico desde una interfaz centralizada, responsiva y fácil de usar.

### Objetivos de la demo

- Representar dos sedes independientes y una vista consolidada.
- Simular el inicio de sesión de distintos roles.
- Mostrar un dashboard ejecutivo con indicadores.
- Registrar y consultar pacientes y apoderados ficticios.
- Administrar especialistas y su carga de pacientes.
- Mostrar una agenda de citas.
- Registrar una evolución clínica por sesión.
- Simular paquetes de sesiones, asistencias y alertas de renovación.
- Mantener los datos creados durante la demostración en el mismo navegador.
- Poder restablecer todos los datos mediante un botón “Reiniciar demo”.

---

## 3. Alcance funcional

### 3.1 Roles

#### Súper Administrador

- Acceso a las dos sedes.
- Vista consolidada o filtrada por sede.
- Acceso a pacientes, especialistas, agenda e indicadores financieros.
- Consulta del rendimiento del personal.
- Consulta del ausentismo.
- Acceso a configuraciones de la demo.

#### Recepcionista

- Acceso únicamente a la sede asignada.
- Registro y edición de pacientes y apoderados.
- Registro y gestión de citas.
- Registro de ventas y pagos ficticios.
- Consulta de sesiones disponibles.
- Visualización de alertas de renovación.
- Sin acceso al contenido clínico detallado.
- Sin acceso a reportes financieros globales.

#### Especialista

- Acceso a su agenda.
- Acceso únicamente a los pacientes asignados.
- Registro de asistencia.
- Registro de evolución clínica.
- Sin acceso a ingresos, pagos ni reportes financieros.

---

## 4. Módulos de la demo

### 4.1 Autenticación simulada

La demo tendrá una pantalla de acceso con usuarios predefinidos (nombres
ficticios):

- Dueño / Súper Administrador: **Carmen Salazar**.
- Recepcionista Sede San Martín de Porres (SMP): **Rosa Medina**.
- Recepcionista Sede Comas: **Pedro Quispe**.
- Especialista: **Lucía Fernández** (Terapia de Lenguaje).

No se usarán contraseñas reales. La selección de un perfil creará una sesión local ficticia.

### 4.2 Dashboard multi-sede

Indicadores principales:

- Ingresos del mes.
- Ingresos por tipo de servicio.
- Pacientes nuevos del mes.
- Sesiones realizadas.
- Citas programadas.
- Citas canceladas.
- Citas con inasistencia.
- Porcentaje de ausentismo.
- Paquetes próximos a agotarse.
- Rendimiento de especialistas.

Filtros:

- Consolidado.
- Sede San Martín de Porres (SMP).
- Sede Comas.
- **Rango de fechas mediante calendario** (selector "Desde – Hasta") con atajos
  rápidos: Hoy, Este mes, Mes anterior y Últimos 3 meses. Reemplaza al antiguo
  dropdown de periodo fijo. Aplica también en Reportes.

### 4.3 Pacientes y apoderados

Información del paciente:

- Nombres.
- Apellidos.
- Fecha de nacimiento.
- Edad calculada.
- Sede principal.
- Motivo de consulta o diagnóstico inicial.
- Estado.
- Especialista asignado.
- Paquete activo.
- Sesiones disponibles.

Información del apoderado:

- Nombres y apellidos.
- Parentesco.
- Teléfono.
- Correo.

Funciones:

- Crear paciente.
- Editar paciente.
- Buscar y filtrar.
- Consultar perfil.
- Consultar resumen de citas, paquetes y evolución.
- Archivar registro dentro de la demo.

### 4.4 Especialistas

Las especialidades corresponden a los servicios reales de Anthoaris, cada una
con un color de marca asignado (guía de branding):

- Terapia de Atención (azul `#378ADD`).
- Terapia de Lenguaje (teal `#1D9E75`).
- Terapia de Aprendizaje (ámbar `#EF9F27`).
- Terapia de Conducta (lavanda `#7F77DD`).
- Terapia Emocional (coral `#D85A30`).
- Guardería (verde `#639922`).

Información:

- Nombre.
- Especialidad (con su color de marca).
- Sede o sedes asignadas.
- Horarios.
- Estado.
- Pacientes activos.
- Sesiones del mes.

Funciones:

- Crear y editar especialista.
- Consultar carga de pacientes.
- Consultar agenda.
- Filtrar por sede y especialidad.

### 4.5 Agenda y citas

Estados:

- Programada.
- Confirmada.
- Atendida.
- Cancelada.
- No asistió.

Funciones:

- Crear cita.
- Reprogramar.
- Cambiar estado.
- Filtrar por fecha, sede, especialista y estado.
- Vista diaria y semanal.
- Mostrar conflictos de horario simulados.

### 4.6 Evolución clínica

Campos:

- Fecha y hora.
- Paciente.
- Especialista.
- Objetivo trabajado.
- Observaciones.
- Progreso:
  - Logrado.
  - En proceso.
  - Requiere refuerzo.

Reglas de la demo:

- Solo el especialista puede crear evoluciones.
- La recepcionista solo ve que existe una evolución, pero no el texto clínico.
- El administrador puede consultar el resumen únicamente para fines de demostración.
- La evolución quedará vinculada a una cita atendida.

### 4.7 Paquetes, ventas y sesiones

Información:

- Paciente.
- Servicio.
- Cantidad total de sesiones.
- Sesiones utilizadas.
- Sesiones restantes.
- Precio ficticio.
- Fecha de compra.
- Estado.

Automatización simulada:

- Al marcar una cita como “Atendida”, se descuenta una sesión.
- Con una sesión restante aparece una advertencia.
- Con cero sesiones aparece una alerta crítica.
- La recepcionista puede registrar una renovación ficticia.

---

## 5. Fuera del alcance de la demo

- Autenticación real.
- Recuperación de contraseña.
- Backend.
- Base de datos PostgreSQL real.
- Sincronización entre dispositivos.
- Envío real de correos o WhatsApp.
- Pagos reales.
- Facturación.
- Historias clínicas legalmente válidas.
- Firma digital.
- Auditoría legal.
- Gestión real de archivos médicos.
- Datos reales de pacientes.

---

## 6. Arquitectura técnica

### 6.1 Tipo de aplicación

Single Page Application estática construida con React y Vite.

GitHub Pages servirá únicamente los archivos generados en la carpeta `dist`. Toda la lógica de la demo se ejecutará en el navegador.

### 6.2 Capas

```text
Presentación
    ↓
Casos de uso / servicios
    ↓
Interfaces de repositorio
    ↓
Repositorio local de demo
    ↓
IndexedDB mediante Dexie
```

Los componentes visuales no deben consultar Dexie directamente. Deben utilizar servicios o repositorios para que la fuente de datos pueda reemplazarse posteriormente.

Ejemplo:

```text
PatientPage
    ↓
patientService
    ↓
PatientRepository
    ├── DemoPatientRepository → Dexie
    └── ApiPatientRepository  → futura API
```

### 6.3 Stack recomendado

| Área | Tecnología | Motivo |
|---|---|---|
| UI | React + TypeScript | Componentes reutilizables, tipado y mantenimiento |
| Build | Vite | Desarrollo rápido y salida estática para GitHub Pages |
| Estilos | Tailwind CSS | Sistema visual consistente y responsive |
| Componentes | shadcn/ui | Componentes editables y accesibles |
| Primitivas | Radix UI | Interacciones accesibles |
| Animaciones | Motion for React | Transiciones suaves y microinteracciones |
| Enrutamiento | React Router con HashRouter | Evita errores 404 en GitHub Pages |
| Estado global | Zustand | Estado pequeño y sencillo para sesión, filtros y UI |
| Formularios | React Hook Form + Zod | Formularios tipados y validación |
| Datos de demo | Dexie + IndexedDB | Persistencia estructurada en el navegador |
| Gráficos | Recharts | Indicadores y gráficos React |
| Tablas | TanStack Table | Listados, filtros, ordenamiento y paginación |
| Fechas | date-fns | Fechas, edades y agenda |
| Calendario | react-day-picker | Selector de rango de fechas para Dashboard y Reportes |
| Iconos | Lucide React | Iconografía uniforme |
| Notificaciones | Sonner | Toasts discretos |
| Deploy | gh-pages | Publicación manual de `dist` en la rama `gh-pages` |

### 6.4 Tecnología no recomendada para esta demo

No se recomienda Next.js para esta primera demo porque:

- El objetivo es generar una SPA estática.
- GitHub Pages no ejecuta servidor Node.
- Vite requiere menos configuración para este caso.
- El despliegue manual es más directo.

---

## 7. Experiencia de usuario tipo Apple

La experiencia no debe copiar visualmente productos de Apple. Debe adoptar principios similares de claridad, fluidez y reducción de carga cognitiva.

### 7.1 Principios

- Amplio espacio en blanco.
- Jerarquía tipográfica clara.
- Un objetivo principal por pantalla.
- Menús cortos y consistentes.
- Acciones importantes visibles.
- Formularios divididos en pasos cuando sean extensos.
- Confirmación inmediata de acciones.
- Estados vacíos útiles.
- Skeletons para simular carga.
- Animaciones breves y funcionales.
- Diseño táctil adecuado para tablet.
- Soporte de teclado y foco visible.
- Respeto a `prefers-reduced-motion`.

### 7.2 Fuente

Usar la pila de fuentes del sistema:

```css
font-family:
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  Inter,
  sans-serif;
```

Esto permite usar San Francisco en equipos Apple sin incluir ni distribuir archivos de fuente.

### 7.3 Tokens visuales

Radios, espaciado y transiciones:

```css
--radius-sm: 10px;
--radius-md: 14px;
--radius-lg: 20px;

--space-page-desktop: 32px;
--space-page-mobile: 16px;

--transition-fast: 140ms;
--transition-normal: 220ms;
--transition-slow: 320ms;
```

Paleta de color alineada a la **guía de marca oficial de Anthoaris** (implementada
en `src/styles/tokens.css`):

```css
/* Primario y acento */
--primary: #1D9E75;      /* Teal de marca: botones, nav activo, KPIs */
--destructive: #D85A30;  /* Coral: CTA, urgencia, acciones destructivas */
--warning: #EF9F27;      /* Ámbar: advertencias */

/* Neutros de marca */
--foreground: #2C2C2A;   /* Títulos */
--muted-foreground: #888780;
--secondary: #F1EFE8;    /* Fondos alternos */
--border: #E7E3D8;
```

Colores por especialidad (usados en badges/puntos de color): Atención `#378ADD`,
Lenguaje `#1D9E75`, Aprendizaje `#EF9F27`, Conducta `#7F77DD`, Emocional
`#D85A30`, Guardería `#639922`.

### 7.4 Composición principal

#### Escritorio

- Sidebar izquierda.
- Topbar con sede, búsqueda y usuario.
- Contenido central.
- Panel contextual o drawer para acciones secundarias.

#### Tablet

- Sidebar colapsable.
- Formularios con controles grandes.
- Agenda y ficha clínica optimizadas para interacción táctil.

#### Móvil

- Navegación inferior para especialistas.
- Menú lateral para administrador y recepción.
- Tarjetas en lugar de tablas demasiado anchas.
- Acciones fijas en la parte inferior cuando corresponda.

---

## 8. Mapa de navegación

```text
/
└── login

/app
├── dashboard
├── patients
│   ├── new
│   └── :patientId
│       ├── summary
│       ├── appointments
│       ├── packages
│       └── progress
├── specialists
│   ├── new
│   └── :specialistId
├── appointments
├── packages
├── reports
└── settings

/specialist
├── today
├── patients
└── session/:appointmentId
```

Con `HashRouter`, las direcciones publicadas tendrán una forma similar a:

```text
https://lmiranda25.github.io/demo_sistema_Anthoaris/#/app/dashboard
```

---

## 9. Modelo de datos conceptual

### 9.1 Entidades

```text
Branch
User
Role
Guardian
Patient
Specialist
Specialty
Appointment
ClinicalProgress
Service
SessionPackage
Payment
DemoSettings
```

### 9.2 Relaciones

```text
Branch 1 ─── N Patient
Branch 1 ─── N Appointment
Branch N ─── N Specialist

Guardian 1 ─── N Patient
Patient N ─── 1 Specialist
Patient 1 ─── N Appointment
Patient 1 ─── N ClinicalProgress
Patient 1 ─── N SessionPackage

Specialist 1 ─── N Appointment
Appointment 0..1 ─── 1 ClinicalProgress
SessionPackage 1 ─── N Appointment
```

### 9.3 Interfaces TypeScript resumidas

```ts
export type UserRole = "owner" | "receptionist" | "specialist";

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "attended"
  | "cancelled"
  | "no_show";

export type ProgressLevel =
  | "achieved"
  | "in_progress"
  | "needs_reinforcement";

export interface Patient {
  id: string;
  branchId: string;
  guardianId: string;
  assignedSpecialistId?: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  initialReason: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Appointment {
  id: string;
  branchId: string;
  patientId: string;
  specialistId: string;
  packageId?: string;
  startsAt: string;
  endsAt: string;
  status: AppointmentStatus;
}

export interface SessionPackage {
  id: string;
  patientId: string;
  serviceId: string;
  branchId: string;
  totalSessions: number;
  usedSessions: number;
  price: number;
  purchasedAt: string;
  status: "active" | "completed" | "cancelled";
}
```

---

## 10. Reglas de negocio principales

### Pacientes

- Todo paciente debe tener un apoderado.
- Todo paciente debe pertenecer a una sede principal.
- La edad se calcula desde la fecha de nacimiento.
- No se elimina físicamente un paciente; se cambia su estado.

### Citas

- Una cita pertenece a una sede.
- Una cita necesita paciente y especialista.
- No se debe permitir que un especialista tenga dos citas superpuestas.
- Una cita atendida puede generar una evolución clínica.
- Una cita atendida descuenta una sesión una sola vez.

### Paquetes

```text
sesionesRestantes = totalSesiones - sesionesUtilizadas
```

Estados visuales:

- Más de 1: normal.
- Igual a 1: advertencia.
- Igual a 0: renovación requerida.

### Permisos

- Los controles visuales se ocultarán según el rol.
- Los servicios también validarán el rol.
- En producción, los permisos deberán validarse obligatoriamente en el servidor.

---

## 11. Jerarquía de carpetas recomendada

```text
demo_sistema_Anthoaris/
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── vite.config.ts
├── components.json
├── index.html
│
├── docs/
│   ├── SSD.md
│   ├── demo-script.md
│   └── decisions/
│       ├── ADR-001-static-demo.md
│       └── ADR-002-hash-router.md
│
├── public/
│   ├── .nojekyll
│   ├── favicon.svg
│   ├── logo-anthoaris.svg
│   ├── manifest.webmanifest
│   └── images/
│       ├── empty-states/
│       └── avatars/
│
└── src/
    ├── main.tsx
    ├── app.tsx
    ├── index.css
    │
    ├── app/
    │   ├── router.tsx
    │   ├── providers.tsx
    │   └── route-guards.tsx
    │
    ├── assets/
    │   ├── icons/
    │   └── illustrations/
    │
    ├── components/
    │   ├── ui/
    │   ├── layout/
    │   │   ├── app-shell.tsx
    │   │   ├── sidebar.tsx
    │   │   ├── topbar.tsx
    │   │   └── mobile-nav.tsx
    │   ├── feedback/
    │   │   ├── empty-state.tsx
    │   │   ├── error-state.tsx
    │   │   └── loading-state.tsx
    │   └── common/
    │       ├── branch-selector.tsx
    │       ├── page-header.tsx
    │       └── status-badge.tsx
    │
    ├── features/
    │   ├── auth/
    │   │   ├── components/
    │   │   ├── pages/
    │   │   ├── auth.store.ts
    │   │   └── auth.types.ts
    │   │
    │   ├── dashboard/
    │   │   ├── components/
    │   │   ├── pages/
    │   │   ├── dashboard.service.ts
    │   │   └── dashboard.types.ts
    │   │
    │   ├── patients/
    │   │   ├── components/
    │   │   ├── pages/
    │   │   ├── patient.schema.ts
    │   │   ├── patient.service.ts
    │   │   └── patient.types.ts
    │   │
    │   ├── specialists/
    │   ├── appointments/
    │   ├── clinical-progress/
    │   ├── packages/
    │   ├── payments/
    │   └── reports/
    │
    ├── data/
    │   ├── database.ts
    │   ├── schema.ts
    │   ├── seed.ts
    │   ├── reset-demo.ts
    │   └── repositories/
    │       ├── interfaces/
    │       └── dexie/
    │
    ├── domain/
    │   ├── entities/
    │   ├── enums/
    │   ├── policies/
    │   └── errors/
    │
    ├── hooks/
    ├── lib/
    │   ├── cn.ts
    │   ├── dates.ts
    │   ├── currency.ts
    │   ├── permissions.ts
    │   └── identifiers.ts
    │
    ├── stores/
    │   ├── app.store.ts
    │   └── filters.store.ts
    │
    ├── styles/
    │   ├── tokens.css
    │   └── animations.css
    │
    ├── types/
    └── tests/
        ├── unit/
        └── fixtures/
```

### Criterio de organización

- `features`: funcionalidad organizada por dominio.
- `components/ui`: componentes visuales genéricos.
- `domain`: reglas que no dependen de React.
- `data`: persistencia y repositorios.
- `stores`: estado global de interfaz.
- `lib`: utilidades técnicas.
- `docs`: documentación versionada dentro del repositorio.

No se recomienda crear carpetas globales gigantes como `pages`, `services` o `components` para toda la aplicación sin separación por dominio.

---

## 12. Datos iniciales de la demo

El archivo `seed.ts` crea (datos ficticios y deterministas):

- 2 sedes: **San Martín de Porres (SMP)** y **Comas**.
- 1 dueño, 2 recepcionistas y 1 usuario especialista para el login.
- 6 especialidades / servicios reales (una por especialista).
- 6 especialistas.
- 12 pacientes y 12 apoderados.
- 30 citas (pasadas, de hoy y futuras).
- 10 evoluciones clínicas (una por cita atendida).
- 12 paquetes de sesiones.
- Ingresos ficticios repartidos **hasta el mes actual** (para que los KPIs de
  "Este mes" tengan datos reales).

Las fechas del seed se calculan relativas a "ahora", de modo que el dashboard y
la agenda siempre muestren información reciente.

Al abrir la aplicación:

```text
¿Existe la base local?
├── No                       → cargar datos semilla
├── Sí, versión de semilla
│   anterior a la actual     → regenerar automáticamente (migración suave)
└── Sí, versión actual       → usar datos existentes
```

La regeneración automática se controla con `SCHEMA_VERSION` (en
`src/data/database.ts`): cuando se cambia la forma o distribución del seed se
sube la versión, y los visitantes con datos previos se regeneran solos al abrir
la app, sin tener que reiniciar manualmente.

Además existe el botón:

```text
Configuración → Reiniciar demo
```

Este botón elimina la base local y vuelve a cargar los datos semilla.

---

## 13. Seguridad y privacidad de la demo

- Usar únicamente nombres y datos ficticios.
- No colocar datos reales de menores.
- No guardar diagnósticos reales.
- No incluir claves privadas.
- No incluir contraseñas reales.
- No incluir variables secretas en archivos `.env`.
- Considerar que todo JavaScript publicado en GitHub Pages es visible.
- Considerar que IndexedDB pertenece al navegador del visitante y no es una base compartida.
- Agregar una etiqueta visible: “Entorno demostrativo — información ficticia”.

---

## 14. Configuración para GitHub Pages

### 14.1 Nombre del repositorio

Repositorio real de la demo:

```text
demo_sistema_Anthoaris
```

La URL publicada es:

```text
https://lmiranda25.github.io/demo_sistema_Anthoaris/
```

> **Importante:** GitHub Pages distingue mayúsculas en la URL. El nombre incluye
> `Anthoaris` con A mayúscula, por lo que `base` debe respetar esas mayúsculas.

### 14.2 Configuración de Vite

La configuración real incluye el alias `@`, el plugin de Tailwind v4 y el
troceado manual de chunks para mejorar la caché en GitHub Pages:

```ts
// vite.config.ts (resumen)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  base: "/demo_sistema_Anthoaris/", // debe coincidir EXACTO con el repo (mayúsculas)
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          charts: ["recharts"],
          db: ["dexie", "dexie-react-hooks"],
          forms: ["react-hook-form", "zod", "@hookform/resolvers"],
          calendar: ["react-day-picker"],
        },
      },
    },
  },
});
```

El valor de `base` debe coincidir exactamente con el nombre del repositorio,
incluyendo mayúsculas.

### 14.3 Router

```tsx
import { HashRouter } from "react-router-dom";

export function App() {
  return (
    <HashRouter>
      {/* rutas */}
    </HashRouter>
  );
}
```

Se utiliza `HashRouter` para que una recarga de página no solicite al servidor una ruta que GitHub Pages no conoce.

---

## 15. Instalación inicial

```bash
npm create vite@latest demo_sistema_Anthoaris -- --template react-ts
cd demo_sistema_Anthoaris

npm install
npm install react-router-dom motion zustand
npm install dexie dexie-react-hooks
npm install react-hook-form zod @hookform/resolvers
npm install recharts @tanstack/react-table
npm install date-fns lucide-react sonner
npm install react-day-picker @radix-ui/react-popover
npm install clsx tailwind-merge

npm install tailwindcss @tailwindcss/vite
npm install -D gh-pages

npx shadcn@latest init
```

Componentes iniciales sugeridos:

```bash
npx shadcn@latest add button card dialog drawer dropdown-menu
npx shadcn@latest add input label select textarea form
npx shadcn@latest add table tabs badge avatar separator
npx shadcn@latest add sheet sidebar skeleton tooltip
```

---

## 16. Despliegue manual sin GitHub Actions

### 16.1 Scripts

Agregar en `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### 16.2 Primer despliegue

```bash
git init
git add .
git commit -m "feat: initial Anthoaris demo"
git branch -M main

git remote add origin https://github.com/Lmiranda25/demo_sistema_Anthoaris.git
git push -u origin main

npm run deploy
```

El comando `npm run deploy`:

1. Ejecuta el build local.
2. Genera `dist`.
3. Publica el contenido de `dist` en la rama `gh-pages`.

### 16.3 Configuración en GitHub

En el repositorio:

```text
Settings
→ Pages
→ Build and deployment
→ Source: Deploy from a branch
→ Branch: gh-pages
→ Folder: / (root)
→ Save
```

No se necesita ningún archivo dentro de `.github/workflows`.

### 16.4 Actualizaciones posteriores

```bash
git add .
git commit -m "feat: update dashboard"
git push origin main
npm run deploy
```

El despliegue se inicia manualmente desde la computadora del desarrollador.

---

## 17. Flujo de demostración recomendado

### Escena 1 — Dueño

1. Seleccionar perfil “Súper Administrador” (Carmen Salazar).
2. Mostrar dashboard consolidado.
3. Cambiar de Consolidado a Sede San Martín de Porres (SMP).
4. Ajustar el rango de fechas con el calendario (o un atajo como "Este mes").
5. Mostrar ingresos, nuevos pacientes y ausentismo.
6. Abrir rendimiento de especialistas.

### Escena 2 — Recepción

1. Cambiar al perfil “Recepcionista SMP” (Rosa Medina).
2. Registrar un paciente.
3. Crear una cita.
4. Registrar un paquete.
5. Mostrar una alerta de renovación.

### Escena 3 — Especialista

1. Cambiar al perfil “Especialista”.
2. Abrir agenda del día.
3. Marcar una cita como atendida.
4. Registrar la evolución.
5. Mostrar el descuento automático de una sesión.

### Escena 4 — Resultado

1. Volver al perfil del dueño.
2. Mostrar el KPI actualizado.
3. Mostrar la sesión realizada.
4. Mostrar el paquete con una sesión menos.

---

## 18. Criterios de aceptación de la demo

### General

- Funciona en Chrome, Edge y Safari modernos.
- Es usable en laptop, tablet y móvil.
- Puede navegarse sin backend.
- Los datos sobreviven al recargar la página.
- El usuario puede reiniciar los datos.
- No contiene información real.

### Roles

- Cada perfil ve una navegación diferente.
- La recepcionista no ve reportes globales.
- El especialista no ve dinero.
- El especialista solo ve pacientes asignados.

### Pacientes

- Se puede crear y editar un paciente.
- La edad se calcula automáticamente.
- El paciente queda vinculado a un apoderado.

### Citas y paquetes

- Una cita puede cambiar de estado.
- Una cita atendida descuenta una sesión.
- No se descuenta dos veces por la misma cita.
- Aparece una alerta al quedar una o cero sesiones.

### Evolución

- Se registra objetivo, observaciones y nivel.
- La evolución queda vinculada a paciente, cita y especialista.

### Dashboard

- Los indicadores cambian al filtrar por sede.
- Los gráficos usan datos de la base local.
- El dashboard se actualiza después de operaciones relevantes.

### Despliegue

- `npm run build` termina sin errores.
- `npm run deploy` publica la carpeta `dist`.
- La demo funciona desde una URL con subruta.
- Recargar una ruta con hash no produce error 404.

---

## 19. Pruebas mínimas recomendadas

### Unitarias

- Cálculo de edad.
- Cálculo de sesiones restantes.
- Cálculo de ausentismo.
- Validación de permisos.
- Prevención de doble descuento.
- Detección de horarios superpuestos.

### Componentes

- Formularios.
- Selector de sede.
- Tarjetas KPI.
- Alertas de renovación.
- Cambio de estado de citas.

### Navegación

- Rutas por rol.
- Redirección cuando no existe sesión.
- Acceso bloqueado a módulos no permitidos.

### Build

```bash
npm run build
npm run preview
```

Antes de publicar, recorrer todas las rutas y revisar la consola del navegador.

---

## 20. Evolución futura hacia producción

La interfaz de la demo puede conservarse. Debe reemplazarse la capa de datos.

### Opción recomendada para una primera versión real

```text
Frontend
React + TypeScript + Tailwind

Backend administrado
Supabase

Servicios
PostgreSQL
Authentication
Row Level Security
Storage
Edge Functions cuando sea necesario
```

### Opción con backend propio

```text
Frontend
React + TypeScript

API
NestJS o FastAPI

Base de datos
PostgreSQL

Infraestructura
Docker
Servidor VPS
Proxy HTTPS
Backups
Monitoreo
```

### Cambios obligatorios para producción

- Autenticación real.
- Autorización aplicada en servidor.
- Auditoría de accesos y modificaciones.
- Protección de datos personales.
- Copias de seguridad.
- Cifrado en tránsito.
- Control de sesiones.
- Registro de errores.
- Separación real por sede.
- Validación de transacciones financieras.
- Revisión legal del tratamiento de información clínica.

---

## 21. Orden sugerido de implementación

### Fase 1 — Base visual

- Vite, React y TypeScript.
- Tailwind y shadcn/ui.
- Shell de aplicación.
- Login simulado.
- Rutas por rol.
- Datos semilla.

### Fase 2 — Operación

- Pacientes.
- Apoderados.
- Especialistas.
- Agenda.
- Paquetes.

### Fase 3 — Valor clínico

- Evolución por sesión.
- Asistencia.
- Descuento de sesiones.
- Alertas.

### Fase 4 — Dashboard

- KPIs.
- Gráficos.
- Filtros multi-sede.
- Rendimiento.
- Ausentismo.

### Fase 5 — Calidad y publicación

- Responsive.
- Animaciones.
- Estados vacíos.
- Pruebas.
- Build.
- Deploy manual.

---

## 22. Decisión final

Para esta demo se recomienda:

```text
React + TypeScript
Vite
Tailwind CSS
shadcn/ui
Motion for React
React Router con HashRouter
Zustand
React Hook Form + Zod
Dexie + IndexedDB
Recharts
GitHub Pages
Despliegue manual con gh-pages
```

Esta combinación permite construir una experiencia visual pulida, persistente en el navegador y desplegable sin servidor. Al mismo tiempo, mantiene una arquitectura preparada para sustituir la base local por una API real en una siguiente fase.

---

## 23. Registro de cambios

### v2.0 — Implementación y ajustes de negocio

Cambios respecto a la propuesta inicial (v1.0), aplicados durante la
implementación y a pedido del cliente:

- **Sedes reales:** San Martín de Porres (SMP) y Comas (antes Miraflores y La
  Molina).
- **Especialidades reales:** Atención, Lenguaje, Aprendizaje, Conducta,
  Emocional y Guardería, cada una con su color de marca. Se pasó de 4 a 6
  especialistas (uno por especialidad).
- **Identidad de marca:** se incorporó el logo oficial de Anthoaris (login,
  barra lateral, favicon y manifest) y se alineó la paleta de color a la guía de
  branding (teal `#1D9E75` primario, coral `#D85A30` acento, ámbar `#EF9F27`
  advertencia, neutros de marca).
- **Filtro de fechas por calendario:** el dropdown de periodo fijo se reemplazó
  por un selector de rango "Desde – Hasta" con calendario (react-day-picker) y
  atajos rápidos (Hoy, Este mes, Mes anterior, Últimos 3 meses), en Dashboard y
  Reportes.
- **Datos del dashboard:** el seed reparte pagos y pacientes hasta el mes actual
  para que los KPIs de "Este mes" no aparezcan en cero.
- **Migración por versión de semilla:** `SCHEMA_VERSION` regenera
  automáticamente los datos de visitantes con una versión anterior.
- **Responsive móvil:** las tablas de pacientes y paquetes se muestran como
  tarjetas en móvil; filtros y selectores a ancho completo; diálogos con margen.
- **Despliegue:** repositorio `demo_sistema_Anthoaris`, publicado en
  `https://lmiranda25.github.io/demo_sistema_Anthoaris/`.

### v1.0 — Propuesta técnica inicial

Documento de diseño original: arquitectura, alcance funcional, stack, modelo de
datos, reglas de negocio y estrategia de despliegue en GitHub Pages.
