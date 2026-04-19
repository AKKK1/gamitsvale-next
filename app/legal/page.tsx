"use client";

import Link from "next/link";
import { useState } from "react";

const C = {
  bg: "#ffffff",
  bg2: "#f8faf8",
  green: "#1a8a4a",
  greenLight: "#e6f5ec",
  greenDark: "#125e33",
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

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<"privacy" | "terms">("privacy");

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
            კანონიერი დოკუმენტები
          </span>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div
        className="sticky top-[60px] z-40"
        style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex gap-0">
            {[
              { id: "privacy", label: "კონფიდენციალობა" },
              { id: "terms", label: "მომსახურების პირობები" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="px-6 py-4 font-bold uppercase text-xs tracking-widest border-b-2 transition-all"
                style={{
                  borderBottomColor:
                    activeTab === tab.id ? C.green : "transparent",
                  color: activeTab === tab.id ? C.green : C.text3,
                  background: "transparent",
                  cursor: "pointer",
                  marginBottom: -1,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* ── PRIVACY ── */}
        {activeTab === "privacy" && (
          <div>
            <div className="mb-10">
              <h1
                className="text-3xl font-bold mb-2"
                style={{ letterSpacing: "-0.3px" }}
              >
                კონფიდენციალობის{" "}
                <span style={{ color: C.green }}>პოლიტიკა</span>
              </h1>
              <p className="text-sm" style={{ color: C.text3 }}>
                ბოლო განახლება: 2026 წელი · GAMITSVALE.GE
              </p>
            </div>
            <div className="space-y-4">
              <Section num="1" title="ზოგადი ინფორმაცია">
                GAMITSVALE.GE ("პლატფორმა") პატივს სცემს თქვენს
                კონფიდენციალობას. ეს პოლიტიკა განმარტავს, რა ინფორმაციას
                ვაგროვებთ, როგორ ვიყენებთ და როგორ ვიცავთ თქვენს პერსონალურ
                მონაცემებს.
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
                <p>
                  ჩვენ არ ვყიდით და არ ვაზიარებთ პერსონალურ მონაცემებს, გარდა:
                </p>
                <BulletList
                  items={[
                    "Cloudinary — სურათების შენახვა",
                    "MongoDB Atlas — მონაცემთა ბაზა",
                    "Google/Facebook — OAuth ავტორიზაციისთვის",
                    "კანონმდებლობის მოთხოვნის შემთხვევაში",
                  ]}
                />
              </Section>
              <Section num="6" title="მონაცემების უსაფრთხოება">
                <BulletList
                  items={[
                    "ყველა მონაცემი HTTPS-ით დაშიფრულია",
                    "პაროლები bcrypt-ით დაცულია",
                    "მონაცემთა ბაზა MongoDB Atlas-ზე (უსაფრთხო გარემო)",
                    "რეგულარული უსაფრთხოების აუდიტი",
                  ]}
                />
              </Section>
              <Section num="7" title="მონაცემების წაშლა">
                <p>
                  თქვენ გაქვთ უფლება მოითხოვოთ თქვენი მონაცემების სრული წაშლა:
                </p>
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
                    განმავლობაში ვასრულებთ მოთხოვნას
                  </li>
                </ul>
              </Section>
              <Section num="8" title="Cookies">
                ჩვენ ვიყენებთ HttpOnly cookie-ებს ავტორიზაციისთვის. ეს
                cookie-ები სავალდებულოა პლატფორმის სწორი მუშაობისთვის. ისინი არ
                შეიცავენ პირად ინფორმაციას და ვადა 30 დღეა.
              </Section>
              <Section num="9" title="კონტაქტი">
                <p>კითხვების შემთხვევაში დაგვიკავშირდით:</p>
                <div className="space-y-1 mt-2">
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
          </div>
        )}

        {/* ── TERMS ── */}
        {activeTab === "terms" && (
          <div>
            <div className="mb-10">
              <h1
                className="text-3xl font-bold mb-2"
                style={{ letterSpacing: "-0.3px" }}
              >
                მომსახურების <span style={{ color: C.green }}>პირობები</span>
              </h1>
              <p className="text-sm" style={{ color: C.text3 }}>
                ბოლო განახლება: 2026 წელი · GAMITSVALE.GE
              </p>
            </div>
            <div className="space-y-4">
              <Section num="1" title="პირობების მიღება">
                GAMITSVALE.GE-ს გამოყენებით თქვენ ეთანხმებით ამ პირობებს. თუ არ
                ეთანხმებით, გთხოვთ არ გამოიყენოთ პლატფორმა.
              </Section>
              <Section num="2" title="ანგარიშის პასუხისმგებლობა">
                <BulletList
                  items={[
                    "თქვენ პასუხისმგებელი ხართ თქვენი პაროლის დაცვის გამო",
                    "თქვენი ანგარიშით ნაკეთი ყველა მოქმედება თქვენი პასუხისმგებლობაა",
                    "თუ თქვენი ანგარიში გაჩაგრეს, დაუყოვნებლივ გვაცნობეთ",
                  ]}
                />
              </Section>
              <Section num="3" title="კონტენტის უფლებები">
                <p>
                  თქვენ ფლობთ გამოქვეყნებული კონტენტის უფლებებს. გამოქვეყნებით:
                </p>
                <BulletList
                  items={[
                    "ჩვენ ვიღებთ უფლებას, გამოვაჩინოთ კონტენტი პლატფორმაზე",
                    "სხვა მომხმარებლებმა შეიძლება ნახონ განცხადება",
                    "ჩვენ არ ვყიდით კონტენტს მესამე პირებზე",
                  ]}
                />
              </Section>
              <Section num="4" title="აკრძალული ქმედებები">
                <p>თქვენ არ უნდა:</p>
                <BulletList
                  items={[
                    "გამოაქვეყნოთ ცრუ ან მატყუარა ინფორმაცია",
                    "სხვა მომხმარებელი მოტყუოთ ან გამოიყენოთ",
                    "გამოაქვეყნოთ კანონით აკრძალული ნივთები",
                    "გავრცელოთ სპამი, ჰაკინგი ან პირად ინფო-ს მოტაცება",
                    "განათავსოთ კონტენტი, რომელიც ძალადობას ან დისკრიმინაციას ახლავს",
                  ]}
                />
              </Section>
              <Section num="5" title="მოდერაცია და წაშლა">
                ჩვენ უფლება გვაქვს წავშალოთ კონტენტი, რომელიც ეტიკას ან კანონს
                არღვევს, წინასწარი გაფრთხილების გარეშე.
              </Section>
              <Section num="6" title="ანგარიშის წაშლა">
                <p>ანგარიშის წასაშლელად:</p>
                <ul className="space-y-1.5 mt-2">
                  <li className="flex items-start gap-2">
                    <span style={{ color: C.green }}>•</span>
                    <a
                      href="mailto:gamitsvale@gmail.com"
                      style={{ color: C.green }}
                    >
                      gamitsvale@gmail.com
                    </a>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: C.green }}>•</span>
                    მიუთითეთ: "ანგარიშის წაშლა"
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: C.green }}>•</span>7 სამუშაო დღეში
                    ვასრულებთ
                  </li>
                </ul>
              </Section>
              <Section num="7" title="ვალდებულების ზღვარი">
                GAMITSVALE.GE მოწოდებულია "როგორც რომ არის". ჩვენ არ ვაგებთ
                პასუხს ნებისმიერი ზარალისთვის, რომელიც შეიძლება მოხდეს
                პლატფორმის გამოყენებისას.
              </Section>
              <Section num="8" title="პირობების ცვლილება">
                ჩვენ შეიძლება შევცვალოთ ეს პირობები. ცვლილება ძალაში შედის 7
                დღის შემდეგ, მომხმარებლების ინფორმირების შემდეგ.
              </Section>
              <Section num="9" title="კონტაქტი">
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
          </div>
        )}

        <div
          className="mt-12 pt-8 text-center"
          style={{ borderTop: `1px solid ${C.border}` }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold uppercase tracking-widest transition-all"
            style={{ background: C.green, textDecoration: "none" }}
          >
            ← მთავარზე დაბრუნება
          </Link>
        </div>
      </main>
    </div>
  );
}
