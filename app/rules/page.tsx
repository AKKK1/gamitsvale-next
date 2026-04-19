"use client";

import React from "react";
import Header from "@/components/Header";
import {
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  UserPlus,
  Search,
  MessageSquare,
  Handshake,
  Star,
} from "lucide-react";

const C = {
  bg: "#ffffff",
  bg2: "#f8faf8",
  bg3: "#f0f4f0",
  green: "#1a8a4a",
  greenLight: "#e6f5ec",
  greenDark: "#125e33",
  text: "#111111",
  text2: "#555555",
  text3: "#999999",
  border: "#e8ebe8",
};

function XCircle({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}

const steps = [
  {
    icon: <UserPlus size={20} />,
    number: "01",
    title: "დარეგისტრირდი",
    description:
      "შექმენი უფასო ანგარიში — მიუთითე სახელი, მეილი და პაროლი. ასევე შეგიძლია Google-ით შეხვიდე.",
  },
  {
    icon: <Search size={20} />,
    number: "02",
    title: "იპოვე სასურველი ნივთი",
    description:
      "მთავარ გვერდზე დაათვალიერე განცხადებები. გამოიყენე კატეგორია ან ქალაქის ფილტრი სწრაფი ძიებისთვის.",
  },
  {
    icon: <MessageSquare size={20} />,
    number: "03",
    title: "გაუგზავნე შეთავაზება",
    description:
      'განცხადების გვერდზე დააჭირე "შეთავაზება" — აღწერე რა გინდა შესთავაზო, შეგიძლია ფოტოც დაამატო.',
  },
  {
    icon: <Handshake size={20} />,
    number: "04",
    title: "დაელოდე პასუხს",
    description:
      "მეორე მხარე დაინახავს შეთავაზებას — დათანხმდება, უარყოფს ან დაფიქრდება. შენ მიიღებ შეტყობინებას.",
  },
  {
    icon: <CheckCircle2 size={20} />,
    number: "05",
    title: "გაცვლა!",
    description:
      "დათანხმებისას ორივეს გამოჩნდება მეორე მხარის კონტაქტი. დაუკავშირდი და შეთანხმდი გაცვლის ადგილზე.",
  },
  {
    icon: <Star size={20} />,
    number: "06",
    title: "განათავსე შენი განცხადებაც",
    description:
      'პროფილში "+" ღილაკზე დაჭერით განათავსე შენი ნივთი — შეგიძლია დღეში 3-ჯერ.',
  },
];

export default function RulesPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: C.bg,
        color: C.text,
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <Header onAddListing={() => {}} />

      <main className="max-w-3xl mx-auto px-4 py-16">
        {/* ── სათაური ── */}
        <div className="text-center mb-14">
          <h1
            className="text-4xl font-bold tracking-tight mb-4"
            style={{ letterSpacing: "-0.5px" }}
          >
            პლატფორმის <span style={{ color: C.green }}>წესები</span>
          </h1>
          <p className="text-sm" style={{ color: C.text2 }}>
            გთხოვთ გაეცნოთ წესებს, რათა თქვენი გამოცდილება იყოს უსაფრთხო და
            სასიამოვნო.
          </p>
        </div>

        <div className="space-y-6">
          {/* ── ნაბიჯ-ნაბიჯ ── */}
          <section
            className="p-7 rounded-2xl"
            style={{ background: C.bg2, border: `1px solid ${C.border}` }}
          >
            <div className="flex items-center gap-3 mb-7">
              <div
                className="p-2 rounded-xl"
                style={{ background: C.greenLight, color: C.green }}
              >
                <BookOpen size={22} />
              </div>
              <h2 className="text-lg font-bold" style={{ color: C.text }}>
                როგორ გამოვიყენო საიტი
              </h2>
            </div>

            <div className="space-y-3">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 rounded-xl transition-all"
                  style={{ background: C.bg, border: `1px solid ${C.border}` }}
                >
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: C.greenLight, color: C.green }}
                    >
                      {step.icon}
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className="w-px h-3"
                        style={{ background: C.border }}
                      />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[10px] font-bold tracking-widest"
                        style={{ color: C.green, opacity: 0.6 }}
                      >
                        {step.number}
                      </span>
                      <h3
                        className="text-sm font-bold"
                        style={{ color: C.text }}
                      >
                        {step.title}
                      </h3>
                    </div>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: C.text2 }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── ზოგადი წესები ── */}
          <section
            className="p-7 rounded-2xl"
            style={{ background: C.bg2, border: `1px solid ${C.border}` }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="p-2 rounded-xl"
                style={{ background: C.greenLight, color: C.green }}
              >
                <ShieldCheck size={22} />
              </div>
              <h2 className="text-lg font-bold" style={{ color: C.text }}>
                ზოგადი წესები
              </h2>
            </div>
            <ul className="space-y-3">
              {[
                "ერთი მომხმარებლისთვის დღიური ლიმიტი არის 3 განცხადების განთავსება.",
                "აკრძალულია ერთი და იგივე ნივთის მრავალჯერადი განთავსება.",
                "განცხადება უნდა შეიცავდეს რეალურ ფოტოებს და ზუსტ აღწერას.",
              ].map((rule, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm"
                  style={{ color: C.text2 }}
                >
                  <CheckCircle2
                    size={17}
                    className="shrink-0 mt-0.5"
                    style={{ color: "#16a34a" }}
                  />
                  {rule}
                </li>
              ))}
            </ul>
          </section>

          {/* ── აკრძალვები ── */}
          <section
            className="p-7 rounded-2xl"
            style={{ background: C.bg2, border: `1px solid ${C.border}` }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="p-2 rounded-xl"
                style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444" }}
              >
                <AlertCircle size={22} />
              </div>
              <h2 className="text-lg font-bold" style={{ color: C.text }}>
                აკრძალვები
              </h2>
            </div>
            <ul className="space-y-3">
              {[
                "აკრძალულია კანონით აკრძალული ნივთების ან სერვისების განთავსება.",
                "აკრძალულია შეურაცხმყოფელი ლექსიკის გამოყენება.",
                "სპამი და თაღლითური ქმედებები გამოიწვევს ანგარიშის სამუდამო ბლოკირებას.",
              ].map((rule, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm"
                  style={{ color: C.text2 }}
                >
                  <XCircle
                    size={17}
                    className="shrink-0 mt-0.5 color-[#ef4444]"
                  />
                  {rule}
                </li>
              ))}
            </ul>
          </section>

          {/* ── გახსოვდეთ — green banner ── */}
          <section
            className="p-7 rounded-2xl text-white"
            style={{ background: C.green }}
          >
            <h2 className="text-xl font-bold mb-3">გახსოვდეთ!</h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              GAMITSVALE.GE არის მხოლოდ პლატფორმა გაცვლისთვის. ჩვენ არ ვიღებთ
              პასუხისმგებლობას გაცვლის პროცესზე ან ნივთების ხარისხზე. გთხოვთ,
              იყოთ ფრთხილად და ნივთის გაცვლისას შეხვდეთ საჯარო ადგილებში.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
