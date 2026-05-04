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
  Upload,
  Bell,
  Phone,
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
  gold: "#D4AF37",
  goldLight: "#FEF9E7",
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

// ─── ნაბიჯ-ნაბიჯ სახელმძღვანელო ────────────────────────────────────────────
const steps = [
  {
    icon: <UserPlus size={20} />,
    number: "01",
    title: "გაიარეთ მარტივი რეგისტრაცია",
    description:
      "შექმენი უფასო ანგარიში — მიუთითე სახელი, მეილი და პაროლი. ასევე შეგიძლია Google-ით შეხვიდე. სურვილისამებრ დაამატე WhatsApp ან Telegram — სადაც პირდაპირ დაგიკავშირდება მომხმარებელი.",
  },
  {
    icon: <Upload size={20} />,
    number: "02",
    title: "ატვირთეთ ნივთი საიტზე",
    description:
      'ჩაწერეთ ნივთის დასახელება და მდგომარეობა, დაურთეთ სურათები და მიუთითეთ ლოკაცია. სასურველ ნივთებში ჩაწერეთ რაში გსურთ გაცვლა — ნივთში ან სერვისში. თუ არ იცით რა მოითხოვოთ, ჩაწერეთ "შემომთავაზე" და დაელოდეთ შემოთავაზებებს.',
  },
  {
    icon: <Search size={20} />,
    number: "03",
    title: "იპოვეთ სასურველი ნივთი",
    description:
      "მთავარ გვერდზე დაათვალიერეთ განცხადებები. გამოიყენეთ კატეგორია ან ქალაქის ფილტრი სწრაფი ძიებისთვის.",
  },
  {
    icon: <MessageSquare size={20} />,
    number: "04",
    title: "გაუგზავნეთ შეთავაზება",
    description:
      'განცხადებაზე დააჭირეთ "შეთავაზება" — ჩაწერეთ რა გინდა შესთავაზო, შეგიძლია ფოტოც დაამატო. ერთ განცხადებაზე შეგიძლია 3 შეთავაზება, ხოლო სხვა მომხმარებლებთან დღეში — 15.',
  },
  {
    icon: <Bell size={20} />,
    number: "05",
    title: "ადევნეთ თვალი შეტყობინებებს",
    description:
      "შეთავაზების მისაღებად პერიოდულად შეამოწმეთ 🔔 ზარის ღილაკი. როდესაც სხვა მომხმარებელს მოეწონება თქვენი ნივთი, ის შემოგთავაზებთ მის ნივთს. თქვენი ნებაა — დათანხმდებით, დაფიქრდებით, თუ უარს იტყვით.",
  },
  {
    icon: <Handshake size={20} />,
    number: "06",
    title: "დათანხმება — კონტაქტი გამოჩნდება",
    description:
      'ორმხრივი თანხმობის შემდეგ, პროფილის "დათანხმებული" გრაფაში გამოჩნდება მეორე მხარის ტელეფონი, WhatsApp და Telegram. ეს ღილაკები მხოლოდ ორმხრივი თანხმობის შემდეგ ხდება ხილული.',
  },
  {
    icon: <Phone size={20} />,
    number: "07",
    title: "დაუკავშირდი და გაცვალე",
    description:
      "WhatsApp-ის ან Telegram-ის ღილაკზე დაჭერისას პირდაპირ მესენჯერში გადახვალ. შეთანხმდი გაცვლის ადგილსა და დეტალებზე. შეთანხმება თქვენი პასუხისმგებლობაა — საიტი მხოლოდ პლატფორმაა.",
  },
  {
    icon: <Star size={20} />,
    number: "08",
    title: "განათავსეთ საკუთარი განცხადებაც",
    description:
      '"+ დამატება" ღილაკზე დაჭერით განათავსე შენი ნივთი. NORMAL — უფასო, SILVER — 15₾ კატეგორიის სათავეში მოსაქცევად, VIP — 30₾ კატეგორიის და სექციის სათავეში მოსაქცევად.',
  },
];

// ─── დროებითი გაცვლის ბლოკი ─────────────────────────────────────────────────
const temporarySteps = [
  'გადადი სპეციალურ გვერდზე — "ტრანსპ. დროებითი გაცვლა" ან "სახლების გაცვლა"',
  "შეავსე ხელშეკრულების ფორმა — ორივე მხარის მონაცემები",
  "გადმოიწერე .txt ხელშეკრულება — ბეჭდვა + ხელმოწერა",
  "ხელშეკრულება ორივე მხარეს იცავს — ზარალის შემთხვევაში",
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
      <Header onAddListing={() => {}} onSearch={() => {}} />

      <main className="max-w-3xl mx-auto px-4 py-14">
        {/* ── Hero ── */}
        <div
          className="rounded-2xl p-8 mb-10 text-center"
          style={{ background: C.green }}
        >
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            gamitsvale.ge
          </p>
          <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
            გაქვთ ნივთები, რომლებსაც
            <br />
            <span style={{ color: "#A8E6BF" }}>არ იყენებთ?</span>
          </h1>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            ჩვენთან შეგიძლია მოუძებნო გამოსავალი — გაცვალე ნივთი ნივთზე, ნივთი
            სერვისზე, ან სერვისი სერვისზე.{" "}
            <strong className="text-white">ფულის გარეშე.</strong>
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
              <div>
                <h2 className="text-lg font-bold" style={{ color: C.text }}>
                  როგორ გამოვიყენო საიტი
                </h2>
                <p className="text-xs mt-0.5" style={{ color: C.text3 }}>
                  ნაბიჯ-ნაბიჯ სახელმძღვანელო
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 rounded-xl"
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

          {/* ── დროებითი გაცვლა ── */}
          <section
            className="p-7 rounded-2xl"
            style={{
              background: C.goldLight,
              border: `1.5px solid ${C.gold}`,
            }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="p-2 rounded-xl"
                style={{ background: C.gold, color: "#fff" }}
              >
                <ShieldCheck size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold" style={{ color: C.text }}>
                  დროებითი გაცვლა
                </h2>
                <p className="text-xs mt-0.5" style={{ color: C.text3 }}>
                  ტრანსპორტი & სახლი — იურიდიული ხელშეკრულებით
                </p>
              </div>
            </div>
            <ul className="space-y-3">
              {temporarySteps.map((rule, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm"
                  style={{ color: C.text2 }}
                >
                  <span
                    className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: C.gold }}
                  >
                    {i + 1}
                  </span>
                  {rule}
                </li>
              ))}
            </ul>
            <p
              className="text-xs mt-4 pt-4"
              style={{
                color: C.text3,
                borderTop: `1px solid rgba(212,175,55,0.3)`,
              }}
            >
              ⚖️ ხელშეკრულება ორივე მხარეს იცავს — ნებისმიერი დაზიანება
              ანაზღაურდება ადგილზე შეფასებით.
            </p>
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
                "ერთი მომხმარებლისთვის დღიური ლიმიტი არის 3 განცხადება.",
                "აკრძალულია ერთი და იგივე ნივთის მრავალჯერადი განთავსება.",
                "განცხადება უნდა შეიცავდეს რეალურ ფოტოებს და ზუსტ აღწერას.",
                "კონტაქტი ხდება ხილული მხოლოდ ორმხრივი თანხმობის შემდეგ.",
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
                    className="shrink-0 mt-0.5"
                    style={{ color: "#ef4444" }}
                  />
                  {rule}
                </li>
              ))}
            </ul>
          </section>

          {/* ── disclaimer ── */}
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
            <a
              href="https://gamitsvale.ge"
              className="inline-block mt-4 text-sm font-bold"
              style={{ color: "#A8E6BF" }}
            >
              gamitsvale.ge →
            </a>
          </section>
        </div>
      </main>
    </div>
  );
}
