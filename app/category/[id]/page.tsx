"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CATEGORIES, useAuth } from "@/components/AuthProvider";
import Header from "@/components/Header";
import ListingCard from "@/components/ListingCard";
import AddListingModal from "@/components/AddListingModal";
import OfferModal from "@/components/OfferModal";
import Toast from "@/components/Toast";
import {
  Trash2,
  Loader2,
  ChevronDown,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Link from "next/link";

const C = {
  bg: "#ffffff",
  bg2: "#f8faf8",
  bg3: "#f0f4f0",
  green: "#1a8a4a",
  greenLight: "#e6f5ec",
  greenDark: "#125e33",
  text: "#111111",
  text2: "#555555",
  text3: "#999999",
  border: "#e8ebe8",
};

const PAGE_SIZE = 20;

type SortOpt = "newest" | "oldest";
type ConditionOpt = "" | "NEW" | "USED";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState<any>(null);
  const [editingListing, setEditingListing] = useState<any>(null);
  const [categoryId, setCategoryId] = useState<string>("");
  const [toast, setToast] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    listingId: string | null;
  }>({ isOpen: false, listingId: null });

  // ── ფილტრები ──
  const [sort, setSort] = useState<SortOpt>("newest");
  const [condition, setCondition] = useState<ConditionOpt>("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    Promise.resolve(params).then((p) => setCategoryId(p.id));
  }, [params]);

  const category = CATEGORIES.find((c) => c.id === categoryId);

  const fetchListings = useCallback(
    async (
      opts: { pageNum?: number; extra?: URLSearchParams; reset?: boolean } = {},
    ) => {
      if (!categoryId) return;
      const { pageNum = 1, extra, reset = false } = opts;
      reset || pageNum === 1 ? setLoading(true) : setLoadingMore(true);

      const p = extra ? new URLSearchParams(extra) : new URLSearchParams();
      p.set("category", categoryId);
      p.set("page", String(pageNum));
      p.set("limit", String(PAGE_SIZE));
      p.set("sort", sort);
      if (condition) p.set("condition", condition);

      const res = await fetch(`/api/listings?${p.toString()}`);
      const data = await res.json();

      // VIP → SILVER → NORMAL პრიორიტეტი
      const sorted = [...(Array.isArray(data) ? data : [])].sort((a, b) => {
        const rank = (l: any) =>
          l.listingType === "VIP" || l.isVIP
            ? 0
            : l.listingType === "SILVER"
              ? 1
              : 2;
        return rank(a) - rank(b);
      });

      const totalCount = parseInt(res.headers.get("X-Total-Count") || "0", 10);
      setTotal(totalCount);
      setHasMore(pageNum * PAGE_SIZE < totalCount);
      pageNum === 1 || reset
        ? setListings(sorted)
        : setListings((prev) => [...prev, ...sorted]);
      setPage(pageNum);
      setLoading(false);
      setLoadingMore(false);
    },
    [categoryId, sort, condition],
  );

  useEffect(() => {
    if (categoryId) {
      setPage(1);
      fetchListings({ reset: true });
    }
  }, [categoryId, sort, condition]);

  const loadMore = () => fetchListings({ pageNum: page + 1 });

  const requireAuth = (action: () => void) => {
    if (!user) {
      setToast("გთხოვთ გაიაროთ ავტორიზაცია 🔐");
      return;
    }
    action();
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation.listingId) return;
    await fetch(`/api/listings/${deleteConfirmation.listingId}`, {
      method: "DELETE",
    });
    setDeleteConfirmation({ isOpen: false, listingId: null });
    setToast("განცხადება წაიშალა ✓");
    fetchListings({ reset: true });
  };

  const activeFiltersCount = (sort !== "newest" ? 1 : 0) + (condition ? 1 : 0);

  return (
    <div
      className="min-h-screen"
      style={{
        background: C.bg,
        color: C.text,
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <Header
        onAddListing={() => requireAuth(() => setShowAddModal(true))}
        onSearch={(query, type) => {
          const p = new URLSearchParams();
          if (query) {
            p.append("search", query);
            p.append("type", type || "want");
          }
          fetchListings({ extra: p, reset: true });
        }}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* ── სარეკლამო ბანერი ── */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 mb-8"
          style={{
            background: C.greenLight,
            border: `1px dashed rgba(26,138,74,0.3)`,
          }}
        >
          <span
            className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
            style={{
              background: "rgba(26,138,74,0.12)",
              color: C.green,
              border: `1px solid rgba(26,138,74,0.2)`,
            }}
          >
            📢 რეკლამა
          </span>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 text-center sm:text-left">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-1"
                style={{ color: C.green }}
              >
                შეუკვეთე შენი რეკლამა აქ
              </p>
              <h3 className="text-lg font-bold mb-1" style={{ color: C.text }}>
                10,000+ მომხმარებელი ყოველდღიურად 👀
              </h3>
              <p className="text-sm" style={{ color: C.text2 }}>
                მიიტანე შენი პროდუქტი სწორ აუდიტორიამდე — მარტივად.
              </p>
            </div>
            <Link
              href="/advertise"
              className="shrink-0 px-6 py-2.5 rounded-xl text-white text-sm font-bold whitespace-nowrap transition-all"
              style={{ background: C.green, textDecoration: "none" }}
            >
              დეტალები →
            </Link>
          </div>
        </div>

        {/* ── კატეგ. სათაური ── */}
        <div
          className="flex items-center gap-4 mb-6 pb-6"
          style={{ borderBottom: `1px solid ${C.border}` }}
        >
          <span className="text-5xl">{category?.icon}</span>
          <div className="flex-1">
            <h1
              className="text-3xl font-bold tracking-tight leading-none"
              style={{ color: C.text, letterSpacing: "-0.5px" }}
            >
              {category?.name || categoryId}
            </h1>
            <p className="text-sm mt-1.5" style={{ color: C.text3 }}>
              {loading ? (
                "იტვირთება..."
              ) : (
                <>
                  <strong style={{ color: C.text }}>
                    {/* {total.toLocaleString()} */}
                  </strong>{" "}
                  {/* განცხადება */}
                </>
              )}
            </p>
          </div>
        </div>

        {/* ── ფილტრების ზოლი ── */}
        <div className="flex items-center gap-2 mb-6">
          {/* ფილტრი ღილაკი */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: showFilters ? C.greenLight : C.bg2,
              border: `1px solid ${showFilters ? C.green : C.border}`,
              color: showFilters ? C.green : C.text2,
              cursor: "pointer",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            <SlidersHorizontal size={14} />
            ფილტრი
            {activeFiltersCount > 0 && (
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ background: C.green }}
              >
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* active filter chips */}
          {sort !== "newest" && (
            <span
              className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: C.greenLight,
                color: C.green,
                border: `1px solid rgba(26,138,74,0.2)`,
              }}
            >
              🕰 ძველი პირველი
              <button
                onClick={() => setSort("newest")}
                style={{ cursor: "pointer", color: C.green }}
              >
                <X size={12} />
              </button>
            </span>
          )}
          {condition && (
            <span
              className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: C.greenLight,
                color: C.green,
                border: `1px solid rgba(26,138,74,0.2)`,
              }}
            >
              {condition === "NEW" ? "ახალი" : "მეორადი"}
              <button
                onClick={() => setCondition("")}
                style={{ cursor: "pointer", color: C.green }}
              >
                <X size={12} />
              </button>
            </span>
          )}
        </div>

        {/* ── ფილტრის პანელი ── */}
        {showFilters && (
          <div
            className="rounded-2xl p-5 mb-6"
            style={{ background: C.bg2, border: `1px solid ${C.border}` }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* დახარისხება */}
              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-widest mb-3"
                  style={{ color: C.text3 }}
                >
                  დახარისხება
                </p>
                <div className="flex gap-2">
                  {[
                    { id: "newest", label: "🆕 ახლიდან ძველისკენ" },
                    { id: "oldest", label: "🕰 ძველიდან ახლისკენ" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSort(opt.id as SortOpt)}
                      className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background: sort === opt.id ? C.green : C.bg,
                        color: sort === opt.id ? "#fff" : C.text2,
                        border: `1px solid ${sort === opt.id ? C.green : C.border}`,
                        cursor: "pointer",
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* მდგომარეობა */}
              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-widest mb-3"
                  style={{ color: C.text3 }}
                >
                  მდგომარეობა
                </p>
                <div className="flex gap-2">
                  {[
                    { id: "", label: "ყველა" },
                    { id: "NEW", label: "ახალი" },
                    { id: "USED", label: "მეორადი" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setCondition(opt.id as ConditionOpt)}
                      className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background: condition === opt.id ? C.green : C.bg,
                        color: condition === opt.id ? "#fff" : C.text2,
                        border: `1px solid ${condition === opt.id ? C.green : C.border}`,
                        cursor: "pointer",
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Skeleton ── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden animate-pulse"
                style={{ border: `1px solid ${C.border}`, background: C.bg2 }}
              >
                <div
                  className="aspect-square w-full"
                  style={{ background: C.bg3 }}
                />
                <div className="p-3 space-y-2">
                  <div
                    className="h-4 rounded w-3/4"
                    style={{ background: C.bg3 }}
                  />
                  <div
                    className="h-3 rounded w-1/2"
                    style={{ background: C.bg3 }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-6xl mb-4">{category?.icon || "📦"}</p>
            <p className="text-xl font-bold mb-2" style={{ color: C.text }}>
              ამ კატეგორიაში განცხადება არ არის
            </p>
            <p className="text-sm mb-8" style={{ color: C.text3 }}>
              იყავი პირველი ვინც განათავსებს!
            </p>
            <button
              onClick={() => requireAuth(() => setShowAddModal(true))}
              className="px-8 py-3 rounded-xl text-white font-bold transition-all"
              style={{
                background: C.green,
                cursor: "pointer",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              + განცხადება დადე
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {listings.map((listing) => (
                <ListingCard
                  key={listing._id}
                  listing={listing}
                  user={user}
                  onOffer={() => requireAuth(() => setShowOfferModal(listing))}
                  onEdit={() => {
                    setEditingListing(listing);
                    setShowAddModal(true);
                  }}
                  onDelete={() =>
                    setDeleteConfirmation({
                      isOpen: true,
                      listingId: listing._id,
                    })
                  }
                />
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                  style={{
                    border: `1px solid ${C.border}`,
                    background: C.bg2,
                    color: C.text2,
                    cursor: "pointer",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {loadingMore ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />{" "}
                      იტვირთება...
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} /> მეტის ნახვა (
                      {total - listings.length} დარჩა)
                    </>
                  )}
                </button>

                <div className="mt-4 mx-auto max-w-xs">
                  <div
                    className="flex justify-between text-xs mb-1.5 font-medium"
                    style={{ color: C.text3 }}
                  >
                    {/* <span>{listings.length} ნაჩვენები</span>
                    <span>{total} სულ</span> */}
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: C.bg3 }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((listings.length / total) * 100, 100)}%`,
                        background: C.green,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {!hasMore && listings.length > 0 && (
              <p
                className="text-center text-sm font-medium mt-10"
                style={{ color: C.text3 }}
              >
                {/* ✓ ყველა {total} განცხადება ნაჩვენებია */}
              </p>
            )}
          </>
        )}
      </main>

      {showAddModal && (
        <AddListingModal
          onClose={() => {
            setShowAddModal(false);
            setEditingListing(null);
          }}
          onRefresh={() => fetchListings({ reset: true })}
          editingListing={editingListing}
        />
      )}
      {showOfferModal && (
        <OfferModal
          listing={showOfferModal}
          onClose={() => setShowOfferModal(null)}
        />
      )}

      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() =>
              setDeleteConfirmation({ isOpen: false, listingId: null })
            }
          />
          <div
            className="relative w-full max-w-sm rounded-2xl p-8 shadow-2xl text-center z-10"
            style={{ background: C.bg, border: `1px solid ${C.border}` }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444" }}
            >
              <Trash2 size={26} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: C.text }}>
              ნამდვილად წაშლით?
            </h3>
            <p className="text-sm mb-8" style={{ color: C.text3 }}>
              ეს ქმედება შეუქცევადია.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setDeleteConfirmation({ isOpen: false, listingId: null })
                }
                className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
                style={{
                  border: `1px solid ${C.border}`,
                  color: C.text2,
                  background: "transparent",
                  cursor: "pointer",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                გაუქმება
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-xl text-white text-sm font-bold transition-all"
                style={{
                  background: "#ef4444",
                  cursor: "pointer",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                წაშლა
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
