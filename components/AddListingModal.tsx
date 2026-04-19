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
  Loader2,
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

  const inp =
    "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all text-sm text-gray-900 placeholder:text-gray-400";
  const lbl =
    "block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5";

  const listingTypes = [
    {
      id: "NORMAL",
      name: "უფასო",
      price: "0 ₾",
      desc: "სტანდარტული",
      icon: <ImageIcon size={13} className="text-gray-400" />,
    },
    {
      id: "SILVER",
      name: "SILVER",
      price: "25 ₾",
      desc: "გამორჩეული",
      icon: <ShieldCheck size={13} className="text-gray-500" />,
    },
    {
      id: "VIP",
      name: "VIP",
      price: "50 ₾",
      desc: "პირველი ადგილი",
      icon: <Star size={13} className="text-yellow-500" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-lg font-black text-gray-900">
              {editingListing ? "განცხადების რედაქტირება" : "ახალი განცხადება"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              შეავსე ყველა სავალდებულო ველი
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto">
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-green-600" />
                </div>
                <div className="text-center">
                  <p className="font-black text-gray-900 text-xl mb-1">
                    {editingListing ? "განახლდა!" : "გამოქვეყნდა!"}
                  </p>
                  <p className="text-sm text-gray-500">
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
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl"
                  >
                    <AlertCircle
                      size={15}
                      className="text-red-500 shrink-0 mt-0.5"
                    />
                    <p className="text-sm font-bold text-red-600 flex-1">
                      {error}
                    </p>
                    <button
                      type="button"
                      onClick={() => setError(null)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Listing Type */}
              <div>
                <p className={lbl}>განცხადების ტიპი</p>
                <div className="grid grid-cols-3 gap-3">
                  {listingTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setForm({ ...form, listingType: type.id })}
                      className={cn(
                        "p-3.5 rounded-2xl border-2 text-left transition-all",
                        form.listingType === type.id
                          ? type.id === "VIP"
                            ? "border-yellow-400 bg-yellow-50"
                            : type.id === "SILVER"
                              ? "border-gray-400 bg-gray-50"
                              : "border-green-500 bg-green-50"
                          : "border-gray-200 bg-white hover:border-gray-300",
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={cn(
                            "text-[10px] font-black uppercase tracking-wider",
                            form.listingType === type.id
                              ? type.id === "VIP"
                                ? "text-yellow-700"
                                : type.id === "SILVER"
                                  ? "text-gray-700"
                                  : "text-green-700"
                              : "text-gray-400",
                          )}
                        >
                          {type.name}
                        </span>
                        {type.icon}
                      </div>
                      <p className="text-base font-black text-gray-900">
                        {type.price}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {type.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* სათაური + კატეგორია */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>სათაური *</label>
                  <input
                    required
                    className={inp}
                    placeholder="მაგ: iPhone 13 Pro"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className={lbl}>კატეგორია *</label>
                  <select
                    required
                    className={cn(inp, "appearance-none")}
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    <option value="">აირჩიე კატეგორია</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ქალაქი + მდგომარეობა */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>ქალაქი *</label>
                  <select
                    required
                    className={cn(inp, "appearance-none")}
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  >
                    <option value="">აირჩიე ქალაქი</option>
                    {GEORGIAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={lbl}>მდგომარეობა *</label>
                  <div className="flex gap-2">
                    {[
                      { id: "NEW", label: "✨ ახალი" },
                      { id: "USED", label: "📦 მეორადი" },
                    ].map((cond) => (
                      <button
                        key={cond.id}
                        type="button"
                        onClick={() => setForm({ ...form, condition: cond.id })}
                        className={cn(
                          "flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all",
                          form.condition === cond.id
                            ? "bg-green-50 border-green-500 text-green-700"
                            : "bg-white border-gray-200 text-gray-500 hover:border-gray-300",
                        )}
                      >
                        {cond.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* აღწერა */}
              <div>
                <label className={lbl}>აღწერა *</label>
                <textarea
                  required
                  rows={3}
                  className={cn(inp, "resize-none")}
                  placeholder="დაწვრილებით აღწერე ნივთი..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              {/* გაცვლა */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={lbl} style={{ margin: 0 }}>
                    რაში გინდა გაცვლა?
                  </label>
                  <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
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
                          "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                          form.wantedType === t.id
                            ? "bg-white text-green-700 shadow-sm border border-gray-200"
                            : "text-gray-500 hover:text-gray-700",
                        )}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {form.wantedType === "items" ? (
                  <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2].map((i) => (
                      <input
                        key={i}
                        className={cn(inp, "text-xs")}
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
                ) : (
                  <input
                    className={inp}
                    placeholder="მაგ: ავტომობილის შეკეთება, ვებ დიზაინი..."
                    value={form.serviceWanted}
                    onChange={(e) =>
                      setForm({ ...form, serviceWanted: e.target.value })
                    }
                  />
                )}
              </div>

              {/* ფოტოები */}
              <div>
                <label className={lbl}>
                  ფოტოები{" "}
                  <span className="text-gray-300 normal-case tracking-normal font-medium">
                    (მაქს 5)
                  </span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {form.images.map((img, i) => (
                    <div
                      key={i}
                      className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-200 group"
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
                      className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-all gap-1"
                    >
                      <Upload size={18} />
                      <span className="text-[9px] font-bold">ატვირთვა</span>
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

        {/* Footer */}
        {!success && (
          <div className="px-6 py-4 border-t border-gray-100 shrink-0 bg-gray-50/50">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3.5 rounded-2xl text-sm font-black hover:bg-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> მიმდინარეობს...
                </>
              ) : editingListing ? (
                "✓ განახლება"
              ) : (
                "🚀 გამოქვეყნება"
              )}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
