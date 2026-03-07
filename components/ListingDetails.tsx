"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Eye,
  Share2,
  Heart,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { cn, useAuth } from "./AuthProvider";
import Link from "next/link";
import OfferModal from "./OfferModal";
import AddListingModal from "./AddListingModal";

export default function ListingDetails({ listingId }: { listingId: string }) {
  const { user } = useAuth();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showAddListingModal, setShowAddListingModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listings/${listingId}`);
        if (res.ok) {
          const data = await res.json();
          setListing(data);
          if (user?.savedListings?.includes(data._id)) setIsSaved(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId, user]);

  const handleSave = async () => {
    if (!user) return alert("გთხოვთ გაიაროთ ავტორიზაცია");
    const res = await fetch(`/api/listings/save/${listing._id}`, {
      method: "POST",
    });
    if (res.ok) {
      const data = await res.json();
      setIsSaved(data.saved);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );

  if (!listing)
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-white">
          განცხადება არ მოიძებნა
        </h2>
        <Link href="/" className="text-gold hover:underline">
          მთავარ გვერდზე დაბრუნება
        </Link>
      </div>
    );

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  const prevImage = () =>
    setCurrentImageIndex(
      (prev) => (prev - 1 + listing.images.length) % listing.images.length,
    );

  return (
    <div className="min-h-screen bg-dark text-white pb-20">
      <main className="container mx-auto px-4 pt-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-dark-card border border-dark-border group">
              {listing.isTraded && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                  <div className="transform -rotate-12 border-4 border-red-500 px-8 py-3 rounded-xl bg-red-500/20">
                    <span className="text-3xl font-black uppercase tracking-[0.2em] text-red-500">
                      გაცვლილია
                    </span>
                  </div>
                </div>
              )}
              <img
                src={
                  listing.images[currentImageIndex] ||
                  "https://picsum.photos/seed/item/800/600"
                }
                alt={listing.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
              {listing.listingType === "VIP" && (
                <div className="absolute top-4 left-4 bg-gold text-dark px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                  <span>⭐</span> VIP
                </div>
              )}
            </div>
            {listing.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {listing.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      "relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                      currentImageIndex === idx
                        ? "border-gold"
                        : "border-transparent opacity-70 hover:opacity-100",
                    )}
                  >
                    <img
                      src={img}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
                <span className="bg-dark-card px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider border border-dark-border">
                  {listing.condition === "NEW" ? "ახალი" : "მეორადი"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {new Date(listing.createdAt).toLocaleDateString("ka-GE")}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye size={14} />
                  {listing.views || 0} ნახვა
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
                {listing.title}
              </h1>
              <div className="flex items-center gap-2 text-zinc-400 mb-6">
                <MapPin size={18} className="text-gold" />
                <span className="font-medium">{listing.city}</span>
              </div>
            </div>

            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-dark overflow-hidden border border-dark-border">
                    {listing.owner?.avatar ? (
                      <img
                        src={listing.owner.avatar}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl font-bold text-zinc-500">
                        {listing.owner?.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">
                      {listing.owner?.name || "უცნობი"}
                    </h3>
                    <p className="text-xs text-zinc-500">მომხმარებელი</p>
                  </div>
                </div>
                {user?._id !== listing.owner?._id && (
                  <button
                    onClick={() =>
                      user
                        ? setShowOfferModal(true)
                        : alert("გთხოვთ გაიაროთ ავტორიზაცია")
                    }
                    className="bg-gold text-dark px-6 py-2.5 rounded-xl font-bold hover:bg-gold-hover transition-all flex items-center gap-2"
                  >
                    <MessageCircle size={18} /> შეთავაზება
                  </button>
                )}
              </div>

              <div className="h-px bg-dark-border my-6"></div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <RefreshCw size={20} className="text-gold" /> გაცვლა მინდა:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {listing.wantedItems?.length > 0 ? (
                    listing.wantedItems.map((item: string, idx: number) => (
                      <span
                        key={idx}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-sm font-bold border",
                          idx === 0
                            ? "bg-gold/10 text-gold border-gold/20"
                            : idx === 1
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                              : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
                        )}
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-zinc-500 italic">
                      მითითებული არ არის
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-2">აღწერა</h3>
              <p className="text-zinc-400 whitespace-pre-wrap leading-relaxed">
                {listing.description}
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSave}
                className={cn(
                  "flex-1 py-3 rounded-xl font-bold border transition-all flex items-center justify-center gap-2",
                  isSaved
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-dark-card text-white border-dark-border hover:border-gold hover:text-gold",
                )}
              >
                <Heart size={20} className={cn(isSaved && "fill-current")} />
                {isSaved ? "შენახულია" : "შენახვა"}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("ბმული დაკოპირდა!");
                }}
                className="flex-1 py-3 rounded-xl font-bold border border-dark-border bg-dark-card text-white hover:bg-dark transition-all flex items-center justify-center gap-2"
              >
                <Share2 size={20} /> გაზიარება
              </button>
            </div>
          </div>
        </div>
      </main>

      {showOfferModal && (
        <OfferModal
          listing={listing}
          onClose={() => setShowOfferModal(false)}
        />
      )}
      {showAddListingModal && (
        <AddListingModal
          onClose={() => setShowAddListingModal(false)}
          onRefresh={() => {}}
        />
      )}
    </div>
  );
}
