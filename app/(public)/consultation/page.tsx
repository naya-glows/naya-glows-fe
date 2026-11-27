"use client";

import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Check, MessageCircle } from "lucide-react";
import GlassCard from "../helpers/glass/GlassCard";
import PageHeader from "../helpers/PageHeader";
import MonthCalendar from "../helpers/MonthCalendar";
import {
  useListConsultationTypesQuery,
  useGetConsultationAvailabilityQuery,
  useCreateConsultationBookingMutation,
  usePayConsultationMutation,
} from "../../store/userApi";
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
  const backendReady = isApiConfigured();
  const { data: typesData } = useListConsultationTypesQuery(undefined, { skip: !backendReady });
  const types = typesData?.types ?? [];

  const [typeSlug, setTypeSlug] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", skinConcern: skinConcerns[0], message: "" });

  const { data: availabilityData, isFetching: loadingSlots } = useGetConsultationAvailabilityQuery(
    { date: selectedDate ?? "", typeSlug: typeSlug ?? "" },
    { skip: !selectedDate || !typeSlug },
  );

  const [createBooking, { isLoading: booking }] = useCreateConsultationBookingMutation();
  const [payConsultation, { isLoading: paying }] = usePayConsultationMutation();
  const submitting = booking || paying;

  const selectedType = types.find((t) => t.slug === typeSlug);

  const bookingWindow = useMemo(() => {
    const min = new Date();
    min.setHours(0, 0, 0, 0);
    const max = new Date(min);
    max.setMonth(max.getMonth() + 12); // rolling 12-month booking window
    return { min, max };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedType || !selectedDate || !selectedTime) {
      toast.error("Choose a consultation type, date and time.");
      return;
    }
    try {
      const { request } = await createBooking({
        consultationTypeSlug: selectedType.slug,
        scheduledDate: `${selectedDate}T${selectedTime}:00.000Z`,
        ...form,
      }).unwrap();
      const { authorizationUrl } = await payConsultation(request.id).unwrap();
      window.location.href = authorizationUrl;
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't book your consultation. Please try again."));
    }
  };

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
                src: "https://res.cloudinary.com/bhozkz7o/image/upload/v1795774504/naya-glows/bhdjn8omcikp8b0fx6h1.jpg",
                alt: "Skincare consultation",
                afterWord: 3,
              },
            ]}
            className="mb-6"
          />

          <a
            href="https://wa.me/2347015239681"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#4f7957] bg-[#d4e8d0] px-4 py-2.5 rounded-full mb-10 hover:bg-[#c3ddbd] transition-colors"
          >
            <MessageCircle size={15} />
            Have a quick question first? Chat with us on WhatsApp
          </a>

          <div className="flex flex-col gap-3 mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-[#16241a]/50">
              1. Choose a consultation type
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {types.map((t) => (
                <button
                  key={t.slug}
                  type="button"
                  onClick={() => {
                    setTypeSlug(t.slug);
                    setSelectedTime(null);
                  }}
                  className={`text-left rounded-xl border-2 p-4 bg-white/70 transition-colors ${
                    typeSlug === t.slug ? "border-[#6a9a72]" : "border-transparent hover:border-[#6a9a72]/40"
                  }`}
                >
                  <p className="text-sm font-semibold mb-1">{t.name}</p>
                  <p className="text-xs text-[#16241a]/55">₦{t.feeNgn.toLocaleString()} · {t.durationMinutes} min</p>
                </button>
              ))}
            </div>
          </div>

          {typeSlug && (
            <div className="flex flex-col gap-3 mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-[#16241a]/50">2. Choose a date</h2>
              <MonthCalendar
                selectedDate={selectedDate}
                onSelectDate={(d) => {
                  setSelectedDate(d);
                  setSelectedTime(null);
                }}
                isDateDisabled={(date) => date.getDay() === 0} // Sundays — closed
                minDate={bookingWindow.min}
                maxDate={bookingWindow.max}
              />
            </div>
          )}

          {selectedDate && typeSlug && (
            <div className="flex flex-col gap-3 mb-8">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-[#16241a]/50">3. Choose a time</h2>
              {loadingSlots ? (
                <p className="text-sm text-[#16241a]/50">Loading available times…</p>
              ) : !availabilityData?.slots.length ? (
                <p className="text-sm text-[#16241a]/50">No times available this day — try another date.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {availabilityData.slots.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTime(t)}
                      className={`text-xs font-medium px-3.5 py-2 rounded-full border transition-colors ${
                        selectedTime === t
                          ? "bg-[#16241a] text-white border-[#16241a]"
                          : "bg-white/70 border-white/60 hover:border-[#6a9a72]/50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedTime && (
            <GlassCard className="px-4 py-6 sm:p-8">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-4">
                4. Your details
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    required
                    placeholder="Full name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className={inputClass}
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <input
                  required
                  type="tel"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className={inputClass}
                />
                <select
                  required
                  value={form.skinConcern}
                  onChange={(e) => setForm((f) => ({ ...f, skinConcern: e.target.value }))}
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
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className={`${inputClass} min-h-[100px]`}
                />

                <div className="flex items-center gap-2 text-xs text-[#16241a]/50 bg-white/50 rounded-xl p-3">
                  <Check size={14} className="text-[#4f7957] flex-shrink-0" />
                  {selectedType?.name} · {new Date(`${selectedDate}T00:00:00Z`).toLocaleDateString("en-NG", { dateStyle: "medium", timeZone: "UTC" })} at {selectedTime} · ₦{selectedType?.feeNgn.toLocaleString()}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 bg-[#16241a] text-white text-sm font-semibold px-6 py-3.5 rounded-full hover:bg-[#233324] transition-colors disabled:opacity-60"
                >
                  {submitting ? "Redirecting to Paystack…" : `Pay ₦${selectedType?.feeNgn.toLocaleString()} & Confirm Booking`}
                </button>
              </form>
            </GlassCard>
          )}
        </div>
      </section>
    </main>
  );
}
