"use client";

import { useState, useEffect, useCallback } from "react";
import type { CategoryWithCount } from "@/types/category";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UseCategoriesReturn {
  categories: CategoryWithCount[];
  loading:    boolean;
  error:      string | null;
  refetch:    () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading,    setLoading]    = useState<boolean>(true);
  const [error,      setError]      = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/categories", {
        method: "GET",
        cache:  "no-store",
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch categories: ${res.statusText}`);
      }

      const data: { categories: CategoryWithCount[] } = await res.json();
      setCategories(data.categories);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while fetching categories."
      );
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}

// ─── Single category variant ──────────────────────────────────────────────────

interface UseCategoryReturn {
  category: CategoryWithCount | null;
  loading:  boolean;
  error:    string | null;
}

export function useCategory(slug: string): UseCategoryReturn {
  const [category, setCategory] = useState<CategoryWithCount | null>(null);
  const [loading,  setLoading]  = useState<boolean>(true);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetch_() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/categories/${slug}`, {
          method: "GET",
          cache:  "no-store",
        });

        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? `Category "${slug}" not found.`
              : `Failed to fetch category: ${res.statusText}`
          );
        }

        const data: { category: CategoryWithCount } = await res.json();
        if (!cancelled) setCategory(data.category);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "An unexpected error occurred."
          );
          setCategory(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch_();
    return () => { cancelled = true; };
  }, [slug]);

  return { category, loading, error };
}