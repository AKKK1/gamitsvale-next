"use client";

// components/ListingDetailsNew.tsx

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
  Crown,
  Gem,
  Check,
} from "lucide-react";
import Toast from "./Toast";
import Link from "next/link";
import OfferModal from "./OfferModal";

interface ListingDetailsNewProps {
  listing: any;
  user?: any;
  onOffer?: () => void;
}

export default function ListingDetailsNew({
  listing,
  user,
  onOffer,
}: ListingDetailsNewProps) {
  const [toast, setToast] = useState<string | null>(null);
  const [currentImg, setCurrentImg] = useState(0);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsSaved(!!user?.savedListings?.includes(listing._id));
  }, [user, listing._id]);

  const owner = typeof listing.owner === "object" ? listing.owner : null;
  const isOwner = user && user._id === (owner?._id ?? listing.owner);
  const isExchanged = listing.isTraded;
  const isVIP = listing.listingType === "VIP" || listing.isVIP;
  const isSilver = listing.listingType === "SILVER";

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor(diff / 60000);
    if (days > 0) return `${days} დღის წინ`;
    if (hours > 0) return `${hours} საათის წინ`;
    return `${mins} წუთის წინ`;
  };

  const images = listing.images?.length ? listing.images : [];
  const hasMultiple = images.length > 1;

  const prev = () =>
    setCurrentImg((i) => (i - 1 + images.length) % images.length);
  const next = () => setCurrentImg((i) => (i + 1) % images.length);

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
      setToast(data.saved ? "განცხადება შენახულია ❤️" : "წაიშალა შენახულიდან");
    }
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setToast("ბმული დაკოპირდა! 🔗");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOffer = () => {
    if (!user) {
      setToast("გთხოვთ გაიაროთ ავტორიზაცია 🔐");
      return;
    }
    setShowOfferModal(true);
  };

  return (
    <div className="text-gray-900">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8 font-medium flex-wrap">
        <Link href="/" className="hover:text-green-600 transition-colors">
          მთავარი
        </Link>
        <span>/</span>
        {listing.category && (
          <>
            <Link
              href={`/category/${listing.category}`}
              className="hover:text-green-600 transition-colors"
            >
              {listing.category}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-600 truncate max-w-[200px]">
          {listing.title}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* ═══ მარცხენა — სურათები ═══ */}
        <div className="space-y-3">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 group">
            {/* გაცვლილია */}
            {isExchanged && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                <div className="rotate-[-12deg] border-4 border-red-500 px-8 py-3 rounded-xl bg-red-500/20">
                  <span className="text-2xl font-black uppercase tracking-[0.2em] text-red-500">
                    გაცვლილია
                  </span>
                </div>
              </div>
            )}

            {images[currentImg] ? (
              <img
                src={images[currentImg]}
                alt={listing.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">
                📦
              </div>
            )}

            {/* VIP / SILVER */}
            {isVIP && (
              <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-400 text-yellow-900 text-xs font-black uppercase tracking-wider shadow-md z-10">
                <Crown size={12} /> VIP
              </span>
            )}
            {isSilver && !isVIP && (
              <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 text-xs font-black uppercase tracking-wider z-10">
                <Gem size={12} /> SILVER
              </span>
            )}

            {/* ნავიგაციის ისრები */}
            {hasMultiple && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 shadow-sm transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft size={18} className="text-gray-700" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 shadow-sm transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight size={18} className="text-gray-700" />
                </button>
                {/* Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {images.map((_: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImg(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === currentImg
                          ? "bg-green-600 w-4"
                          : "bg-white/70 hover:bg-white w-1.5"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {hasMultiple && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setCurrentImg(i)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    currentImg === i
                      ? "border-green-500"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
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

        {/* ═══ მარჯვენა — ინფო ═══ */}
        <div className="flex flex-col gap-5">
          {/* სათაური + მეტა */}
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                  listing.condition === "NEW"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                }`}
              >
                {listing.condition === "NEW" ? "ახალი" : "მეორადი"}
              </span>
              <span className="text-gray-300">·</span>
              <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                <Clock size={12} />
                {timeAgo(listing.createdAt)}
              </span>
              <span className="text-gray-300">·</span>
              <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                <Eye size={12} />
                {listing.views || 0} ნახვა
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-gray-900 mb-3 leading-snug">
              {listing.title}
            </h1>

            <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
              <MapPin size={14} className="text-red-400 shrink-0" />
              {listing.city}
            </div>
          </div>
          {/* აღწერა */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <h3 className="font-bold text-sm text-gray-900 mb-3">აღწერა</h3>
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed text-sm">
              {listing.description}
            </p>
          </div>

          {/* გამოცვლა მინდა */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2 mb-3">
              <RefreshCw size={14} className="text-green-600" />
              რაში გავცვლი:
            </h3>

            {listing.wantedType === "service" && listing.serviceWanted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                🛠️ {listing.serviceWanted}
              </span>
            ) : listing.wantedItems?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {listing.wantedItems.map((item: string, i: number) => (
                  <span
                    key={i}
                    className={`px-3 py-1.5 rounded-xl text-sm font-bold border ${
                      i === 0
                        ? "bg-green-50 text-green-700 border-green-200"
                        : i === 1
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                    }`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-400 text-sm italic">
                მითითებული არ არის
              </span>
            )}
          </div>

          {/* მფლობელი */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full border-2 border-gray-200 bg-white overflow-hidden shrink-0 flex items-center justify-center">
                  {owner?.avatar ? (
                    <img
                      src={owner.avatar}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <User size={20} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    @
                    {owner?.username ||
                      owner?.name?.split(" ")[0]?.toLowerCase() ||
                      "user"}
                  </p>
                  <p className="text-xs text-gray-400">მომხმარებელი</p>
                </div>
              </div>

              {!isOwner && !isExchanged && (
                <button
                  onClick={handleOffer}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                  <MessageCircle size={15} /> შეთავაზება
                </button>
              )}
            </div>
          </div>

          {/* ღილაკები */}
          <div className="flex gap-3 mt-auto">
            <button
              onClick={handleSave}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                isSaved
                  ? "bg-red-50 text-red-600 border-red-300 hover:bg-red-100"
                  : "bg-white text-gray-700 border-gray-300 hover:border-green-500 hover:text-green-600"
              }`}
            >
              <Heart
                size={16}
                className={isSaved ? "fill-red-500 text-red-500" : ""}
              />
              {isSaved ? "შენახულია" : "შენახვა"}
            </button>

            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 transition-all"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-green-600" /> დაკოპირდა
                </>
              ) : (
                <>
                  <Share2 size={16} /> გაზიარება
                </>
              )}
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
