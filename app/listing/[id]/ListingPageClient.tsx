"use client";

// app/listing/[id]/ListingPageClient.tsx

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import Header from "@/components/Header";
import ListingDetails from "@/components/ListingDetails";
import OfferModal from "@/components/OfferModal";
import Toast from "@/components/Toast";

const C = {
  bg: "#ffffff",
  bg2: "#f8faf8",
  bg3: "#f0f4f0",
  green: "#1a8a4a",
  greenLight: "#e6f5ec",
  text: "#111111",
  text2: "#555555",
  text3: "#999999",
  border: "#e8ebe8",
  gold: "#c8820a",
  goldLight: "#fff8e6",
};

// ── რეკლამის ბლოკი ─────────────────────────────────────────────────────────
function AdSlot({ label }: { label: string }) {
  return (
    <div
      className="rounded-2xl flex flex-col items-center justify-center gap-3 p-4 text-center select-none"
      style={{
        background: C.bg2,
        border: `1px dashed ${C.border}`,
        minHeight: 280,
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
        style={{ background: C.bg3 }}
      >
        📢
      </div>
      <div>
        <p
          className="text-[10px] font-bold uppercase tracking-widest mb-1"
          style={{ color: C.text3 }}
        >
          სარეკლამო ადგილი
        </p>
        <p className="text-[11px]" style={{ color: C.text3 }}>
          {label}
        </p>
      </div>
      <a
        href="mailto:gamitsvale@gmail.com?subject=რეკლამის განთავსება"
        className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
        style={{
          background: C.greenLight,
          color: C.green,
          border: `1px solid rgba(26,138,74,0.2)`,
          textDecoration: "none",
        }}
      >
        განათავსე →
      </a>
    </div>
  );
}

interface Props {
  id: string;
  initialListing: any;
}

export default function ListingPageClient({ id, initialListing }: Props) {
  const { user } = useAuth();
  const [listing, setListing] = useState<any>(initialListing);
  const [loading, setLoading] = useState(!initialListing);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (initialListing) return;
    fetch(`/api/listings/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setListing(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, initialListing]);

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: C.bg }}>
        <Header onAddListing={() => {}} />
        <div className="max-w-6xl mx-auto px-4 py-12 animate-pulse">
          <div
            className="h-7 rounded-xl w-1/2 mb-5"
            style={{ background: C.bg3 }}
          />
          <div
            className="aspect-video rounded-2xl mb-4"
            style={{ background: C.bg2 }}
          />
          <div className="h-4 rounded-xl w-3/4" style={{ background: C.bg3 }} />
        </div>
      </div>
    );
  }

  // ── Not found ──
  if (!listing) {
    return (
      <div className="min-h-screen" style={{ background: C.bg }}>
        <Header onAddListing={() => {}} />
        <div className="text-center py-24">
          <p className="text-lg font-bold" style={{ color: C.text3 }}>
            განცხადება ვერ მოიძებნა
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: C.bg, fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <Header onAddListing={() => {}} />

      {/*
        სამ-სვეტიანი layout:
        [left ad 160px] [main content flex-1] [right ad 160px]
        მობილეზე: მარტო main, ad-ები იმალება
      */}
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex gap-6 items-start">
          {/* ── მარცხენა რეკლამა ── */}
          <aside className="hidden xl:flex flex-col gap-4 shrink-0 w-[160px] sticky top-[76px]">
            <AdSlot label="160 × 280px" />
            <AdSlot label="160 × 280px" />
          </aside>

          {/* ── მთავარი კონტენტი ── */}
          <main className="flex-1 min-w-0">
            {/* ზედა ბანერი — tablet-ზე გამოჩნდება (xl-ზე ad sidebar-ია) */}
            <div
              className="xl:hidden flex items-center justify-center rounded-2xl mb-6 gap-3"
              style={{
                background: C.bg2,
                border: `1px dashed ${C.border}`,
                height: 72,
              }}
            >
              <span className="text-lg">📢</span>
              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: C.text3 }}
                >
                  სარეკლამო ადგილი · 728×90px
                </p>
                <a
                  href="mailto:gamitsvale@gmail.com?subject=რეკლამის განთავსება"
                  className="text-[11px] font-semibold"
                  style={{ color: C.green, textDecoration: "none" }}
                >
                  განათავსე →
                </a>
              </div>
            </div>

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

          {/* ── მარჯვენა რეკლამა ── */}
          <aside className="hidden xl:flex flex-col gap-4 shrink-0 w-[160px] sticky top-[76px]">
            <AdSlot label="160 × 280px" />
            <AdSlot label="160 × 280px" />
          </aside>
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
