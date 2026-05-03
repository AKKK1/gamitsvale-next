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
  goldLight: "#fff8e6",
};

const adZones = [
  {
    id: "banner-top",
    name: "მთავარი ბანერი",
    location: "მთავარი გვერდი — ზედა",
    size: "1200×120px",
    price: "₾1000 / თვე",
    views: "~50,000 view/თვე",
    description: "ყველაზე ხილული ადგილი. ყოველი ვიზიტორი ხედავს.",
    badge: "BEST",
    highlight: true,
  },
  {
    id: "vip-carousel",
    name: "VIP კარუსელი",
    location: "მთავარი გვერდი — VIP სექცია",
    size: "260×350px",
    price: "₾400 / თვე",
    views: "~30,000 view/თვე",
    description: "VIP განცხადებების გვერდით. მაღალი engagement.",
    badge: "POPULAR",
    highlight: false,
  },
  {
    id: "sidebar",
    name: "გვერდითი ბანერი",
    location: "კატეგორიის გვერდი — მარჯვენა",
    size: "300×600px",
    price: "₾300 / თვე",
    views: "~20,000 view/თვე",
    description: "კატეგორიაში მყიდველებს ხედავს. Targeted traffic.",
    badge: null,
    highlight: false,
  },
  {
    id: "listing-inline",
    name: "განცხადებებს შორის",
    location: "მთავარი სია — ყოველ მე-8 ადგილი",
    size: "სრული კარდი",
    price: "₾400 / თვე",
    views: "~15,000 view/თვე",
    description: "ორგანულ სიაში ეწყობა. Native ad სტილი.",
    badge: null,
    highlight: false,
  },
  {
    id: "mobile-banner",
    name: "მობილური ბანერი",
    location: "მობილური — ნავიგაციის ქვეშ",
    size: "360×60px",
    price: "₾500 / თვე",
    views: "~25,000 view/თვე",
    description: "70%+ ვიზიტორი მობილურით მოდის.",
    badge: "MOBILE",
    highlight: false,
  },
];

export default function AdvertisePage() {
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
          <nav className="flex items-center gap-4">
            <Link
              href="/about"
              className="text-[13px] font-medium transition-colors hidden sm:block"
              style={{ color: C.text2, textDecoration: "none" }}
            >
              ჩვენს შესახებ
            </Link>
            <Link
              href="/rules"
              className="text-[13px] font-medium transition-colors hidden sm:block"
              style={{ color: C.text2, textDecoration: "none" }}
            >
              წესები
            </Link>
            <Link
              href="/"
              className="text-white px-4 py-[7px] rounded-lg text-[13px] font-semibold"
              style={{ background: C.green, textDecoration: "none" }}
            >
              მთავარი
            </Link>
          </nav>
        </div>
      </div>

      {/* ── Hero ── */}
      <section
        className="py-14 px-6"
        style={{ background: C.bg2, borderBottom: `1px solid ${C.border}` }}
      >
        <div className="max-w-5xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-3 py-[5px] rounded-full text-[11px] font-bold uppercase tracking-widest mb-5"
            style={{
              background: C.greenLight,
              border: `1px solid rgba(26,138,74,0.2)`,
              color: C.green,
            }}
          >
            📢 რეკლამა
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
            style={{ letterSpacing: "-0.5px" }}
          >
            გამოაჩინე შენი
            <br />
            <span style={{ color: C.green }}>ბიზნესი</span>
          </h1>
          <p
            className="text-sm leading-relaxed mb-8 max-w-xl"
            style={{ color: C.text2 }}
          >
            10,000+ მომხმარებელი ყოველდღიურად. საქართველოს ყველაზე სწრაფად
            მზარდი გაცვლის პლატფორმა — შენი სარეკლამო ადგილი.
          </p>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "10,000+", sub: "დღიური ვიზიტორი" },
              { label: "70%", sub: "მობილური" },
              { label: "18–45", sub: "სამიზნე ჯგუფი" },
            ].map((s, i) => (
              <div
                key={i}
                className="px-5 py-3 rounded-xl"
                style={{ background: C.bg, border: `1px solid ${C.border}` }}
              >
                <p className="text-xl font-bold" style={{ color: C.green }}>
                  {s.label}
                </p>
                <p
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: C.text3 }}
                >
                  {s.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Site Map Mockup ── */}
      <section className="py-16 px-6" style={{ background: C.bg }}>
        <div className="max-w-5xl mx-auto">
          <p
            className="text-[11px] font-bold uppercase tracking-widest mb-2 text-center"
            style={{ color: C.green }}
          >
            სარეკლამო ზონების რუკა
          </p>
          <h2
            className="text-2xl font-bold text-center mb-10"
            style={{ letterSpacing: "-0.3px" }}
          >
            სად ჩანს შენი რეკლამა
          </h2>

          <div
            className="rounded-2xl overflow-hidden mb-4"
            style={{ border: `1px solid ${C.border}`, background: C.bg2 }}
          >
            {/* browser bar */}
            <div
              className="px-4 py-2 flex items-center gap-2"
              style={{
                background: C.bg3,
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                <div className="w-3 h-3 rounded-full bg-green-400/60" />
              </div>
              <div
                className="flex-1 mx-4 rounded-md px-3 py-0.5 text-xs text-center"
                style={{
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  color: C.text3,
                }}
              >
                gamitsvale.ge
              </div>
            </div>

            <div className="p-4 space-y-3">
              {/* Zone 1 */}
              <div
                className="relative rounded-xl p-4 text-center"
                style={{
                  border: `2px dashed ${C.gold}`,
                  background: C.goldLight,
                }}
              >
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold text-white"
                  style={{ background: C.gold }}
                >
                  ზონა 1 — მთავარი ბანერი
                </div>
                <p className="font-bold text-sm" style={{ color: C.gold }}>
                  1200 × 120px
                </p>
                <p className="text-xs" style={{ color: C.text3 }}>
                  Header-ის ქვეშ · ₾1500/თვე
                </p>
              </div>

              {/* Main grid */}
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-3 space-y-3">
                  <div
                    className="relative rounded-xl p-3 text-center"
                    style={{
                      border: `2px dashed rgba(26,138,74,0.4)`,
                      background: C.greenLight,
                    }}
                  >
                    <div
                      className="absolute -top-3 left-4 px-3 py-0.5 rounded-full text-[10px] font-bold text-white"
                      style={{ background: C.green }}
                    >
                      ზონა 2 — VIP კარუსელი
                    </div>
                    <p className="font-bold text-sm" style={{ color: C.green }}>
                      260 × 350px · ₾800/თვე
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="rounded-lg p-2 text-center"
                        style={
                          i === 4
                            ? {
                                border: `2px dashed rgba(26,138,74,0.3)`,
                                background: C.greenLight,
                              }
                            : {
                                border: `1px solid ${C.border}`,
                                background: C.bg,
                              }
                        }
                      >
                        {i === 4 ? (
                          <>
                            <p
                              className="text-[10px] font-bold"
                              style={{ color: C.green }}
                            >
                              ზონა 4
                            </p>
                            <p
                              className="text-[9px]"
                              style={{ color: C.text3 }}
                            >
                              ₾400/თვე
                            </p>
                          </>
                        ) : (
                          <div className="space-y-1">
                            <div
                              className="h-8 rounded"
                              style={{ background: C.bg3 }}
                            />
                            <div
                              className="h-2 rounded w-3/4 mx-auto"
                              style={{ background: C.bg3 }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-1">
                  <div
                    className="relative rounded-xl p-3 h-full flex flex-col items-center justify-center text-center"
                    style={{
                      border: `2px dashed rgba(26,138,74,0.3)`,
                      background: C.greenLight,
                    }}
                  >
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-bold text-white whitespace-nowrap"
                      style={{ background: C.green }}
                    >
                      ზონა 3
                    </div>
                    <p className="font-bold text-sm" style={{ color: C.green }}>
                      300×600
                    </p>
                    <p className="text-[10px]" style={{ color: C.text3 }}>
                      ₾600/თვე
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-center" style={{ color: C.text3 }}>
            * ვიზუალური წარმოდგენა. ფაქტობრივი განთავსება შეიძლება
            განსხვავდებოდეს.
          </p>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section
        className="py-14 px-6"
        style={{ background: C.bg2, borderTop: `1px solid ${C.border}` }}
      >
        <div className="max-w-5xl mx-auto">
          <p
            className="text-[11px] font-bold uppercase tracking-widest mb-2 text-center"
            style={{ color: C.green }}
          >
            ფასები
          </p>
          <h2
            className="text-2xl font-bold text-center mb-8"
            style={{ letterSpacing: "-0.3px" }}
          >
            სარეკლამო პაკეტები
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {adZones.map((zone) => (
              <div
                key={zone.id}
                className="relative rounded-2xl p-5 transition-all"
                style={{
                  background: zone.highlight ? C.goldLight : C.bg,
                  border: `1px solid ${zone.highlight ? C.gold : C.border}`,
                }}
              >
                {zone.badge && (
                  <span
                    className="absolute -top-3 right-4 px-3 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-widest text-white"
                    style={{ background: zone.highlight ? C.gold : C.green }}
                  >
                    {zone.badge}
                  </span>
                )}
                <h3
                  className="font-bold text-[15px] mb-1"
                  style={{ color: C.text }}
                >
                  {zone.name}
                </h3>
                <p className="text-xs mb-4" style={{ color: C.text3 }}>
                  {zone.location}
                </p>
                <p
                  className="text-2xl font-bold mb-4"
                  style={{ color: zone.highlight ? C.gold : C.green }}
                >
                  {zone.price}
                </p>
                <div className="space-y-1.5 mb-5">
                  <div
                    className="flex items-center gap-2 text-xs"
                    style={{ color: C.text2 }}
                  >
                    <span>📐</span> {zone.size}
                  </div>
                  <div
                    className="flex items-center gap-2 text-xs"
                    style={{ color: C.text2 }}
                  >
                    <span>👁️</span> {zone.views}
                  </div>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: C.text3 }}
                  >
                    {zone.description}
                  </p>
                </div>
                <a
                  href="mailto:gamitsvale@gmail.com?subject=რეკლამის განთავსება"
                  className="block w-full text-center py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                  style={{
                    background: zone.highlight ? C.gold : C.green,
                    color: "#fff",
                    textDecoration: "none",
                  }}
                >
                  შეკვეთა
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-16 px-6"
        style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-2xl font-bold mb-3"
            style={{ letterSpacing: "-0.3px" }}
          >
            მზად ხარ?
          </h2>
          <p className="text-sm mb-8" style={{ color: C.text2 }}>
            ინდივიდუალური პირობები, ფასდაკლება 3+ თვეზე — ვილაპარაკოთ.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:gamitsvale@gmail.com?subject=რეკლამა"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all"
              style={{ background: C.green, textDecoration: "none" }}
            >
              📧 gamitsvale@gmail.com
            </a>
            <a
              href="tel:+995593716080"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all"
              style={{
                border: `1px solid ${C.border}`,
                color: C.text2,
                textDecoration: "none",
              }}
            >
              📱 +995 593 71 60 80
            </a>
          </div>
          <p className="text-xs mt-6" style={{ color: C.text3 }}>
            პასუხი 24 საათის განმავლობაში · GAMITSVALE.GE
          </p>
        </div>
      </section>
    </div>
  );
}
