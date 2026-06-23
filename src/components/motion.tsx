"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export const MotionDiv = motion.div;
export const MotionSection = motion.section;
export const MotionHeader = motion.header;

type MotionGroupProps = {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
};

export function MotionGroup({
  children,
  className,
  delayChildren = 0.08,
  staggerChildren = 0.08,
}: MotionGroupProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: "some" }}
      variants={{
        hidden: {},
        visible: {
          transition: reduceMotion
            ? { delayChildren: 0, staggerChildren: 0 }
            : { delayChildren, staggerChildren },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

type MotionItemProps = {
  children: ReactNode;
  className?: string;
  lift?: boolean;
};

export function MotionItem({
  children,
  className,
  lift = false,
}: MotionItemProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: reduceMotion
            ? { duration: 0 }
            : { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      whileHover={lift && !reduceMotion ? { y: -6 } : undefined}
      transition={
        lift && !reduceMotion
          ? { type: "spring", stiffness: 320, damping: 24 }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
