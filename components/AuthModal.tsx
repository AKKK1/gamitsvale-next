"use client";

// ეს კომპონენტი Header.tsx-ში AuthModal ფუნქციას ჩაანაცვლებს
// ან ცალკე ფაილად შეინახე: components/AuthModal.tsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useAuth } from "./AuthProvider";

interface AuthModalProps {
  type: "login" | "register";
  onClose: () => void;
}

export function AuthModal({ type, onClose }: AuthModalProps) {
  const { login, register, verify, loginWithGoogle } = useAuth();

  const [step, setStep] = useState<"form" | "verify" | "forgot" | "reset">(
    "form",
  );
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    lastName: "",
    phone: "",
    instagram: "",
    facebook: "",
    code: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inp =
    "w-full px-4 py-3 bg-dark border border-dark-border rounded-xl outline-none focus:border-gold transition-colors text-sm text-white placeholder:text-zinc-600";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (type === "login") {
        if (step === "forgot") {
          const res = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.email }),
          });
          if (res.ok) setStep("reset");
          else {
            const data = await res.json();
            setError(data.error || "კოდის გაგზავნა ვერ მოხერხდა");
          }
        } else if (step === "reset") {
          const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: formData.email,
              code: formData.code,
              newPassword: formData.newPassword,
            }),
          });
          if (res.ok) {
            setStep("form");
            setError("");
          } else {
            const data = await res.json();
            setError(data.error || "პაროლის შეცვლა ვერ მოხერხდა");
          }
        } else {
          const res = await login(formData.email, formData.password);
          if (res.success) onClose();
          else setError(res.error || "ავტორიზაცია ვერ მოხერხდა");
        }
      } else {
        // register
        if (step === "form") {
          const res = await register(
            formData.email,
            formData.name,
            formData.password,
            {
              lastName: formData.lastName,
              phone: formData.phone,
              instagram: formData.instagram,
              facebook: formData.facebook,
            },
          );
          if (res.success) setStep("verify");
          else setError(res.error || "რეგისტრაცია ვერ მოხერხდა");
        } else {
          const res = await verify(formData.email, formData.code);
          if (res.success) onClose();
          else setError(res.error || "ვერიფიკაცია ვერ მოხერხდა");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = () => {
    window.location.href = "/api/auth/facebook";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 backdrop-blur-sm bg-black/50"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-md bg-dark-card border border-dark-border rounded-3xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto no-scrollbar"
      >
        <div className="p-8">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-zinc-500 hover:text-white rounded-full transition-colors"
          >
            <X size={24} />
          </button>

          <h2 className="text-2xl font-black mb-6 text-center text-white">
            {step === "forgot"
              ? "პაროლის აღდგენა"
              : step === "reset"
                ? "ახალი პაროლი"
                : step === "verify"
                  ? "ვერიფიკაცია"
                  : type === "login"
                    ? "შესვლა"
                    : "რეგისტრაცია"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ── REGISTER FORM ── */}
            {type === "register" && step === "form" && (
              <>
                {/* სახელი + გვარი */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                      სახელი *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="გიორგი"
                      className={inp}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                      გვარი
                    </label>
                    <input
                      type="text"
                      placeholder="მამულაშვილი"
                      className={inp}
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* მეილი */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                    მეილი *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="email@gmail.com"
                    className={inp}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                {/* ტელეფონი */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                    ტელეფონი *
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="+995 5XX XXX XXX"
                    className={inp}
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                {/* პაროლი */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                    პაროლი *
                  </label>
                  <input
                    required
                    type="password"
                    minLength={6}
                    placeholder="მინიმუმ 6 სიმბოლო"
                    className={inp}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>

                {/* სოც ქსელები */}
                <div className="pt-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-3">
                    სოციალური ქსელები (არასავალდებულო)
                  </p>
                  <div className="space-y-3">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                        📸
                      </span>
                      <input
                        type="text"
                        placeholder="Instagram username"
                        className={`${inp} pl-10`}
                        value={formData.instagram}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            instagram: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                        🔵
                      </span>
                      <input
                        type="text"
                        placeholder="Facebook profile URL"
                        className={`${inp} pl-10`}
                        value={formData.facebook}
                        onChange={(e) =>
                          setFormData({ ...formData, facebook: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── LOGIN FORM ── */}
            {type === "login" && (step === "form" || step === "forgot") && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                    მეილი
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="email@gmail.com"
                    className={inp}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                {step === "form" && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        პაროლი
                      </label>
                      <button
                        type="button"
                        onClick={() => setStep("forgot")}
                        className="text-[10px] font-bold text-gold hover:underline"
                      >
                        დაგავიწყდათ?
                      </button>
                    </div>
                    <input
                      required
                      type="password"
                      minLength={6}
                      className={inp}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                )}
              </>
            )}

            {/* ── RESET PASSWORD ── */}
            {step === "reset" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                    აღდგენის კოდი
                  </label>
                  <input
                    required
                    type="text"
                    maxLength={6}
                    className={`${inp} text-center text-2xl tracking-[10px]`}
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                    ახალი პაროლი
                  </label>
                  <input
                    required
                    type="password"
                    minLength={6}
                    className={inp}
                    value={formData.newPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, newPassword: e.target.value })
                    }
                  />
                </div>
              </>
            )}

            {/* ── VERIFY ── */}
            {step === "verify" && (
              <div className="space-y-1.5">
                <p className="text-sm text-zinc-400 text-center mb-4">
                  ვერიფიკაციის კოდი გამოგზავნილია{" "}
                  <span className="text-gold font-bold">{formData.email}</span>
                  -ზე
                </p>
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                  6-ნიშნა კოდი
                </label>
                <input
                  required
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  className={`${inp} text-center text-2xl tracking-[10px]`}
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                />
              </div>
            )}

            {error && (
              <p className="text-xs text-red-400 text-center font-bold bg-red-500/10 py-2 px-3 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-dark py-3.5 rounded-xl text-sm font-black hover:brightness-110 transition-all disabled:opacity-50 mt-2 uppercase tracking-widest"
            >
              {loading
                ? "გთხოვთ დაელოდოთ..."
                : step === "forgot"
                  ? "კოდის გაგზავნა"
                  : step === "reset"
                    ? "პაროლის შეცვლა"
                    : step === "verify"
                      ? "დადასტურება"
                      : type === "login"
                        ? "შესვლა"
                        : "რეგისტრაცია"}
            </button>

            {(step === "forgot" || step === "reset") && (
              <button
                type="button"
                onClick={() => setStep("form")}
                className="w-full text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-gold transition-colors text-center mt-2"
              >
                ← უკან
              </button>
            )}
          </form>

          {/* ── Social login — მხოლოდ form step-ზე ── */}
          {step === "form" && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dark-border" />
                </div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                  <span className="bg-dark-card px-4 text-zinc-500">ან</span>
                </div>
              </div>

              <div className="space-y-3">
                {/* Google */}
                <button
                  type="button"
                  onClick={() => {
                    loginWithGoogle();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-3 py-3 border border-dark-border bg-dark rounded-xl text-sm font-bold text-white hover:border-gold/30 transition-all"
                >
                  <img
                    src="https://www.google.com/favicon.ico"
                    className="w-4 h-4"
                    alt="Google"
                  />
                  Google-ით შესვლა
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  className="w-full flex items-center justify-center gap-3 py-3 border border-dark-border bg-[#1877F2]/10 rounded-xl text-sm font-bold text-[#1877F2] hover:bg-[#1877F2]/20 hover:border-[#1877F2]/30 transition-all"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="#1877F2"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook-ით შესვლა
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
