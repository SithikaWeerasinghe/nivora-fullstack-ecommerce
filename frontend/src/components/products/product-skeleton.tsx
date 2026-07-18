import { productGridClasses } from "./product-grid";

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-line/60 ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="aspect-[4/3] animate-pulse bg-line/50" />
      <div className="space-y-3 p-4">
        <SkeletonBlock className="h-4 w-3/4" />
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-2/3" />
        <div className="flex items-center justify-between pt-1">
          <SkeletonBlock className="h-5 w-16" />
          <SkeletonBlock className="h-5 w-20 rounded-full" />
        </div>
        <SkeletonBlock className="h-11 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div role="status">
      <span className="sr-only">Loading products…</span>
      <ul className={productGridClasses} aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
          <li key={index}>
            <ProductCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}
