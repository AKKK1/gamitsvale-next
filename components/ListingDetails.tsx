"use client";
// ეს directive ნიშნავს რომ ეს კომპონენტი browser-ში გაეშვება (client-side)
// Next.js-ში default-ად ყველა კომპონენტი server-side-ია
// useState, useEffect, onClick — ეს ყველაფერი მხოლოდ client-side-ზე მუშაობს

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
// lucide-react — icon ბიბლიოთეკა. npm-ით დაყენებულია.
// ახალი icon-ის დასამატებლად: https://lucide.dev — ეძებ სახელს, import-ს აკეთებ

import { cn, useAuth } from "./AuthProvider";
// cn — className utility (clsx + tailwind-merge). ერთდება class-ები პირობებით
// useAuth — custom hook. AuthProvider.tsx-ში არის განსაზღვრული.
//   აბრუნებს: { user, loading, login, logout, register, ... }
//   user ობიექტი: { _id, name, email, username, avatar, role, balance, savedListings }

import Link from "next/link";
// Next.js-ის built-in ნავიგაცია. <a href> მაგივრად გამოიყენება.
// განსხვავება: Link pre-fetches გვერდს, <a> კი მთელ გვერდს reload-ავს

import OfferModal from "./OfferModal";
// components/OfferModal.tsx — მოდალი შეთავაზებისთვის
// props: listing (object), onClose (function)

// ─────────────────────────────────────────────
// PROPS INTERFACE — TypeScript-ის ტიპი
// ─────────────────────────────────────────────
interface ListingDetailsProps {
  listing: any; // MongoDB-დან მოსული განცხადების ობიექტი
  // სტრუქტურა: { _id, title, description, images[], city,
  //   condition, category, wantedItems[], listingType,
  //   isTraded, views, createdAt, owner: { _id, name, username, avatar } }
  user?: any; // AuthProvider-იდან მოსული მიმდინარე მომხმარებელი (შეიძლება null იყოს)
  onOffer?: () => void; // callback — parent-ი (page.tsx) გადმოსცემს
}

export default function ListingDetails({
  listing,
  user,
  onOffer,
}: ListingDetailsProps) {
  // ─────────────────────────────────────────────
  // STATE — კომპონენტის შიდა მდგომარეობა
  // ─────────────────────────────────────────────

  const [toast, setToast] = useState<string | null>(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // რომელი სურათია ახლა ნაჩვენები (0, 1, 2...)
  // შეცვლა: setCurrentImageIndex(n)

  const [showOfferModal, setShowOfferModal] = useState(false);
  // true/false — OfferModal ჩანს თუ არა

  const [isSaved, setIsSaved] = useState(
    user?.savedListings?.includes(listing._id),
  );
  // შენახულია თუ არა ეს განცხადება
  // user.savedListings — MongoDB-ში User-ის savedListings array (ObjectId-ების სია)
  // includes(listing._id) — ამოწმებს არის თუ არა ეს ID სიაში

  useEffect(() => {
    setIsSaved(user?.savedListings?.includes(listing._id));
  }, [user, listing._id]);
  // useEffect გაეშვება როდესაც user ან listing._id შეიცვლება
  // საჭიროა იმიტომ რომ user async-ად იტვირთება AuthProvider-ში

  // ─────────────────────────────────────────────
  // HANDLERS — მოვლენების დამმუშავებლები
  // ─────────────────────────────────────────────
  const handleSave = async () => {
    if (!user) return alert("გთხოვთ გაიაროთ ავტორიზაცია");

    // API call → app/api/listings/save/[id]/route.ts (POST)
    // ჯაჭვი: ListingDetails → POST /api/listings/save/:id → MongoDB User.savedListings
    const res = await fetch(`/api/listings/save/${listing._id}`, {
      method: "POST",
    });
    if (res.ok) {
      const data = await res.json(); // { saved: true/false }
      setIsSaved(data.saved); // UI განახლება
    }
  };

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  // % (modulo) — ბოლო სურათიდან პირველზე გადადის

  const prevImage = () =>
    setCurrentImageIndex(
      (prev) => (prev - 1 + listing.images.length) % listing.images.length,
    );
  // + listing.images.length — უარყოფითი რიცხვის თავიდან ასაცილებლად

  const isOwner = user?._id === listing.owner?._id;
  // true თუ მიმდინარე user == განცხადების მფლობელი
  // ?. (optional chaining) — null-ზე error-ს არ იძლევა

  const isExchanged = listing.isTraded || listing.status === "EXCHANGED";
  // გაცვლილია თუ არა — MongoDB-ში isTraded field

  // ─────────────────────────────────────────────
  // HELPER FUNCTION
  // ─────────────────────────────────────────────
  const timeAgo = (date: string) => {
    // date — MongoDB-ის createdAt field (ISO string: "2024-01-15T10:30:00.000Z")
    const diff = Date.now() - new Date(date).getTime(); // milliseconds
    const days = Math.floor(diff / 86400000); // 1 დღე = 86400000ms
    const hours = Math.floor(diff / 3600000); // 1 საათი = 3600000ms
    const mins = Math.floor(diff / 60000); // 1 წუთი = 60000ms
    if (days > 0) return `${days} დღის წინ`;
    if (hours > 0) return `${hours} საათის წინ`;
    return `${mins} წუთის წინ`;
  };

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div className="text-white pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* lg:grid-cols-2 — desktop-ზე 2 სვეტი, მობაილზე 1 */}

        {/* ══════════════════════════════
            მარცხენა სვეტი — სურათები
        ══════════════════════════════ */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-dark-card border border-dark-border group">
            {/* aspect-[4/3] — სიგანე:სიმაღლე = 4:3 პროპორცია */}
            {/* group — hover ეფექტებისთვის (group-hover:opacity-100) */}

            {isExchanged && (
              // გაცვლილია badge — z-50 ყველაზე მაღლა
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
              // listing.images — Cloudinary URL-ების array
              // app/api/upload/route.ts-ში იტვირთება Cloudinary-ზე
              // fallback: picsum.photos — სურათი არ იყოს თუ
              alt={listing.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />

            {listing.images?.length > 1 && (
              // მხოლოდ მაშინ ჩანს carousel ღილაკები თუ 1-ზე მეტი სურათია
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
              // listingType — MongoDB Listing model-ში: enum ['NORMAL', 'SILVER', 'VIP']
              // lib/models.ts → ListingSchema → listingType field
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
                    // cn() — პირობითი class-ები: active thumbnail-ს gold border აქვს
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

        {/* ══════════════════════════════
            მარჯვენა სვეტი — ინფო
        ══════════════════════════════ */}
        <div className="space-y-6">
          {/* სათაური + მეტა ინფო */}
          <div>
            <div className="flex items-center gap-2 text-sm text-zinc-400 mb-3 flex-wrap">
              <span
                className={cn(
                  "px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider border",
                  listing.condition === "NEW"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-blue-500/10 text-blue-400 border-blue-500/20",
                  // condition — MongoDB-ში: enum ['NEW', 'USED']
                  // lib/models.ts → ListingSchema → condition field
                )}
              >
                {listing.condition === "NEW" ? "ახალი" : "მეორადი"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={13} /> {timeAgo(listing.createdAt)}
                {/* createdAt — MongoDB auto timestamp. lib/models.ts-ში: createdAt: { type: Date, default: Date.now } */}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye size={13} /> {listing.views || 0} ნახვა
                {/* views — GET /api/listings/[id]/route.ts-ში ემატება +1 ყოველ ვიზიტზე */}
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-3">
              {listing.title}
            </h1>
            <div className="flex items-center gap-2 text-zinc-400">
              <MapPin size={16} className="text-[#ce0e0e]" />
              <span className="font-medium">{listing.city}</span>
              {/* city — GEORGIAN_CITIES array-იდან. AuthProvider.tsx-ში არის სია */}
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
                    // avatar არ არის თუ — User icon
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
                    {/* ჯაჭვი:
                        1. listing.owner.username — MongoDB User-ის username field
                        2. თუ არ აქვს: სახელის პირველი სიტყვა lowercase-ით
                        3. თუ ეს არც: "user"
                        username-ის შეცვლა: app/api/profile/route.ts → PATCH */}
                  </p>
                  <p className="text-xs text-zinc-500">მომხმარებელი</p>
                </div>
              </div>
              {!isOwner && !isExchanged && (
                // შეთავაზება ღილაკი — მხოლოდ სხვის განცხადებაზე და გაუცვლელზე
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

          {/* გაცვლა მინდა */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
            <h3 className="font-bold text-base flex items-center gap-2 mb-3">
              <RefreshCw size={16} className="text-gold" /> გაცვლა მინდა:
            </h3>
            <div className="flex flex-wrap gap-2">
              {listing.wantedItems?.length > 0 ? (
                listing.wantedItems.map((item: string, idx: number) => (
                  // wantedItems — MongoDB array, max 3 ელემენტი
                  // AddListingModal.tsx-ში შეიყვანება → POST /api/listings/route.ts
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
          {/* გაცვლა მინდა */}
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
              {/* whitespace-pre-wrap — line break-ებს ინახავს */}
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
              {/* ჯაჭვი: click → handleSave → POST /api/listings/save/[id] →
                  MongoDB User.savedListings array-ში ემატება/იშლება ID */}
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

      {/* OfferModal — პირობითად ჩანს */}
      {showOfferModal && (
        <OfferModal
          listing={listing}
          // listing გადაეცემა OfferModal-ს → components/OfferModal.tsx
          // OfferModal შლის offer-ს → POST /api/offers/route.ts →
          // MongoDB Offer collection + Notification შეიქმნება
          onClose={() => setShowOfferModal(false)}
        />
      )}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
