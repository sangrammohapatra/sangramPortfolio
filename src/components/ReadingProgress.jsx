import { useEffect, useRef } from "react";

const SECTIONS = [
  "hero",
  "about",
  "skills",
  "experience",
  "projects",
  "education",
  "roles",
  "blog",
  "testimonials",
  "contact",
];

export default function ReadingProgress() {
  const fillRefs = useRef({});

  useEffect(() => {
    let raf;

    const update = () => {
      const scrollY = window.scrollY;

      SECTIONS.forEach((id) => {
        const el = document.getElementById(id);
        const fillEl = fillRefs.current[id];
        if (!el || !fillEl) return;

        // absolute top of section from document origin
        const top = el.getBoundingClientRect().top + scrollY;
        const height = el.offsetHeight;

        let fill = 0;
        if (scrollY >= top + height) fill = 1;
        else if (scrollY > top) fill = (scrollY - top) / height;

        fillEl.style.width = `${fill * 100}%`;
        // glow on the active / in-progress segment
        fillEl.style.boxShadow =
          fill > 0 && fill < 1
            ? "0 0 8px rgba(0,255,135,0.7)"
            : "none";
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // run once on mount so the bar reflects any initial scroll position
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10001,
        height: 3,
        display: "flex",
        gap: 2,
        pointerEvents: "none",
      }}
    >
      {SECTIONS.map((id) => (
        <div
          key={id}
          style={{
            flex: 1,
            position: "relative",
            background: "rgba(255,255,255,0.06)",
          }}
        >
          <div
            ref={(el) => {
              if (el) fillRefs.current[id] = el;
            }}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "0%",
              background: "linear-gradient(90deg, #00ff87, #f0b429)",
              transition: "width 0.08s linear",
              borderRadius: "0 1px 1px 0",
            }}
          />
        </div>
      ))}
    </div>
  );
}
