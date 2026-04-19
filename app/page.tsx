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
import { Trash2, MapPin } from "lucide-react";
import Footer from "../app/footer/page";
import HeroSection from "@/components/newDesign/HeroSection";
import CategoriesSection from "@/components/newDesign/CategoriesSection";

const C = {
  green: "#1a8a4a",
  greenLight: "#e6f5ec",
  border: "#e8ebe8",
  text: "#111111",
  text3: "#999999",
};

// ── ქალაქი კოორდინატებით (10 ქ.) ──────────────────────────────────────────
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  თბილისი: { lat: 41.6938, lng: 44.8015 },
  ქუთაისი: { lat: 42.2679, lng: 42.6938 },
  ბათუმი: { lat: 41.6168, lng: 41.6367 },
  რუსთავი: { lat: 41.5495, lng: 44.9998 },
  ზუგდიდი: { lat: 42.5088, lng: 41.871 },
  გორი: { lat: 41.9853, lng: 44.1138 },
  ფოთი: { lat: 42.1489, lng: 41.672 },
  თელავი: { lat: 41.9174, lng: 45.4722 },
  ხაშური: { lat: 41.9953, lng: 43.5913 },
  სამტრედია: { lat: 42.1595, lng: 42.3407 },
};

// კილომეტრებში მანძილი (Haversine)
function distKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// მომხმარებლის კოორდინატებიდან ახლომდებარე ქალაქები (10 კმ radius)
function nearbyCities(userLat: number, userLng: number, radius = 10): string[] {
  return Object.entries(CITY_COORDS)
    .filter(([, c]) => distKm(userLat, userLng, c.lat, c.lng) <= radius)
    .map(([name]) => name);
}

export default function HomePage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ListingTab>("new");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState<any>(null);
  const [editingListing, setEditingListing] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [geoStatus, setGeoStatus] = useState<
    "idle" | "loading" | "done" | "denied"
  >("idle");
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    listingId: string | null;
  }>({ isOpen: false, listingId: null });

  const fetchListings = async (params?: URLSearchParams) => {
    setLoading(true);
    const res = await fetch(
      `/api/listings${params?.toString() ? "?" + params.toString() : ""}`,
    );
    const data = await res.json();
    setListings(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // ── Tab შეცვლა ──────────────────────────────────────────────────────────
  const handleTabChange = (tab: ListingTab) => {
    setActiveTab(tab);

    if (tab === "vip") {
      const p = new URLSearchParams();
      p.set("listingType", "VIP");
      fetchListings(p);
    } else if (tab === "new") {
      fetchListings();
    } else if (tab === "popular") {
      const p = new URLSearchParams();
      p.set("sort", "popular");
      fetchListings(p);
    } else if (tab === "nearby") {
      // ── გეოლოკაცია ──
      if (!navigator.geolocation) {
        setToast("გეოლოკაცია არ არის მხარდაჭერილი ამ ბრაუზერში");
        fetchListings();
        return;
      }
      setGeoStatus("loading");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const cities = nearbyCities(latitude, longitude, 100);
          setGeoStatus("done");
          if (cities.length === 0) {
            setToast("ახლომდებარე ქალაქი ვერ მოიძებნა");
            fetchListings();
            return;
          }
          const p = new URLSearchParams();
          // ყველა ახლომდებარე ქალაქი გადაეცემა API-ს
          cities.forEach((c) => p.append("city", c));
          fetchListings(p);
          setToast(`📍 ნაჩვენებია ${cities.join(", ")}-ის განცხადებები`);
        },
        () => {
          setGeoStatus("denied");
          setToast("გეოლოკაციაზე წვდომა აკრძალულია — ნებართვა მიეცი ბრაუზერს");
          fetchListings();
        },
        { timeout: 8000, maximumAge: 300000 },
      );
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
    setTimeout(
      () =>
        document
          .getElementById("listings-section")
          ?.scrollIntoView({ behavior: "smooth" }),
      300,
    );
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

      {/* განცხადებები */}
      <main id="listings-section" className="max-w-7xl mx-auto px-4 py-8">
        <ListingsTabs activeTab={activeTab} onChange={handleTabChange} />

        {/* geo loading indicator */}
        {activeTab === "nearby" && geoStatus === "loading" && (
          <div
            className="flex items-center gap-2 mb-4 text-sm"
            style={{ color: C.text3 }}
          >
            <MapPin size={14} style={{ color: C.green }} />
            <span>მდებარეობა განისაზღვრება...</span>
          </div>
        )}

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
            <p className="text-base font-medium">
              {activeTab === "nearby" && geoStatus === "done"
                ? "ახლომდებარე განცხადება ვერ მოიძებნა"
                : "განცხადება არ არის"}
            </p>
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
                style={{
                  border: `1px solid ${C.border}`,
                  color: C.text3,
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                გაუქმება
              </button>
              <button
                onClick={confirmDeleteListing}
                className="flex-1 py-3 rounded-xl text-white text-[12px] font-semibold transition-all"
                style={{ background: "#ef4444", cursor: "pointer" }}
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
