# ADR-001 — Demo estática (SPA con Vite) en lugar de framework con servidor

**Estado:** Aceptada
**Fecha:** 2026-06-15

## Contexto

El objetivo de esta entrega es una **demo navegable** del sistema Anthoaris,
desplegable manualmente en **GitHub Pages**, con datos ficticios y persistencia
en el navegador. No se requiere backend, base de datos real ni autenticación
real en esta fase.

## Decisión

Construir una **Single Page Application estática** con **React + TypeScript +
Vite**, y persistir los datos en **IndexedDB mediante Dexie**.

Se descarta Next.js para esta fase porque:

- GitHub Pages sirve archivos estáticos; no ejecuta un servidor Node.
- El objetivo es generar una SPA estática (`dist`), que Vite produce con menos
  configuración.
- El despliegue manual con `gh-pages` es más directo.

## Consecuencias

- **Positivas:** despliegue simple, sin infraestructura; todo corre en el
  navegador; arranque y build rápidos.
- **Negativas / límites:** todo el JavaScript publicado es visible; IndexedDB es
  local al navegador del visitante (no compartida); los "permisos" son solo de
  presentación.
- **Evolución:** la interfaz puede conservarse; para producción se sustituye la
  capa de datos (repositorios) por una API real (p. ej. Supabase). Ver el SSD,
  sección 20.

## Mitigación arquitectónica

Los componentes no escriben en Dexie directamente: pasan por
**servicios → repositorios (interfaces) → implementación Dexie**. Esto permite
reemplazar la fuente de datos sin reescribir la UI.
