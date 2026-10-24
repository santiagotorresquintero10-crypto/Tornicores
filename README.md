# TORNIRACORES 2 · sitio web

Página oficial de TORNIRACORES 2 (Calidad y Servicio). React + TypeScript + Vite, Tailwind CSS v4, estructura shadcn/ui (`@/` → `src/`), Framer Motion, three.js (WebGL) y Spline.

## Uso

```bash
npm install
npm run dev        # desarrollo en http://localhost:5173
npm run build      # verificación de tipos + compilación de producción en dist/
npm run preview    # sirve dist/ en http://localhost:4173
```

## Qué es real y qué es de demostración

| Dato | Estado | Dónde se cambia |
|---|---|---|
| Logotipo y foto de la fachada | **Reales**, sin alterar (solo recortados/convertidos a web) | `_source/` → `npm run assets:brand` |
| WhatsApp +57 314 849 6437, correo contacto@torniracores2.com | **Reales** (confirmados) | `src/config/business.ts` |
| Dirección, mapa, horario | **Pendientes** (`null`). “Cómo llegar” abre WhatsApp para pedir la dirección hasta que se configuren | `src/config/business.ts` → `address`, `mapsUrl`, `hours` |
| Catálogo (24 piezas, referencias `DEMO-…`) | **Demostración**. Sin precios, existencias ni compatibilidades | `src/data/products.ts` |
| Marcas (“Marca demo A…F”) | **Demostración** | `src/data/brands.ts` (añadir `logo` y `catalogUrl`) |
| Categorías (8 familias) | Propuesta del brief: validar contra el inventario | `src/data/categories.ts` |
| Fotos de productos/categorías | **Fotos de referencia** con licencia abierta (Wikimedia Commons, Flickr, rawpixel), acreditadas en el pie de página. No son fotos del inventario de la tienda | `src/assets/photos/`, `src/data/photos.ts`, `src/data/credits.ts` |
| Diagrama del camión | Esquema educativo simplificado | `src/data/systems.ts` |

Al cargar fotos propias de la tienda, reemplaza los archivos de `src/assets/photos/` (mismo nombre) o cambia `photo` en cada producto, y elimina de `src/data/credits.ts` los créditos que ya no se usen.

## Escena 3D del inicio

- Por defecto: un conjunto de freno construido en WebGL (`src/components/three/mechanical-scene.ts`): disco ventilado y perforado, mordaza, espárragos y tuercas, tapa del buje, y tornillos, tuercas, arandela y el engrane del logo flotando. Se ensambla al cargar, el disco gira, al desplazarse se desarma (las tuercas se desenroscan), se puede arrastrar y la luz sigue al cursor. Con `prefers-reduced-motion` aparece armado y quieto.
- three.js se descarga después del primer render. Sin WebGL o con ahorro de datos se muestra un dibujo estático rotulado como tal.
- **Spline**: el componente `SplineScene` (`src/components/ui/splite.tsx`, con `lazy` + `Suspense`) está integrado. La escena de referencia del brief (`kZDDjO5HuC9GJUM2`) es un robot genérico, por eso no se usa. Para usar una escena propia de la marca, crea `.env` con:

  ```
  VITE_SPLINE_SCENE=https://prod.spline.design/TU-ESCENA/scene.splinecode
  ```

  El runtime de Spline (~1 MB comprimido) solo se descarga si esa variable existe.

## Cotizaciones

El formulario arma el mensaje exacto (visible en la “orden de cotización”) y abre `wa.me` con el texto. No hay backend: la solicitud se envía cuando el cliente pulsa enviar en WhatsApp. WhatsApp no recibe archivos por enlace web; en celulares compatibles aparece “Compartir con foto” (Web Share API); en los demás se indica adjuntar la foto en el chat.

## Búsqueda

`src/lib/search.ts` hace búsqueda local sin tildes con pesos por campo (nombre, referencia, términos, categoría, marca, uso). No usa IA. Para búsqueda semántica o de compatibilidades, implementa la interfaz `SearchProvider` y pásala en `src/components/sections/part-finder.tsx`.

## Estructura

```
src/
├── assets/brand · photos
├── components/
│   ├── ui/        splite, spotlight, card, button, sheet, tilted-grid-hero, 3d-folder, product-card-2
│   ├── layout/    navbar, footer, reveal
│   ├── sections/  hero, categories, part-finder (productos), mechanics-universe (camión y automóvil), brands, headquarters, quote
│   ├── products/  product-sheet
│   └── three/     mechanical-scene (WebGL), mechanical-stage
├── config/business.ts
├── context/site-actions.tsx
├── data/          products, brands, categories, systems, photos, credits
├── hooks/ · lib/ · styles/globals.css
```

## Skills de diseño usadas

- `npx impeccable install`: instalado (global, `~/.claude/skills/impeccable`). Se usaron su contexto de producto (`PRODUCT.md`), el contrato de dirección (`.impeccable/surfaces/src-app-tsx.md`), el piso de calidad y el detector (`impeccable detect`: 0 hallazgos).
- `npx skills add Leonxlnx/taste-skill`: instalado en `.agents/skills/design-taste-frontend`. Se usaron su dirección (“la página es el objeto”: la fachada y el papeleo del mostrador), `lint.mjs` (0 FAIL) e `inspect.mjs` (0 FAIL a 1440, 768 y 390 px).
