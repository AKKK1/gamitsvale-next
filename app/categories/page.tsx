// app/categories/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/components/AuthProvider";
import Header from "@/components/Header";

const GOLD = "#D4AF37";
const GREEN = "#1a8a4a";

function useCategoryCounts() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/listings?counts=1")
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d === "object") setCounts(d);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  return { counts, loading };
}

function Pill({ loading }: { loading: boolean }) {
  if (loading)
    return (
      <span
        style={{
          display: "inline-block",
          width: 28,
          height: 10,
          borderRadius: 4,
          background: "#e8ebe8",
        }}
      />
    );
  return null;
}

export default function CategoriesPage() {
  const { counts, loading } = useCategoryCounts();

  return (
    <div style={{ background: "#f8faf8", minHeight: "100vh" }}>
      <Header onAddListing={() => {}} onSearch={() => {}} />

      <div className="max-w-[1100px] mx-auto px-4 py-10">
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

        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 26,
            fontWeight: 800,
            color: "#111",
            marginBottom: 6,
          }}
        >
          🗂 ყველა კატეგორია
        </h1>
        <p style={{ color: "#999", fontSize: 13, marginBottom: 28 }}>
          აირჩიე კატეგორია, ნახე ყველა განცხადება
        </p>

        {/* ── Temporary swap block ── */}
        <div
          style={{
            border: `1.5px solid ${GOLD}`,
            borderRadius: 14,
            background: "#fffdf4",
            padding: "18px 20px",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: 15,
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
              დროებითი
            </span>
          </div>
          <p style={{ fontSize: 12, color: "#999", marginBottom: 14 }}>
            იურიდიული დოკუმენტებით ვეხმარებით — ორივე მხარე დაცულია
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              {
                catId: "vehicles",
                label: "ტრანსპორტის გაცვლა",
                icon: "🚗",
                route: "/swap-temporary/vehicles",
              },
              {
                catId: "realestate",
                label: "სახლების გაცვლა",
                icon: "🏠",
                route: "/swap-temporary/realestate",
              },
            ].map((item) => (
              <Link
                key={item.catId}
                href={item.route}
                style={{ textDecoration: "none", flex: "1 1 160px" }}
              >
                <div
                  style={{
                    background: GOLD,
                    borderRadius: 10,
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    transition: "opacity .15s, transform .15s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.opacity = "0.82";
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.opacity = "1";
                    (e.currentTarget as HTMLDivElement).style.transform =
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
                    <span
                      style={{ fontSize: 11, color: "rgba(255,255,255,0.85)" }}
                    >
                      {loading ? (
                        <Pill loading={loading} />
                      ) : (
                        <>
                          <strong style={{ color: "#fff" }}>
                            {counts[item.catId] ?? 0}
                          </strong>{" "}
                          განცხ.
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── All other categories ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 10,
          }}
        >
          {CATEGORIES.filter(
            (c) => c.id !== "vehicles" && c.id !== "realestate",
          ).map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e8ebe8",
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
                  const d = e.currentTarget as HTMLDivElement;
                  d.style.borderColor = GREEN;
                  d.style.background = "#e6f5ec";
                  d.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  const d = e.currentTarget as HTMLDivElement;
                  d.style.borderColor = "#e8ebe8";
                  d.style.background = "#fff";
                  d.style.transform = "translateY(0)";
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
                <span style={{ fontSize: 11, color: "#999" }}>
                  {loading ? (
                    <Pill loading={loading} />
                  ) : (
                    <>
                      <strong style={{ color: GOLD }}>
                        {counts[cat.id] ?? 0}
                      </strong>{" "}
                      განცხ.
                    </>
                  )}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
