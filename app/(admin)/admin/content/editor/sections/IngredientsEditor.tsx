"use client";

import Image from "next/image";
import type { IngredientsContent } from "@/lib/content/homeIngredients";
import { InlineText } from "../InlineText";
import { ImageEditButton } from "../ImageEditButton";
import { DimensionHint } from "../DimensionHint";

// Fixed at exactly 5 slots — the live ring animation's angle offset is
// tuned for 5 items, so no add/remove here (see lib/content/homeIngredients.ts).
export function IngredientsEditor({
  data,
  onChange,
}: {
  data: IngredientsContent;
  onChange: (patch: Partial<IngredientsContent>) => void;
}) {
  const updateIngredient = (i: number, patch: Partial<IngredientsContent["ingredients"][number]>) => {
    const next = [...data.ingredients] as IngredientsContent["ingredients"];
    next[i] = { ...next[i], ...patch };
    onChange({ ingredients: next });
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-[#fdf8f3] p-5">
      <div className="flex flex-col gap-1">
        <InlineText
          value={data.eyebrow}
          onChange={(v) => onChange({ eyebrow: v })}
          className="w-fit text-xs tracking-[0.25em] uppercase text-[#a0876a] font-medium"
          placeholder="Eyebrow"
        />
        <InlineText
          value={data.heading}
          onChange={(v) => onChange({ heading: v })}
          className="w-fit text-2xl font-bold text-[#1a1a1a]"
          placeholder="Heading"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {data.ingredients.map((ing, i) => (
          <div key={i} className="flex flex-col items-center gap-2 text-center">
            <div className="group relative h-20 w-20 overflow-hidden rounded-full border-2 border-[#c9a87c]/40 bg-white">
              {ing.image && <Image src={ing.image} alt="" fill className="object-contain p-2" />}
              <ImageEditButton onPick={(url) => updateIngredient(i, { image: url })} aspect={1} />
            </div>
            <InlineText
              value={ing.name}
              onChange={(v) => updateIngredient(i, { name: v })}
              className="w-full text-[12.5px] font-semibold text-[#1a1a1a]"
              placeholder="Name"
            />
            <InlineText
              value={ing.benefit}
              onChange={(v) => updateIngredient(i, { benefit: v })}
              className="w-full text-[11px] text-[#5a4a3a]/70"
              placeholder="Benefit"
              multiline
            />
          </div>
        ))}
      </div>
      <DimensionHint text="square, transparent/white background works best (fits inside a circle)" />
    </div>
  );
}
