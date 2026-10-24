---
name: TORNIRACORES 2
description: Calidad y Servicio. The corner parts store's façade, brought online.
colors:
  shop-black: "#08090B"
  industrial-yellow: "#FFB900"
  yellow-deep: "#E5A400"
  field-yellow: "#FFD25C"
  white: "#FFFFFF"
  graphite: "#1C1F23"
  graphite-low: "#15171A"
  graphite-high: "#262A30"
  metal-grey: "#9CA3AF"
  metal-grey-soft: "#C9CED6"
  paper: "#F3F4F6"
  paper-ink-soft: "#4B5058"
  error-ink: "#8A1C12"
typography:
  display:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 4.55vw, 5.6rem)"
    fontWeight: 850
    lineHeight: 0.92
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 100"
  headline:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 1rem + 3.9vw, 4.75rem)"
    fontWeight: 850
    lineHeight: 0.92
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 850
    lineHeight: 1
  statement:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1.05
  lead:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  small:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 750
    letterSpacing: "0.02em"
rounded:
  cut: "2px"
  plate: "4px"
  round: "9999px"
spacing:
  gutter: "clamp(1rem, 0.6rem + 1.8vw, 2.5rem)"
  section: "128px"
  section-phone: "96px"
  nav: "72px"
components:
  button-primary:
    backgroundColor: "{colors.industrial-yellow}"
    textColor: "{colors.shop-black}"
    typography: "{typography.label}"
    rounded: "{rounded.cut}"
    height: "56px"
    padding: "0 28px"
  button-primary-hover:
    backgroundColor: "{colors.white}"
    textColor: "{colors.shop-black}"
  button-secondary:
    backgroundColor: "{colors.graphite-high}"
    textColor: "{colors.white}"
    rounded: "{rounded.cut}"
    height: "56px"
  button-ink:
    backgroundColor: "{colors.shop-black}"
    textColor: "{colors.white}"
    rounded: "{rounded.cut}"
    height: "56px"
  chip:
    backgroundColor: "{colors.graphite-high}"
    textColor: "{colors.white}"
    rounded: "{rounded.cut}"
    height: "40px"
    padding: "0 14px"
  chip-selected:
    backgroundColor: "{colors.industrial-yellow}"
    textColor: "{colors.shop-black}"
  input-on-yellow:
    backgroundColor: "{colors.field-yellow}"
    textColor: "{colors.shop-black}"
    rounded: "{rounded.cut}"
    height: "52px"
  input-search:
    backgroundColor: "{colors.shop-black}"
    textColor: "{colors.white}"
    height: "64px"
  spec-sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.shop-black}"
    padding: "24px 20px"
---

# Design System: TORNIRACORES 2

## Overview

**Creative North Star: "The Storefront Counter"**

The site is the store's own corner building and the paperwork that crosses its counter. The façade gives the page its world: black ground, whole panels of industrial yellow, black bands, and pillars with the product families painted vertically. The counter gives it its artefacts: a spec sheet set like a printed price list, a quote coupon with notches and a perforation, and an order slip with a torn zigzag edge. Real metal (a WebGL brake corner, open-licence part photographs) carries the product. Nothing is decorated for its own sake.

Density is commercial, not editorial: every section has full content and a way to ask for a price. Colour commits at field scale. Yellow owns whole regions (the part finder, the coupon, the information plate on the store photo, the pillars) rather than being sprinkled as accents. Depth comes from tone steps between black and graphite, never from lines.

**Key Characteristics:**
- Black ground, yellow fields, white lettering, graphite tone steps.
- One typeface, Archivo variable: heavy, uppercase, upright for headings; regular for text.
- Square-cut flat controls (2px), no outlined boxes, no resting shadows.
- Printed counter artefacts: dot leaders, zigzag cuts, coupon notches.
- Honest labelling of demo data and reference photos, set in the same voice as everything else.

## Colors

A two-ink print job on a black ground: industrial yellow and white on shop black, with graphite steps for surfaces.

### Primary
- **Industrial Yellow** (#FFB900): the façade's panel paint. Primary actions, whole section fields (finder, coupon, info plate), pillars, selected chips and tabs, the 3D caliper and gear. Also focus rings and text selection.
- **Deep Yellow** (#E5A400): folder backs and the pressed or shaded side of yellow objects.
- **Field Yellow** (#FFD25C): input wells on yellow fields, one step lighter than the field so inputs read without borders.

### Neutral
- **Shop Black** (#08090B): page ground, ink on yellow, the ink button.
- **Graphite** (#1C1F23), **Graphite Low** (#15171A), **Graphite High** (#262A30): surface steps. Low for alternating section fields and the footer, Graphite for cards, sheets and result rows, High for secondary buttons and chips.
- **White** (#FFFFFF): headings and primary text on black.
- **Metal Grey Soft** (#C9CED6): running secondary text on black (meets 4.5:1).
- **Metal Grey** (#9CA3AF): captions, notes, inactive details.
- **Paper** (#F3F4F6) with **Paper Ink Soft** (#4B5058): the printed artefacts (spec sheet, order slip).
- **Error Ink** (#8A1C12): field errors on yellow.

### Named Rules
**The Field, Not Fleck Rule.** Yellow appears as whole fields or as the one action in a region. Never as scattered accent words, underlines or icon tints on black text.

**The Façade Rule.** Black and yellow alternate like the building: a yellow field is followed by black or graphite, never by another yellow field.

## Typography

**Display Font:** Archivo Variable (fallback Archivo, system sans)
**Body Font:** Archivo Variable

**Character:** One family working at two widths of voice. Headings are heavy (850), uppercase, tight (-0.025em, line-height 0.92), echoing the heavy lettering of the logo and the pillar signage. Text is regular at a comfortable 17px.

### Hierarchy
- **Display** (850, clamp(3rem, 4.55vw, 5.6rem), 0.92): the hero h1 only, two lines at every width. Width axis 100% from tablet up, 90% on phones (size drops before width does).
- **Headline** (850, clamp(1.875rem, 1rem + 3.9vw, 4.75rem), 0.92): one size for every section h2. Width 84% under 640px, 100% above. Two lines maximum.
- **Title** (850, 1.625rem, 1): card and sheet titles, uppercase.
- **Lead** (400, 1.125rem, 1.55): the one sentence beside or under each section heading, 38–46ch.
- **Body** (400, 1.0625rem, 1.55): running text.
- **Small** (400–700, 1rem, 1.4): notes, field labels, chips, footer lists, spec rows.
- **Label** (750, 0.875rem, +0.02em, uppercase, width 112%): buttons and tags.
- **Statement** (800, 2.25rem on desktop, uppercase; 700 at 1.125rem in Metal Grey Soft on phones): a second headline sentence set beneath an h2.

### Named Rules
**The Two-Line Rule.** Every heading fits on two lines at 1440, 768 and 390px. Cut words, widen the column, then lower the size. Never condense the face below 84%.

**The One Colour Heading Rule.** Headings are one colour. No yellow accent words inside a headline.

## Layout

A 12-column grid inside one pair of fluid side margins (gutter clamp(1rem, 0.6rem + 1.8vw, 2.5rem)), max content width 92rem. Section headings split 7–8 / 4–5 columns (heading left, lead right) from 1024px up and stack below it. Sections are 128px apart vertically on desktop (96px on phones). Fields change colour between sections instead of using dividers. The fixed nav is 72px tall plus the safe-area inset. Large media (the hero stage, the store photograph) bleeds to the viewport edge; text never does.

Phone compositions are their own: the hero stacks headline, lead and full-width actions above the 3D stage; pillars become a 4 × 2 grid; folders and products run two-up; the coupon stacks above the order slip.

## Elevation & Depth

Flat at rest. Depth is tonal: Shop Black → Graphite Low → Graphite → Graphite High. Shadows exist only on things that truly float: dialogs, side sheets and the suggestion menu.

### Shadow Vocabulary
- **Sheet** (`box-shadow: 0 -30px 60px -20px rgba(0,0,0,0.7)`): side and bottom sheets.
- **Dialog** (`box-shadow: 0 40px 80px -30px rgba(0,0,0,0.85)`): the photo lightbox.
- **Menu** (`box-shadow: 0 20px 40px -12px rgba(0,0,0,0.5)`): the search suggestion list.

### Named Rules
**The Float-Only Shadow Rule.** If it does not sit above the page in a layer of its own, it has no shadow. Separation comes from a tone step.

## Shapes

Hard industrial edges. Controls are square-cut (2px), plates and folders slightly softened (4px), and only icon buttons and state dots are round. Printed artefacts carry their own cut edges, made with masks rather than drawn lines: a zigzag bottom on the spec sheet and order slip, semicircle notches and a 5px dotted perforation on the coupon. The façade pillar (a yellow face with a black inset panel and vertical lettering) is a recurring silhouette.

## Components

### Buttons
Flat, loud and square.
- **Shape:** square-cut (2px).
- **Primary:** Industrial Yellow on Shop Black text, 56px tall (48 / 40 for md / sm), uppercase label at width 112%.
- **Hover / Focus:** primary turns white; secondary steps up one graphite tone; icons nudge 4px in the direction of travel. Press sinks 1px and scales to 0.985. Focus is a 3px yellow outline offset 3px. Hero actions have a subtle magnetic pull (max 6px, fine pointers only).
- **Secondary:** Graphite High with white text. **Ink:** Shop Black on yellow fields. **Light:** white, turning yellow on hover.

### Chips
- **Style:** Graphite High fill, white text, 40px, square-cut.
- **State:** selected chips fill Industrial Yellow with black text (`aria-pressed`).

### Cards / Containers
- **Corner Style:** 4px for folders and plates, 0 for photo tiles.
- **Background:** Graphite on black, or Black on yellow.
- **Shadow Strategy:** none (see Elevation).
- **Border:** none.
- **Internal Padding:** 24–40px.

### Inputs / Fields
- **Style:** on yellow fields, Field Yellow wells with no stroke, 52px tall. The search field is a 64px black bar with a yellow icon.
- **Focus:** the well turns white with a 3px ink outline.
- **Error:** white well, 3px red outline, Error Ink message under the field, focus moved to the first invalid field.

### Navigation
Fixed bar: transparent over the hero, Shop Black at 88% with a light blur once scrolled. The original logo sits on the left, plain links in the middle (active link white with a 3px yellow underline that wipes in), and "Cotizar ahora" as the yellow action on the right. On phones a full-screen black menu wipes down with heavy uppercase links and a full-width yellow action.

### Product Card
Graphite card with the photo on a light plate (4:3), meta line (reference · brand) in Metal Grey, uppercase title, one line of use, then "Precio bajo cotización" unless a real price exists, and a footer with "Cotizar" (yellow) and "Ficha" (graphite). Lifts 5px on hover; the photo scales to 1.05. Shown in a 4 / 2 / 1-column grid on the yellow finder field.

### Printed Artefacts (signature)
The spec sheet and the order slip are Paper (#F3F4F6) with a zigzag bottom. Rows read label, then a 4px dotted leader at 45% opacity (min 2.5rem), then the value. The final line of the slip is an inverted black bar. The coupon is a yellow card with notches and a dotted perforation.

### Folders (signature)
A 3D folder in its family's colours (yellow, black, steel or white). Three reference photos peek out at rest; on hover, click or Enter the front swings open and five fan out. Choosing a photo grows it into a lightbox. Every one is labelled "Imagen de referencia".

## Do's and Don'ts

### Do:
- **Do** commit yellow as whole fields (#FFB900) and keep black text on it.
- **Do** keep every heading to two lines at 1440, 768 and 390px.
- **Do** separate surfaces with the graphite steps (#15171A / #1C1F23 / #262A30).
- **Do** label demo data and reference photos plainly ("Catálogo de demostración", "Imagen de referencia").
- **Do** give every control hover, focus-visible (3px yellow outline) and pressed states.
- **Do** keep the hero's one authored moment, the brake assembly, and keep other motion to short, staggered entrances that respect reduced motion.

### Don't:
- **Don't** redraw, recolour or regenerate the logo. Use the supplied artwork only.
- **Don't** alter the façade photograph.
- **Don't** add gradients as fills, glows or resting shadows. The spotlight cone in the hero is a brief-mandated exception.
- **Don't** use outlined 1px boxes or hairline dividers.
- **Don't** add eyebrow labels above headings or index numbers (01 / 02).
- **Don't** colour single words inside a headline.
- **Don't** show prices, stock or vehicle compatibility unless the store supplied them.
