"use client";

import DirectoryTileGrid from "./DirectoryTileGrid";
import { useSectionContent, useSectionLoading } from "../../store/useSectionContent";
import { defaultBusinessDirectoryContent } from "@/lib/content/homeDirectory";

export default function BusinessDirectorySection() {
  const content = useSectionContent("home.businessDirectory", defaultBusinessDirectoryContent);
  const isLoading = useSectionLoading("home.businessDirectory");

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
