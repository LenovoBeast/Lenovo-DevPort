<div align="center">

# Lenovo-DevPort

**Personal landing page — developer, builder, open source.**

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-lenovobeast.github.io-e2231a?style=for-the-badge)](https://lenovobeast.github.io/Lenovo-DevPort/)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-222?style=for-the-badge&logo=github)](https://github.com/LenovoBeast/Lenovo-DevPort)
[![MIT License](https://img.shields.io/badge/License-MIT-222?style=for-the-badge)](LICENSE)

</div>

---

## 👁️ Live Preview

👉 **[View Live Site →](https://lenovobeast.github.io/Lenovo-DevPort/)**

Deployed via GitHub Pages on every push to `main`:

```
https://lenovobeast.github.io/Lenovo-DevPort/
```

---

## ✨ Overview

An editorial **index** of the work: numbered entries, hairline rules, monospace metadata and
one confident display voice. Vanilla HTML, CSS and JavaScript — no build step, no framework,
no animation library.

**Design principles:**

- Graphite surfaces with Lenovo red as the single, sparing accent
- Cabinet Grotesk display type (self-hosted) with JetBrains Mono metadata
- Content density over decoration — no marquee, bento grid or accordion filler
- Typographic project cards rather than embedded screenshots
- Live public repository data, with a static fallback when the API is unavailable
- CSS-only motion, `prefers-reduced-motion` support, and visible focus states

See [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) for tokens, type scale, components and the
reasoning behind the motion decisions.

---

## 🚀 Quick Start

```bash
git clone https://github.com/LenovoBeast/Lenovo-DevPort.git
cd Lenovo-DevPort

# Serve locally (pick one)
npx serve
python -m http.server 8000
```

Serve over HTTP rather than opening the file directly — the self-hosted fonts and the
GitHub API request both behave better with a real origin.

---

## 📁 Structure

```
├── index.html                 # The entire page
├── 404.html                   # Branded not-found page
├── robots.txt / sitemap.xml   # Crawler hints
├── LICENSE                    # MIT
├── DESIGN_SYSTEM.md           # Tokens, typography, components, motion
├── fonts/                     # Self-hosted Cabinet Grotesk (woff2, 4 weights)
├── lenovo-beast-128.png       # Brand mark (header)
├── lenovo-beast-512.webp/.png # Social image
├── favicon-32.png / favicon-48.png / apple-touch-icon.png
├── LenovoBeast.png            # Full-resolution source artwork (not published)
├── graphify-out/              # Knowledge graph output (not published)
└── .github/workflows/deploy.yml
```

---

## 🔧 Customization

Everything lives in `index.html`.

| What | Where |
|---|---|
| Name, nav, footer | `<header>`, `<footer>` |
| Hero statement and lede | `.hero` |
| Headline stats | `.stats` — static defaults, refreshed from the GitHub API |
| Featured projects | `.featured` — two `.feature` cards |
| Project index | `.work-list` — `.work-row` entries |
| GitHub feed | `FEATURED` array + `MAX` in the inline script |
| Capabilities | `.caps` definition list |
| Contact actions | `.contact-actions` |

To change which projects are featured, edit the `.featured` / `.work-list` markup **and** the
`FEATURED` array in the script so the live feed does not repeat them.

### Contact address

The contact section links to GitHub rather than using `mailto:`. The previous build used
`hello@lenovobeast.dev`, but `lenovobeast.dev` currently has no A or MX record, so that
address cannot receive mail. Once the domain resolves, replace the `.contact-actions` links
with a `mailto:` button.

---

## 🌐 Deployment

The workflow in `.github/workflows/deploy.yml` assembles a `_site/` directory containing only
the files the site needs, then publishes that. Publishing the repository root used to expose
`README.md`, `DESIGN_SYSTEM.md` and the 940 KB source artwork on the public site.

| Setting | Value |
|---|---|
| Source | `main` |
| Published path | `_site` (assembled in CI) |
| URL | `https://lenovobeast.github.io/Lenovo-DevPort/` |

---

## 📜 License

MIT — see [`LICENSE`](LICENSE).
