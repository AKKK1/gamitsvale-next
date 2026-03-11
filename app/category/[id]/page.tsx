"use client";

import React, { useState, useEffect } from "react";
import { CATEGORIES, useAuth } from "@/components/AuthProvider";
import Header from "@/components/Header";
import ListingCard from "@/components/ListingCard";
import AddListingModal from "@/components/AddListingModal";
import OfferModal from "@/components/OfferModal";
import Toast from "@/components/Toast";
import { Trash2 } from "lucide-react";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  const fetchListings = async (extra?: URLSearchParams) => {
    if (!categoryId) return;
    setLoading(true);
    const p = extra || new URLSearchParams();
    p.set("category", categoryId);
    const res = await fetch(`/api/listings?${p.toString()}`);
    const data = await res.json();
    setListings(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    if (categoryId) fetchListings();
  }, [categoryId]);

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
    fetchListings();
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <Header
        onAddListing={() => requireAuth(() => setShowAddModal(true))}
        onSearch={(query, type) => {
          const p = new URLSearchParams();
          if (query) {
            p.append("search", query);
            p.append("type", type || "want");
          }
          fetchListings(p);
        }}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-10">
          <span className="text-4xl">{category?.icon}</span>
          <h1 className="text-3xl font-black tracking-tighter">
            {category?.name || categoryId}
          </h1>
          <div className="h-px w-32 bg-dark-border hidden md:block" />
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
        ) : listings.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <p className="text-lg font-bold">
              ამ კატეგორიაში განცხადება არ არის
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
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
        )}
      </main>

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

      {/* წაშლის დადასტურება */}
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
              ეს ქმედება შეუქცევადია.
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
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-all"
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
