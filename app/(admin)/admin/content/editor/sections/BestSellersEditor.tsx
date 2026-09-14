"use client";

import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import type { BestSellersContent, BestSellerCard } from "@/lib/content/homeBestSellers";
import { InlineText } from "../InlineText";
import { ImageEditButton } from "../ImageEditButton";
import { DimensionHint } from "../DimensionHint";

const BLANK_CARD: BestSellerCard = {
  name: "New Customer",
  result: "Result headline",
  quote: "",
  image: "",
  productImage: "",
  productName: "",
  productSub: "",
  href: "/catalog",
};

export function BestSellersEditor({
  data,
  onChange,
}: {
  data: BestSellersContent;
  onChange: (patch: Partial<BestSellersContent>) => void;
}) {
  const updateCard = (i: number, patch: Partial<BestSellerCard>) => {
    onChange({ cards: data.cards.map((c, idx) => (idx === i ? { ...c, ...patch } : c)) });
  };
  const addCard = () => onChange({ cards: [...data.cards, { ...BLANK_CARD }] });
  const removeCard = (i: number) => onChange({ cards: data.cards.filter((_, idx) => idx !== i) });

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-[#eafbf0] p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xl font-semibold text-[#1a1a2e]">Best Sellers,</p>
          <InlineText
            value={data.headingHighlight}
            onChange={(v) => onChange({ headingHighlight: v })}
            className="w-fit text-xl font-light text-[#6a9a72]"
            placeholder="Highlight word"
          />
        </div>
        <button
          type="button"
          onClick={addCard}
          className="flex items-center gap-1.5 rounded-full bg-[#d4e8d0] px-3 py-1.5 text-[11.5px] font-semibold text-[#4f7957]"
        >
          <Plus size={14} />
          Add card
        </button>
      </div>
      <InlineText
        value={data.headingRest}
        onChange={(v) => onChange({ headingRest: v })}
        className="w-fit text-xl font-light text-[#6a9a72]"
        placeholder="Heading rest"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {data.cards.map((card, i) => (
          <div key={i} className="relative flex flex-col items-center gap-3 rounded-2xl bg-[#ddf6e5] p-6 text-center">
            <button
              type="button"
              onClick={() => removeCard(i)}
              aria-label="Remove card"
              className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-red-500 hover:bg-red-100"
            >
              <Trash2 size={14} />
            </button>
            <InlineText
              value={card.name}
              onChange={(v) => updateCard(i, { name: v })}
              className="text-sm font-bold text-[#1a1a2e]"
              placeholder="Name, age"
            />
            <InlineText
              value={card.result}
              onChange={(v) => updateCard(i, { result: v })}
              className="text-sm font-semibold text-[#1a1a2e]"
              placeholder="Result"
            />
            <InlineText
              value={card.quote}
              onChange={(v) => updateCard(i, { quote: v })}
              className="max-w-[80%] text-sm text-[#5a5a7a]"
              placeholder="Quote"
              multiline
            />
            <div className="group relative h-32 w-32 overflow-hidden rounded-full bg-[#add0b3]">
              {card.image && <Image src={card.image} alt="" fill className="object-cover" />}
              <ImageEditButton onPick={(url) => updateCard(i, { image: url })} aspect={1} />
            </div>
            <div className="flex w-full items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="group relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-[#ffe1d7]">
                  {card.productImage && (
                    <Image src={card.productImage} alt="" fill className="object-cover" />
                  )}
                  <ImageEditButton onPick={(url) => updateCard(i, { productImage: url })} aspect={1} />
                </div>
                <div className="flex flex-col items-start">
                  <InlineText
                    value={card.productName}
                    onChange={(v) => updateCard(i, { productName: v })}
                    className="text-sm font-semibold text-[#1a1a2e]"
                    placeholder="Product name"
                  />
                  <InlineText
                    value={card.productSub}
                    onChange={(v) => updateCard(i, { productSub: v })}
                    className="text-xs text-[#9a9ab8]"
                    placeholder="Product subtitle"
                  />
                </div>
              </div>
              <InlineText
                value={card.href}
                onChange={(v) => updateCard(i, { href: v })}
                className="w-fit text-[11px] text-[#5a5a7a]/70"
                placeholder="Link"
              />
            </div>
          </div>
        ))}
      </div>
      <DimensionHint text="customer photo square (fits a circle), product thumb square" />
    </div>
  );
}
