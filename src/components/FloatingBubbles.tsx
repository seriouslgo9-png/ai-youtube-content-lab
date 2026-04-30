import { motion } from "framer-motion";
import { useMemo } from "react";

const SHAPE_COUNT = 18;

interface Shape {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  hue: number;
  type: "play" | "bell" | "heart" | "sparkle" | "subscribe";
  rotate: number;
}

const types: Shape["type"][] = ["play", "bell", "heart", "sparkle", "subscribe"];
const hues = [0, 265, 190, 330, 145, 40]; // includes YT red (0)

function ShapeIcon({ type }: { type: Shape["type"] }) {
  switch (type) {
    case "play":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <rect x="2" y="5" width="20" height="14" rx="4" />
          <polygon points="10,9 16,12 10,15" fill="hsl(var(--background))" />
        </svg>
      );
    case "bell":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M12 2a6 6 0 00-6 6v3l-2 4h16l-2-4V8a6 6 0 00-6-6zm0 20a3 3 0 003-3H9a3 3 0 003 3z" />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M12 21s-7-4.35-7-10a4 4 0 017-2.65A4 4 0 0119 11c0 5.65-7 10-7 10z" />
        </svg>
      );
    case "sparkle":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
        </svg>
      );
    case "subscribe":
      return (
        <svg viewBox="0 0 36 24" fill="currentColor" className="w-full h-full">
          <rect x="0" y="0" width="36" height="24" rx="6" />
        </svg>
      );
  }
}

export function FloatingBubbles() {
  const shapes = useMemo<Shape[]>(() => {
    return Array.from({ length: SHAPE_COUNT }, (_, i) => {
      return {
        id: i,
        size: Math.random() * 38 + 22,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 18 + 16,
        delay: Math.random() * -20,
        hue: hues[i % hues.length],
        type: types[i % types.length],
        rotate: Math.random() * 60 - 30,
      };
    });
  }, []);

  const blobs = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        id: i,
        size: 380 + Math.random() * 280,
        x: Math.random() * 100,
        y: Math.random() * 100,
        hue: hues[i % hues.length],
        duration: 22 + Math.random() * 14,
        delay: Math.random() * -20,
      })),
    [],
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Aurora blobs */}
      {blobs.map((b) => (
        <motion.div
          key={`blob-${b.id}`}
          className="absolute rounded-full"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.x}%`,
            top: `${b.y}%`,
            background: `radial-gradient(circle at 30% 30%, hsla(${b.hue},90%,60%,0.18), transparent 70%)`,
            filter: "blur(70px)",
          }}
          animate={{ x: [0, 80, -60, 0], y: [0, -60, 80, 0], scale: [1, 1.2, 0.9, 1] }}
          transition={{ duration: b.duration, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
        />
      ))}

      {/* Floating YouTube-themed icons */}
      {shapes.map((s) => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{
            width: s.size,
            height: s.size,
            left: `${s.x}%`,
            top: `${s.y}%`,
            color: `hsla(${s.hue},90%,62%,0.55)`,
            filter: `drop-shadow(0 0 12px hsla(${s.hue},90%,60%,0.4))`,
          }}
          animate={{
            y: [0, -120, -40, -160, 0],
            x: [0, 30, -20, 15, 0],
            rotate: [s.rotate, s.rotate + 25, s.rotate - 15, s.rotate],
            opacity: [0, 0.7, 0.7, 0.7, 0],
          }}
          transition={{ duration: s.duration, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
        >
          <ShapeIcon type={s.type} />
        </motion.div>
      ))}

      {/* Subtle grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
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
