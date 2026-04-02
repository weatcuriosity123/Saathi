# Design System Document: The Scholarly Horizon

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Curator"**

In the saturated world of e-learning, we must move beyond the "utilitarian portal" aesthetic. The Digital Curator treats educational data and administrative workflows with the same reverence as a high-end editorial publication. This design system rejects the rigid, boxed-in nature of traditional SaaS dashboards in favor of an expansive, airy, and layered environment. 

We break the "template" look through **intentional asymmetry**—using wide gutters and varying column widths—and **tonal layering**. By eliminating harsh dividers and embracing "white space as structure," we create a signature experience that feels premium, authoritative, and focused. The interface does not shout; it guides.

## 2. Colors & Surface Logic
The palette is rooted in a core of academic blue, supported by a sophisticated range of neutral surfaces that define hierarchy without the need for lines.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section off the UI. Sectional boundaries must be defined solely through background color shifts. For instance, a sidebar using `surface_container_low` should sit against a `background` workspace, creating a natural, effortless distinction.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine vellum.
*   **Base Layer (`background` / #f8f9fa):** The canvas.
*   **Sectional Layer (`surface_container_low` / #f3f4f5):** Used for large secondary regions like sidebars or utility panels.
*   **Content Layer (`surface_container_lowest` / #ffffff):** Your primary cards and data containers. This is where the user's focus lives.
*   **Interaction Layer (`surface_bright`):** Reserved for elements that need to "pop" or draw immediate attention.

### The "Glass & Gradient" Rule
To inject "soul" into the professional environment, use **Glassmorphism** for floating elements (e.g., dropdowns, floating action buttons). Apply `surface_container_lowest` at 80% opacity with a `20px` backdrop blur. 
*   **Signature Textures:** For primary CTAs and high-level metric cards, use a subtle linear gradient: `primary` (#0058be) to `primary_container` (#2170e4) at a 135-degree angle.

## 3. Typography
We use a dual-typeface system to balance administrative efficiency with editorial elegance.

*   **Display & Headlines (Manrope):** This typeface provides a modern, slightly geometric "architectural" feel. Use `display-lg` for welcome states and `headline-sm` for dashboard section titles.
*   **Body & Labels (Inter):** The workhorse. Inter’s high x-height ensures that dense data tables and student lists remain legible at small scales.

**Hierarchy as Identity:**
*   **Hero Metrics:** Use `display-md` in `on_surface` with a tight letter-spacing (-0.02em).
*   **Data Labels:** Use `label-md` in `on_surface_variant` with all-caps styling and 0.05em tracking to denote professionalism.

## 4. Elevation & Depth
We define depth through **Tonal Layering** rather than structural geometry.

*   **The Layering Principle:** Place a `surface_container_lowest` card on a `surface_container_low` background. The contrast (White on Soft Gray) provides all the "lift" required for a modern SaaS look.
*   **Ambient Shadows:** When a card requires a "floating" state (e.g., a hovered course card), use an extra-diffused shadow: `offset: 0, 12px; blur: 32px; color: rgba(0, 88, 190, 0.06)`. Note the blue tint in the shadow to keep the UI "clean" rather than "dirty" (grey).
*   **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., input fields), use `outline_variant` at 20% opacity. **Never use 100% opaque borders.**

## 5. Components

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary_container`), `lg` (1rem) rounded corners, `on_primary` text.
*   **Tertiary (Ghost):** No background, `primary` text. Use for low-emphasis actions like "Cancel" or "View All."

### Data Tables (The "Refined Grid")
*   **Forbid Dividers:** Do not use horizontal lines between rows. Instead, use a subtle `surface_container_low` background on `:hover`.
*   **High Contrast:** Header text must be `label-sm` in `on_surface_variant`. Data cells use `body-md`.

### Input Fields
*   **Visual Style:** `surface_container_lowest` fill with a `Ghost Border`. On focus, transition the border to `primary` at 100% and add a soft `primary_fixed` outer glow (4px).

### Cards & Lists
*   **Spacing:** Use `spacing-6` (1.5rem) as the default internal padding. 
*   **Separation:** Use vertical white space (`spacing-8`) to separate content blocks rather than lines.

### E-Learning Specific Components
*   **Progress Orbs:** Use a circular stroke with `primary_fixed` as the track and `primary` as the progress indicator.
*   **Instructor Floating Badge:** A semi-transparent glass chip (`surface_container_lowest` @ 70% opacity) that overlays course thumbnails.

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts (e.g., a 2/3 width main feed with a 1/3 width "Course Insights" sidebar).
*   **Do** use the `tertiary` color (#924700) for "Achievement" or "Certification" moments to provide warmth.
*   **Do** prioritize `spacing-12` (3rem) between major dashboard modules to allow the design to breathe.

### Don't
*   **Don't** use black (#000000). Use `on_surface` (#191c1d) for maximum readability and a premium feel.
*   **Don't** use standard `0.5rem` (md) corners. Stick strictly to `lg` (1rem) for containers to maintain the "soft" professional aesthetic.
*   **Don't** stack white cards directly on top of white backgrounds. Ensure there is always a tonal shift (e.g., white card on `surface_container_low`).