import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

export default function RouteTransition() {
  const location = useLocation();
  const [active, setActive] = useState(false);
  const prevPath = useRef(null);

  useEffect(() => {
    if (prevPath.current === null) {
      prevPath.current = location.pathname;
      return;
    }
    if (prevPath.current === location.pathname) return;
    prevPath.current = location.pathname;
    setActive(true);
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="route-curtain"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "linear-gradient(135deg, #00ff87 0%, #00cc6a 100%)",
            pointerEvents: "none",
          }}
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{
            clipPath: [
              "inset(0 100% 0 0)",
              "inset(0 0% 0 0)",
              "inset(0 0% 0 0)",
              "inset(0 0% 0 100%)",
            ],
          }}
          transition={{
            duration: 0.85,
            times: [0, 0.42, 0.58, 1],
            ease: "easeInOut",
          }}
          onAnimationComplete={() => setActive(false)}
        />
      )}
    </AnimatePresence>
  );
}
