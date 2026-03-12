"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth, CATEGORIES } from "@/components/AuthProvider";
import Header from "@/components/Header";
import ListingCard from "@/components/ListingCard";
import AddListingModal from "@/components/AddListingModal";
import OfferModal from "@/components/OfferModal";
import Toast from "@/components/Toast";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import Link from "next/link";
import Footer from "../app/footer/page";

export default function HomePage() {
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

  const vipScrollRef = useRef<HTMLDivElement>(null);

  const fetchListings = async (params?: URLSearchParams) => {
    setLoading(true);
    const res = await fetch(
      `/api/listings${params && params.toString() ? "?" + params.toString() : ""}`,
    );
    const data = await res.json();
    setListings(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const confirmDeleteListing = async () => {
    if (!deleteConfirmation.listingId) return;
    const res = await fetch(`/api/listings/${deleteConfirmation.listingId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setDeleteConfirmation({ isOpen: false, listingId: null });
      fetchListings();
    }
  };

  // ავტორიზაციის helper — alert-ის მაგივრად Toast
  const requireAuth = (action: () => void) => {
    if (!user) {
      setToast("გთხოვთ გაიაროთ ავტორიზაცია 🔐");
      return;
    }
    action();
  };

  const vipListings = listings.filter(
    (l) => l.listingType === "VIP" || l.isVIP,
  );
  const normalListings = listings
    .filter((l) => l.listingType !== "VIP" && !l.isVIP)
    .sort((a, b) => {
      if (a.listingType === "SILVER" && b.listingType !== "SILVER") return -1;
      if (a.listingType !== "SILVER" && b.listingType === "SILVER") return 1;
      return 0;
    });

  return (
    <div className="min-h-screen bg-dark text-white">
      <Header
        onAddListing={() => requireAuth(() => setShowAddModal(true))}
        onSearch={(query, type, filters) => {
          const p = new URLSearchParams();
          if (query?.trim()) {
            p.append("search", query.trim());
            p.append("type", type || "want");
          }
          if (filters?.city) p.append("city", filters.city);
          if (filters?.category) p.append("category", filters.category);
          if (filters?.condition) p.append("condition", filters.condition);
          fetchListings(p);
        }}
      />

      <main className="max-w-7xl mx-auto px-4 py-4">
        {/* ── რეკლამის ბანერი ── */}
        <section className="mb-6">
          <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-gold/30 bg-dark-card p-6">
            <span className="absolute right-3 top-3 rounded-md bg-gold/10 px-2 py-0.5 text-xs font-medium text-gold">
              📢Rules
            </span>
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <div className="flex-1">
                <h3 className="mb-1 text-lg font-semibold text-white">
                  გამიცვალეს წესები ნახეთ აქ
                </h3>
                <p className="text-sm text-zinc-400">
                  10,000+ მომხმარებელი ყოველდღიურად — მიიტანეთ თქვენი პროდუქტი
                  აუდიტორიამდე
                </p>
              </div>
              <Link
                href="/rules"
                className="shrink-0 rounded-lg bg-gold-gradient px-6 py-2.5 text-sm font-semibold text-dark transition-all hover:brightness-110"
              >
                წესები →
              </Link>
            </div>
          </div>
        </section>

        {/* ── VIP კარუსელი ── */}
        {vipListings.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                <span className="text-gold">👑</span> VIP{" "}
                <span className="text-gold">განცხადებები</span>
              </h2>
              <span className="px-3 py-1 bg-gold/10 text-gold text-[10px] font-black rounded-lg border border-gold/20 uppercase tracking-widest">
                ONLY FOR BEST OFFERS
              </span>
            </div>

            <div className="relative rounded-xl border border-gold/20 bg-dark-card/50 p-4">
              <button
                onClick={() =>
                  vipScrollRef.current?.scrollBy({
                    left: -280,
                    behavior: "smooth",
                  })
                }
                className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-dark-border bg-dark-card p-2 text-white shadow-lg hover:border-gold md:block"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() =>
                  vipScrollRef.current?.scrollBy({
                    left: 280,
                    behavior: "smooth",
                  })
                }
                className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-dark-border bg-dark-card p-2 text-white shadow-lg hover:border-gold md:block"
              >
                <ChevronRight size={16} />
              </button>

              <div
                ref={vipScrollRef}
                className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto"
              >
                {vipListings.map((listing, i) => (
                  <ListingCard
                    key={listing._id}
                    listing={listing}
                    user={user}
                    index={99}
                    delay={i * 0.05}
                    className="w-[260px] shrink-0"
                    onOffer={() =>
                      requireAuth(() => setShowOfferModal(listing))
                    }
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
            </div>
          </section>
        )}

        {/* ── ახალი განცხადებები ── */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-black tracking-tighter">
                ახალი განცხადებები
              </h2>
              <div className="h-px w-32 bg-dark-border hidden md:block" />
            </div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              ბოლო 24 საათი
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-dark-border bg-dark-card overflow-hidden animate-pulse"
                >
                  <div className="aspect-[4/3] w-full bg-zinc-800" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-zinc-800 rounded w-3/4" />
                    <div className="h-3 bg-zinc-800 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : normalListings.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">
              <p className="text-lg font-bold">განცხადება არ არის</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
              {normalListings.map((listing, index) => (
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
        </section>
      </main>

      {/* ── მოდალები ── */}
      {showAddModal && (
        <AddListingModal
          onClose={() => {
            setShowAddModal(false);
            setEditingListing(null);
          }}
          onRefresh={() => fetchListings()}
          editingListing={editingListing}
        />
      )}
      {showOfferModal && (
        <OfferModal
          listing={showOfferModal}
          onClose={() => setShowOfferModal(null)}
        />
      )}

      {/* ── წაშლის დადასტურება ── */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() =>
              setDeleteConfirmation({ isOpen: false, listingId: null })
            }
          />
          <div className="relative w-full max-w-sm bg-dark-card border border-dark-border rounded-3xl p-6 shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <Trash2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              ნამდვილად გსურთ წაშლა?
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              ეს ქმედება შეუქცევადია. განცხადება და ყველა დაკავშირებული მონაცემი
              წაიშლება.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setDeleteConfirmation({ isOpen: false, listingId: null })
                }
                className="flex-1 py-3 rounded-xl border border-dark-border text-xs font-bold text-zinc-400 hover:text-white transition-all"
              >
                გაუქმება
              </button>
              <button
                onClick={confirmDeleteListing}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-all"
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
