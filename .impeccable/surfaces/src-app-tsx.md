---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Surface brief: home page (src/App.tsx)

Scope: the one-page site for TORNIRACORES 2. Mode: Persuade.
Audience: workshops and mechanics, truck/fleet operators, industry buyers, private drivers. Job: find the part, ask for a price. Action: send a quote request through WhatsApp (+57 314 849 6437).
Proof on hand: the original logo and the real façade photo. No inventory, brands, prices, address or hours yet: catalogue and brands are labelled demo data.
Constraints: brief pins React + TS + Vite + Tailwind + shadcn structure, framer-motion, 3D hero (Spline component kept, built-in WebGL scene used because the supplied robot scene is generic), tilted-grid brand carousel, 3D folders for categories, brand palette #08090B / #FFB900 / #FFFFFF / #1C1F23 / #9CA3AF.

## Direction contract

THESIS: The store's own façade is the page: yellow panels, black bands and pillars with the product families painted vertically. Refuses the category default of a dark e-commerce grid with icon cards and a stock hero photo.

OWN-WORLD: Black ground (#08090B) with whole fields of industrial yellow (#FFB900) for the finder and the coupon; graphite tone steps instead of lines; Archivo variable (wide, heavy, uppercase display; regular text); square-cut flat buttons (2px); printed artefacts: spec sheet and order slip with dot leaders and a zigzag cut, coupon with notches and perforation; real metal in WebGL.

STORY: First screen: what the store sells and how to ask for a price. Then the façade pillars as the family index, folders of real reference photos, a sample of parts with spec sheets, the finder, how truck systems fit together, brands, the real store, and the quote coupon that writes the exact WhatsApp message.

FIRST VIEWPORT: Left 7 columns: h1 "LA FUERZA DETRÁS / DE CADA MOVIMIENTO." on two lines (~5vw), one lead sentence, two flat buttons (Explorar productos, Solicitar cotización). Right 5 columns bleeding to the screen edge: a live WebGL brake corner (drilled ventilated rotor, yellow caliper, studs and lug nuts, hub cap) with floating threaded bolts, nuts, washer and the logo gear; it assembles on load, the rotor turns, scroll disassembles it, drag rotates it, the key light follows the cursor. Cotizar ahora sits in the nav.

FORM: "The page is the object" (taste-skill composition direction), artefact = the façade and the counter's printed paperwork; position 1 on the grounded list. seed:88b5b88148e4415f (rolled after the build at the reviewer's request; the client brief pins the visual world, palette, sections and hero concept, and a brief-pinned decision beats the roll, so the assignment was recorded, not built).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved
- Real inventory, brand list and logos, address, hours, product photography.
