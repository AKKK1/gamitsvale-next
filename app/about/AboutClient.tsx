"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Mail, Phone, Facebook, ChevronRight, ArrowRight } from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

const STATS = [
  { value: "10,000+", label: "მომხმარებელი" },
  { value: "15", label: "კატეგორია" },
  { value: "0₾", label: "საკომისიო" },
  { value: "2026", label: "დაარსდა" },
];

const FEATURES = [
  {
    icon: "🔄",
    title: "გაცვლა ფულის გარეშე",
    desc: "პირველი პლატფორმა საქართველოში სადაც ნივთები ფულის გარეშე გაიცვლება — მხოლოდ შეთანხმება სჭირდება.",
  },
  {
    icon: "🛡️",
    title: "უსაფრთხო კავშირი",
    desc: "კონტაქტი მხოლოდ ორმხრივი თანხმობის შემდეგ ხდება ხელმისაწვდომი. Gmail ვერიფიკაცია სავალდებულოა.",
  },
  {
    icon: "📱",
    title: "მობილური მოწყობილობა",
    desc: "სრულად ოპტიმიზებული iOS და Android-ისთვის. PWA ტექნოლოგია — Home Screen-ზე ინსტალაცია.",
  },
  {
    icon: "⭐",
    title: "VIP განცხადებები",
    desc: "გაზარდე შენი განცხადების ხილვადობა SILVER ან VIP სტატუსით — მეტი შეთავაზება, სწრაფი გაცვლა.",
  },
  {
    icon: "🏙️",
    title: "15 კატეგორია",
    desc: "ელექტრონიკა, ავტომობილი, უძრავი ქონება, ტანსაცმელი, სოფლის მეურნეობა და სხვა.",
  },
  {
    icon: "🌍",
    title: "მთელი საქართველო",
    desc: "თბილისი, ბათუმი, ქუთაისი, რუსთავი — ყველა ქალაქი ერთ პლატფორმაზე.",
  },
];

const CONTACT = [
  {
    icon: <Mail size={18} className="text-gold shrink-0" />,
    label: "მეილი",
    value: "akakichachava1@gmail.com",
    href: "mailto:akakichachava1@gmail.com",
    copy: true,
  },
  {
    icon: <Phone size={18} className="text-gold shrink-0" />,
    label: "ტელეფონი",
    value: "+995 593 716 080",
    href: "tel:+995593716080",
    copy: false,
  },
  {
    icon: <Facebook size={18} className="text-gold shrink-0" />,
    label: "Facebook ჯგუფი",
    value: "GAMITSVALE.GE — ოფიციალური ჯგუფი",
    href: "https://www.facebook.com/groups/1465431608622052",
    copy: false,
  },
];

export default function AboutClient() {
  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      {/* ── Nav ── */}
      <div className="border-b border-dark-border bg-dark/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tighter">
            GAMITSVALE<span className="text-gold">.GE</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Link href="/" className="hover:text-white transition-colors">
              მთავარი
            </Link>
            <ChevronRight size={12} />
            <span className="text-white">ჩვენს შესახებ</span>
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* bg glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        {/* sparkles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gold/30"
            style={{
              top: `${10 + Math.random() * 80}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.3 + Math.random() * 0.5,
            }}
          />
        ))}

        <div className="max-w-3xl mx-auto text-center relative">
          <motion.div {...fade(0)}>
            <span className="inline-block px-4 py-1.5 bg-gold/10 text-gold text-[11px] font-black uppercase tracking-[0.2em] rounded-full border border-gold/20 mb-6">
              საქართველოს #1 გაცვლის პლატფორმა
            </span>
          </motion.div>
          <motion.h1
            {...fade(0.1)}
            className="text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-[1.05]"
          >
            გაცვალე ნივთები
            <br />
            <span className="text-gold">ფულის გარეშე</span>
          </motion.h1>
          <motion.p
            {...fade(0.2)}
            className="text-zinc-400 text-lg leading-relaxed max-w-xl mx-auto mb-10"
          >
            GAMITSVALE.GE — პლატფორმა სადაც ათასობით ქართველი ყოველდღე ცვლის
            ნივთებს, სერვისებს და ყველაფერს რაც სჭირდება. ფულის გარეშე. კომისიის
            გარეშე.
          </motion.p>
          <motion.div
            {...fade(0.3)}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 bg-gold text-dark font-black rounded-xl hover:brightness-110 transition-all text-sm uppercase tracking-widest"
            >
              დაიწყე გაცვლა <ArrowRight size={16} />
            </Link>
            <a
              href="https://www.facebook.com/groups/1465431608622052"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 border border-dark-border text-zinc-300 font-bold rounded-xl hover:border-gold/40 hover:text-white transition-all text-sm"
            >
              <Facebook size={16} /> Facebook ჯგუფი
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 px-4 border-y border-dark-border bg-dark-card/30">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              {...fade(i * 0.08)}
              className="text-center"
            >
              <p className="text-3xl md:text-4xl font-black text-gold mb-1">
                {s.value}
              </p>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fade(0)} className="text-center mb-14">
            <h2 className="text-3xl font-black mb-4">
              რატომ <span className="text-gold">GAMITSVALE</span>?
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              საქართველოში მილიონობით გამოუყენებელი ნივთია — ბევრს სჭირდება,
              ბევრი კი ვერ ყიდულობს. ჩვენ ეს პრობლემა გადავჭერით.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                {...fade(i * 0.07)}
                className="bg-dark-card border border-dark-border rounded-2xl p-5 hover:border-gold/30 transition-all group"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-black text-white mb-2 text-sm group-hover:text-gold transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEO content block ── */}
      <section className="py-16 px-4 bg-dark-card/20 border-y border-dark-border">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fade(0)}>
            <h2 className="text-2xl font-black mb-6 text-center">
              გაცვლა <span className="text-gold">საქართველოში</span>
            </h2>
            <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
              <p>
                <strong className="text-white">GAMITSVALE.GE</strong> არის
                საქართველოს პირველი სპეციალიზებული გაცვლის პლატფორმა.
                განსხვავებით ჩვეულებრივი გაყიდვების საიტებისგან, ჩვენ
                ფოკუსირებული ვართ{" "}
                <strong className="text-white">ნივთების გაცვლაზე</strong> —
                ყიდვა-გაყიდვის გარეშე.
              </p>
              <p>
                პლატფორმაზე შეგიძლიათ განათავსოთ{" "}
                <strong className="text-white">
                  ელექტრონიკა, ავტომობილი, უძრავი ქონება, ტანსაცმელი, სახლის
                  ნივთები, სათამაშოები, წიგნები, სოფლის მეურნეობის პროდუქტები
                </strong>{" "}
                და ბევრად მეტი. სხვა მომხმარებლები გამოგიგზავნიან შეთავაზებებს —
                ორმხრივი თანხმობის შემდეგ კი კონტაქტი ხელმისაწვდომი ხდება.
              </p>
              <p>
                სერვისი ხელმისაწვდომია{" "}
                <strong className="text-white">
                  თბილისში, ბათუმში, ქუთაისში, რუსთავში
                </strong>{" "}
                და საქართველოს ყველა ქალაქში. რეგისტრაცია და ძირითადი გამოყენება{" "}
                <strong className="text-white">სრულიად უფასოა</strong>.
              </p>
              <p>
                გაწევრიანდი დღეს — გაცვალე ის რაც გჭირდება, და მიიღე ის რაც
                გინდა. <strong className="text-gold">გამიცვალე!</strong>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fade(0)} className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">კონტაქტი</h2>
            <p className="text-zinc-500 text-sm">
              კითხვა, შეთავაზება ან პარტნიორობა — დაგვიკავშირდი
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {CONTACT.map((c, i) => (
              <motion.a
                key={c.label}
                {...fade(i * 0.1)}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  c.href.startsWith("http") ? "noopener noreferrer" : undefined
                }
                className="flex flex-col items-center text-center gap-3 p-5 bg-dark-card border border-dark-border rounded-2xl hover:border-gold/40 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  {c.icon}
                </div>
                <div>
                  <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">
                    {c.label}
                  </p>
                  <p className="text-sm text-white font-bold break-all">
                    {c.value}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>

          {/* JSON-LD structured data for local business */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "GAMITSVALE.GE",
                url: "https://gamitsvale.ge",
                description: "საქართველოს პირველი გაცვლის პლატფორმა",
                email: "akakichachava1@gmail.com",
                telephone: "+995593716080",
                address: {
                  "@type": "PostalAddress",
                  addressCountry: "GE",
                  addressLocality: "თბილისი",
                },
                sameAs: ["https://www.facebook.com/groups/1465431608622052"],
              }),
            }}
          />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-4 border-t border-dark-border">
        <div className="max-w-xl mx-auto text-center">
          <motion.div {...fade(0)}>
            <p className="text-gold text-[11px] font-black uppercase tracking-[0.2em] mb-4">
              მზად ხარ?
            </p>
            <h2 className="text-4xl font-black mb-4">
              დაიწყე <span className="text-gold">გაცვლა</span> დღეს
            </h2>
            <p className="text-zinc-500 text-sm mb-8">
              რეგისტრაცია 30 წამი სჭირდება. უფასოა.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-dark font-black rounded-xl hover:brightness-110 transition-all uppercase tracking-widest text-sm"
            >
              გაცვლა დაიწყე <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
