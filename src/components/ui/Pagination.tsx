"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;        // e.g. "/blog" or "/category/cybersecurity"
  className?: string;
}

interface PageItem {
  type: "page" | "ellipsis";
  value: number;
}

function buildPageItems(current: number, total: number): PageItem[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => ({
      type: "page",
      value: i + 1,
    }));
  }

  const items: PageItem[] = [];

  // Always show first page
  items.push({ type: "page", value: 1 });

  if (current > 3) {
    items.push({ type: "ellipsis", value: -1 });
  }

  // Pages around current
  const start = Math.max(2, current - 1);
  const end   = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    items.push({ type: "page", value: i });
  }

  if (current < total - 2) {
    items.push({ type: "ellipsis", value: -2 });
  }

  // Always show last page
  items.push({ type: "page", value: total });

  return items;
}

function pageHref(basePath: string, page: number): string {
  const base = basePath.replace(/\/$/, "");
  return page === 1 ? base || "/" : `${base}/page/${page}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface NavButtonProps {
  href: string;
  disabled: boolean;
  direction: "prev" | "next";
  label: string;
}

function NavButton({ href, disabled, direction, label }: NavButtonProps) {
  const base = cn(
    "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold font-sans border transition-all duration-150",
    disabled
      ? "text-[#9CA3AF] border-[#E5E7EB] bg-[#F9FAFB] cursor-not-allowed pointer-events-none"
      : "text-[#4F46E5] border-[#E5E7EB] bg-white hover:bg-[#4F46E5] hover:text-white hover:border-[#4F46E5]"
  );

  if (disabled) {
    return (
      <span className={base} aria-disabled="true" aria-label={label}>
        {direction === "prev" ? (
          <>
            <ChevronLeft />
            <span className="hidden sm:inline">Previous</span>
          </>
        ) : (
          <>
            <span className="hidden sm:inline">Next</span>
            <ChevronRight />
          </>
        )}
      </span>
    );
  }

  return (
    <Link href={href} className={base} aria-label={label}>
      {direction === "prev" ? (
        <>
          <ChevronLeft />
          <span className="hidden sm:inline">Previous</span>
        </>
      ) : (
        <>
          <span className="hidden sm:inline">Next</span>
          <ChevronRight />
        </>
      )}
    </Link>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageItems  = buildPageItems(currentPage, totalPages);
  const prevHref   = pageHref(basePath, currentPage - 1);
  const nextHref   = pageHref(basePath, currentPage + 1);

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1.5", className)}
    >
      {/* Previous */}
      <NavButton
        href={prevHref}
        disabled={currentPage <= 1}
        direction="prev"
        label="Go to previous page"
      />

      {/* Page numbers */}
      <ol className="flex items-center gap-1">
        {pageItems.map((item, index) => {
          if (item.type === "ellipsis") {
            return (
              <li key={`ellipsis-${index}`}>
                <span
                  className="inline-flex items-center justify-center w-9 h-9 text-sm text-[#9CA3AF] font-sans select-none"
                  aria-hidden="true"
                >
                  &hellip;
                </span>
              </li>
            );
          }

          const isActive = item.value === currentPage;

          return (
            <li key={item.value}>
              <Link
                href={pageHref(basePath, item.value)}
                className={cn(
                  "inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-semibold font-sans border transition-all duration-150",
                  isActive
                    ? "bg-[#4F46E5] text-white border-[#4F46E5] pointer-events-none"
                    : "bg-white text-[#374151] border-[#E5E7EB] hover:bg-[#F5F3FF] hover:text-[#4F46E5] hover:border-[#4F46E5]"
                )}
                aria-label={`Go to page ${item.value}`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.value}
              </Link>
            </li>
          );
        })}
      </ol>

      {/* Next */}
      <NavButton
        href={nextHref}
        disabled={currentPage >= totalPages}
        direction="next"
        label="Go to next page"
      />
    </nav>
  );
}