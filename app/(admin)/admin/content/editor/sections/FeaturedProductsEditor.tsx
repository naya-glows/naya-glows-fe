"use client";

import Image from "next/image";
import type { FeaturedProductsContent } from "@/lib/content/homeFeaturedProducts";
import { InlineText } from "../InlineText";
import { ImageEditButton } from "../ImageEditButton";
import { DimensionHint } from "../DimensionHint";

// Cards fixed at exactly 2 — the 3rd grid slot is the lifestyle image card
// below, not a 3rd product (see lib/content/homeFeaturedProducts.ts).
export function FeaturedProductsEditor({
  data,
  onChange,
}: {
  data: FeaturedProductsContent;
  onChange: (patch: Partial<FeaturedProductsContent>) => void;
}) {
  const updateCard = (i: number, patch: Partial<FeaturedProductsContent["cards"][number]>) => {
    const next = [...data.cards] as FeaturedProductsContent["cards"];
    next[i] = { ...next[i], ...patch };
    onChange({ cards: next });
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-white p-5">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <InlineText
            value={data.headingLine1}
            onChange={(v) => onChange({ headingLine1: v })}
            className="w-fit text-xl font-semibold text-[#1a1a2e]"
            placeholder="Heading line 1"
          />
          <div className="group relative h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md">
            {data.headingIcon1 && <Image src={data.headingIcon1} alt="" fill className="object-cover" />}
            <ImageEditButton onPick={(url) => onChange({ headingIcon1: url })} aspect={1} />
          </div>
          <InlineText
            value={data.headingLine1Suffix}
            onChange={(v) => onChange({ headingLine1Suffix: v })}
            className="w-fit text-xl font-semibold text-[#1a1a2e]"
            placeholder="Suffix"
          />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <InlineText
            value={data.headingLine2Prefix}
            onChange={(v) => onChange({ headingLine2Prefix: v })}
            className="w-fit text-xl font-light text-[#9a9ab8]"
            placeholder="Line 2 prefix"
          />
          <div className="group relative h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md">
            {data.headingIcon2 && <Image src={data.headingIcon2} alt="" fill className="object-cover" />}
            <ImageEditButton onPick={(url) => onChange({ headingIcon2: url })} aspect={1} />
          </div>
          <InlineText
            value={data.headingLine2Bold}
            onChange={(v) => onChange({ headingLine2Bold: v })}
            className="w-fit text-xl font-semibold text-[#1a1a2e]"
            placeholder="Bold"
          />
          <InlineText
            value={data.headingLine2Light}
            onChange={(v) => onChange({ headingLine2Light: v })}
            className="w-fit text-xl font-light text-[#9a9ab8]"
            placeholder="Light"
          />
        </div>
        <InlineText
          value={data.description}
          onChange={(v) => onChange({ description: v })}
          className="max-w-md text-sm text-[#5a5a7a]"
          placeholder="Description"
          multiline
        />
        <InlineText
          value={data.label}
          onChange={(v) => onChange({ label: v })}
          className="w-fit text-sm font-semibold text-[#1a1a2e]"
          placeholder="Label above cards"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {data.cards.map((card, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-2xl p-5"
            style={{ backgroundColor: i === 0 ? "#ffe1d7" : "#f5f1ff" }}
          >
            <div className="group relative h-20 w-20 overflow-hidden rounded-2xl bg-white/40">
              {card.image && <Image src={card.image} alt="" fill className="object-cover" />}
              <ImageEditButton onPick={(url) => updateCard(i, { image: url })} aspect={1.55} />
            </div>
            <InlineText
              value={card.title}
              onChange={(v) => updateCard(i, { title: v })}
              className="text-lg font-bold text-[#1a1a2e]"
              placeholder="Title"
            />
            <InlineText
              value={card.description}
              onChange={(v) => updateCard(i, { description: v })}
              className="text-sm text-[#5a5a7a]"
              placeholder="Description"
              multiline
            />
            <div className="flex flex-wrap items-center gap-2">
              <InlineText
                value={card.primaryCtaLabel}
                onChange={(v) => updateCard(i, { primaryCtaLabel: v })}
                className="w-fit rounded-full bg-[#1a1a2e] px-4 py-1.5 text-xs font-semibold text-white"
                placeholder="Primary label"
              />
              <InlineText
                value={card.secondaryCtaLabel}
                onChange={(v) => updateCard(i, { secondaryCtaLabel: v })}
                className="w-fit rounded-full border border-[#1a1a2e]/25 px-4 py-1.5 text-xs font-semibold text-[#1a1a2e]"
                placeholder="Secondary label"
              />
            </div>
            <InlineText
              value={card.primaryCtaHref}
              onChange={(v) => updateCard(i, { primaryCtaHref: v })}
              className="w-fit text-[11px] text-[#5a5a7a]/70"
              placeholder="Primary link"
            />
          </div>
        ))}

        <div className="group relative min-h-[220px] overflow-hidden rounded-2xl lg:col-span-1">
          {data.lifestyleImage && (
            <Image src={data.lifestyleImage} alt="" fill className="object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <ImageEditButton onPick={(url) => onChange({ lifestyleImage: url })} aspect={0.85} />
          <div className="absolute left-4 top-4">
            <InlineText
              value={data.lifestyleBadge}
              onChange={(v) => onChange({ lifestyleBadge: v })}
              className="w-fit rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm"
              placeholder="Badge"
            />
          </div>
          <div className="absolute bottom-5 left-5 right-5">
            <InlineText
              value={data.lifestyleText}
              onChange={(v) => onChange({ lifestyleText: v })}
              className="text-xl font-bold leading-snug text-white"
              placeholder="Lifestyle text"
              multiline
            />
          </div>
        </div>
      </div>
      <DimensionHint text="product cards ~1.55:1, lifestyle card taller portrait (~0.85:1)" />

      <InlineText
        value={data.disclaimer}
        onChange={(v) => onChange({ disclaimer: v })}
        className="w-fit text-xs text-[#8888aa]"
        placeholder="Disclaimer"
      />
    </div>
  );
}
