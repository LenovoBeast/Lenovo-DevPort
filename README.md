<div align="center">

# Lenovo-DevPort — BeastOS

**A spatial developer portal. Developer. Builder. Open Source.**

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-lenovobeast.github.io-e2231a?style=for-the-badge)](https://lenovobeast.github.io/Lenovo-DevPort/)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-222?style=for-the-badge&logo=github)](https://github.com/LenovoBeast/Lenovo-DevPort)
[![MIT License](https://img.shields.io/badge/License-MIT-222?style=for-the-badge)](LICENSE)

</div>

---

## 👁️ Live

👉 **[lenovobeast.github.io/Lenovo-DevPort](https://lenovobeast.github.io/Lenovo-DevPort/)**

---

## ✨ What this is

A personal technology ecosystem, not a portfolio template. The page is built as a spatial
interface: a 3D centrepiece, live repository data, an interactive technology constellation and
a repository orbital map.

**Stack:** Next.js 14 (App Router, static export) · TypeScript · Tailwind CSS · Framer Motion ·
Three.js / React Three Fiber · GSAP (lazy, one section only).

**Design principles:**

- Dark graphite canvas with one accent family (blue → cyan → violet), used sparingly
- Cabinet Grotesk display type (self-hosted) with a monospace metadata layer
- Glass surfaces built from layered gradients and inset highlights, not blur alone
- Motion explains state; it never decorates empty space
- Live data with honest static fallbacks — the page never shows a blank state

See [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) for tokens, type scale, components and the motion
contract.

---

## 🚀 Develop

```bash
cd beastos
npm install
npm run dev          # http://localhost:3000
```

## 🏗 Build

```bash
cd beastos
npm run build        # static export -> beastos/out
```

The export is fully static: no server, no database, no runtime dependencies.

To reproduce the production asset paths locally:

```bash
# Git Bash mangles a leading "/" — disable path conversion
MSYS_NO_PATHCONV=1 NEXT_PUBLIC_BASE_PATH=/Lenovo-DevPort npm run build
```

`NEXT_PUBLIC_BASE_PATH` must match the repository name, because GitHub Pages project sites are
served from `/<repo>/`.

---

## 📁 Structure

```
├── beastos/                    # The site (Next.js app)
│   ├── app/
│   │   ├── layout.tsx          # Fonts, metadata, JSON-LD
│   │   ├── page.tsx            # Section composition
│   │   └── globals.css         # Tokens, glass primitives, motion defaults
│   ├── components/
│   │   ├── Hero.tsx            # Spatial hero (3D lazy-loaded)
│   │   ├── scene/BeastCore.tsx # R3F scene: core, rings, particles
│   │   ├── Timeline.tsx        # GSAP scroll journey
│   │   ├── StackConstellation.tsx  # Canvas constellation
│   │   ├── Work.tsx            # Project showcase + case study modal
│   │   ├── Ecosystem.tsx       # Repository orbital map (live GitHub)
│   │   ├── Lab.tsx             # Terminal + experiments
│   │   └── Contact.tsx         # Contact portal
│   ├── lib/                    # Content and media-query hooks
│   ├── public/                 # Icons, robots, sitemap
│   └── fonts/                  # Cabinet Grotesk (woff2)
├── .github/workflows/deploy.yml
├── DESIGN_SYSTEM.md
└── LICENSE
```

The previous hand-written static site still exists in git history at commit `3b0eb24`.

---

## 🔧 Editing content

Almost everything lives in **`beastos/lib/data.ts`**:

| What | Export |
|---|---|
| Featured projects + case studies | `projects` |
| Journey timeline | `timeline` |
| Technology clusters | `stackClusters` |
| Lab experiments | `experiments` |
| Terminal / environment | `environment` |

Repo counts, the GitHub feed and the orbital map are fetched live from the GitHub API and fall
back to static data when it is unavailable or rate-limited.

### Contact address

`components/Contact.tsx` has a `CONTACT.email` constant, currently empty on purpose: the
previous site shipped `hello@lenovobeast.dev`, but `lenovobeast.dev` has no A or MX record, so
that address cannot receive mail. Set a working address and the third channel appears.

---

## 🌐 Deployment

`.github/workflows/deploy.yml` installs, builds the static export and publishes `beastos/out`
to GitHub Pages on every push to `main`.

| Setting | Value |
|---|---|
| Pages build type | GitHub Actions (`build_type: workflow`) |
| Published path | `beastos/out` |
| Base path | `/Lenovo-DevPort` |
| URL | `https://lenovobeast.github.io/Lenovo-DevPort/` |

> **Gotcha:** if the repository's Pages `build_type` is `legacy`, this workflow runs green but
> its artifact is ignored — the branch root is published instead. Check with
> `gh api repos/LenovoBeast/Lenovo-DevPort/pages`.

---

## 📜 License

MIT — see [`LICENSE`](LICENSE).
