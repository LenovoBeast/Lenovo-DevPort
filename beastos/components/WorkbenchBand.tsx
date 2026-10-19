const LQIP =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAMABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDjxT1AI5pgqRRxQBKsK5HPFFCnMf0opDsf/9k=";

/**
 * Full-bleed artwork band between Lab and Contact.
 *
 * Deliberately carries no text. The Lab section is dense with panels, so the
 * artwork had nowhere to breathe there; as a standalone band it reads as a
 * designed pause and never sits behind a heading or a button.
 *
 * Decorative only: hidden from assistive tech, lazy-loaded so it costs nothing
 * on first paint, and the LQIP is inlined so the band never flashes empty.
 */
export function WorkbenchBand() {
  // Public assets referenced with a leading "/" are NOT rewritten by basePath,
  // so on a project site they resolve to the domain root and 404.
  const B = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <section
      aria-hidden="true"
      className="relative h-[clamp(300px,46vh,520px)] w-full overflow-hidden"
    >
      <picture>
        {/* Mobile: square crop taken from the right, where the robots are. */}
        <source
          media="(max-width: 767px)"
          type="image/webp"
          srcSet={`${B}/media/lab-bg-mobile-500.webp 500w, ${B}/media/lab-bg-mobile-800.webp 800w`}
          sizes="100vw"
        />
        <source
          type="image/webp"
          srcSet={`${B}/media/lab-bg-800.webp 800w, ${B}/media/lab-bg-1200.webp 1200w, ${B}/media/lab-bg-1776.webp 1776w`}
          sizes="100vw"
        />
        <img
          src={`${B}/media/lab-bg-1200.jpg`}
          alt=""
          width={1776}
          height={896}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-[72%_center]"
          style={{
            backgroundImage: `url(${LQIP})`,
            backgroundSize: "cover",
            backgroundPosition: "right center",
          }}
        />
      </picture>

      {/* Edges dissolve into the page; the middle is left clean. */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#050505_0%,transparent_14%,transparent_86%,#050505_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#050505_0%,transparent_16%,transparent_84%,#050505_100%)]" />
      <div className="absolute inset-0 opacity-[0.05] noise" />
    </section>
  );
}
