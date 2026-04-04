# Design System Strategy: SAATHI E-Learning Platform

## 1. Overview & Creative North Star: "The Guided Sanctuary"
This design system moves away from the cluttered, high-pressure aesthetics of traditional EdTech. Our North Star is **The Guided Sanctuary**—an environment that feels premium yet accessible, sophisticated yet supportive. We borrow the structural clarity of Notion and the polished fluidity of Stripe to create an editorialized learning experience.

We break the "template" look by rejecting the rigid grid in favor of **intentional asymmetry**. Hero sections should utilize "The Breathable Offset," where content sits slightly off-center to allow for large-scale typography and floating "glass" elements that create a sense of depth and motion.

---

## 2. Colors & Surface Philosophy
The palette is grounded in the stability of `primary` (#3525cd) but breathes through a sophisticated use of neutral surface tiers.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders (`outline`) for sectioning content. To define boundaries, you must use **Background Color Shifts**. 
*   *Example:* A `surface-container-low` (#f3f4f5) sidebar sitting against a `surface` (#f8f9fa) main canvas.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine paper.
- **Base:** `surface` (#f8f9fa)
- **Primary Content Areas:** `surface-container-low` (#f3f4f5)
- **Interactive Cards:** `surface-container-lowest` (#ffffff) to create a natural "pop."
- **Nesting:** When placing a card inside a container, the card must always be one tier "brighter" than its parent to signify elevation.

### The "Glass & Gradient" Rule
To elevate the platform above "budget" competitors, use **Glassmorphism** for floating navigation and progress overlays. 
- Use `surface_container_lowest` at 70% opacity with a `backdrop-blur` of 20px.
- **Signature Texture:** Apply a subtle linear gradient to main CTAs (from `primary` #3525cd to `primary_container` #4f46e5) at a 135° angle to add "soul" to the action.

---

## 3. Typography: Editorial Authority
We use a high-contrast pairing to balance academic authority with modern friendliness.

- **Display & Headlines (Manrope):** Large, bold, and tight-kerning. These are used for "Editorial Moments"—course titles and major section headers. The `display-lg` (3.5rem) should be used sparingly to create a "magazine" feel.
- **Body & Labels (Inter):** Highly legible and utilitarian. We use `body-md` (0.875rem) as our workhorse to ensure dense learning material remains digestible.
- **Visual Hierarchy:** Headlines use `on_surface` (#191c1d) while secondary metadata uses `on_surface_variant` (#464555) to create a natural reading rhythm without needing lines.

---

## 4. Elevation & Depth
We convey importance through **Tonal Layering** rather than structural geometry.

- **The Layering Principle:** Avoid shadows for static components. A `surface-container-highest` card on a `surface` background provides enough contrast to denote a clickable area.
- **Ambient Shadows:** For "Floating" states (modals, active dropdowns), use a multi-layered shadow: `0 20px 40px -10px rgba(77, 68, 227, 0.08)`. The shadow is tinted with the `surface_tint` to keep the light feeling natural.
- **The "Ghost Border" Fallback:** If a divider is mandatory for accessibility, use `outline_variant` (#c7c4d8) at **15% opacity**. Never use a 100% opaque border.
- **Glassmorphism Depth:** Elements using glass effects should have a 1px inner highlight (border-top) of `white` at 20% opacity to mimic the edge of a glass pane.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), `xl` (1.5rem) corner radius. No border.
- **Secondary:** `surface-container-high` background with `primary` text.
- **Tertiary:** Pure text with an `underline` that appears only on hover.
- **State:** On hover, use a `2px` translateY lift rather than a color change.

### The "Course Card" (Signature Component)
- **Structure:** No borders. Background `surface-container-lowest` (#ffffff).
- **Shadow:** None. Use a `0.5rem` (8) gap between cards.
- **Interaction:** On hover, the card transitions to a slightly higher surface tint and gains a soft ambient shadow.

### Input Fields
- **Style:** `surface-container-low` background, no border.
- **Focus State:** Background remains the same, but a `2px` `outline` of `primary` (at 30% opacity) appears.
- **Labels:** Use `label-md` (Inter) positioned strictly above the field, never as a placeholder.

### Lists & Progress Tracking
- **The "No-Divider" Rule:** Use `6` (1.5rem) of vertical whitespace to separate list items. 
- **Progress Bars:** Use `secondary` (#006c49) for completion. The track should be `secondary_container` at 30% opacity.

---

## 6. Do’s and Don’ts

### Do
- **Do** use asymmetrical white space. If a heading is left-aligned, try right-aligning the supporting body text in the next column to create "The Z-Pattern."
- **Do** use `secondary_fixed` (#6ffbbe) for "Success" or "Purchased" states to provide a calming, premium feel.
- **Do** utilize the `2xl` (1.5rem) radius for large containers and `lg` (1rem) for smaller buttons/chips to maintain a "soft-touch" interface.

### Don't
- **Don't** use pure black (#000000) for text. Always use `on_surface` (#191c1d).
- **Don't** use standard "box-shadows" on every card. It creates visual noise and cheapens the "Sanctuary" vibe.
- **Don't** use dividers to separate lessons in a module. Use a background toggle: `surface-container-low` for lesson 1, `surface` for lesson 2.
- **Don't** cram the UI. If you think there is enough padding, add `spacing.4` (1rem) more.