"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

type BlurTextProps = {
  text: string;
  className?: string;
};

export function BlurText({ text, className }: BlurTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 0.1, once: true });
  const reduce = useReducedMotion();

  return (
    <span
      ref={ref}
      className={`flex flex-wrap [row-gap:0.1em] ${className ?? "justify-center"}`}
    >
      {text.split(" ").map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="motion-blur-in mr-[0.28em] inline-block"
          initial={
            reduce ? false : { filter: "blur(10px)", opacity: 0, y: 50 }
          }
          animate={
            inView ? { filter: "blur(0px)", opacity: 1, y: 0 } : undefined
          }
          transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
