// components/ListingCard.tsx
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
  Clock,
} from "lucide-react";
import { cn } from "./AuthProvider";
import Toast from "./Toast";
import { BorderTrail } from "./motion-primitives/border-trail";
import { TextRoll } from "@/components/motion-primitives/text-roll";
import { TextLoop } from "./motion-primitives/text-loop";

// ─────────────────────────────────────────────────────────────────────────────
// 🎨 კონსტანტები: ფერები
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  green: "#1a8a4a",
  greenDark: "#125e33",
  greenLight: "#e6f5ec",
  bg: "#ffffff",
  bgCard: "#f8faf8",
  border: "#e8ebe8",
  text: "#111111",
  text2: "#555555",
  text3: "#999999",
  gold: "#c8820a",
  white: "#ffffff",
  blue: "#1e088a ",
  offerMe: "#092686c5",
  orange: "#9c6126",
  orangeLight: "#ecd0b4",
};

// ─────────────────────────────────────────────────────────────────────────────
// ⏰ დროის ფორმატირება: "2 სთ წინ", "3 დღ წინ"
// ─────────────────────────────────────────────────────────────────────────────
function timeAgo(date: string) {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "ახლახანს";
  if (mins < 60) return `${mins} წთ წინ`;
  if (hours < 24) return `${hours} სთ წინ`;
  if (days < 7) return `${days} დღ წინ`;
  return new Date(date).toLocaleDateString("ka-GE", {
    day: "numeric",
    month: "short",
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 💀 Skeleton: ჩატვირთვის ეფექტი
// ─────────────────────────────────────────────────────────────────────────────
export function ListingCardSkeleton() {
  return (
    <div
      className="rounded-xl overflow-hidden animate-pulse"
      style={{ border: `1px solid ${C.border}`, background: C.bgCard }}
    >
      <div className="aspect-[4/3] w-full bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="flex gap-2 pt-2">
          <div className="h-8 bg-gray-200 rounded-lg flex-1" />
          <div className="h-8 w-8 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 🔁 TradePeriodBadge: გაცვლის პერიოდის ბეჯის ჩვენება
// ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
// ─────────────────────────────────────────────────────────────────────────────
function TradePeriodBadge({ listing }: { listing: any }) {
  // ▼▼▼ მონაცემის წაკითხვა listing ობიექტიდან (MongoDB-დან მოდის) ▼▼▼
  // თუ tradePeriod არ არის ან არის "permanent" → მუდმივი გაცვლა
  const isPermanent =
    !listing.tradePeriod || listing.tradePeriod === "permanent";

  if (isPermanent) {
    // მუდმივი გაცვლა: მწვანე ბეჯი "♾ მუდმივი"
    return (
      <span
        className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md"
        style={{ background: C.greenLight, color: C.green }}
      >
        ♾ მუდმივი
      </span>
    );
  }

  // დროებითი გაცვლა: ნაცრისფერი ბეჯი დროით
  const unitMap: Record<string, string> = {
    day: "დღე",
    week: "კვ.",
    month: "თვე",
    year: "წელი",
  };
  const unit = unitMap[listing.tradeUnit] || listing.tradeUnit || "";

  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md"
      style={{ background: "#c8820a", color: "#ffff" }}
    >
      ⏳ {listing.tradeDuration} {unit}
      {/* მაგალითი: ⏳ 2 თვე, ⏳ 1 კვ., ⏳ 6 თვე */}
    </span>
  );
}
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
// 🔁 TradePeriodBadge - დასრულებულია
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

// ─────────────────────────────────────────────────────────────────────────────
// 🧩 Props ინტერფეისი
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// 🧩 კომპონენტი: ListingCard
// ─────────────────────────────────────────────────────────────────────────────
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
    } catch {}
  };

  const hasMultipleImages = listing.images && listing.images.length > 1;
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((p) => (p + 1) % listing.images.length);
  };
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(
      (p) => (p - 1 + listing.images.length) % listing.images.length,
    );
  };

  const type = listing.listingType || (listing.isVIP ? "VIP" : "NORMAL");
  const isExchanged = listing.isTraded || listing.status === "EXCHANGED";
  const isOwner =
    user && (user._id === listing.owner?._id || user.role === "ADMIN");

  const cardBorder =
    type === "VIP"
      ? `2px solid ${C.gold}`
      : type === "SILVER"
        ? "1px solid #C0C0C0"
        : `1px solid ${C.border}`;
  const cardHoverShadow =
    type === "VIP"
      ? "0 8px 28px rgba(200,130,10,0.12)"
      : "0 8px 28px rgba(26,138,74,0.08)";

  return (
    <>
      <div
        className={cn("animate-fade-up h-full cursor-pointer", className)}
        style={{ animationDelay: `${delay}s` }}
        onClick={() => listing._id && router.push(`/listing/${listing._id}`)}
      >
        <div
          className="group relative w-full h-full flex flex-col overflow-hidden rounded-[14px] transition-all duration-200"
          style={{
            background: C.bg,
            border: isExchanged ? "1px solid #fca5a5" : cardBorder,
            opacity: isExchanged ? 0.9 : 1,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform =
              "translateY(-2px)";
            (e.currentTarget as HTMLElement).style.boxShadow = cardHoverShadow;
            if (!isExchanged)
              (e.currentTarget as HTMLElement).style.borderColor =
                type === "VIP" ? C.gold : C.green;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
            (e.currentTarget as HTMLElement).style.borderColor =
              type === "VIP"
                ? C.gold
                : type === "SILVER"
                  ? "#C0C0C0"
                  : isExchanged
                    ? "#fca5a5"
                    : C.border;
          }}
        >
          {/* გაცვლილია overlay */}
          {isExchanged && (
            <div
              className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-[2px]"
              style={{ background: "rgba(255,255,255,0.6)" }}
            >
              <div
                className="transform -rotate-12 px-5 py-2 rounded-xl"
                style={{
                  border: "3px solid #ef4444",
                  background: "rgba(239,68,68,0.1)",
                }}
              >
                <span
                  className="text-xl font-bold uppercase tracking-[0.15em]"
                  style={{ color: "#ef4444" }}
                >
                  გაცვლილია
                </span>
              </div>
            </div>
          )}

          {/* სურათი */}
          <div
            className="relative aspect-[4/3] w-full overflow-hidden shrink-0 group/carousel"
            style={{ background: "#f0f4f0" }}
          >
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

            {/* ▼▼▼ დრო (ზედა-მარჯვენა) - შექმნის თარიღი ▼▼▼ */}
            {listing.createdAt && (
              <span
                className="absolute top-2 right-2 z-20 flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                style={{
                  background: "rgba(255,255,255,0.88)",
                  color: C.text3,
                  border: `1px solid ${C.border}`,
                }}
              >
                <Clock size={9} />
                {timeAgo(listing.createdAt)}
              </span>
            )}

            {/* carousel */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-1.5 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity z-20 shadow-sm"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-1.5 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity z-20 shadow-sm"
                >
                  <ChevronRight size={14} />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20 px-2 py-1 rounded-full bg-black/20 backdrop-blur-sm">
                  {listing.images.map((_: any, idx: number) => (
                    <div
                      key={idx}
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: idx === currentImageIndex ? 12 : 6,
                        background:
                          idx === currentImageIndex
                            ? C.green
                            : "rgba(255,255,255,0.6)",
                      }}
                    />
                  ))}
                </div>
              </>
            )}

            {/* VIP / SILVER badge */}
            {type === "VIP" && (
              <span
                className="absolute left-2 top-2 rounded-md px-2 py-0.5 text-[10px] font-bold z-20 shadow"
                style={{ background: C.gold, color: "#fff" }}
              >
                ⭐ VIP
              </span>
            )}
            {type === "SILVER" && (
              <span
                className="absolute left-2 top-2 rounded-md px-2 py-0.5 text-[10px] font-bold z-20 shadow"
                style={{
                  background: "linear-gradient(135deg, #C0C0C0, #E8E8E8)",
                  color: "#333",
                }}
              >
                🥈 SILVER
              </span>
            )}

            {/* შენახვა — მხოლოდ არ-owner */}
            {!isOwner && (
              <button
                onClick={handleSave}
                className="absolute right-2 bottom-2 z-20 p-1.5 rounded-full shadow transition-all"
                style={{
                  background: isSaved ? "#ef4444" : "rgba(255,255,255,0.85)",
                  color: isSaved ? "#fff" : C.text3,
                }}
                onMouseEnter={(e) => {
                  if (!isSaved)
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(255,255,255,1)";
                }}
                onMouseLeave={(e) => {
                  if (!isSaved)
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(255,255,255,0.85)";
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={isSaved ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                >
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                </svg>
              </button>
            )}
          </div>

          {/* ინფო */}
          <div
            className="p-3 flex flex-col flex-1 gap-2"
            style={{ background: C.bg }}
          >
            <h3
              className="font-semibold text-[13px] line-clamp-1"
              style={{ color: C.text }}
            >
              {listing.title}
            </h3>

            <div
              className="flex items-center gap-1 text-[11px]"
              style={{ color: C.text3 }}
            >
              <MapPin size={11} color="#ef4444" />
              {listing.city}
            </div>

            {/* გაცვლა მინდა */}
            {/* aqedam */}

            {listing.wantedType === "service" && listing.serviceWanted ? (
              <div
                className="rounded-lg px-2.5 py-2"
                style={{
                  background: "#1a8a4a",
                  borderLeft: `3px solid #065c2b`,
                }}
              >
                <p
                  className="text-[9px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1"
                  style={{ color: C.white }}
                >
                  <RefreshCw size={8} />
                  მსურს 👨🏻‍🔧
                </p>
                <div className="flex flex-wrap gap-1 min-h-[18px]">
                  {listing.wantedType === "service" && listing.serviceWanted ? (
                    <span
                      className="text-[11px] font-medium text-[#ffffff]!"
                      style={{ color: C.text }}
                    >
                      <TextLoop className="  dark:text-white">
                        {listing.serviceWanted}
                      </TextLoop>

                      <BorderTrail
                        className="bg-linear-to-l from-green-200 via-green-500 to-green-200 dark:from-green-400 dark:via-green-500 dark:to-green-700"
                        size={120}
                      />
                    </span>
                  ) : listing.wantedItems?.length > 0 ? (
                    <span
                      className="text-[11px] font-medium line-clamp-1 "
                      style={{ color: C.text }}
                    >
                      {listing.wantedItems
                        .filter(Boolean)
                        .slice(0, 2)
                        .join(" · ")}
                    </span>
                  ) : (
                    <span
                      className="text-[11px] italic"
                      style={{ color: C.text3 }}
                    >
                      შემომთავაზეთ
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div
                className="rounded-lg px-2.5 py-2"
                style={{
                  background: C.greenLight,
                  borderLeft: `3px solid ${C.green}`,
                }}
              >
                <p
                  className="text-[9px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1"
                  style={{ color: C.green }}
                >
                  <RefreshCw size={8} /> მსურს
                </p>
                <div className="flex flex-wrap gap-1 min-h-[18px]">
                  {listing.wantedType === "service" && listing.serviceWanted ? (
                    <span
                      className="text-[11px] font-medium text-[#050000]!"
                      style={{ color: C.text }}
                    >
                      🛠️ {listing.serviceWanted}
                      <BorderTrail
                        className="bg-linear-to-l from-red-200 via-red-500 to-red-200 dark:from-red-400 dark:via-red-500 dark:to-red-700"
                        size={120}
                      />
                    </span>
                  ) : listing.wantedItems?.length > 0 ? (
                    <span
                      className="text-[11px] font-bold line-clamp-1 "
                      style={{ color: C.text }}
                    >
                      {listing.wantedItems
                        .filter(Boolean)
                        .slice(0, 2)
                        .join(" · ")}
                    </span>
                  ) : (
                    <span
                      className="text-[11px] font-bold "
                      style={{ color: C.greenDark }}
                    >
                      💡შემომთავაზეთ
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* <div
              className="rounded-lg px-2.5 py-2"
              style={{
                background: C.greenLight,
                borderLeft: `3px solid ${C.green}`,
              }}
            >
              <p
                className="text-[9px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1"
                style={{ color: C.green }}
              >
                <RefreshCw size={8} /> მსურს
              </p>
              <div className="flex flex-wrap gap-1 min-h-[18px]">
                {listing.wantedType === "service" && listing.serviceWanted ? (
                  <span
                    className="text-[11px] font-medium text-[#050000]!"
                    style={{ color: C.text }}
                  >
                    🛠️ {listing.serviceWanted}
                    <BorderTrail
                      className="bg-linear-to-l from-blue-200 via-blue-500 to-blue-200 dark:from-blue-400 dark:via-blue-500 dark:to-blue-700"
                      size={120}
                    />
                  </span>
                ) : listing.wantedItems?.length > 0 ? (
                  <span
                    className="text-[11px] font-medium line-clamp-1 "
                    style={{ color: C.text }}
                  >
                    {listing.wantedItems
                      .filter(Boolean)
                      .slice(0, 2)
                      .join(" · ")}
                  </span>
                ) : (
                  <span
                    className="text-[11px] italic"
                    style={{ color: C.text3 }}
                  >
                    მითითებული არ არის
                  </span>
                )}
              </div>
            </div> */}

            {/* aqamde */}
            {/* footer */}
            <div
              className="flex items-center justify-between pt-1.5 mt-auto"
              style={{ borderTop: `1px solid ${C.border}` }}
            >
              {/* ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */}
              {/* 🔁 გაცვლის პერიოდის ბეჯი: აქ გამოიძახება TradePeriodBadge */}
              {/* ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */}
              <TradePeriodBadge listing={listing} />
              {/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */}
              {/* 🔁 გაცვლის პერიოდის ბეჯი - დასრულებულია */}
              {/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */}

              {isOwner ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.();
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all"
                    style={{
                      background: C.bgCard,
                      border: `1px solid ${C.border}`,
                      color: C.text2,
                    }}
                  >
                    <Edit3 size={10} /> რედ.
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.();
                    }}
                    className="p-1.5 rounded-lg transition-all text-red-400"
                    style={{
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.2)",
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ) : (
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md"
                  style={{ background: C.bgCard, color: C.text3 }}
                >
                  დეტალები →
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 🧩 ListingsTabs: ტაბების კომპონენტი
// ─────────────────────────────────────────────────────────────────────────────
export type ListingTab = "vip" | "new" | "nearby" | "popular";
interface ListingsTabsProps {
  activeTab: ListingTab;
  onChange: (tab: ListingTab) => void;
}
const TABS: { id: ListingTab; label: string }[] = [
  { id: "vip", label: "⭐ VIP განცხადებები" },
  { id: "new", label: "🆕 ახალი" },
  { id: "nearby", label: "📍 ჩემს ახლოს" },
  // { id: "popular", label: "🔥 პოპულარული" },
];
export function ListingsTabs({ activeTab, onChange }: ListingsTabsProps) {
  return (
    <div
      className="flex gap-0 mb-6"
      style={{ borderBottom: `1px solid ${C.border}` }}
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className="px-4 py-2.5 text-[13px] font-medium transition-all whitespace-nowrap"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontFamily: "'Space Grotesk', sans-serif",
            marginBottom: -1,
            borderBottom:
              activeTab === tab.id
                ? `2px solid ${C.green}`
                : "2px solid transparent",
            color: activeTab === tab.id ? C.green : C.text3,
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
