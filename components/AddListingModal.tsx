"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import {
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  Star,
  ShieldCheck,
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
    images: [] as string[],
    listingType: "NORMAL",
  });
  const [loading, setLoading] = useState(false);
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
        alert("ფოტოს ატვირთვა ვერ მოხერხდა");
        return;
      }
      const data = await res.json();
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...data.urls].slice(0, 5),
      }));
    } catch {
      alert("ფოტოს ატვირთვა ვერ მოხერხდა");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.images.length === 0)
      return alert("გთხოვთ ატვირთოთ მინიმუმ 1 ფოტო");
    if (!form.title.trim()) return alert("სათაური სავალდებულოა");
    if (!form.category) return alert("კატეგორია სავალდებულოა");
    if (!form.city) return alert("ქალაქი სავალდებულოა");
    if (!form.description.trim()) return alert("აღწერა სავალდებულოა");
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
          wantedItems: form.wantedItems.filter((i) => i.trim() !== ""),
        }),
      });
      if (res.ok) {
        onRefresh();
        onClose();
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch {
      alert("დაფიქსირდა შეცდომა");
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
        className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-dark-card border border-dark-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10"
      >
        <div className="flex items-center justify-between p-5 border-b border-dark-border bg-dark/30 shrink-0">
          <h2 className="text-xl font-bold text-white">
            {editingListing ? "განცხადების რედაქტირება" : "ახალი განცხადება"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-white hover:bg-dark rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto no-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
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

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                რაში გინდა გაცვლა? (მაქს 3)
              </label>
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
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                ფოტოები (მაქს 5)
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
        </div>

        <div className="p-5 border-t border-dark-border bg-dark/30 shrink-0">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gold text-dark py-3 rounded-lg text-sm font-bold hover:bg-gold-hover transition-all disabled:opacity-50"
          >
            {loading
              ? "მიმდინარეობს..."
              : editingListing
                ? "განახლება"
                : "გამოქვეყნება"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
