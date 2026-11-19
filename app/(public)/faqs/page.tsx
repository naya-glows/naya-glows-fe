"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import GlassCard from "../helpers/glass/GlassCard";
import PageHeader from "../helpers/PageHeader";

const faqs = [
  {
    question: "How long does shipping take?",
    answer:
      "Orders within Nigeria typically arrive in 2–5 business days. International orders usually take 7–14 business days, depending on destination. You'll get a tracking link by email as soon as your order ships.",
  },
  {
    question: "What's your return policy?",
    answer:
      "Unopened, unused products can be returned within 14 days of delivery for a full refund. Opened products aren't eligible for return, but if something arrived damaged or wrong, contact us and we'll make it right.",
  },
  {
    question: "Are your products dermatologist tested?",
    answer:
      "Yes, every Naya Glows formula is dermatologist tested and formulated without harsh sulfates or parabens, so they're gentle enough for daily use across most skin types.",
  },
  {
    question: "Can I cancel or change my Subscribe & Save order?",
    answer:
      "Absolutely. Subscriptions have no lock-in, so you can pause, change, or cancel anytime from your account before your next order is placed.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship worldwide. Shipping costs and delivery estimates are calculated at checkout based on your address.",
  },
  {
    question: "How do I know which products are right for my skin?",
    answer:
      "Take our two-minute Skin Quiz for a personalized starting point, or book a free online consultation with our team for tailored advice.",
  },
  {
    question: "Is there a wholesale program for stores or spas?",
    answer:
      "Yes, visit our Wholesale Inquiries page to tell us about your business, and our team will follow up with pricing and terms.",
  },
];

function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-[#16241a]/10 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 text-left py-5"
      >
        <span className="text-sm sm:text-base font-medium">{question}</span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 text-[#6a9a72] transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-sm text-[#16241a]/60 leading-relaxed pb-5">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FaqsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen">
      <section className="pt-32 sm:pt-36 pb-16 px-5 sm:px-8 lg:px-12">
        <PageHeader
          eyebrow="Good to Know"
          heading="Frequently asked questions"
          subtitle="Everything you need to know about shopping, shipping, and using Naya Glows."
        />
      </section>

      <section className="px-5 sm:px-8 lg:px-12 pb-24">
        <div className="max-w-[700px] mx-auto">
          <GlassCard className="px-6 sm:px-8 py-2">
            {faqs.map((faq, i) => (
              <FaqItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                open={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </GlassCard>

          <div className="text-center mt-12">
            <p className="text-sm text-[#16241a]/50 mb-4">Still have a question?</p>
            <Link
              href="/contact"
              className="inline-block text-sm font-semibold bg-[#16241a] text-white px-7 py-3 rounded-full hover:bg-[#233324] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
