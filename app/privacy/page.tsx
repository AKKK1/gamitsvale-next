"use client";

// app/privacy/page.tsx

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Header */}
      <div className="border-b border-dark-border bg-dark/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tighter">
            GAMITSVALE<span className="text-gold">.GE</span>
          </Link>
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
            კონფიდენციალობა
          </span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-black mb-3">
            კონფიდენციალობის <span className="text-gold">პოლიტიკა</span>
          </h1>
          <p className="text-zinc-400 text-sm">
            ბოლო განახლება: 2025 წელი · GAMITSVALE.GE
          </p>
        </div>

        <div className="space-y-8 text-zinc-300 leading-relaxed">
          <section className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <h2 className="text-lg font-black text-white mb-3 flex items-center gap-2">
              <span className="text-gold">1.</span> ზოგადი ინფორმაცია
            </h2>
            <p className="text-sm">
              GAMITSVALE.GE ("პლატფორმა", "ჩვენ") პატივს სცემს თქვენს
              კონფიდენციალობას. ეს პოლიტიკა განმარტავს, რა ინფორმაციას
              ვაგროვებთ, როგორ ვიყენებთ და როგორ ვიცავთ თქვენს პერსონალურ
              მონაცემებს.
            </p>
          </section>

          <section className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <h2 className="text-lg font-black text-white mb-3 flex items-center gap-2">
              <span className="text-gold">2.</span> რა ინფორმაციას ვაგროვებთ
            </h2>
            <ul className="space-y-2 text-sm">
              {[
                "სახელი და გვარი — რეგისტრაციისას",
                "ელ. ფოსტის მისამართი — ანგარიშის შექმნა და ვერიფიკაცია",
                "ტელეფონის ნომერი — სხვა მომხმარებლებთან კომუნიკაცია",
                "სოციალური ქსელების ბმულები — არასავალდებულო, პროფილისთვის",
                "განცხადებების ფოტოები — Cloudinary-ზე ინახება",
                "IP მისამართი და browser-ის ინფორმაცია — უსაფრთხოებისთვის",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <h2 className="text-lg font-black text-white mb-3 flex items-center gap-2">
              <span className="text-gold">3.</span> Facebook Login
            </h2>
            <p className="text-sm mb-3">
              თუ Facebook-ით შესვლას გამოიყენებთ, ჩვენ ვიღებთ:
            </p>
            <ul className="space-y-2 text-sm">
              {[
                "სახელი — პროფილის შესაქმნელად",
                "პროფილის სურათი — ავატარისთვის",
                "Facebook ID — ანგარიშის იდენტიფიკაციისთვის",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm mt-3 text-zinc-400">
              ჩვენ არ ვინახავთ Facebook პაროლს და არ ვაქვეყნებთ Facebook-ზე
              თქვენი ნებართვის გარეშე.
            </p>
          </section>

          <section className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <h2 className="text-lg font-black text-white mb-3 flex items-center gap-2">
              <span className="text-gold">4.</span> მონაცემების გამოყენება
            </h2>
            <ul className="space-y-2 text-sm">
              {[
                "ანგარიშის მართვა და ვერიფიკაცია",
                "განცხადებებისა და შეთავაზებების გამოქვეყნება",
                "შეტყობინებების გაგზავნა",
                "პლატფორმის უსაფრთხოება და Fraud Prevention",
                "სერვისის გაუმჯობესება",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <h2 className="text-lg font-black text-white mb-3 flex items-center gap-2">
              <span className="text-gold">5.</span> მონაცემების გაზიარება
            </h2>
            <p className="text-sm mb-3">
              ჩვენ არ ვყიდით და არ ვაზიარებთ თქვენს პერსონალურ მონაცემებს მესამე
              პირებთან, გარდა:
            </p>
            <ul className="space-y-2 text-sm">
              {[
                "Cloudinary — სურათების შენახვა",
                "MongoDB Atlas — მონაცემთა ბაზა",
                "Google/Facebook — OAuth ავტორიზაციისთვის",
                "კანონმდებლობის მოთხოვნის შემთხვევაში",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <h2 className="text-lg font-black text-white mb-3 flex items-center gap-2">
              <span className="text-gold">6.</span> მონაცემების წაშლა
            </h2>
            <p className="text-sm mb-3">
              თქვენ გაქვთ უფლება მოითხოვოთ თქვენი ანგარიშის და პერსონალური
              მონაცემების სრული წაშლა. ამისთვის:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-gold mt-0.5">•</span>
                გამოგვიგზავნეთ მეილი:{" "}
                <a
                  href="mailto:gamitsvale@gmail.com"
                  className="text-gold hover:underline"
                >
                  gamitsvale@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-0.5">•</span>
                მიუთითეთ: "მონაცემების წაშლის მოთხოვნა" + თქვენი მეილი
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-0.5">•</span>7 სამუშაო დღის
                განმავლობაში ვასრულებთ მოთხოვნას
              </li>
            </ul>
          </section>

          <section className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <h2 className="text-lg font-black text-white mb-3 flex items-center gap-2">
              <span className="text-gold">7.</span> Cookies
            </h2>
            <p className="text-sm">
              ჩვენ ვიყენებთ HttpOnly cookie-ებს ავტორიზაციისთვის. ეს cookie-ები
              სავალდებულოა პლატფორმის სწორი მუშაობისთვის. ისინი არ შეიცავენ
              პირად ინფორმაციას და ვადა 30 დღეა.
            </p>
          </section>

          <section className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <h2 className="text-lg font-black text-white mb-3 flex items-center gap-2">
              <span className="text-gold">8.</span> კონტაქტი
            </h2>
            <p className="text-sm">კითხვების შემთხვევაში დაგვიკავშირდით:</p>
            <div className="mt-3 space-y-1 text-sm">
              <p>
                📧{" "}
                <a
                  href="gamitsvale@gmail.com"
                  className="text-gold hover:underline"
                >
                  gamitsvale@gmail.com
                </a>
              </p>
              <p>
                🌐{" "}
                <a
                  href="https://gamitsvale.ge"
                  className="text-gold hover:underline"
                >
                  gamitsvale.ge
                </a>
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-dark-border text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-dark font-black rounded-xl hover:brightness-110 transition-all text-sm uppercase tracking-widest"
          >
            ← მთავარზე დაბრუნება
          </Link>
        </div>
      </main>
    </div>
  );
}
