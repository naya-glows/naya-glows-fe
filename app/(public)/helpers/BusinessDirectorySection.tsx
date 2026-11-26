import DirectoryTileGrid, { type DirectoryTile } from "./DirectoryTileGrid";

const tiles: DirectoryTile[] = [
  {
    title: "Wholesale",
    copy: "Stock Naya Glows in your store or spa.",
    href: "/wholesale",
    image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381854/naya-glows/legacy/img_6320.jpg",
  },
  {
    title: "Corporate Gifting",
    copy: "Customised skincare gift boxes for your team, clients or events.",
    href: "/corporate-gifting",
    image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381912/naya-glows/legacy/new/dsc00420-copy.jpg",
  },
  {
    title: "White-Label Services",
    copy: "Launch skincare under your own brand, built with us.",
    href: "/white-label",
    image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381852/naya-glows/legacy/founder-image.jpg",
  },
];

export default function BusinessDirectorySection() {
  return (
    <DirectoryTileGrid
      eyebrow="Partner With Naya Glows"
      headingBold="For"
      headingLight="businesses"
      tiles={tiles}
    />
  );
}
