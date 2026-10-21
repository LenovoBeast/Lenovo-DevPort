import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Timeline } from "@/components/Timeline";
import { StackConstellation } from "@/components/StackConstellation";
import { Work } from "@/components/Work";
import { Ecosystem } from "@/components/Ecosystem";
import { Lab } from "@/components/Lab";
import { WorkbenchBand } from "@/components/WorkbenchBand";
import { CommandPalette } from "@/components/CommandPalette";
import { PaletteTrigger } from "@/components/PaletteTrigger";
import { Contact } from "@/components/Contact";
import { Reveal } from "@/components/Reveal";
import { GITHUB_URL } from "@/lib/data";

function SectionHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede: string;
}) {
  return (
    <div className="max-w-[62ch]">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="display mt-4 text-[clamp(2rem,4.4vw,3.4rem)]">{title}</h2>
      <p className="body-copy mt-4 text-[0.9375rem]">{lede}</p>
    </div>
  );
}

export default function Page() {
  return (
    <>
      {/* Fixed atmosphere shared by every section — breathes so the world feels
          alive everywhere, not only on the hero. Disabled under reduced motion. */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 grid-veil opacity-60" />
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 animate-breathe rounded-full bg-[radial-gradient(circle,rgba(0,102,255,0.10),transparent_65%)] blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-6%] h-[520px] w-[680px] animate-breathe rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.08),transparent_68%)] blur-3xl [animation-delay:-3.5s]" />
      </div>

      <div className="relative z-10">
        <Nav />

        <main id="main">
          <Hero />

          <section id="about" className="section-pad scroll-mt-20">
            <div className="shell">
              <Timeline />
            </div>
          </section>

          <section id="stack" className="section-pad section-alt scroll-mt-20">
            <div className="shell">
              <Reveal>
                <SectionHeader
                  eyebrow="03 — Stack"
                  title={
                    <>
                      One practice,
                      <br />
                      seven clusters
                    </>
                  }
                  lede="The tools are interchangeable; the clusters are not. Select a hub to see what actually gets used inside it."
                />
              </Reveal>
              <div className="mt-8">
                <StackConstellation />
              </div>
            </div>
          </section>

          <section id="work" className="section-pad scroll-mt-20">
            <div className="shell">
              <Reveal>
                <SectionHeadWork />
              </Reveal>
              <div className="mt-8">
                <Work />
              </div>
            </div>
          </section>

          <section id="ecosystem" className="section-pad section-alt scroll-mt-20">
            <div className="shell">
              <Reveal>
                <SectionHeader
                  eyebrow="05 — Repositories"
                  title="Public by default"
                  lede="Every repository orbits the same account. This map is drawn from the GitHub API on load, so it reflects what exists rather than what was true when the page was built."
                />
              </Reveal>
              <div className="mt-8">
                <Ecosystem />
              </div>
            </div>
          </section>

          <section id="lab" className="section-pad scroll-mt-20">
            <div className="shell">
              <Reveal>
                <SectionHeader
                  eyebrow="06 — Lab"
                  title="Where the experiments live"
                  lede="The daily environment and the work in progress. Arch Linux, version-controlled dotfiles, and a short list of things currently being tested."
                />
              </Reveal>
              <div className="mt-8">
                <Lab />
              </div>
            </div>
          </section>

          <WorkbenchBand />

          <section id="contact" className="section-pad section-alt scroll-mt-20">
            <div className="shell">
              <Reveal>
                <Contact />
              </Reveal>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/[0.07]">
          <div className="shell flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-6 w-6 place-items-center rounded-md border border-white/15 bg-white/[0.05]">
                <span className="h-1 w-1 rounded-full bg-secondary" />
              </span>
              <span className="text-[0.8125rem] text-fg-mute">
                © {new Date().getFullYear()} Lenovo Beast
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-5 font-mono text-[0.75rem] uppercase tracking-[0.16em] text-white/30">
              <PaletteTrigger />
              <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hover:text-white">
                GitHub
              </a>
              <a href={`${GITHUB_URL}/Lenovo-DevPort`} target="_blank" rel="noreferrer" className="hover:text-white">
                Source
              </a>
              <span>Built with Next.js · Three.js</span>
            </div>
          </div>
        </footer>

        <CommandPalette />
      </div>
    </>
  );
}

function SectionHeadWork() {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
      <SectionHeader
        eyebrow="04 — Work"
        title="Products, not screenshots"
        lede="Six projects, each shipped and public. Open one to read the problem it was built against and what it actually changed."
      />
      <p className="shrink-0 font-mono text-[0.75rem] uppercase tracking-[0.18em] text-white/30">
        Select a project to expand
      </p>
    </div>
  );
}
