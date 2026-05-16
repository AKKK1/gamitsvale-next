// components/AddListingModal.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Upload,
  Trash2,
  Star,
  ShieldCheck,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { GEORGIAN_CITIES, CATEGORIES, cn, useAuth } from "./AuthProvider";

// ─────────────────────────────────────────────────────────────────────────────
// 🎨 კონსტანტები: ფერები და სტილები
// ─────────────────────────────────────────────────────────────────────────────
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

// საერთო სტილი input-ებისთვის
const inp: React.CSSProperties = {
  background: C.bg2,
  border: `1px solid ${C.border}`,
  color: C.text,
  fontFamily: "'Space Grotesk', sans-serif",
  outline: "none",
  width: "100%",
  padding: "10px 16px",
  borderRadius: 10,
  fontSize: 13,
};

// ─────────────────────────────────────────────────────────────────────────────
// 🧩 კომპონენტი: AddListingModal
// ─────────────────────────────────────────────────────────────────────────────
export default function AddListingModal({
  onClose,
  onRefresh,
  editingListing,
}: {
  onClose: () => void;
  onRefresh: () => void;
  editingListing?: any;
}) {
  const { user } = useAuth();
  // ───────────────────────────────────────────────────────────────────────────
  // 📦 STATE: ფორმის მონაცემები
  // ───────────────────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    title: "",
    category: "",
    city: "",
    description: "",
    condition: "USED",
    wantedItems: ["", "", ""],
    serviceWanted: "",
    wantedType: "items" as "items" | "service",
    offerMe: "",
    images: [] as string[],
    listingType: "NORMAL",

    // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
    // 🔁 გაცვლის პერიოდის ველები (STATE-ში)
    // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼

    /**
     * გაცვლის ტიპი:
     * - "permanent" = მუდმივი გაცვლა (დეფოლტი)
     * - "temporary" = დროებითი გაცვლა
     */
    tradePeriod: "permanent" as "permanent" | "temporary",

    /**
     * ხანგრძლივობის რიცხვითი მნიშვნელობა (დეფოლტი: 1)
     * მაგალითი: 2, 3, 6...
     */
    tradeDuration: 1,

    /**
     * დროის ერთეული: day | week | month | year
     * მაგალითი: "month" → "2 თვე"
     */
    tradeUnit: "month" as "day" | "week" | "month" | "year",

    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
    // 🔁 გაცვლის პერიოდის ველები - დასრულებულია
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ───────────────────────────────────────────────────────────────────────────
  // 🔄 რედაქტირებისას: მონაცემების ჩატვირთვა MongoDB-დან
  // ───────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (editingListing) {
      setForm({
        title: editingListing.title || "",
        category: editingListing.category || "",
        city: editingListing.city || "",
        description: editingListing.description || "",
        condition: editingListing.condition || "USED",
        wantedItems: [
          editingListing.wantedItems?.[0] || "",
          editingListing.wantedItems?.[1] || "",
          editingListing.wantedItems?.[2] || "",
        ],
        serviceWanted: editingListing.serviceWanted || "",
        wantedType: editingListing.wantedType || "items",
        images: editingListing.images || [],
        listingType: editingListing.listingType || "NORMAL",
        offerMe: "null", // ▼▼▼ გაცვლის პერიოდის ველების ჩატვირთვა ▼▼▼
        tradePeriod: editingListing.tradePeriod || "permanent",
        tradeDuration: editingListing.tradeDuration || 1,
        tradeUnit: editingListing.tradeUnit || "month",
        // ▲▲▲ გაცვლის პერიოდის ველების ჩატვირთვა ▲▲▲
      });
    }
  }, [editingListing]);

  // ───────────────────────────────────────────────────────────────────────────
  // 🖼️ ფოტოს ატვირთვა (Cloudinary)
  // ───────────────────────────────────────────────────────────────────────────
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const toBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let { width, height } = img;
            const max = 1200;
            if (width > max) {
              height *= max / width;
              width = max;
            }
            if (height > max) {
              width *= max / height;
              height = max;
            }
            canvas.width = width;
            canvas.height = height;
            canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", 0.85));
          };
          img.src = ev.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    try {
      const base64List = await Promise.all(
        Array.from(files)
          .slice(0, 5 - form.images.length)
          .map(toBase64),
      );
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: base64List, folder: "listings" }),
      });
      if (!res.ok) {
        setError("ფოტოს ატვირთვა ვერ მოხერხდა");
        return;
      }
      const data = await res.json();
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...data.urls].slice(0, 5),
      }));
    } catch {
      setError("ფოტოს ატვირთვა ვერ მოხერხდა");
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // 📤 ფორმის გაგზავნა API-ში (POST/PATCH)
  // ───────────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // ვალიდაცია
    if (form.images.length === 0)
      return setError("გთხოვთ ატვირთოთ მინიმუმ 1 ფოტო");
    if (!form.title.trim()) return setError("სათაური სავალდებულოა");
    if (!form.category) return setError("კატეგორია სავალდებულოა");
    if (!form.city) return setError("ქალაქი სავალდებულოა");
    if (!form.description.trim()) return setError("აღწერა სავალდებულოა");
    if (form.wantedType === "service" && !form.serviceWanted.trim())
      return setError("სერვისის აღწერა სავალდებულოა");

    setLoading(true);

    try {
      const url = editingListing
        ? `/api/listings/${editingListing._id}`
        : "/api/listings";
      const method = editingListing ? "PATCH" : "POST";

      // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
      // 🔁 API-ში გაგზავნა: გაცვლის პერიოდის ველები
      // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          wantedItems:
            form.wantedType === "items"
              ? form.wantedItems.filter((i) => i.trim() !== "")
              : [],
          serviceWanted:
            form.wantedType === "service" ? form.serviceWanted : "",

          // გაცვლის პერიოდი: ყოველთვის იგზავნება
          tradePeriod: form.tradePeriod,

          // tradeDuration და tradeUnit იგზავნება მხოლოდ "temporary"-სთვის
          // "permanent"-ის შემთხვევაში იგზავნება null (როგორც უნდა იყოს MongoDB-ში)
          tradeDuration:
            form.tradePeriod === "temporary" ? form.tradeDuration : null,
          tradeUnit: form.tradePeriod === "temporary" ? form.tradeUnit : null,
        }),
      });
      // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
      // 🔁 API-ში გაგზავნა: დასრულებულია
      // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onRefresh();
          onClose();
        }, 1500);
      } else {
        const err = await res.json();
        setError(err.error || "დაფიქსირდა შეცდომა");
      }
    } catch {
      setError("დაფიქსირდა შეცდომა");
    } finally {
      setLoading(false);
    }
  };

  // სტილი ლეიბლებისთვის
  const labelStyle: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: C.text3,
    marginLeft: 4,
    display: "block",
    marginBottom: 4,
    fontFamily: "'Space Grotesk', sans-serif",
  };

  // ───────────────────────────────────────────────────────────────────────────
  // 🎨 JSX: რენდერი
  // ───────────────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10"
        style={{ background: C.bg, border: `1px solid ${C.border}` }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-5 shrink-0"
          style={{ borderBottom: `1px solid ${C.border}`, background: C.bg2 }}
        >
          <div>
            <h2 className="text-lg font-bold" style={{ color: C.text }}>
              {editingListing ? "განცხადების რედაქტირება" : "ახალი განცხადება"}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: C.text3 }}>
              შეავსე ყველა სავალდებულო ველი
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: C.text3, cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto">
          {/* Success */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 gap-4"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: C.greenLight }}
                >
                  <CheckCircle2 size={32} style={{ color: C.green }} />
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg" style={{ color: C.text }}>
                    {editingListing ? "განახლდა!" : "გამოქვეყნდა!"}
                  </p>
                  <p className="text-xs mt-1" style={{ color: C.text3 }}>
                    {editingListing
                      ? "განცხადება წარმატებით განახლდა"
                      : "განცხადება წარმატებით დაემატა"}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{
                      background: "rgba(239,68,68,0.06)",
                      border: "1px solid rgba(239,68,68,0.2)",
                    }}
                  >
                    <AlertCircle
                      size={16}
                      style={{ color: "#ef4444" }}
                      className="shrink-0 mt-0.5"
                    />
                    <p
                      className="text-sm font-bold flex-1"
                      style={{ color: "#ef4444" }}
                    >
                      {error}
                    </p>
                    <button
                      type="button"
                      onClick={() => setError(null)}
                      style={{ color: "#ef4444", cursor: "pointer" }}
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Listing Type */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    id: "NORMAL",
                    name: "უფასო",
                    price: "0 ₾",
                    icon: <ImageIcon size={14} />,
                  },
                  {
                    id: "SILVER",
                    name: "SILVER",
                    price: "15 ₾",
                    icon: <ShieldCheck size={14} />,
                  },
                  {
                    id: "VIP",
                    name: "VIP",
                    price: "30 ₾",
                    icon: <Star size={14} style={{ color: C.gold }} />,
                  },
                  ...(user?.role === "ADMIN" || user?.canPostExclusive
                    ? [
                        {
                          id: "EXCLUSIVE",
                          name: "EXCLUSIVE",
                          price: "0 ₾",
                          icon: <Star size={14} style={{ color: "#7c3aed" }} />,
                        },
                      ]
                    : []),
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setForm({ ...form, listingType: type.id })}
                    className="p-3 rounded-xl transition-all text-left flex flex-col gap-1"
                    style={{
                      border: `1px solid ${form.listingType === type.id ? C.green : C.border}`,
                      background:
                        form.listingType === type.id ? C.greenLight : C.bg2,
                      cursor: "pointer",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest"
                        style={{
                          color:
                            form.listingType === type.id ? C.green : C.text3,
                        }}
                      >
                        {type.name}
                      </span>
                      {type.icon}
                    </div>
                    <span
                      className="text-sm font-bold"
                      style={{ color: C.text }}
                    >
                      {type.price}
                    </span>
                  </button>
                ))}
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>სათაური</label>
                  <input
                    required
                    placeholder="მაგ: iPhone 13 Pro"
                    style={inp}
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label style={labelStyle}>კატეგორია</label>
                  <select
                    required
                    style={{ ...inp, appearance: "none" }}
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    <option value="">აირჩიე</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* City & Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>ქალაქი</label>
                  <select
                    required
                    style={{ ...inp, appearance: "none" }}
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  >
                    <option value="">აირჩიე</option>
                    {GEORGIAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>მდგომარეობა</label>
                  <div className="flex gap-2">
                    {["NEW", "USED"].map((cond) => (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => setForm({ ...form, condition: cond })}
                        className="flex-1 py-2.5 rounded-lg text-xs font-bold transition-all"
                        style={{
                          background: form.condition === cond ? C.green : C.bg2,
                          color: form.condition === cond ? "#fff" : C.text2,
                          border: `1px solid ${form.condition === cond ? C.green : C.border}`,
                          cursor: "pointer",
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}
                      >
                        {cond === "NEW" ? "ახალი" : "მეორადი"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>აღწერა</label>
                <textarea
                  required
                  rows={3}
                  placeholder="დაწვრილებით აღწერე ნივთი..."
                  style={{ ...inp, resize: "none" }}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              {/* ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */}
              {/* 🔁 გაცვლის პერიოდის ველები (UI) */}
              {/* ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */}
              <div>
                <label style={labelStyle} className="flex items-center gap-1">
                  <Clock size={11} /> რამდენი ხნით?
                </label>
                <div className="flex gap-2 mb-3">
                  {[
                    { id: "permanent", label: "♾ მუდმივად" },
                    { id: "temporary", label: "⏳ დროებით" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setForm({ ...form, tradePeriod: opt.id as any })
                      }
                      className="flex-1 py-2.5 rounded-lg text-xs font-bold transition-all"
                      style={{
                        background:
                          form.tradePeriod === opt.id ? C.green : C.bg2,
                        color: form.tradePeriod === opt.id ? "#fff" : C.text2,
                        border: `1px solid ${form.tradePeriod === opt.id ? C.green : C.border}`,
                        cursor: "pointer",
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* დროებითი გაცვლის ველები: ჩნდება მხოლოდ თუ tradePeriod === "temporary" */}
                <AnimatePresence>
                  {form.tradePeriod === "temporary" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-2 overflow-hidden"
                    >
                      <div className="flex-1">
                        <input
                          type="number"
                          min={1}
                          max={999}
                          value={form.tradeDuration}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              tradeDuration: Math.max(
                                1,
                                parseInt(e.target.value) || 1,
                              ),
                            })
                          }
                          style={{ ...inp, width: "100%" }}
                          placeholder="1"
                        />
                      </div>
                      <div className="flex-1">
                        <select
                          value={form.tradeUnit}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              tradeUnit: e.target.value as any,
                            })
                          }
                          style={{ ...inp, appearance: "none", width: "100%" }}
                        >
                          <option value="day">დღე</option>
                          <option value="week">კვირა</option>
                          <option value="month">თვე</option>
                          <option value="year">წელი</option>
                        </select>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */}
              {/* 🔁 გაცვლის პერიოდის ველები (UI) - დასრულებულია */}
              {/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */}

              {/* Wanted toggle */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label style={labelStyle}>სასურველი ნივთები</label>
                  <div
                    className="flex gap-1 p-1 rounded-lg"
                    style={{
                      background: C.bg3,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    {[
                      { id: "items", label: "📦 ნივთი" },
                      { id: "service", label: "🛠️ სერვისი" },
                      { id: "offerMe", label: "💡შემომთავაზეთ" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() =>
                          setForm({ ...form, wantedType: t.id as any })
                        }
                        className="px-3 py-1.5 rounded-md text-xs font-bold transition-all"
                        style={{
                          background:
                            form.wantedType === t.id ? C.green : "transparent",
                          color: form.wantedType === t.id ? "#fff" : C.text2,
                          cursor: "pointer",
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                {form.wantedType === "items" && (
                  <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2].map((i) => (
                      <input
                        key={i}
                        placeholder={`ვარიანტი ${i + 1}`}
                        style={{ ...inp, fontSize: 12 }}
                        value={form.wantedItems[i] || ""}
                        onChange={(e) => {
                          const n = [...form.wantedItems];
                          n[i] = e.target.value;
                          setForm({ ...form, wantedItems: n });
                        }}
                      />
                    ))}
                  </div>
                )}
                {form.wantedType === "service" && (
                  <input
                    placeholder="მაგ: ავტომობილის შეკეთება, ვებ დიზაინი..."
                    style={{ ...inp, fontSize: 12 }}
                    value={form.serviceWanted}
                    onChange={(e) =>
                      setForm({ ...form, serviceWanted: e.target.value })
                    }
                  />
                )}
                {form.offerMe === "offerMe" && (
                  <input
                    placeholder=" შემომთავაზეთ💡 "
                    style={{ ...inp, fontSize: 12 }}
                    value={form.offerMe}
                    onChange={(e) =>
                      setForm({ ...form, serviceWanted: e.target.value })
                    }
                  />
                )}
              </div>

              {/* Photos */}
              <div>
                <label style={labelStyle}>ფოტოები (მაქს 5)</label>
                <div className="flex flex-wrap gap-3">
                  {form.images.map((img, i) => (
                    <div
                      key={i}
                      className="relative w-16 h-16 rounded-lg overflow-hidden group"
                      style={{ border: `1px solid ${C.border}` }}
                    >
                      <img src={img} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, idx) => idx !== i),
                          }))
                        }
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                        style={{
                          background: "rgba(239,68,68,0.8)",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {form.images.length < 5 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-16 h-16 rounded-lg flex flex-col items-center justify-center transition-all"
                      style={{
                        border: `2px dashed ${C.border}`,
                        background: C.bg2,
                        cursor: "pointer",
                        color: C.text3,
                      }}
                    >
                      <Upload size={16} />
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                  multiple
                />
              </div>
            </form>
          )}
        </div>

        {!success && (
          <div
            className="p-5 shrink-0"
            style={{ borderTop: `1px solid ${C.border}`, background: C.bg2 }}
          >
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full text-white py-3 rounded-lg text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              style={{
                background: C.green,
                cursor: "pointer",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  მიმდინარეობს...
                </span>
              ) : editingListing ? (
                "განახლება"
              ) : (
                "გამოქვეყნება"
              )}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
