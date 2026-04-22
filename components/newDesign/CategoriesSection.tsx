"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/components/AuthProvider";

// ─── real counts via GET /api/listings?counts=1 ─────────────────────────────
function useCategoryCounts() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/listings?counts=1")
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === "object") setCounts(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { counts, loading };
}

// ─── special grouped blocks ──────────────────────────────────────────────────
const SPECIAL_GROUPS = [
  {
    id: "temporary-swap",
    label: "დროებითი გაცვლა",
    description: "იურიდიული დოკუმენტებით ვეხმარებით — ორივე მხარე დაცულია",
    gold: true,
    items: [
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
    ],
  },
  {
    id: "rural",
    label: "სახლი & სოფლის მეურნეობა",
    description: null,
    gold: false,
    items: [
      {
        catId: "home",
        label: "სახლი და ბაღი",
        icon: "🏡",
        route: "/category/home",
      },
      {
        catId: "agriculture",
        label: "სოფლის მეურნეობა",
        icon: "🌾",
        route: "/category/agriculture",
      },
    ],
  },
];

const SPECIAL_CAT_IDS = new Set(
  SPECIAL_GROUPS.flatMap((g) => g.items.map((i) => i.catId)),
);

// ─── skeleton pill shown while counts load ───────────────────────────────────
function CountText({
  count,
  loading,
  light,
}: {
  count?: number;
  loading: boolean;
  light?: boolean;
}) {
  if (loading) {
    return (
      <span
        style={{
          display: "inline-block",
          width: 30,
          height: 10,
          borderRadius: 4,
          background: light ? "rgba(255,255,255,0.3)" : "#e8ebe8",
        }}
      />
    );
  }
  return (
    <span
      style={{ fontSize: 11, color: light ? "rgba(255,255,255,0.85)" : "#999" }}
    >
      <strong style={{ color: light ? "#fff" : "#D4AF37" }}>
        {count ?? 0}
      </strong>{" "}
      განცხ.
    </span>
  );
}

// ─── component ───────────────────────────────────────────────────────────────
export default function CategoriesSection() {
  const { counts, loading } = useCategoryCounts();
  const regularCats = CATEGORIES.filter((c) => !SPECIAL_CAT_IDS.has(c.id));

  return (
    <section
      className="py-9 px-4"
      style={{ background: "#fff", borderBottom: "1px solid #e8ebe8" }}
    >
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div
              className="text-[17px] font-bold"
              style={{
                color: "#111",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              🗂 სად რისი გაცვლა შეიძლება
            </div>
            <div className="text-[13px] mt-0.5" style={{ color: "#999" }}>
              აირჩიე კატეგორია და ნახე განცხადებები
            </div>
          </div>
          <Link
            href="/categories"
            className="text-[13px] font-medium"
            style={{
              color: "#1a8a4a",
              fontFamily: "'Space Grotesk', sans-serif",
              textDecoration: "none",
            }}
          >
            ყველა კატეგ. →
          </Link>
        </div>

        {/* Special groups */}
        <div className="flex flex-col gap-3 mb-4">
          {SPECIAL_GROUPS.map((group) => (
            <div
              key={group.id}
              style={{
                border: `1.5px solid ${group.gold ? "#D4AF37" : "#e8ebe8"}`,
                borderRadius: 14,
                background: group.gold ? "#fffdf4" : "#f8faf8",
                padding: "14px 16px",
              }}
            >
              {/* label */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: group.description ? 4 : 10,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#111",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {group.label}
                </span>
                {group.gold && (
                  <span
                    style={{
                      background: "#D4AF37",
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 700,
                      borderRadius: 99,
                      padding: "1px 8px",
                    }}
                  >
                    დროებითი
                  </span>
                )}
              </div>

              {group.description && (
                <p
                  style={{ fontSize: 11, color: "#999", margin: "0 0 10px 0" }}
                >
                  {group.description}
                </p>
              )}

              {/* items */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {group.items.map((item) => (
                  <Link
                    key={item.catId}
                    href={item.route}
                    style={{
                      textDecoration: "none",
                      flex: "1 1 140px",
                      minWidth: 130,
                    }}
                  >
                    <div
                      style={{
                        background: group.gold ? "#D4AF37" : "#fff",
                        border: group.gold ? "none" : "1px solid #e8ebe8",
                        borderRadius: 10,
                        padding: "10px 12px",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        cursor: "pointer",
                        transition: "opacity .18s, transform .18s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.opacity =
                          "0.82";
                        (e.currentTarget as HTMLDivElement).style.transform =
                          "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.opacity = "1";
                        (e.currentTarget as HTMLDivElement).style.transform =
                          "translateY(0)";
                      }}
                    >
                      <span style={{ fontSize: 22 }}>{item.icon}</span>
                      <div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: group.gold ? "#fff" : "#111",
                            fontFamily: "'Space Grotesk', sans-serif",
                          }}
                        >
                          {item.label}
                        </div>
                        <CountText
                          count={counts[item.catId]}
                          loading={loading}
                          light={group.gold}
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Regular grid */}
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
        >
          <style>{`@media(min-width:640px){.cats-grid{grid-template-columns:repeat(auto-fill,minmax(155px,1fr))!important}}`}</style>
          {regularCats.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className="group flex flex-col items-center text-center py-3 px-2 sm:py-4 sm:px-3 rounded-xl transition-all duration-200"
              style={{
                background: "#f8faf8",
                border: "1px solid #e8ebe8",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "#1a8a4a";
                el.style.background = "#e6f5ec";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "#e8ebe8";
                el.style.background = "#f8faf8";
                el.style.transform = "translateY(0)";
              }}
            >
              <span
                className="text-[22px] sm:text-[26px] mb-1.5 sm:mb-2 flex items-center justify-center rounded-xl w-9 h-9 sm:w-11 sm:h-11"
                style={{ background: "#fff" }}
              >
                {cat.icon}
              </span>
              <span
                className="text-[11px] sm:text-[12px] font-semibold leading-tight mb-0.5 line-clamp-2"
                style={{
                  color: "#111",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {cat.name}
              </span>
              <CountText count={counts[cat.id]} loading={loading} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
