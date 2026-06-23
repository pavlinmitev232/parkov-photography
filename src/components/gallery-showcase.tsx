"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

type GalleryItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  location: string | null;
  shootYear: number | null;
  clientType: string | null;
};

type GalleryShowcaseProps = {
  categories: string[];
  items: GalleryItem[];
  labels: Record<string, string>;
  closeLabel: string;
};

export function GalleryShowcase({
  categories,
  items,
  labels,
  closeLabel,
}: GalleryShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const visibleItems = useMemo(
    () =>
      activeCategory === "all"
        ? items
        : items.filter((item) => item.category === activeCategory),
    [activeCategory, items],
  );

  return (
    <>
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`h-11 shrink-0 rounded-full border px-5 text-sm font-bold transition ${
              activeCategory === category
                ? "border-accent bg-accent text-accent-foreground"
                : "border-line bg-background hover:border-accent"
            }`}
          >
            {labels[category]}
          </button>
        ))}
      </div>

      <motion.div layout className="grid gap-4 md:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visibleItems.map((item, index) => (
            <motion.button
              type="button"
              layout
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.32, delay: index * 0.03 }}
              onClick={() => setActiveItem(item)}
              className="group relative min-h-[320px] overflow-hidden rounded-md bg-surface text-left md:[&:nth-child(1)]:col-span-2 md:[&:nth-child(6)]:col-span-2"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                unoptimized
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/16 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/65">
                  {labels[item.category]}
                </span>
                <h3 className="mt-2 font-serif text-3xl font-bold">{item.title}</h3>
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
              className="absolute right-5 top-5 z-10 grid size-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
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
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/65">
                  {labels[activeItem.category]}
                </span>
                <h3 className="mt-2 font-serif text-3xl font-bold">{activeItem.title}</h3>
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
