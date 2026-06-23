"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { PublicPortfolioItem } from "@/lib/portfolio";

type GalleryBrowserProps = {
  categories: string[];
  items: PublicPortfolioItem[];
  labels: Record<string, string>;
  closeLabel: string;
  itemCountLabel: string;
  emptyTitle: string;
  emptyCopy: string;
};

export function GalleryBrowser({
  categories,
  items,
  labels,
  closeLabel,
  itemCountLabel,
  emptyTitle,
  emptyCopy,
}: GalleryBrowserProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeItem, setActiveItem] = useState<PublicPortfolioItem | null>(null);

  const visibleItems = useMemo(
    () =>
      activeCategory === "all"
        ? items
        : items.filter((item) => item.category === activeCategory),
    [activeCategory, items],
  );

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>([["all", items.length]]);

    for (const item of items) {
      counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
    }

    return counts;
  }, [items]);

  return (
    <>
      <div className="sticky top-0 z-20 border-y border-line bg-background/86 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 md:px-8">
          {categories.map((category) => {
            const count = categoryCounts.get(category) ?? 0;

            return (
              <button
                type="button"
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex h-11 shrink-0 items-center gap-2 rounded-full border py-2 pr-4 pl-4 text-sm font-bold ${
                  activeCategory === category
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-line bg-surface hover:border-accent"
                }`}
              >
                {labels[category]}
                <span className="rounded-full bg-current/12 px-2 py-0.5 text-xs tabular-nums">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <section className="px-5 py-10 md:px-8 md:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col justify-between gap-2 border-b border-line pb-5 sm:flex-row sm:items-end">
            <p className="text-base text-muted sm:text-sm">
              {visibleItems.length} {itemCountLabel}
            </p>
            <p className="text-base font-bold sm:text-sm">
              {labels[activeCategory]}
            </p>
          </div>

          {visibleItems.length === 0 ? (
            <div className="border border-line bg-surface p-8 text-center md:p-12">
              <h2 className="text-2xl font-bold">{emptyTitle}</h2>
              <p className="mx-auto mt-3 max-w-[56ch] text-base leading-7 text-muted">
                {emptyCopy}
              </p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 md:auto-rows-[260px] lg:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {visibleItems.map((item, index) => (
                  <motion.button
                    type="button"
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    onClick={() => setActiveItem(item)}
                    className="group relative overflow-hidden rounded-md bg-surface text-left outline-1 -outline-offset-1 outline-black/5 sm:[&:nth-child(5n+1)]:row-span-2 lg:[&:nth-child(7n+1)]:col-span-2 lg:[&:nth-child(7n+4)]:row-span-2"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      unoptimized
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/78 via-black/18 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <p className="text-sm font-bold tracking-[0.18em] text-white/68">
                        {labels[item.category]}
                      </p>
                      <h2 className="mt-2 font-serif text-2xl font-bold md:text-3xl">
                        {item.title}
                      </h2>
                      {(item.location || item.shootYear || item.clientType) && (
                        <p className="mt-2 text-sm text-white/72">
                          {[item.location, item.shootYear, item.clientType]
                            .filter(Boolean)
                            .join(" / ")}
                        </p>
                      )}
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {activeItem && (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-black/86 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              aria-label={closeLabel}
              onClick={() => setActiveItem(null)}
              className="absolute right-5 top-5 z-10 grid size-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20"
            >
              <X size={20} />
            </button>
            <motion.div
              initial={{ y: 28, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 28, opacity: 0, scale: 0.98 }}
              className="relative h-[78vh] w-full max-w-6xl overflow-hidden rounded-md"
            >
              <Image
                src={activeItem.image}
                alt={activeItem.title}
                fill
                unoptimized
                sizes="100vw"
                className="object-contain"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-6 text-white">
                <p className="text-sm font-bold tracking-[0.18em] text-white/68">
                  {labels[activeItem.category]}
                </p>
                <h2 className="mt-2 font-serif text-3xl font-bold">
                  {activeItem.title}
                </h2>
                {(activeItem.location || activeItem.shootYear || activeItem.clientType) && (
                  <p className="mt-2 text-sm text-white/72">
                    {[activeItem.location, activeItem.shootYear, activeItem.clientType]
                      .filter(Boolean)
                      .join(" / ")}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
