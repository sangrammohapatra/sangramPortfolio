import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";

// Slightly quicker than the 0.1 default so Windows wheel steps
// still feel eased without lagging a full beat behind the cursor.
const LENIS_OPTIONS = {
  lerp: 0.12,
  smoothWheel: true,
  anchors: true,
  stopInertiaOnNavigate: true,
  allowNestedScroll: true,
};

function ResetScroll() {
  const { pathname, hash } = useLocation();
  const lenis = useLenis();
  const seen = useRef(null);

  useEffect(() => {
    if (!lenis) return;
    const key = `${pathname}${hash}`;
    if (seen.current === key) return;
    seen.current = key;

    if (hash && hash !== "#hero") {
      lenis.scrollTo(hash, { force: true });
      return;
    }
    lenis.scrollTo(0, { immediate: true, force: true });
  }, [pathname, hash, lenis]);

  return null;
}

export default function SmoothScroll({ children }) {
  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      <ResetScroll />
      {children}
    </ReactLenis>
  );
}
