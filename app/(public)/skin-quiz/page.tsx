"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import GlassCard from "../helpers/glass/GlassCard";
import PageHeader from "../helpers/PageHeader";

type CategorySlug = "serums" | "creams" | "cleansers" | "body";

const results: Record<
  CategorySlug,
  { title: string; tagline: string; blurb: string }
> = {
  serums: {
    title: "Face Serums",
    tagline: "Boost & Correct",
    blurb:
      "Your skin is asking for targeted actives: Vitamin C, Niacinamide, and Azelaic Acid to brighten, even tone, and correct.",
  },
  creams: {
    title: "Face Creams",
    tagline: "Renew & Correct",
    blurb:
      "Your priority is hydration and barrier repair: rich creams and oils with Squalane and Argan Oil to lock in moisture.",
  },
  cleansers: {
    title: "Cleanse & Tone",
    tagline: "Purify & Balance",
    blurb:
      "Clearer pores and a balanced complexion start here: Salicylic Acid and Kaolin Clay to purify without stripping.",
  },
  body: {
    title: "Body Care",
    tagline: "Glow & Nourish",
    blurb:
      "It's time to take the glow past your face: nourishing oils and butters for radiance from neck to toe.",
  },
};

const questions: { question: string; options: { label: string; value: CategorySlug }[] }[] = [
  {
    question: "How does your skin feel by midday?",
    options: [
      { label: "Oily and shiny", value: "cleansers" },
      { label: "Tight or dry", value: "creams" },
      { label: "Comfortable and balanced", value: "serums" },
      { label: "Sensitive, prone to redness", value: "creams" },
    ],
  },
  {
    question: "What's your main goal right now?",
    options: [
      { label: "Brightening & even tone", value: "serums" },
      { label: "Deep hydration & barrier repair", value: "creams" },
      { label: "Clearer pores, fewer breakouts", value: "cleansers" },
      { label: "Glow from head to toe", value: "body" },
    ],
  },
  {
    question: "How many steps is your current routine?",
    options: [
      { label: "Just the basics (1–2 steps)", value: "cleansers" },
      { label: "A steady routine (3–4 steps)", value: "serums" },
      { label: "Full ritual (5+ steps)", value: "creams" },
      { label: "Honestly, I need to start one", value: "body" },
    ],
  },
];

export default function SkinQuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<CategorySlug[]>([]);

  const isDone = step >= questions.length;

  const handleAnswer = (value: CategorySlug) => {
    setAnswers((a) => [...a, value]);
    setStep((s) => s + 1);
  };

  const restart = () => {
    setAnswers([]);
    setStep(0);
  };

  const recommendation = (): CategorySlug => {
    const counts: Record<CategorySlug, number> = { serums: 0, creams: 0, cleansers: 0, body: 0 };
    answers.forEach((a) => (counts[a] += 1));
    return (Object.keys(counts) as CategorySlug[]).reduce((best, key) =>
      counts[key] > counts[best] ? key : best,
    );
  };

  return (
    <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen">
      <section className="pt-32 sm:pt-36 pb-16 px-5 sm:px-8 lg:px-12">
        <PageHeader
          eyebrow="Two Minutes, Tops"
          heading="Find your Naya Glows starting point"
          subtitle="Answer a few quick questions and we'll point you to the right place to start."
        />
      </section>

      <section className="px-5 sm:px-8 lg:px-12 pb-24">
        <div className="max-w-[600px] mx-auto">
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {questions.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step && !isDone
                    ? "w-8 bg-[#16241a]"
                    : i < step || isDone
                      ? "w-4 bg-[#8ab88e]"
                      : "w-4 bg-[#16241a]/15"
                }`}
              />
            ))}
          </div>

          {!isDone ? (
            <GlassCard className="px-6 py-8 sm:p-10">
              <p className="text-xs uppercase tracking-[0.25em] text-[#6a9a72] font-semibold mb-3">
                Question {step + 1} of {questions.length}
              </p>
              <h2 className="text-xl sm:text-2xl font-light mb-6">
                {questions[step].question}
              </h2>
              <div className="flex flex-col gap-3">
                {questions[step].options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleAnswer(opt.value)}
                    className="text-left text-sm font-medium bg-white/60 hover:bg-white border border-white/60 hover:border-[#8ab88e] rounded-2xl px-5 py-4 transition-colors"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="px-6 py-10 sm:p-12 text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-[#6a9a72] font-semibold mb-3">
                We recommend
              </p>
              <h2 className="text-2xl sm:text-3xl font-light mb-1">
                {results[recommendation()].title}
              </h2>
              <p className="text-sm font-medium text-[#6a9a72] mb-5">
                {results[recommendation()].tagline}
              </p>
              <p className="text-sm text-[#16241a]/60 leading-relaxed max-w-sm mx-auto mb-8">
                {results[recommendation()].blurb}
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link
                  href={`/catalog?category=${recommendation()}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold bg-[#16241a] text-white px-7 py-3 rounded-full hover:bg-[#233324] transition-colors"
                >
                  Shop {results[recommendation()].title}
                  <ArrowRight size={14} />
                </Link>
                <button
                  onClick={restart}
                  className="inline-flex items-center gap-2 text-sm font-semibold border border-[#16241a]/20 text-[#16241a] px-7 py-3 rounded-full hover:bg-[#16241a]/5 transition-colors"
                >
                  <RotateCcw size={14} />
                  Retake Quiz
                </button>
              </div>
            </GlassCard>
          )}
        </div>
      </section>
    </main>
  );
}
