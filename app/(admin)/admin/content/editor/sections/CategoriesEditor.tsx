"use client";

import Image from "next/image";
import type { CategoriesContent } from "@/lib/content/homeCategories";
import { InlineText } from "../InlineText";
import { ImageEditButton } from "../ImageEditButton";
import { DimensionHint } from "../DimensionHint";

// Fixed at exactly 3 — a fixed 3-column grid, not a scroll list (see
// lib/content/homeCategories.ts).
export function CategoriesEditor({
  data,
  onChange,
}: {
  data: CategoriesContent;
  onChange: (patch: Partial<CategoriesContent>) => void;
}) {
  const updateCat = (i: number, patch: Partial<CategoriesContent["categories"][number]>) => {
    const next = [...data.categories] as CategoriesContent["categories"];
    next[i] = { ...next[i], ...patch };
    onChange({ categories: next });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {data.categories.map((cat, i) => (
          <div key={i} className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#eafbf0]">
            {cat.image && <Image src={cat.image} alt="" fill className="object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />
            <ImageEditButton onPick={(url) => updateCat(i, { image: url })} aspect={3 / 4} />
            <div className="absolute left-4 top-4">
              <InlineText
                value={cat.label}
                onChange={(v) => updateCat(i, { label: v })}
                className="w-fit text-2xl font-light capitalize text-white drop-shadow-md"
                placeholder="Label"
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <InlineText
                value={cat.buttonText}
                onChange={(v) => updateCat(i, { buttonText: v })}
                className="w-fit rounded-full bg-white px-4 py-2 text-xs font-medium capitalize text-[#1a1a2e] shadow-lg"
                placeholder="Button text"
              />
              <InlineText
                value={cat.href}
                onChange={(v) => updateCat(i, { href: v })}
                className="mt-1 w-fit text-[10px] text-white/70"
                placeholder="Link"
              />
            </div>
          </div>
        ))}
      </div>
      <DimensionHint text="portrait, ~3:4 (taller than wide)" />
    </div>
  );
}
