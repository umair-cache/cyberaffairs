import Link from "next/link";
import Image from "next/image";
import { cn, formatDate } from "@/lib/utils";
import type { ArticleCardData } from "@/types/article";
import Badge from "@/components/ui/Badge";
import Tag from "@/components/ui/Tag";

interface ArticleCardProps {
  article: ArticleCardData;
  variant?: "default" | "horizontal" | "minimal";
  priority?: boolean;
  className?: string;
}

// ─── Category color map ───────────────────────────────────────────────────────

const categoryColors: Record<string, string> = {
  cybersecurity:        "#4F46E5",
  hacking:              "#DC2626",
  privacy:              "#0891B2",
  "threat-intelligence":"#D97706",
  "tech-news":          "#059669",
  "security-research":  "#7C3AED",
};

function getCategoryColor(category: string): string {
  return categoryColors[category.toLowerCase()] ?? "#4F46E5";
}

// ─── Author avatar ────────────────────────────────────────────────────────────

function AuthorAvatar({ name, size = 8 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span
      className={`inline-flex items-center justify-center w-${size} h-${size} rounded-full bg-[#4F46E5] text-white font-sans font-semibold text-xs flex-shrink-0`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

// ─── Default card (vertical) ──────────────────────────────────────────────────

function DefaultCard({ article, priority, className }: Omit<ArticleCardProps, "variant">) {
  const accentColor = getCategoryColor(article.category);

  return (
    <article
      className={cn(
        "group flex flex-col rounded-xl border border-[#E5E7EB] bg-white overflow-hidden",
        "hover:border-[#4F46E5] hover:shadow-[0_4px_24px_rgba(79,70,229,0.10)]",
        "transition-all duration-200",
        className
      )}
    >
      {/* Cover image */}
      <Link
        href={`/blog/${article.slug}`}
        aria-label={`Read: ${article.title}`}
        className="relative block w-full overflow-hidden aspect-[16/9] bg-[#F5F3FF] flex-shrink-0"
        tabIndex={-1}
      >
        <Image
          src={article.coverImage}
          alt={`Cover image for ${article.title}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={priority}
        />
        {/* Category color strip */}
        <span
          className="absolute top-0 left-0 w-full h-1"
          style={{ backgroundColor: accentColor }}
          aria-hidden="true"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 gap-3 p-5">
        {/* Category + reading time */}
        <div className="flex items-center gap-2 flex-wrap">
          <Tag
            label={article.category.replace(/-/g, " ")}
            href={`/category/${article.category}`}
            variant="solid"
            size="sm"
            color={accentColor}
          />
          {article.readingTime && (
            <span className="font-sans text-xs text-[#9CA3AF]">
              {article.readingTime}
            </span>
          )}
          {article.featured && (
            <Badge variant="warning" dot className="ml-auto">
              Featured
            </Badge>
          )}
        </div>

        {/* Title */}
        <h2 className="font-sans text-base font-bold text-[#0D0A2E] leading-snug line-clamp-2 group-hover:text-[#4F46E5] transition-colors duration-150">
          <Link href={`/blog/${article.slug}`} className="focus-visible:outline-none focus-visible:underline">
            {article.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="font-sans text-sm text-[#6B7280] leading-relaxed line-clamp-3 flex-1">
          {article.excerpt}
        </p>

        {/* Footer: author + date */}
        <div className="flex items-center gap-2 pt-3 mt-auto border-t border-[#F3F4F6]">
          <AuthorAvatar name={article.author} />
          <span className="font-sans text-xs font-medium text-[#374151] truncate">
            {article.author}
          </span>
          <time
            dateTime={article.date}
            className="font-sans text-xs text-[#9CA3AF] ml-auto flex-shrink-0"
          >
            {formatDate(article.date)}
          </time>
        </div>
      </div>
    </article>
  );
}

// ─── Horizontal card ──────────────────────────────────────────────────────────

function HorizontalCard({ article, priority, className }: Omit<ArticleCardProps, "variant">) {
  const accentColor = getCategoryColor(article.category);

  return (
    <article
      className={cn(
        "group flex flex-row gap-0 rounded-xl border border-[#E5E7EB] bg-white overflow-hidden",
        "hover:border-[#4F46E5] hover:shadow-[0_4px_24px_rgba(79,70,229,0.10)]",
        "transition-all duration-200",
        className
      )}
    >
      {/* Cover image */}
      <Link
        href={`/blog/${article.slug}`}
        aria-label={`Read: ${article.title}`}
        className="relative block w-36 sm:w-48 flex-shrink-0 bg-[#F5F3FF] overflow-hidden"
        tabIndex={-1}
      >
        <Image
          src={article.coverImage}
          alt={`Cover image for ${article.title}`}
          fill
          sizes="(max-width: 640px) 144px, 192px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={priority}
        />
        {/* Category color strip */}
        <span
          className="absolute top-0 left-0 h-full w-1"
          style={{ backgroundColor: accentColor }}
          aria-hidden="true"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 gap-2 p-4">
        {/* Category */}
        <Tag
          label={article.category.replace(/-/g, " ")}
          href={`/category/${article.category}`}
          variant="solid"
          size="sm"
          color={accentColor}
        />

        {/* Title */}
        <h2 className="font-sans text-sm font-bold text-[#0D0A2E] leading-snug line-clamp-2 group-hover:text-[#4F46E5] transition-colors duration-150">
          <Link href={`/blog/${article.slug}`} className="focus-visible:outline-none focus-visible:underline">
            {article.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="font-sans text-xs text-[#6B7280] leading-relaxed line-clamp-2 flex-1 hidden sm:block">
          {article.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center gap-1.5 mt-auto">
          <AuthorAvatar name={article.author} size={6} />
          <span className="font-sans text-xs text-[#9CA3AF] truncate">
            {article.author}
          </span>
          <span className="text-[#E5E7EB] mx-1" aria-hidden="true">·</span>
          <time dateTime={article.date} className="font-sans text-xs text-[#9CA3AF] flex-shrink-0">
            {formatDate(article.date)}
          </time>
        </div>
      </div>
    </article>
  );
}

// ─── Minimal card (text only) ─────────────────────────────────────────────────

function MinimalCard({ article, className }: Omit<ArticleCardProps, "variant">) {
  const accentColor = getCategoryColor(article.category);

  return (
    <article
      className={cn(
        "group flex flex-col gap-2 py-4 border-b border-[#F3F4F6] last:border-0",
        className
      )}
    >
      {/* Category + date */}
      <div className="flex items-center gap-2">
        <Tag
          label={article.category.replace(/-/g, " ")}
          href={`/category/${article.category}`}
          variant="solid"
          size="sm"
          color={accentColor}
        />
        <time dateTime={article.date} className="font-sans text-xs text-[#9CA3AF]">
          {formatDate(article.date)}
        </time>
      </div>

      {/* Title */}
      <h2 className="font-sans text-sm font-bold text-[#0D0A2E] leading-snug line-clamp-2 group-hover:text-[#4F46E5] transition-colors duration-150">
        <Link href={`/blog/${article.slug}`} className="focus-visible:outline-none focus-visible:underline">
          {article.title}
        </Link>
      </h2>

      {/* Reading time */}
      {article.readingTime && (
        <span className="font-sans text-xs text-[#9CA3AF]">
          {article.readingTime}
        </span>
      )}
    </article>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function ArticleCard({
  article,
  variant = "default",
  priority = false,
  className,
}: ArticleCardProps) {
  if (variant === "horizontal") {
    return <HorizontalCard article={article} priority={priority} className={className} />;
  }
  if (variant === "minimal") {
    return <MinimalCard article={article} className={className} />;
  }
  return <DefaultCard article={article} priority={priority} className={className} />;
}