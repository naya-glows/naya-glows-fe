"use client";

import Image from "next/image";
import { Plus, Trash2, Star } from "lucide-react";
import type { TestimonialsContent, Testimonial } from "@/lib/content/homeTestimonials";
import { InlineText } from "../InlineText";
import { ImageEditButton } from "../ImageEditButton";
import { DimensionHint } from "../DimensionHint";

const BLANK: Testimonial = {
  name: "New Customer",
  photo: "",
  rating: 5,
  quote: "",
  tags: [],
  product: "",
  productImage: "",
};

export function TestimonialsEditor({
  data,
  onChange,
}: {
  data: TestimonialsContent;
  onChange: (patch: Partial<TestimonialsContent>) => void;
}) {
  const update = (i: number, patch: Partial<Testimonial>) => {
    onChange({ testimonials: data.testimonials.map((t, idx) => (idx === i ? { ...t, ...patch } : t)) });
  };
  const add = () => onChange({ testimonials: [...data.testimonials, { ...BLANK }] });
  const remove = (i: number) =>
    onChange({ testimonials: data.testimonials.filter((_, idx) => idx !== i) });

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <InlineText
            value={data.headingHighlight}
            onChange={(v) => onChange({ headingHighlight: v })}
            className="w-fit text-xl font-semibold text-[#1a1a2e]"
            placeholder="Heading highlight"
          />
          <InlineText
            value={data.headingRest}
            onChange={(v) => onChange({ headingRest: v })}
            className="w-fit text-xl font-light text-[#9a9ab8]"
            placeholder="Heading rest"
          />
        </div>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1.5 rounded-full bg-[#d4e8d0] px-3 py-1.5 text-[11.5px] font-semibold text-[#4f7957]"
        >
          <Plus size={14} />
          Add testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.testimonials.map((t, i) => (
          <div key={i} className="relative flex flex-col items-center gap-2 rounded-2xl bg-[#f5f5f5] p-5 text-center">
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove testimonial"
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-red-500 hover:bg-red-100"
            >
              <Trash2 size={14} />
            </button>
            <div className="group relative h-16 w-16 overflow-hidden rounded-full border-4 border-white shadow-md">
              {t.photo && <Image src={t.photo} alt="" fill className="object-cover" />}
              <ImageEditButton onPick={(url) => update(i, { photo: url })} aspect={1} />
            </div>
            <InlineText
              value={t.name}
              onChange={(v) => update(i, { name: v })}
              className="text-base font-bold text-[#1a1a2e]"
              placeholder="Name"
            />
            <div className="flex items-center gap-1">
              <Star size={11} className="fill-[#f5c775] text-[#f5c775]" />
              <InlineText
                value={String(t.rating)}
                onChange={(v) => update(i, { rating: Number(v.replace(/[^0-9.]/g, "")) || 0 })}
                className="w-10 text-xs font-semibold text-[#1a1a2e]"
                placeholder="4.9"
              />
            </div>
            <InlineText
              value={t.quote}
              onChange={(v) => update(i, { quote: v })}
              className="text-sm italic text-[#5a5a7a]"
              placeholder="Quote"
              multiline
            />
            <InlineText
              value={t.tags.join(", ")}
              onChange={(v) => update(i, { tags: v.split(",").map((s) => s.trim()).filter(Boolean) })}
              className="w-full text-xs text-[#1a1a2e]/70"
              placeholder="Tags, comma-separated"
            />
            <div className="mt-2 flex w-full items-center gap-2 rounded-xl bg-white p-2">
              <div className="group relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-[#f5f5f5]">
                {t.productImage && <Image src={t.productImage} alt="" fill className="object-cover" />}
                <ImageEditButton onPick={(url) => update(i, { productImage: url })} aspect={1} />
              </div>
              <InlineText
                value={t.product}
                onChange={(v) => update(i, { product: v })}
                className="flex-1 text-left text-xs font-semibold text-[#1a1a2e]"
                placeholder="Product name"
              />
            </div>
          </div>
        ))}
      </div>
      <DimensionHint text="portrait photo & product thumb both square (fit a circle / small tile)" />
    </div>
  );
}
