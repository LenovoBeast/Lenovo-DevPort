import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { CONTACT_EMAIL } from "@/lib/data";
import "./globals.css";

const display = localFont({
  src: [
    { path: "../fonts/cabinet-grotesk-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/cabinet-grotesk-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/cabinet-grotesk-700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/cabinet-grotesk-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const SITE = "https://lenovobeast.github.io/Lenovo-DevPort";
// Next applies basePath to /_next/* and font URLs automatically, but not to
// metadata icon hrefs — those have to carry the prefix themselves.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const TITLE = "Lenovo Beast — Developer. Builder. Open Source.";
const DESCRIPTION =
  "An immersive developer portal: design tooling, agent systems and open source software built by Lenovo Beast.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "BeastOS",
  authors: [{ name: "Lenovo Beast", url: "https://github.com/lenovobeast" }],
  keywords: [
    "Lenovo Beast",
    "developer",
    "open source",
    "design tooling",
    "AI agents",
    "TypeScript",
    "Three.js",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Lenovo Beast",
    title: TITLE,
    description: DESCRIPTION,
    url: SITE,
    images: [{ url: `${SITE}/lenovo-beast-512.png`, width: 512, height: 512 }],
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE}/lenovo-beast-512.png`],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: `${BASE}/favicon-32.png`, sizes: "32x32", type: "image/png" },
      { url: `${BASE}/favicon-48.png`, sizes: "48x48", type: "image/png" },
    ],
    apple: `${BASE}/apple-touch-icon.png`,
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Lenovo Beast",
  url: SITE,
  image: `${SITE}/lenovo-beast-512.png`,
  email: `mailto:${CONTACT_EMAIL}`,
  jobTitle: "Developer",
  sameAs: ["https://github.com/lenovobeast"],
  knowsAbout: ["Design tooling", "Agent systems", "Open source", "TypeScript", "Python", "Go"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={display.variable}>
      <body className="min-h-[100dvh] antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
