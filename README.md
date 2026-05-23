# Portafolio

Un portafolio web moderno creado con Astro, estilo glassmorphism y soporte para GitHub Pages.

![Árbol de detalles](public/tree-details.svg)

## Descripción

Este proyecto es una plantilla de portafolio con:

- Sección de `Calendario` y `Cronómetro` en la interfaz principal.
- Página ampliada `/panels` para ver cada herramienta con más detalle.
- Panel de `Configuración` que guarda ajustes en `localStorage`.
- Soporte de despliegue en GitHub Pages mediante GitHub Actions.
- Estilo oscuro por defecto y modo claro opcional.

## Características principales

- `src/pages/index.astro` — página principal del portafolio.
- `src/pages/panels.astro` — vista ampliada con calendario, cronómetro y configuración.
- `src/components/Calendar.astro` — calendario interactivo.
- `src/components/Timer.astro` — temporizador con modos Focus / Descanso / Libre.
- `src/components/Config.astro` — ajustes de tema, fondo y preferencias.
- `src/layouts/BaseLayout.astro` — layout base con CSS global y carga de configuración.
- `src/lib/db.ts` — lógica de persistencia del backend; se usa archivo JSON o SQL cuando está disponible.

## Instalación y desarrollo local

1. Instala las dependencias:

```bash
pnpm install
```

2. Inicia el servidor local:

```bash
pnpm run dev
```

3. Abre el sitio en el navegador usando la URL que muestra Astro.

## Despliegue en GitHub Pages

El proyecto incluye un workflow de GitHub Actions que genera el sitio estático y publica `dist` en la rama `gh-pages`.

Para activar el despliegue automático:

1. Empuja los cambios a `main`.
2. Asegúrate de que el workflow `.github/workflows/deploy.yml` exista.
3. Revisa la pestaña `Actions` en GitHub.
4. Configura GitHub Pages en `Settings > Pages`:
   - Fuente: `gh-pages`
   - Carpeta: `/ (root)`

## Comandos útiles

- `pnpm install` — instala dependencias.
- `pnpm run dev` — arranca el servidor de desarrollo.
- `pnpm build` — genera el sitio estático en `dist`.
- `pnpm preview` — previsualiza el sitio generado.
- `pnpm deploy` — despliega el sitio con `gh-pages` (requiere autorización `gh-pages`).

## Seguridad y configuración

- La configuración de usuario se guarda en `localStorage` para que funcione en GitHub Pages.
- No se deben subir claves ni credenciales a este repositorio.
- Si usas SQL Server, configura variables de entorno locales y no dejes datos sensibles en el código fuente.

## Estructura del proyecto

- `public/` — archivos estáticos como imágenes y SVG.
- `src/` — código de Astro.
- `src/components/` — componentes reutilizables.
- `src/pages/` — rutas y páginas.
- `src/styles/` — estilos globales.
- `.github/workflows/` — workflow de despliegue.

## Notas finales

Este portafolio está preparado para avanzar con nuevas secciones, animaciones y contenido personal. Puedes usarlo como base para mostrar proyectos, experiencia y habilidades técnicas.
