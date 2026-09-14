"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import type { ContactInfoContent } from "@/lib/content/contactInfo";
import { InlineText } from "../InlineText";

function Row({
  icon,
  label,
  value,
  onChange,
  placeholder,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#16241a]/10 py-3">
      <div className="flex items-center gap-3 text-[#16241a]/50">
        {icon}
        <span className="text-xs uppercase tracking-[0.25em]">{label}</span>
      </div>
      <InlineText
        value={value}
        onChange={onChange}
        className="w-fit text-right text-[0.9rem] text-[#16241a]/80"
        placeholder={placeholder}
      />
    </div>
  );
}

export function ContactInfoEditor({
  data,
  onChange,
}: {
  data: ContactInfoContent;
  onChange: (patch: Partial<ContactInfoContent>) => void;
}) {
  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] p-5">
      <Row
        icon={<Mail size={15} />}
        label="Email"
        value={data.email}
        onChange={(v) => onChange({ email: v })}
        placeholder="hello@nayaglows.com"
      />
      <Row
        icon={<Phone size={15} />}
        label="Number"
        value={data.phone}
        onChange={(v) => onChange({ phone: v })}
        placeholder="+234 800 000 0000"
      />
      <Row
        icon={<MapPin size={15} />}
        label="Address"
        value={data.address}
        onChange={(v) => onChange({ address: v })}
        placeholder="Lagos, Nigeria"
      />
    </div>
  );
}
