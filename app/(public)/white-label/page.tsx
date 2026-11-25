"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import GlassCard from "../helpers/glass/GlassCard";
import PageHeader from "../helpers/PageHeader";
import { useSubmitWholesaleInquiryMutation, usePayWholesaleInquiryMutation } from "../../store/userApi";
import { getApiErrorMessage } from "../../store/apiError";
import { isApiConfigured } from "@/lib/api";

const inputClass =
  "w-full bg-white/70 border border-white/60 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-[#16241a]/35 focus:border-[#8ab88e] transition-colors";

const WHATSAPP_URL = "https://wa.me/2347015239681";

export default function WhiteLabelPage() {
  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitInquiry, { isLoading: submitting }] = useSubmitWholesaleInquiryMutation();
  const [payInquiry, { isLoading: paying }] = usePayWholesaleInquiryMutation();
  const backendReady = isApiConfigured();
  const busy = submitting || paying;

  const updateField =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!backendReady) {
      toast.error("White-label enquiries aren't connected yet (NEXT_PUBLIC_API_URL isn't set).");
      return;
    }
    try {
      const { inquiry } = await submitInquiry({ ...form, type: "WHITE_LABEL" }).unwrap();
      const { authorizationUrl } = await payInquiry(inquiry.id).unwrap();
      window.location.href = authorizationUrl;
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't start your consultation. Please try again."));
    }
  };

  return (
    <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen">
      <section className="pt-32 sm:pt-36 pb-24 px-5 sm:px-8 lg:px-12">
        <div className="max-w-[700px] mx-auto">
          <PageHeader
            eyebrow="For Brands & Businesses"
            heading="White-Label Skincare Services"
            subtitle="Create your own skincare line under your own brand. We'll walk you through formulation, product range and production once we've discussed your goals in a paid consultation."
            images={[
              {
                src: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381867/naya-glows/legacy/img_6324.jpg",
                alt: "Naya Glows products",
                afterWord: 0,
              },
            ]}
            className="mb-8"
          />

          <GlassCard className="px-5 py-5 sm:p-6 mb-6">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#16241a]/45 mb-1">
                  Consultation Fee
                </p>
                <p className="text-2xl font-light">₦50,000</p>
                <p className="text-xs text-[#16241a]/50 mt-1">
                  Paid before we proceed, to discuss your business goals, formulation needs and product range.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#16241a]/45 mb-1">
                  Minimum Order Quantity
                </p>
                <p className="text-2xl font-light">50 pieces</p>
                <p className="text-xs text-[#16241a]/50 mt-1">Per product/item, for production runs.</p>
              </div>
            </div>
          </GlassCard>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#4f7957] bg-[#d4e8d0] px-4 py-2.5 rounded-full mb-8 hover:bg-[#c3ddbd] transition-colors"
          >
            <MessageCircle size={15} />
            Have a preliminary question? Chat with us on WhatsApp
          </a>

          <GlassCard className="px-4 py-6 sm:p-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#16241a]/50 mb-4">
              Book Your Product Development Consultation
            </h2>
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
                placeholder="Tell us about your product goals (optional)"
                value={form.message}
                onChange={updateField("message")}
                className={`${inputClass} min-h-[100px]`}
              />

              <button
                type="submit"
                disabled={busy}
                className="mt-2 bg-[#16241a] text-white text-sm font-semibold px-6 py-3.5 rounded-full hover:bg-[#233324] transition-colors disabled:opacity-60"
              >
                {busy ? "Redirecting to payment…" : "Pay ₦50,000 & Book Consultation"}
              </button>
            </form>
          </GlassCard>
        </div>
      </section>
    </main>
  );
}
