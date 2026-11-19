"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import GlassCard from "../helpers/glass/GlassCard";
import PageHeader from "../helpers/PageHeader";
import { useSubmitConsultationMutation } from "../../store/userApi";
import { getApiErrorMessage } from "../../store/apiError";
import { isApiConfigured } from "@/lib/api";

const inputClass =
  "w-full bg-white/70 border border-white/60 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-[#16241a]/35 focus:border-[#8ab88e] transition-colors";

const skinConcerns = [
  "Hyperpigmentation & dark spots",
  "Acne & breakouts",
  "Dryness & dehydration",
  "Fine lines & firmness",
  "Sensitivity & redness",
  "General glow-up",
];

export default function ConsultationPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    skinConcern: skinConcerns[0],
    preferredDate: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitConsultation, { isLoading }] = useSubmitConsultationMutation();
  const backendReady = isApiConfigured();

  const updateField =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!backendReady) {
      toast.error("Consultations aren't connected yet (NEXT_PUBLIC_API_URL isn't set).");
      return;
    }
    try {
      await submitConsultation({
        ...form,
        preferredDate: form.preferredDate || undefined,
      }).unwrap();
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
          <h1 className="text-2xl font-light mb-3">Request received</h1>
          <p className="text-sm text-[#16241a]/60 leading-relaxed mb-8">
            Thank you. We&apos;ve emailed you a confirmation. Our team will
            reach out shortly to schedule your consultation.
          </p>
          <Link
            href="/catalog"
            className="inline-block text-sm font-semibold bg-[#16241a] text-white px-6 py-2.5 rounded-full"
          >
            Continue Shopping
          </Link>
        </GlassCard>
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen">
      <section className="pt-32 sm:pt-36 pb-24 px-5 sm:px-8 lg:px-12">
        <div className="max-w-[700px] mx-auto">
          <PageHeader
            eyebrow="Personalized Support"
            heading="Book an Online Consultation"
            subtitle="Tell us about your skin and goals, and one of our specialists will help you build a routine that actually works."
            images={[
              {
                src: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381880/naya-glows/legacy/nature-girl1.jpg",
                alt: "Skincare consultation",
                afterWord: 3,
              },
            ]}
            className="mb-10"
          />

          <GlassCard className="px-4 py-6 sm:p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Full name"
                  value={form.name}
                  onChange={updateField("name")}
                  className={inputClass}
                />
                <input
                  required
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={updateField("email")}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Phone number (optional)"
                  value={form.phone}
                  onChange={updateField("phone")}
                  className={inputClass}
                />
                <input
                  type="date"
                  placeholder="Preferred date"
                  value={form.preferredDate}
                  onChange={updateField("preferredDate")}
                  className={inputClass}
                />
              </div>
              <select
                required
                value={form.skinConcern}
                onChange={updateField("skinConcern")}
                className={inputClass}
              >
                {skinConcerns.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Anything else you'd like us to know? (optional)"
                value={form.message}
                onChange={updateField("message")}
                className={`${inputClass} min-h-[100px]`}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 bg-[#16241a] text-white text-sm font-semibold px-6 py-3.5 rounded-full hover:bg-[#233324] transition-colors disabled:opacity-60"
              >
                {isLoading ? "Sending…" : "Request Consultation"}
              </button>
            </form>
          </GlassCard>
        </div>
      </section>
    </main>
  );
}
