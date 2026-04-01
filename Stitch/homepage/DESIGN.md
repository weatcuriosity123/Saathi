# Design System Specification: The Fluid Scholar

## 1. Overview & Creative North Star
**Creative North Star: The Editorial Architect**
The objective of this design system is to move beyond the "template" look of standard e-learning platforms. We are shifting toward an **Editorial Architect** aesthetic—where the structure is felt through whitespace rather than lines, and the hierarchy is driven by bold, authoritative typography. 

We break the rigid grid through intentional asymmetry: using expansive margins (inspired by Stripe) and "nested depth" where surfaces appear to float or sink based on tonal shifts. This system prioritizes a "Modern Startup" premium feel, utilizing glassmorphism and multi-layered shadows to create a tactile, high-end digital environment.

---

## 2. Color & Surface Philosophy
We utilize a sophisticated Material 3-based palette, but our implementation is strictly non-traditional.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. 
Boundaries must be created through background shifts. For example, a `surface-container-low` (#f5f2ff) section should sit directly against a `surface` (#fcf8ff) background. This creates a "soft edge" that feels integrated and premium.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of semi-transparent materials.
- **Base Layer:** `surface` (#fcf8ff)
- **Secondary Content Area:** `surface-container-low` (#f5f2ff)
- **Cards/Action Areas:** `surface-container-lowest` (#ffffff) for maximum "pop."
- **Nesting:** When placing a card inside a section, use `surface-container-lowest` on top of `surface-container-low`. The 1-step tonal shift provides all the "border" you need.

### The "Glass & Gradient" Rule
To inject "soul" into the UI:
- **Glassmorphism:** For floating navigation or modal overlays, use `surface` at 70% opacity with a `24px` backdrop-blur. 
- **Signature Gradients:** Primary CTAs should not be flat. Use a subtle linear gradient (135°) from `primary` (#3525cd) to `primary-container` (#4f46e5).

---

## 3. Typography: The Manrope Scale
Manrope is our voice. It must feel intentional, not just functional.

*   **Display (Display-LG: 3.5rem):** Reserved for hero moments. Use -2% tracking (letter-spacing) and a tight 1.1 line-height.
*   **Headlines (Headline-LG: 2rem):** Bold and commanding. These define the start of new concepts. Use -1% tracking.
*   **Titles (Title-LG: 1.375rem):** Semi-bold. Used for card headings and section titles.
*   **Body (Body-LG: 1rem):** Our workhorse. Increase leading to 1.6 for "Stripe-like" readability. Use 0% tracking to ensure the variable font remains legible at scale.
*   **Labels (Label-MD: 0.75rem):** All-caps with +5% tracking for auxiliary info (e.g., "COURSE CATEGORY").

---

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering** and **Ambient Shadows**, never through heavy outlines.

### The Layering Principle
Hierarchy is a "stack." 
1. Level 0: `surface` (Background)
2. Level 1: `surface-container-low` (Content Wells)
3. Level 2: `surface-container-lowest` (Cards/Interaction)

### Ambient Shadows
For elements that require a "floating" effect (e.g., Primary Buttons, Hovered Cards):
- **Blur:** 32px to 48px.
- **Opacity:** 4% to 8%.
- **Color:** Use a tinted shadow. Instead of black, use `on-surface` (#1b1b24) at low opacity to keep the shadow feeling "airy" and natural.

### The "Ghost Border"
If accessibility requires a container boundary, use a **Ghost Border**: `outline-variant` (#c7c4d8) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
- **Primary:** Gradient from `primary` to `primary-container`. Corner radius: `xl` (1.5rem). Shadow: Ambient Indigo.
- **Secondary:** Surface: `secondary-container` (#6cf8bb). Text: `on-secondary-container` (#00714d). No border.
- **Tertiary:** Text-only using `primary`. Use for low-emphasis actions like "Cancel" or "Learn More."

### Cards
- **Construction:** Use `surface-container-lowest` (#ffffff).
- **Radius:** `xl` (1.5rem) or `2xl` (calculated as 2rem for hero cards).
- **Constraint:** **Zero dividers.** Separate header, body, and footer using `spacing-6` (2rem) of vertical whitespace.

### Input Fields
- **Default State:** `surface-container-high` (#eae6f4) background. No border.
- **Focus State:** `surface-container-lowest` background with a 2px `primary` "Ghost Border" (20% opacity).
- **Rounding:** `md` (0.75rem) to differentiate from the softer buttons.

### Progress & Feedback
- **Course Progress:** Use `secondary` (#006c49) for completion.
- **Urgency/Alerts:** Use `tertiary` (#7b3300) for "Orange" accents to draw attention without the "stop-sign" energy of red.

---

## 6. Do's and Don'ts

### Do:
- **Embrace White Space:** If a layout feels "busy," double the spacing scale (e.g., move from `spacing-4` to `spacing-8`).
- **Use Nested Surfaces:** Place white cards on light purple backgrounds to create depth.
- **Tighten Large Type:** Reduce line-height on Display and Headline styles to create an editorial, "locked-in" look.

### Don't:
- **Don't use 1px borders:** This is the quickest way to make the platform look like a generic dashboard. Use background color shifts instead.
- **Don't use pure black shadows:** Shadows must be soft and tinted to maintain the "premium startup" feel.
- **Don't crowd the edges:** Maintain a minimum page margin of `spacing-10` (3.5rem) on desktop to give the content room to breathe.