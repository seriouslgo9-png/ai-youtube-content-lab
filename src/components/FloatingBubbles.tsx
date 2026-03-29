import { motion } from "framer-motion";
import { useMemo } from "react";

const BUBBLE_COUNT = 24;

interface Orb {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  color: string;
  opacity: number;
}

const palettes = [
  ["hsla(265,90%,65%,1)", "hsla(280,80%,50%,0)"],
  ["hsla(190,95%,50%,1)", "hsla(210,80%,40%,0)"],
  ["hsla(330,85%,60%,1)", "hsla(350,70%,45%,0)"],
  ["hsla(145,80%,50%,1)", "hsla(160,70%,35%,0)"],
  ["hsla(40,95%,60%,1)", "hsla(50,80%,40%,0)"],
];

export function FloatingBubbles() {
  const orbs = useMemo<Orb[]>(() => {
    return Array.from({ length: BUBBLE_COUNT }, (_, i) => {
      const palette = palettes[i % palettes.length];
      return {
        id: i,
        size: Math.random() * 300 + 60,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 12,
        delay: Math.random() * -25,
        color: palette[0],
        opacity: Math.random() * 0.07 + 0.02,
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Starfield */}
      {Array.from({ length: 50 }, (_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute rounded-full bg-foreground"
          style={{
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ opacity: [0.1, 0.6, 0.1] }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Floating orbs */}
      {orbs.map((b) => (
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
            filter: `blur(${b.size > 150 ? 60 : 30}px)`,
          }}
          animate={{
            x: [0, 80, -60, 50, -30, 0],
            y: [0, -100, 60, -80, 40, 0],
            scale: [1, 1.3, 0.8, 1.2, 0.9, 1],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: b.delay,
          }}
        />
      ))}

      {/* Animated grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-foreground" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}
