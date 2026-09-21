# Lenovo Beast Portfolio Design System

## Direction

The portfolio uses a restrained technical-editorial system. Graphite surfaces and cool neutral typography create the base; Lenovo red is the only accent. The design is intentionally quiet so the work and the writing carry the page.

## Tokens

### Dark mode

- Background: `#101214`
- Surface: `#171a1d`
- Strong surface: `#20252a`
- Primary text: `#f2f4f6`
- Secondary text: `#a6afb8`
- Tertiary text: `#737d87`
- Border: `#30373f`
- Accent: `#e2231a`
- Accent strong: `#ff625b`

### Light mode

- Background: `#f4f6f8`
- Surface: `#ffffff`
- Strong surface: `#e8edf1`
- Primary text: `#15191d`
- Secondary text: `#59636d`
- Tertiary text: `#7a858f`
- Border: `#cbd2d9`
- Accent: `#b51e1a`
- Accent strong: `#8f1714`

Both modes use the same hierarchy, geometry, and accent. The page follows the user's `prefers-color-scheme` setting.

## Typography

- Display and body: system UI stack for fast, native rendering.
- Labels and tags: system monospace stack.
- Headings use tight tracking and a restrained scale rather than oversized decorative type.

## Components

- Buttons use a single 999px pill radius. Primary buttons use Lenovo red with white text. Secondary buttons are transparent with a neutral border.
- Project surfaces use one shared 14px radius, a 1px border, and no artificial glow.
- Layout hierarchy comes from spacing, borders, and contrast before shadows.
- Images are real photography with a restrained grayscale treatment. No fake dashboard or terminal previews.

## Motion and accessibility

- Sections reveal once on entry with `IntersectionObserver`.
- Motion only uses opacity and transform.
- `prefers-reduced-motion` removes reveal movement and smooth scrolling.
- All interactive elements have visible keyboard focus states.
- Body text and controls are calibrated for WCAG AA contrast.

## Responsive behavior

- Desktop layouts use asymmetric grids for the hero, about section, and projects.
- Below `820px`, grids collapse to one column where needed.
- Below `560px`, navigation, skills, and footer content simplify for narrow screens.
