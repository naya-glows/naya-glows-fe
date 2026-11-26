import DirectoryTileGrid, { type DirectoryTile } from "./DirectoryTileGrid";

const tiles: DirectoryTile[] = [
  {
    title: "Book a Consultation",
    copy: "Talk to a skin specialist before you buy — ₦10,000, 30 minutes.",
    href: "/consultation",
    image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381888/naya-glows/legacy/nature-girl2.jpg",
  },
  {
    title: "Treatment Kits",
    copy: "Curated multi-month skincare programmes, Bronze through Premium.",
    href: "/kits",
    image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381876/naya-glows/legacy/img_6328.jpg",
  },
  {
    title: "Black Friday Reservation",
    copy: "Reserve your kit now with just a ₦5,000 deposit.",
    href: "/black-friday",
    image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381923/naya-glows/legacy/new/img_7557.jpg",
  },
];

export default function ServicesDirectorySection() {
  return (
    <DirectoryTileGrid
      eyebrow="Beyond The Shelf"
      headingBold="Services"
      headingLight="& programmes"
      tiles={tiles}
    />
  );
}
