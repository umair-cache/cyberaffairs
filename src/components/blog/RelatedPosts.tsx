import Link from "next/link";
import Image from "next/image";
import type { ArticleCardData } from "@/types/article";
import { formatDate } from "@/lib/utils";
import Tag from "@/components/ui/Tag";

interface RelatedPostsProps {
  posts: ArticleCardData[];
  currentSlug: string;
}

// ─── Category color map ───────────────────────────────────────────────────────

const categoryColors: Record<string, string> = {
  cybersecurity:         "#4F46E5",
  hacking:               "#DC2626",
  privacy:               "#0891B2",
  "threat-intelligence": "#D97706",
  "tech-news":           "#059669",
  "security-research":   "#7C3AED",
};

function getCategoryColor(category: string): string {
  return categoryColors[category.toLowerCase()] ?? "#4F46E5";
}

// ─── Single related post card ─────────────────────────────────────────────────

function RelatedPostCard({ post }: { post: ArticleCardData }) {
  const accentColor = getCategoryColor(post.category);

  return (
    <article className="group flex flex-col rounded-xl border border-[#E5E7EB] bg-white overflow-hidden hover:border-[#4F46E5] hover:shadow-[0_4px_24px_rgba(79,70,229,0.10)] transition-all duration-200">
      {/* Cover image */}
      <Link
        href={`/blog/${post.slug}`}
        aria-label={`Read related article: ${post.title}`}
        className="relative block w-full aspect-[16/9] overflow-hidden bg-[#F5F3FF] flex-shrink-0"
        tabIndex={-1}
      >
        <Image
          src={post.coverImage}
          alt={`Cover image for ${post.title}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Category color strip */}
        <span
          className="absolute top-0 left-0 w-full h-1"
          style={{ backgroundColor: accentColor }}
          aria-hidden="true"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 gap-2.5 p-4">
        {/* Category + reading time */}
        <div className="flex items-center gap-2">
          <Tag
            label={post.category.replace(/-/g, " ")}
            href={`/category/${post.category}`}
            variant="solid"
            size="sm"
            color={accentColor}
          />
          {post.readingTime && (
            <span className="font-sans text-xs text-[#9CA3AF]">
              {post.readingTime}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-sans text-sm font-bold text-[#0D0A2E] leading-snug line-clamp-2 group-hover:text-[#4F46E5] transition-colors duration-150">
          <Link
            href={`/blog/${post.slug}`}
            className="focus-visible:outline-none focus-visible:underline"
          >
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="font-sans text-xs text-[#6B7280] leading-relaxed line-clamp-2 flex-1">
          {post.excerpt}
        </p>

        {/* Footer: date */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#F3F4F6]">
          <span className="font-sans text-xs font-medium text-[#374151] truncate">
            {post.author}
          </span>
          <time
            dateTime={post.date}
            className="font-sans text-xs text-[#9CA3AF] flex-shrink-0"
          >
            {formatDate(post.date)}
          </time>
        </div>
      </div>
    </article>
  );
}

// ─── Related posts section ────────────────────────────────────────────────────

export default function RelatedPosts({ posts, currentSlug }: RelatedPostsProps) {
  const filtered = posts.filter((p) => p.slug !== currentSlug).slice(0, 3);

  if (filtered.length === 0) return null;

  return (
    <section aria-labelledby="related-posts-heading" className="mt-16 pt-12 border-t border-[#E5E7EB]">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-1">
          <h2
            id="related-posts-heading"
            className="font-sans text-xl font-bold text-[#0D0A2E]"
          >
            Related Articles
          </h2>
          <p className="font-sans text-sm text-[#6B7280]">
            More articles you might find interesting
          </p>
        </div>

        <Link
          href="/blog"
          className="hidden sm:inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-[#4F46E5] hover:text-[#1E135C] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] rounded-sm"
          aria-label="Browse all articles"
        >
          View all
          <ArrowRightIcon />
        </Link>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((post) => (
          <RelatedPostCard key={post.slug} post={post} />
        ))}
      </div>

      {/* Mobile view all */}
      <div className="flex sm:hidden justify-center mt-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-[#4F46E5] hover:text-[#1E135C] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] rounded-sm"
        >
          View all articles
          <ArrowRightIcon />
        </Link>
      </div>
    </section>
  );
}

// ─── Arrow icon ───────────────────────────────────────────────────────────────

function ArrowRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}