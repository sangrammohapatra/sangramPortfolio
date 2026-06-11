import { useRef, useCallback } from "react";

export default function MagneticButton({ children, strength = 0.38 }) {
  const wrapRef = useRef(null);

  const onMouseMove = useCallback(
    (e) => {
      const el = wrapRef.current;
      if (!el) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) * strength;
      const y = (e.clientY - top - height / 2) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
      el.style.transition = "transform 0.12s ease-out";
    },
    [strength]
  );

  const onMouseLeave = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.transform = "translate(0px, 0px)";
    el.style.transition = "transform 0.55s cubic-bezier(0.23, 1, 0.32, 1)";
  }, []);

  return (
    <span
      ref={wrapRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ display: "inline-flex" }}
    >
      {children}
    </span>
  );
}
