"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CATEGORIES, useAuth } from "@/components/AuthProvider";
import Header from "@/components/Header";
import ListingCard from "@/components/ListingCard";
import AddListingModal from "@/components/AddListingModal";
import OfferModal from "@/components/OfferModal";
import Toast from "@/components/Toast";
import { Trash2, Loader2, ChevronDown } from "lucide-react";
import Link from "next/link";

const PAGE_SIZE = 20;

export default function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user } = useAuth();

  // ── state ──
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

  useEffect(() => {
    Promise.resolve(params).then((p) => setCategoryId(p.id));
  }, [params]);

  const category = CATEGORIES.find((c) => c.id === categoryId);

  // ── fetch (append ან reset) ──
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

      const res = await fetch(`/api/listings?${p.toString()}`);
      const data = await res.json();

      // პრიორიტეტი: VIP → SILVER → NORMAL
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

      if (pageNum === 1 || reset) {
        setListings(sorted);
      } else {
        setListings((prev) => [...prev, ...sorted]);
      }

      setPage(pageNum);
      setLoading(false);
      setLoadingMore(false);
    },
    [categoryId],
  );

  useEffect(() => {
    if (categoryId) {
      setPage(1);
      fetchListings({ reset: true });
    }
  }, [categoryId]);

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

  return (
    <div className="min-h-screen bg-white text-gray-900">
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
        {/* ══════════════════════════════════════════
            რეკლამის ბანერი
            ══════════════════════════════════════════ */}
        <div className="relative overflow-hidden rounded-2xl border border-dashed border-green-300 bg-green-50 p-5 mb-8">
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-green-100 border border-green-200 text-green-700 text-[10px] font-black uppercase tracking-wider">
            📢 რეკლამა
          </span>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs font-black text-green-700 uppercase tracking-widest mb-1">
                შეუკვეთე შენი რეკლამა აქ
              </p>
              <h3 className="text-lg font-black text-gray-900 mb-1">
                10,000+ მომხმარებელი ყოველდღიურად 👀
              </h3>
              <p className="text-sm text-gray-500">
                მიიტანე შენი პროდუქტი ან სერვისი სწორ აუდიტორიამდე — მარტივად და
                იაფად.
              </p>
            </div>
            <Link
              href="/advertise"
              className="shrink-0 px-6 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-all shadow-sm hover:shadow-md whitespace-nowrap"
            >
              დეტალები →
            </Link>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            კატეგორიის სათაური
            ══════════════════════════════════════════ */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
          <span className="text-5xl">{category?.icon}</span>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 leading-none">
              {category?.name || categoryId}
            </h1>
            <p className="text-sm text-gray-400 mt-1.5 font-medium">
              {loading ? (
                "იტვირთება..."
              ) : (
                <>
                  <strong className="text-gray-900">
                    {total.toLocaleString()}
                  </strong>{" "}
                  განცხადება
                </>
              )}
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            პრიორიტეტის ლეგენდა
            ══════════════════════════════════════════ */}
        {!loading && listings.length > 0 && (
          <div className="flex items-center gap-3 mb-5 text-xs font-semibold text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
              VIP — პირველი
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" />
              Silver
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-100 border border-gray-300 inline-block" />
              ჩვეულებრივი
            </span>
          </div>
        )}

        {/* ══════════════════════════════════════════
            Skeleton
            ══════════════════════════════════════════ */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-white overflow-hidden animate-pulse"
              >
                <div className="aspect-square w-full bg-gray-100" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-9 bg-gray-100 rounded-xl mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          /* ══ Empty ══ */
          <div className="text-center py-24">
            <p className="text-6xl mb-4">{category?.icon || "📦"}</p>
            <p className="text-xl font-black text-gray-900 mb-2">
              ამ კატეგორიაში განცხადება არ არის
            </p>
            <p className="text-sm text-gray-500 mb-8">
              იყავი პირველი ვინც განათავსებს!
            </p>
            <button
              onClick={() => requireAuth(() => setShowAddModal(true))}
              className="px-8 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-all"
            >
              + განცხადება დადე
            </button>
          </div>
        ) : (
          <>
            {/* ══ კარტები ══ */}
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

            {/* ══ Load More ══ */}
            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-700 font-bold text-sm hover:border-green-500 hover:text-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

                {/* პროგრეს ბარი */}
                <div className="mt-4 mx-auto max-w-xs">
                  <div className="flex justify-between text-xs text-gray-400 mb-1.5 font-medium">
                    <span>{listings.length} ნაჩვენები</span>
                    <span>{total} სულ</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((listings.length / total) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ══ ყველა ნაჩვენებია ══ */}
            {!hasMore && listings.length > 0 && (
              <p className="text-center text-sm text-gray-400 font-medium mt-10">
                ✓ ყველა {total} განცხადება ნაჩვენებია
              </p>
            )}
          </>
        )}
      </main>

      {/* ══ მოდალი: განცხადება ══ */}
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

      {/* ══ მოდალი: შეთავაზება ══ */}
      {showOfferModal && (
        <OfferModal
          listing={showOfferModal}
          onClose={() => setShowOfferModal(null)}
        />
      )}

      {/* ══ წაშლის დადასტურება ══ */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() =>
              setDeleteConfirmation({ isOpen: false, listingId: null })
            }
          />
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl text-center border border-gray-200">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={26} className="text-red-500" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">
              ნამდვილად წაშლით?
            </h3>
            <p className="text-sm text-gray-500 mb-8">
              ეს ქმედება შეუქცევადია.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setDeleteConfirmation({ isOpen: false, listingId: null })
                }
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 text-sm font-bold hover:border-gray-300 transition-all"
              >
                გაუქმება
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-all"
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
