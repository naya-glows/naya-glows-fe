"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import GlassCard from "../helpers/glass/GlassCard";
import PageHeader from "../helpers/PageHeader";
import { useSubmitWholesaleInquiryMutation } from "../../store/userApi";
import { getApiErrorMessage } from "../../store/apiError";
import { isApiConfigured } from "@/lib/api";

const inputClass =
  "w-full bg-white/70 border border-white/60 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-[#16241a]/35 focus:border-[#8ab88e] transition-colors";

export default function WholesalePage() {
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
      toast.error("Wholesale inquiries aren't connected yet (NEXT_PUBLIC_API_URL isn't set).");
      return;
    }
    try {
      await submitInquiry(form).unwrap();
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
          <h1 className="text-2xl font-light mb-3">Inquiry sent</h1>
          <p className="text-sm text-[#16241a]/60 leading-relaxed mb-8">
            Thanks for your interest in stocking Naya Glows. Our team will
            be in touch about wholesale pricing and terms shortly.
          </p>
          <Link
            href="/"
            className="inline-block text-sm font-semibold bg-[#16241a] text-white px-6 py-2.5 rounded-full"
          >
            Back Home
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
            eyebrow="Partner With Us"
            heading="Wholesale Inquiries"
            subtitle="Interested in stocking Naya Glows in your store or spa? Tell us about your business and we'll follow up with pricing and terms."
            images={[
              {
                src: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381867/naya-glows/legacy/img_6324.jpg",
                alt: "Naya Glows products",
                afterWord: 0,
              },
            ]}
            className="mb-10"
          />

          <GlassCard className="px-4 py-6 sm:p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Business name"
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
                placeholder="Tell us about your business (optional)"
                value={form.message}
                onChange={updateField("message")}
                className={`${inputClass} min-h-[100px]`}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 bg-[#16241a] text-white text-sm font-semibold px-6 py-3.5 rounded-full hover:bg-[#233324] transition-colors disabled:opacity-60"
              >
                {isLoading ? "Sending…" : "Submit Inquiry"}
              </button>
            </form>
          </GlassCard>
        </div>
      </section>
    </main>
  );
}
