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
} from "lucide-react";
import { GEORGIAN_CITIES, CATEGORIES, cn } from "./AuthProvider";

export default function AddListingModal({
  onClose,
  onRefresh,
  editingListing,
}: {
  onClose: () => void;
  onRefresh: () => void;
  editingListing?: any;
}) {
  const [form, setForm] = useState({
    title: "",
    category: "",
    city: "",
    description: "",
    condition: "USED",
    wantedItems: ["", "", ""],
    serviceWanted: "",
    wantedType: "items" as "items" | "service",
    images: [] as string[],
    listingType: "NORMAL",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      });
    }
  }, [editingListing]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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
        }),
      });
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
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-2xl bg-dark-card border border-dark-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-dark-border bg-dark/30 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">
              {editingListing ? "განცხადების რედაქტირება" : "ახალი განცხადება"}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              შეავსე ყველა სავალდებულო ველი
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-white hover:bg-dark rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto no-scrollbar">
          {/* Success */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-emerald-400" />
                </div>
                <div className="text-center">
                  <p className="font-black text-white text-lg">
                    {editingListing ? "განახლდა!" : "გამოქვეყნდა!"}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
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
              {/* Error banner */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                  >
                    <AlertCircle
                      size={16}
                      className="text-red-400 shrink-0 mt-0.5"
                    />
                    <p className="text-sm font-bold text-red-400 flex-1">
                      {error}
                    </p>
                    <button
                      type="button"
                      onClick={() => setError(null)}
                      className="text-red-400/50 hover:text-red-400"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Listing Type */}
              <div className="grid grid-cols-3 gap-3">
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
                    price: "25 ₾",
                    icon: <ShieldCheck size={14} className="text-zinc-400" />,
                  },
                  {
                    id: "VIP",
                    name: "VIP",
                    price: "50 ₾",
                    icon: <Star size={14} className="text-gold" />,
                  },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setForm({ ...form, listingType: type.id })}
                    className={cn(
                      "p-3 rounded-xl border transition-all text-left flex flex-col gap-1",
                      form.listingType === type.id
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-dark-border bg-dark/50 text-zinc-500 hover:border-gold/50",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        {type.name}
                      </span>
                      {type.icon}
                    </div>
                    <span className="text-sm font-black text-white">
                      {type.price}
                    </span>
                  </button>
                ))}
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                    სათაური
                  </label>
                  <input
                    required
                    className="w-full px-4 py-2.5 bg-dark border border-dark-border rounded-lg outline-none focus:border-gold transition-colors text-sm text-white placeholder:text-zinc-700"
                    placeholder="მაგ: iPhone 13 Pro"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                    კატეგორია
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2.5 bg-dark border border-dark-border rounded-lg outline-none focus:border-gold transition-colors text-sm text-white appearance-none"
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
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                    ქალაქი
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2.5 bg-dark border border-dark-border rounded-lg outline-none focus:border-gold transition-colors text-sm text-white appearance-none"
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
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                    მდგომარეობა
                  </label>
                  <div className="flex gap-2">
                    {["NEW", "USED"].map((cond) => (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => setForm({ ...form, condition: cond })}
                        className={cn(
                          "flex-1 py-2.5 rounded-lg text-xs font-bold border transition-all",
                          form.condition === cond
                            ? "bg-gold border-gold text-dark"
                            : "bg-dark border-dark-border text-zinc-500 hover:border-gold/50",
                        )}
                      >
                        {cond === "NEW" ? "ახალი" : "მეორადი"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                  აღწერა
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 bg-dark border border-dark-border rounded-lg outline-none focus:border-gold transition-colors text-sm text-white placeholder:text-zinc-700 resize-none"
                  placeholder="დაწვრილებით აღწერე ნივთი..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              {/* Wanted toggle */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                    რაში გინდა გაცვლა?
                  </label>
                  <div className="flex gap-1 p-1 bg-dark rounded-lg border border-dark-border">
                    {[
                      { id: "items", label: "📦 ნივთი" },
                      { id: "service", label: "🛠️ სერვისი" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            wantedType: t.id as "items" | "service",
                          })
                        }
                        className={cn(
                          "px-3 py-1.5 rounded-md text-xs font-bold transition-all",
                          form.wantedType === t.id
                            ? "bg-gold text-dark"
                            : "text-zinc-500 hover:text-white",
                        )}
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
                        className="w-full px-3 py-2 bg-dark border border-dark-border rounded-lg outline-none focus:border-gold transition-colors text-xs text-white placeholder:text-zinc-700"
                        placeholder={`ვარიანტი ${i + 1}`}
                        value={form.wantedItems[i] || ""}
                        onChange={(e) => {
                          const newItems = [...form.wantedItems];
                          newItems[i] = e.target.value;
                          setForm({ ...form, wantedItems: newItems });
                        }}
                      />
                    ))}
                  </div>
                )}
                {form.wantedType === "service" && (
                  <input
                    className="w-full px-3 py-2 bg-dark border border-dark-border rounded-lg outline-none focus:border-gold transition-colors text-xs text-white placeholder:text-zinc-700"
                    placeholder="მაგ: ავტომობილის შეკეთება, ვებ დიზაინი..."
                    value={form.serviceWanted}
                    onChange={(e) =>
                      setForm({ ...form, serviceWanted: e.target.value })
                    }
                  />
                )}
              </div>

              {/* Photos */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                  ფოტოები <span className="text-zinc-700">(მაქს 5)</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {form.images.map((img, i) => (
                    <div
                      key={i}
                      className="relative w-16 h-16 rounded-lg overflow-hidden border border-dark-border group"
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
                        className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {form.images.length < 5 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-16 h-16 rounded-lg border-2 border-dashed border-dark-border flex flex-col items-center justify-center text-zinc-500 hover:border-gold hover:text-gold transition-all bg-dark/30"
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
          <div className="p-5 border-t border-dark-border bg-dark/30 shrink-0">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gold text-dark py-3 rounded-lg text-sm font-bold hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
                    className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full"
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
