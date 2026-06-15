# Anthoaris · Demo de Gestión Multi-Sede

Demo navegable del **Sistema de Gestión Multi-Sede** para el Centro de Terapias
Integrales Anthoaris. Es una SPA estática (React + Vite) con persistencia local
en el navegador (IndexedDB), pensada para presentar el funcionamiento esperado
del sistema usando **información completamente ficticia**.

> **Entorno demostrativo — información ficticia.** No es un sistema clínico ni
> financiero de producción. No usa backend, autenticación real ni datos reales.

---

## Tecnologías

- **React + TypeScript** con **Vite**
- **Tailwind CSS v4** + componentes estilo **shadcn/ui** (Radix UI)
- **React Router** con `HashRouter` (compatible con GitHub Pages)
- **Zustand** para estado de sesión, sede y filtros
- **React Hook Form + Zod** para formularios y validación
- **Dexie + IndexedDB** para persistencia local
- **Recharts** para gráficos · **date-fns** · **lucide-react** · **sonner**
- **Vitest** para pruebas unitarias

---

## Requisitos

- Node.js 20 o superior
- npm 10 o superior

## Puesta en marcha

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (por defecto `http://localhost:5173`).

La primera vez, la app detecta que no hay base local y carga automáticamente los
**datos semilla** (2 sedes, especialistas, pacientes, citas, paquetes, etc.).

## Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Verifica tipos (`tsc -b`) y genera `dist` |
| `npm run preview` | Sirve `dist` localmente para revisión |
| `npm test` | Ejecuta las pruebas unitarias |
| `npm run deploy` | Construye y publica `dist` en la rama `gh-pages` |

---

## Perfiles de la demo

La pantalla de acceso permite entrar con perfiles predefinidos (sin contraseña):

| Perfil | Rol | Alcance |
|---|---|---|
| Carmen Salazar | Súper Administrador | Ambas sedes, finanzas, reportes, clínica (solo lectura) |
| Rosa Medina | Recepcionista Sede 1 | Solo su sede; pacientes, citas, paquetes, pagos |
| Pedro Quispe | Recepcionista Sede 2 | Solo su sede |
| Lucía Fernández | Especialista | Su agenda, sus pacientes, asistencia y evolución clínica |

Cada perfil ve una navegación y unos permisos distintos. Los permisos se ocultan
en la UI y se validan en los servicios (ver `src/lib/permissions.ts`).

---

## Arquitectura

La aplicación separa responsabilidades en capas (ver `docs/SSD.md`):

```
Presentación (features, components)
        ↓
Servicios de caso de uso (features/**/*.service.ts)
        ↓
Repositorios (interfaces) → implementación Dexie
        ↓
IndexedDB (Dexie)
```

Los componentes **no** consultan Dexie directamente para escribir: pasan por
servicios y repositorios, de modo que la fuente de datos pueda sustituirse por
una API real en el futuro sin reescribir la interfaz.

- `src/domain/` — reglas de negocio puras (sin React): entidades, enums,
  *policies* (edad, sesiones restantes, ausentismo, conflictos de horario, doble
  descuento) y errores.
- `src/data/` — base Dexie, esquema, datos semilla, reinicio y repositorios.
- `src/features/` — funcionalidad por dominio (auth, dashboard, patients,
  specialists, appointments, packages, clinical-progress, reports, settings,
  specialist-portal).
- `src/components/` — UI genérica (`ui/`), layout, feedback y comunes.
- `src/lib/`, `src/hooks/`, `src/stores/` — utilidades, hooks reactivos y estado.

Decisiones técnicas documentadas en [`docs/decisions/`](docs/decisions/).

---

## Reglas de negocio destacadas

- Todo paciente se registra junto a un **apoderado** y una **sede**.
- La **edad** se calcula desde la fecha de nacimiento.
- Un especialista **no puede tener dos citas superpuestas**.
- Una cita atendida **descuenta una sesión una sola vez** (sin doble descuento).
- Paquetes: alerta de **advertencia** con 1 sesión y **crítica** con 0.
- La recepcionista ve que existe una evolución clínica, pero **no su contenido**.
- El especialista **no ve información financiera** y solo accede a sus pacientes.

---

## Despliegue en GitHub Pages

El proyecto está configurado para el repositorio `demo_sistema_Anthoaris`:

```ts
// vite.config.ts
base: "/demo_sistema_Anthoaris/"
```

> El valor de `base` distingue mayúsculas y debe coincidir exactamente con el
> nombre del repositorio.

Publicación manual:

```bash
npm run deploy
```

Esto ejecuta el build y publica `dist` en la rama `gh-pages`. Luego, en GitHub:

```
Settings → Pages → Source: Deploy from a branch → Branch: gh-pages / (root)
```

URL resultante:

```
https://lmiranda25.github.io/demo_sistema_Anthoaris/
```

Se usa `HashRouter`, por lo que recargar una ruta con hash (`#/app/dashboard`)
no produce error 404.

---

## Privacidad

- Todos los datos son ficticios y viven solo en el navegador del visitante.
- IndexedDB es local: no hay base compartida entre dispositivos.
- Puedes borrar y regenerar todo desde **Configuración → Reiniciar demo**.
