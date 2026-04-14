# Design System Specification

## 1. Overview & Creative North Star: "The Ethereal Executive"

This design system is not a utility; it is an atmosphere. To cater to a high-end freelance marketplace, we must move away from the "boxy" nature of traditional SaaS and toward a "Liquid Precision" aesthetic. The Creative North Star—**The Ethereal Executive**—fuses the rigorous, data-driven layouts of Linear with the soft, immersive depth of high-end editorial design.

We break the "template" look through **intentional asymmetry**. Hero sections should utilize "The Breathing Grid," where content is offset from the center, allowing subtle gradient mesh backgrounds to bleed into the functional areas. We prioritize tonal depth over structural lines, ensuring the UI feels like a seamless, continuous environment rather than a collection of widgets.

---

## 2. Color & Surface Theory

The palette is rooted in deep obsidian tones, punctuated by high-chroma Indigo and luminous secondary accents. 

### The "No-Line" Rule
Explicitly prohibited: 1px solid borders for sectioning or container definition. Boundaries must be defined solely through background color shifts. To separate a profile card from the dashboard background, shift from `surface` (#0f131d) to `surface-container-low` (#171b26). If the eye can perceive the edge through a tonal shift, a line is a failure of craft.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of "Frosted Obsidian."
- **Layer 0 (Base):** `surface` (#0f131d) – The infinite canvas.
- **Layer 1 (Sections):** `surface-container-low` (#171b26) – Used for large content blocks.
- **Layer 2 (Cards):** `surface-container` (#1c1f2a) – The primary interactive container.
- **Layer 3 (Modals/Popovers):** `surface-container-highest` (#313540) – Floating elements that demand focus.

### The Glass & Gradient Rule
To achieve the premium "Linear-esque" polish, all floating elements (modals, dropdowns, hovered cards) must utilize **Glassmorphism**:
- **Background:** Semi-transparent `surface-variant` (#313540) at 60% opacity.
- **Effect:** `backdrop-filter: blur(12px)`.
- **Signature Gradient:** Main CTAs must use a linear gradient from `primary` (#c0c1ff) to `secondary` (#d0bcff) at a 135-degree angle to provide a sense of "luminous soul."

---

## 3. Typography: Editorial Authority

The typography system relies on the interplay between the functional `Inter` and the technical precision of `Berkeley Mono`.

- **Display & Headlines:** Use `Inter Variable`. To avoid a generic look, headlines should use `headline-lg` (2rem) with tight tracking (-0.02em) and a font-weight of 600. For hero sections, use `display-lg` (3.5rem) with intentional line-height (1.1) to create a "blocky" editorial feel.
- **The Technical Accent:** Use `Berkeley Mono` for metadata, labels, and price points. This adds a layer of "verified" or "engineered" quality to the freelance marketplace context.
- **Hierarchy through Tones:** Use `on-surface` (#dfe2f1) for primary headings and `on-surface-variant` (#c7c4d7) for body text. This creates a natural "depth of field" where secondary information recedes visually.

---

## 4. Elevation & Depth: Tonal Layering

We do not use drop shadows to indicate "shadows." We use them to indicate "glow" and "ambient occlusion."

- **The Layering Principle:** Depth is achieved by stacking. A `surface-container-lowest` card placed on a `surface-container-low` section creates a recessed "sunken" effect. Conversely, a `surface-container-high` card on a `surface` background creates a natural lift.
- **Ambient Shadows:** For floating glass cards, use a 40px blur with 4% opacity, using the `primary` color (#c0c1ff) as the shadow tint. This mimics a light source reflecting through glass rather than a muddy grey shadow.
- **The "Ghost Border" Fallback:** If accessibility requires a container edge, use the `outline-variant` token (#464554) at 15% opacity. It should be felt, not seen.

---

## 5. Components

### Buttons
- **Primary:** Indigo gradient (`primary` to `secondary`). Border-radius: `md` (0.375rem). No border. High-contrast `on-primary` text.
- **Secondary (Glass):** `surface-container-highest` at 40% opacity with a `backdrop-blur`. This allows the background mesh to peek through the button.
- **Tertiary:** Pure text using `primary` color, with a `Berkeley Mono` label for "technical" actions.

### Glassmorphism Cards
- **Structure:** No dividers. Use `title-md` for headers and `body-sm` for content.
- **Separation:** Use vertical white space (24px - 32px) to separate the freelancer’s bio from their skill tags.
- **Interaction:** On hover, the `backdrop-blur` should increase from 12px to 20px, and the `surface-tint` should subtly brighten.

### Search & Category Inputs
- **Search Bar:** A prominent `surface-container-high` element. Instead of a standard border, use a subtle 1px "inner glow" on the top edge using `outline-variant` at 20% opacity.
- **Category Dropdowns:** Must use the "Glass & Gradient" rule. The active selection should be highlighted with a `primary-container` (#8083ff) background and 0.25rem corner radius.

### Freelancer Status Chips
- Use `tertiary` (#c3d000) for "Available Now" indicators. The high-contrast chartreuse against the dark indigo background creates an immediate, premium "call to action" that feels modern and energetic.

---

## 6. Do’s and Don’ts

### Do:
- **Use Asymmetric Spacing:** Give more room to the top and left of a container than the bottom and right to create a "directional" flow.
- **Lean into Mono:** Use `Berkeley Mono` for anything involving numbers, dates, or "hard data."
- **Layer Surfaces:** Always ask "can I define this area with a background color shift instead of a line?"

### Don't:
- **Never use #000000:** The deepest black should be `surface-container-lowest` (#0a0e18). Pure black kills the "glass" effect.
- **No 100% Opaque Borders:** High-contrast borders break the "Ethereal" immersion.
- **Avoid Standard Grids:** Don't align everything to a rigid 12-column grid. Let some elements (like background meshes or decorative typography) break the margins to create depth.
- **No Dividers:** Forbid the use of `<hr>` or border-bottom for list items. Use 16px of `body-sm` vertical spacing instead.