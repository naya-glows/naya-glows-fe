"use client";

import { useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Loader2, RotateCcw } from "lucide-react";

// Longest edge of the rasterized output — keeps uploads reasonably sized
// without a visible quality loss for anything this admin UI crops.
const MAX_OUT = 2000;

function centerAspectCrop(width: number, height: number, aspect?: number) {
  if (!aspect) {
    return { unit: "%" as const, x: 2, y: 2, width: 96, height: 96 };
  }
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, width, height),
    width,
    height,
  );
}

export type PendingCrop = {
  file: File;
  aspect?: number;
  title?: string;
};

export function ImageCropModal({
  pending,
  onCropped,
  onCancel,
  uploading,
}: {
  pending: PendingCrop;
  onCropped: (blob: Blob) => void;
  onCancel: () => void;
  uploading: boolean;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [pixelCrop, setPixelCrop] = useState<PixelCrop | null>(null);
  const [objectUrl] = useState(() => URL.createObjectURL(pending.file));

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, pending.aspect));
  };

  const apply = () => {
    const img = imgRef.current;
    if (!img || !pixelCrop || !pixelCrop.width || !pixelCrop.height) return;

    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    const cropWidthPx = pixelCrop.width * scaleX;
    const cropHeightPx = pixelCrop.height * scaleY;

    const outScale = Math.min(1, MAX_OUT / Math.max(cropWidthPx, cropHeightPx));
    const outWidth = Math.round(cropWidthPx * outScale);
    const outHeight = Math.round(cropHeightPx * outScale);

    const canvas = document.createElement("canvas");
    canvas.width = outWidth;
    canvas.height = outHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // No alpha channel on the output, so a transparent source PNG doesn't
    // turn black when re-encoded as JPEG below.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outWidth, outHeight);
    ctx.drawImage(
      img,
      pixelCrop.x * scaleX,
      pixelCrop.y * scaleY,
      cropWidthPx,
      cropHeightPx,
      0,
      0,
      outWidth,
      outHeight,
    );

    canvas.toBlob(
      (blob) => {
        if (blob) onCropped(blob);
      },
      "image/jpeg",
      0.9,
    );
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4">
      <div className="flex w-full max-w-lg flex-col gap-4 rounded-2xl bg-white p-5">
        <p className="text-sm font-semibold text-[#16241a]">
          {pending.title ?? "Crop the image"}
        </p>
        <div className="max-h-[60vh] overflow-auto rounded-xl bg-[#f4faf3]">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setPixelCrop(c)}
            aspect={pending.aspect}
            keepSelection
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={objectUrl}
              alt="Crop preview"
              onLoad={onImageLoad}
              className="max-h-[60vh] w-full object-contain"
            />
          </ReactCrop>
        </div>
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              const img = imgRef.current;
              if (img) setCrop(centerAspectCrop(img.width, img.height, pending.aspect));
            }}
            className="flex items-center gap-1.5 text-xs text-[#16241a]/50 hover:text-[#16241a]"
          >
            <RotateCcw size={12} />
            Reset
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={uploading}
              className="rounded-full px-4 py-2 text-sm font-medium text-[#16241a]/60 hover:text-[#16241a] disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={apply}
              disabled={uploading || !pixelCrop?.width}
              className="flex items-center gap-2 rounded-full bg-[#16241a] px-5 py-2 text-sm font-semibold text-white hover:bg-[#233324] disabled:opacity-60"
            >
              {uploading && <Loader2 size={14} className="animate-spin" />}
              {uploading ? "Uploading…" : "Use photo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
