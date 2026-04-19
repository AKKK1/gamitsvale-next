"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Loader2 } from "lucide-react";
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
    "w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all text-sm text-gray-900 placeholder:text-gray-400";
  const lbl =
    "block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5";

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
            const d = await res.json();
            setError(d.error || "კოდის გაგზავნა ვერ მოხერხდა");
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
            const d = await res.json();
            setError(d.error || "პაროლის შეცვლა ვერ მოხერხდა");
          }
        } else {
          const res = await login(formData.email, formData.password);
          if (res.success) onClose();
          else setError(res.error || "ავტორიზაცია ვერ მოხერხდა");
        }
      } else {
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

  const titles: Record<string, string> = {
    forgot: "პაროლის აღდგენა",
    reset: "ახალი პაროლი",
    verify: "ვერიფიკაცია",
    form: type === "login" ? "შესვლა" : "რეგისტრაცია",
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
        className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 sm:p-8">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
          >
            <X size={18} />
          </button>

          <h2 className="text-2xl font-black text-gray-900 text-center mb-6">
            {titles[step]}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* REGISTER */}
            {type === "register" && step === "form" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={lbl}>სახელი *</label>
                    <input
                      required
                      type="text"
                      placeholder="სახელი"
                      className={inp}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={lbl}>გვარი</label>
                    <input
                      type="text"
                      placeholder="გვარი"
                      className={inp}
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className={lbl}>მეილი *</label>
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
                <div>
                  <label className={lbl}>ტელეფონი *</label>
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
                <div>
                  <label className={lbl}>პაროლი *</label>
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
                <div className="pt-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-3">
                    სოციალური ქსელები (არასავალდებულო)
                  </p>
                  <div className="space-y-3">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm">
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
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm">
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

            {/* LOGIN */}
            {type === "login" && (step === "form" || step === "forgot") && (
              <>
                <div>
                  <label className={lbl}>მეილი</label>
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
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className={lbl} style={{ margin: 0 }}>
                        პაროლი
                      </label>
                      <button
                        type="button"
                        onClick={() => setStep("forgot")}
                        className="text-[11px] font-bold text-green-600 hover:underline"
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

            {/* RESET */}
            {step === "reset" && (
              <>
                <div>
                  <label className={lbl}>აღდგენის კოდი</label>
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
                <div>
                  <label className={lbl}>ახალი პაროლი</label>
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

            {/* VERIFY */}
            {step === "verify" && (
              <div>
                <p className="text-sm text-gray-500 text-center mb-4">
                  ვერიფიკაციის კოდი გამოგზავნილია{" "}
                  <span className="text-green-600 font-bold">
                    {formData.email}
                  </span>
                  -ზე
                </p>
                <label className={lbl}>6-ნიშნა კოდი</label>
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

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-xs font-bold text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3.5 rounded-2xl text-sm font-black hover:bg-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> გთხოვთ
                  დაელოდოთ...
                </>
              ) : step === "forgot" ? (
                "კოდის გაგზავნა"
              ) : step === "reset" ? (
                "პაროლის შეცვლა"
              ) : step === "verify" ? (
                "✓ დადასტურება"
              ) : type === "login" ? (
                "შესვლა"
              ) : (
                "🚀 რეგისტრაცია"
              )}
            </button>

            {(step === "forgot" || step === "reset") && (
              <button
                type="button"
                onClick={() => setStep("form")}
                className="w-full text-xs font-bold text-gray-400 hover:text-green-600 transition-colors text-center"
              >
                ← უკან
              </button>
            )}
          </form>

          {/* Social login */}
          {step === "form" && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-xs font-black uppercase tracking-widest text-gray-300">
                    ან
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    loginWithGoogle();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-200 bg-white rounded-2xl text-sm font-bold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  <img
                    src="https://www.google.com/favicon.ico"
                    className="w-4 h-4"
                    alt="Google"
                  />
                  Google-ით შესვლა
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/api/auth/facebook";
                  }}
                  className="w-full flex items-center justify-center gap-3 py-3 border-2 border-blue-100 bg-blue-50 rounded-2xl text-sm font-bold text-blue-700 hover:bg-blue-100 transition-all"
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
