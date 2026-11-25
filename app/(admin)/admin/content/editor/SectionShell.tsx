"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

// Titled card wrapper every section editor renders inside. `onSave` is
// optional — the homepage group shares one sticky save bar instead (see
// page.tsx), so only the standalone sections (catalog hero, contact info,
// branches) pass save/dirty/saving here.
//
// `visible`/`onToggleVisible` are also optional — only sections whose public
// display actually checks a "_visible" flag in its own content (see
// SectionGate.tsx) should pass these; a section that can't sensibly be
// hidden entirely (e.g. the Contact page's own address block) just omits
// them and gets no switch.
export function SectionShell({
  title,
  children,
  customized,
  dirty,
  onSave,
  saving,
  visible,
  onToggleVisible,
}: {
  title: string;
  children: ReactNode;
  customized?: boolean;
  dirty?: boolean;
  onSave?: () => void;
  saving?: boolean;
  visible?: boolean;
  onToggleVisible?: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-none sm:rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#16241a]/50">
            {title}
          </p>
          {customized && (
            <span className="text-[9px] font-semibold uppercase tracking-wide text-[#4f7957] bg-[#d4e8d0] px-2 py-0.5 rounded-full">
              Customized
            </span>
          )}
          {!visible && onToggleVisible && (
            <span className="text-[9px] font-semibold uppercase tracking-wide text-[#8a6f1f] bg-[#f4e8c9] px-2 py-0.5 rounded-full">
              Hidden
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {onToggleVisible && (
            <label className="flex items-center gap-1.5 text-[10.5px] font-medium text-[#16241a]/60 cursor-pointer select-none">
              {visible ? "Shown" : "Hidden"}
              <button
                type="button"
                role="switch"
                aria-checked={visible}
                onClick={onToggleVisible}
                className={`relative w-8 h-[18px] rounded-full transition-colors ${
                  visible ? "bg-[#6a9a72]" : "bg-[#16241a]/20"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                    visible ? "translate-x-[17px]" : "translate-x-0.5"
                  }`}
                />
              </button>
            </label>
          )}
          {onSave && dirty && (
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-full bg-[#16241a] px-4 py-1.5 text-[11.5px] font-semibold text-white disabled:opacity-60"
            >
              {saving && <Loader2 size={12} className="animate-spin" />}
              Save
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
