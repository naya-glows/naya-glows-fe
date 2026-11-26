import SkeletonLine from "./SkeletonLine";

// Matches DirectoryTileGrid.tsx: a 3-tile photo grid used by both the
// Services & Programmes and For Businesses homepage sections.
export default function DirectoryTileSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="relative h-[300px] sm:h-[340px] rounded-2xl overflow-hidden">
          <SkeletonLine className="absolute inset-0" rounded="rounded-none" />
          <SkeletonLine className="absolute bottom-5 left-5 h-5 w-28 bg-white/50" rounded="rounded-full" />
        </div>
      ))}
    </div>
  );
}
