import { motion } from "framer-motion";
import { useMemo } from "react";

const BUBBLE_COUNT = 18;

interface Bubble {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  color: string;
  opacity: number;
}

const colors = [
  "hsl(var(--neon-purple))",
  "hsl(var(--neon-cyan))",
  "hsl(var(--neon-pink))",
  "hsl(var(--neon-green))",
];

export function FloatingBubbles() {
  const bubbles = useMemo<Bubble[]>(() => {
    return Array.from({ length: BUBBLE_COUNT }, (_, i) => ({
      id: i,
      size: Math.random() * 180 + 40,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * -20,
      color: colors[i % colors.length],
      opacity: Math.random() * 0.08 + 0.03,
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          className="absolute rounded-full"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.x}%`,
            top: `${b.y}%`,
            background: `radial-gradient(circle at 30% 30%, ${b.color}, transparent 70%)`,
            opacity: b.opacity,
            filter: `blur(${b.size > 100 ? 40 : 20}px)`,
          }}
          animate={{
            x: [0, 60, -40, 30, 0],
            y: [0, -80, 40, -60, 0],
            scale: [1, 1.2, 0.9, 1.1, 1],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: b.delay,
          }}
        />
      ))}
    </div>
  );
}
