export type BestSellerCard = {
  name: string;
  result: string;
  quote: string;
  image: string;
  productImage: string;
  productName: string;
  productSub: string;
  href: string;
};

export type BestSellersContent = {
  headingHighlight: string;
  headingRest: string;
  cards: BestSellerCard[];
};

export const defaultBestSellersContent: BestSellersContent = {
  headingHighlight: "Real",
  headingRest: "Results",
  cards: [
    {
      name: "Amara, 34 years",
      result: "Visibly brighter skin in 4 weeks",
      quote:
        "\"The Naya Radiance Clarifying Black Soap transformed my skin. It's clearer, more even.\"",
      image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381930/naya-glows/legacy/new/img_7561.jpg",
      productImage: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381842/naya-glows/legacy/5d4e84fb-2a40-4b0c-ae19-62d695738a31.png",
      productName: "Radiance Clarifying",
      productSub: "Black Soap",
      href: "/products/clarifying-black-soap",
    },
    {
      name: "Kezia, 29 years",
      result: "Smoother, glowing skin in 3 weeks",
      quote:
        "\"The Naya Radiance Nourishing Body Butter gave me a noticeable glow. My skin feels softer and more radiant.\"",
      image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381938/naya-glows/legacy/new/img_7563.jpg",
      productImage: "https://res.cloudinary.com/bhozkz7o/image/upload/v1785160442/naya-glows/recent/radiance-nourishing-body-butter.png",
      productName: "Radiance Nourishing",
      productSub: "Body Butter",
      href: "/products/radiance-nourishing-body-butter",
    },
  ],
};
