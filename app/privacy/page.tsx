"use client";

import Link from "next/link";

const C = {
  bg: "#ffffff",
  bg2: "#f8faf8",
  green: "#1a8a4a",
  greenLight: "#e6f5ec",
  text: "#111111",
  text2: "#555555",
  text3: "#999999",
  border: "#e8ebe8",
};

function Section({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="p-6 rounded-xl"
      style={{ background: C.bg2, border: `1px solid ${C.border}` }}
    >
      <h2
        className="text-base font-bold mb-3 flex items-start gap-2"
        style={{ color: C.text }}
      >
        <span style={{ color: C.green }}>{num}.</span> {title}
      </h2>
      <div className="text-sm leading-relaxed" style={{ color: C.text2 }}>
        {children}
      </div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 mt-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span style={{ color: C.green }}>•</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyPage() {
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
        <div className="max-w-4xl mx-auto px-6 h-[60px] flex items-center justify-between">
          <Link
            href="/"
            className="text-[17px] font-bold"
            style={{ color: C.text, textDecoration: "none" }}
          >
            GAMITSVALE<span style={{ color: C.green }}>.GE</span>
          </Link>
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: C.text3 }}
          >
            კონფიდენციალობა
          </span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ letterSpacing: "-0.3px" }}
          >
            კონფიდენციალობის <span style={{ color: C.green }}>პოლიტიკა</span>
          </h1>
          <p className="text-sm" style={{ color: C.text3 }}>
            ბოლო განახლება: 2025 წელი · GAMITSVALE.GE
          </p>
        </div>

        <div className="space-y-4">
          <Section num="1" title="ზოგადი ინფორმაცია">
            GAMITSVALE.GE ("პლატფორმა") პატივს სცემს თქვენს კონფიდენციალობას. ეს
            პოლიტიკა განმარტავს, რა ინფორმაციას ვაგროვებთ, როგორ ვიყენებთ და
            როგორ ვიცავთ თქვენს პერსონალურ მონაცემებს.
          </Section>

          <Section num="2" title="რა ინფორმაციას ვაგროვებთ">
            <BulletList
              items={[
                "სახელი და გვარი — რეგისტრაციისას",
                "ელ. ფოსტის მისამართი — ანგარიშის შექმნა და ვერიფიკაცია",
                "ტელეფონის ნომერი — სხვა მომხმარებლებთან კომუნიკაცია",
                "სოციალური ქსელების ბმულები — არასავალდებულო, პროფილისთვის",
                "განცხადებების ფოტოები — Cloudinary-ზე ინახება",
                "IP მისამართი და browser-ის ინფორმაცია — უსაფრთხოებისთვის",
              ]}
            />
          </Section>

          <Section num="3" title="Facebook Login">
            <p>თუ Facebook-ით შესვლას გამოიყენებთ, ჩვენ ვიღებთ:</p>
            <BulletList
              items={[
                "სახელი — პროფილის შესაქმნელად",
                "პროფილის სურათი — ავატარისთვის",
                "Facebook ID — ანგარიშის იდენტიფიკაციისთვის",
              ]}
            />
            <p className="mt-3" style={{ color: C.text3 }}>
              ჩვენ არ ვინახავთ Facebook პაროლს და არ ვაქვეყნებთ Facebook-ზე
              თქვენი ნებართვის გარეშე.
            </p>
          </Section>

          <Section num="4" title="მონაცემების გამოყენება">
            <BulletList
              items={[
                "ანგარიშის მართვა და ვერიფიკაცია",
                "განცხადებებისა და შეთავაზებების გამოქვეყნება",
                "შეტყობინებების გაგზავნა",
                "პლატფორმის უსაფრთხოება და Fraud Prevention",
                "სერვისის გაუმჯობესება",
              ]}
            />
          </Section>

          <Section num="5" title="მონაცემების გაზიარება">
            <p>ჩვენ არ ვყიდით და არ ვაზიარებთ პერსონალურ მონაცემებს, გარდა:</p>
            <BulletList
              items={[
                "Cloudinary — სურათების შენახვა",
                "MongoDB Atlas — მონაცემთა ბაზა",
                "Google/Facebook — OAuth ავტორიზაციისთვის",
                "კანონმდებლობის მოთხოვნის შემთხვევაში",
              ]}
            />
          </Section>

          <Section num="6" title="მონაცემების წაშლა">
            <p>თქვენ გაქვთ უფლება მოითხოვოთ მონაცემების სრული წაშლა:</p>
            <ul className="space-y-1.5 mt-2">
              <li className="flex items-start gap-2">
                <span style={{ color: C.green }}>•</span>
                გამოგვიგზავნეთ მეილი:{" "}
                <a
                  href="mailto:gamitsvale@gmail.com"
                  style={{ color: C.green }}
                >
                  gamitsvale@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: C.green }}>•</span>
                მიუთითეთ: "მონაცემების წაშლის მოთხოვნა" + თქვენი მეილი
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: C.green }}>•</span>7 სამუშაო დღის
                განმავლობაში ვასრულებთ
              </li>
            </ul>
          </Section>

          <Section num="7" title="Cookies">
            ჩვენ ვიყენებთ HttpOnly cookie-ებს ავტორიზაციისთვის. ეს cookie-ები
            სავალდებულოა პლატფორმის სწორი მუშაობისთვის. ისინი არ შეიცავენ პირად
            ინფორმაციას, ვადა 30 დღეა.
          </Section>

          <Section num="8" title="კონტაქტი">
            <div className="space-y-1">
              <p>
                📧{" "}
                <a
                  href="mailto:gamitsvale@gmail.com"
                  style={{ color: C.green }}
                >
                  gamitsvale@gmail.com
                </a>
              </p>
              <p>
                🌐{" "}
                <a href="https://gamitsvale.ge" style={{ color: C.green }}>
                  gamitsvale.ge
                </a>
              </p>
              <p>📍 ქვეყანა: საქართველო</p>
            </div>
          </Section>
        </div>

        <div
          className="mt-12 pt-8 text-center"
          style={{ borderTop: `1px solid ${C.border}` }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold uppercase tracking-widest"
            style={{ background: C.green, textDecoration: "none" }}
          >
            ← მთავარზე დაბრუნება
          </Link>
        </div>
      </main>
    </div>
  );
}
