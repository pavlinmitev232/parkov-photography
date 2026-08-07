"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  GalleryLightbox,
  type LightboxItem,
} from "@/components/gallery-lightbox";

type GalleryItem = LightboxItem;

type GalleryShowcaseProps = {
  categories: string[];
  items: GalleryItem[];
  labels: Record<string, string>;
  closeLabel: string;
  previousLabel: string;
  nextLabel: string;
  swipeLabel: string;
};

export function GalleryShowcase({
  categories,
  items,
  labels,
  closeLabel,
  previousLabel,
  nextLabel,
  swipeLabel,
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
                alt={item.title || labels[item.category]}
                fill
                sizes={
                  index === 0 || index === 5
                    ? "(min-width: 1280px) 850px, (min-width: 768px) 66vw, calc(100vw - 40px)"
                    : "(min-width: 1280px) 416px, (min-width: 768px) 33vw, calc(100vw - 40px)"
                }
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/16 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/65">
                  {labels[item.category]}
                </span>
                {item.title && (
                  <h3 className="mt-2 font-serif text-3xl font-bold">{item.title}</h3>
                )}
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

      <GalleryLightbox
        activeItem={activeItem}
        items={visibleItems}
        labels={labels}
        closeLabel={closeLabel}
        previousLabel={previousLabel}
        nextLabel={nextLabel}
        swipeLabel={swipeLabel}
        onClose={() => setActiveItem(null)}
        onChange={setActiveItem}
      />
    </>
  );
}
