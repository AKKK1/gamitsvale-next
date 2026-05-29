"use client";

import { useState, useEffect } from "react";

const C = {
  green: "#1a8a4a",
  greenDark: "#12683a",
  greenLight: "#e6f5ec",
  text: "#111111",
  text2: "#555555",
  text3: "#999999",
  border: "#e8ebe8",
  bg: "#ffffff",
  bg2: "#f8faf8",
};

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookieConsent = document.cookie
      .split("; ")
      .find((row) => row.startsWith("cookieConsent="));

    if (!cookieConsent) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const saveConsent = (value: "accepted" | "declined") => {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    document.cookie = `cookieConsent=${value}; path=/; expires=${expiryDate.toUTCString()}`;
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
        onClick={() => setIsVisible(false)}
        aria-label="ქუქი შეტყობინების დახურვა"
      />

      <div
        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-6 md:max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500"
        role="alertdialog"
        aria-labelledby="cookie-title"
      >
        <div
          className="rounded-2xl p-5 shadow-2xl"
          style={{
            background: C.bg,
            border: `1px solid ${C.border}`,
            boxShadow: "0 22px 60px rgba(15,23,42,0.14)",
          }}
        >
          <div className="mb-4 flex items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
              style={{ background: C.greenLight, color: C.green }}
            >
              🍪
            </div>
            <div>
              <p
                className="mb-1 text-[10px] font-black uppercase tracking-widest"
                style={{ color: C.green }}
              >
                gamitsvale.ge
              </p>
              <h2
                id="cookie-title"
                className="text-base font-black leading-tight"
                style={{ color: C.text }}
              >
                ქუქი და კონფიდენციალურობა
              </h2>
            </div>
          </div>

          <p className="mb-4 text-sm leading-relaxed" style={{ color: C.text2 }}>
            ვიყენებთ აუცილებელ ქუქებს ავტორიზაციისა და უსაფრთხოებისთვის.
            თქვენი პირადი მონაცემები დაცულია და მესამე პირებთან არ ზიარდება.{" "}
            <a
              href="/legal"
              className="font-bold hover:underline"
              style={{ color: C.green }}
            >
              კონფიდენციალურობის პოლიტიკა
            </a>
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => saveConsent("declined")}
              className="flex-1 rounded-xl px-4 py-3 text-sm font-bold transition-all"
              style={{
                background: C.bg2,
                border: `1px solid ${C.border}`,
                color: C.text2,
                cursor: "pointer",
              }}
            >
              უარი
            </button>
            <button
              type="button"
              onClick={() => saveConsent("accepted")}
              className="flex-1 rounded-xl px-4 py-3 text-sm font-black text-white transition-all"
              style={{
                background: C.green,
                cursor: "pointer",
                boxShadow: "0 12px 24px rgba(26,138,74,0.22)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.greenDark;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = C.green;
              }}
            >
              დაშვება
            </button>
          </div>

          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="text-xs font-medium transition-colors"
              style={{ color: C.text3, cursor: "pointer" }}
            >
              დახურვა
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
