"use client";

import React from "react";
import Link from "next/link";
import { CATEGORIES } from "@/components/AuthProvider";

const CATEGORY_COUNTS: Record<string, number> = {
  electronics: 340,
  vehicles: 95,
  realestate: 42,
  clothing: 430,
  home: 180,
  agriculture: 38,
  tools: 62,
  sports: 140,
  kids: 88,
  books: 290,
  art: 67,
  animals: 54,
  beauty: 76,
  services: 125,
  other: 201,
};

export default function CategoriesSection() {
  return (
    // ✅ position fixed / sticky არ არის — მობილეზე ჩვეულებრივი scroll
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

        {/* Grid — მობილეზე 3 სვეტი, desktop-ზე auto-fill */}
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
        >
          <style>{`
            @media (min-width: 640px) {
              .cats-grid { grid-template-columns: repeat(auto-fill, minmax(155px, 1fr)) !important; }
            }
          `}</style>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className="group flex flex-col items-center text-center py-3 px-2 sm:py-4 sm:px-3 rounded-xl transition-all duration-200 cursor-pointer"
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
              <span
                className="text-[10px] sm:text-[11px]"
                style={{ color: "#999" }}
              >
                <strong style={{ color: "#1a8a4a" }}>
                  {CATEGORY_COUNTS[cat.id] || 0}
                </strong>{" "}
                განცხ.
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
