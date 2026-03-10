"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import Header from "@/components/Header";
import { motion } from "motion/react";
import {
  Users,
  Package,
  BarChart3,
  Shield,
  Trash2,
  Ban,
  CheckCircle2,
  Search,
  TrendingUp,
  Calendar,
  Settings,
  Save,
  UserX,
} from "lucide-react";

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

type Tab = "stats" | "users" | "listings" | "settings";

export default function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("stats");
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminCreds, setAdminCreds] = useState({ id: "", pass: "" });
  const [userSearch, setUserSearch] = useState("");
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchStats();
      fetchUsers();
      fetchListings();
      fetchSettings();
    }
  }, [isAdminLoggedIn]);

  useEffect(() => {
    if (isAdminLoggedIn) fetchUsers();
  }, [userSearch]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: adminCreds.id, pass: adminCreds.pass }),
    });
    if (res.ok) setIsAdminLoggedIn(true);
    else alert("არასწორი მონაცემები");
  };

  const fetchStats = async () => {
    const res = await fetch("/api/admin/stats");
    setStats(await res.json());
  };

  const fetchUsers = async () => {
    const res = await fetch(
      `/api/admin/users${userSearch ? "?search=" + userSearch : ""}`,
    );
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
  };

  const fetchListings = async () => {
    const res = await fetch("/api/listings");
    const data = await res.json();
    setListings(Array.isArray(data) ? data : []);
  };

  const fetchSettings = async () => {
    const res = await fetch("/api/settings");
    setSettings(await res.json());
  };

  const handleAddBalance = async (userId: string) => {
    await fetch(`/api/admin/users/${userId}/balance`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 25 }),
    });
    fetchUsers();
  };

  const handleBlockUser = async (userId: string, isBlocked: boolean) => {
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBlocked: !isBlocked }),
    });
    fetchUsers();
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("ნამდვილად გსურთ მომხმარებლის წაშლა?")) return;
    await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    fetchUsers();
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm("ნამდვილად გსურთ განცხადების წაშლა?")) return;
    await fetch(`/api/admin/listings/${id}`, { method: "DELETE" });
    fetchListings();
  };

  const handleSaveSettings = async () => {
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  // ── Login ──
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-dark-card border border-dark-border rounded-3xl p-10 shadow-2xl"
        >
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-gold/10 text-gold rounded-2xl">
              <Shield size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-black text-center mb-8 tracking-tight text-white">
            ადმინ <span className="text-gold">ავტორიზაცია</span>
          </h1>
          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                ID
              </label>
              <input
                type="text"
                required
                value={adminCreds.id}
                onChange={(e) =>
                  setAdminCreds({ ...adminCreds, id: e.target.value })
                }
                className="w-full px-5 py-4 bg-dark border border-dark-border rounded-2xl outline-none focus:border-gold text-white font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                პაროლი
              </label>
              <input
                type="password"
                required
                value={adminCreds.pass}
                onChange={(e) =>
                  setAdminCreds({ ...adminCreds, pass: e.target.value })
                }
                className="w-full px-5 py-4 bg-dark border border-dark-border rounded-2xl outline-none focus:border-gold text-white font-bold"
              />
            </div>
            <button className="w-full bg-gold text-dark py-4 rounded-2xl text-base font-black hover:brightness-110 transition-all">
              შესვლა
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "stats", label: "სტატისტიკა", icon: BarChart3 },
    { id: "users", label: "მომხმარებლები", icon: Users },
    { id: "listings", label: "განცხადებები", icon: Package },
    { id: "settings", label: "პარამეტრები", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-dark text-white">
      <Header onAddListing={() => {}} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gold/10 text-gold rounded-2xl">
            <Shield size={24} />
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            ადმინ <span className="text-gold">პანელი</span>
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-dark-card border border-dark-border rounded-2xl p-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all",
                activeTab === tab.id
                  ? "bg-gold text-dark"
                  : "text-zinc-400 hover:text-white",
              )}
            >
              <tab.icon size={16} />
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── სტატისტიკა ── */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                {
                  icon: Users,
                  label: "მომხმარებლები",
                  value: stats?.users || 0,
                  color: "text-blue-400",
                },
                {
                  icon: Package,
                  label: "განცხადებები",
                  value: stats?.listings || 0,
                  color: "text-gold",
                },
                {
                  icon: BarChart3,
                  label: "შეთავაზებები",
                  value: stats?.offers || 0,
                  color: "text-purple-400",
                },
                {
                  icon: Calendar,
                  label: "დღეს რეგ.",
                  value: stats?.todayUsers || 0,
                  color: "text-green-400",
                },
                {
                  icon: TrendingUp,
                  label: "დღეს პოსტი",
                  value: stats?.todayListings || 0,
                  color: "text-orange-400",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-dark-card border border-dark-border rounded-2xl p-6"
                >
                  <s.icon size={20} className={cn("mb-3", s.color)} />
                  <div className="text-3xl font-black text-white mb-1">
                    {s.value}
                  </div>
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── მომხმარებლები ── */}
        {activeTab === "users" && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                type="text"
                placeholder="მოძებნე სახელით ან ემაილით..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white text-sm outline-none focus:border-gold"
              />
            </div>

            <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-dark-border flex items-center justify-between">
                <h3 className="font-black text-lg">მომხმარებლები</h3>
                <span className="text-xs text-zinc-500 font-bold">
                  {users.length} სულ
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-widest text-zinc-500 border-b border-dark-border">
                      <th className="px-6 py-3">სახელი</th>
                      <th className="px-6 py-3">ემაილი</th>
                      <th className="px-6 py-3">ბალანსი</th>
                      <th className="px-6 py-3">სტატუსი</th>
                      <th className="px-6 py-3">მოქმედება</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border">
                    {users.map((u) => (
                      <tr
                        key={u._id}
                        className={cn(
                          "text-sm transition-colors hover:bg-dark/50",
                          u.isBlocked && "opacity-50",
                        )}
                      >
                        <td className="px-6 py-4 font-bold text-white">
                          {u.name}
                        </td>
                        <td className="px-6 py-4 text-zinc-400 text-xs">
                          {u.email}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-black text-gold">
                            {u.balance} ₾
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={cn(
                              "px-2 py-1 rounded-lg text-[10px] font-black",
                              u.isBlocked
                                ? "bg-red-500/10 text-red-400"
                                : u.role === "ADMIN"
                                  ? "bg-gold/10 text-gold"
                                  : "bg-green-500/10 text-green-400",
                            )}
                          >
                            {u.isBlocked
                              ? "დაბლოკილი"
                              : u.role === "ADMIN"
                                ? "ADMIN"
                                : "აქტიური"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {/* +25₾ */}
                            <button
                              onClick={() => handleAddBalance(u._id)}
                              className="px-3 py-1.5 bg-gold/10 text-gold border border-gold/20 rounded-lg text-[10px] font-black hover:bg-gold hover:text-dark transition-all"
                            >
                              +25₾
                            </button>
                            {/* დაბლოკვა */}
                            <button
                              onClick={() =>
                                handleBlockUser(u._id, u.isBlocked)
                              }
                              className={cn(
                                "p-1.5 rounded-lg border transition-all",
                                u.isBlocked
                                  ? "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500 hover:text-white"
                                  : "bg-orange-500/10 border-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-white",
                              )}
                              title={u.isBlocked ? "განბლოკვა" : "დაბლოკვა"}
                            >
                              {u.isBlocked ? (
                                <CheckCircle2 size={14} />
                              ) : (
                                <Ban size={14} />
                              )}
                            </button>
                            {/* წაშლა */}
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                              title="წაშლა"
                            >
                              <UserX size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── განცხადებები ── */}
        {activeTab === "listings" && (
          <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-dark-border flex items-center justify-between">
              <h3 className="font-black text-lg">განცხადებები</h3>
              <span className="text-xs text-zinc-500 font-bold">
                {listings.length} სულ
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-widest text-zinc-500 border-b border-dark-border">
                    <th className="px-6 py-3">სათაური</th>
                    <th className="px-6 py-3">ტიპი</th>
                    <th className="px-6 py-3">სტატუსი</th>
                    <th className="px-6 py-3">მოქმედება</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border">
                  {listings.map((l) => (
                    <tr
                      key={l._id}
                      className="text-sm hover:bg-dark/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-white">
                        {l.title}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "px-2 py-1 rounded-lg text-[10px] font-black",
                            l.listingType === "VIP"
                              ? "bg-gold/10 text-gold"
                              : l.listingType === "SILVER"
                                ? "bg-zinc-400/10 text-zinc-300"
                                : "bg-dark text-zinc-500",
                          )}
                        >
                          {l.listingType || "NORMAL"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {l.isTraded ? (
                          <span className="text-[10px] font-black text-green-400">
                            გაცვლილი
                          </span>
                        ) : (
                          <span className="text-[10px] font-black text-zinc-500">
                            აქტიური
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteListing(l._id)}
                          className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── პარამეტრები ── */}
        {activeTab === "settings" && settings && (
          <div className="space-y-6 max-w-2xl">
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-5">
              <h3 className="font-black text-lg">საიტის პარამეტრები</h3>

              {[
                { key: "siteName", label: "საიტის სახელი" },
                { key: "seoTitle", label: "SEO სათაური" },
                { key: "seoDescription", label: "SEO აღწერა" },
                { key: "seoKeywords", label: "SEO საკვანძო სიტყვები" },
                { key: "contactEmail", label: "საკონტაქტო ემაილი" },
                { key: "facebookUrl", label: "Facebook URL" },
                { key: "instagramUrl", label: "Instagram URL" },
              ].map((f) => (
                <div key={f.key} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    {f.label}
                  </label>
                  <input
                    type="text"
                    value={settings[f.key] || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, [f.key]: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-dark border border-dark-border rounded-xl text-white text-sm outline-none focus:border-gold"
                  />
                </div>
              ))}

              <button
                onClick={handleSaveSettings}
                className={cn(
                  "w-full py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2",
                  settingsSaved
                    ? "bg-green-500 text-white"
                    : "bg-gold text-dark hover:brightness-110",
                )}
              >
                {settingsSaved ? (
                  <>
                    <CheckCircle2 size={16} /> შენახულია!
                  </>
                ) : (
                  <>
                    <Save size={16} /> შენახვა
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
