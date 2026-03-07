"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import Header from "@/components/Header";
import AddListingModal from "@/components/AddListingModal";
import { motion, AnimatePresence } from "motion/react";
import { Users, Package, BarChart3, Shield, Trash2 } from "lucide-react";

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

export default function AdminPanel() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminCreds, setAdminCreds] = useState({ id: "", pass: "" });

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchStats();
      fetchUsers();
      fetchListings();
    }
  }, [isAdminLoggedIn]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: adminCreds.id, pass: adminCreds.pass }),
      });
      if (res.ok) setIsAdminLoggedIn(true);
      else {
        const err = await res.json();
        alert(err.error || "არასწორი მონაცემები");
      }
    } catch {
      alert("სერვერთან კავშირი ვერ დამყარდა");
    }
  };

  const fetchStats = async () => {
    const res = await fetch("/api/admin/stats");
    setStats(await res.json());
  };
  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    setUsers(await res.json());
  };
  const fetchListings = async () => {
    const res = await fetch("/api/listings");
    setListings(await res.json());
  };

  const handleAddBalance = async (userId: string) => {
    const amount = prompt("შეიყვანეთ თანხა:");
    if (!amount) return;
    await fetch(`/api/admin/users/${userId}/balance`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseInt(amount) }),
    });
    fetchUsers();
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm("დარწმუნებული ხართ?")) return;
    await fetch(`/api/admin/listings/${id}`, { method: "DELETE" });
    fetchListings();
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/80 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-black rounded-[40px] p-10 shadow-2xl"
        >
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-zinc-900 text-white rounded-2xl">
              <Shield size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-black text-center mb-8 tracking-tight">
            ადმინ <span className="text-gold">ავტორიზაცია</span>
          </h1>
          <form onSubmit={handleAdminLogin} className="space-y-6">
            {[
              {
                name: "id",
                label: "ID",
                type: "text",
                value: adminCreds.id,
                onChange: (v: string) =>
                  setAdminCreds({ ...adminCreds, id: v }),
              },
              {
                name: "pass",
                label: "პაროლი",
                type: "password",
                value: adminCreds.pass,
                onChange: (v: string) =>
                  setAdminCreds({ ...adminCreds, pass: v }),
              },
            ].map((f) => (
              <div key={f.name} className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  {f.label}
                </label>
                <input
                  type={f.type}
                  required
                  value={f.value}
                  onChange={(e) => f.onChange(e.target.value)}
                  className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-gold font-bold"
                />
              </div>
            ))}
            <button className="w-full bg-zinc-900 text-white py-5 rounded-3xl text-lg font-black hover:bg-gold transition-all">
              შესვლა
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN")
    return <div className="p-20 text-center font-bold">წვდომა აკრძალულია</div>;

  return (
    <div className="min-h-screen bg-black">
      <Header onAddListing={() => setShowAddModal(true)} />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-3 bg-zinc-900 text-black rounded-2xl">
            <Shield size={24} />
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            ადმინ <span className="text-gold">პანელი</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: <Users className="text-gold" />,
              label: "მომხმარებლები",
              value: stats?.users || 0,
            },
            {
              icon: <Package className="text-gold" />,
              label: "განცხადებები",
              value: stats?.listings || 0,
            },
            {
              icon: <BarChart3 className="text-gold" />,
              label: "შეთავაზებები",
              value: stats?.offers || 0,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-black p-8 rounded-[32px] border border-zinc-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                {s.icon}
                <span className="text-xs font-black uppercase tracking-widest text-zinc-400">
                  {s.label}
                </span>
              </div>
              <div className="text-4xl font-black">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-black rounded-[32px] border border-zinc-100 shadow-sm overflow-hidden mb-12">
          <div className="p-8 border-b border-zinc-50">
            <h3 className="text-xl font-black">მომხმარებლები</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  <th className="px-8 py-4">სახელი</th>
                  <th className="px-8 py-4">ბალანსი</th>
                  <th className="px-8 py-4">როლი</th>
                  <th className="px-8 py-4">მოქმედება</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {users.map((u) => (
                  <tr key={u._id} className="text-sm font-medium">
                    <td className="px-8 py-4 flex items-center gap-3">
                      <img
                        src={u.avatar || "https://www.gravatar.com/avatar?d=mp"}
                        className="w-8 h-8 rounded-full"
                        referrerPolicy="no-referrer"
                      />
                      {u.name}
                    </td>
                    <td className="px-8 py-4 font-black">{u.balance} ₾</td>
                    <td className="px-8 py-4">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black",
                          u.role === "ADMIN"
                            ? "bg-gold text-black"
                            : "bg-zinc-100 text-zinc-500",
                        )}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <button
                        onClick={() => handleAddBalance(u._id)}
                        className="text-gold hover:underline"
                      >
                        ბალანსის შევსება
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-black rounded-[32px] border border-zinc-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-zinc-50">
            <h3 className="text-xl font-black">განცხადებები</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  <th className="px-8 py-4">სათაური</th>
                  <th className="px-8 py-4">სტატუსი</th>
                  <th className="px-8 py-4">მოქმედება</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {listings.map((l) => (
                  <tr key={l._id} className="text-sm font-medium">
                    <td className="px-8 py-4">{l.title}</td>
                    <td className="px-8 py-4">
                      {(l.isVIP || l.listingType === "VIP") && (
                        <span className="text-gold font-black mr-2">VIP</span>
                      )}
                      {l.isTraded && (
                        <span className="text-green-500 font-black">
                          გაცვლილი
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-4">
                      <button
                        onClick={() => handleDeleteListing(l._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showAddModal && (
          <AddListingModal
            onClose={() => setShowAddModal(false)}
            onRefresh={fetchListings}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
