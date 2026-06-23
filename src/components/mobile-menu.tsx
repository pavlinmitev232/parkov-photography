"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

type MobileMenuProps = {
  label: string;
  closeLabel: string;
  links: Array<{ href: string; label: string }>;
};

export function MobileMenu({ label, closeLabel, links }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? closeLabel : label}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="grid size-11 place-items-center rounded-full border border-line bg-surface/80 shadow-sm backdrop-blur"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>
      {open && (
        <div className="absolute inset-x-5 top-24 rounded-md border border-line bg-background p-3 shadow-2xl">
          {links.map((link) => (
            <a
              href={link.href}
              key={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-md px-4 py-3 text-sm font-bold text-foreground transition hover:bg-surface"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
