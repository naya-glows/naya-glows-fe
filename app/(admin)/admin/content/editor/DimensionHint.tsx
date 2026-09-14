export function DimensionHint({ text }: { text: string }) {
  return (
    <p className="text-[10.5px] leading-[15px] text-[#16241a]/45">
      Design at <span className="font-medium text-[#16241a]/65">{text}</span>. The
      image fills this frame edge-to-edge — hold these exact proportions and it
      scales cleanly on every screen.
    </p>
  );
}
