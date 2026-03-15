import Container from "@/components/layout/Container";

// ─── Skeleton primitives ──────────────────────────────────────────────────────

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`skeleton rounded-lg ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}

function ArticleCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#F3F4F6] bg-white p-0 overflow-hidden">
      {/* Cover image */}
      <SkeletonBlock className="w-full h-48" />

      <div className="flex flex-col gap-3 p-5">
        {/* Category + date */}
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-5 w-20" />
          <SkeletonBlock className="h-4 w-24" />
        </div>

        {/* Title */}
        <SkeletonBlock className="h-6 w-full" />
        <SkeletonBlock className="h-6 w-4/5" />

        {/* Excerpt */}
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-3/5" />

        {/* Author row */}
        <div className="flex items-center gap-2 mt-2 pt-3 border-t border-[#F3F4F6]">
          <SkeletonBlock className="h-8 w-8 rounded-full" />
          <SkeletonBlock className="h-4 w-28" />
          <SkeletonBlock className="h-4 w-16 ml-auto" />
        </div>
      </div>
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-[#F3F4F6] bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Image */}
        <SkeletonBlock className="w-full h-64 lg:h-96 rounded-none" />

        {/* Content */}
        <div className="flex flex-col justify-center gap-5 p-8 lg:p-12">
          <SkeletonBlock className="h-5 w-28" />
          <div className="flex flex-col gap-3">
            <SkeletonBlock className="h-9 w-full" />
            <SkeletonBlock className="h-9 w-5/6" />
            <SkeletonBlock className="h-9 w-4/6" />
          </div>
          <div className="flex flex-col gap-2">
            <SkeletonBlock className="h-5 w-full" />
            <SkeletonBlock className="h-5 w-full" />
            <SkeletonBlock className="h-5 w-3/4" />
          </div>
          <div className="flex items-center gap-3 mt-2">
            <SkeletonBlock className="h-10 w-10 rounded-full" />
            <div className="flex flex-col gap-1.5">
              <SkeletonBlock className="h-4 w-32" />
              <SkeletonBlock className="h-3.5 w-24" />
            </div>
          </div>
          <SkeletonBlock className="h-11 w-36 mt-2" />
        </div>
      </div>
    </div>
  );
}

// ─── Loading UI ───────────────────────────────────────────────────────────────

export default function Loading() {
  return (
    <Container className="py-10 sm:py-14">
      {/* Page heading skeleton */}
      <div className="mb-10 flex flex-col gap-3">
        <SkeletonBlock className="h-9 w-48" />
        <SkeletonBlock className="h-5 w-72" />
      </div>

      {/* Hero skeleton */}
      <div className="mb-12">
        <HeroSkeleton />
      </div>

      {/* Section label */}
      <div className="mb-6 flex items-center justify-between">
        <SkeletonBlock className="h-7 w-36" />
        <SkeletonBlock className="h-5 w-20" />
      </div>

      {/* Article cards grid */}
      <div className="articles-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>

      {/* Screen reader announcement */}
      <p className="sr-only" role="status" aria-live="polite">
        Loading content, please wait…
      </p>
    </Container>
  );
}