# Lenovo Beast Portal Design System

## Direction

The portal uses a technical-editorial system with a more expressive Behance-style composition. Graphite surfaces and cool neutral typography create the base; Lenovo red is the only accent. Movement is used to establish hierarchy, never to decorate empty space.

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

- Display and body: Cabinet Grotesk, loaded from Google Fonts with a system fallback.
- Labels and terminal content: JetBrains Mono with a system monospace fallback.
- Hero headings use a wide `78rem` maximum and `clamp(3rem, 6vw, 6.5rem)` sizing so they stay within two or three lines on desktop.

## Components

- Buttons use a single 999px pill radius. Primary buttons use Lenovo red with white text. Secondary buttons are transparent with a neutral border.
- Project surfaces use one shared 14px radius, a 1px border, and no artificial glow.
- Layout hierarchy comes from spacing, borders, and contrast before shadows.
- Images are GitHub-native repository previews and profile assets with restrained grayscale treatment.
- The practice bento is a four-column, four-row dense grid with five intentional cells and no unused desktop cells.
- The project accordion expands the hovered panel horizontally to reveal its case-study copy.
- The capability marquee provides a quiet continuous rhythm between major chapters.
- The work gallery pins its left heading while right-side repository previews scale from `0.8` to `1` and fade as they leave the viewport.

## Motion and accessibility

- Sections reveal once on entry with `IntersectionObserver`.
- GSAP and ScrollTrigger handle pinned gallery motion, image scale/fade, hero parallax, and bento card stacking.
- `prefers-reduced-motion` removes reveal movement and smooth scrolling.
- All interactive elements have visible keyboard focus states.
- Body text and controls are calibrated for WCAG AA contrast.
- If GSAP or the GitHub API is unavailable, the static layout and fallback repository message remain usable.

## Responsive behavior

- Desktop layouts use an asymmetrical hero, dense bento, pinned gallery, and horizontal accordion.
- Below `820px`, grids collapse to one column where needed.
- Below `560px`, navigation, skills, and footer content simplify for narrow screens.
