"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { X, Camera } from "lucide-react";

interface OfferModalProps {
  listing: any;
  onClose: () => void;
}

export default function OfferModal({ listing, onClose }: OfferModalProps) {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

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
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setImages((prev) => [...prev, dataUrl].slice(0, 2));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
        alert("შეთავაზება გაიგზავნა!");
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
        className="absolute inset-0  backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-dark-card rounded-[40px] border border-dark-border shadow-2xl overflow-hidden p-10 z-10"
      >
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-black tracking-tight">
            შეთავაზება <span className="text-gold">გაცვლაზე</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="p-5 bg-dark rounded-2xl border border-dark-border">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">
              ნივთი
            </h4>
            <p className="font-bold text-white">{listing.title}</p>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              შენი შეთავაზება
            </label>
            <textarea
              required
              rows={4}
              className="w-full px-6 py-5 bg-dark border border-dark-border rounded-2xl outline-none focus:border-gold transition-all font-medium resize-none text-white placeholder:text-zinc-700"
              placeholder="აღწერე რას სთავაზობ სანაცვლოდ..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              ფოტოები (მაქს 2)
            </label>
            <div className="flex gap-4">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="relative w-24 h-24 rounded-2xl overflow-hidden border border-dark-border group"
                >
                  <img src={img} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() =>
                      setImages(images.filter((_, idx) => idx !== i))
                    }
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {images.length < 2 && (
                <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-dark-border flex flex-col items-center justify-center text-zinc-500 hover:border-gold hover:text-gold cursor-pointer transition-all bg-dark/50">
                  <Camera size={24} />
                  <span className="text-[8px] font-black mt-2 uppercase tracking-widest">
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

          <button
            disabled={loading}
            className="w-full bg-gold text-dark py-5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl hover:bg-gold-hover transition-all disabled:opacity-50"
          >
            {loading ? "იგზავნება..." : "გაგზავნა"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
