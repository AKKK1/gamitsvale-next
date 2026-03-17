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

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

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
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#D4AF37", "#000000", "#FFFFFF"],
        });
      }
      fetchOffers();
    }
  };

  if (!user)
    return (
      <div className="min-h-screen bg-dark text-white flex items-center justify-center">
        <p className="text-zinc-500 font-bold">გთხოვთ გაიაროთ ავტორიზაცია</p>
      </div>
    );

  const pendingOffers = offers.filter(
    (o) => o.status === "PENDING" || o.status === "THINKING",
  );
  const acceptedOffers = offers.filter((o) => o.status === "ACCEPTED");
  const filtered = offerFilter === "PENDING" ? pendingOffers : acceptedOffers;

  return (
    <div className="min-h-screen bg-dark text-white">
      <Header onAddListing={() => {}} />

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-zinc-500">
          <Link href="/" className="hover:text-white transition-colors">
            მთავარი
          </Link>
          <ChevronRight size={12} />
          <span className="text-white font-medium">შეთავაზებები</span>
        </div>

        <h1 className="text-2xl font-black mb-6">შეთავაზებები</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            {
              id: "PENDING",
              label: "მოლოდინში",
              icon: <Clock size={15} />,
              count: pendingOffers.length,
            },
            {
              id: "ACCEPTED",
              label: "დათანხმებული",
              icon: <CircleCheck size={15} />,
              count: acceptedOffers.length,
            },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setOfferFilter(f.id as any)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all",
                offerFilter === f.id
                  ? "bg-gold text-dark shadow-md"
                  : "text-zinc-400 bg-dark-card border border-dark-border hover:text-white",
              )}
            >
              {f.icon} {f.label}
              <span
                className={cn(
                  "flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-black",
                  offerFilter === f.id
                    ? "bg-dark/20 text-dark"
                    : "bg-dark text-zinc-400",
                )}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Offers List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-dark-border bg-dark-card p-4 animate-pulse"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800" />
                  <div className="space-y-1.5">
                    <div className="h-3 bg-zinc-800 rounded w-24" />
                    <div className="h-2.5 bg-zinc-800 rounded w-16" />
                  </div>
                </div>
                <div className="h-3 bg-zinc-800 rounded w-full mb-2" />
                <div className="h-3 bg-zinc-800 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 rounded-xl border border-dashed border-dark-border bg-dark-card/50">
            <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">
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
                  className="rounded-xl border border-dark-border bg-dark-card p-4 hover:border-gold/30 transition-all"
                >
                  {/* Header */}
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-dark text-lg overflow-hidden border border-dark-border shrink-0">
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
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-white">
                            {otherParty?.name || "უცნობი"}
                          </p>
                          <span
                            className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider",
                              isIncoming
                                ? "bg-blue-500/10 text-blue-400"
                                : "bg-purple-500/10 text-purple-400",
                            )}
                          >
                            {isIncoming ? "შემოსული" : "გაგზავნილი"}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500">
                          {new Date(offer.createdAt).toLocaleDateString(
                            "ka-GE",
                          )}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/listing/${offer.listing?._id}`}
                      className="flex items-center gap-1.5 rounded-lg bg-dark px-2.5 py-1.5 border border-dark-border hover:border-gold/30 transition-colors shrink-0"
                    >
                      <span className="text-sm">📦</span>
                      <span className="max-w-[100px] truncate text-xs text-white font-medium">
                        {offer.listing?.title || "ნივთი"}
                      </span>
                    </Link>
                  </div>

                  {/* Description */}
                  <p className="mb-3 rounded-lg bg-dark/50 px-3 py-2.5 text-sm text-zinc-300 border border-dark-border/50">
                    {offer.description}
                  </p>

                  {/* Images */}
                  {offer.images?.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {offer.images.map((img: string, i: number) => (
                        <img
                          key={i}
                          src={img}
                          className="w-16 h-16 rounded-lg object-cover border border-dark-border"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </div>
                  )}

                  {/* Contact — ACCEPTED */}
                  {offer.status === "ACCEPTED" && (
                    <div className="mb-3 rounded-lg bg-green-600/10 p-3 border border-green-600/20">
                      <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-2">
                        კონტაქტი
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                        {[
                          {
                            key: `${offer._id}-email`,
                            icon: (
                              <Mail
                                size={12}
                                className="text-gold/60 shrink-0"
                              />
                            ),
                            value: otherParty?.email,
                          },
                          {
                            key: `${offer._id}-phone`,
                            icon: (
                              <Phone
                                size={12}
                                className="text-gold/60 shrink-0"
                              />
                            ),
                            value: otherParty?.phone,
                          },
                          {
                            key: `${offer._id}-facebook`,
                            icon: (
                              <Facebook
                                size={12}
                                className="text-gold/60 shrink-0"
                              />
                            ),
                            value: otherParty?.facebook,
                          },
                          {
                            key: `${offer._id}-instagram`,
                            icon: (
                              <Instagram
                                size={12}
                                className="text-gold/60 shrink-0"
                              />
                            ),
                            value: otherParty?.instagram,
                          },
                        ]
                          .filter((item) => item.value)
                          .map((item) => (
                            <button
                              key={item.key}
                              onClick={() => handleCopy(item.key, item.value)}
                              className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-green-600/20 active:bg-green-600/30 transition-all text-left w-full min-h-[44px]"
                            >
                              {item.icon}
                              <span className="text-xs text-white flex-1 truncate">
                                {item.value}
                              </span>
                              <span className="shrink-0">
                                {copiedKey === item.key ? (
                                  <Check size={12} className="text-green-400" />
                                ) : (
                                  <Copy size={12} className="text-zinc-500" />
                                )}
                              </span>
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
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-600/90 py-2.5 text-xs font-bold text-white hover:bg-green-600 transition-all"
                        >
                          <CircleCheck size={14} /> თანხმობა
                        </button>
                        {offer.status === "PENDING" && (
                          <button
                            onClick={() =>
                              handleOfferAction(offer._id, "THINKING")
                            }
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-dark-border py-2.5 text-xs font-medium text-zinc-400 hover:border-gold hover:text-gold transition-all"
                          >
                            <Clock size={14} /> დაფიქრება
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleOfferAction(offer._id, "DECLINED")
                          }
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-500/20 py-2.5 text-xs font-medium text-red-500 hover:bg-red-500/30 transition-all"
                        >
                          <CircleX size={14} /> უარყოფა
                        </button>
                      </div>
                    )}

                  {!isIncoming &&
                    (offer.status === "PENDING" ||
                      offer.status === "THINKING") && (
                      <div className="text-center py-2 text-xs text-zinc-500 italic bg-dark/30 rounded-lg">
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
