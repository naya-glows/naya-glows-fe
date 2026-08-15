export type HeroContent = {
  eyebrow: string;
  headline: string;
  taglines: string[];
  body: string;
  backgroundImages: string[];
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
};

export const defaultHeroContent: HeroContent = {
  eyebrow: "Clean, Potent Skincare",
  headline: "Your Glow,",
  taglines: ["Backed by Science", "Made for Real Skin", "Radiant Every Day"],
  body: "Brightening, hydrating, and renewing formulas made with kojic acid, niacinamide, and hyaluronic acid.",
  // Solo male-model portraits (img_7421, img_7558, img_7565) removed per
  // explicit request; img_6323 (group shot, two women + one man) kept since
  // it isn't "of" the male model specifically and only 2 images would be
  // thin for a slider without it. Also de-duped img_6323, which was
  // accidentally listed twice.
  backgroundImages: [
    "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381863/naya-glows/legacy/img_6323.jpg",
    "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381938/naya-glows/legacy/new/img_7563.jpg",
    "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381942/naya-glows/legacy/new/img_7564.jpg",
  ],
  primaryCtaLabel: "Shop Now",
  primaryCtaHref: "/catalog",
  secondaryCtaLabel: "Our Story",
  secondaryCtaHref: "/our-story",
};
