"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/AuthProvider";
import Header from "@/components/Header";
import AddListingModal from "@/components/AddListingModal";
import ListingCard from "@/components/ListingCard";
import { motion, AnimatePresence } from "motion/react";
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
} from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

export default function ProfilePage() {
  const { user, logout, refresh } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "offers" | "listings" | "saved" | "settings" | "admin_users"
  >("offers");
  const [offerFilter, setOfferFilter] = useState<
    "PENDING" | "ACCEPTED" | "DECLINED"
  >("PENDING");
  const [offers, setOffers] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [savedListings, setSavedListings] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingListing, setEditingListing] = useState<any>(null);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    listingId: string | null;
  }>({ isOpen: false, listingId: null });
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      fetchData();
      fetchStats();
    }
    if (user?.role === "ADMIN") {
      fetch("/api/settings")
        .then((r) => r.json())
        .then(setSiteSettings);
    }
  }, [user, activeTab]);

  const fetchStats = async () => {
    const res = await fetch("/api/offers/received");
    const data = await res.json();
  };

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
        const receivedWithType = received.map((o: any) => ({
          ...o,
          type: "received",
        }));
        const sentWithType = sent.map((o: any) => ({ ...o, type: "sent" }));
        setOffers(
          [...receivedWithType, ...sentWithType].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        );
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
    } catch (err) {}
    setLoading(false);
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
          colors: ["#D4AF37", "#000000", "#FFFFFF"],
        });
      }
      fetchData();
    }
  };

  if (!user)
    return (
      <div className="p-20 text-center font-bold">
        გთხოვთ გაიაროთ ავტორიზაცია
      </div>
    );

  return (
    <div className="min-h-screen bg-dark text-white">
      <Header onAddListing={() => setShowAddModal(true)} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-2 text-xs text-zinc-500">
          <Link href="/" className="hover:text-white transition-colors">
            მთავარი
          </Link>
          <ChevronRight size={12} />
          <span className="text-white font-medium">პროფილი</span>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-[320px_1fr]">
          {/* Sidebar */}
          <div className="space-y-4">
            {/* Profile Info Card */}
            <div className="rounded-xl border border-dark-border bg-dark-card p-5">
              <div className="mb-4 flex items-center gap-4">
                <div className="relative group">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dark text-2xl font-bold text-gold overflow-hidden border-2 border-dark-border group-hover:border-gold/50 transition-colors">
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
                    className="absolute -bottom-1 -right-1 p-1.5 bg-gold text-dark rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera size={12} />
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
                  <h2 className="truncate text-base font-bold text-white">
                    {user.name}
                  </h2>
                  <p className="text-xs text-zinc-500">
                    @{user.username || "user"}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm text-zinc-400">
                  <Mail className="h-4 w-4 shrink-0 text-gold/60" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2.5 text-sm text-zinc-400">
                    <Phone className="h-4 w-4 shrink-0 text-gold/60" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.instagram && (
                  <div className="flex items-center gap-2.5 text-sm text-zinc-400">
                    <Instagram className="h-4 w-4 shrink-0 text-gold/60" />
                    <span>@{user.instagram.replace("@", "")}</span>
                  </div>
                )}
                {user.facebook && (
                  <div className="flex items-center gap-2.5 text-sm text-zinc-400">
                    <Facebook className="h-4 w-4 shrink-0 text-gold/60" />
                    <span>{user.facebook.split("/").pop()}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveTab("settings")}
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dark-border py-2 text-xs font-medium text-zinc-400 hover:border-gold hover:text-gold transition-colors"
              >
                <PenLine className="h-3.5 w-3.5" /> პროფილის რედაქტირება
              </button>
            </div>

            {/* Balance Card */}
            <div className="rounded-xl border border-dark-border bg-dark-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-gold" />
                  <span className="text-sm font-semibold text-white">
                    ბალანსი
                  </span>
                </div>
                <span className="text-lg font-bold text-gold">
                  {user.balance} ₾
                </span>
              </div>
              <button
                onClick={async () => {
                  const res = await fetch("/api/profile/add-balance", {
                    method: "POST",
                  });
                  if (res.ok) refresh();
                }}
                className="w-full rounded-lg bg-gold text-dark py-2.5 text-sm font-semibold hover:bg-gold-hover transition-all"
              >
                შევსება
              </button>
            </div>

            {/* Navigation Menu */}
            <div className="flex flex-col gap-1 rounded-xl border border-dark-border bg-dark-card p-2">
              {[
                {
                  id: "offers",
                  icon: <Bell className="h-4 w-4" />,
                  label: "შეთავაზებები",
                  badge: offers.filter((o) => o.status === "PENDING").length,
                },
                {
                  id: "listings",
                  icon: <Package className="h-4 w-4" />,
                  label: "ჩემი განცხადებები",
                },
                {
                  id: "saved",
                  icon: <Bookmark className="h-4 w-4" />,
                  label: "შენახული",
                  badge: savedListings.length,
                },
                {
                  id: "settings",
                  icon: <Shield className="h-4 w-4" />,
                  label: "პარამეტრები",
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                    activeTab === tab.id
                      ? "bg-gold/10 font-semibold text-gold"
                      : "text-zinc-400 hover:bg-dark hover:text-white",
                  )}
                >
                  {tab.icon}
                  <span className="flex-1 text-left">{tab.label}</span>
                  {tab.badge ? (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gold/20 px-1.5 text-[10px] font-bold text-gold">
                      {tab.badge}
                    </span>
                  ) : null}
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
                </button>
              ))}

              {user.role === "ADMIN" && (
                <button
                  onClick={() => setActiveTab("admin_users")}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                    activeTab === "admin_users"
                      ? "bg-gold/10 font-semibold text-gold"
                      : "text-zinc-400 hover:bg-dark hover:text-white",
                  )}
                >
                  <UserIcon className="h-4 w-4" />
                  <span className="flex-1 text-left">ადმინ პანელი</span>
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
                </button>
              )}

              <div className="h-px bg-dark-border my-1 mx-2"></div>

              <button
                onClick={async () => {
                  await logout();
                }}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span className="flex-1 text-left">გასვლა</span>
              </button>
            </div>

            {/* Daily Limit */}
            <div className="rounded-xl border border-dark-border bg-dark-card p-5">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">
                <span>დღიური ლიმიტი</span>
                <span className="text-white">
                  {user.dailyPostCount <= 3
                    ? `${user.dailyPostCount}/3`
                    : "ლიმიტი შეივსო"}
                </span>
              </div>
              <div className="w-full h-1.5 bg-dark rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all",
                    user.dailyPostCount > 3 ? "bg-red-500/70" : "bg-gold",
                  )}
                  style={{
                    width: `${Math.min((user.dailyPostCount / 3) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="min-h-[600px]">
            <AnimatePresence mode="wait">
              {/* OFFERS */}
              {activeTab === "offers" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  key="offers"
                  className="space-y-4"
                >
                  <h3 className="text-lg font-bold text-white">შეთავაზებები</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      {
                        id: "PENDING",
                        label: "მოლოდინში",
                        icon: <Clock className="h-4 w-4" />,
                        count: offers.filter(
                          (o) =>
                            o.status === "PENDING" || o.status === "THINKING",
                        ).length,
                      },
                      {
                        id: "ACCEPTED",
                        label: "დათანხმებული",
                        icon: <CircleCheck className="h-4 w-4" />,
                        count: offers.filter((o) => o.status === "ACCEPTED")
                          .length,
                      },
                      {
                        id: "DECLINED",
                        label: "უარყოფილი",
                        icon: <CircleX className="h-4 w-4" />,
                        count: offers.filter((o) => o.status === "DECLINED")
                          .length,
                      },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setOfferFilter(f.id as any)}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
                          offerFilter === f.id
                            ? "bg-gold text-dark shadow-md"
                            : "text-zinc-400 hover:bg-dark-card hover:text-white",
                        )}
                      >
                        {f.icon} {f.label}
                        <span
                          className={cn(
                            "ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                            offerFilter === f.id
                              ? "bg-dark/20 text-dark"
                              : "bg-dark-card text-zinc-400",
                          )}
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
                            className="rounded-xl border border-dark-border bg-dark-card p-4 hover:border-gold/30 transition-all"
                          >
                            <div className="mb-3 flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-dark text-lg overflow-hidden border border-dark-border">
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
                                    <p className="text-sm font-semibold text-white">
                                      {otherParty?.name || "უცნობი"}
                                    </p>
                                    <span
                                      className={cn(
                                        "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider",
                                        isIncoming
                                          ? "bg-blue-500/10 text-blue-500"
                                          : "bg-purple-500/10 text-purple-500",
                                      )}
                                    >
                                      {isIncoming ? "შემოსული" : "გაგზავნილი"}
                                    </span>
                                  </div>
                                  <p className="text-xs text-zinc-500">
                                    {new Date(
                                      offer.createdAt,
                                    ).toLocaleDateString("ka-GE")}
                                  </p>
                                </div>
                              </div>
                              <Link
                                href={`/listing/${offer.listing?._id}`}
                                className="flex items-center gap-1.5 rounded-md bg-dark px-2 py-1 border border-dark-border hover:border-gold/30 transition-colors"
                              >
                                <span className="text-base">📦</span>
                                <span className="max-w-[120px] truncate text-xs text-white font-medium underline decoration-dotted underline-offset-2">
                                  {offer.listing?.title || "ნივთი"}
                                </span>
                              </Link>
                            </div>

                            <p className="mb-4 rounded-lg bg-dark/50 px-3 py-2 text-sm text-zinc-300 border border-dark-border/50">
                              {offer.description}
                            </p>

                            {offer.images?.length > 0 && (
                              <div className="flex gap-2 mb-4">
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

                            {offer.status === "ACCEPTED" && (
                              <div className="mb-4 rounded-lg bg-green-600/10 p-3 border border-green-600/20">
                                <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-2">
                                  კონტაქტი
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white">
                                  <div className="flex items-center gap-2">
                                    <Mail size={12} className="text-gold/60" />{" "}
                                    {otherParty?.email}
                                  </div>
                                  {otherParty?.phone && (
                                    <div className="flex items-center gap-2">
                                      <Phone
                                        size={12}
                                        className="text-gold/60"
                                      />{" "}
                                      {otherParty.phone}
                                    </div>
                                  )}
                                  {otherParty?.facebook && (
                                    <div className="flex items-center gap-2">
                                      <Facebook
                                        size={12}
                                        className="text-gold/60"
                                      />{" "}
                                      {otherParty.facebook}
                                    </div>
                                  )}
                                  {otherParty?.instagram && (
                                    <div className="flex items-center gap-2">
                                      <Instagram
                                        size={12}
                                        className="text-gold/60"
                                      />{" "}
                                      {otherParty.instagram}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {isIncoming &&
                              (offer.status === "PENDING" ||
                                offer.status === "THINKING") && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      handleOfferAction(offer._id, "ACCEPTED")
                                    }
                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-600/90 py-2 text-xs font-semibold text-white hover:bg-green-600 transition-all"
                                  >
                                    <CircleCheck className="h-3.5 w-3.5" />{" "}
                                    თანხმობა
                                  </button>
                                  {offer.status === "PENDING" && (
                                    <button
                                      onClick={() =>
                                        handleOfferAction(offer._id, "THINKING")
                                      }
                                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-dark-border py-2 text-xs font-medium text-zinc-400 hover:border-gold hover:text-gold transition-all"
                                    >
                                      <Clock className="h-3.5 w-3.5" />{" "}
                                      დაფიქრება
                                    </button>
                                  )}
                                  <button
                                    onClick={() =>
                                      handleOfferAction(offer._id, "DECLINED")
                                    }
                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-500/20 py-2 text-xs font-medium text-red-500 hover:bg-red-500/30 transition-all"
                                  >
                                    <CircleX className="h-3.5 w-3.5" /> უარყოფა
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
                          </div>
                        );
                      })}
                    {offers.filter(
                      (o) =>
                        o.status === offerFilter ||
                        (offerFilter === "PENDING" && o.status === "THINKING"),
                    ).length === 0 && (
                      <div className="text-center py-20 rounded-xl border border-dashed border-dark-border bg-dark-card/50">
                        <p className="text-sm text-zinc-500 font-medium uppercase tracking-widest">
                          შეთავაზებები არ არის
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* LISTINGS */}
              {activeTab === "listings" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  key="listings"
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">
                      ჩემი განცხადებები
                    </h3>
                    <button
                      onClick={() => {
                        setEditingListing(null);
                        setShowAddModal(true);
                      }}
                      className="flex items-center gap-2 rounded-lg bg-gold text-dark px-4 py-2 text-xs font-bold hover:bg-gold-hover transition-all"
                    >
                      <Plus size={14} /> დამატება
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
                      <div className="col-span-full text-center py-20 rounded-xl border border-dashed border-dark-border">
                        <p className="text-sm text-zinc-500 font-medium uppercase tracking-widest">
                          განცხადებები არ არის
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* SAVED */}
              {activeTab === "saved" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  key="saved"
                  className="space-y-4"
                >
                  <h3 className="text-lg font-bold text-white">
                    შენახული განცხადებები
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {savedListings.map((listing) => (
                      <div
                        key={listing._id}
                        className="group relative rounded-xl border border-dark-border bg-dark-card overflow-hidden hover:border-gold/30 transition-all"
                      >
                        <div className="aspect-video relative overflow-hidden bg-dark">
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
                              className="p-2 bg-red-500/90 text-white rounded-lg hover:bg-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-sm text-white mb-1 line-clamp-1">
                            {listing.title}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
                            <MapPin size={10} className="text-gold" />{" "}
                            {listing.city}
                          </div>
                        </div>
                      </div>
                    ))}
                    {savedListings.length === 0 && (
                      <div className="col-span-full text-center py-20 rounded-xl border border-dashed border-dark-border">
                        <p className="text-sm text-zinc-500 font-medium uppercase tracking-widest">
                          შენახული განცხადებები არ არის
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ADMIN USERS */}
              {activeTab === "admin_users" && user.role === "ADMIN" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  key="admin_users"
                  className="space-y-4"
                >
                  <h3 className="text-lg font-bold text-white">
                    იუზერების კონტროლი
                  </h3>
                  <div className="rounded-xl border border-dark-border bg-dark-card overflow-hidden">
                    <div className="overflow-x-auto no-scrollbar">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-dark-border bg-dark/30">
                            {["იუზერი", "ბალანსი", "როლი", "მოქმედება"].map(
                              (h) => (
                                <th
                                  key={h}
                                  className={cn(
                                    "px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-500",
                                    h === "მოქმედება" && "text-right",
                                  )}
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
                              className="border-b border-dark-border/50 hover:bg-dark/20 transition-colors"
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-lg bg-dark flex items-center justify-center overflow-hidden border border-dark-border">
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
                                    <p className="text-xs font-bold text-white">
                                      {u.name}
                                    </p>
                                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">
                                      {u.email}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-black text-white">
                                    {u.balance} ₾
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleUpdateUser(u._id, { balance: 50 })
                                    }
                                    className="p-1 text-gold hover:bg-gold/10 rounded-md transition-colors"
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
                                  className="bg-dark border border-dark-border text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md outline-none focus:border-gold text-white transition-all"
                                >
                                  <option value="USER">USER</option>
                                  <option value="ADMIN">ADMIN</option>
                                </select>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  onClick={() => handleDeleteUser(u._id)}
                                  className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
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

              {/* SETTINGS */}
              {activeTab === "settings" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  key="settings"
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">
                      პარამეტრები
                    </h3>
                    {user.role === "ADMIN" && (
                      <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-black rounded-md uppercase tracking-widest border border-red-500/20">
                        Admin Mode
                      </span>
                    )}
                  </div>

                  <section className="rounded-xl border border-dark-border bg-dark-card p-5">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                      <UserIcon size={14} className="text-gold" /> პირადი
                      ინფორმაცია
                    </h4>
                    <form
                      className="space-y-4 max-w-md"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const data = Object.fromEntries(formData.entries());
                        const res = await fetch("/api/profile", {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(data),
                        });
                        if (res.ok) {
                          alert("პროფილი განახლდა!");
                          refresh();
                        }
                      }}
                    >
                      {[
                        {
                          name: "phone",
                          label: "ტელეფონი",
                          placeholder: "5xx xx xx xx",
                          defaultValue: user.phone,
                        },
                        {
                          name: "instagram",
                          label: "Instagram",
                          placeholder: "@username",
                          defaultValue: user.instagram,
                        },
                        {
                          name: "facebook",
                          label: "Facebook",
                          placeholder: "facebook.com/profile",
                          defaultValue: user.facebook,
                        },
                      ].map((f) => (
                        <div key={f.name} className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                            {f.label}
                          </label>
                          <input
                            name={f.name}
                            defaultValue={f.defaultValue}
                            type="text"
                            placeholder={f.placeholder}
                            className="w-full px-4 py-2.5 bg-dark border border-dark-border rounded-lg outline-none focus:border-gold transition-all text-sm text-white placeholder:text-zinc-700"
                          />
                        </div>
                      ))}
                      <button className="w-full bg-gold text-dark py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gold-hover transition-all">
                        ცვლილებების შენახვა
                      </button>
                    </form>
                  </section>

                  {user.role === "ADMIN" && siteSettings && (
                    <section className="rounded-xl border border-dark-border bg-dark-card p-5">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                        <Globe size={14} className="text-gold" /> საიტის
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
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                            საიტის ლოგო
                          </label>
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-dark rounded-lg border border-dark-border flex items-center justify-center overflow-hidden">
                              {siteSettings.logo ? (
                                <img
                                  src={siteSettings.logo}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <ImageIcon
                                  className="text-zinc-700"
                                  size={24}
                                />
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => logoInputRef.current?.click()}
                              className="px-4 py-2 bg-dark border border-dark-border text-zinc-400 text-[10px] font-black uppercase tracking-widest rounded-lg hover:border-gold hover:text-gold transition-all"
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
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                              {f.label}
                            </label>
                            {f.type === "textarea" ? (
                              <textarea
                                name={f.name}
                                defaultValue={f.defaultValue}
                                rows={3}
                                className="w-full px-4 py-2.5 bg-dark border border-dark-border rounded-lg outline-none focus:border-gold transition-all text-sm text-white resize-none"
                              />
                            ) : (
                              <input
                                name={f.name}
                                defaultValue={f.defaultValue}
                                type="text"
                                className="w-full px-4 py-2.5 bg-dark border border-dark-border rounded-lg outline-none focus:border-gold transition-all text-sm text-white"
                              />
                            )}
                          </div>
                        ))}
                        <button className="w-full bg-gold text-dark py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gold-hover transition-all">
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
              className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm bg-dark-card border border-dark-border rounded-3xl p-6 shadow-2xl text-center z-10"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <Trash2 size={32} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                ნამდვილად გსურთ წაშლა?
              </h3>
              <p className="text-xs text-zinc-500 mb-6">
                ეს ქმედება შეუქცევადია.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setDeleteConfirmation({ isOpen: false, listingId: null })
                  }
                  className="flex-1 py-3 rounded-xl border border-dark-border text-xs font-bold text-zinc-400 hover:text-white hover:bg-dark transition-all"
                >
                  გაუქმება
                </button>
                <button
                  onClick={confirmDeleteListing}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-all"
                >
                  წაშლა
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
