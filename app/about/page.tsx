"use client";

// app/about/page.tsx
import Link from "next/link";

const stats = [
  { value: "10,000+", label: "მომხმარებელი" },
  { value: "15", label: "კატეგორია" },
  { value: "2024", label: "დაარსდა" },
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
    <div className="min-h-screen bg-dark text-white">
      {/* Header */}
      <div className="border-b border-dark-border bg-dark/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tighter">
            GAMITSVALE<span className="text-gold">.GE</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/rules"
              className="text-zinc-400 hover:text-white transition-colors hidden sm:block"
            >
              წესები
            </Link>
            <Link
              href="/advertise"
              className="text-zinc-400 hover:text-white transition-colors hidden sm:block"
            >
              რეკლამა
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
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gold/5 blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs font-black uppercase tracking-widest mb-6">
            🇬🇪 Made in Georgia
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-5 leading-none">
            გაცვლა <span className="text-gold">გამარტივდა</span>
          </h1>
          <p className="text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8">
            GAMITSVALE.GE — საქართველოს პირველი სპეციალიზებული პლატფორმა
            ნივთების გასაცვლელად. გაცვალე ტელეფონი, ავტომობილი, ტანსაცმელი ან
            ნებისმიერი სხვა ნივთი — ფულის გარეშე.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/"
              className="px-6 py-2.5 bg-gold text-dark font-black rounded-xl hover:brightness-110 transition-all text-sm uppercase tracking-widest"
            >
              პლატფორმაზე →
            </Link>
            <a
              href="#contact"
              className="px-6 py-2.5 border border-dark-border text-zinc-400 font-bold rounded-xl hover:border-gold hover:text-gold transition-all text-sm"
            >
              კონტაქტი
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-4 border-y border-dark-border bg-dark-card/20">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-black text-gold mb-1">{s.value}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-gold text-xs font-black uppercase tracking-widest mb-3">
                ჩვენი მისია
              </p>
              <h2 className="text-3xl font-black mb-4 leading-tight">
                ყველას შეუძლია <span className="text-gold">გაცვლა</span>
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-3 text-sm">
                საქართველოში მილიონობით ნივთი გვიყრია სახლში გამოუყენებელი.
                ამავდროულად ათასობით ადამიანს სჭირდება ის, რაც სხვას ზედმეტი
                აქვს.
              </p>
              <p className="text-zinc-400 leading-relaxed text-sm">
                GAMITSVALE.GE-მ ეს ადამიანები ერთმანეთთან დააახლოვა — პლატფორმა
                სადაც ნივთების გაცვლა მარტივი, სწრაფი და უსაფრთხოა. გაცვლა
                თბილისში, ქუთაისში, ბათუმში და მთელ საქართველოში.
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
                  className="flex items-start gap-3 p-4 rounded-xl bg-dark-card border border-dark-border hover:border-gold/20 transition-all"
                >
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-black text-white text-sm mb-0.5">
                      {item.title}
                    </p>
                    <p className="text-xs text-zinc-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEO Tags */}
      <section className="py-10 px-4 bg-dark-card/20 border-y border-dark-border">
        <div className="max-w-4xl mx-auto">
          <p className="text-gold text-xs font-black uppercase tracking-widest mb-4 text-center">
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
                className="px-3 py-1.5 rounded-full bg-dark border border-dark-border text-zinc-500 text-xs hover:border-gold/30 hover:text-gold transition-all cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-gold text-xs font-black uppercase tracking-widest mb-2 text-center">
            FAQ
          </p>
          <h2 className="text-3xl font-black text-center mb-8">
            ხშირი კითხვები
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-5 rounded-xl bg-dark-card border border-dark-border hover:border-gold/20 transition-all"
              >
                <p className="font-black text-white text-sm mb-2 flex items-start gap-2">
                  <span className="text-gold shrink-0">Q.</span>
                  {faq.q}
                </p>
                <p className="text-zinc-400 text-sm leading-relaxed pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 px-4 border-t border-dark-border">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gold text-xs font-black uppercase tracking-widest mb-2">
            კონტაქტი
          </p>
          <h2 className="text-3xl font-black mb-3">დაგვიკავშირდი</h2>
          <p className="text-zinc-400 text-sm mb-8">
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
                className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-dark-card border border-dark-border hover:border-gold/40 hover:bg-gold/5 transition-all group"
              >
                <span className="text-3xl">{c.icon}</span>
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">
                    {c.label}
                  </p>
                  <p className="text-xs font-bold text-white group-hover:text-gold transition-colors break-all">
                    {c.value}
                  </p>
                </div>
              </a>
            ))}
          </div>
          <p className="text-xs text-zinc-600">
            GAMITSVALE.GE © 2024–2025 · All rights reserved
          </p>
        </div>
      </section>
    </div>
  );
}
