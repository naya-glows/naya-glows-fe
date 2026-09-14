"use client";

import { MapPin, Phone, Clock, Plus, Trash2 } from "lucide-react";
import type { BranchesContent, Branch } from "@/lib/content/businessBranches";
import { InlineText } from "../InlineText";

const BLANK: Branch = { name: "New Branch", address: "", phone: "", hours: "" };

export function BranchesEditor({
  data,
  onChange,
}: {
  data: BranchesContent;
  onChange: (patch: Partial<BranchesContent>) => void;
}) {
  const update = (i: number, patch: Partial<Branch>) => {
    onChange({ branches: data.branches.map((b, idx) => (idx === i ? { ...b, ...patch } : b)) });
  };
  const add = () => onChange({ branches: [...data.branches, { ...BLANK }] });
  const remove = (i: number) => onChange({ branches: data.branches.filter((_, idx) => idx !== i) });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <InlineText
          value={data.heading}
          onChange={(v) => onChange({ heading: v })}
          className="w-fit text-xl font-light text-[#16241a]"
          placeholder="Page heading"
        />
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1.5 rounded-full bg-[#d4e8d0] px-3 py-1.5 text-[11.5px] font-semibold text-[#4f7957]"
        >
          <Plus size={14} />
          Add branch
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {data.branches.map((b, i) => (
          <div
            key={i}
            className="relative rounded-3xl border border-white/60 bg-white/50 backdrop-blur-xl p-5"
          >
            {data.branches.length > 1 && (
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Remove branch"
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-red-500 hover:bg-red-100"
              >
                <Trash2 size={14} />
              </button>
            )}
            <InlineText
              value={b.name}
              onChange={(v) => update(i, { name: v })}
              className="w-fit text-lg font-semibold text-[#16241a]"
              placeholder="Branch name"
            />
            <div className="mt-3 flex flex-col gap-2.5 text-sm text-[#16241a]/70">
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0 text-[#6a9a72]" />
                <InlineText
                  value={b.address}
                  onChange={(v) => update(i, { address: v })}
                  className="flex-1 text-left"
                  placeholder="Address"
                />
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={15} className="shrink-0 text-[#6a9a72]" />
                <InlineText
                  value={b.phone}
                  onChange={(v) => update(i, { phone: v })}
                  className="flex-1 text-left"
                  placeholder="Phone"
                />
              </div>
              <div className="flex items-center gap-2.5">
                <Clock size={15} className="shrink-0 text-[#6a9a72]" />
                <InlineText
                  value={b.hours}
                  onChange={(v) => update(i, { hours: v })}
                  className="flex-1 text-left"
                  placeholder="Hours"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
