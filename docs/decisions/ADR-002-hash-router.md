# ADR-002 — Uso de HashRouter para enrutamiento

**Estado:** Aceptada
**Fecha:** 2026-06-15

## Contexto

La demo se publica en **GitHub Pages** bajo una subruta
(`/demo_sistema_Anthoaris/`). GitHub Pages es un servidor de archivos estáticos:
no conoce las rutas internas de la SPA. Con enrutamiento por *history* (rutas
"limpias"), recargar `/.../app/dashboard` provocaría un **404**, porque ese
archivo no existe en el servidor.

## Decisión

Usar **`HashRouter`** de React Router. Las rutas viven después de `#`, por lo
que el navegador nunca pide al servidor una ruta que no existe.

```
https://lmiranda25.github.io/demo_sistema_Anthoaris/#/app/dashboard
```

## Consecuencias

- **Positivas:** recargar cualquier ruta funciona sin configuración extra en el
  servidor; no se necesitan reglas de *rewrite* ni un `404.html` de respaldo.
- **Negativas:** las URLs incluyen `#`, estéticamente menos limpias y con menor
  relevancia para SEO. Para una demo interna esto es irrelevante.

## Notas

- `base` en `vite.config.ts` debe coincidir **exactamente** con el nombre del
  repositorio, **respetando mayúsculas** (`/demo_sistema_Anthoaris/`), porque la
  URL de GitHub Pages distingue mayúsculas.
- Se incluye `public/.nojekyll` para que GitHub Pages no procese la salida con
  Jekyll (que ignoraría carpetas que empiezan con `_`).
