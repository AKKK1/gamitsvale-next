"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Plus,
  LogOut,
  Menu,
  ChevronDown,
  X,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CATEGORIES, useAuth, GEORGIAN_CITIES, cn } from "./AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header({
  onAddListing,
  onSearch,
}: {
  onAddListing: () => void;
  onSearch?: (query: string, type: string, filters?: any) => void;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [searchType, setSearchType] = useState<"want" | "give" | "service">(
    "want",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [settings, setSettings] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState<
    "login" | "register" | null
  >(null);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    city: "",
    category: "",
    condition: "",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings);
  }, []);

  useEffect(() => {
    if (user) {
      fetch("/api/notifications")
        .then((r) => r.json())
        .then(setNotifications);
    }
  }, [user]);

  const handleSearch = () => {
    if (onSearch) onSearch(searchQuery, searchType, filters);
    setShowFilters(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleOfferAction = async (id: string, status: string) => {
    const res = await fetch(`/api/offers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      fetch("/api/notifications")
        .then((r) => r.json())
        .then(setNotifications);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-dark/80 backdrop-blur-xl border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-8">
        {/* Logo & Categories */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-2xl font-black tracking-tighter text-white flex items-center gap-1 shrink-0"
          >
            {/* ლოგო(ს) ზედმეტია რომ ხელით არ შეცვლილიყო */}
            {settings?.logos ? (
              <img
                src={settings.logo}
                alt={settings.siteName}
                className="h-8 object-contain"
              />
            ) : (
              <>
                GAMITSVALE<span className="text-gold">.GE</span>
              </>
            )}
          </Link>

          <div className="relative">
            <button
              onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-dark-card border border-dark-border rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-gold hover:border-gold/30 transition-all"
            >
              <Menu size={16} />
              <span className="hidden md:inline">კატეგორიები</span>
              <ChevronDown
                size={14}
                className={cn(
                  "transition-transform",
                  showCategoriesDropdown && "rotate-180",
                )}
              />
            </button>
            <AnimatePresence>
              {showCategoriesDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 w-64 bg-dark-card border border-dark-border rounded-2xl shadow-2xl p-2 z-[60]"
                >
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.id}`}
                      onClick={() => setShowCategoriesDropdown(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-zinc-400 hover:text-gold hover:bg-gold/5 transition-all"
                    >
                      <span className="text-lg">{cat.icon}</span>
                      {cat.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* <Link
          href="/rules"
          className="relative p-2.5 text-white hover:text-gold transition-colors"
        >
          წესები
        </Link> */}

        {/* Search */}
        <div className="flex-1 max-w-xl hidden lg:flex items-center bg-dark-card rounded-2xl border border-dark-border p-1 relative">
          <div className="flex items-center gap-1 px-2 border-r border-dark-border">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-zinc-400 outline-none px-2 cursor-pointer"
            >
              <option value="want">მინდა</option>
              <option value="give">გინდა</option>
              <option value="service">საქმე</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="ძიება..."
            className="flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-zinc-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "p-2 transition-colors",
              showFilters ? "text-gold" : "text-zinc-400 hover:text-gold",
            )}
          >
            <Filter size={18} />
          </button>
          <button
            onClick={handleSearch}
            className="p-2 text-zinc-400 hover:text-gold transition-colors"
          >
            <Search size={18} />
          </button>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-full bg-dark-card border border-dark-border rounded-2xl shadow-2xl p-4 z-[60]"
              >
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      ქალაქი
                    </label>
                    <select
                      value={filters.city}
                      onChange={(e) =>
                        setFilters({ ...filters, city: e.target.value })
                      }
                      className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-gold/50"
                    >
                      <option value="">ყველა</option>
                      {GEORGIAN_CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      კატეგორია
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) =>
                        setFilters({ ...filters, category: e.target.value })
                      }
                      className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-gold/50"
                    >
                      <option value="">ყველა</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      მდგომარეობა
                    </label>
                    <select
                      value={filters.condition}
                      onChange={(e) =>
                        setFilters({ ...filters, condition: e.target.value })
                      }
                      className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-gold/50"
                    >
                      <option value="">ყველა</option>
                      <option value="NEW">ახალი</option>
                      <option value="USED">მეორადი</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleSearch}
                  className="w-full mt-4 bg-gold text-dark font-black uppercase tracking-widest text-xs py-2 rounded-lg hover:bg-gold-hover transition-colors"
                >
                  ძებნა
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="relative">
                <button
                  onClick={async () => {
                    setShowNotifications(!showNotifications);
                    if (
                      !showNotifications &&
                      notifications.some((n) => !n.isRead)
                    ) {
                      await fetch("/api/notifications/read", {
                        method: "POST",
                      });
                      setNotifications(
                        notifications.map((n) => ({ ...n, isRead: true })),
                      );
                    }
                  }}
                  className="relative p-2.5 text-zinc-400 hover:text-gold transition-colors bg-dark-card rounded-xl border border-dark-border"
                >
                  <Bell size={20} />
                  {notifications.some((n) => !n.isRead) && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-gold text-dark text-[10px] font-black flex items-center justify-center rounded-full border-2 border-dark">
                      {notifications.filter((n) => !n.isRead).length}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      className="absolute top-full right-0 mt-4 w-96 bg-dark-card border border-dark-border rounded-3xl shadow-2xl p-6 overflow-hidden origin-top-right z-[60]"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                          შეტყობინებები
                        </h4>
                        <span className="text-[10px] font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                          ახალი
                        </span>
                      </div>
                      <div className="space-y-4 max-h-96 overflow-y-auto no-scrollbar">
                        {notifications.length === 0 && (
                          <p className="text-xs text-zinc-500 text-center py-4">
                            შეტყობინება არ არის
                          </p>
                        )}
                        {notifications.map((n) => (
                          <div
                            key={n._id}
                            className="p-4 rounded-2xl bg-dark/40 border border-dark-border hover:border-gold/30 transition-all"
                          >
                            <div className="flex gap-4">
                              <img
                                src={
                                  n.offer?.sender?.avatar ||
                                  "https://www.gravatar.com/avatar?d=mp"
                                }
                                className="w-10 h-10 rounded-full border border-dark-border"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-xs font-bold text-white">
                                    {n.offer?.sender?.name || "მომხმარებელი"}
                                  </p>
                                </div>
                                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                                  {n.type === "NEW_OFFER"
                                    ? `შემოგთავაზათ: ${n.offer?.description}`
                                    : "თქვენი შეთავაზება განახლდა"}
                                </p>
                                {n.type === "NEW_OFFER" &&
                                  n.offer?.status === "PENDING" && (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() =>
                                          handleOfferAction(
                                            n.offer._id,
                                            "ACCEPTED",
                                          )
                                        }
                                        className="flex-1 py-2 bg-green-600/20 text-green-500 text-[9px] font-black rounded-lg hover:bg-green-600 hover:text-white transition-all border border-green-600/30"
                                      >
                                        თანხმობა
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleOfferAction(
                                            n.offer._id,
                                            "THINKING",
                                          )
                                        }
                                        className="flex-1 py-2 bg-zinc-800 text-zinc-400 text-[9px] font-black rounded-lg hover:bg-zinc-700 transition-all border border-zinc-700"
                                      >
                                        დაფიქრება
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleOfferAction(
                                            n.offer._id,
                                            "DECLINED",
                                          )
                                        }
                                        className="flex-1 py-2 bg-red-600/20 text-red-500 text-[9px] font-black rounded-lg hover:bg-red-600 hover:text-white transition-all border border-red-600/30"
                                      >
                                        უარი
                                      </button>
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setShowNotifications(false)}
                        className="block w-full mt-6 py-3 text-[10px] font-black uppercase tracking-widest text-gold hover:text-white transition-colors border-t border-dark-border text-center"
                      >
                        ყველას ნახვა
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={onAddListing}
                className="bg-gold hover:bg-gold-hover text-dark px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-gold/10"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">განცხადება</span>
              </button>

              <Link
                href="/profile"
                className="flex items-center p-1 rounded-xl border border-dark-border hover:border-gold/50 transition-all bg-dark-card"
              >
                <img
                  src={user.avatar || "https://www.gravatar.com/avatar?d=mp"}
                  className="w-9 h-9 rounded-lg object-cover border border-dark-border"
                  referrerPolicy="no-referrer"
                />
              </Link>

              <button
                onClick={handleLogout}
                className="p-2.5 text-zinc-500 hover:text-red-500 transition-colors bg-dark-card rounded-xl border border-dark-border"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAuthModal("login")}
                className="hidden sm:block rounded-lg border border-dark-border px-4 py-2 text-sm text-zinc-400 hover:border-gold hover:text-gold transition-colors"
              >
                შესვლა
              </button>
              <button
                onClick={() => setShowAuthModal("register")}
                className="bg-gold text-dark px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gold-hover transition-all"
              >
                რეგისტრაცია
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAuthModal && (
          <AuthModal
            type={showAuthModal}
            onClose={() => setShowAuthModal(null)}
          />
        )}
      </AnimatePresence>
    </header>
  );
}

function AuthModal({
  type,
  onClose,
}: {
  type: "login" | "register";
  onClose: () => void;
}) {
  const { login, register, verify, loginWithGoogle } = useAuth();
  const [step, setStep] = useState<"form" | "verify" | "forgot" | "reset">(
    "form",
  );
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    code: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (type === "login") {
      if (step === "forgot") {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        });
        if (res.ok) setStep("reset");
        else setError("ვერ მოხერხდა კოდის გაგზავნა");
      } else if (step === "reset") {
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            code: formData.code,
            newPassword: formData.newPassword,
          }),
        });
        if (res.ok) {
          alert("პაროლი შეიცვალა!");
          setStep("form");
        } else setError("პაროლის შეცვლა ვერ მოხერხდა");
      } else {
        const res = await login(formData.email, formData.password);
        if (res.success) onClose();
        else setError(res.error || "ავტორიზაცია ვერ მოხერხდა");
      }
    } else {
      if (step === "form") {
        const res = await register(
          formData.email,
          formData.name,
          formData.password,
        );
        if (res.success) setStep("verify");
        else setError(res.error || "რეგისტრაცია ვერ მოხერხდა");
      } else {
        const res = await verify(formData.email, formData.code);
        if (res.success) onClose();
        else setError(res.error || "ვერიფიკაცია ვერ მოხერხდა");
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-100 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-md bg-dark-card border border-dark-border rounded-3xl p-8 shadow-2xl z-10"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-zinc-500 hover:text-white rounded-full transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-black mb-8 text-center text-white">
          {step === "forgot"
            ? "პაროლის აღდგენა"
            : step === "reset"
              ? "ახალი პაროლი"
              : type === "login"
                ? "შესვლა"
                : "რეგისტრაცია"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "register" && step === "form" && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                სახელი
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 bg-dark border border-dark-border rounded-xl outline-none focus:border-gold transition-colors text-sm text-white"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          )}

          {(step === "form" || step === "forgot") && (
            <>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                  Email
                </label>
                <input
                  required
                  type="email"
                  className="w-full px-4 py-3 bg-dark border border-dark-border rounded-xl outline-none focus:border-gold transition-colors text-sm text-white"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              {step === "form" && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      პაროლი
                    </label>
                    {type === "login" && (
                      <button
                        type="button"
                        onClick={() => setStep("forgot")}
                        className="text-[10px] font-bold text-gold hover:underline"
                      >
                        დაგავიწყდათ პაროლი?
                      </button>
                    )}
                  </div>
                  <input
                    required
                    type="password"
                    minLength={6}
                    className="w-full px-4 py-3 bg-dark border border-dark-border rounded-xl outline-none focus:border-gold transition-colors text-sm text-white"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              )}
            </>
          )}

          {step === "reset" && (
            <>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                  აღდგენის კოდი
                </label>
                <input
                  required
                  type="text"
                  maxLength={6}
                  className="w-full px-4 py-3 bg-dark border border-dark-border rounded-xl outline-none focus:border-gold transition-colors text-center text-2xl tracking-[10px] text-white"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                  ახალი პაროლი
                </label>
                <input
                  required
                  type="password"
                  minLength={6}
                  className="w-full px-4 py-3 bg-dark border border-dark-border rounded-xl outline-none focus:border-gold transition-colors text-sm text-white"
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                />
              </div>
            </>
          )}

          {step === "verify" && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                ვერიფიკაციის კოდი
              </label>
              <input
                required
                type="text"
                maxLength={6}
                className="w-full px-4 py-3 bg-dark border border-dark-border rounded-xl outline-none focus:border-gold transition-colors text-center text-2xl tracking-[10px] text-white"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
              />
              <p className="text-[10px] text-zinc-500 text-center mt-2">
                კოდი გამოგზავნილია თქვენს მაილზე
              </p>
            </div>
          )}

          {error && (
            <p className="text-xs text-red-500 text-center font-bold">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="w-full bg-gold text-dark py-3.5 rounded-xl text-sm font-bold hover:bg-gold-hover transition-all disabled:opacity-50 mt-2"
          >
            {loading
              ? "გთხოვთ დაელოდოთ..."
              : step === "forgot"
                ? "კოდის გაგზავნა"
                : step === "reset"
                  ? "პაროლის შეცვლა"
                  : step === "verify"
                    ? "ვერიფიკაცია"
                    : type === "login"
                      ? "შესვლა"
                      : "რეგისტრაცია"}
          </button>

          {(step === "forgot" || step === "reset") && (
            <button
              type="button"
              onClick={() => setStep("form")}
              className="w-full text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-gold transition-colors text-center mt-4"
            >
              უკან დაბრუნება
            </button>
          )}
        </form>

        {step === "form" && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-border"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                <span className="bg-dark-card px-4 text-zinc-500">ან</span>
              </div>
            </div>
            <button
              onClick={() => {
                loginWithGoogle();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-3 py-3.5 border border-dark-border bg-dark rounded-xl text-sm font-bold text-white hover:border-gold/30 transition-all"
            >
              <img
                src="https://www.google.com/favicon.ico"
                className="w-4 h-4"
              />{" "}
              Google-ით შესვლა
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
