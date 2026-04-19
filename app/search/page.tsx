"use client";

// app/search/page.tsx  (ან components/SearchPage.tsx)
// ჰედერიდან ძებნის შემდეგ ეს გვერდი გამოჩნდება

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import Header from "@/components/Header";
import ListingCard from "@/components/ListingCard";
import AddListingModal from "@/components/AddListingModal";
import OfferModal from "@/components/OfferModal";
import Toast from "@/components/Toast";
import { Trash2, Search, X } from "lucide-react";
import Footer from "@/app/footer/page";

const C = {
  bg: "#ffffff",
  bg2: "#f8faf8",
  bg3: "#f0f4f0",
  green: "#1a8a4a",
  greenLight: "#e6f5ec",
  text: "#111111",
  text2: "#555555",
  text3: "#999999",
  border: "#e8ebe8",
};

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState<any>(null);
  const [editingListing, setEditingListing] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    listingId: string | null;
  }>({ isOpen: false, listingId: null });

  // URL params-იდან ამოიღე
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "want";
  const city = searchParams.get("city") || "";
  const category = searchParams.get("category") || "";
  const condition = searchParams.get("condition") || "";

  const fetchResults = async (p?: URLSearchParams) => {
    setLoading(true);
    const params = p || buildParams();
    const res = await fetch(`/api/listings?${params.toString()}`);
    const data = await res.json();
    setListings(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const buildParams = () => {
    const p = new URLSearchParams();
    if (query) {
      p.append("search", query);
      p.append("type", type);
    }
    if (city) p.append("city", city);
    if (category) p.append("category", category);
    if (condition) p.append("condition", condition);
    return p;
  };

  useEffect(() => {
    fetchResults();
  }, [searchParams.toString()]);

  const requireAuth = (action: () => void) => {
    if (!user) {
      setToast("გთხოვთ გაიაროთ ავტორიზაცია 🔐");
      return;
    }
    action();
  };

  const confirmDeleteListing = async () => {
    if (!deleteConfirmation.listingId) return;
    const res = await fetch(`/api/listings/${deleteConfirmation.listingId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setDeleteConfirmation({ isOpen: false, listingId: null });
      fetchResults();
    }
  };

  // active chips for display
  const activeFilters = [
    query && { label: `"${query}"`, key: "q" },
    city && { label: `📍 ${city}`, key: "city" },
    category && { label: `📦 ${category}`, key: "category" },
    condition && {
      label: condition === "NEW" ? "ახალი" : "მეორადი",
      key: "condition",
    },
  ].filter(Boolean) as { label: string; key: string }[];

  const removeFilter = (key: string) => {
    const p = new URLSearchParams(searchParams.toString());
    p.delete(key);
    if (key === "q") p.delete("type");
    router.push(`/search?${p.toString()}`);
  };

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
        onSearch={(q, t, filters) => {
          const p = new URLSearchParams();
          if (q?.trim()) {
            p.append("q", q.trim());
            p.append("type", t || "want");
          }
          if (filters?.city) p.append("city", filters.city);
          if (filters?.category) p.append("category", filters.category);
          if (filters?.condition) p.append("condition", filters.condition);
          router.push(`/search?${p.toString()}`);
        }}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* ── სათაური + ფილტრ ჩიფები ── */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ background: C.greenLight }}
            >
              <Search size={16} style={{ color: C.green }} />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: C.text }}>
                {query ? `"${query}"` : "ძებნის შედეგები"}
              </h1>
              <p className="text-xs" style={{ color: C.text3 }}>
                {loading ? (
                  "იტვირთება..."
                ) : (
                  <>
                    <strong style={{ color: C.text }}>{listings.length}</strong>{" "}
                    განცხადება მოიძებნა
                  </>
                )}
              </p>
            </div>
          </div>

          {/* filter chips */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((f) => (
                <span
                  key={f.key}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: C.greenLight,
                    color: C.green,
                    border: `1px solid rgba(26,138,74,0.2)`,
                  }}
                >
                  {f.label}
                  <button
                    onClick={() => removeFilter(f.key)}
                    style={{
                      cursor: "pointer",
                      color: C.green,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <button
                onClick={() => router.push("/search")}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                style={{
                  background: C.bg3,
                  color: C.text3,
                  border: `1px solid ${C.border}`,
                  cursor: "pointer",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                ყველა გასუფთავება
              </button>
            </div>
          )}
        </div>

        {/* separator */}
        <div
          className="mb-6"
          style={{ borderBottom: `1px solid ${C.border}` }}
        />

        {/* ── სია ── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden animate-pulse"
                style={{ border: `1px solid ${C.border}`, background: C.bg2 }}
              >
                <div className="aspect-[4/3] w-full bg-gray-200" />
                <div className="p-3 space-y-2.5">
                  <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-10 bg-gray-200 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl font-bold mb-2" style={{ color: C.text }}>
              {query ? `"${query}" — ვერ მოიძებნა` : "განცხადება ვერ მოიძებნა"}
            </p>
            <p className="text-sm mb-8" style={{ color: C.text3 }}>
              სცადე სხვა საძიებო სიტყვა ან გაასუფთავე ფილტრები
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-8 py-3 rounded-xl text-white font-bold transition-all"
              style={{
                background: C.green,
                cursor: "pointer",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              მთავარზე დაბრუნება
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {listings.map((listing, index) => (
              <ListingCard
                key={listing._id}
                listing={listing}
                user={user}
                index={index}
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
        )}
      </main>

      {showAddModal && (
        <AddListingModal
          onClose={() => {
            setShowAddModal(false);
            setEditingListing(null);
          }}
          onRefresh={() => fetchResults()}
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
            className="relative w-full max-w-sm rounded-2xl p-6 shadow-xl text-center"
            style={{ background: C.bg, border: `1px solid ${C.border}` }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"
              style={{ background: "rgba(239,68,68,0.08)" }}
            >
              <Trash2 size={28} />
            </div>
            <h3 className="text-base font-bold mb-2" style={{ color: C.text }}>
              ნამდვილად გსურთ წაშლა?
            </h3>
            <p className="text-xs mb-6" style={{ color: C.text3 }}>
              ეს ქმედება შეუქცევადია.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setDeleteConfirmation({ isOpen: false, listingId: null })
                }
                className="flex-1 py-3 rounded-xl text-xs font-medium transition-all"
                style={{
                  border: `1px solid ${C.border}`,
                  color: C.text3,
                  background: "transparent",
                  cursor: "pointer",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                გაუქმება
              </button>
              <button
                onClick={confirmDeleteListing}
                className="flex-1 py-3 rounded-xl text-white text-xs font-semibold transition-all"
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
      <Footer />
    </div>
  );
}

// Suspense wrapper — useSearchParams requires it in Next.js App Router
export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
