// app/categories/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/components/AuthProvider";
import Header from "@/components/Header";

const GREEN = "#1a8a4a";
const GREEN_LIGHT = "#e6f5ec";
const GOLD = "#c8820a";
const GOLD_LIGHT = "#fffdf4";
const BORDER = "#e8ebe8";

function useCategoryCounts() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/listings?counts=1")
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d === "object" && !Array.isArray(d)) setCounts(d);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { counts, loading };
}

function CountBadge({
  catId,
  counts,
  loading,
  light = false,
}: {
  catId: string;
  counts: Record<string, number>;
  loading: boolean;
  light?: boolean;
}) {
  if (loading) {
    return (
      <span
        style={{
          display: "inline-block",
          width: 28,
          height: 9,
          borderRadius: 4,
          background: light ? "rgba(255,255,255,0.3)" : "#e8ebe8",
        }}
      />
    );
  }
  return (
    <span
      style={{ fontSize: 11, color: light ? "rgba(255,255,255,0.8)" : "#999" }}
    >
      <strong style={{ color: light ? "#fff" : GOLD }}>
        {counts[catId] ?? 0}
      </strong>{" "}
      განცხ.
    </span>
  );
}

export default function CategoriesPage() {
  const { counts, loading } = useCategoryCounts();

  // vehicles + realestate ოქროს ბლოკში ცალკე — დანარჩენი grid-ში
  const regularCats = CATEGORIES.filter(
    (c) => c.id !== "vehicles" && c.id !== "realestate",
  );

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div style={{ background: "#f8faf8", minHeight: "100vh" }}>
      <Header onAddListing={() => {}} onSearch={() => {}} />

      <div className="max-w-[1100px] mx-auto px-4 py-10">
        {/* ← მთავარზე */}
        <Link
          href="/"
          style={{
            color: GREEN,
            fontSize: 13,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            marginBottom: 20,
          }}
        >
          ← მთავარზე
        </Link>

        {/* სათაური */}
        <div className="mb-6">
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 26,
              fontWeight: 800,
              color: "#111",
              marginBottom: 4,
            }}
          >
            🗂 ყველა კატეგორია
          </h1>
          <p style={{ color: "#999", fontSize: 13 }}>
            {loading ? (
              <span
                style={{
                  display: "inline-block",
                  width: 100,
                  height: 13,
                  borderRadius: 4,
                  background: "#e8ebe8",
                }}
              />
            ) : (
              <>
                სულ <strong style={{ color: GOLD }}>{total}</strong> განცხადება
                ყველა კატეგორიაში
              </>
            )}
          </p>
        </div>

        {/* ══ ოქროსფერი: დროებითი გაცვლა ══ */}
        <div
          className="rounded-[14px] p-5 mb-5"
          style={{ border: `1.5px solid ${GOLD}`, background: GOLD_LIGHT }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#111",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              დროებითი გაცვლა
            </span>
            <span
              style={{
                background: GOLD,
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
                borderRadius: 99,
                padding: "2px 10px",
              }}
            >
              იურიდიული
            </span>
          </div>
          <p style={{ fontSize: 12, color: "#999", marginBottom: 16 }}>
            იურიდიული დოკუმენტებით ვეხმარებით — ორივე მხარე დაცულია
          </p>

          {/* დროებითი */}
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: GOLD,
              marginBottom: 8,
            }}
          >
            ⏳ დროებითი გაცვლა
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 14,
            }}
          >
            {[
              {
                href: "/swap-temporary/vehicles",
                icon: "🚗",
                label: "ტრანსპორტის გაცვლა დროებით",
                catId: "vehicles",
              },
              {
                href: "/swap-temporary/realestate",
                icon: "🏠",
                label: "სახლების გაცვლა დროებით",
                catId: "realestate",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ textDecoration: "none", flex: "1 1 180px" }}
              >
                <div
                  style={{
                    background: GOLD,
                    borderRadius: 10,
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                    transition: "all .18s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "0.85";
                    (e.currentTarget as HTMLElement).style.transform =
                      "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "1";
                    (e.currentTarget as HTMLElement).style.transform =
                      "translateY(0)";
                  }}
                >
                  <span style={{ fontSize: 26 }}>{item.icon}</span>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#fff",
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {item.label}
                    </div>
                    <CountBadge
                      catId={item.catId}
                      counts={counts}
                      loading={loading}
                      light
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* ჩვეულებრივი */}
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#999",
              marginBottom: 8,
            }}
          >
            ♾ ჩვეულებრივი გაცვლა
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              {
                href: "/category/vehicles",
                icon: "🚗",
                label: "ტრანსპორტი",
                catId: "vehicles",
              },
              {
                href: "/category/realestate",
                icon: "🏠",
                label: "უძრავი ქონება",
                catId: "realestate",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ textDecoration: "none", flex: "1 1 180px" }}
              >
                <div
                  style={{
                    background: "#fff",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 10,
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                    transition: "all .18s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = GREEN;
                    el.style.background = GREEN_LIGHT;
                    el.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = BORDER;
                    el.style.background = "#fff";
                    el.style.transform = "translateY(0)";
                  }}
                >
                  <span style={{ fontSize: 26 }}>{item.icon}</span>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#111",
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {item.label}
                    </div>
                    <CountBadge
                      catId={item.catId}
                      counts={counts}
                      loading={loading}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ══ ყველა დანარჩენი კატეგ. grid ══ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))",
            gap: 10,
          }}
        >
          {regularCats.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  background: "#fff",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 12,
                  padding: "18px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all .18s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = GREEN;
                  el.style.background = GREEN_LIGHT;
                  el.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = BORDER;
                  el.style.background = "#fff";
                  el.style.transform = "translateY(0)";
                }}
              >
                <span
                  style={{
                    fontSize: 28,
                    background: "#f8faf8",
                    borderRadius: 10,
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  {cat.icon}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#111",
                    fontFamily: "'Space Grotesk', sans-serif",
                    lineHeight: 1.3,
                    marginBottom: 4,
                  }}
                >
                  {cat.name}
                </span>
                <CountBadge catId={cat.id} counts={counts} loading={loading} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
