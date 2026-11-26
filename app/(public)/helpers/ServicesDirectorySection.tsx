"use client";

import DirectoryTileGrid from "./DirectoryTileGrid";
import { useSectionContent, useSectionLoading } from "../../store/useSectionContent";
import { defaultServicesDirectoryContent } from "@/lib/content/homeDirectory";

export default function ServicesDirectorySection() {
  const content = useSectionContent("home.servicesDirectory", defaultServicesDirectoryContent);
  const isLoading = useSectionLoading("home.servicesDirectory");

  return (
    <DirectoryTileGrid
      eyebrow={content.eyebrow}
      headingBold={content.headingBold}
      headingLight={content.headingLight}
      tiles={content.tiles}
      isLoading={isLoading}
    />
  );
}
