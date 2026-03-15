"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useDeferredValue,
} from "react";
import type { ArticleCardData } from "@/types/article";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UseSearchOptions {
  debounceMs?: number;
  minLength?:  number;
  limit?:      number;
}

interface UseSearchReturn {
  query:         string;
  setQuery:      (q: string) => void;
  results:       ArticleCardData[];
  loading:       boolean;
  error:         string | null;
  hasResults:    boolean;
  isIdle:        boolean;
  totalResults:  number;
  clearSearch:   () => void;
}

// ─── Client-side search over a pre-loaded article list ────────────────────────

function searchArticles(
  articles: ArticleCardData[],
  query: string,
  limit?: number
): ArticleCardData[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const scored = articles
    .map((article) => {
      let score = 0;

      // Title match — highest weight
      if (article.title.toLowerCase().includes(q))           score += 10;
      if (article.title.toLowerCase().startsWith(q))         score += 5;

      // Excerpt match
      if (article.excerpt.toLowerCase().includes(q))         score += 4;

      // Category match
      if (article.category.toLowerCase().includes(q))        score += 3;

      // Tag match
      if (article.tags.some((t) => t.toLowerCase().includes(q))) score += 2;

      // Author match
      if (article.author.toLowerCase().includes(q))          score += 1;

      return { article, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ article }) => article);

  return limit ? scored.slice(0, limit) : scored;
}

// ─── Main hook ────────────────────────────────────────────────────────────────

export function useSearch(
  articles: ArticleCardData[],
  options: UseSearchOptions = {}
): UseSearchReturn {
  const { debounceMs = 300, minLength = 2, limit } = options;

  const [query,   setQueryRaw] = useState<string>("");
  const [results, setResults]  = useState<ArticleCardData[]>([]);
  const [loading, setLoading]  = useState<boolean>(false);
  const [error,   setError]    = useState<string | null>(null);

  // Deferred value prevents the UI from blocking on every keystroke
  const deferredQuery = useDeferredValue(query);

  // Debounce timer ref
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback(
    (q: string) => {
      if (q.length < minLength) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const found = searchArticles(articles, q, limit);
        setResults(found);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred during search."
        );
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [articles, limit, minLength]
  );

  // Debounced effect
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!deferredQuery || deferredQuery.length < minLength) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    timerRef.current = setTimeout(() => {
      runSearch(deferredQuery);
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [deferredQuery, debounceMs, minLength, runSearch]);

  const setQuery = useCallback((q: string) => {
    setQueryRaw(q);
  }, []);

  const clearSearch = useCallback(() => {
    setQueryRaw("");
    setResults([]);
    setError(null);
    setLoading(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    hasResults:   results.length > 0,
    isIdle:       query.length < minLength,
    totalResults: results.length,
    clearSearch,
  };
}

// ─── URL-synced search variant ────────────────────────────────────────────────

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface UseUrlSearchReturn extends UseSearchReturn {
  syncToUrl: boolean;
}

export function useUrlSearch(
  articles: ArticleCardData[],
  options: UseSearchOptions & { syncToUrl?: boolean } = {}
): UseUrlSearchReturn {
  const { syncToUrl = true, ...searchOptions } = options;

  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") ?? "";

  const search = useSearch(articles, searchOptions);

  // Initialise query from URL on mount
  useEffect(() => {
    if (initialQuery) {
      search.setQuery(initialQuery);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync query changes back to URL
  const setQueryWithSync = useCallback(
    (q: string) => {
      search.setQuery(q);

      if (!syncToUrl) return;

      const params = new URLSearchParams(searchParams.toString());
      if (q) {
        params.set("q", q);
      } else {
        params.delete("q");
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [syncToUrl, pathname, searchParams, router]
  );

  return {
    ...search,
    setQuery:  setQueryWithSync,
    syncToUrl,
  };
}