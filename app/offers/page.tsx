"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import Header from "@/components/Header";
import { motion, AnimatePresence } from "motion/react";
import {
  Clock,
  CircleCheck,
  CircleX,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Copy,
  Check,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

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
};

export default function OffersPage() {
  const { user } = useAuth();
  const [offerFilter, setOfferFilter] = useState<"PENDING" | "ACCEPTED">(
    "PENDING",
  );
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const [receivedRes, sentRes] = await Promise.all([
        fetch("/api/offers/received"),
        fetch("/api/offers/sent"),
      ]);
      const received = await receivedRes.json();
      const sent = await sentRes.json();
      const all = [
        ...received.map((o: any) => ({ ...o, type: "received" })),
        ...sent.map((o: any) => ({ ...o, type: "sent" })),
      ].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setOffers(all);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchOffers();
  }, [user]);

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleOfferAction = async (id: string, status: string) => {
    const res = await fetch(`/api/offers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      if (status === "ACCEPTED") {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#1a8a4a", "#ffffff", "#c8820a"],
        });
      }
      fetchOffers();
    }
  };

  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: C.bg }}
      >
        <p className="text-sm font-medium" style={{ color: C.text3 }}>
          გთხოვთ გაიაროთ ავტორიზაცია
        </p>
      </div>
    );
  }

  const pendingOffers = offers.filter(
    (o) => o.status === "PENDING" || o.status === "THINKING",
  );
  const acceptedOffers = offers.filter((o) => o.status === "ACCEPTED");
  const filtered = offerFilter === "PENDING" ? pendingOffers : acceptedOffers;

  return (
    <div
      className="min-h-screen"
      style={{
        background: C.bg,
        color: C.text,
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <Header onAddListing={() => {}} />

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div
          className="mb-6 flex items-center gap-2 text-xs"
          style={{ color: C.text3 }}
        >
          <Link
            href="/"
            style={{ color: C.text3, textDecoration: "none" }}
            className="hover:underline"
          >
            მთავარი
          </Link>
          <ChevronRight size={12} />
          <span style={{ color: C.text, fontWeight: 600 }}>შეთავაზებები</span>
        </div>

        <h1 className="text-2xl font-bold mb-6" style={{ color: C.text }}>
          შეთავაზებები
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            {
              id: "PENDING",
              label: "მოლოდინში",
              icon: <Clock size={14} />,
              count: pendingOffers.length,
            },
            {
              id: "ACCEPTED",
              label: "დათანხმებული",
              icon: <CircleCheck size={14} />,
              count: acceptedOffers.length,
            },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setOfferFilter(f.id as any)}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
              style={{
                background: offerFilter === f.id ? C.green : C.bg2,
                color: offerFilter === f.id ? "#fff" : C.text2,
                border: `1px solid ${offerFilter === f.id ? C.green : C.border}`,
                cursor: "pointer",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {f.icon} {f.label}
              <span
                className="flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold"
                style={{
                  background:
                    offerFilter === f.id ? "rgba(255,255,255,0.25)" : C.bg3,
                  color: offerFilter === f.id ? "#fff" : C.text3,
                }}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl p-4 animate-pulse"
                style={{ background: C.bg2, border: `1px solid ${C.border}` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full"
                    style={{ background: C.bg3 }}
                  />
                  <div className="space-y-1.5">
                    <div
                      className="h-3 rounded w-24"
                      style={{ background: C.bg3 }}
                    />
                    <div
                      className="h-2.5 rounded w-16"
                      style={{ background: C.bg3 }}
                    />
                  </div>
                </div>
                <div
                  className="h-3 rounded w-full mb-2"
                  style={{ background: C.bg3 }}
                />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-20 rounded-xl"
            style={{ border: `1px dashed ${C.border}`, background: C.bg2 }}
          >
            <p
              className="text-sm font-medium uppercase tracking-widest"
              style={{ color: C.text3 }}
            >
              შეთავაზებები არ არის
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((offer) => {
              const otherParty =
                offer.type === "received" ? offer.sender : offer.receiver;
              const isIncoming = offer.type === "received";
              return (
                <motion.div
                  key={offer._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl p-4 transition-all"
                  style={{ background: C.bg2, border: `1px solid ${C.border}` }}
                >
                  {/* Header */}
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full text-base overflow-hidden shrink-0"
                        style={{
                          background: C.bg3,
                          border: `1px solid ${C.border}`,
                        }}
                      >
                        {otherParty?.avatar ? (
                          <img
                            src={otherParty.avatar}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          otherParty?.name?.charAt(0) || "U"
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p
                            className="text-sm font-bold"
                            style={{ color: C.text }}
                          >
                            {otherParty?.name || "უცნობი"}
                          </p>
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider"
                            style={{
                              background: isIncoming ? C.greenLight : C.bg3,
                              color: isIncoming ? C.green : C.text3,
                            }}
                          >
                            {isIncoming ? "შემოსული" : "გაგზავნილი"}
                          </span>
                        </div>
                        <p className="text-xs" style={{ color: C.text3 }}>
                          {new Date(offer.createdAt).toLocaleDateString(
                            "ka-GE",
                          )}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/listing/${offer.listing?._id}`}
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 shrink-0 transition-all"
                      style={{
                        background: C.bg3,
                        border: `1px solid ${C.border}`,
                        textDecoration: "none",
                      }}
                    >
                      <span className="text-sm">📦</span>
                      <span
                        className="max-w-[100px] truncate text-xs font-medium"
                        style={{ color: C.text }}
                      >
                        {offer.listing?.title || "ნივთი"}
                      </span>
                    </Link>
                  </div>

                  {/* Description */}
                  <p
                    className="mb-3 rounded-lg px-3 py-2.5 text-sm"
                    style={{
                      background: C.bg,
                      border: `1px solid ${C.border}`,
                      color: C.text2,
                    }}
                  >
                    {offer.description}
                  </p>

                  {/* Images */}
                  {offer.images?.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {offer.images.map((img: string, i: number) => (
                        <img
                          key={i}
                          src={img}
                          className="w-16 h-16 rounded-lg object-cover"
                          style={{ border: `1px solid ${C.border}` }}
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </div>
                  )}

                  {/* Contact — ACCEPTED */}
                  {offer.status === "ACCEPTED" && (
                    <div
                      className="mb-3 rounded-lg p-3"
                      style={{
                        background: C.greenLight,
                        border: `1px solid rgba(26,138,74,0.2)`,
                      }}
                    >
                      <p
                        className="text-[10px] font-bold uppercase tracking-widest mb-2"
                        style={{ color: C.green }}
                      >
                        კონტაქტი
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                        {[
                          {
                            key: `${offer._id}-email`,
                            icon: <Mail size={12} />,
                            value: otherParty?.email,
                          },
                          {
                            key: `${offer._id}-phone`,
                            icon: <Phone size={12} />,
                            value: otherParty?.phone,
                          },
                          {
                            key: `${offer._id}-telegram`,
                            icon: <Facebook size={12} />,
                            value: otherParty?.telegram,
                          },
                          {
                            key: `${offer._id}-whatsapp`,
                            icon: <Instagram size={12} />,
                            value: otherParty?.whatsapp,
                          },
                        ]
                          .filter((item) => item.value)
                          .map((item) => (
                            <button
                              key={item.key}
                              onClick={() => handleCopy(item.key, item.value)}
                              className="flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all text-left w-full min-h-[44px]"
                              style={{
                                background: "rgba(255,255,255,0.6)",
                                border: `1px solid rgba(26,138,74,0.15)`,
                                cursor: "pointer",
                              }}
                            >
                              <span style={{ color: C.green }}>
                                {item.icon}
                              </span>
                              <span
                                className="text-xs flex-1 truncate"
                                style={{ color: C.text }}
                              >
                                {item.value}
                              </span>
                              {copiedKey === item.key ? (
                                <Check size={12} style={{ color: C.green }} />
                              ) : (
                                <Copy size={12} style={{ color: C.text3 }} />
                              )}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {isIncoming &&
                    (offer.status === "PENDING" ||
                      offer.status === "THINKING") && (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleOfferAction(offer._id, "ACCEPTED")
                          }
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold text-white transition-all"
                          style={{
                            background: C.green,
                            cursor: "pointer",
                            fontFamily: "'Space Grotesk', sans-serif",
                          }}
                        >
                          <CircleCheck size={14} /> თანხმობა
                        </button>
                        {offer.status === "PENDING" && (
                          <button
                            onClick={() =>
                              handleOfferAction(offer._id, "THINKING")
                            }
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-medium transition-all"
                            style={{
                              background: C.bg3,
                              border: `1px solid ${C.border}`,
                              color: C.text2,
                              cursor: "pointer",
                              fontFamily: "'Space Grotesk', sans-serif",
                            }}
                          >
                            <Clock size={14} /> დაფიქრება
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleOfferAction(offer._id, "DECLINED")
                          }
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-medium transition-all"
                          style={{
                            background: "rgba(239,68,68,0.08)",
                            color: "#ef4444",
                            cursor: "pointer",
                            fontFamily: "'Space Grotesk', sans-serif",
                          }}
                        >
                          <CircleX size={14} /> უარყოფა
                        </button>
                      </div>
                    )}

                  {!isIncoming &&
                    (offer.status === "PENDING" ||
                      offer.status === "THINKING") && (
                      <div
                        className="text-center py-2 text-xs rounded-lg italic"
                        style={{ background: C.bg3, color: C.text3 }}
                      >
                        მოლოდინის რეჟიმში...
                      </div>
                    )}
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
