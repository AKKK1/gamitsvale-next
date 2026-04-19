"use client";

import Link from "next/link";

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
  gold: "#c8820a",
};

const stats = [
  { value: "10,000+", label: "მომხმარებელი" },
  { value: "15", label: "კატეგორია" },
  { value: "2026", label: "დაარსდა" },
  { value: "0 ₾", label: "საკომისიო" },
];

const faqs = [
  {
    q: "რა არის GAMITSVALE.GE?",
    a: "საქართველოს პირველი სპეციალიზებული გაცვლის პლატფორმა. განათავსე ნივთი, მიიღე შეთავაზება, გაცვალე — ფულის გარეშე.",
  },
  {
    q: "ვინ შეიძლება გამოიყენოს?",
    a: "ნებისმიერი საქართველოს მოქალაქე, ვისაც აქვს გამოუყენებელი ნივთი და სხვა ნივთი სჭირდება.",
  },
  {
    q: "უსაფრთხოა?",
    a: "ყველა მომხმარებელი ვერიფიცირებულია მეილით. კონტაქტი იხსნება მხოლოდ ორმხრივი თანხმობის შემდეგ.",
  },
  {
    q: "რა ღირს VIP განცხადება?",
    a: "SILVER — ₾25, VIP — ₾50. ჩვეულებრივი განცხადება სრულიად უფასოა.",
  },
  {
    q: "როგორ მუშაობს გაცვლა?",
    a: "განათავსე შენი ნივთი, მიუთითე რა გინდა სანაცვლოდ. სხვა მომხმარებლები გამოგიგზავნიან შეთავაზებას. დათანხმდი — კონტაქტი გაიხსნება.",
  },
  {
    q: "გაცვლა შესაძლებელია მთელ საქართველოში?",
    a: "დიახ! გაქვს ქალაქის ფილტრი — იპოვე ახლოს მყოფი გამცვლელი.",
  },
];

export default function AboutPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: C.bg,
        color: C.text,
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* ── Header ── */}
      <div
        className="sticky top-0 z-50"
        style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}
      >
        <div className="max-w-6xl mx-auto px-6 h-[60px] flex items-center justify-between">
          <Link
            href="/"
            className="text-[17px] font-bold tracking-tight"
            style={{ color: C.text, textDecoration: "none" }}
          >
            GAMITSVALE<span style={{ color: C.green }}>.GE</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/rules"
              className="transition-colors text-[13px] font-medium"
              style={{ color: C.text2, textDecoration: "none" }}
            >
              წესები
            </Link>
            <Link
              href="/advertise"
              className="transition-colors text-[13px] font-medium hidden sm:block"
              style={{ color: C.text2, textDecoration: "none" }}
            >
              რეკლამა
            </Link>
            <Link
              href="/"
              className="text-white px-4 py-[7px] rounded-lg text-[13px] font-semibold transition-all"
              style={{ background: C.green, textDecoration: "none" }}
            >
              მთავარი
            </Link>
          </nav>
        </div>
      </div>

      {/* ── Hero ── */}
      <section
        className="py-16 px-6 text-center"
        style={{ background: C.bg2, borderBottom: `1px solid ${C.border}` }}
      >
        <div className="max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-[5px] rounded-full text-[12px] font-medium mb-6"
            style={{
              background: C.greenLight,
              border: `1px solid rgba(26,138,74,0.2)`,
              color: C.green,
            }}
          >
            🇬🇪 Made in Georgia
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
            style={{ letterSpacing: "-0.5px" }}
          >
            გაცვლა <span style={{ color: C.green }}>გამარტივდა</span>
          </h1>
          <p
            className="text-base mb-8 leading-relaxed"
            style={{ color: C.text2 }}
          >
            GAMITSVALE.GE — საქართველოს პირველი სპეციალიზებული პლატფორმა
            ნივთების გასაცვლელად. გაცვალე ტელეფონი, ავტომობილი, ტანსაცმელი —
            ფულის გარეშე.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/"
              className="text-white px-6 py-3 rounded-lg text-[14px] font-semibold transition-all"
              style={{ background: C.green, textDecoration: "none" }}
            >
              პლატფორმაზე →
            </Link>
            <a
              href="#contact"
              className="px-6 py-3 rounded-lg text-[14px] font-medium transition-all"
              style={{
                border: `1px solid ${C.border}`,
                color: C.text2,
                textDecoration: "none",
              }}
            >
              კონტაქტი
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section
        className="py-10 px-6"
        style={{ borderBottom: `1px solid ${C.border}`, background: C.bg }}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-bold mb-1" style={{ color: C.green }}>
                {s.value}
              </p>
              <p
                className="text-[11px] font-semibold uppercase tracking-widest"
                style={{ color: C.text3 }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-16 px-6" style={{ background: C.bg2 }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p
                className="text-[11px] font-bold uppercase tracking-widest mb-3"
                style={{ color: C.green }}
              >
                ჩვენი მისია
              </p>
              <h2
                className="text-3xl font-bold mb-4 leading-tight"
                style={{ letterSpacing: "-0.3px" }}
              >
                ყველას შეუძლია <span style={{ color: C.green }}>გაცვლა</span>
              </h2>
              <p
                className="text-sm leading-relaxed mb-3"
                style={{ color: C.text2 }}
              >
                საქართველოში მილიონობით ნივთი გვიყრია სახლში გამოუყენებელი.
                ამავდროულად ათასობით ადამიანს სჭირდება ის, რაც სხვას ზედმეტი
                აქვს.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: C.text2 }}>
                GAMITSVALE.GE-მ ეს ადამიანები ერთმანეთთან დააახლოვა — პლატფორმა
                სადაც ნივთების გაცვლა მარტივი, სწრაფი და უსაფრთხოა.
              </p>
            </div>
            <div className="space-y-3">
              {[
                {
                  icon: "🔄",
                  title: "15 კატეგორია",
                  desc: "ტელეფონებიდან უძრავ ქონებამდე",
                },
                {
                  icon: "🔒",
                  title: "უსაფრთხო გაცვლა",
                  desc: "ვერიფიკაცია + კონტაქტი თანხმობის შემდეგ",
                },
                {
                  icon: "⚡",
                  title: "სწრაფი პროცესი",
                  desc: "განცხადება 2 წუთში, შეთავაზება მყისიერად",
                },
                {
                  icon: "💰",
                  title: "უფასო სერვისი",
                  desc: "ჩვეულებრივი განცხადება — 0 ₾",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl transition-all"
                  style={{ background: C.bg, border: `1px solid ${C.border}` }}
                >
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <div>
                    <p
                      className="text-sm font-bold mb-0.5"
                      style={{ color: C.text }}
                    >
                      {item.title}
                    </p>
                    <p className="text-xs" style={{ color: C.text3 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SEO Tags ── */}
      <section
        className="py-10 px-6"
        style={{
          background: C.bg,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div className="max-w-4xl mx-auto">
          <p
            className="text-[11px] font-bold uppercase tracking-widest mb-4 text-center"
            style={{ color: C.green }}
          >
            პოპულარული ძიებები
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              "ტელეფონების გაცვლა",
              "ავტომობილების გაცვლა",
              "ტანსაცმლის გაცვლა",
              "ელექტრონიკის გაცვლა",
              "სახლის ნივთების გაცვლა",
              "სპორტული ინვენტარი",
              "წიგნების გაცვლა",
              "ბავშვის ნივთები",
              "სამზარეულოს ტექნიკა",
              "გაცვლა თბილისი",
              "გაცვლა ქუთაისი",
              "გაცვლა ბათუმი",
              "barter საქართველო",
              "ნივთების გაცვლა უფასოდ",
              "გამოუყენებელი ნივთები",
            ].map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-full text-xs transition-all cursor-default"
                style={{
                  background: C.bg2,
                  border: `1px solid ${C.border}`,
                  color: C.text3,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-6" style={{ background: C.bg2 }}>
        <div className="max-w-3xl mx-auto">
          <p
            className="text-[11px] font-bold uppercase tracking-widest mb-2 text-center"
            style={{ color: C.green }}
          >
            FAQ
          </p>
          <h2
            className="text-3xl font-bold text-center mb-8"
            style={{ letterSpacing: "-0.3px" }}
          >
            ხშირი კითხვები
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-5 rounded-xl transition-all"
                style={{ background: C.bg, border: `1px solid ${C.border}` }}
              >
                <p
                  className="font-bold text-sm mb-2 flex items-start gap-2"
                  style={{ color: C.text }}
                >
                  <span style={{ color: C.green }}>Q.</span>
                  {faq.q}
                </p>
                <p
                  className="text-sm leading-relaxed pl-5"
                  style={{ color: C.text2 }}
                >
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section
        id="contact"
        className="py-16 px-6"
        style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-[11px] font-bold uppercase tracking-widest mb-2"
            style={{ color: C.green }}
          >
            კონტაქტი
          </p>
          <h2
            className="text-3xl font-bold mb-3"
            style={{ letterSpacing: "-0.3px" }}
          >
            დაგვიკავშირდი
          </h2>
          <p className="text-sm mb-8" style={{ color: C.text2 }}>
            კითხვა, წინადადება ან თანამშრომლობა? ვართ აქ!
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                icon: "📧",
                label: "მეილი",
                value: "gamitsvale@gmail.com",
                href: "mailto:gamitsvale@gmail.com",
              },
              {
                icon: "📱",
                label: "ტელეფონი",
                value: "+995 593 71 60 80",
                href: "tel:+995593716080",
              },
              {
                icon: "👥",
                label: "Facebook ჯგუფი",
                value: "GAMITSVALE Community",
                href: "https://www.facebook.com/groups/1465431608622052",
              },
            ].map((c, i) => (
              <a
                key={i}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 p-5 rounded-2xl transition-all group"
                style={{
                  background: C.bg2,
                  border: `1px solid ${C.border}`,
                  textDecoration: "none",
                }}
              >
                <span className="text-3xl">{c.icon}</span>
                <div className="text-center">
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest mb-1"
                    style={{ color: C.text3 }}
                  >
                    {c.label}
                  </p>
                  <p
                    className="text-xs font-bold break-all"
                    style={{ color: C.text }}
                  >
                    {c.value}
                  </p>
                </div>
              </a>
            ))}
          </div>
          <p className="text-xs" style={{ color: C.text3 }}>
            GAMITSVALE.GE © 2024–2025 · All rights reserved
          </p>
        </div>
      </section>
    </div>
  );
}
