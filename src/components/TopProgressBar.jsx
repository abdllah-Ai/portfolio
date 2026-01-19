// src/components/TopProgressBar.jsx
// Fixed top bar showing scroll progress
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function TopProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-[60] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, var(--acc-from), var(--acc-to))',
        boxShadow: '0 0 10px var(--acc-to)',
      }}
    />
  );
}
