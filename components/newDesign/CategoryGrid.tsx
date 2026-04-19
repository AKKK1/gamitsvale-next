"use client";

// ─────────────────────────────────────────────────────────────
// useCategoryStats — hook რომ მოიტანოს კატეგორიების დათვლა
// გამოიყენება: HomePage-ში კატეგორიების ბლოკში
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";

export interface CategoryStat {
  _id: string; // category value, e.g. "📱"
  count: number;
}

export interface StatsResult {
  stats: CategoryStat[];
  total: number;
  loading: boolean;
  error: string | null;
}

export function useCategoryStats(): StatsResult {
  const [stats, setStats] = useState<CategoryStat[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/listings?stats=true", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then((data) => {
        setStats(data.stats || []);
        setTotal(data.total || 0);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return { stats, total, loading, error };
}

// ─────────────────────────────────────────────────────────────
// CategoryGrid — კომპონენტი HomePage-სთვის
// ჩაანაცვლე ძველი სტატიკური კატეგ. ბლოკი ამით
// ─────────────────────────────────────────────────────────────

import Link from "next/link";
import { CATEGORIES } from "@/components/AuthProvider";

export default function CategoryGrid() {
  const { stats, total, loading } = useCategoryStats();

  // _id → count map
  const countMap = Object.fromEntries(stats.map((s) => [s._id, s.count]));

  return (
    <section className="bg-white border-b border-gray-200 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* სათაური */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              🗂 სად რისი გაცვლა შეიძლება
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {loading ? (
                <span className="inline-block w-24 h-4 bg-gray-100 rounded animate-pulse" />
              ) : (
                <>
                  სულ{" "}
                  <strong className="text-green-600">
                    {total.toLocaleString()}
                  </strong>{" "}
                  განცხადება
                </>
              )}
            </p>
          </div>
          <Link
            href="/categories"
            className="text-sm font-bold text-green-600 hover:underline hidden sm:block"
          >
            ყველა კატეგ. →
          </Link>
        </div>

        {/* კატეგორიების ბადე */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => {
            const count = countMap[cat.id] || 0;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center
                  transition-all duration-200 hover:border-green-500 hover:bg-green-50 hover:-translate-y-1 hover:shadow-md"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-xs font-bold text-gray-900 leading-tight">
                  {cat.name}
                </span>
                {loading ? (
                  <span className="w-10 h-3 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <span className="text-[11px] text-gray-500">
                    <strong className="text-green-600">{count}</strong> განცხ.
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
