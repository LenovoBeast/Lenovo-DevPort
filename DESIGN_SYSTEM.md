# Lenovo Beast Portal Design System

## Direction

An editorial **index**. The page reads like a technical ledger rather than a marketing
landing page: numbered entries, hairline rules, monospace metadata, and one confident
display voice. Graphite surfaces and cool neutrals carry the structure; Lenovo red is the
only accent and it is used sparingly — a rule, an index number, a link.

The governing rule is **content density over decoration**. Nothing is on the page to fill
space. Where the previous build used a bento grid, a capability marquee, an accordion and a
pinned gallery to create rhythm, this build creates rhythm with typography, borders and
spacing — and spends the saved weight on real repository data.

## Tokens

### Dark mode

- Background: `#0d0f11`
- Soft background: `#131619`
- Surface: `#16191d`
- Raised surface: `#1b1f24`
- Primary text: `#f0f2f4`
- Secondary text: `#a3adb7`
- Tertiary text: `#8a949e`
- Border: `#272c32`
- Strong border: `#363c43`
- Accent: `#e2231a`
- Accent text: `#ff6b64`

### Light mode

- Background: `#f6f7f9`
- Soft background: `#eef0f3`
- Surface: `#ffffff`
- Raised surface: `#f1f3f6`
- Primary text: `#101418`
- Secondary text: `#525c66`
- Tertiary text: `#5f6a74`
- Border: `#d9dfe5`
- Strong border: `#c2cbd3`
- Accent: `#b51e1a`
- Accent text: `#8f1714`

Both modes share the same hierarchy, geometry and accent. The page follows
`prefers-color-scheme`; there is no manual toggle.

**Contrast.** Tertiary text and the accent are used at small sizes (10–12px) in chips,
feed metadata and eyebrow labels. Both clear WCAG AA (4.5:1) against their own background:
`--faint` measures ~6.2:1 (dark) and ~5.2:1 (light), `--accent-text` ~6.9:1 (dark) and
~8.4:1 (light). **Small red text always uses `--accent-text`, never `--accent`.**

## Typography

- **Display and body:** Cabinet Grotesk, self-hosted from `fonts/` as woff2 (400/500/700/800)
  with a system fallback. It is published by Fontshare (Indian Type Foundry) and is **not on
  Google Fonts** — requesting `Cabin+Grotesk` there returns HTTP 400 and silently drops the
  entire typeface to system sans.
- **Labels and metadata:** JetBrains Mono, loaded from Google Fonts with `preconnect`, with a
  system monospace fallback.
- **Scale:** hero `clamp(2.7rem, 7.2vw, 5.6rem)`, section headings `clamp(1.9rem, 4vw, 3rem)`,
  body `1rem`, metadata `0.66–0.7rem`.
- **Weights:** `800` for `h1`/`h2`/featured titles, `700` for row titles and buttons,
  `400` for body and metadata.
- Hero copy sets `text-wrap: balance`, and the emphasised word is a single word so it can
  never be split across lines at narrow widths.

## Components

- **Header** — sticky, hairline bottom border, blurred backdrop. Brand mark plus four
  anchors; the wordmark hides below 560px.
- **Hero** — eyebrow, statement, lede, two actions, then a three-cell stat strip.
- **Stat strip** — a 1px-gap grid over a border-coloured background, so the dividers are the
  gap rather than drawn lines. Values are server-rendered with honest defaults and are
  **recomputed from the GitHub API** when it responds.
- **Featured work** — two cards, each marked by a 2px accent top border, an index, a language
  chip, a large title, copy and links. Deliberately **typographic, with no image**: GitHub's
  OG card repeats the repository name and advertises "0 stars / 0 forks", so embedding it
  inside a card duplicated content and undercut the work.
- **Work rows** — a four-row index. `index / title+description / language+link`, separated by
  hairlines; hover slides the row in by 8px and tints the surface.
- **GitHub feed** — the remaining repositories as dense rows (name, one-line description,
  language, relative push date, live link). Limited to eight with a "showing N of M" status.
- **About** — two columns: statement, then a definition list of capability groups.
- **Contact** — statement plus two GitHub actions. See the note below about the email address.
- **Buttons** — 8px radius (not pills). Primary is Lenovo red on white; secondary is
  transparent with a strong border.
- **Radii** — one shared `12px` for cards and the stat strip; `8px` for buttons; `999px` only
  for chips.

### Assets

The brand mark and favicons ship pre-sized (`lenovo-beast-128.png`, `lenovo-beast-512.webp`
with a `.png` fallback, `favicon-32/48.png`, `apple-touch-icon.png`) instead of scaling the
940 KB source at render time. The full-resolution `LenovoBeast.png` stays in the repo as the
source artwork and as the social image, and is **not** published to the site.

## Motion

- CSS transitions plus one `IntersectionObserver`. **No animation library** — GSAP and
  ScrollTrigger were removed. They cost two blocking CDN scripts for decorative motion, and
  the earlier build's worst bugs came from GSAP and CSS transitions fighting over the same
  properties.
- Reveal is opt-in: the hidden start state is scoped to `html.js`, so with JavaScript
  disabled every section renders visible rather than blank.
- Hover states are limited to transform, border colour and background — no layout-shifting
  animation.
- `prefers-reduced-motion: reduce` disables reveals, smooth scrolling and hover transforms.

## Accessibility

- Skip link precedes the header; every interactive element has a visible focus ring.
- Reveal never hides content permanently (see above), and a failed `IntersectionObserver`
  falls back to revealing everything.
- Decorative indices carry `aria-hidden`; the feed is announced via `aria-live="polite"`.
- Horizontal overflow is clipped with `overflow-x: clip` (falling back to `hidden`), which
  removes sub-pixel sideways scroll without creating a scroll container that would break the
  sticky header.
- If the GitHub API is unavailable the feed degrades to a single explanatory row and the stat
  strip keeps its static values.

## Responsive behavior

- Below `860px`: featured cards stack, about and contact collapse to one column, the stat
  strip stacks, and work rows move their links beneath the description.
- Below `560px`: the wordmark hides, the hero steps down to `clamp(2.3rem, 10.5vw, 3.2rem)`,
  and feed rows become single-column.

## Known gap

The contact section intentionally links to GitHub instead of `mailto:`. The previous build
used `hello@lenovobeast.dev`, but `lenovobeast.dev` has no A or MX record, so mail to that
address cannot be delivered. Add a real address (and a `mailto:` action) once the domain
resolves.
