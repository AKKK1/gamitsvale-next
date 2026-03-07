"use client";

import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] animate-fade-up">
      <div className="flex items-center gap-3 bg-dark-card border border-gold/30 rounded-2xl px-5 py-3 shadow-2xl shadow-black/50 backdrop-blur-md">
        <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
          <CheckCircle2 size={14} className="text-gold" />
        </div>
        <span className="text-sm font-bold text-white">{message}</span>
      </div>
    </div>
  );
}
