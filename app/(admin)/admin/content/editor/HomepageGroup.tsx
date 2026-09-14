"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useGetContentQuery } from "@/app/store/userApi";
import { useUpsertContentMutation, useListContentQuery } from "@/app/store/adminApi";
import { getApiErrorMessage } from "@/app/store/apiError";
import { mergeContent } from "@/app/store/useSectionContent";
import { isApiConfigured } from "@/lib/api";
import { defaultHeroContent, type HeroContent } from "@/lib/content/homeHero";
import { defaultIngredientsContent, type IngredientsContent } from "@/lib/content/homeIngredients";
import {
  defaultFeaturedProductsContent,
  type FeaturedProductsContent,
} from "@/lib/content/homeFeaturedProducts";
import { defaultHowItWorksContent, type HowItWorksContent } from "@/lib/content/homeHowItWorks";
import { defaultBestSellersContent, type BestSellersContent } from "@/lib/content/homeBestSellers";
import { defaultTestimonialsContent, type TestimonialsContent } from "@/lib/content/homeTestimonials";
import { defaultCategoriesContent, type CategoriesContent } from "@/lib/content/homeCategories";
import { defaultWhyChooseContent, type WhyChooseContent } from "@/lib/content/homeWhyChoose";
import { SectionShell } from "./SectionShell";
import { HeroEditor } from "./sections/HeroEditor";
import { IngredientsEditor } from "./sections/IngredientsEditor";
import { FeaturedProductsEditor } from "./sections/FeaturedProductsEditor";
import { HowItWorksEditor } from "./sections/HowItWorksEditor";
import { BestSellersEditor } from "./sections/BestSellersEditor";
import { TestimonialsEditor } from "./sections/TestimonialsEditor";
import { CategoriesEditor } from "./sections/CategoriesEditor";
import { WhyChooseEditor } from "./sections/WhyChooseEditor";

// Rendered in the real homepage's own section order (app/(public)/page.tsx),
// not registry.ts declaration order, so the editor reads top-to-bottom the
// same way the live page does.
type Draft = {
  "home.hero": HeroContent;
  "home.ingredients": IngredientsContent;
  "home.featuredProducts": FeaturedProductsContent;
  "home.howItWorks": HowItWorksContent;
  "home.bestSellers": BestSellersContent;
  "home.testimonials": TestimonialsContent;
  "home.categories": CategoriesContent;
  "home.whyChoose": WhyChooseContent;
};

type DraftKey = keyof Draft;

const SECTION_TITLES: Record<DraftKey, string> = {
  "home.hero": "Hero",
  "home.ingredients": "Key Ingredients",
  "home.featuredProducts": "Featured Products",
  "home.howItWorks": "How It Works",
  "home.bestSellers": "Best Sellers",
  "home.testimonials": "Testimonials",
  "home.categories": "Shop Categories",
  "home.whyChoose": "Why Choose Naya",
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function HomepageGroup() {
  const skip = !isApiConfigured();
  const heroQ = useGetContentQuery("home.hero", { skip });
  const ingredientsQ = useGetContentQuery("home.ingredients", { skip });
  const featuredProductsQ = useGetContentQuery("home.featuredProducts", { skip });
  const howItWorksQ = useGetContentQuery("home.howItWorks", { skip });
  const bestSellersQ = useGetContentQuery("home.bestSellers", { skip });
  const testimonialsQ = useGetContentQuery("home.testimonials", { skip });
  const categoriesQ = useGetContentQuery("home.categories", { skip });
  const whyChooseQ = useGetContentQuery("home.whyChoose", { skip });

  const { data: blocks } = useListContentQuery();
  const overriddenKeys = new Set(blocks?.map((b) => b.key));

  const [upsertContent] = useUpsertContentMutation();
  const [saving, setSaving] = useState(false);

  const [draft, setDraft] = useState<Draft | null>(null);
  const [saved, setSaved] = useState<Draft | null>(null);
  const hydrated = useRef(false);

  const allLoaded =
    !heroQ.isLoading &&
    !ingredientsQ.isLoading &&
    !featuredProductsQ.isLoading &&
    !howItWorksQ.isLoading &&
    !bestSellersQ.isLoading &&
    !testimonialsQ.isLoading &&
    !categoriesQ.isLoading &&
    !whyChooseQ.isLoading;

  useEffect(() => {
    if (hydrated.current || !allLoaded) return;
    const initial: Draft = {
      "home.hero": mergeContent(defaultHeroContent, heroQ.data?.block?.data),
      "home.ingredients": mergeContent(defaultIngredientsContent, ingredientsQ.data?.block?.data),
      "home.featuredProducts": mergeContent(
        defaultFeaturedProductsContent,
        featuredProductsQ.data?.block?.data,
      ),
      "home.howItWorks": mergeContent(defaultHowItWorksContent, howItWorksQ.data?.block?.data),
      "home.bestSellers": mergeContent(defaultBestSellersContent, bestSellersQ.data?.block?.data),
      "home.testimonials": mergeContent(defaultTestimonialsContent, testimonialsQ.data?.block?.data),
      "home.categories": mergeContent(defaultCategoriesContent, categoriesQ.data?.block?.data),
      "home.whyChoose": mergeContent(defaultWhyChooseContent, whyChooseQ.data?.block?.data),
    };
    setDraft(clone(initial));
    setSaved(clone(initial));
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allLoaded]);

  const updateSection = <K extends DraftKey>(key: K, patch: Partial<Draft[K]>) => {
    setDraft((prev) => (prev ? { ...prev, [key]: { ...prev[key], ...patch } } : prev));
  };

  const dirtyKeys: DraftKey[] =
    draft && saved
      ? (Object.keys(draft) as DraftKey[]).filter(
          (key) => JSON.stringify(draft[key]) !== JSON.stringify(saved[key]),
        )
      : [];

  const handleSave = async () => {
    if (!draft || dirtyKeys.length === 0) return;
    setSaving(true);
    try {
      await Promise.all(
        dirtyKeys.map((key) => upsertContent({ key, data: draft[key] }).unwrap()),
      );
      setSaved(clone(draft));
      toast.success("Homepage content saved");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not save homepage content."));
    } finally {
      setSaving(false);
    }
  };

  if (!draft) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-[#4f7957]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      <SectionShell title={SECTION_TITLES["home.hero"]} customized={overriddenKeys.has("home.hero")}>
        <HeroEditor data={draft["home.hero"]} onChange={(p) => updateSection("home.hero", p)} />
      </SectionShell>

      <SectionShell
        title={SECTION_TITLES["home.ingredients"]}
        customized={overriddenKeys.has("home.ingredients")}
      >
        <IngredientsEditor
          data={draft["home.ingredients"]}
          onChange={(p) => updateSection("home.ingredients", p)}
        />
      </SectionShell>

      <SectionShell
        title={SECTION_TITLES["home.featuredProducts"]}
        customized={overriddenKeys.has("home.featuredProducts")}
      >
        <FeaturedProductsEditor
          data={draft["home.featuredProducts"]}
          onChange={(p) => updateSection("home.featuredProducts", p)}
        />
      </SectionShell>

      <SectionShell
        title={SECTION_TITLES["home.howItWorks"]}
        customized={overriddenKeys.has("home.howItWorks")}
      >
        <HowItWorksEditor
          data={draft["home.howItWorks"]}
          onChange={(p) => updateSection("home.howItWorks", p)}
        />
      </SectionShell>

      <SectionShell
        title={SECTION_TITLES["home.bestSellers"]}
        customized={overriddenKeys.has("home.bestSellers")}
      >
        <BestSellersEditor
          data={draft["home.bestSellers"]}
          onChange={(p) => updateSection("home.bestSellers", p)}
        />
      </SectionShell>

      <SectionShell
        title={SECTION_TITLES["home.testimonials"]}
        customized={overriddenKeys.has("home.testimonials")}
      >
        <TestimonialsEditor
          data={draft["home.testimonials"]}
          onChange={(p) => updateSection("home.testimonials", p)}
        />
      </SectionShell>

      <SectionShell
        title={SECTION_TITLES["home.categories"]}
        customized={overriddenKeys.has("home.categories")}
      >
        <CategoriesEditor
          data={draft["home.categories"]}
          onChange={(p) => updateSection("home.categories", p)}
        />
      </SectionShell>

      <SectionShell
        title={SECTION_TITLES["home.whyChoose"]}
        customized={overriddenKeys.has("home.whyChoose")}
      >
        <WhyChooseEditor
          data={draft["home.whyChoose"]}
          onChange={(p) => updateSection("home.whyChoose", p)}
        />
      </SectionShell>

      {dirtyKeys.length > 0 && (
        <div className="sticky bottom-4 z-30 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-full bg-[#16241a] px-6 py-3 text-[13px] font-semibold text-white shadow-lg hover:bg-[#233324] disabled:opacity-60"
          >
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
