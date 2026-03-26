import { useEffect, useRef } from "react";

/**
 * A global ambient orb that follows mouse movement subtly across the page,
 * giving the entire site a living, breathing feel.
 */
export default function AmbientBackground() {
  const orbRef = useRef(null);

  useEffect(() => {
    let raf;
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let cx = tx, cy = ty;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const animate = () => {
      cx += (tx - cx) * 0.04;
      cy += (ty - cy) * 0.04;
      if (orbRef.current) {
        orbRef.current.style.transform = `translate(${cx - 300}px, ${cy - 300}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        ref={orbRef}
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(244,63,94,0.04) 0%, rgba(244,63,94,0.01) 40%, transparent 70%)",
          willChange: "transform",
        }}
      />
    </div>
  );
}