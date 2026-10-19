export type Project = {
  slug: string;
  name: string;
  tagline: string;
  year: string;
  role: string;
  platform: string;
  stack: string[];
  live?: string;
  code?: string;
  accent: string;
  summary: string;
  caseStudy: {
    problem: string;
    approach: string;
    result: string;
    bullets: string[];
  };
};

export const GITHUB_USER = "lenovobeast";
export const GITHUB_URL = `https://github.com/${GITHUB_USER}`;

/** Single source of truth for the contact address (Hero, Contact, JSON-LD). */
export const CONTACT_EMAIL = "LenovoBeast.905@gmail.com";

/**
 * Curated work. Copy is derived from each repository's own description so the
 * page never claims something the source does not say.
 */
export const projects: Project[] = [
  {
    slug: "impeccable",
    name: "impeccable",
    tagline: "A design language for AI harnesses",
    year: "2026",
    role: "Design + engineering",
    platform: "Web",
    stack: ["JavaScript", "Design system", "LLM tooling"],
    live: "https://impeccable.style",
    code: `${GITHUB_URL}/impeccable`,
    accent: "#00d4ff",
    summary:
      "The design language that makes your AI harness better at design. A shared visual vocabulary instead of generic output.",
    caseStudy: {
      problem:
        "Coding agents produce interfaces that are technically correct and visually interchangeable. The gap is not capability, it is vocabulary: without a shared standard, every generation starts from zero.",
      approach:
        "Encode a design language as something an agent can actually consume: spacing, type scale, colour roles, motion rules, and the reasoning behind them. Then ship it as a drop-in layer rather than a prompt you paste each time.",
      result:
        "A reusable reference that keeps generated interfaces coherent across sessions, with the rules written down so they can be argued with.",
      bullets: [
        "Design tokens expressed as machine-readable rules",
        "Contrast and hierarchy checks built into the language",
        "Documented as a reference, not a style prompt",
      ],
    },
  },
  {
    slug: "open-design",
    name: "open-design",
    tagline: "Your coding agent becomes the design engine",
    year: "2026",
    role: "Product + engineering",
    platform: "Desktop + Web",
    stack: ["Local-first", "HTML / PDF / PPTX", "BYOK"],
    live: "https://open-design.ai",
    code: `${GITHUB_URL}/open-design`,
    accent: "#7c3aed",
    summary:
      "A local-first design app that turns the agent you already use into a design engine: prototypes, dashboards, slides and video, exported as real files.",
    caseStudy: {
      problem:
        "Design output from AI usually dies inside a chat window. You get a screenshot, nothing you can hand to an engineer or open in a real tool.",
      approach:
        "Run the whole loop locally: the agent writes real files, the app renders them, and export produces HTML, PDF, PPTX or MP4 rather than an image of the result.",
      result:
        "An open alternative to hosted design tools that works with 20+ CLIs through your own keys, so the work stays on your machine.",
      bullets: [
        "Local-first: files never leave the device",
        "Real export formats, not screenshots",
        "Bring your own key across 20+ agent CLIs",
      ],
    },
  },
  {
    slug: "orca",
    name: "orca",
    tagline: "An ADE for a fleet of parallel agents",
    year: "2026",
    role: "Product engineering",
    platform: "Desktop + Mobile",
    stack: ["TypeScript", "Remote runtime", "Agents"],
    live: "https://onOrca.dev",
    code: `${GITHUB_URL}/orca`,
    accent: "#0066ff",
    summary:
      "The ADE for working with a fleet of parallel agents. Run any coding agent on your own subscription, on desktop, mobile or a remote runtime.",
    caseStudy: {
      problem:
        "Running several agents at once turns into a tab-management problem. Context scatters, sessions die, and you lose track of which agent is doing what.",
      approach:
        "Treat agents as a fleet with a shared console: one place to launch, watch and hand off, backed by a remote runtime so a session survives closing the laptop.",
      result:
        "Parallel work stays legible, and you keep using the subscription you already pay for.",
      bullets: [
        "Fleet view across concurrent sessions",
        "Remote runtime for long-running work",
        "Works with the agent you already use",
      ],
    },
  },
  {
    slug: "geolibre",
    name: "GeoLibre",
    tagline: "Cloud-native GIS that runs anywhere",
    year: "2025",
    role: "Engineering",
    platform: "Web + Desktop + Jupyter",
    stack: ["TypeScript", "Geospatial", "Cloud-native"],
    live: "https://geolibre.app",
    code: `${GITHUB_URL}/GeoLibre`,
    accent: "#10b981",
    summary:
      "A lightweight, cloud-native GIS platform for visualising, exploring and analysing geospatial data, in the browser, on desktop, on mobile, and inside Jupyter notebooks.",
    caseStudy: {
      problem:
        "Serious geospatial tooling is heavy, desktop-bound and expensive. Lightweight viewers cannot analyse, and analysis tools cannot be shared as a link.",
      approach:
        "One engine, several hosts: the same rendering and analysis core runs in a browser tab, a desktop shell, a phone and a notebook, so a view can be handed to someone without a licence.",
      result:
        "Exploration and analysis in the same place, deployable wherever the data already lives.",
      bullets: [
        "Shared core across four host environments",
        "Analysis and visualisation in one surface",
        "No heavyweight install to open a dataset",
      ],
    },
  },
  {
    slug: "free-llm",
    name: "Free-LLM API",
    tagline: "A live directory of free model access",
    year: "2025",
    role: "Engineering + data",
    platform: "Web",
    stack: ["TypeScript", "Data pipeline", "Daily sync"],
    live: "https://free-llm.com",
    code: `${GITHUB_URL}/Free-LLM`,
    accent: "#0066ff",
    summary:
      "A directory of 34+ free LLM and AI APIs: permanent free tiers, trial credits and no-card options. Synced daily from the live directory.",
    caseStudy: {
      problem:
        "Free-tier information rots fast. A list written last quarter is mostly wrong, and the difference between a real free tier and a trial that expires in a week is rarely stated.",
      approach:
        "Treat the directory as a data product: a scheduled sync keeps entries current, and every row records what kind of access it actually is.",
      result:
        "A reference that stays accurate without manual editing, and is honest about the catch on each entry.",
      bullets: [
        "Daily automated sync",
        "Explicit distinction between free tier and trial",
        "Filterable by provider and access type",
      ],
    },
  },
  {
    slug: "lenovo-devport",
    name: "Lenovo DevPort",
    tagline: "The portal you are reading",
    year: "2026",
    role: "Design + engineering",
    platform: "Web",
    stack: ["Next.js", "TypeScript", "Three.js"],
    live: "https://lenovobeast.github.io/Lenovo-DevPort/",
    code: `${GITHUB_URL}/Lenovo-DevPort`,
    accent: "#00d4ff",
    summary:
      "A developer portal rebuilt as a spatial interface: live repository data, a 3D centrepiece, and a design system documented in the open.",
    caseStudy: {
      problem:
        "Portfolios collapse under their own decoration. Elaborate layouts carry very little information, and the work itself becomes a background texture.",
      approach:
        "Make the data the material. Repository stats, languages and activity drive the visuals, and every section has to justify its space with something you can read.",
      result:
        "A page that stays fast while looking like it belongs to a different class of site. Static export, no server, no database.",
      bullets: [
        "Live GitHub data, graceful static fallback",
        "3D centrepiece lazy-loaded behind a static frame",
        "Static export, deployable to any CDN",
      ],
    },
  },
];

export type TimelineEntry = {
  marker: string;
  title: string;
  body: string;
  tags: string[];
};

/**
 * Thematic, not a biography. Replace the copy with real milestones when you
 * want this to read as a personal history rather than a focus timeline.
 */
export const timeline: TimelineEntry[] = [
  {
    marker: "Now",
    title: "Agentic tooling",
    body: "Building the layer between a model and a finished thing: harnesses, design languages and runtimes that make agent output usable rather than impressive.",
    tags: ["Agents", "Design systems", "Local-first"],
  },
  {
    marker: "2025",
    title: "Design meets AI",
    body: "Design stopped being a hand-off and became something a model could execute. Most of the work here is about giving that execution a standard to hit.",
    tags: ["Design tooling", "Evaluation"],
  },
  {
    marker: "2024",
    title: "Open source by default",
    body: "Everything that could be public became public. Shipping in the open changes what you are willing to claim, which turns out to be a useful constraint.",
    tags: ["Open source", "TypeScript"],
  },
  {
    marker: "2023",
    title: "Product engineering",
    body: "Full-stack product work across TypeScript, Python and Go. The period where interfaces, data models and deployment stopped being separate problems.",
    tags: ["TypeScript", "Python", "Go"],
  },
  {
    marker: "Earlier",
    title: "Foundations",
    body: "Systems, Linux and the long tail of tooling. The habit that stuck: understand the layer underneath before reaching for an abstraction over it.",
    tags: ["Linux", "Systems"],
  },
];

export type StackCluster = {
  id: string;
  label: string;
  color: string;
  nodes: string[];
  note: string;
};

export const stackClusters: StackCluster[] = [
  {
    id: "ai",
    label: "AI",
    color: "#7c3aed",
    nodes: ["Agents", "RAG", "Evaluation", "Prompting", "Tool use"],
    note: "Harnesses, evaluation and the design language that keeps model output coherent.",
  },
  {
    id: "web",
    label: "Web",
    color: "#00d4ff",
    nodes: ["React", "Next.js", "TypeScript", "Tailwind", "Three.js", "WebGL"],
    note: "Interfaces with real depth: rendering, motion, and state that stays predictable.",
  },
  {
    id: "backend",
    label: "Backend",
    color: "#0066ff",
    nodes: ["Node.js", "Python", "Go", "PostgreSQL", "Redis"],
    note: "APIs and data models that survive being read by someone else six months later.",
  },
  {
    id: "cloud",
    label: "Cloud",
    color: "#10b981",
    nodes: ["Docker", "CI/CD", "Terraform", "Edge", "Static export"],
    note: "Deployment as part of the design: cheap, reproducible, boring on purpose.",
  },
  {
    id: "linux",
    label: "Linux",
    color: "#e5e5e5",
    nodes: ["Arch", "CachyOS", "systemd", "Shell"],
    note: "The daily driver. Rolling release, tuned kernels, and a config that is version controlled.",
  },
  {
    id: "automation",
    label: "Automation",
    color: "#9ca3af",
    nodes: ["Dotfiles", "Scripts", "Git hooks", "Cron"],
    note: "Anything done twice becomes a script; anything done weekly becomes a pipeline.",
  },
  {
    id: "oss",
    label: "Open Source",
    color: "#00d4ff",
    nodes: ["MIT", "Docs", "Reviews", "Releases"],
    note: "Public by default, with the documentation treated as part of the deliverable.",
  },
];

export type Experiment = {
  name: string;
  status: "Active" | "Prototype" | "Research";
  body: string;
  href: string;
};

export const experiments: Experiment[] = [
  {
    name: "archify",
    status: "Active",
    body: "An agent skill for architecture, workflow and data-flow diagrams. Self-contained HTML with motion and crisp export.",
    href: `${GITHUB_URL}/archify`,
  },
  {
    name: "taste-skill",
    status: "Active",
    body: "Gives a model taste. Stops the generation of boring, generic output before it reaches a screen.",
    href: `${GITHUB_URL}/taste-skill`,
  },
  {
    name: "claude-hud",
    status: "Prototype",
    body: "A heads-up display for long agent sessions: what is running, what is waiting, and what needs a decision.",
    href: `${GITHUB_URL}/claude-hud`,
  },
  {
    name: "loop-engineering",
    status: "Research",
    body: "Notes on building reliable loops around non-deterministic systems: retries, budgets and stop conditions.",
    href: `${GITHUB_URL}/loop-engineering`,
  },
];

export const environment = {
  os: [
    { label: "Primary", value: "Arch Linux" },
    { label: "Secondary", value: "CachyOS" },
    { label: "Shell", value: "zsh + starship" },
    { label: "Editor", value: "VS Code / Neovim" },
  ],
  lines: [
    { prompt: "~", cmd: "uname -sr", out: "Linux 6.12.4-arch1-1" },
    { prompt: "~", cmd: "echo $SHELL", out: "/usr/bin/zsh" },
    { prompt: "~", cmd: "pacman -Q | wc -l", out: "1284" },
    { prompt: "~", cmd: "git config --get user.name", out: "LenovoBeast" },
  ],
};
