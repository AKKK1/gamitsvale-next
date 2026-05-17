"use client";
import Link from "next/link";
import React, { useState } from "react";
import { CATEGORIES } from "@/components/AuthProvider";

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
    <section className="relative max-w-[1250px] w-full mx-auto bg-white rounded-[24px] p-5 sm:p-6 md:p-14 pb-10 md:pb-14 shadow-[0_10px_30px_rgba(0,0,0,0.04)] grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-10 items-center my-6">
      {/* სუფთა CSS გლობალური კონფლიქტების გარეშე მხოლოდ მცურავი ანიმაციისთვის */}
      <style>{`
        @keyframes platformFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-platform-float {
          animation: platformFloat 4s ease-in-out infinite;
        }
        @keyframes scrollCue {
          0%, 100% { transform: translate(-50%, 0); opacity: 0.58; }
          50% { transform: translate(-50%, 5px); opacity: 1; }
        }
        .hero-scroll-cue {
          animation: scrollCue 1.7s ease-in-out infinite;
        }
        @media (max-width: 767px) {
          .animate-platform-float {
            animation-duration: 5.5s;
          }
        }
      `}</style>

      {/* მარცხენა მხარე: ტექსტური კონტენტი */}
      <div className="flex flex-col gap-5 md:gap-6 order-2 md:order-1 items-center md:items-start text-center md:text-left">
        {/* ზედა ბეჯი */}
        <div className="inline-flex items-center gap-2 bg-[#e6f6ee] text-[#007D40] px-4 py-2 rounded-full text-sm font-semibold self-center md:self-start">
          <span>🎉</span> გახდი პირველი 10000 მომხმარებლის ნაწილი
        </div>

        {/* მთავარი სათაური */}
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-900">
          გაცვალე ნივთები — <br />
          <span className="text-[#007D40]">ფულის გარეშე</span>
        </h1>

        {/* ქვესათაური */}
        <p className="text-base md:text-lg text-slate-600 max-w-[480px]">
          საქართველოს პირველი ბარტერული პლატფორმა. მიეცი ნივთებს მეორე სიცოცხლე,
          დაზოგე თანხა და იპოვე ის, რაც ზუსტად ახლა გჭირდება.
        </p>

        {/* მოქმედების ღილაკები (CTA) */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
          {/* <Link
            href="/add-item"
            className="bg-[#007D40] text-white px-7 py-4 rounded-xl font-semibold text-center shadow-lg shadow-emerald-700/20 hover:bg-[#006433] hover:-translate-y-0.5 transition-all duration-200"
          >
            + დაამატე ნივთი
          </Link> */}

          <Link
            href="/search"
            className="border-2 border-[#007D40] text-[#007D40] px-7 py-4 rounded-xl font-semibold text-center hover:bg-[#f0fdf4] hover:-translate-y-0.5 transition-all duration-200"
          >
            კატალოგის ნახვა
          </Link>
        </div>
      </div>

      {/* მარჯვენა მხარე: ბარტერის ვიზუალი (SVG) */}
      <div className="bg-gradient-to-br from-[#f0fdf4] to-[#e6f6ee] rounded-[20px] p-4 sm:p-6 md:p-10 flex justify-center items-center h-full min-h-[185px] sm:min-h-[230px] md:min-h-[400px] order-1 md:order-2 animate-platform-float">
        <svg
          className="w-full max-w-[220px] sm:max-w-[280px] md:max-w-[380px] h-auto"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* წრიული ფონი ისრებით */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#007D40"
            strokeWidth="2"
            strokeDasharray="8 8"
            opacity="0.4"
          />

          {/* მარცხენა ნივთი */}
          <g transform="translate(30, 70)">
            <rect width="45" height="45" rx="10" fill="#007D40" />
            <path
              d="M15 15H30M15 22.5H30M15 30H25"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>

          {/* მარჯვენა ნივთი */}
          <g transform="translate(125, 70)">
            <rect width="45" height="45" rx="10" fill="#34d399" />
            <circle
              cx="22.5"
              cy="22.5"
              r="10"
              fill="none"
              stroke="white"
              strokeWidth="3"
            />
          </g>

          {/* ბარტერის ისრები */}
          <path
            d="M85 65H115M115 65L108 58M115 65L108 72"
            stroke="#007D40"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M115 125H85M85 125L92 118M85 125L92 132"
            stroke="#007D40"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <a
        href="#listings-section"
        aria-label="Scroll to listings"
        className="hero-scroll-cue absolute bottom-3 left-1/2 hidden md:flex h-7 w-7 items-center justify-center rounded-full transition-colors"
        style={{
          border: "1px solid rgba(0,125,64,0.18)",
          background: "rgba(230,246,238,0.82)",
          color: "#007D40",
        }}
      >
        <span className="text-sm leading-none">⌄</span>
      </a>
    </section>
  );
}
