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

const C = {
  bg: "#ffffff",
  bg2: "#f8faf8",
  bg3: "#f0f4f0",
  green: "#1a8a4a",
  greenLight: "#e6f5ec",
  greenDark: "#125e33",
  text: "#111111",
  text2: "#555555",
  text3: "#999999",
  border: "#e8ebe8",
  gold: "#c8820a",
  goldLight: "#fff8e6",
};

// ── გაცვლის პერიოდი ──────────────────────────────────────────────────────────
function TradePeriodInfo({ listing }: { listing: any }) {
  const isPermanent =
    !listing.tradePeriod || listing.tradePeriod === "permanent";
  const unitMap: Record<string, string> = {
    day: "დღე",
    week: "კვირა",
    month: "თვე",
    year: "წელი",
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className="text-[11px] font-bold uppercase tracking-widest"
        style={{ color: C.text3 }}
      >
        გაცვლის ვადა:
      </span>
      {isPermanent ? (
        <span
          className="inline-flex items-center gap-1 text-[12px] font-semibold px-2.5 py-1 rounded-lg"
          style={{ background: C.greenLight, color: C.green }}
        >
          ♾ მუდმივი
        </span>
      ) : (
        <span
          className="inline-flex items-center gap-1 text-[12px] font-semibold px-2.5 py-1 rounded-lg"
          style={{ background: C.bg3, color: C.text2 }}
        >
          <Clock size={12} />
          {listing.tradeDuration}{" "}
          {unitMap[listing.tradeUnit] || listing.tradeUnit}
        </span>
      )}
    </div>
  );
}

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
    if (!user) {
      setToast("გთხოვთ გაიაროთ ავტორიზაცია 🔐");
      return;
    }
    const res = await fetch(`/api/listings/save/${listing._id}`, {
      method: "POST",
    });
    if (res.ok) {
      const data = await res.json();
      setIsSaved(data.saved);
      setToast(
        data.saved
          ? "განცხადება შენახულია ❤️"
          : "განცხადება წაიშალა შენახულიდან",
      );
    }
  };

  const handleOffer = () => {
    if (!user) {
      setToast("გთხოვთ გაიაროთ ავტორიზაცია 🔐");
      return;
    }
    setShowOfferModal(true);
  };

  const nextImage = () =>
    setCurrentImageIndex((p) => (p + 1) % listing.images.length);
  const prevImage = () =>
    setCurrentImageIndex(
      (p) => (p - 1 + listing.images.length) % listing.images.length,
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
    <div
      style={{ color: C.text, fontFamily: "'Space Grotesk', sans-serif" }}
      className="pb-20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ══ სურათები ══ */}
        <div className="space-y-4">
          <div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl group"
            style={{ background: C.bg2, border: `1px solid ${C.border}` }}
          >
            {isExchanged && (
              <div
                className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-[2px]"
                style={{ background: "rgba(255,255,255,0.7)" }}
              >
                <div
                  className="transform -rotate-12 px-8 py-3 rounded-xl"
                  style={{
                    border: "3px solid #ef4444",
                    background: "rgba(239,68,68,0.08)",
                  }}
                >
                  <span
                    className="text-3xl font-black uppercase tracking-[0.2em]"
                    style={{ color: "#ef4444" }}
                  >
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    color: C.text,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    color: C.text,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {listing.listingType === "VIP" && (
              <div
                className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1 text-white"
                style={{ background: C.gold }}
              >
                ⭐ VIP
              </div>
            )}
          </div>

          {listing.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {listing.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden transition-all"
                  style={{
                    border: `2px solid ${currentImageIndex === idx ? C.green : C.border}`,
                    opacity: currentImageIndex === idx ? 1 : 0.55,
                  }}
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

        {/* ══ ინფო ══ */}
        <div className="space-y-5">
          {/* badge + სათაური */}
          <div>
            <div
              className="flex items-center gap-2 text-sm mb-3 flex-wrap"
              style={{ color: C.text3 }}
            >
              <span
                className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider"
                style={
                  listing.condition === "NEW"
                    ? {
                        background: C.greenLight,
                        color: C.green,
                        border: `1px solid rgba(26,138,74,0.2)`,
                      }
                    : {
                        background: C.bg3,
                        color: C.text3,
                        border: `1px solid ${C.border}`,
                      }
                }
              >
                {listing.condition === "NEW" ? "ახალი" : "მეორადი"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-xs">
                <Clock size={13} /> {timeAgo(listing.createdAt)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-xs">
                <Eye size={13} /> {listing.views || 0} ნახვა
              </span>
            </div>
            <h1
              className="text-3xl font-black tracking-tight mb-3"
              style={{ color: C.text, letterSpacing: "-0.5px" }}
            >
              {listing.title}
            </h1>
            <div className="flex items-center gap-2" style={{ color: C.text2 }}>
              <MapPin size={16} style={{ color: "#ef4444" }} />
              <span className="font-medium text-sm">{listing.city}</span>
            </div>
          </div>

          {/* ── გაცვლის ვადა ── */}
          <div
            className="rounded-xl px-4 py-3 flex items-center gap-3"
            style={{ background: C.bg2, border: `1px solid ${C.border}` }}
          >
            <TradePeriodInfo listing={listing} />
          </div>

          {/* აღწერა */}
          <div
            className="rounded-2xl p-5"
            style={{ background: C.bg2, border: `1px solid ${C.border}` }}
          >
            <h3 className="font-bold text-base mb-3" style={{ color: C.text }}>
              აღწერა
            </h3>
            <p
              className="whitespace-pre-wrap leading-relaxed text-sm"
              style={{ color: C.text2 }}
            >
              {listing.description}
            </p>
          </div>

          {/* გაცვლა მინდა */}
          <div
            className="rounded-2xl p-5"
            style={{ background: C.bg2, border: `1px solid ${C.border}` }}
          >
            <h3
              className="font-bold text-base flex items-center gap-2 mb-3"
              style={{ color: C.text }}
            >
              მსურს:
            </h3>
            <div className="flex flex-wrap gap-2">
              {listing.wantedType === "service" && listing.serviceWanted ? (
                <span
                  className="px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2"
                  style={{
                    background: C.greenLight,
                    color: C.green,
                    border: `1px solid rgba(26,138,74,0.2)`,
                  }}
                >
                  🛠️ {listing.serviceWanted}
                </span>
              ) : listing.wantedItems?.length > 0 ? (
                listing.wantedItems.map((item: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg text-sm font-bold"
                    style={
                      idx === 0
                        ? {
                            background: C.goldLight,
                            color: C.gold,
                            border: `1px solid rgba(200,130,10,0.2)`,
                          }
                        : idx === 1
                          ? {
                              background: C.greenLight,
                              color: C.green,
                              border: `1px solid rgba(26,138,74,0.2)`,
                            }
                          : {
                              background: C.bg3,
                              color: C.text2,
                              border: `1px solid ${C.border}`,
                            }
                    }
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="italic text-sm" style={{ color: C.text3 }}>
                  შემომთავაზეთ💡
                </span>
              )}
            </div>
          </div>

          {/* მფლობელი */}
          <div
            className="rounded-2xl p-5"
            style={{ background: C.bg2, border: `1px solid ${C.border}` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full overflow-hidden shrink-0"
                  style={{ border: `1px solid ${C.border}`, background: C.bg3 }}
                >
                  {listing.owner?.avatar ? (
                    <img
                      src={listing.owner.avatar}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={20} style={{ color: C.text3 }} />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: C.text }}>
                    @
                    {listing.owner?.username ||
                      listing.owner?.name?.split(" ")[0]?.toLowerCase() ||
                      "user"}
                  </p>
                  <p className="text-xs" style={{ color: C.text3 }}>
                    მომხმარებელი
                  </p>
                </div>
              </div>
              {!isOwner && !isExchanged && (
                <button
                  onClick={handleOffer}
                  className="px-5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 text-sm text-white"
                  style={{
                    background: C.green,
                    cursor: "pointer",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      C.greenDark)
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      C.green)
                  }
                >
                  <MessageCircle size={16} /> შეთავაზება
                </button>
              )}
            </div>
          </div>

          {/* ქმედებები */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl font-bold border transition-all flex items-center justify-center gap-2 text-sm"
              style={
                isSaved
                  ? {
                      background: "#ef4444",
                      color: "#fff",
                      border: "1px solid #ef4444",
                      cursor: "pointer",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }
                  : {
                      background: C.bg2,
                      color: C.text2,
                      border: `1px solid ${C.border}`,
                      cursor: "pointer",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }
              }
            >
              <Heart size={18} className={cn(isSaved && "fill-current")} />
              {isSaved ? "შენახულია" : "შენახვა"}
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setToast("ბმული დაკოპირდა! 🔗");
              }}
              className="flex-1 py-3 rounded-xl font-bold border transition-all flex items-center justify-center gap-2 text-sm"
              style={{
                background: C.bg2,
                color: C.text2,
                border: `1px solid ${C.border}`,
                cursor: "pointer",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
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
