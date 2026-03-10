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
    icon: <UserPlus size={22} />,
    number: "01",
    title: "დარეგისტრირდი",
    description:
      "შექმენი უფასო ანგარიში — მიუთითე სახელი, მაილი და პაროლი. ასევე შეგიძლია Google-ით შეხვიდე.",
  },
  {
    icon: <Search size={22} />,
    number: "02",
    title: "იპოვე სასურველი ნივთი",
    description:
      "მთავარ გვერდზე დაათვალიერე განცხადებები. გამოიყენე კატეგორია ან ქალაქის ფილტრი სწრაფი ძიებისთვის.",
  },
  {
    icon: <MessageSquare size={22} />,
    number: "03",
    title: "გაუგზავნე შეთავაზება",
    description:
      'განცხადების გვერდზე დააჭირე "შეთავაზება" — აღწერე რა გინდა შემოთავაზო, დაამატე ფოტოც შეგიძლია.',
  },
  {
    icon: <Handshake size={22} />,
    number: "04",
    title: "დაელოდე პასუხს",
    description:
      "მეორე მხარე დაინახავს შეთავაზებას — დათანხმდება, უარყოფს ან დაფიქრდება. შენ მიიღებ შეტყობინებას.",
  },
  {
    icon: <CheckCircle2 size={22} />,
    number: "05",
    title: "გაცვლა!",
    description:
      "დათანხმებისას ორივეს ეჩვენება მეორე მხარის კონტაქტი. დაუკავშირდი და შეთანხმდი გაცვლის ადგილზე.",
  },
  {
    icon: <Star size={22} />,
    number: "06",
    title: "განათავსე შენი განცხადებაც",
    description:
      'პროფილში "+" ღილაკზე დაჭერით განათავსე შენი ნივთი — დღეში 3-ჯერ შეგიძლია. ფოტო, კატეგორია, ქალაქი.',
  },
];

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-dark">
      <Header onAddListing={() => {}} />
      <main className="max-w-3xl mx-auto px-4 py-16">
        {/* ── სათაური ── */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black tracking-tight mb-4 text-white">
            პლატფორმის <span className="text-gold">წესები</span>
          </h1>
          <p className="text-zinc-500 font-medium">
            გთხოვთ გაეცნოთ წესებს, რათა თქვენი გამოცდილება იყოს უსაფრთხო და
            სასიამოვნო.
          </p>
        </div>

        <div className="space-y-8">
          {/* ── როგორ გამოვიყენო — ნაბიჯ-ნაბიჯ ── */}
          <section className="bg-dark-card p-8 rounded-[32px] border border-dark-border shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-gold/10 text-gold rounded-xl">
                <BookOpen size={24} />
              </div>
              <h2 className="text-xl font-black text-white">
                როგორ გამოვიყენო საიტი
              </h2>
            </div>

            <div className="space-y-4">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 rounded-2xl border border-dark-border hover:border-gold/30 transition-all group"
                >
                  {/* ნომერი + icon */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                      {step.icon}
                    </div>
                    {/* connector ხაზი — ბოლო ელემენტს არ აქვს */}
                    {i < steps.length - 1 && (
                      <div className="w-px h-4 bg-dark-border" />
                    )}
                  </div>

                  {/* ტექსტი */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-gold/50 tracking-widest">
                        {step.number}
                      </span>
                      <h3 className="text-sm font-black text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── ზოგადი წესები ── */}
          <section className="bg-dark-card p-8 rounded-[32px] border border-dark-border shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gold/10 text-gold rounded-xl">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-xl font-black text-white">ზოგადი წესები</h2>
            </div>
            <ul className="space-y-4">
              {[
                "ერთი მომხმარებლისთვის დღიური ლიმიტი არის 3 განცხადების განთავსება.",
                "აკრძალულია ერთი და იგივე ნივთის მრავალჯერადი განთავსება.",
                "განცხადება უნდა შეიცავდეს რეალურ ფოტოებს და ზუსტ აღწერას.",
              ].map((rule, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-zinc-400 font-medium"
                >
                  <CheckCircle2
                    size={18}
                    className="text-green-500 shrink-0 mt-0.5"
                  />
                  {rule}
                </li>
              ))}
            </ul>
          </section>

          {/* ── აკრძალვები ── */}
          <section className="bg-dark-card p-8 rounded-[32px] border border-dark-border shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-500/10 text-red-500 rounded-xl">
                <AlertCircle size={24} />
              </div>
              <h2 className="text-xl font-black text-white">აკრძალვები</h2>
            </div>
            <ul className="space-y-4">
              {[
                "აკრძალულია კანონით აკრძალული ნივთების ან სერვისების განთავსება.",
                "აკრძალულია შეურაცხმყოფელი ლექსიკის გამოყენება აღწერაში ან შეთავაზებაში.",
                "სპამი და თაღლითური ქმედებები გამოიწვევს ანგარიშის სამუდამო ბლოკირებას.",
              ].map((rule, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-zinc-400 font-medium"
                >
                  <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                  {rule}
                </li>
              ))}
            </ul>
          </section>

          {/* ── გახსოვდეთ — gold banner ── */}
          <section className="bg-gold text-dark p-8 rounded-[32px] shadow-xl shadow-gold/20">
            <h2 className="text-xl font-black mb-4">გახსოვდეთ!</h2>
            <p className="text-sm font-medium opacity-90 leading-relaxed">
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
