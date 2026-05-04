"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/components/AuthProvider";
import { HeartCrack, HeartHandshake, Toolbox } from "lucide-react";

const GREEN = "#1a8a4a";
const GREEN_LIGHT = "#e6f5ec";
const GOLD = "#c8820a";
const GOLD_LIGHT = "#fffdf4";
const BORDER = "#e8ebe8";
const RED = "#1a8a4a";
const GREY = "#99999f";

// ── Real counts hook ─────────────────────────────────────────────────────────
// API route.ts-ში GET-ს დასჭირდება ?counts=1 პარამეტრის დამუშავება:
//
//   if (searchParams.get('counts') === '1') {
//     const pipeline = [
//       { $match: { isTraded: false } },
//       { $group: { _id: '$category', count: { $sum: 1 } } },
//     ];
//     const result = await Listing.aggregate(pipeline);
//     const map = Object.fromEntries(result.map((r: any) => [r._id, r.count]));
//     return NextResponse.json(map);
//   }
//
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

// ── Count badge ──────────────────────────────────────────────────────────────
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

// ── მთავარ გვერდზე ნაჩვენები კატეგ. (vehicles + realestate ოქროს ბლოკში) ──
const FEATURED_CAT_IDS = [
  "electronics",
  "clothing",
  "tools",
  "books",
  "art",
  "vehiclesreal",
  "realestate",
  "other",
  "games",
  "home",
  "agriculture",
  "carParts",
];

// ── hover helper ─────────────────────────────────────────────────────────────
function hoverGreen(e: React.MouseEvent, enter: boolean) {
  const el = e.currentTarget as HTMLElement;
  el.style.borderColor = enter ? GREEN : BORDER;
  el.style.background = enter ? GREEN_LIGHT : "#fff";
  el.style.transform = enter ? "translateY(-2px)" : "translateY(0)";
}
function hoverGold(e: React.MouseEvent, enter: boolean) {
  const el = e.currentTarget as HTMLElement;
  el.style.opacity = enter ? "0.84" : "1";
  el.style.transform = enter ? "translateY(-2px)" : "translateY(0)";
}

export default function CategoriesSection() {
  const { counts, loading } = useCategoryCounts();
  const featuredCats = CATEGORIES.filter((c) =>
    FEATURED_CAT_IDS.includes(c.id),
  );

  return (
    <section
      className="px-4 py-8"
      style={{ background: "#fff", borderBottom: `1px solid ${BORDER}` }}
    >
      <div className="max-w-[1100px] mx-auto">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div
              className="text-[16px] font-bold"
              style={{
                color: "#111",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              🗂 სად რისი გაცვლა შეიძლება
            </div>
            <div className="text-[12px] mt-0.5" style={{ color: "#999" }}>
              აირჩიე კატეგორია და ნახე განცხადებები
            </div>
          </div>
          <Link
            href="/categories"
            style={{
              color: GREEN,
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            ყველა კატეგ. →
          </Link>
        </div>

        {/* ══ ოქროსფერი ბლოკი: დროებითი + ჩვეულებრივი გაცვლა ══ */}
        <div
          className="rounded-[14px] p-4 mb-5"
          style={{ border: `1.5px solid ${RED}`, background: GOLD_LIGHT }}
        >
          {/* სათაური */}
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[13px] font-bold"
              style={{
                color: "#111",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              დროებითი გაცვლა
            </span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
              style={{ background: GOLD }}
            >
              იურიდიული
            </span>
          </div>
          <p className="text-[11px] mb-3.5" style={{ color: "#888" }}>
            იურიდიული დოკუმენტებით ვეხმარებით — ორივე მხარე დაცულია
          </p>

          {/* ── სტრიქონი 1: დროებითი ── */}
          <div
            className="text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ color: GOLD }}
          >
            ⏳ დროებითი გაცვლა
          </div>
          <div className="flex gap-2.5 flex-wrap mb-3">
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
                className="flex-1 min-w-[140px]"
                style={{ textDecoration: "none" }}
              >
                <div
                  className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5"
                  style={{
                    background: GOLD,
                    cursor: "pointer",
                    transition: "all .18s",
                  }}
                  onMouseEnter={(e) => hoverGold(e, true)}
                  onMouseLeave={(e) => hoverGold(e, false)}
                >
                  <span className="text-[22px]">{item.icon}</span>
                  <div>
                    <div
                      className="text-[11px] font-bold text-white leading-tight"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
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

          {/* ── სტრიქონი 2: ჩვეულებრივი ── */}
          <div
            className="text-[10px] font-bold uppercase tracking-widest mb-2 flex gap-1"
            style={{ color: GREY }}
          >
            <Toolbox size={16} /> სერვისების გაცვლა
          </div>
          <div className="flex gap-2.5 flex-wrap">
            {[
              // {
              //   href: "/category/vehicles",
              //   icon: "🚗",
              //   label: "ტრანსპორტი",
              //   catId: "vehicles",
              // },
              // {
              //   href: "/category/realestate",
              //   icon: "🏠",
              //   label: "უძრავი ქონება",
              //   catId: "realestate",
              // },
              {
                href: "/category/serviceToThing",
                icon: "💼",
                label: "მომსახურების ნივთში გადაცვლა",
                catId: "serviceToThing",
              },
              {
                href: "/category/thingToService",
                icon: "🎯",
                rame: { HeartCrack },
                label: "ნივთის მომსახურებაში გადაცვლა",
                catId: "thingToService",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 min-w-[140px]"
                style={{ textDecoration: "none" }}
              >
                <div
                  className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5"
                  style={{
                    background: "#ffffff",
                    border: `1px solid ${BORDER}`,
                    cursor: "pointer",
                    transition: "all .18s",
                  }}
                  // onMouseEnter={(e) => hoverGold(e, true)}
                  // onMouseLeave={(e) => hoverGold(e, false)}

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
                  <span className="text-[22px]">
                    {/* <HeartHandshake color="GOLD" /> */}
                    {item.icon}
                  </span>
                  <div>
                    <div
                      className="text-[11px] font-bold leading-tight"
                      style={{
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

        {/* ══ 6 featured კატეგორია ══ */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {featuredCats.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                className="flex flex-col items-center text-center py-3 px-2 rounded-xl"
                style={{
                  background: "#f8faf8",
                  border: `1px solid ${BORDER}`,
                  transition: "all .18s",
                  cursor: "pointer",
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
                  el.style.background = "#f8faf8";
                  el.style.transform = "translateY(0)";
                }}
              >
                <span
                  className="text-[22px] mb-1.5 flex items-center justify-center rounded-xl w-9 h-9"
                  style={{ background: "#fff" }}
                >
                  {cat.icon}
                </span>
                <span
                  className="text-[11px] font-semibold leading-tight mb-0.5 line-clamp-2"
                  style={{
                    color: "#111",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {cat.name}
                </span>
                <CountBadge catId={cat.id} counts={counts} loading={loading} />
              </div>
            </Link>
          ))}
        </div>

        {/* ── ყველა კატეგ. ბმული ── */}
        <div className="text-center">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-[13px] font-semibold transition-all"
            style={{
              color: GREEN,
              border: `1px solid rgba(26,138,74,0.25)`,
              textDecoration: "none",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = GREEN;
              (e.currentTarget as HTMLElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = GREEN;
            }}
          >
            ყველა კატეგ. ნახვა →
          </Link>
        </div>
      </div>
    </section>
  );
}
