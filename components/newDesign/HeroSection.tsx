"use client";

import React, { useState } from "react";
import { CATEGORIES, GEORGIAN_CITIES } from "@/components/AuthProvider";

interface HeroSectionProps {
  onSearch?: (query: string, type: string, filters?: any) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(
      query,
      "want",
      selectedCategory ? { category: selectedCategory } : undefined,
    );
  };

  return (
    <section
      style={{
        background: "linear-gradient(180deg, #f8faf8 0%, #f8faf8 100%)",
        borderBottom: "1px solid #e8ebe8",
      }}
      className="px-4 pt-12 pb-10 flex flex-col items-center text-center"
    >
      {/* Live badge */}
      <div
        className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-[12px] font-medium"
        style={{
          background: "#e6f5ec",
          border: "1px solid rgba(26,138,74,0.2)",
          color: "#1a8a4a",
        }}
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{
            background: "#1a8a4a",
            animation: "gv-blink 2s infinite",
          }}
        />
        10,000+ მომხმარებელი · ახლა ონლაინ
      </div>

      {/* Title */}
      <h1
        className="text-[clamp(30px,6vw,56px)] font-bold leading-tight tracking-tight mb-3 max-w-2xl"
        style={{
          color: "#111",
          fontFamily: "'Space Grotesk', sans-serif",
          letterSpacing: "-1px",
        }}
      >
        გაცვალე ნივთები —{" "}
        <span style={{ color: "#1a8a4a", fontStyle: "italic" }}>
          ფულის გარეშე
        </span>
      </h1>

      <p className="text-[15px] mb-8 max-w-md" style={{ color: "#555" }}>
        საქართველოს პირველი ბარტერული პლატფორმა. შენი ძველი ნივთი სხვისთვის
        ახალია.
      </p>

      {/* Search bar */}
      {/* <form
        onSubmit={handleSearch}
        className="flex w-full max-w-[600px] mb-6 overflow-hidden rounded-xl"
        style={{
          background: "#fff",
          border: "1px solid #e8ebe8",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-[13px] outline-none px-4 py-3 bg-transparent"
          style={{
            color: "#555",
            borderRight: "1px solid #e8ebe8",
            minWidth: 130,
            fontFamily: "'Space Grotesk', sans-serif",
            cursor: "pointer",
          }}
        >
          <option value="">ყველა კატეგ. ▾</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="მოძებნე ნივთი, ან რაში გინდა გაცვლა..."
          className="flex-1 px-4 py-3 text-[14px] outline-none bg-transparent"
          style={{ color: "#111", fontFamily: "'Space Grotesk', sans-serif" }}
        />

        <button
          type="submit"
          className="px-6 py-3 text-[14px] font-semibold text-white transition-all whitespace-nowrap"
          style={{
            background: "#1a8a4a",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLElement).style.background = "#125e33")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLElement).style.background = "#1a8a4a")
          }
        >
          ძებნა →
        </button>
      </form> */}

      {/* Stats */}
      <div className="flex items-center gap-8">
        {[
          { n: "2,400+", l: "აქტიური განცხ." },
          null,
          { n: "850+", l: "გაცვლა ამ კვირას" },
          null,
          { n: "15", l: "კატეგორია" },
        ].map((item, i) =>
          item === null ? (
            <div
              key={i}
              className="hidden sm:block w-px h-8"
              style={{ background: "#e8ebe8" }}
            />
          ) : (
            <div key={i} className="text-center">
              <div className="text-[22px] font-bold" style={{ color: "#111" }}>
                {item.n}
              </div>
              <div className="text-[11px]" style={{ color: "#999" }}>
                {item.l}
              </div>
            </div>
          ),
        )}
      </div>

      <style>{`
        @keyframes gv-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </section>
  );
}
