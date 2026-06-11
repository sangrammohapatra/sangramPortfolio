import { useEffect, useRef } from "react";

export default function NoiseOverlay() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const size = 200;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const img = ctx.createImageData(size, size);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    if (ref.current) {
      ref.current.style.backgroundImage = `url(${canvas.toDataURL()})`;
    }
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9998,
        pointerEvents: "none",
        opacity: 0.045,
        backgroundRepeat: "repeat",
        backgroundSize: "200px 200px",
        mixBlendMode: "overlay",
      }}
    />
  );
}
