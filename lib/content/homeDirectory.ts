// Shared shape for the two "tile grid" homepage sections (Services &
// Programmes, For Businesses) — both are structurally identical (eyebrow +
// two-line heading + 3 photo tiles), so they share one type/editor rather
// than duplicating near-identical content definitions.
export type DirectoryTile = {
  title: string;
  copy: string;
  href: string;
  image: string;
};

export type DirectoryContent = {
  eyebrow: string;
  headingBold: string;
  headingLight: string;
  tiles: [DirectoryTile, DirectoryTile, DirectoryTile];
};

export const defaultServicesDirectoryContent: DirectoryContent = {
  eyebrow: "Beyond The Shelf",
  headingBold: "Services",
  headingLight: "& programmes",
  tiles: [
    {
      title: "Book a Consultation",
      copy: "Talk to a skin specialist before you buy — ₦10,000, 30 minutes.",
      href: "/consultation",
      image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1795668894/naya-glows/hcebgdaoa3ottekzqus5.jpg",
    },
    {
      title: "Treatment Kits",
      copy: "Curated multi-month skincare programmes, Bronze through Premium.",
      href: "/kits",
      image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1795668897/naya-glows/mj5ovvhgan7oiynl6xlx.jpg",
    },
    {
      title: "Black Friday Reservation",
      copy: "Reserve your kit now with just a ₦5,000 deposit.",
      href: "/black-friday",
      image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1795668901/naya-glows/pzdroidwso0t7fz3moxx.jpg",
    },
  ],
};

export const defaultBusinessDirectoryContent: DirectoryContent = {
  eyebrow: "Partner With Naya Glows",
  headingBold: "For",
  headingLight: "businesses",
  tiles: [
    {
      title: "Wholesale",
      copy: "Stock Naya Glows in your store or spa.",
      href: "/wholesale",
      image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1795668906/naya-glows/vspdcwgxys1jfq0kgeiy.jpg",
    },
    {
      title: "Corporate Gifting",
      copy: "Customised skincare gift boxes for your team, clients or events.",
      href: "/corporate-gifting",
      image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1795668913/naya-glows/kmlhwepaqbfuyj1jvyq5.jpg",
    },
    {
      title: "White-Label Services",
      copy: "Launch skincare under your own brand, built with us.",
      href: "/white-label",
      image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1795668917/naya-glows/n73dcnoge6bnrlnuo4ub.jpg",
    },
  ],
};
