"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import Header from "@/components/Header";
import ListingDetails from "@/components/ListingDetails";
import OfferModal from "@/components/OfferModal";
import Toast from "@/components/Toast";

export default function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user } = useAuth();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [listingId, setListingId] = useState<string>("");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    Promise.resolve(params).then((p) => setListingId(p.id));
  }, [params]);

  useEffect(() => {
    if (!listingId) return;
    fetch(`/api/listings/${listingId}`)
      .then((r) => r.json())
      .then((data) => {
        setListing(data);
        setLoading(false);
      });
  }, [listingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-white">
        <Header onAddListing={() => {}} />
        <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse">
          <div className="h-8 bg-zinc-800 rounded w-1/2 mb-4" />
          <div className="aspect-video bg-zinc-800 rounded-2xl mb-4" />
          <div className="h-4 bg-zinc-800 rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-dark text-white">
        <Header onAddListing={() => {}} />
        <div className="text-center py-20 text-zinc-500">
          <p className="text-lg font-bold">განცხადება ვერ მოიძებნა</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white">
      <Header onAddListing={() => {}} />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <ListingDetails
          listing={listing}
          user={user}
          onOffer={() => {
            if (!user) {
              setToast("გთხოვთ გაიაროთ ავტორიზაცია 🔐");
              return;
            }
            setShowOfferModal(true);
          }}
        />
      </main>
      {showOfferModal && (
        <OfferModal
          listing={listing}
          onClose={() => setShowOfferModal(false)}
        />
      )}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
