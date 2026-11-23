// Inserts an on-the-fly Cloudinary transform so a page's own OG/Twitter
// image is a reasonably-sized, compressed JPEG rather than whatever the
// original upload happened to be — some link-preview crawlers (WhatsApp in
// particular) will skip or time out on a large original. No-op for any
// non-Cloudinary URL (e.g. the local placeholder image), since there's
// nothing to transform.
export function toOgImageUrl(url: string, width = 1200, height = 630): string {
  const marker = "/image/upload/";
  const i = url.indexOf(marker);
  if (i === -1) return url;
  const transform = `w_${width},h_${height},c_fill,q_auto:good,f_jpg`;
  return `${url.slice(0, i + marker.length)}${transform}/${url.slice(i + marker.length)}`;
}
