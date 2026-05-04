"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const GEORGIAN_CITIES = [
  "თბილისი",
  "ქუთაისი",
  "ბათუმი",
  "რუსთავი",
  "ზუგდიდი",
  "გორი",
  "ფოთი",
  "თელავი",
  "ხაშური",
  "სამტრედია",
  "მცხეთა",
  "ჭიათურა",
  "ზესტაფონი",
  "სენაკი",
  "ქობულეთი",
  "სიღნაღი",
  "ახმეტა",
  "საგარეჯო",
  "გურჯაანი",
  "დუშეთი",
  "მესტია",
  "ონი",
  "ამბროლაური",
];

export const CATEGORIES = [
  { id: "electronics", name: "ტექნოლოგია და ელექტრონიკა", icon: "📱" },
  { id: "serviceToThing", name: "მომს ნივთში", icon: "🧰" },
  { id: "thingToService", name: "ნივთი მომსახურებაში", icon: "🧰" },
  { id: "vehicles", name: "ტრანსპორტის გაცვლა დროებით", icon: "🚗" },
  { id: "vehiclesreal", name: "ტრანსპორტი", icon: "🛻" },

  { id: "realestate", name: "უძრავი ქონება", icon: "🏠" },
  { id: "clothing", name: "ტანსაცმელი და აქსესუარები", icon: "👗" },
  { id: "home", name: "სახლი და ბაღი", icon: "🏡" },
  { id: "agriculture", name: "სოფლის მეურნეობა", icon: "🌾" },
  { id: "tools", name: "ხელსაწყოები და აღჭურვილობა", icon: "🔧" },
  { id: "sports", name: "სპორტი და დასვენება", icon: "⚽" },
  { id: "kids", name: "ბავშვის ნივთები", icon: "🧸" },
  { id: "books", name: "წიგნები და განათლება", icon: "📚" },
  { id: "art", name: "ხელოვნება და კოლექცია", icon: "🎨" },
  { id: "animals", name: "ცხოველები", icon: "🐾" },
  { id: "beauty", name: "სილამაზე და ჯანმრთელობა", icon: "💄" },
  { id: "services", name: "სერვისები", icon: "🛠️" },
  { id: "games", name: "კომპიუტერული თამაშები", icon: "🎮" },

  { id: "carParts", name: "მანქანის ნაწილები", icon: "⚙️" },

  { id: "other", name: "სხვა", icon: "📦" },
];

interface RegisterExtra {
  lastName?: string;
  phone: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  telegram?: string;
}

interface AuthContextType {
  user: any;
  loading: boolean;
  loginWithGoogle: () => void;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    name: string,
    password: string,
    extra: RegisterExtra,
  ) => Promise<{ success: boolean; error?: string }>;
  verify: (
    email: string,
    code: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const loginWithGoogle = () => {
    const client = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      scope: "email profile",
      callback: async (response: any) => {
        if (response.access_token) {
          const userInfo = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            { headers: { Authorization: `Bearer ${response.access_token}` } },
          ).then((r) => r.json());

          const res = await fetch("/api/auth/google-success", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userInfo.email,
              name: userInfo.name,
              avatar: userInfo.picture,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            window.location.href = "/";
          }
        }
      },
    });
    client.requestAccessToken();
  };

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      window.location.href = "/";
      return { success: true };
    }
    const err = await res.json();
    return { success: false, error: err.error };
  };

  const register = async (
    email: string,
    name: string,
    password: string,
    extra: RegisterExtra,
  ) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        password,
        lastName: extra.lastName || "",
        phone: extra.phone,
        whatsapp: extra.whatsapp || "",
        telegram: extra.telegram || "",
      }),
    });
    if (res.ok) return { success: true };
    const err = await res.json();
    return { success: false, error: err.error };
  };

  const verify = async (email: string, code: string) => {
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      window.location.href = "/";
      return { success: true };
    }
    const err = await res.json();
    return { success: false, error: err.error };
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        login,
        register,
        verify,
        logout,
        refresh: fetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
