"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { cn } from "./AuthProvider";
import Toast from "./Toast";

export function ListingCardSkeleton() {
  return (
    <div className="rounded-xl border border-dark-border bg-card overflow-hidden animate-pulse">
      <div className="aspect-[4/3] w-full bg-zinc-800" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-zinc-800 rounded w-3/4" />
        <div className="h-3 bg-zinc-800 rounded w-1/3" />
        <div className="flex gap-2 pt-2">
          <div className="h-8 bg-zinc-800 rounded-lg flex-1" />
          <div className="h-8 w-8 bg-zinc-800 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

interface ListingCardProps {
  listing: any;
  onOffer?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  user?: any;
  delay?: number;
  className?: string;
  index?: number;
}

export default function ListingCard({
  listing,
  onOffer,
  onEdit,
  onDelete,
  user,
  delay = 0,
  className,
  index = 99,
}: ListingCardProps) {
  // პირველი 4 card viewport-ში ჩანს — eager load; დანარჩენი lazy
  const isAboveFold = index < 4;
  const isLCP = index === 0;
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(
    user?.savedListings?.includes(listing._id),
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setIsSaved(user?.savedListings?.includes(listing._id));
  }, [user, listing._id]);

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      setToast("გთხოვთ გაიაროთ ავტორიზაცია 🔐");
      return;
    }
    try {
      const res = await fetch(`/api/listings/save/${listing._id}`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setIsSaved(data.saved);
        setToast(data.saved ? "განცხადება შენახულია ❤️" : "განცხადება წაიშალა");
      }
    } catch (err) {
      console.error("Failed to save listing", err);
    }
  };

  const hasMultipleImages = listing.images && listing.images.length > 1;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(
      (prev) => (prev - 1 + listing.images.length) % listing.images.length,
    );
  };

  const type = listing.listingType || (listing.isVIP ? "VIP" : "NORMAL");
  const isExchanged = listing.isTraded || listing.status === "EXCHANGED";

  return (
    <>
      <div
        className={cn("animate-fade-up h-full cursor-pointer", className)}
        style={{ animationDelay: `${delay}s` }}
        onClick={() => listing._id && router.push(`/listing/${listing._id}`)}
      >
        <div
          className={cn(
            "group relative w-full h-full flex flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-1 bg-card",
            type === "VIP"
              ? "border-gold/30 hover:shadow-[0_12px_40px_rgba(212,175,55,0.2)]"
              : type === "SILVER"
                ? "border-zinc-400/40 hover:shadow-[0_12px_40px_rgba(192,192,192,0.15)]"
                : "border-dark-border hover:border-gold/20",
            isExchanged && "border-red-500/60 opacity-90",
          )}
        >
          {isExchanged && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
              <div className="transform -rotate-12 border-4 border-red-500 px-6 py-2 rounded-xl bg-red-500/20 backdrop-blur-md shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                <span className="text-2xl font-black uppercase tracking-[0.2em] text-red-500 drop-shadow-lg">
                  გაცვლილია
                </span>
              </div>
            </div>
          )}

          {/* IMAGE */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-dark/40 group/carousel shrink-0">
            <img
              src={
                listing.images?.[currentImageIndex] ||
                "https://picsum.photos/seed/item/400/400"
              }
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
              loading={isAboveFold ? "eager" : "lazy"}
              fetchPriority={isLCP ? "high" : "auto"}
              alt={listing.title}
            />
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-1.5 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity z-20 backdrop-blur-sm"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-1.5 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity z-20 backdrop-blur-sm"
                >
                  <ChevronRight size={16} />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm">
                  {listing.images.map((_: any, idx: number) => (
                    <div
                      key={idx}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all duration-300",
                        idx === currentImageIndex
                          ? "bg-gold w-3"
                          : "bg-white/50",
                      )}
                    />
                  ))}
                </div>
              </>
            )}

            {type === "VIP" && (
              <span className="absolute left-2 top-2 rounded-md bg-gold/90 px-2 py-0.5 text-[10px] font-bold text-dark flex items-center gap-1 z-20 shadow-lg">
                ⭐ VIP
              </span>
            )}
            {type === "SILVER" && (
              <span
                className="absolute left-2 top-2 rounded-md px-2 py-0.5 text-[10px] font-bold flex items-center gap-1 z-20 shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #C0C0C0, #E8E8E8)",
                  color: "#1a1a1a",
                }}
              >
                🥈 SILVER
              </span>
            )}
          </div>

          {/* INFO */}
          <div className="bg-dark-card p-4 flex flex-col flex-1 space-y-3">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-bold text-sm text-white line-clamp-1 flex-1">
                {listing.title}
              </h3>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <MapPin size={12} className="text-[#a81010ff]" />
              {listing.city}
            </div>

            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-gold uppercase tracking-widest flex items-center gap-1.5">
                <RefreshCw size={10} /> გაცვლა მინდა:
              </p>
              <div className="flex flex-wrap gap-1.5 min-h-[26px]">
                {listing.wantedType === "service" && listing.serviceWanted ? (
                  <span className="px-2 py-1 rounded-md text-[10px] font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 flex items-center gap-1">
                    🛠️ {listing.serviceWanted}
                  </span>
                ) : listing.wantedItems?.length > 0 ? (
                  listing.wantedItems.slice(0, 3).map(
                    (item: string, i: number) =>
                      item && (
                        <span
                          key={i}
                          className={cn(
                            "px-2 py-1 rounded-md text-[10px] font-bold border shadow-sm",
                            i === 0
                              ? "bg-gold/10 text-gold border-gold/20"
                              : i === 1
                                ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
                          )}
                        >
                          {item}
                        </span>
                      ),
                  )
                ) : (
                  <span className="text-[10px] text-zinc-600 italic">
                    მითითებული არ არის
                  </span>
                )}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-auto pt-3 flex items-center gap-2 border-t border-dark-border/50">
              {user &&
              (user._id === listing.owner?._id || user.role === "ADMIN") ? (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.();
                    }}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-zinc-800 py-2 text-[10px] font-bold text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-700 transition-all"
                  >
                    <Edit3 size={12} /> რედაქტირება
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.();
                    }}
                    className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              ) : (
                <>
                  {!isExchanged && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOffer?.();
                      }}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gold-gradient py-2 text-[10px] font-bold text-dark hover:brightness-110 shadow-lg shadow-gold/10 transition-all"
                    >
                      შეთავაზება
                    </button>
                  )}
                  <button
                    onClick={handleSave}
                    className={cn(
                      "rounded-lg border p-2 transition-all",
                      isSaved
                        ? "bg-red-500 border-red-500 text-white"
                        : "border-dark-border text-zinc-500 hover:border-gold hover:text-gold bg-dark",
                    )}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill={isSaved ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
}
