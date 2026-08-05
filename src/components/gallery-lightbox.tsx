"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export type LightboxItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  location: string | null;
  shootYear: number | null;
  clientType: string | null;
};

type GalleryLightboxProps = {
  activeItem: LightboxItem | null;
  items: LightboxItem[];
  labels: Record<string, string>;
  closeLabel: string;
  previousLabel: string;
  nextLabel: string;
  swipeLabel: string;
  onClose: () => void;
  onChange: (item: LightboxItem) => void;
};

export function GalleryLightbox({
  activeItem,
  items,
  labels,
  closeLabel,
  previousLabel,
  nextLabel,
  swipeLabel,
  onClose,
  onChange,
}: GalleryLightboxProps) {
  const reduceMotion = useReducedMotion();
  const [direction, setDirection] = useState(0);
  const activeIndex = activeItem
    ? items.findIndex((item) => item.id === activeItem.id)
    : -1;
  const canNavigate = items.length > 1 && activeIndex >= 0;

  const move = useCallback(
    (step: -1 | 1) => {
      if (!canNavigate) {
        return;
      }

      const nextIndex = (activeIndex + step + items.length) % items.length;
      setDirection(step);
      onChange(items[nextIndex]);
    },
    [activeIndex, canNavigate, items, onChange],
  );

  useEffect(() => {
    if (!activeItem) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowLeft") {
        move(-1);
      } else if (event.key === "ArrowRight") {
        move(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeItem, move, onClose]);

  return (
    <AnimatePresence>
      {activeItem && (
        <motion.div
          className="fixed inset-0 z-80 grid place-items-center bg-black/90 p-3 backdrop-blur-md sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title || labels[activeItem.category]}
          onClick={onClose}
        >
          <button
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
            className="absolute top-4 right-4 z-20 grid size-11 place-items-center rounded-full bg-white/12 text-white outline-1 -outline-offset-1 outline-white/20 backdrop-blur hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <X className="size-5 stroke-current" />
            <span
              className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden"
              aria-hidden="true"
            />
          </button>

          {canNavigate && (
            <>
              <button
                type="button"
                aria-label={previousLabel}
                onClick={(event) => {
                  event.stopPropagation();
                  move(-1);
                }}
                className="absolute bottom-5 left-4 z-20 grid size-12 place-items-center rounded-full bg-white/12 text-white outline-1 -outline-offset-1 outline-white/20 backdrop-blur hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2"
              >
                <ChevronLeft className="size-5 stroke-current" />
              </button>
              <button
                type="button"
                aria-label={nextLabel}
                onClick={(event) => {
                  event.stopPropagation();
                  move(1);
                }}
                className="absolute right-4 bottom-5 z-20 grid size-12 place-items-center rounded-full bg-white/12 text-white outline-1 -outline-offset-1 outline-white/20 backdrop-blur hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2"
              >
                <ChevronRight className="size-5 stroke-current" />
              </button>
            </>
          )}

          <div
            className="relative h-[82dvh] w-full max-w-6xl overflow-hidden rounded-[min(1vw,12px)]"
            onClick={(event) => event.stopPropagation()}
          >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={activeItem.id}
                custom={direction}
                variants={{
                  enter: (slideDirection: number) =>
                    reduceMotion
                      ? { opacity: 1 }
                      : { opacity: 0, x: slideDirection >= 0 ? 90 : -90, scale: 0.985 },
                  center: { opacity: 1, x: 0, scale: 1 },
                  exit: (slideDirection: number) =>
                    reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, x: slideDirection >= 0 ? -90 : 90, scale: 0.985 },
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: reduceMotion ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}
                drag={canNavigate && !reduceMotion ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.16}
                onDragEnd={(_event, info) => {
                  if (info.offset.x < -70 || info.velocity.x < -500) {
                    move(1);
                  } else if (info.offset.x > 70 || info.velocity.x > 500) {
                    move(-1);
                  }
                }}
                className="absolute inset-0 touch-pan-y"
              >
                <Image
                  src={activeItem.image}
                  alt={activeItem.title || labels[activeItem.category]}
                  fill
                  unoptimized
                  sizes="100vw"
                  className="pointer-events-none object-contain"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/88 via-black/38 to-transparent p-5 pt-24 text-white sm:p-7 sm:pt-32">
                  <div className="flex items-end justify-between gap-5">
                    <div className="min-w-0">
                      <p className="text-base/6 font-bold tracking-[0.18em] text-white/68 sm:text-sm/6">
                        {labels[activeItem.category]}
                      </p>
                      {activeItem.title && (
                        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
                          {activeItem.title}
                        </h2>
                      )}
                      {(activeItem.location ||
                        activeItem.shootYear ||
                        activeItem.clientType) && (
                        <p className="text-base/7 text-white/72 sm:text-sm/6">
                          {[
                            activeItem.location,
                            activeItem.shootYear,
                            activeItem.clientType,
                          ]
                            .filter(Boolean)
                            .join(" / ")}
                        </p>
                      )}
                    </div>
                    <p className="shrink-0 text-base/7 font-bold tabular-nums text-white/72 sm:text-sm/6">
                      {activeIndex + 1} / {items.length}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {canNavigate && (
            <p className="absolute bottom-6 hidden text-sm/6 text-white/60 sm:block">
              {swipeLabel}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
