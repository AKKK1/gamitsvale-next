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
      <div
        className="flex items-center gap-3 rounded-2xl px-5 py-3 shadow-lg backdrop-blur-md"
        style={{
          background: "#ffffff",
          border: "1px solid #e8ebe8",
          boxShadow: "0 8px 32px rgba(26,138,74,0.12)",
        }}
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "#e6f5ec" }}
        >
          <CheckCircle2 size={14} style={{ color: "#1a8a4a" }} />
        </div>
        <span className="text-sm font-bold" style={{ color: "#111111" }}>
          {message}
        </span>
      </div>
    </div>
  );
}
