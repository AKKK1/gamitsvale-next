"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import Header from "@/components/Header";
import ListingCard, {
  ListingsTabs,
  type ListingTab,
} from "@/components/ListingCard";
import AddListingModal from "@/components/AddListingModal";
import OfferModal from "@/components/OfferModal";
import Toast from "@/components/Toast";
import { Trash2 } from "lucide-react";
import Footer from "../app/footer/page";
//

const C = {
  green: "#1a8a4a",
  border: "#e8ebe8",
  text: "#111111",
  text3: "#999999",
};

export default function HomePage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ListingTab>("new");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState<any>(null);
  const [editingListing, setEditingListing] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    listingId: string | null;
  }>({ isOpen: false, listingId: null });

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

  // ── Tab შეცვლა ────────────────────────────────────────────────────────────
  const handleTabChange = (tab: ListingTab) => {
    setActiveTab(tab);

    if (tab === "vip") {
      const p = new URLSearchParams();
      p.set("listingType", "VIP");
      fetchListings(p);
    } else if (tab === "new") {
      fetchListings();
    } else if (tab === "nearby") {
      // TODO: geolocation — navigator.geolocation.getCurrentPosition() →
      // reverse geocode → p.set("city", detectedCity) → fetchListings(p)
      fetchListings();
    } else if (tab === "popular") {
      // TODO: API-ზე დაამატე ?sort=popular → Listing.find().sort({ views: -1 })
      fetchListings();
    }
  };

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

  const requireAuth = (action: () => void) => {
    if (!user) {
      setToast("გთხოვთ გაიაროთ ავტორიზაცია 🔐");
      return;
    }
    action();
  };

  const handleHeroSearch = (query: string, type: string, filters?: any) => {
    const p = new URLSearchParams();
    if (query?.trim()) {
      p.append("search", query.trim());
      p.append("type", type || "want");
    }
    if (filters?.city) p.append("city", filters.city);
    if (filters?.category) p.append("category", filters.category);
    if (filters?.condition) p.append("condition", filters.condition);
    fetchListings(p);
    setTimeout(() => {
      document
        .getElementById("listings-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const displayListings =
    activeTab === "vip"
      ? listings.filter((l) => l.listingType === "VIP" || l.isVIP)
      : listings
          .filter((l) => l.listingType !== "VIP" && !l.isVIP)
          .sort((a, b) => {
            if (a.listingType === "SILVER" && b.listingType !== "SILVER")
              return -1;
            if (a.listingType !== "SILVER" && b.listingType === "SILVER")
              return 1;
            return 0;
          });

  return (
    <div className="min-h-screen" style={{ background: "#fff", color: C.text }}>
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

      <HeroSection onSearch={handleHeroSearch} />
      <CategoriesSection />

      {/* ── განცხადებები ── */}
      <main id="listings-section" className="max-w-7xl mx-auto px-4 py-8">
        <ListingsTabs activeTab={activeTab} onChange={handleTabChange} />

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden animate-pulse"
                style={{
                  border: `1px solid ${C.border}`,
                  background: "#f8faf8",
                }}
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
        ) : displayListings.length === 0 ? (
          <div className="text-center py-20" style={{ color: C.text3 }}>
            <p className="text-base font-medium">განცხადება არ არის</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {displayListings.map((listing, index) => (
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
            style={{ background: "#fff", border: `1px solid ${C.border}` }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"
              style={{ background: "rgba(239,68,68,0.08)" }}
            >
              <Trash2 size={28} />
            </div>
            <h3
              className="text-[16px] font-bold mb-2"
              style={{ color: C.text }}
            >
              ნამდვილად გსურთ წაშლა?
            </h3>
            <p className="text-[12px] mb-6" style={{ color: C.text3 }}>
              ეს ქმედება შეუქცევადია.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setDeleteConfirmation({ isOpen: false, listingId: null })
                }
                className="flex-1 py-3 rounded-xl text-[12px] font-medium transition-all"
                style={{ border: `1px solid ${C.border}`, color: C.text3 }}
              >
                გაუქმება
              </button>
              <button
                onClick={confirmDeleteListing}
                className="flex-1 py-3 rounded-xl text-white text-[12px] font-semibold transition-all"
                style={{ background: "#ef4444" }}
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
