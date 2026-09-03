"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export function ProductTemplateScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 24,
    mass: 0.28,
  });
  const glowX = useTransform(scrollYProgress, (value) => `${Math.max(0, Math.min(100, value * 100))}%`);

  return (
    <div className="xsolt-scroll-indicator" aria-hidden="true">
      <div className="xsolt-scroll-indicator__track">
        <motion.div className="xsolt-scroll-indicator__fill" style={{ scaleX }} />
        <motion.div className="xsolt-scroll-indicator__glow" style={{ left: glowX }} />
      </div>
    </div>
  );
}
