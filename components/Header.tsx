"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Bell,
  Plus,
  LogOut,
  Menu,
  X,
  Filter,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CATEGORIES, useAuth, GEORGIAN_CITIES, cn } from "./AuthProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ── ფერების კონსტანტები (E დიზაინი) ─────────────────────────────────────────
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
};

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

  // pathname "/" - ს გაწმენდა state-ის დონეზე მარტო (onSearch გამოძახება არ ხდება)
  useEffect(() => {
    if (pathname === "/") {
      setSearchQuery("");
      setFilters({ city: "", category: "", condition: "" });
      setSearchType("want");
    }
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

  // ── მინდა / გინდა toggle ──────────────────────────────────────────────────
  const SearchToggle = ({ small = false }: { small?: boolean }) => (
    <div
      className={cn(
        "flex items-center gap-0.5 shrink-0",
        small ? "pr-1.5 mr-1" : "pr-2 mr-1",
      )}
      style={{ borderRight: `1px solid ${C.border}` }}
    >
      {(["want", "give"] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setSearchType(t)}
          className={cn(
            "rounded-lg font-bold uppercase tracking-widest transition-all whitespace-nowrap text-[10px]",
            small ? "px-2 py-1" : "px-2.5 py-1.5",
          )}
          style={
            searchType === t
              ? { background: C.green, color: "#fff" }
              : { color: C.text3 }
          }
        >
          {t === "want" ? "ვეძებ" : "მაქვს"}
        </button>
      ))}
    </div>
  );

  return (
    <>
      {/* ══ HEADER ══ */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: C.bg,
          borderBottom: `1px solid ${C.border}`,
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 h-[60px] flex items-center justify-between gap-4 lg:gap-8">
          {/* ── ლოგო ── */}
          <div className="flex items-center shrink-0">
            <Link
              href="/"
              onClick={() => {
                setSearchQuery("");
                setFilters({ city: "", category: "", condition: "" });
                setSearchType("want");
                this.props.history.push("/");
              }}
              className="text-[17px] font-bold tracking-tight"
              style={{ color: C.text, textDecoration: "none" }}
            >
              {settings?.logos ? (
                <img
                  src={settings.logo}
                  alt={settings.siteName}
                  className="h-7 object-contain"
                />
              ) : (
                <>
                  GAMITSVALE<span style={{ color: C.green }}>.GE</span>
                </>
              )}
            </Link>
          </div>

          {/* ── საძიებო — desktop ── */}
          <div
            className="flex-1 max-w-xl hidden lg:flex items-center rounded-xl p-1 relative"
            style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
          >
            <SearchToggle />
            <input
              type="text"
              placeholder={
                searchType === "want"
                  ? "რა ნივთს ვეძებ..."
                  : "რა ნივთი მაქვს..."
              }
              className="flex-1 bg-transparent px-3 text-sm outline-none min-w-0"
              style={{
                color: C.text,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 shrink-0 transition-colors rounded-lg"
              style={{ color: showFilters ? C.green : C.text3 }}
            >
              <Filter size={17} />
            </button>
            <button
              onClick={handleSearch}
              className="p-2 shrink-0 transition-colors rounded-lg"
              style={{ color: C.text3 }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = C.green)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = C.text3)
              }
            >
              <Search size={17} />
            </button>

            {/* Filters dropdown */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-2 w-full rounded-2xl shadow-xl p-4 z-[60]"
                  style={{ background: C.bg, border: `1px solid ${C.border}` }}
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
                        <label
                          className="text-[10px] font-bold uppercase tracking-widest"
                          style={{ color: C.text3 }}
                        >
                          {f.label}
                        </label>
                        <select
                          value={(filters as any)[f.key]}
                          onChange={(e) =>
                            setFilters({ ...filters, [f.key]: e.target.value })
                          }
                          className="w-full rounded-lg px-3 py-2 text-xs outline-none"
                          style={{
                            background: C.bgCard,
                            border: `1px solid ${C.border}`,
                            color: C.text,
                            fontFamily: "'Space Grotesk', sans-serif",
                          }}
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
                    className="w-full mt-4 text-white font-bold uppercase tracking-widest text-xs py-2 rounded-lg transition-colors"
                    style={{ background: C.green }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background =
                        C.greenDark)
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.background =
                        C.green)
                    }
                  >
                    ძებნა
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Actions — desktop ── */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            {user ? (
              <>
                {/* Bell */}
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
                    className="relative p-2.5 rounded-xl transition-colors"
                    style={{
                      border: `1px solid ${C.border}`,
                      background: C.bgCard,
                      color: C.text2,
                    }}
                  >
                    <Bell size={19} />
                    {unreadCount > 0 && (
                      <span
                        className="absolute top-1.5 right-1.5 w-4 h-4 text-[10px] font-bold flex items-center justify-center rounded-full text-white"
                        style={{ background: C.green }}
                      >
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

                {/* + განცხადება */}
                <button
                  onClick={onAddListing}
                  className="text-white px-5 py-2 rounded-lg text-[13px] font-semibold transition-all flex items-center gap-1.5"
                  style={{ background: C.green }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      C.greenDark)
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      C.green)
                  }
                >
                  <Plus size={14} />
                  დამატება
                </button>

                {/* Avatar */}
                <Link
                  href="/profile"
                  className="flex items-center p-1 rounded-xl transition-all"
                  style={{
                    border: `1px solid ${C.border}`,
                    background: C.bgCard,
                  }}
                >
                  <img
                    src={user.avatar || "https://www.gravatar.com/avatar?d=mp"}
                    className="w-8 h-8 rounded-lg object-cover"
                    referrerPolicy="no-referrer"
                  />
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl transition-colors"
                  style={{
                    border: `1px solid ${C.border}`,
                    background: C.bgCard,
                    color: C.text3,
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "#ef4444")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = C.text3)
                  }
                >
                  <LogOut size={17} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowAuthModal("login")}
                  className="rounded-lg px-4 py-2 text-[13px] font-medium transition-colors"
                  style={{
                    border: `1px solid ${C.border}`,
                    color: C.text2,
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      C.text2;
                    (e.currentTarget as HTMLElement).style.color = C.text;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      C.border;
                    (e.currentTarget as HTMLElement).style.color = C.text2;
                  }}
                >
                  შესვლა
                </button>
                <button
                  onClick={() => setShowAuthModal("register")}
                  className="text-white px-5 py-2 rounded-lg text-[13px] font-semibold transition-all"
                  style={{ background: C.green }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      C.greenDark)
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      C.green)
                  }
                >
                  რეგისტრაცია
                </button>
              </>
            )}
          </div>

          {/* ── მობილური: + Bell Burger ── */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <button
              onClick={onAddListing}
              className="p-2.5 rounded-xl text-white transition-all"
              style={{ background: C.green }}
            >
              <Plus size={19} />
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
                className="relative p-2.5 rounded-xl transition-colors"
                style={{
                  border: `1px solid ${C.border}`,
                  background: C.bgCard,
                  color: C.text2,
                }}
              >
                <Bell size={19} />
                {unreadCount > 0 && (
                  <span
                    className="absolute top-1.5 right-1.5 w-4 h-4 text-[10px] font-bold flex items-center justify-center rounded-full text-white"
                    style={{ background: C.green }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setShowMobileMenu(true)}
              className="p-2.5 rounded-xl transition-colors"
              style={{
                border: `1px solid ${C.border}`,
                background: C.bgCard,
                color: C.text2,
              }}
            >
              <Menu size={19} />
            </button>
          </div>
        </div>

        {/* ── მობილური საძიებო ── */}
        <div className="lg:hidden px-4 pb-3">
          <div
            className="flex items-center rounded-xl p-1"
            style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
          >
            <SearchToggle small />
            <input
              type="text"
              placeholder={
                searchType === "want" ? "სახელი..." : "გასაცვლელი..."
              }
              className="flex-1 bg-transparent px-2 text-sm outline-none min-w-0"
              style={{
                color: C.text,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="p-2 shrink-0 transition-colors"
              style={{ color: C.text3 }}
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
              className="fixed inset-0 z-[70] lg:hidden"
              style={{
                background: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(4px)",
              }}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-0 right-0 h-full w-[80vw] max-w-xs z-[80] flex flex-col lg:hidden"
              style={{ background: C.bg, borderLeft: `1px solid ${C.border}` }}
            >
              {/* Drawer header */}
              <div
                className="flex items-center justify-between px-5 py-4 shrink-0"
                style={{ borderBottom: `1px solid ${C.border}` }}
              >
                <span
                  className="text-[16px] font-bold"
                  style={{ color: C.text }}
                >
                  GAMITS<span style={{ color: C.green }}>VALE</span>.GE
                </span>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 rounded-xl transition-colors"
                  style={{ color: C.text3 }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer content */}
              <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {user && (
                  <div
                    className="flex items-center gap-3 px-3 py-3 mb-3 rounded-xl"
                    style={{
                      background: C.bgCard,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <img
                      src={
                        user.avatar || "https://www.gravatar.com/avatar?d=mp"
                      }
                      className="w-10 h-10 rounded-xl object-cover"
                      style={{ border: `1px solid ${C.border}` }}
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <p
                        className="text-sm font-bold truncate"
                        style={{ color: C.text }}
                      >
                        {user.name}
                      </p>
                      <p
                        className="text-[11px] truncate"
                        style={{ color: C.text3 }}
                      >
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
                    className="flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all"
                    style={{ color: C.text2, textDecoration: "none" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        C.greenLight;
                      (e.currentTarget as HTMLElement).style.color = C.green;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                      (e.currentTarget as HTMLElement).style.color = C.text2;
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Drawer footer */}
              <div
                className="px-3 py-4 space-y-2 shrink-0"
                style={{ borderTop: `1px solid ${C.border}` }}
              >
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition-all"
                      style={{
                        border: `1px solid ${C.border}`,
                        color: C.text2,
                        textDecoration: "none",
                      }}
                    >
                      <User size={16} /> პროფილი
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium text-red-500 transition-all"
                      style={{ background: "rgba(239,68,68,0.08)" }}
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
                      className="w-full py-3 rounded-xl text-sm font-medium transition-all"
                      style={{
                        border: `1px solid ${C.border}`,
                        color: C.text2,
                      }}
                    >
                      შესვლა
                    </button>
                    <button
                      onClick={() => {
                        setShowAuthModal("register");
                        setShowMobileMenu(false);
                      }}
                      className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-all"
                      style={{ background: C.green }}
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
          <div className="fixed inset-0 z-[70] flex items-start justify-end p-4 pt-20 lg:hidden">
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

// ── NotificationDropdown ─────────────────────────────────────────────────────
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
      className="absolute top-full right-0 mt-3 w-96 rounded-2xl shadow-xl p-5 z-[60]"
      style={{ background: C.bg, border: `1px solid ${C.border}` }}
    >
      <div className="flex items-center justify-between mb-5">
        <h4
          className="text-[11px] font-bold uppercase tracking-widest"
          style={{ color: C.text3 }}
        >
          შეტყობინებები
        </h4>
        <span
          className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: C.greenLight, color: C.green }}
        >
          ახალი
        </span>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.length === 0 && (
          <p className="text-xs text-center py-4" style={{ color: C.text3 }}>
            შეტყობინება არ არის
          </p>
        )}
        {notifications.map((n) => (
          <div
            key={n._id}
            className="p-4 rounded-xl transition-all"
            style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
          >
            <div className="flex gap-3">
              <img
                src={
                  n.offer?.sender?.avatar ||
                  "https://www.gravatar.com/avatar?d=mp"
                }
                className="w-9 h-9 rounded-full"
                style={{ border: `1px solid ${C.border}` }}
              />
              <div className="flex-1">
                <p className="text-xs font-bold mb-1" style={{ color: C.text }}>
                  {n.offer?.sender?.name || "მომხმარებელი"}
                </p>
                <p
                  className="text-[11px] line-clamp-2 leading-relaxed mb-3"
                  style={{ color: C.text2 }}
                >
                  {n.type === "NEW_OFFER"
                    ? `შემოგთავაზათ: ${n.offer?.description}`
                    : "თქვენი შეთავაზება განახლდა"}
                </p>
                {n.type === "NEW_OFFER" && n.offer?.status === "PENDING" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onAction(n.offer._id, "ACCEPTED")}
                      className="flex-1 py-1.5 text-[10px] font-semibold rounded-lg transition-all text-white"
                      style={{ background: "#16a34a" }}
                    >
                      თანხმობა
                    </button>
                    <button
                      onClick={() => onAction(n.offer._id, "THINKING")}
                      className="flex-1 py-1.5 text-[10px] font-semibold rounded-lg transition-all"
                      style={{
                        background: C.bgCard,
                        border: `1px solid ${C.border}`,
                        color: C.text2,
                      }}
                    >
                      დაფიქრება
                    </button>
                    <button
                      onClick={() => onAction(n.offer._id, "DECLINED")}
                      className="flex-1 py-1.5 text-[10px] font-semibold rounded-lg transition-all text-red-500"
                      style={{ background: "rgba(239,68,68,0.08)" }}
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
        href="/offers"
        onClick={onClose}
        className="block w-full mt-5 py-2.5 text-[11px] font-semibold text-center transition-colors"
        style={{
          borderTop: `1px solid ${C.border}`,
          color: C.green,
          textDecoration: "none",
        }}
      >
        ყველას ნახვა →
      </Link>
    </motion.div>
  );
}

// ── AuthModal ─────────────────────────────────────────────────────────────────
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
    lastName: "",
    phone: "",
    instagram: "",
    facebook: "",
    code: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inp = cn(
    "w-full px-4 py-3 rounded-xl outline-none text-sm transition-colors",
  );
  const inpStyle = {
    background: C.bgCard,
    border: `1px solid ${C.border}`,
    color: C.text,
    fontFamily: "'Space Grotesk', sans-serif",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (type === "login") {
        if (step === "forgot") {
          const res = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.email }),
          });
          if (res.ok) setStep("reset");
          else {
            const d = await res.json();
            setError(d.error || "კოდის გაგზავნა ვერ მოხერხდა");
          }
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
            onClose();
            window.location.href = "/";
          } else {
            const d = await res.json();
            setError(d.error || "პაროლის შეცვლა ვერ მოხერხდა");
          }
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
            {
              lastName: formData.lastName,
              phone: formData.phone,
              instagram: formData.instagram,
              facebook: formData.facebook,
            },
          );
          if (res.success) setStep("verify");
          else setError(res.error || "რეგისტრაცია ვერ მოხერხდა");
        } else {
          const res = await verify(formData.email, formData.code);
          if (res.success) onClose();
          else setError(res.error || "ვერიფიკაცია ვერ მოხერხდა");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = () => {
    window.location.href = "/api/auth/facebook";
  };

  const labelCls = "text-[10px] font-bold uppercase tracking-widest ml-1";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0"
        style={{ backdropFilter: "blur(4px)", background: "rgba(0,0,0,0.3)" }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md rounded-2xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
        style={{ background: C.bg, border: `1px solid ${C.border}` }}
      >
        <div className="p-8">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full transition-colors"
            style={{ color: C.text3 }}
          >
            <X size={22} />
          </button>
          <h2
            className="text-2xl font-bold mb-6 text-center"
            style={{ color: C.text, fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {step === "forgot"
              ? "პაროლის აღდგენა"
              : step === "reset"
                ? "ახალი პაროლი"
                : step === "verify"
                  ? "ვერიფიკაცია"
                  : type === "login"
                    ? "შესვლა"
                    : "რეგისტრაცია"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ── REGISTER ── */}
            {type === "register" && step === "form" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className={labelCls} style={{ color: C.text3 }}>
                      სახელი *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="გიორგი"
                      className={inp}
                      style={inpStyle}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls} style={{ color: C.text3 }}>
                      გვარი
                    </label>
                    <input
                      type="text"
                      placeholder="მამულაშვილი"
                      className={inp}
                      style={inpStyle}
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls} style={{ color: C.text3 }}>
                    მეილი *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="email@gmail.com"
                    className={inp}
                    style={inpStyle}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls} style={{ color: C.text3 }}>
                    ტელეფონი *
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="+995 5XX XXX XXX"
                    className={inp}
                    style={inpStyle}
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls} style={{ color: C.text3 }}>
                    პაროლი *
                  </label>
                  <input
                    required
                    type="password"
                    minLength={6}
                    placeholder="მინიმუმ 6 სიმბოლო"
                    className={inp}
                    style={inpStyle}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
                <div className="pt-2">
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest mb-3"
                    style={{ color: C.text3 }}
                  >
                    სოციალური ქსელები (არასავალდებულო)
                  </p>
                  <div className="space-y-3">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm">
                        📸
                      </span>
                      <input
                        type="text"
                        placeholder="Instagram username"
                        className={`${inp} pl-10`}
                        style={inpStyle}
                        value={formData.instagram}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            instagram: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm">
                        🔵
                      </span>
                      <input
                        type="text"
                        placeholder="Facebook profile URL"
                        className={`${inp} pl-10`}
                        style={inpStyle}
                        value={formData.facebook}
                        onChange={(e) =>
                          setFormData({ ...formData, facebook: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── LOGIN ── */}
            {type === "login" && (step === "form" || step === "forgot") && (
              <>
                <div className="space-y-1.5">
                  <label className={labelCls} style={{ color: C.text3 }}>
                    მეილი
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="email@gmail.com"
                    className={inp}
                    style={inpStyle}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                {step === "form" && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center ml-1">
                      <label className={labelCls} style={{ color: C.text3 }}>
                        პაროლი
                      </label>
                      <button
                        type="button"
                        onClick={() => setStep("forgot")}
                        className="text-[10px] font-bold transition-colors"
                        style={{ color: C.green }}
                      >
                        დაგავიწყდათ?
                      </button>
                    </div>
                    <input
                      required
                      type="password"
                      minLength={6}
                      className={inp}
                      style={inpStyle}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                )}
              </>
            )}

            {/* ── RESET ── */}
            {step === "reset" && (
              <>
                <div className="space-y-1.5">
                  <label className={labelCls} style={{ color: C.text3 }}>
                    აღდგენის კოდი
                  </label>
                  <input
                    required
                    type="text"
                    maxLength={6}
                    className={`${inp} text-center text-2xl tracking-[10px]`}
                    style={inpStyle}
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls} style={{ color: C.text3 }}>
                    ახალი პაროლი
                  </label>
                  <input
                    required
                    type="password"
                    minLength={6}
                    className={inp}
                    style={inpStyle}
                    value={formData.newPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, newPassword: e.target.value })
                    }
                  />
                </div>
              </>
            )}

            {/* ── VERIFY ── */}
            {step === "verify" && (
              <div className="space-y-1.5">
                <p
                  className="text-sm text-center mb-4"
                  style={{ color: C.text2 }}
                >
                  კოდი გამოგზავნილია{" "}
                  <span className="font-bold" style={{ color: C.green }}>
                    {formData.email}
                  </span>
                  -ზე
                </p>
                <label className={labelCls} style={{ color: C.text3 }}>
                  6-ნიშნა კოდი
                </label>
                <input
                  required
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  className={`${inp} text-center text-2xl tracking-[10px]`}
                  style={inpStyle}
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                />
              </div>
            )}

            {error && (
              <p
                className="text-xs text-center font-semibold py-2 px-3 rounded-lg text-red-600"
                style={{ background: "rgba(239,68,68,0.08)" }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 mt-2"
              style={{
                background: C.green,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
              onMouseEnter={(e) =>
                !loading &&
                ((e.currentTarget as HTMLElement).style.background =
                  C.greenDark)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = C.green)
              }
            >
              {loading
                ? "გთხოვთ დაელოდოთ..."
                : step === "forgot"
                  ? "კოდის გაგზავნა"
                  : step === "reset"
                    ? "პაროლის შეცვლა"
                    : step === "verify"
                      ? "დადასტურება"
                      : type === "login"
                        ? "შესვლა"
                        : "რეგისტრაცია"}
            </button>

            {(step === "forgot" || step === "reset") && (
              <button
                type="button"
                onClick={() => setStep("form")}
                className="w-full text-[11px] font-semibold text-center mt-2 transition-colors"
                style={{ color: C.text3 }}
              >
                ← უკან
              </button>
            )}
          </form>

          {/* ── Social Login ── */}
          {step === "form" && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div
                    className="w-full"
                    style={{ borderTop: `1px solid ${C.border}` }}
                  />
                </div>
                <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                  <span
                    className="px-4"
                    style={{ background: C.bg, color: C.text3 }}
                  >
                    ან
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    loginWithGoogle();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    border: `1px solid ${C.border}`,
                    color: C.text,
                    background: C.bgCard,
                  }}
                >
                  <img
                    src="https://www.google.com/favicon.ico"
                    className="w-4 h-4"
                    alt="Google"
                  />
                  Google-ით შესვლა
                </button>
                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium transition-all text-[#1877F2]"
                  style={{
                    border: "1px solid rgba(24,119,242,0.2)",
                    background: "rgba(24,119,242,0.05)",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="#1877F2"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook-ით შესვლა
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
