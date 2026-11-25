// Shared stand-in for any promotional image the client hasn't supplied yet
// (campaign graphics, banner art, etc. — explicitly flagged as "to be
// supplied" in the brief). Per the user's own instruction: a colored
// background div with "Missing details" repeated, rather than a broken
// image or an empty box.
export default function MissingDetailsPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center bg-[#d4e8d0] text-[#4f7957] text-xs font-semibold uppercase tracking-wide text-center p-4 leading-relaxed ${className}`}
    >
      Missing details. Missing details. Missing details.
    </div>
  );
}
