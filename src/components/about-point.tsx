"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function AboutPoint({ children }: { children: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={{
        hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, x: -28 },
        visible: {
          opacity: 1,
          x: 0,
          transition: reduceMotion
            ? { duration: 0 }
            : { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className="relative flex min-h-22 items-start gap-4 overflow-hidden rounded-md border border-line bg-background p-5"
    >
      <motion.div
        variants={{
          hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.45, rotate: -35 },
          visible: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 360, damping: 20, delay: 0.1 },
          },
        }}
        className="text-lg/6"
      >
        <CheckCircle2 className="size-5 shrink-0 stroke-accent" />
      </motion.div>
      <p className="text-base/7 font-bold sm:text-sm/6">{children}</p>
      <motion.span
        aria-hidden="true"
        variants={{
          hidden: { scaleX: reduceMotion ? 1 : 0 },
          visible: {
            scaleX: 1,
            transition: reduceMotion
              ? { duration: 0 }
              : { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.12 },
          },
        }}
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent"
      />
    </motion.div>
  );
}
