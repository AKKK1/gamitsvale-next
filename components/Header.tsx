"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Bell,
  Plus,
  LogOut,
  Menu,
  ChevronDown,
  X,
  Filter,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CATEGORIES, useAuth, GEORGIAN_CITIES, cn } from "./AuthProvider";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header({
  onAddListing,
  onSearch,
}: {
  onAddListing: () => void;
  onSearch?: (query: string, type: string, filters?: any) => void;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [searchType, setSearchType] = useState<"want" | "give">("want");
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      fetch("/api/notifications")
        .then((r) => r.json())
        .then(setNotifications)
        .catch(() => {});
    }
  }, [user]);

  // ჰომ პეიჯზე დაბრუნებისას reset + refresh
  useEffect(() => {
    if (pathname === "/") {
      setSearchQuery("");
      setFilters({ city: "", category: "", condition: "" });
      setSearchType("want");
      if (onSearch) onSearch("", "want", {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = showMobileMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMobileMenu]);

  const handleSearch = useCallback(() => {
    if (onSearch) onSearch(searchQuery, searchType, filters);
    setShowFilters(false);
  }, [onSearch, searchQuery, searchType, filters]);

  const handleLogout = async () => {
    await logout();
    setShowMobileMenu(false);
  };

  const handleOfferAction = async (id: string, status: string) => {
    await fetch(`/api/offers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetch("/api/notifications")
      .then((r) => r.json())
      .then(setNotifications);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // ── pill toggle — "მინდა" / "გინდა" ──────────────────────────────────────
  const SearchToggle = ({ small = false }: { small?: boolean }) => (
    <div
      className={cn(
        "flex items-center gap-0.5 border-r border-dark-border shrink-0",
        small ? "pr-1.5 mr-1" : "pr-2 mr-1",
      )}
    >
      {(["want", "give"] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setSearchType(t)}
          className={cn(
            "rounded-lg font-black uppercase tracking-widest transition-all whitespace-nowrap",
            small ? "px-2 py-1 text-[9px]" : "px-2.5 py-1.5 text-[10px]",
            searchType === t
              ? "bg-gold text-dark shadow-sm"
              : "text-zinc-500 hover:text-zinc-300",
          )}
        >
          {t === "want" ? "მინდა" : "გინდა"}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-50 bg-dark/80 backdrop-blur-xl border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4 lg:gap-8">
          {/* ── ლოგო + კატეგორიები ── */}
          <div className="flex items-center gap-4 lg:gap-6 shrink-0">
            <Link
              href="/"
              onClick={() => {
                setSearchQuery("");
                setFilters({ city: "", category: "", condition: "" });
                setSearchType("want");
                if (onSearch) onSearch("", "want", {});
              }}
              className="text-2xl font-black tracking-tighter text-white flex items-center gap-1"
            >
              {/* logos davamate */}
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

            {/* კატეგორიები — desktop only */}
            <div className="relative hidden lg:block">
              <button
                onClick={() =>
                  setShowCategoriesDropdown(!showCategoriesDropdown)
                }
                className="flex items-center gap-2 px-4 py-2 bg-dark-card border border-dark-border rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-gold hover:border-gold/30 transition-all"
              >
                <Menu size={16} />
                <span>კატეგორიები</span>
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

          {/* ── საძიებო — desktop only ── */}
          <div className="flex-1 max-w-xl hidden lg:flex items-center bg-dark-card rounded-2xl border border-dark-border p-1 relative">
            <SearchToggle />
            <input
              type="text"
              placeholder={
                searchType === "want"
                  ? "განცხადების სახელი..."
                  : "რა გინდა გაცვლაში..."
              }
              className="flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-zinc-600 min-w-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "p-2 shrink-0 transition-colors",
                showFilters ? "text-gold" : "text-zinc-400 hover:text-gold",
              )}
            >
              <Filter size={18} />
            </button>
            <button
              onClick={handleSearch}
              className="p-2 shrink-0 text-zinc-400 hover:text-gold transition-colors"
            >
              <Search size={18} />
            </button>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-2 w-full bg-dark-card border border-dark-border rounded-2xl shadow-2xl p-4 z-[60]"
                >
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      {
                        label: "ქალაქი",
                        key: "city",
                        opts: GEORGIAN_CITIES.map((c) => ({ v: c, l: c })),
                      },
                      {
                        label: "კატეგორია",
                        key: "category",
                        opts: CATEGORIES.map((c) => ({ v: c.id, l: c.name })),
                      },
                      {
                        label: "მდგომარეობა",
                        key: "condition",
                        opts: [
                          { v: "NEW", l: "ახალი" },
                          { v: "USED", l: "მეორადი" },
                        ],
                      },
                    ].map((f) => (
                      <div key={f.key} className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                          {f.label}
                        </label>
                        <select
                          value={(filters as any)[f.key]}
                          onChange={(e) =>
                            setFilters({ ...filters, [f.key]: e.target.value })
                          }
                          className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-gold/50"
                        >
                          <option value="">ყველა</option>
                          {f.opts.map((o) => (
                            <option key={o.v} value={o.v}>
                              {o.l}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
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

          {/* ── Actions — desktop only ── */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {user ? (
              <>
                <div className="relative">
                  <button
                    onClick={async () => {
                      setShowNotifications(!showNotifications);
                      if (!showNotifications && unreadCount > 0) {
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
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 w-4 h-4 bg-gold text-dark text-[10px] font-black flex items-center justify-center rounded-full border-2 border-dark">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <AnimatePresence>
                    {showNotifications && (
                      <NotificationDropdown
                        notifications={notifications}
                        onAction={handleOfferAction}
                        onClose={() => setShowNotifications(false)}
                      />
                    )}
                  </AnimatePresence>
                </div>
                <button
                  onClick={onAddListing}
                  className="bg-gold hover:bg-gold-hover text-dark px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-gold/10"
                >
                  <Plus size={18} /> განცხადება
                </button>
                <Link
                  href="/profile"
                  className="flex items-center p-1 rounded-xl border border-dark-border hover:border-gold/50 transition-all bg-dark-card"
                >
                  <img
                    src={user.avatar || "https://www.gravatar.com/avatar?d=mp"}
                    className="w-9 h-9 rounded-lg object-cover"
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
                  className="rounded-lg border border-dark-border px-4 py-2 text-sm text-zinc-400 hover:border-gold hover:text-gold transition-colors"
                >
                  შესვლა
                </button>
                <button
                  onClick={() => setShowAuthModal("register")}
                  className="bg-gold text-dark px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gold-hover transition-all"
                >
                  რეგისტრაცია
                </button>
              </div>
            )}
          </div>

          {/* ── მობილური: + Bell Burger ── */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <button
              onClick={onAddListing}
              className="bg-gold hover:bg-gold-hover text-dark p-2.5 rounded-xl transition-all"
            >
              <Plus size={20} />
            </button>
            {user && (
              <button
                onClick={async () => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications && unreadCount > 0) {
                    await fetch("/api/notifications/read", { method: "POST" });
                    setNotifications(
                      notifications.map((n) => ({ ...n, isRead: true })),
                    );
                  }
                }}
                className="relative p-2.5 text-zinc-400 hover:text-gold transition-colors bg-dark-card rounded-xl border border-dark-border"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-gold text-dark text-[10px] font-black flex items-center justify-center rounded-full border-2 border-dark">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setShowMobileMenu(true)}
              className="p-2.5 text-zinc-400 hover:text-gold transition-colors bg-dark-card rounded-xl border border-dark-border"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* ── მობილური საძიებო (pill toggle + input) ── */}
        <div className="lg:hidden px-4 pb-3">
          <div className="flex items-center bg-dark-card rounded-xl border border-dark-border p-1">
            <SearchToggle small />
            <input
              type="text"
              placeholder={
                searchType === "want" ? "სახელი..." : "გასაცვლელი..."
              }
              className="flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-zinc-600 min-w-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="p-2 shrink-0 text-zinc-400 hover:text-gold transition-colors"
            >
              <Search size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ══ მობილური Drawer ══ */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
              className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-0 right-0 h-full w-[80vw] max-w-xs bg-dark-card border-l border-dark-border z-[80] flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between px-5 py-5 border-b border-dark-border shrink-0">
                <span className="text-base font-black text-white">
                  GAMITS<span className="text-gold">VALE</span>.GE
                </span>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 text-zinc-500 hover:text-white rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 space-y-1">
                {user && (
                  <div className="flex items-center gap-3 px-3 py-3 mb-3 rounded-xl bg-dark border border-dark-border">
                    <img
                      src={
                        user.avatar || "https://www.gravatar.com/avatar?d=mp"
                      }
                      className="w-10 h-10 rounded-xl object-cover border border-dark-border"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-black text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-zinc-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                )}
                {[
                  { href: "/", label: "🏠 მთავარი" },
                  { href: "/rules", label: "📋 წესები" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center px-3 py-3 rounded-xl text-sm font-bold text-zinc-400 hover:text-gold hover:bg-gold/5 transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-3 pb-2">
                    კატეგორიები
                  </p>
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.id}`}
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-gold hover:bg-gold/5 transition-all"
                    >
                      <span className="text-base">{cat.icon}</span>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-dark-border px-3 py-4 space-y-2 shrink-0">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-dark-border text-sm font-black text-zinc-400 hover:text-gold hover:border-gold/30 transition-all"
                    >
                      <User size={16} /> პროფილი
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-500/10 text-sm font-black text-red-500 hover:bg-red-500/20 transition-all"
                    >
                      <LogOut size={16} /> გასვლა
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setShowAuthModal("login");
                        setShowMobileMenu(false);
                      }}
                      className="w-full py-3 rounded-xl border border-dark-border text-sm font-black text-zinc-400 hover:text-gold hover:border-gold/30 transition-all"
                    >
                      შესვლა
                    </button>
                    <button
                      onClick={() => {
                        setShowAuthModal("register");
                        setShowMobileMenu(false);
                      }}
                      className="w-full py-3 rounded-xl bg-gold text-dark text-sm font-black hover:bg-gold-hover transition-all"
                    >
                      რეგისტრაცია
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* შეტყობინებები მობილეზე */}
      <AnimatePresence>
        {showNotifications && (
          <div className="fixed inset-0 z-[70] flex items-start justify-end p-4 pt-24 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifications(false)}
              className="absolute inset-0"
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative w-full max-w-sm"
            >
              <NotificationDropdown
                notifications={notifications}
                onAction={handleOfferAction}
                onClose={() => setShowNotifications(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAuthModal && (
          <AuthModal
            type={showAuthModal}
            onClose={() => setShowAuthModal(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ── NotificationDropdown ────────────────────────────────────────────────────
function NotificationDropdown({
  notifications,
  onAction,
  onClose,
}: {
  notifications: any[];
  onAction: (id: string, status: string) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="absolute top-full right-0 mt-4 w-96 bg-dark-card border border-dark-border rounded-3xl shadow-2xl p-6 z-[60]"
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
                <p className="text-xs font-bold text-white mb-1">
                  {n.offer?.sender?.name || "მომხმარებელი"}
                </p>
                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                  {n.type === "NEW_OFFER"
                    ? `შემოგთავაზათ: ${n.offer?.description}`
                    : "თქვენი შეთავაზება განახლდა"}
                </p>
                {n.type === "NEW_OFFER" && n.offer?.status === "PENDING" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onAction(n.offer._id, "ACCEPTED")}
                      className="flex-1 py-2 bg-green-600/20 text-green-500 text-[9px] font-black rounded-lg hover:bg-green-600 hover:text-white transition-all border border-green-600/30"
                    >
                      თანხმობა
                    </button>
                    <button
                      onClick={() => onAction(n.offer._id, "THINKING")}
                      className="flex-1 py-2 bg-zinc-800 text-zinc-400 text-[9px] font-black rounded-lg hover:bg-zinc-700 transition-all border border-zinc-700"
                    >
                      დაფიქრება
                    </button>
                    <button
                      onClick={() => onAction(n.offer._id, "DECLINED")}
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
        onClick={onClose}
        className="block w-full mt-6 py-3 text-[10px] font-black uppercase tracking-widest text-gold hover:text-white transition-colors border-t border-dark-border text-center"
      >
        ყველას ნახვა
      </Link>
    </motion.div>
  );
}

// ── AuthModal ───────────────────────────────────────────────────────────────
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

  const inp =
    "w-full px-4 py-3 bg-dark border border-dark-border rounded-xl outline-none focus:border-gold transition-colors text-sm text-white";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 backdrop-blur-sm"
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
                className={inp}
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
                  className={inp}
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
                    className={inp}
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
                  className={`${inp} text-center text-2xl tracking-[10px]`}
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
                  className={inp}
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
                className={`${inp} text-center text-2xl tracking-[10px]`}
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
                <div className="w-full border-t border-dark-border" />
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
