export type Testimonial = {
  name: string;
  photo: string;
  rating: number;
  quote: string;
  tags: string[];
  product: string;
  productImage: string;
};

export type TestimonialsContent = {
  headingHighlight: string;
  headingRest: string;
  // Variable length — this is a horizontal scroll list, not a fixed grid,
  // so admins can add or remove testimonials freely.
  testimonials: Testimonial[];
};

export const defaultTestimonialsContent: TestimonialsContent = {
  headingHighlight: "Visible Results",
  headingRest: "Real people",
  testimonials: [
    {
      name: "Amara O.",
      photo: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381916/naya-glows/legacy/new/img_7419.jpg",
      rating: 4.9,
      quote:
        "My skin completely changed. The hyperpigmentation I'd been fighting for years is barely noticeable now.",
      tags: ["Dark Spots", "2 weeks"],
      product: "Pigment Corrector Cream",
      productImage: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381838/naya-glows/legacy/42cbfe95-d2a7-4d13-8a5e-72e62dcf1792.png",
    },
    {
      name: "Chinedu O.",
      photo: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381919/naya-glows/legacy/new/img_7421.jpg",
      rating: 4.8,
      quote:
        "This serum helped fade my acne marks and rough patches. After a month, my skin looked smoother and more even.",
      tags: ["Pigmentation", "1 month"],
      product: "Acne Correcting Serum",
      productImage: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381830/naya-glows/legacy/0323d23a-ed8d-4ab5-8f52-b8a8eb31e04f.png",
    },
    {
      name: "Tunde A.",
      photo: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381927/naya-glows/legacy/new/img_7558.jpg",
      rating: 4.9,
      quote:
        "Confidence in a bottle. My skin has never looked so clear and radiant — compliments everywhere I go.",
      tags: ["Confidence", "10 days"],
      product: "Radiance Boost Serum",
      productImage: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381853/naya-glows/legacy/img_6205.jpg",
    },
    {
      name: "Ngozi R.",
      photo: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381923/naya-glows/legacy/new/img_7557.jpg",
      rating: 4.8,
      quote:
        "The skin on my neck was loose and crepey. In 4 weeks, it felt tighter and smoother — such a visible lift!",
      tags: ["Firming", "4 weeks"],
      product: "Radiance Repair Lotion",
      productImage: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381841/naya-glows/legacy/5bbe98ac-b9a9-40aa-95a1-ad2f9d7a2ce6.png",
    },
    {
      name: "Emeka B.",
      photo: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381946/naya-glows/legacy/new/img_7565.jpg",
      rating: 4.7,
      quote:
        "The serum really works. Fine lines are softer and my skin feels fresher within two weeks of daily use.",
      tags: ["Anti-Aging", "2 weeks"],
      product: "Age Renewal Serum",
      productImage: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381851/naya-glows/legacy/eca30ff9-62ea-4126-8301-03d590c8250d.png",
    },
    {
      name: "Yewande K.",
      photo: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381942/naya-glows/legacy/new/img_7564.jpg",
      rating: 5.0,
      quote:
        "Finally found a cleanser that doesn't strip my skin. My complexion looks balanced and healthy every day.",
      tags: ["Balance", "3 weeks"],
      product: "Clarifying Foam Cleanser",
      productImage: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381832/naya-glows/legacy/056bf54d-5022-45a9-861d-fa2a3620f4a3.png",
    },
    {
      name: "Aisha H.",
      photo: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381912/naya-glows/legacy/new/dsc00420-copy.jpg",
      rating: 4.9,
      quote:
        "The body scrub transformed my skin. It feels soft, looks brighter, and I actually love showing my shoulders now.",
      tags: ["Body Care", "6 weeks"],
      product: "Exfoliating Body Scrub",
      productImage: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381835/naya-glows/legacy/19ea7a51-adb2-4a49-bcb7-0bbc0116f4f2.png",
    },
  ],
};
