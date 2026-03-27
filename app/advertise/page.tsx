"use client";

// app/advertise/page.tsx
import Link from "next/link";

const adZones = [
  {
    id: "banner-top",
    name: "მთავარი ბანერი",
    location: "მთავარი გვერდი — ზედა",
    size: "1200×120px",
    price: "₾1500 / თვე",
    priceEn: "1500 GEL/month",
    views: "~50,000 view/თვე",
    description: "ყველაზე ხილული ადგილი. ყოველი ვიზიტორი ხედავს.",
    badge: "BEST",
    badgeColor: "bg-gold text-dark",
    highlight: true,
  },
  {
    id: "vip-carousel",
    name: "VIP კარუსელი",
    location: "მთავარი გვერდი — VIP სექცია",
    size: "260×350px",
    price: "₾800 / თვე",
    priceEn: "800 GEL/month",
    views: "~30,000 view/თვე",
    description: "VIP განცხადებების გვერდით. მაღალი engagement.",
    badge: "POPULAR",
    badgeColor: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    highlight: false,
  },
  {
    id: "sidebar",
    name: "გვერდითი ბანერი",
    location: "კატეგორიის გვერდი — მარჯვენა",
    size: "300×600px",
    price: "₾600 / თვე",
    priceEn: "600 GEL/month",
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
    priceEn: "400 GEL/month",
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
    priceEn: "500 GEL/month",
    views: "~25,000 view/თვე",
    description: "70%+ ვიზიტორი მობილურით მოდის.",
    badge: "MOBILE",
    badgeColor:
      "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    highlight: false,
  },
];

export default function AdvertisePage() {
  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Header */}
      <div className="border-b border-dark-border bg-dark/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tighter">
            GAMITSVALE<span className="text-gold">.GE</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/about"
              className="text-zinc-400 hover:text-white transition-colors hidden sm:block"
            >
              ჩვენს შესახებ
            </Link>
            <Link
              href="/rules"
              className="text-zinc-400 hover:text-white transition-colors hidden sm:block"
            >
              წესები
            </Link>
            <Link
              href="/"
              className="px-4 py-1.5 bg-gold text-dark font-black rounded-lg text-xs hover:brightness-110 transition-all"
            >
              მთავარი
            </Link>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative py-16 px-4 border-b border-dark-border overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/5 blur-[80px]" />
        </div>
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs font-black uppercase tracking-widest mb-5">
            📢 რეკლამა
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
            გამოაჩინე შენი
            <br />
            <span className="text-gold">ბიზნესი</span>
          </h1>
          <p className="text-zinc-400 max-w-xl leading-relaxed mb-6 text-sm">
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
                className="px-5 py-3 rounded-xl bg-dark-card border border-dark-border"
              >
                <p className="text-xl font-black text-gold">{s.label}</p>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                  {s.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Site Map Visual */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-gold text-xs font-black uppercase tracking-widest mb-2 text-center">
            სარეკლამო ზონების რუკა
          </p>
          <h2 className="text-2xl font-black text-center mb-10">
            სად ჩანს შენი რეკლამა
          </h2>

          {/* Desktop Mockup */}
          <div className="rounded-2xl border border-dark-border bg-dark-card overflow-hidden mb-6">
            <div className="bg-dark/50 px-4 py-2 border-b border-dark-border flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="flex-1 mx-4 bg-dark rounded-md px-3 py-0.5 text-xs text-zinc-600 text-center">
                gamitsvale.ge
              </div>
            </div>

            <div className="p-4 space-y-3">
              {/* Zone 1: Top Banner */}
              <div className="relative rounded-xl border-2 border-dashed border-gold/60 bg-gold/5 p-4 text-center">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gold text-dark text-[10px] font-black rounded-full uppercase tracking-widest">
                  ზონა 1 — მთავარი ბანერი
                </div>
                <p className="text-gold font-black text-sm">1200 × 120px</p>
                <p className="text-zinc-500 text-xs">
                  Header-ის ქვეშ · ყველა გვერდი · ₾1500/თვე
                </p>
              </div>

              {/* Main content area */}
              <div className="grid grid-cols-4 gap-3">
                {/* Listings */}
                <div className="col-span-3 space-y-3">
                  {/* VIP carousel zone */}
                  <div className="relative rounded-xl border-2 border-dashed border-blue-500/50 bg-blue-500/5 p-3 text-center">
                    <div className="absolute -top-3 left-4 px-3 py-0.5 bg-blue-500/80 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                      ზონა 2 — VIP კარუსელი
                    </div>
                    <p className="text-blue-400 font-black text-sm">
                      260 × 350px
                    </p>
                    <p className="text-zinc-500 text-xs">
                      VIP სექცია · ₾800/თვე
                    </p>
                  </div>

                  {/* Listing grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-lg border p-2 text-center ${i === 4 ? "border-dashed border-emerald-500/50 bg-emerald-500/5" : "border-dark-border bg-dark/40"}`}
                      >
                        {i === 4 ? (
                          <>
                            <p className="text-emerald-400 font-black text-[10px]">
                              ზონა 4
                            </p>
                            <p className="text-zinc-500 text-[9px]">
                              სიაში · ₾400/თვე
                            </p>
                          </>
                        ) : (
                          <div className="space-y-1">
                            <div className="h-8 bg-zinc-800 rounded" />
                            <div className="h-2 bg-zinc-800 rounded w-3/4 mx-auto" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sidebar */}
                <div className="col-span-1">
                  <div className="relative rounded-xl border-2 border-dashed border-purple-500/50 bg-purple-500/5 p-3 text-center h-full flex flex-col items-center justify-center">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-purple-500/80 text-white text-[9px] font-black rounded-full uppercase tracking-widest whitespace-nowrap">
                      ზონა 3
                    </div>
                    <p className="text-purple-400 font-black text-sm">
                      300×600
                    </p>
                    <p className="text-zinc-500 text-[10px]">Sidebar</p>
                    <p className="text-zinc-500 text-[10px]">₾600/თვე</p>
                  </div>
                </div>
              </div>

              {/* Mobile banner */}
              <div className="relative rounded-xl border-2 border-dashed border-emerald-500/50 bg-emerald-500/5 p-3 text-center md:hidden">
                <div className="absolute -top-3 left-4 px-3 py-0.5 bg-emerald-500/80 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                  ზონა 5 — მობილური
                </div>
                <p className="text-emerald-400 font-black text-sm">
                  360 × 60px
                </p>
                <p className="text-zinc-500 text-xs">მობილური · ₾500/თვე</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-zinc-600 text-center">
            * ვიზუალური წარმოდგენა. ფაქტობრივი განთავსება შეიძლება
            განსხვავდებოდეს.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4 border-t border-dark-border">
        <div className="max-w-5xl mx-auto">
          <p className="text-gold text-xs font-black uppercase tracking-widest mb-2 text-center">
            ფასები
          </p>
          <h2 className="text-2xl font-black text-center mb-8">
            სარეკლამო პაკეტები
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {adZones.map((zone) => (
              <div
                key={zone.id}
                className={`relative rounded-2xl border p-5 transition-all hover:-translate-y-0.5 ${
                  zone.highlight
                    ? "border-gold/50 bg-gold/5 shadow-[0_0_30px_rgba(212,175,55,0.1)]"
                    : "border-dark-border bg-dark-card hover:border-gold/20"
                }`}
              >
                {zone.badge && (
                  <span
                    className={`absolute -top-3 right-4 px-3 py-0.5 text-[10px] font-black rounded-full uppercase tracking-widest ${zone.badgeColor || "bg-gold text-dark"}`}
                  >
                    {zone.badge}
                  </span>
                )}
                <div className="mb-4">
                  <h3 className="font-black text-white text-base mb-1">
                    {zone.name}
                  </h3>
                  <p className="text-xs text-zinc-500">{zone.location}</p>
                </div>
                <div className="flex items-end gap-2 mb-4">
                  <p
                    className={`text-2xl font-black ${zone.highlight ? "text-gold" : "text-white"}`}
                  >
                    {zone.price}
                  </p>
                </div>
                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="text-gold">📐</span> {zone.size}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="text-gold">👁️</span> {zone.views}
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {zone.description}
                  </p>
                </div>
                <a
                  href="mailto:gamitsvale@gmail.com?subject=რეკლამის განთავსება — GAMITSVALE.GE"
                  className={`block w-full text-center py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    zone.highlight
                      ? "bg-gold text-dark hover:brightness-110"
                      : "border border-dark-border text-zinc-400 hover:border-gold hover:text-gold"
                  }`}
                >
                  შეკვეთა
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Contact */}
      <section className="py-16 px-4 border-t border-dark-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-black mb-3">მზად ხარ?</h2>
          <p className="text-zinc-400 text-sm mb-8">
            ინდივიდუალური პირობები, ფასდაკლება 3+ თვეზე, custom ზომები —
            ვილაპარაკოთ.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:gamitsvale@gmail.com?subject=რეკლამა — GAMITSVALE.GE"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gold text-dark font-black rounded-xl hover:brightness-110 transition-all text-sm"
            >
              📧 gamitsvale@gmail.com
            </a>
            <a
              href="tel:+995593716080"
              className="flex items-center justify-center gap-2 px-6 py-3 border border-dark-border text-zinc-400 font-bold rounded-xl hover:border-gold hover:text-gold transition-all text-sm"
            >
              📱 +995 593 71 60 80
            </a>
          </div>
          <p className="text-xs text-zinc-600 mt-6">
            პასუხი 24 საათის განმავლობაში · GAMITSVALE.GE
          </p>
        </div>
      </section>
    </div>
  );
}
