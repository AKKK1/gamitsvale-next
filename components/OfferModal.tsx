"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Camera,
  Send,
  Package,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface OfferModalProps {
  listing: any;
  onClose: () => void;
}

export default function OfferModal({ listing, onClose }: OfferModalProps) {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width,
            height = img.height;
          const max = 800;
          if (width > height) {
            if (width > max) {
              height *= max / width;
              width = max;
            }
          } else {
            if (height > max) {
              width *= max / height;
              height = max;
            }
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);
          setImages((prev) =>
            [...prev, canvas.toDataURL("image/jpeg", 0.7)].slice(0, 2),
          );
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing: listing._id,
          receiver: listing.owner._id,
          description,
          images,
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => onClose(), 2000);
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
        className="absolute inset-0 backdrop-blur-sm bg-black/40"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg bg-dark-card rounded-3xl border border-dark-border shadow-2xl overflow-hidden z-10"
      >
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 border-b border-dark-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight text-white">
                შეთავაზება <span className="text-gold">გაცვლაზე</span>
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                შეავსე ინფორმაცია და გაგზავნე
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-white hover:bg-dark rounded-xl transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="px-8 py-6 space-y-5 max-h-[70vh] overflow-y-auto no-scrollbar">
          {/* Success state */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-10 gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-emerald-400" />
                </div>
                <div className="text-center">
                  <p className="font-black text-white text-lg">გაიგზავნა!</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    შეთავაზება წარმატებით გადაეგზავნა
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
                    className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl"
                  >
                    <AlertCircle
                      size={18}
                      className="text-red-400 shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-bold text-red-400">{error}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setError(null)}
                      className="ml-auto text-red-400/50 hover:text-red-400"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Listing info */}
              <div className="flex items-center gap-3 p-4 bg-dark rounded-2xl border border-dark-border">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                  <Package size={18} className="text-gold" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    განცხადება
                  </p>
                  <p className="font-bold text-white text-sm truncate">
                    {listing.title}
                  </p>
                </div>
              </div>

              {/* Limits info */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "ერთ განცხადებაზე", value: "3 შეთავაზება" },
                  { label: "დღიური ლიმიტი", value: "15 შეთავაზება" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-3 bg-dark rounded-xl border border-dark-border/50 text-center"
                  >
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">
                      {item.label}
                    </p>
                    <p className="text-xs font-black text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  შენი შეთავაზება
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-5 py-4 bg-dark border border-dark-border rounded-2xl outline-none focus:border-gold transition-all font-medium resize-none text-white placeholder:text-zinc-700 text-sm"
                  placeholder="აღწერე რას სთავაზობ სანაცვლოდ..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Images */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  ფოტოები <span className="text-zinc-700">(მაქს 2)</span>
                </label>
                <div className="flex gap-3">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative w-20 h-20 rounded-xl overflow-hidden border border-dark-border group"
                    >
                      <img src={img} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() =>
                          setImages(images.filter((_, idx) => idx !== i))
                        }
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {images.length < 2 && (
                    <label className="w-20 h-20 rounded-xl border-2 border-dashed border-dark-border flex flex-col items-center justify-center text-zinc-600 hover:border-gold hover:text-gold cursor-pointer transition-all bg-dark/50 gap-1.5">
                      <Camera size={18} />
                      <span className="text-[8px] font-black uppercase tracking-widest">
                        ატვირთვა
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                disabled={loading}
                className="w-full bg-gold text-dark py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-gold/10"
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
                    იგზავნება...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send size={16} /> გაგზავნა
                  </span>
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
