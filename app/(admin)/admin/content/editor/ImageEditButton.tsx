"use client";

import { Loader2, ImagePlus } from "lucide-react";
import { useImageCropUpload } from "@/app/components/media/useImageCropUpload";
import { toast } from "sonner";

// `aspect` MUST match the frame this image renders into, so the crop the
// admin makes fills that frame exactly with no letterboxing. Omit it for a
// freeform crop (rare — only where the live layout has no fixed frame).
export function ImageEditButton({
  onPick,
  label = "Change image",
  aspect,
}: {
  onPick: (url: string) => void;
  label?: string;
  aspect?: number;
}) {
  const { pickAndCrop, uploading, modal } = useImageCropUpload();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const url = await pickAndCrop(file, { aspect, title: "Crop the image" });
    if (url) {
      onPick(url);
      toast.success("Image updated");
    }
  };

  return (
    <>
      {modal}
      <label
        aria-label={label}
        className="absolute right-3 top-3 z-20 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75"
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ImagePlus className="h-4 w-4" />
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={handleChange}
        />
      </label>
    </>
  );
}
