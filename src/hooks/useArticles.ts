"use client";

import { useState, useEffect, useCallback } from "react";
import type { ArticleCardData } from "@/types/article";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UseArticlesOptions {
  category?: string;
  tag?:      string;
  limit?:    number;
}

interface UseArticlesReturn {
  articles:   ArticleCardData[];
  loading:    boolean;
  error:      string | null;
  total:      number;
  refetch:    () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useArticles(options: UseArticlesOptions = {}): UseArticlesReturn {
  const { category, tag, limit } = options;

  const [articles, setArticles] = useState<ArticleCardData[]>([]);
  const [loading,  setLoading]  = useState<boolean>(true);
  const [error,    setError]    = useState<string | null>(null);
  const [total,    setTotal]    = useState<number>(0);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query params
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (tag)      params.set("tag",      tag);
      if (limit)    params.set("limit",    String(limit));

      const res = await fetch(`/api/articles?${params.toString()}`, {
        method:  "GET",
        headers: { "Content-Type": "application/json" },
        cache:   "no-store",
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch articles: ${res.statusText}`);
      }

      const data: { articles: ArticleCardData[]; total: number } =
        await res.json();

      setArticles(data.articles);
      setTotal(data.total);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while fetching articles."
      );
      setArticles([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [category, tag, limit]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return {
    articles,
    loading,
    error,
    total,
    refetch: fetchArticles,
  };
}

// ─── Paginated variant ────────────────────────────────────────────────────────

interface UsePaginatedArticlesOptions {
  initialPage?: number;
  perPage?:     number;
  category?:    string;
}

interface UsePaginatedArticlesReturn {
  articles:    ArticleCardData[];
  loading:     boolean;
  error:       string | null;
  total:       number;
  totalPages:  number;
  currentPage: number;
  setPage:     (page: number) => void;
  nextPage:    () => void;
  prevPage:    () => void;
  hasNext:     boolean;
  hasPrev:     boolean;
}

export function usePaginatedArticles(
  options: UsePaginatedArticlesOptions = {}
): UsePaginatedArticlesReturn {
  const { initialPage = 1, perPage = 9, category } = options;

  const [articles,    setArticles]    = useState<ArticleCardData[]>([]);
  const [loading,     setLoading]     = useState<boolean>(true);
  const [error,       setError]       = useState<string | null>(null);
  const [total,       setTotal]       = useState<number>(0);
  const [totalPages,  setTotalPages]  = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  const fetchPage = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("page",    String(page));
      params.set("perPage", String(perPage));
      if (category) params.set("category", category);

      const res = await fetch(`/api/articles?${params.toString()}`, {
        method: "GET",
        cache:  "no-store",
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch page ${page}: ${res.statusText}`);
      }

      const data: {
        articles:    ArticleCardData[];
        total:       number;
        totalPages:  number;
        currentPage: number;
      } = await res.json();

      setArticles(data.articles);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while fetching articles."
      );
    } finally {
      setLoading(false);
    }
  }, [perPage, category]);

  useEffect(() => {
    fetchPage(currentPage);
  }, [fetchPage, currentPage]);

  const setPage = useCallback(
    (page: number) => {
      const clamped = Math.min(Math.max(page, 1), totalPages);
      setCurrentPage(clamped);
    },
    [totalPages]
  );

  return {
    articles,
    loading,
    error,
    total,
    totalPages,
    currentPage,
    setPage,
    nextPage: () => setPage(currentPage + 1),
    prevPage: () => setPage(currentPage - 1),
    hasNext:  currentPage < totalPages,
    hasPrev:  currentPage > 1,
  };
}