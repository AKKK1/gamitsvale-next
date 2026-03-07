"use client";

import React, { useState, useEffect } from "react";
import { CATEGORIES, useAuth } from "@/components/AuthProvider";
import Header from "@/components/Header";
import ListingCard from "@/components/ListingCard";
import AddListingModal from "@/components/AddListingModal";
import OfferModal from "@/components/OfferModal";

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

  return (
    <div className="min-h-screen bg-dark text-white">
      <Header
        onAddListing={() =>
          user ? setShowAddModal(true) : alert("გთხოვთ გაიაროთ ავტორიზაცია")
        }
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
                onOffer={() =>
                  user
                    ? setShowOfferModal(listing)
                    : alert("გთხოვთ გაიაროთ ავტორიზაცია")
                }
                onEdit={() => {
                  setEditingListing(listing);
                  setShowAddModal(true);
                }}
                onDelete={() => {
                  if (confirm("ნამდვილად გსურთ წაშლა?")) {
                    fetch(`/api/listings/${listing._id}`, {
                      method: "DELETE",
                    }).then(() => fetchListings());
                  }
                }}
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
    </div>
  );
}
