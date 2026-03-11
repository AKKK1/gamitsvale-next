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
  User,
} from "lucide-react";
import Toast from "./Toast";
import { cn, useAuth } from "./AuthProvider";
import Link from "next/link";
import OfferModal from "./OfferModal";

interface ListingDetailsProps {
  listing: any;
  user?: any;
  onOffer?: () => void;
}

export default function ListingDetails({
  listing,
  user,
  onOffer,
}: ListingDetailsProps) {
  const [toast, setToast] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [isSaved, setIsSaved] = useState(
    user?.savedListings?.includes(listing._id),
  );

  useEffect(() => {
    setIsSaved(user?.savedListings?.includes(listing._id));
  }, [user, listing._id]);

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

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  const prevImage = () =>
    setCurrentImageIndex(
      (prev) => (prev - 1 + listing.images.length) % listing.images.length,
    );

  const isOwner = user?._id === listing.owner?._id;
  const isExchanged = listing.isTraded || listing.status === "EXCHANGED";

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor(diff / 60000);
    if (days > 0) return `${days} დღის წინ`;
    if (hours > 0) return `${hours} საათის წინ`;
    return `${mins} წუთის წინ`;
  };

  return (
    <div className="text-white pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ══ მარცხენა — სურათები ══ */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-dark-card border border-dark-border group">
            {isExchanged && (
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
                listing.images?.[currentImageIndex] ||
                "https://picsum.photos/seed/item/800/600"
              }
              alt={listing.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />

            {listing.images?.length > 1 && (
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
                ⭐ VIP
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {listing.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {listing.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={cn(
                    "relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                    currentImageIndex === idx
                      ? "border-gold"
                      : "border-transparent opacity-60 hover:opacity-100",
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

        {/* ══ მარჯვენა — ინფო ══ */}
        <div className="space-y-6">
          {/* სათაური + მეტა */}
          <div>
            <div className="flex items-center gap-2 text-sm text-zinc-400 mb-3 flex-wrap">
              <span
                className={cn(
                  "px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider border",
                  listing.condition === "NEW"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-blue-500/10 text-blue-400 border-blue-500/20",
                )}
              >
                {listing.condition === "NEW" ? "ახალი" : "მეორადი"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={13} /> {timeAgo(listing.createdAt)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye size={13} /> {listing.views || 0} ნახვა
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-3">
              {listing.title}
            </h1>
            <div className="flex items-center gap-2 text-zinc-400">
              <MapPin size={16} className="text-[#ce0e0e]" />
              <span className="font-medium">{listing.city}</span>
            </div>
          </div>

          {/* მფლობელის ბარათი */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-dark overflow-hidden border border-dark-border shrink-0">
                  {listing.owner?.avatar ? (
                    <img
                      src={listing.owner.avatar}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-bold text-zinc-500">
                      <User size={20} />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">
                    @
                    {listing.owner?.username ||
                      listing.owner?.name?.split(" ")[0]?.toLowerCase() ||
                      "user"}
                  </p>
                  <p className="text-xs text-zinc-500">მომხმარებელი</p>
                </div>
              </div>
              {!isOwner && !isExchanged && (
                <button
                  onClick={() =>
                    user
                      ? setShowOfferModal(true)
                      : alert("გთხოვთ გაიაროთ ავტორიზაცია")
                  }
                  className="bg-gold text-dark px-5 py-2 rounded-xl font-bold hover:brightness-110 transition-all flex items-center gap-2 text-sm"
                >
                  <MessageCircle size={16} /> შეთავაზება
                </button>
              )}
            </div>
          </div>

          {/* ── გაცვლა მინდა — მხოლოდ ერთი სექცია ── */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
            <h3 className="font-bold text-base flex items-center gap-2 mb-3">
              <RefreshCw size={16} className="text-gold" /> გაცვლა მინდა:
            </h3>
            <div className="flex flex-wrap gap-2">
              {listing.wantedType === "service" && listing.serviceWanted ? (
                <span className="px-3 py-1.5 rounded-lg text-sm font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 flex items-center gap-2">
                  🛠️ {listing.serviceWanted}
                </span>
              ) : listing.wantedItems?.length > 0 ? (
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
                <span className="text-zinc-500 italic text-sm">
                  მითითებული არ არის
                </span>
              )}
            </div>
          </div>

          {/* აღწერა */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
            <h3 className="font-bold text-base mb-3">აღწერა</h3>
            <p className="text-zinc-400 whitespace-pre-wrap leading-relaxed text-sm">
              {listing.description}
            </p>
          </div>

          {/* ქმედებები */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className={cn(
                "flex-1 py-3 rounded-xl font-bold border transition-all flex items-center justify-center gap-2 text-sm",
                isSaved
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-dark-card text-white border-dark-border hover:border-gold hover:text-gold",
              )}
            >
              <Heart size={18} className={cn(isSaved && "fill-current")} />
              {isSaved ? "შენახულია" : "შენახვა"}
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setToast("ბმული დაკოპირდა! 🔗");
              }}
              className="flex-1 py-3 rounded-xl font-bold border border-dark-border bg-dark-card text-white hover:bg-dark transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Share2 size={18} /> გაზიარება
            </button>
          </div>
        </div>
      </div>

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
