import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/**
 * A premium animated section divider that creates visual breathing room
 * and a sense of depth between page sections.
 */
export default function SectionDivider({ color = "rose", flip = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const glow = color === "rose" ? "rgba(244,63,94,0.15)" : color === "violet" ? "rgba(139,92,246,0.12)" : "rgba(68,170,255,0.1)";
  const line = color === "rose" ? "#f43f5e" : color === "violet" ? "#8b5cf6" : "#44aaff";

  return (
    <div ref={ref} className="relative h-16 overflow-hidden pointer-events-none select-none" style={{ background: "#030712" }}>
      {/* Center glow */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={inView ? { opacity: 1, scaleX: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[1px] origin-center"
        style={{ background: `linear-gradient(90deg, transparent 0%, ${line}55 30%, ${line}90 50%, ${line}55 70%, transparent 100%)` }}
      />
      {/* Ambient glow blob */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-16 rounded-full blur-2xl"
        style={{ background: glow }}
      />
      {/* Dot */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
        style={{ background: line }}
      />
    </div>
  );
}