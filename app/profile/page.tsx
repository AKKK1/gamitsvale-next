"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/AuthProvider";
import Header from "@/components/Header";
import AddListingModal from "@/components/AddListingModal";
import ListingCard from "@/components/ListingCard";
import { motion, AnimatePresence } from "motion/react";
import { FaWhatsapp } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa";

import {
  User as UserIcon,
  Package,
  Bell,
  Clock,
  Phone,
  Instagram,
  Facebook,
  Trash2,
  Plus,
  LogOut,
  Globe,
  Image as ImageIcon,
  MapPin,
  Mail,
  PenLine,
  Wallet,
  Shield,
  ChevronRight,
  CircleCheck,
  CircleX,
  Camera,
  Bookmark,
  X,
  Copy,
  Check,
  AtSign,
  InstagramIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import Link from "next/link";
import Footer from "../footer/page";

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

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, refresh } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "offers" | "listings" | "saved" | "settings" | "admin_users"
  >("offers");
  const [offerFilter, setOfferFilter] = useState<"PENDING" | "ACCEPTED">(
    "PENDING",
  );
  const [offers, setOffers] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [savedListings, setSavedListings] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingListing, setEditingListing] = useState<any>(null);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    listingId: string | null;
  }>({ isOpen: false, listingId: null });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) fetchData();
    if (user?.role === "ADMIN") {
      fetch("/api/settings")
        .then((r) => r.json())
        .then(setSiteSettings)
        .catch(() => {});
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "offers") {
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
      } else if (activeTab === "listings") {
        const res = await fetch("/api/listings?owner=" + user._id);
        setListings(await res.json());
      } else if (activeTab === "saved") {
        const res = await fetch("/api/listings/saved");
        setSavedListings(await res.json());
      } else if (activeTab === "admin_users" && user?.role === "ADMIN") {
        const res = await fetch("/api/admin/users");
        setAdminUsers(await res.json());
      }
    } catch {}
    setLoading(false);
  };

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleUpdateUser = async (id: string, updates: any) => {
    const res = await fetch(`/api/admin/users/${id}/balance`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: updates.balance }),
    });
    if (res.ok) fetchData();
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("ნამდვილად გსურთ მომხმარებლის წაშლა?")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) fetchData();
  };

  const confirmDeleteListing = async () => {
    if (!deleteConfirmation.listingId) return;
    const res = await fetch(`/api/listings/${deleteConfirmation.listingId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchData();
      setDeleteConfirmation({ isOpen: false, listingId: null });
    }
  };

  const handleRoleChange = async (id: string, role: string) => {
    const res = await fetch(`/api/admin/users/${id}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) fetchData();
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const avatar = event.target?.result as string;
      const res = await fetch("/api/profile/avatar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar }),
      });
      if (res.ok) refresh();
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const logo = event.target?.result as string;
      setSiteSettings({ ...siteSettings, logo });
    };
    reader.readAsDataURL(file);
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
          colors: [C.green, "#ffffff", C.gold],
        });
      }
      fetchData();
    }
  };

  if (!user)
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

  const dailyLimit = 3;

  // ── helper styles ──
  const inp = {
    background: C.bg2,
    border: `1px solid ${C.border}`,
    color: C.text,
    fontFamily: "'Space Grotesk', sans-serif",
    outline: "none",
    width: "100%",
    padding: "10px 16px",
    borderRadius: 10,
    fontSize: 14,
  } as React.CSSProperties;

  const navBtnBase =
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all cursor-pointer w-full text-left";

  //ვათსაპზე და ტელეგრამზე გადასასვლელი

  const openChat = (type: "whatsapp" | "telegram", value: string) => {
    if (!value) return;

    let url = "";
    if (type === "whatsapp") {
      // აშორებს ყველაფერს ციფრების გარდა
      const cleanNumber = value.replace(/\D/g, "");
      url = `https://wa.me/${cleanNumber}`;
    } else {
      // აშორებს @ სიმბოლოს თუ არსებობს
      const cleanUser = value.replace("@", "");
      url = `https://t.me/${cleanUser}`;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: C.bg,
        color: C.text,
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <Header onAddListing={() => setShowAddModal(true)} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* breadcrumb */}
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
          <span style={{ color: C.text, fontWeight: 600 }}>პროფილი</span>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-[300px_1fr]">
          {/* ════ SIDEBAR ════ */}
          <div className="space-y-4">
            {/* Profile Card */}
            <div
              className="rounded-xl p-5"
              style={{ background: C.bg2, border: `1px solid ${C.border}` }}
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="relative group">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold overflow-hidden"
                    style={{
                      border: `2px solid ${C.border}`,
                      background: C.bg3,
                      color: C.green,
                    }}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      user.name?.charAt(0) || "U"
                    )}
                  </div>
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: C.green,
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <Camera size={11} />
                  </button>
                  <input
                    type="file"
                    ref={avatarInputRef}
                    onChange={handleAvatarUpload}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h2
                    className="truncate text-base font-bold"
                    style={{ color: C.text }}
                  >
                    {user.name}
                  </h2>
                  <p className="text-xs" style={{ color: C.text3 }}>
                    @
                    {user.username ||
                      user.name?.split(" ")[0]?.toLowerCase() ||
                      "user"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { icon: <Mail size={14} />, val: user.email },
                  user.phone && { icon: <Phone size={14} />, val: user.phone },
                  user.whatsapp && {
                    icon: <FaWhatsapp />,
                    val: user.whatsapp.split("/").pop(),
                  },
                  user.telegram && {
                    icon: <FaTelegram size={14} />,
                    val: user.telegram.split("/").pop(),
                  },
                ]
                  .filter(Boolean)
                  .map((item: any, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 text-sm"
                      style={{ color: C.text2 }}
                    >
                      <span style={{ color: C.green, opacity: 0.7 }}>
                        {item.icon}
                      </span>
                      <span className="truncate text-xs">{item.val}</span>
                    </div>
                  ))}
              </div>

              <button
                onClick={() => setActiveTab("settings")}
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-all"
                style={{
                  border: `1px solid ${C.border}`,
                  color: C.text2,
                  background: "transparent",
                  cursor: "pointer",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                <PenLine size={13} /> პროფილის რედაქტირება
              </button>
            </div>

            {/* Balance */}
            <div
              className="rounded-xl p-5"
              style={{ background: C.bg2, border: `1px solid ${C.border}` }}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet size={15} style={{ color: C.gold }} />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: C.text }}
                  >
                    ბალანსი
                  </span>
                </div>
                <span className="text-lg font-bold" style={{ color: C.gold }}>
                  {user.balance} ₾
                </span>
              </div>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-all"
                style={{
                  background: C.gold,
                  cursor: "pointer",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                შევსება
              </button>
            </div>

            {/* Nav */}
            <div
              className="flex flex-col gap-1 rounded-xl p-2"
              style={{ background: C.bg2, border: `1px solid ${C.border}` }}
            >
              {[
                {
                  id: "offers",
                  icon: <Bell size={15} />,
                  label: "შეთავაზებები",
                  badge: offers.filter((o) => o.status === "PENDING").length,
                },
                {
                  id: "listings",
                  icon: <Package size={15} />,
                  label: "ჩემი განცხადებები",
                },
                {
                  id: "saved",
                  icon: <Bookmark size={15} />,
                  label: "შენახული",
                },
                {
                  id: "settings",
                  icon: <Shield size={15} />,
                  label: "პარამეტრები",
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={navBtnBase}
                  style={{
                    background:
                      activeTab === tab.id ? C.greenLight : "transparent",
                    color: activeTab === tab.id ? C.green : C.text2,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: activeTab === tab.id ? 600 : 400,
                  }}
                >
                  {tab.icon}
                  <span className="flex-1">{tab.label}</span>
                  {tab.badge ? (
                    <span
                      className="flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold"
                      style={{ background: C.greenLight, color: C.green }}
                    >
                      {tab.badge}
                    </span>
                  ) : null}
                  <ChevronRight size={13} style={{ color: C.text3 }} />
                </button>
              ))}

              {user.role === "ADMIN" && (
                <button
                  onClick={() => setActiveTab("admin_users")}
                  className={navBtnBase}
                  style={{
                    background:
                      activeTab === "admin_users"
                        ? C.greenLight
                        : "transparent",
                    color: activeTab === "admin_users" ? C.green : C.text2,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: activeTab === "admin_users" ? 600 : 400,
                  }}
                >
                  <UserIcon size={15} />
                  <span className="flex-1">ადმინ პანელი</span>
                  <ChevronRight size={13} style={{ color: C.text3 }} />
                </button>
              )}

              <div
                className="h-px mx-2 my-1"
                style={{ background: C.border }}
              />

              <button
                onClick={async () => {
                  await logout();
                }}
                className={navBtnBase}
                style={{
                  color: "#ef4444",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                <LogOut size={15} />
                <span className="flex-1">გასვლა</span>
              </button>
            </div>

            {/* Daily limit */}
            <div
              className="rounded-xl p-5"
              style={{ background: C.bg2, border: `1px solid ${C.border}` }}
            >
              <div
                className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest mb-1"
                style={{ color: C.text3 }}
              >
                <span>დღიური ლიმიტი</span>
                <span
                  style={{
                    color:
                      user.dailyPostCount >= dailyLimit ? "#ef4444" : C.text,
                  }}
                >
                  {user.dailyPostCount}/{dailyLimit}
                </span>
              </div>
              <p className="text-[9px] mb-3" style={{ color: C.text3 }}>
                მხოლოდ უფასო განცხადებები
              </p>
              <div
                className="w-full h-1.5 rounded-full overflow-hidden"
                style={{ background: C.bg3 }}
              >
                <div
                  className="h-full transition-all duration-500 rounded-full"
                  style={{
                    width: `${Math.min((user.dailyPostCount / dailyLimit) * 100, 100)}%`,
                    background:
                      user.dailyPostCount >= dailyLimit ? "#ef4444" : C.green,
                  }}
                />
              </div>
              {user.dailyPostCount >= dailyLimit && (
                <p
                  className="text-[10px] font-bold mt-2 text-center"
                  style={{ color: "#ef4444" }}
                >
                  დღიური ლიმიტი ამოწურულია
                </p>
              )}
            </div>
          </div>

          {/* ════ CONTENT ════ */}
          <div className="min-h-[600px]">
            <AnimatePresence mode="wait">
              {/* ── OFFERS ── */}
              {activeTab === "offers" && (
                <motion.div
                  key="offers"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-bold" style={{ color: C.text }}>
                    შეთავაზებები
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      {
                        id: "PENDING",
                        label: "მოლოდინში",
                        icon: <Clock size={13} />,
                        count: offers.filter(
                          (o) =>
                            o.status === "PENDING" || o.status === "THINKING",
                        ).length,
                      },
                      {
                        id: "ACCEPTED",
                        label: "დათანხმებული",
                        icon: <CircleCheck size={13} />,
                        count: offers.filter((o) => o.status === "ACCEPTED")
                          .length,
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
                              offerFilter === f.id
                                ? "rgba(255,255,255,0.25)"
                                : C.bg3,
                            color: offerFilter === f.id ? "#fff" : C.text3,
                          }}
                        >
                          {f.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {offers
                      .filter(
                        (o) =>
                          o.status === offerFilter ||
                          (offerFilter === "PENDING" &&
                            o.status === "THINKING"),
                      )
                      .map((offer) => {
                        const otherParty =
                          offer.type === "received"
                            ? offer.sender
                            : offer.receiver;
                        const isIncoming = offer.type === "received";
                        return (
                          <div
                            key={offer._id}
                            className="rounded-xl p-4 transition-all"
                            style={{
                              background: C.bg2,
                              border: `1px solid ${C.border}`,
                            }}
                          >
                            {/* header */}
                            <div className="mb-3 flex items-start justify-between">
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
                                      className="text-sm font-semibold"
                                      style={{ color: C.text }}
                                    >
                                      {otherParty?.name || "უცნობი"}
                                    </p>
                                    <span
                                      className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider"
                                      style={{
                                        background: isIncoming
                                          ? C.greenLight
                                          : C.bg3,
                                        color: isIncoming ? C.green : C.text3,
                                      }}
                                    >
                                      {isIncoming ? "შემოსული" : "გაგზავნილი"}
                                    </span>
                                  </div>
                                  <p
                                    className="text-xs"
                                    style={{ color: C.text3 }}
                                  >
                                    {new Date(
                                      offer.createdAt,
                                    ).toLocaleDateString("ka-GE")}
                                  </p>
                                </div>
                              </div>
                              <Link
                                href={`/listing/${offer.listing?._id}`}
                                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 shrink-0"
                                style={{
                                  background: C.bg3,
                                  border: `1px solid ${C.border}`,
                                  textDecoration: "none",
                                }}
                              >
                                <span className="text-sm">📦</span>
                                <span
                                  className="max-w-[120px] truncate text-xs font-medium"
                                  style={{ color: C.text }}
                                >
                                  {offer.listing?.title || "ნივთი"}
                                </span>
                              </Link>
                            </div>

                            {/* desc */}
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

                            {/* images */}
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

                            {/* contact */}
                            {/* contact */}
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {/* Phone - რჩება კოპირებაზე */}
                                  {otherParty?.phone && (
                                    <button
                                      key={`${offer._id}-phone`}
                                      onClick={() =>
                                        handleCopy(
                                          `${offer._id}-phone`,
                                          otherParty.phone,
                                        )
                                      }
                                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all text-left w-full"
                                      style={{
                                        background: "rgba(255,255,255,0.6)",
                                        border: `1px solid rgba(26,138,74,0.15)`,
                                        cursor: "pointer",
                                      }}
                                    >
                                      <span style={{ color: C.green }}>
                                        <Phone size={12} />
                                      </span>
                                      <span
                                        className="text-xs flex-1 truncate"
                                        style={{ color: C.text }}
                                      >
                                        {copiedKey === `${offer._id}-phone`
                                          ? "დაკოპირდა!"
                                          : otherParty.phone}
                                      </span>
                                    </button>
                                  )}

                                  {/* Telegram - გადადის ჩატში */}
                                  {otherParty?.telegram && (
                                    <button
                                      key={`${offer._id}-telegram`}
                                      onClick={() =>
                                        openChat(
                                          "telegram",
                                          otherParty.telegram,
                                        )
                                      }
                                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all text-left w-full text-white shadow-sm"
                                      style={{
                                        background: "#50a5cf",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <FaTelegram size={14} />
                                      <span className="text-xs font-semibold">
                                        {otherParty.telegram}
                                      </span>
                                    </button>
                                  )}

                                  {/* WhatsApp - გადადის ჩატში */}
                                  {otherParty?.whatsapp && (
                                    <button
                                      key={`${offer._id}-whatsapp`}
                                      onClick={() =>
                                        openChat(
                                          "whatsapp",
                                          otherParty.whatsapp,
                                        )
                                      }
                                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all text-left w-full text-white shadow-sm"
                                      style={{
                                        background: "#40cf74",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <FaWhatsapp size={14} />
                                      <span className="text-xs font-semibold">
                                        {otherParty.whatsapp}
                                      </span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* actions */}
                            {isIncoming &&
                              (offer.status === "PENDING" ||
                                offer.status === "THINKING") && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      handleOfferAction(offer._id, "ACCEPTED")
                                    }
                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold text-white"
                                    style={{
                                      background: C.green,
                                      cursor: "pointer",
                                      fontFamily: "'Space Grotesk', sans-serif",
                                    }}
                                  >
                                    <CircleCheck size={13} /> თანხმობა
                                  </button>
                                  {offer.status === "PENDING" && (
                                    <button
                                      onClick={() =>
                                        handleOfferAction(offer._id, "THINKING")
                                      }
                                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-medium"
                                      style={{
                                        background: C.bg3,
                                        border: `1px solid ${C.border}`,
                                        color: C.text2,
                                        cursor: "pointer",
                                        fontFamily:
                                          "'Space Grotesk', sans-serif",
                                      }}
                                    >
                                      <Clock size={13} /> დაფიქრება
                                    </button>
                                  )}
                                  <button
                                    onClick={() =>
                                      handleOfferAction(offer._id, "DECLINED")
                                    }
                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-medium"
                                    style={{
                                      background: "rgba(239,68,68,0.08)",
                                      color: "#ef4444",
                                      cursor: "pointer",
                                      fontFamily: "'Space Grotesk', sans-serif",
                                    }}
                                  >
                                    <CircleX size={13} /> უარყოფა
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
                          </div>
                        );
                      })}
                    {offers.filter(
                      (o) =>
                        o.status === offerFilter ||
                        (offerFilter === "PENDING" && o.status === "THINKING"),
                    ).length === 0 && (
                      <div
                        className="text-center py-20 rounded-xl"
                        style={{
                          border: `1px dashed ${C.border}`,
                          background: C.bg2,
                        }}
                      >
                        <p
                          className="text-sm font-medium uppercase tracking-widest"
                          style={{ color: C.text3 }}
                        >
                          შეთავაზებები არ არის
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── LISTINGS ── */}
              {activeTab === "listings" && (
                <motion.div
                  key="listings"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold" style={{ color: C.text }}>
                      ჩემი განცხადებები
                    </h3>
                    <button
                      onClick={() => {
                        setEditingListing(null);
                        setShowAddModal(true);
                      }}
                      className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold text-white transition-all"
                      style={{
                        background: C.green,
                        cursor: "pointer",
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      <Plus size={13} /> დამატება
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {listings.map((listing) => (
                      <ListingCard
                        key={listing._id}
                        listing={listing}
                        user={user}
                        onEdit={() => {
                          setEditingListing(listing);
                          setShowAddModal(true);
                        }}
                        onDelete={() =>
                          setDeleteConfirmation({
                            isOpen: true,
                            listingId: listing._id,
                          })
                        }
                      />
                    ))}
                    {listings.length === 0 && (
                      <div
                        className="col-span-full text-center py-20 rounded-xl"
                        style={{ border: `1px dashed ${C.border}` }}
                      >
                        <p
                          className="text-sm font-medium uppercase tracking-widest"
                          style={{ color: C.text3 }}
                        >
                          განცხადებები არ არის
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── SAVED ── */}
              {activeTab === "saved" && (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-bold" style={{ color: C.text }}>
                    შენახული განცხადებები
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {savedListings.map((listing) => (
                      <div
                        key={listing._id}
                        className="group relative rounded-xl overflow-hidden cursor-pointer transition-all"
                        style={{
                          background: C.bg2,
                          border: `1px solid ${C.border}`,
                        }}
                        onClick={() => router.push(`/listing/${listing._id}`)}
                      >
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={
                              listing.images[0] ||
                              "https://picsum.photos/seed/item/400/400"
                            }
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-2 right-2">
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                const res = await fetch(
                                  `/api/listings/save/${listing._id}`,
                                  { method: "POST" },
                                );
                                if (res.ok) fetchData();
                              }}
                              className="p-2 rounded-lg text-white transition-colors"
                              style={{
                                background: "rgba(239,68,68,0.85)",
                                cursor: "pointer",
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                        <div className="p-3">
                          <h4
                            className="font-bold text-sm mb-1 line-clamp-1"
                            style={{ color: C.text }}
                          >
                            {listing.title}
                          </h4>
                          <div
                            className="flex items-center gap-1 text-[11px]"
                            style={{ color: C.text3 }}
                          >
                            <MapPin size={10} style={{ color: "#ef4444" }} />{" "}
                            {listing.city}
                          </div>
                        </div>
                      </div>
                    ))}
                    {savedListings.length === 0 && (
                      <div
                        className="col-span-full text-center py-20 rounded-xl"
                        style={{ border: `1px dashed ${C.border}` }}
                      >
                        <p
                          className="text-sm font-medium uppercase tracking-widest"
                          style={{ color: C.text3 }}
                        >
                          შენახული განცხადებები არ არის
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── ADMIN ── */}
              {activeTab === "admin_users" && user.role === "ADMIN" && (
                <motion.div
                  key="admin"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-bold" style={{ color: C.text }}>
                    იუზერების კონტროლი
                  </h3>
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{
                      border: `1px solid ${C.border}`,
                      background: C.bg2,
                    }}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr
                            style={{
                              borderBottom: `1px solid ${C.border}`,
                              background: C.bg3,
                            }}
                          >
                            {["იუზერი", "ბალანსი", "როლი", "მოქმედება"].map(
                              (h) => (
                                <th
                                  key={h}
                                  className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest"
                                  style={{ color: C.text3 }}
                                >
                                  {h}
                                </th>
                              ),
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {adminUsers.map((u) => (
                            <tr
                              key={u._id}
                              style={{ borderBottom: `1px solid ${C.border}` }}
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div
                                    className="h-8 w-8 rounded-lg flex items-center justify-center overflow-hidden"
                                    style={{
                                      background: C.bg3,
                                      border: `1px solid ${C.border}`,
                                    }}
                                  >
                                    {u.avatar ? (
                                      <img
                                        src={u.avatar}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      u.name?.charAt(0)
                                    )}
                                  </div>
                                  <div>
                                    <p
                                      className="text-xs font-bold"
                                      style={{ color: C.text }}
                                    >
                                      {u.name}
                                    </p>
                                    <p
                                      className="text-[10px]"
                                      style={{ color: C.text3 }}
                                    >
                                      {u.email}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="text-xs font-bold"
                                    style={{ color: C.text }}
                                  >
                                    {u.balance} ₾
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleUpdateUser(u._id, { balance: 50 })
                                    }
                                    className="p-1 rounded-md transition-colors"
                                    style={{
                                      color: C.green,
                                      cursor: "pointer",
                                    }}
                                  >
                                    <Plus size={12} />
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <select
                                  value={u.role}
                                  onChange={(e) =>
                                    handleRoleChange(u._id, e.target.value)
                                  }
                                  className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md outline-none"
                                  style={{
                                    background: C.bg3,
                                    border: `1px solid ${C.border}`,
                                    color: C.text,
                                    fontFamily: "'Space Grotesk', sans-serif",
                                  }}
                                >
                                  <option value="USER">USER</option>
                                  <option value="ADMIN">ADMIN</option>
                                </select>
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => handleDeleteUser(u._id)}
                                  className="p-2 rounded-lg transition-all"
                                  style={{ color: C.text3, cursor: "pointer" }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── SETTINGS ── */}
              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold" style={{ color: C.text }}>
                      პარამეტრები
                    </h3>
                    {user.role === "ADMIN" && (
                      <span
                        className="px-3 py-1 text-[10px] font-bold rounded-md uppercase tracking-widest"
                        style={{
                          background: "rgba(239,68,68,0.08)",
                          color: "#ef4444",
                          border: "1px solid rgba(239,68,68,0.2)",
                        }}
                      >
                        Admin Mode
                      </span>
                    )}
                  </div>

                  {/* personal */}
                  <section
                    className="rounded-xl p-6"
                    style={{
                      background: C.bg2,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <h4
                      className="text-[10px] font-bold uppercase tracking-widest mb-6 flex items-center gap-2"
                      style={{ color: C.text3 }}
                    >
                      <UserIcon size={13} style={{ color: C.green }} /> პირადი
                      ინფორმაცია
                    </h4>
                    <form
                      className="space-y-4 max-w-md"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setSettingsError("");
                        setSettingsSuccess("");
                        const formData = new FormData(e.currentTarget);
                        const data = Object.fromEntries(formData.entries());
                        const res = await fetch("/api/profile", {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(data),
                        });
                        if (res.ok) {
                          setSettingsSuccess("პროფილი განახლდა!");
                          refresh();
                          setTimeout(() => setSettingsSuccess(""), 3000);
                        } else {
                          const err = await res.json();
                          setSettingsError(err.error || "შეცდომა");
                        }
                      }}
                    >
                      {/* username */}
                      <div className="space-y-1.5">
                        <label
                          className="text-[10px] font-bold uppercase tracking-widest ml-1"
                          style={{ color: C.text3 }}
                        >
                          Username
                        </label>
                        <div className="relative">
                          <AtSign
                            size={13}
                            className="absolute left-3 top-1/2 -translate-y-1/2"
                            style={{ color: C.text3 }}
                          />
                          <input
                            name="username"
                            defaultValue={user.username || ""}
                            type="text"
                            placeholder="username"
                            style={{ ...inp, paddingLeft: 32 }}
                          />
                        </div>
                        <p
                          className="text-[10px] ml-1"
                          style={{ color: C.text3 }}
                        >
                          ქარდზე სახელის ნაცვლად გამოჩნდება
                        </p>
                      </div>

                      {[
                        {
                          name: "phone",
                          label: "ტელეფონი",
                          placeholder: "5xx xx xx xx",
                          defaultValue: user.phone,
                        },
                        {
                          name: "whatsapp",
                          label: "whatsapp",
                          placeholder: "whatsapp ნომერი",
                          defaultValue: user.whatsapp,
                        },
                        {
                          name: "telegram",
                          label: "telegram",
                          placeholder: "telegram ნომერი",
                          defaultValue: user.telegram,
                        },
                        //  {
                        //   name: "instagram",
                        //   label: "Instagram",
                        //   placeholder: "@username",
                        //   defaultValue: user.instagram,
                        // },
                        // {
                        //   name: "facebook",
                        //   label: "Facebook",
                        //   placeholder: "facebook.com/profile",
                        //   defaultValue: user.facebook,
                        // },
                      ].map((f) => (
                        <div key={f.name} className="space-y-1.5">
                          <label
                            className="text-[10px] font-bold uppercase tracking-widest ml-1"
                            style={{ color: C.text3 }}
                          >
                            {f.label}
                          </label>
                          <input
                            name={f.name}
                            defaultValue={f.defaultValue}
                            type="text"
                            placeholder={f.placeholder}
                            style={inp}
                          />
                        </div>
                      ))}

                      {settingsError && (
                        <p
                          className="text-xs font-bold"
                          style={{ color: "#ef4444" }}
                        >
                          {settingsError}
                        </p>
                      )}
                      {settingsSuccess && (
                        <p
                          className="text-xs font-bold"
                          style={{ color: C.green }}
                        >
                          {settingsSuccess}
                        </p>
                      )}

                      <button
                        className="w-full text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                        style={{
                          background: C.green,
                          cursor: "pointer",
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}
                      >
                        ცვლილებების შენახვა
                      </button>
                    </form>
                  </section>

                  {/* admin site settings */}
                  {user.role === "ADMIN" && siteSettings && (
                    <section
                      className="rounded-xl p-6"
                      style={{
                        background: C.bg2,
                        border: `1px solid ${C.border}`,
                      }}
                    >
                      <h4
                        className="text-[10px] font-bold uppercase tracking-widest mb-6 flex items-center gap-2"
                        style={{ color: C.text3 }}
                      >
                        <Globe size={13} style={{ color: C.green }} /> საიტის
                        პარამეტრები
                      </h4>
                      <form
                        className="space-y-4 max-w-md"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          const data = {
                            ...Object.fromEntries(formData.entries()),
                            logo: siteSettings.logo,
                          };
                          const res = await fetch("/api/settings", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(data),
                          });
                          if (res.ok) alert("საიტის პარამეტრები განახლდა!");
                        }}
                      >
                        <div className="space-y-1.5">
                          <label
                            className="text-[10px] font-bold uppercase tracking-widest ml-1"
                            style={{ color: C.text3 }}
                          >
                            ლოგო
                          </label>
                          <div className="flex items-center gap-4">
                            <div
                              className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden"
                              style={{
                                background: C.bg3,
                                border: `1px solid ${C.border}`,
                              }}
                            >
                              {siteSettings.logo ? (
                                <img
                                  src={siteSettings.logo}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <ImageIcon
                                  size={22}
                                  style={{ color: C.text3 }}
                                />
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => logoInputRef.current?.click()}
                              className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all"
                              style={{
                                background: C.bg3,
                                border: `1px solid ${C.border}`,
                                color: C.text2,
                                cursor: "pointer",
                                fontFamily: "'Space Grotesk', sans-serif",
                              }}
                            >
                              შეცვლა
                            </button>
                            <input
                              type="file"
                              ref={logoInputRef}
                              onChange={handleLogoUpload}
                              className="hidden"
                              accept="image/*"
                            />
                          </div>
                        </div>
                        {[
                          {
                            name: "seoTitle",
                            label: "SEO სათაური",
                            defaultValue: siteSettings.seoTitle,
                            type: "input",
                          },
                          {
                            name: "seoDescription",
                            label: "SEO აღწერა",
                            defaultValue: siteSettings.seoDescription,
                            type: "textarea",
                          },
                        ].map((f) => (
                          <div key={f.name} className="space-y-1.5">
                            <label
                              className="text-[10px] font-bold uppercase tracking-widest ml-1"
                              style={{ color: C.text3 }}
                            >
                              {f.label}
                            </label>
                            {f.type === "textarea" ? (
                              <textarea
                                name={f.name}
                                defaultValue={f.defaultValue}
                                rows={3}
                                style={{ ...inp, resize: "none" }}
                              />
                            ) : (
                              <input
                                name={f.name}
                                defaultValue={f.defaultValue}
                                type="text"
                                style={inp}
                              />
                            )}
                          </div>
                        ))}
                        <button
                          className="w-full text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest"
                          style={{
                            background: C.green,
                            cursor: "pointer",
                            fontFamily: "'Space Grotesk', sans-serif",
                          }}
                        >
                          საიტის განახლება
                        </button>
                      </form>
                    </section>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {showAddModal && (
          <AddListingModal
            onClose={() => {
              setShowAddModal(false);
              setEditingListing(null);
            }}
            onRefresh={fetchData}
            editingListing={editingListing}
          />
        )}

        {deleteConfirmation.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                setDeleteConfirmation({ isOpen: false, listingId: null })
              }
              className="absolute inset-0"
              style={{
                background: "rgba(0,0,0,0.3)",
                backdropFilter: "blur(4px)",
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-2xl p-6 shadow-xl text-center z-10"
              style={{ background: C.bg, border: `1px solid ${C.border}` }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444" }}
              >
                <Trash2 size={26} />
              </div>
              <h3
                className="text-base font-bold mb-2"
                style={{ color: C.text }}
              >
                ნამდვილად გსურთ წაშლა?
              </h3>
              <p className="text-xs mb-6" style={{ color: C.text3 }}>
                ეს ქმედება შეუქცევადია.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setDeleteConfirmation({ isOpen: false, listingId: null })
                  }
                  className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    border: `1px solid ${C.border}`,
                    color: C.text2,
                    background: "transparent",
                    cursor: "pointer",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  გაუქმება
                </button>
                <button
                  onClick={confirmDeleteListing}
                  className="flex-1 py-3 rounded-xl text-white text-sm font-semibold transition-all"
                  style={{
                    background: "#ef4444",
                    cursor: "pointer",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  წაშლა
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showPaymentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPaymentModal(false)}
              className="absolute inset-0"
              style={{
                background: "rgba(0,0,0,0.3)",
                backdropFilter: "blur(4px)",
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md rounded-3xl p-8 shadow-2xl z-10"
              style={{ background: C.bg, border: `1px solid ${C.border}` }}
            >
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full transition-colors"
                style={{ color: C.text3, cursor: "pointer" }}
              >
                <X size={20} />
              </button>
              <div className="flex justify-center mb-6">
                <div
                  className="p-4 rounded-2xl"
                  style={{ background: "rgba(200,130,10,0.1)", color: C.gold }}
                >
                  <Wallet size={30} />
                </div>
              </div>
              <h2
                className="text-xl font-bold text-center mb-2"
                style={{ color: C.text }}
              >
                ბალანსის შევსება
              </h2>
              <p
                className="text-sm text-center mb-6"
                style={{ color: C.text2 }}
              >
                მიმდინარე ბალანსი:{" "}
                <span className="font-bold" style={{ color: C.gold }}>
                  {user.balance || 0} ₾
                </span>
              </p>
              <div
                className="rounded-xl p-4 mb-5"
                style={{ background: C.bg2, border: `1px solid ${C.border}` }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p
                      className="text-sm font-bold mb-1"
                      style={{ color: C.text }}
                    >
                      გადახდის სისტემა ჯერ არ არის ინტეგრირებული
                    </p>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: C.text2 }}
                    >
                      თანხის ჩარიცხვა შესაძლებელია საქართველოს ბანკის
                      გადარიცხვით. დანიშნულებაში მიუთითეთ თქვენი მეილი.
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() =>
                  handleCopy("bank-account", "GE33BG0000000533946610")
                }
                className="flex items-center gap-3 p-4 rounded-xl w-full transition-all text-left mb-5"
                style={{
                  background: C.bg2,
                  border: `1px solid ${C.border}`,
                  cursor: "pointer",
                }}
              >
                <span className="text-xl">🏦</span>
                <div className="flex-1">
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: C.text3 }}
                  >
                    ანგარიშის ნომერი
                  </p>
                  <p className="text-sm font-bold" style={{ color: C.gold }}>
                    GE33BG0000000533946610
                  </p>
                </div>
                {copiedKey === "bank-account" ? (
                  <Check size={16} style={{ color: C.green }} />
                ) : (
                  <Copy size={16} style={{ color: C.text3 }} />
                )}
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full text-white py-3 rounded-xl font-semibold text-sm text-center"
                style={{
                  background: C.green,
                  cursor: "pointer",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                გასაგებია
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}
