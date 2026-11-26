"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CheckCircle2, MessageCircle, Gift, Users, PartyPopper, Sparkles } from "lucide-react";
import GlassCard from "../helpers/glass/GlassCard";
import PageHeader from "../helpers/PageHeader";
import { useSubmitWholesaleInquiryMutation } from "../../store/userApi";
import { getApiErrorMessage } from "../../store/apiError";
import { isApiConfigured } from "@/lib/api";

const inputClass =
  "w-full bg-white/70 border border-white/60 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-[#16241a]/35 focus:border-[#8ab88e] transition-colors";

const WHATSAPP_URL = "https://wa.me/2347015239681";

const useCases = [
  { icon: Users, label: "Employee gifting & appreciation" },
  { icon: Gift, label: "Client gifts & onboarding boxes" },
  { icon: PartyPopper, label: "Event souvenirs" },
  { icon: Sparkles, label: "Special occasion gifting" },
];

export default function CorporateGiftingPage() {
  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitInquiry, { isLoading }] = useSubmitWholesaleInquiryMutation();
  const backendReady = isApiConfigured();

  const updateField =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!backendReady) {
      toast.error("Corporate gifting enquiries aren't connected yet (NEXT_PUBLIC_API_URL isn't set).");
      return;
    }
    try {
      await submitInquiry({ ...form, type: "CORPORATE_GIFTING" }).unwrap();
      setSubmitted(true);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  if (submitted) {
    return (
      <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen flex items-center justify-center px-5">
        <GlassCard className="max-w-md w-full text-center py-16 px-6 sm:px-8">
          <div className="w-16 h-16 rounded-full bg-white/70 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={28} className="text-[#6a9a72]" />
          </div>
          <h1 className="text-2xl font-light mb-3 text-[#16241a]">Enquiry sent</h1>
          <p className="text-sm text-[#16241a]/60 leading-relaxed mb-8">
            Thanks for reaching out. We'll follow up to arrange a meeting and discuss your gifting needs —
            or chat with us right away on WhatsApp.
          </p>
          <div className="flex flex-col gap-3 items-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#4f7957] bg-[#d4e8d0] px-5 py-2.5 rounded-full hover:bg-[#c3ddbd] transition-colors"
            >
              <MessageCircle size={15} />
              Chat on WhatsApp
            </a>
            <Link href="/" className="inline-block text-sm font-semibold bg-[#16241a] text-white px-6 py-2.5 rounded-full">
              Back Home
            </Link>
          </div>
        </GlassCard>
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen">
      <section className="pt-32 sm:pt-36 pb-24 px-5 sm:px-8 lg:px-12">
        <div className="max-w-[700px] mx-auto">
          <PageHeader
            eyebrow="For Companies & Organisations"
            heading="Corporate Gifting"
            subtitle="Customisable skincare gift boxes for employee appreciation, client gifts, events and special occasions — no consultation fee, just reach out and we'll take it from there."
            images={[
              {
                src: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381867/naya-glows/legacy/img_6324.jpg",
                alt: "Naya Glows gift sets",
                afterWord: 0,
              },
            ]}
            className="mb-8"
          />

          <div className="grid grid-cols-2 gap-3 mb-8">
            {useCases.map(({ icon: Icon, label }) => (
              <div key={label} className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#d4e8d0] flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-[#4f7957]" />
                </div>
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#4f7957] px-4 py-3.5 rounded-full mb-8 hover:bg-[#436a4b] transition-colors"
          >
            <MessageCircle size={16} />
            Chat with us on WhatsApp to discuss your gifting needs
          </a>

          <GlassCard className="px-4 py-6 sm:p-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1">
              Or Send Us an Enquiry
            </h2>
            <p className="text-xs text-[#16241a]/45 mb-4">No payment required — we'll reach out to arrange a meeting.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Company / organisation name"
                  value={form.businessName}
                  onChange={updateField("businessName")}
                  className={inputClass}
                />
                <input
                  required
                  placeholder="Contact name"
                  value={form.contactName}
                  onChange={updateField("contactName")}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  required
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={updateField("email")}
                  className={inputClass}
                />
                <input
                  type="tel"
                  placeholder="Phone number (optional)"
                  value={form.phone}
                  onChange={updateField("phone")}
                  className={inputClass}
                />
              </div>
              <textarea
                placeholder="Tell us about your gifting needs (optional)"
                value={form.message}
                onChange={updateField("message")}
                className={`${inputClass} min-h-[100px]`}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 bg-[#16241a] text-white text-sm font-semibold px-6 py-3.5 rounded-full hover:bg-[#233324] transition-colors disabled:opacity-60"
              >
                {isLoading ? "Sending…" : "Submit Enquiry"}
              </button>
            </form>
          </GlassCard>
        </div>
      </section>
    </main>
  );
}
