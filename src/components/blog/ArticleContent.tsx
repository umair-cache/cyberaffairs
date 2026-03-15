import Link from "next/link";
import Tag from "@/components/ui/Tag";

interface ArticleContentProps {
  content: string;
  tags?: string[];
  slug: string;
  title: string;
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

// ─── Post share footer ────────────────────────────────────────────────────────

interface ArticleFooterProps {
  tags: string[];
  slug: string;
  title: string;
}

function ArticleFooter({ tags, slug, title }: ArticleFooterProps) {
  const encoded = encodeURIComponent(`https://cyberaffairs.site/blog/${slug}`);
  const text    = encodeURIComponent(title);

  return (
    <footer className="mt-12 pt-8 border-t border-[#E5E7EB] flex flex-col gap-6">
      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#9CA3AF]">
            Tags
          </span>
          <div className="flex flex-wrap gap-2" role="list" aria-label="Article tags">
            {tags.map((tag) => (
              <div key={tag} role="listitem">
                <Tag
                  label={tag}
                  variant="outline"
                  size="md"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#F5F3FF] border border-[#E5E7EB]">
        <div className="flex flex-col gap-0.5">
          <span className="font-sans text-sm font-bold text-[#0D0A2E]">
            Found this article useful?
          </span>
          <span className="font-sans text-xs text-[#6B7280]">
            Share it with your network
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Twitter */}
          
            href={`https://twitter.com/intent/tweet?url=${encoded}&text=${text}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Twitter / X"
            className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#4F46E5] hover:text-white hover:border-[#4F46E5] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
          >
            <TwitterIcon />
            Share
          </a>

          {/* LinkedIn */}
          
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on LinkedIn"
            className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] focus-visible:ring-offset-2"
          >
            <LinkedInIcon />
            Share
          </a>

          {/* Copy link */}
          <CopyLinkButton slug={slug} />
        </div>
      </div>

      {/* Back to blog */}
      <div className="flex justify-start">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-[#4F46E5] hover:text-[#1E135C] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] rounded-sm"
        >
          <ArrowLeftIcon />
          Back to all articles
        </Link>
      </div>
    </footer>
  );
}

// ─── Copy link button (client interaction) ────────────────────────────────────

"use client";

import { useState } from "react";

function CopyLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(
        `https://cyberaffairs.site/blog/${slug}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: silently fail
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Link copied" : "Copy article link"}
      className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F5F3FF] hover:text-[#4F46E5] hover:border-[#4F46E5] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
    >
      {copied ? <CheckIcon /> : <LinkIcon />}
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}

// ─── Article content ──────────────────────────────────────────────────────────

export default function ArticleContent({
  content,
  tags = [],
  slug,
  title,
}: ArticleContentProps) {
  return (
    <div className="w-full">
      {/* Rendered markdown */}
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Article footer: tags + share + back */}
      <ArticleFooter tags={tags} slug={slug} title={title} />
    </div>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────