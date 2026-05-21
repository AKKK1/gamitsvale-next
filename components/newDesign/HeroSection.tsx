"use client";
import Link from "next/link";
import React from "react";
import { ChevronDown } from "lucide-react";

interface HeroSectionProps {
  onSearch?: (
    query: string,
    type: string,
    filters?: Record<string, string>,
  ) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  void onSearch;

  return (
    <section className="relative max-w-[1250px] w-full min-w-0 mx-auto overflow-hidden bg-white rounded-[18px] sm:rounded-[24px] p-4 sm:p-6 md:p-14 pb-16 md:pb-14 shadow-[0_10px_30px_rgba(0,0,0,0.04)] grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center my-4 sm:my-6">
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
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, 7px); }
        }
        .hero-scroll-cue {
          animation: scrollCue 1.7s ease-in-out infinite;
        }
        @keyframes scrollCuePulse {
          0%, 100% { opacity: 0.34; transform: scale(0.82); }
          50% { opacity: 0.74; transform: scale(1.12); }
        }
        .hero-scroll-cue-pulse {
          animation: scrollCuePulse 1.7s ease-in-out infinite;
        }
        @media (max-width: 767px) {
          .animate-platform-float {
            animation-duration: 5.5s;
          }
        }
      `}</style>

      {/* მარცხენა მხარე: ტექსტური კონტენტი */}
      <div className="flex min-w-0 flex-col gap-5 md:gap-6 order-2 md:order-1 items-center md:items-start text-center md:text-left">
        {/* ზედა ბეჯი */}
        <div className="inline-flex max-w-full items-center justify-center gap-2 bg-[#e6f6ee] text-[#007D40] px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold self-center md:self-start text-center leading-snug">
          <span>🎉</span> გახდი პირველი 10000 მომხმარებლის ნაწილი
        </div>

        {/* მთავარი სათაური */}
        <h1 className="max-w-full text-[30px] sm:text-4xl md:text-5xl font-extrabold leading-tight text-slate-900 break-words">
          გაცვალე ნივთები — <br />
          <span className="text-[#007D40]">ფულის გარეშე</span>
        </h1>

        {/* ქვესათაური */}
        <p className="max-w-full text-sm sm:text-base md:text-lg text-slate-600 sm:max-w-[480px]">
          საქართველოს პირველი ბარტერული პლატფორმა. მიეცი ნივთებს მეორე სიცოცხლე,
          დაზოგე თანხა და იპოვე ის, რაც ზუსტად ახლა გჭირდება.
        </p>

        {/* მოქმედების ღილაკები (CTA) */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto mt-2">
          {/* <Link
            href="/add-item"
            className="bg-[#007D40] text-white px-7 py-4 rounded-xl font-semibold text-center shadow-lg shadow-emerald-700/20 hover:bg-[#006433] hover:-translate-y-0.5 transition-all duration-200"
          >
            + დაამატე ნივთი
          </Link> */}

          <Link
            href="/search"
            className="w-full sm:w-auto border-2 border-[#007D40] text-[#007D40] px-5 sm:px-7 py-3.5 sm:py-4 rounded-xl font-semibold text-center leading-snug hover:bg-[#f0fdf4] hover:-translate-y-0.5 transition-all duration-200"
          >
            განცხადებების ნახვა
          </Link>
        </div>
      </div>

      {/* მარჯვენა მხარე: ბარტერის ვიზუალი (SVG) */}
      <div className="w-full min-w-0 overflow-hidden bg-gradient-to-br from-[#f0fdf4] to-[#e6f6ee] rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 md:p-10 flex justify-center items-center h-full min-h-[165px] sm:min-h-[230px] md:min-h-[400px] order-1 md:order-2 animate-platform-float">
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
        className="hero-scroll-cue group absolute bottom-4 left-1/2 flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#007D40]/30"
        style={{
          border: "1px solid rgba(0,125,64,0.18)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(230,246,238,0.92))",
          color: "#007D40",
          boxShadow:
            "0 14px 28px rgba(0,125,64,0.16), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        <span
          className="hero-scroll-cue-pulse absolute inset-1 rounded-full"
          style={{ background: "rgba(0,125,64,0.12)" }}
        />
        <ChevronDown
          size={23}
          strokeWidth={2.8}
          className="relative z-10 transition-transform group-hover:translate-y-0.5"
        />
      </a>
    </section>
  );
}
