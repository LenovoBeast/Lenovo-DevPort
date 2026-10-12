# Graph Report - Lenovo-DevPort  (2026-10-12)

## Corpus Check
- Corpus is ~37,253 words - fits in a single context window. You may not need a graph.

## Summary
- 66 nodes · 52 edges · 21 communities (11 shown, 10 thin omitted)
- Extraction: 48% EXTRACTED · 52% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.82)
- Token cost: 9,500 input · 2,300 output

## Community Hubs (Navigation)
- Bento Grid Layout / Dark Theme Graphite Su...
- Cabinet Grotesk / GSAP ScrollTrigger / Int...
- actions/checkout@v4 / actions/configure-pa...
- Capability Marquee Strip / Sticky Navigati...
- Project Accordion (3 panels) / Playground ...
- Practice Bento Grid / Project Accordion / ...
- Bento Grid Section / GSAP Bento Card Stack...
- CSS Custom Properties (:root) / prefers-co...
- Dark Mode Palette / Light Mode Palette / p...
- :focus-visible Keyboard Accessibility / pr...
- GSAP Gallery Heading Pin / GSAP Gallery Sc...
- Desktop Asymmetric Layouts / Mobile Breakp...
- Capability Marquee / Skills Grid (4 catego...
- Portal Grid (Terminal + Repo Feed) / GitHu...
- Capability Marquee
- About Section
- Contact Section
- HTML5 Doctype
- Schema.org Person (JSON-LD)
- Sticky Navigation Bar

## God Nodes (most connected - your core abstractions)
1. `Deploy to GitHub Pages` - 6 edges
2. `Playground (public experiments)` - 4 edges
3. `JetBrains Mono Terminal Typography` - 4 edges
4. `GSAP ScrollTrigger` - 3 edges
5. `Overview — Tech-Editorial Portal` - 3 edges
6. `index.html — Single-File Architecture` - 3 edges
7. `CSS Custom Properties (:root)` - 3 edges
8. `Project List (3 cards)` - 3 edges
9. `Project Accordion (3 panels)` - 3 edges
10. `Taste-Skill (design skill)` - 3 edges

## Surprising Connections (you probably didn't know these)
- `GitHub Pages Auto-Deploy` --references--> `Deploy to GitHub Pages`  [INFERRED]
  README.md → .github/workflows/deploy.yml
- `Overview — Tech-Editorial Portal` --references--> `Cabinet Grotesk`  [EXTRACTED]
  README.md → DESIGN_SYSTEM.md
- `Overview — Tech-Editorial Portal` --references--> `JetBrains Mono`  [EXTRACTED]
  README.md → DESIGN_SYSTEM.md
- `index.html — Single-File Architecture` --references--> `Practice Bento Grid`  [EXTRACTED]
  README.md → DESIGN_SYSTEM.md
- `index.html — Single-File Architecture` --references--> `Project Accordion`  [EXTRACTED]
  README.md → DESIGN_SYSTEM.md

## Communities (21 total, 10 thin omitted)

### Community 0 - "Bento Grid Layout / Dark Theme Graphite Su..."
Cohesion: 0.29
Nodes (8): Bento Grid Layout, Dark Theme Graphite Surface, Scroll Gallery Stack, Grayscale Image Treatment, Hero Section Layout, Lenovo Red Accent (#e2231a), LenovoBeast.png — Brand Mark Screenshot, Portfolio Accordion Panels

### Community 1 - "Cabinet Grotesk / GSAP ScrollTrigger / Int..."
Cohesion: 0.33
Nodes (6): Cabinet Grotesk, GSAP ScrollTrigger, IntersectionObserver Reveal, JetBrains Mono, prefers-reduced-motion, WCAG AA Contrast

### Community 2 - "actions/checkout@v4 / actions/configure-pa..."
Cohesion: 0.29
Nodes (7): actions/checkout@v4, actions/configure-pages@v4, Deploy to GitHub Pages, actions/deploy-pages@v4, GitHub Pages, actions/upload-pages-artifact@v3, GitHub Pages Auto-Deploy

### Community 3 - "Capability Marquee Strip / Sticky Navigati..."
Cohesion: 0.40
Nodes (5): Capability Marquee Strip, Sticky Navigation Bar, Terminal Shell (GitHub Feed), Cabinet Grotesk Display Typography, JetBrains Mono Terminal Typography

### Community 4 - "Project Accordion (3 panels) / Playground ..."
Cohesion: 0.80
Nodes (5): Project Accordion (3 panels), Playground (public experiments), Project List (3 cards), runs-on.dev (subdomain service), Taste-Skill (design skill)

### Community 5 - "Practice Bento Grid / Project Accordion / ..."
Cohesion: 0.50
Nodes (4): Practice Bento Grid, Project Accordion, Work Gallery Pin, index.html — Single-File Architecture

### Community 6 - "Bento Grid Section / GSAP Bento Card Stack..."
Cohesion: 0.50
Nodes (4): Bento Grid Section, GSAP Bento Card Stacking, GSAP Hero Parallax, Hero Section (asymmetric grid)

### Community 7 - "CSS Custom Properties (:root) / prefers-co..."
Cohesion: 0.50
Nodes (4): CSS Custom Properties (:root), prefers-color-scheme Media Query, Responsive Breakpoint (560px), Responsive Breakpoint (820px)

### Community 8 - "Dark Mode Palette / Light Mode Palette / p..."
Cohesion: 1.00
Nodes (3): Dark Mode Palette, Light Mode Palette, prefers-color-scheme

### Community 9 - ":focus-visible Keyboard Accessibility / pr..."
Cohesion: 0.67
Nodes (3): :focus-visible Keyboard Accessibility, prefers-reduced-motion Media Query, .reveal IntersectionObserver Animation

### Community 10 - "GSAP Gallery Heading Pin / GSAP Gallery Sc..."
Cohesion: 0.67
Nodes (3): GSAP Gallery Heading Pin, GSAP Gallery Scale/Fade, Scroll Gallery (pinned heading)

## Knowledge Gaps
- **39 isolated node(s):** `GitHub Pages`, `actions/checkout@v4`, `actions/configure-pages@v4`, `actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4` (+34 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 40 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 3 inferred relationships involving `Playground (public experiments)` (e.g. with `Project Accordion (3 panels)` and `runs-on.dev (subdomain service)`) actually correct?**
  _`Playground (public experiments)` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `GitHub Pages`, `actions/checkout@v4`, `actions/configure-pages@v4` to the rest of the system?**
  _39 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Are the 3 inferred relationships involving `JetBrains Mono Terminal Typography` (e.g. with `Capability Marquee Strip` and `Sticky Navigation Bar`) actually correct?**
  _`JetBrains Mono Terminal Typography` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `GSAP ScrollTrigger` (e.g. with `prefers-reduced-motion` and `IntersectionObserver Reveal`) actually correct?**
  _`GSAP ScrollTrigger` has 2 INFERRED edges - model-reasoned connections that need verification._