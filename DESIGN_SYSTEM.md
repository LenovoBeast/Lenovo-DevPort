# BeastOS — Design System

## Direction

A **spatial developer portal**. The page is framed as an operating system for a developer's
work rather than a marketing site: a dark canvas, glass surfaces, one 3D centrepiece, and live
data used as material rather than decoration.

The governing rule is **earned motion**. Every animation explains a state change — an element
entering, a card expanding, a selection moving. Nothing loops for atmosphere except the hero
core and the repository orbits, both of which are content-bearing.

## Tokens

Defined once in `app/globals.css` and mirrored in `tailwind.config.ts`.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#050505` | Page canvas |
| `--bg-1` / `--bg-2` | `#090909` / `#111111` | Recessed panels, terminal body |
| `--fg` | `#ffffff` | Primary text |
| `--fg-soft` | `#e5e5e5` | Secondary text |
| `--fg-mute` | `#9ca3af` | Body copy, metadata (~7:1 on `--bg`) |
| `--line` | `rgba(255,255,255,0.08)` | Hairlines and glass borders |
| `--primary` | `#0066ff` | Accent family base |
| `--secondary` | `#00d4ff` | Interactive highlight, focus ring |
| `--accent` | `#7c3aed` | Tertiary accent, per-project tinting |
| `--success` | `#10b981` | Status indicators |

Backgrounds are deliberately near-black rather than pure black so glass edges and shadows
remain visible.

## Typography

- **Display and body:** Cabinet Grotesk, self-hosted via `next/font/local` from `fonts/`
  (400/500/700/800). Published by Fontshare — **not on Google Fonts**; requesting
  `Cabin+Grotesk` from Google returns HTTP 400 and silently drops the typeface.
- **Metadata:** a system monospace stack (`--font-mono`), used for labels, indices and terminal
  content.
- **Scale:** hero `clamp(3rem, 9vw, 7.5rem)`, section headings `clamp(2.1rem, 4.6vw, 3.6rem)`,
  body `0.92–1rem`, metadata `0.6–0.7rem` uppercase with wide tracking.
- Display weight is `800` with `-0.045em` tracking; headings use `text-wrap: balance`.

## Surfaces

Two primitives only:

- **`.glass`** — 20px backdrop blur, a vertical white gradient at 2–5% alpha, 1px border, and an
  inset top highlight. Used for cards and panels.
- **`.glass-strong`** — same recipe at higher alpha with a deeper shadow. Used for the case
  study modal and the terminal.

Glass is built from gradient + border + inset highlight; blur alone reads as fog on a dark
canvas.

## Components

| Component | Notes |
|---|---|
| **Hero** | Asymmetric: copy left, 3D right. Copy is a Framer stagger; the scene is `dynamic(ssr:false)`. |
| **Stats** | Live GitHub numbers, animated with a single rAF count-up that re-targets when the API responds. |
| **Timeline** | GSAP `ScrollTrigger` scrub drives a gradient rail; entries fade up once. |
| **Stack constellation** | Canvas 2D. Seven hub clusters with satellite nodes; hub selection mirrored by real buttons for keyboard users. |
| **Work** | Two large covers + a dense index. Covers are generated (gradient + grid + monogram) because there are no screenshots to show. Cards open a case study modal. |
| **Ecosystem** | SVG orbital map driven by the GitHub API; three orbits, language-coloured nodes, inspector panel. |
| **Lab** | Terminal panel with a spec grid, plus the experiment list with status chips. |
| **Contact** | Magnetic buttons via `useMotionValue` + `useSpring` (no re-render per frame). |

## Motion contract

- **One library per component.** Framer owns UI motion; GSAP owns the timeline rail. They never
  animate the same node.
- **GPU properties only:** `transform`, `opacity`, `filter`. No layout animation.
- **3D is conditional:** the hero canvas renders only when the viewport is ≥768px, the pointer is
  fine, and reduced motion is off. Touch and small screens get a static ring composition.
- **The render loop stops** when the hero scrolls out of view (`frameloop="never"` via
  `IntersectionObserver`).
- **three.js is lazy:** `dynamic(() => import(...), { ssr: false })` keeps ~150KB out of the
  initial bundle (first load JS is 142KB).
- `prefers-reduced-motion: reduce` disables reveals, parallax, count-ups, orbital rotation and
  the hero scene. Verified: reduced motion renders one canvas, zero hidden sections.

## Accessibility

- Skip link, visible focus ring (`outline`, not shadow), semantic headings.
- The case study modal is a real `role="dialog"` with `aria-modal`, focus moved to the close
  button, `Escape` to dismiss, and body scroll locked.
- The constellation canvas has `role="img"` plus an accessible button group; the orbital map has
  an equivalent "jump to" selector.
- Canvas and WebGL content is `aria-hidden` and purely decorative.
- All live-updating text sits in an `aria-live="polite"` region or is a direct result of user
  action.

## Performance

- Static export, no server. First Load JS 142KB; the 3D chunk loads after paint.
- `dpr` capped at 1.75 for WebGL and 2 for the 2D canvases.
- Canvas loops pause off-screen; particle count is fixed (620) and the scene is not rendered on
  touch devices at all.
- Images: none in the initial viewport. The only raster assets are favicons and the OG image.

## Responsive

- `<768px`: hero 3D replaced by a static ring composition; stats wrap; work covers stack.
- `<860px`: about/contact collapse to one column; the constellation legend moves below the canvas.
- `<560px`: wordmark hides, hero type steps down, feed rows go single-column.

## Known gaps

- The timeline copy is thematic, not biographical. Replace it in `lib/data.ts` with real
  milestones when you want it to read as a personal history.
- Project covers are generated (gradient + grid + monogram). Real screenshots would be the
  natural upgrade.
