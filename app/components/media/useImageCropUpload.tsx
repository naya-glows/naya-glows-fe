"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { useUploadImageMutation } from "../../store/adminApi";
import { getApiErrorMessage } from "../../store/apiError";
import { ImageCropModal, type PendingCrop } from "./ImageCropModal";

// Pick a file, crop it to an exact aspect (or freeform if `aspect` is
// omitted), then upload the cropped result via the existing admin
// `/uploads` endpoint. Returns the hosted URL, or null if the admin
// cancelled the crop. Render `modal` once in the caller's JSX — it's null
// whenever no crop is in progress.
export function useImageCropUpload() {
  const [uploadImage, { isLoading: uploading }] = useUploadImageMutation();
  const [pending, setPending] = useState<PendingCrop | null>(null);
  const resolveRef = useRef<((url: string | null) => void) | null>(null);

  const pickAndCrop = (
    file: File,
    opts: { aspect?: number; title?: string } = {},
  ): Promise<string | null> => {
    setPending({ file, aspect: opts.aspect, title: opts.title });
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  };

  const finish = (url: string | null) => {
    setPending(null);
    resolveRef.current?.(url);
    resolveRef.current = null;
  };

  const handleCropped = async (blob: Blob) => {
    try {
      const body = new FormData();
      body.append("file", blob, "upload.jpg");
      const res = await uploadImage(body).unwrap();
      finish(res.url);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Image upload failed."));
      finish(null);
    }
  };

  const modal = pending ? (
    <ImageCropModal
      pending={pending}
      uploading={uploading}
      onCropped={handleCropped}
      onCancel={() => finish(null)}
    />
  ) : null;

  return { pickAndCrop, uploading, modal };
}
