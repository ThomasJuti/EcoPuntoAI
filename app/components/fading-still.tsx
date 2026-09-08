"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type FadingStillProps = {
  src: string | string[];
  alt?: string;
  holdMs?: number;
  className?: string;
  imgClassName?: string;
};

export function FadingStill({
  src,
  alt = "",
  holdMs = 7000,
  className,
  imgClassName,
}: FadingStillProps) {
  const sources = Array.isArray(src) ? src : [src];
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (sources.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % sources.length),
      holdMs,
    );
    return () => clearInterval(id);
  }, [sources.length, holdMs]);

  return (
    <div className={className} aria-hidden={alt === ""}>
      {sources.map((s, i) => (
        <motion.img
          key={s}
          src={s}
          alt={alt}
          loading="eager"
          fetchPriority={i === 0 ? "high" : "auto"}
          className={`ken-burns pointer-events-none absolute inset-0 h-full w-full object-cover ${imgClassName ?? ""}`}
          initial={{ opacity: i === 0 ? 1 : 0 }}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{
            opacity: {
              duration: reduce ? 0 : 1.6,
              ease: [0.4, 0, 0.2, 1],
            },
          }}
        />
      ))}
    </div>
  );
}
