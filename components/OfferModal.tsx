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
  Loader2,
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
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden z-10"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-black text-gray-900">
              შეთავაზება <span className="text-green-600">გაცვლაზე</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              შეავსე ინფორმაცია და გაგზავნე
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto space-y-4">
          {/* Success */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-10 gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-green-600" />
                </div>
                <div className="text-center">
                  <p className="font-black text-gray-900 text-xl mb-1">
                    გაიგზავნა! 🎉
                  </p>
                  <p className="text-sm text-gray-500">
                    შეთავაზება წარმატებით გადაეგზავნა
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-2xl"
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

              {/* განცხადება */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                  <Package size={18} className="text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    განცხადება
                  </p>
                  <p className="font-bold text-gray-900 text-sm truncate">
                    {listing.title}
                  </p>
                </div>
              </div>

              {/* ლიმიტი */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "ერთ განცხადებაზე", value: "3 შეთავაზება" },
                  { label: "დღიური ლიმიტი", value: "15 შეთავაზება" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center"
                  >
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                      {item.label}
                    </p>
                    <p className="text-xs font-black text-gray-900">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* შეთავაზება */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                  შენი შეთავაზება *
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all text-sm text-gray-900 placeholder:text-gray-400 resize-none font-medium"
                  placeholder="აღწერე რას სთავაზობ სანაცვლოდ..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* ფოტოები */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                  ფოტოები{" "}
                  <span className="text-gray-300 normal-case tracking-normal font-medium">
                    (მაქს 2)
                  </span>
                </label>
                <div className="flex gap-3">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-200 group"
                    >
                      <img src={img} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() =>
                          setImages(images.filter((_, idx) => idx !== i))
                        }
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {images.length < 2 && (
                    <label className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-green-500 hover:text-green-600 hover:bg-green-50 cursor-pointer transition-all gap-1">
                      <Camera size={18} />
                      <span className="text-[9px] font-bold">ატვირთვა</span>
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

              {/* ღილაკი */}
              <button
                disabled={loading}
                className="w-full bg-green-600 text-white py-3.5 rounded-2xl text-sm font-black hover:bg-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> იგზავნება...
                  </>
                ) : (
                  <>
                    <Send size={15} /> გაგზავნა
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
