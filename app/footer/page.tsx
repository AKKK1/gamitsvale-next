"use client";

import React from "react";
import Link from "next/link";
import { Instagram, Facebook, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-dark-border bg-dark-card">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* ── მთავარი Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* ── ლოგო + აღწერა ── */}
          <div className="lg:col-span-1">
            <p className="text-xl font-black text-white tracking-tight mb-3">
              GAMITS<span className="text-gold">VALE</span>.GE
            </p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              საქართველოს პირველი ბარტერული პლატფორმა — გაცვალე ნივთები ფულის
              გარეშე.
            </p>
          </div>

          {/* ── ნავიგაცია ── */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">
              ნავიგაცია
            </p>
            <ul className="space-y-3">
              {[
                { href: "/", label: "მთავარი" },
                { href: "/rules", label: "წესები და პირობები" },
                { href: "/login", label: "ავტორიზაცია" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-gold transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── კომპანია ── */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">
              კომპანია
            </p>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "About Us" },
                { href: "/advertise", label: "რეკლამაზე დაგვიკავშირდით" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-gold transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── სოციალური ქსელები ── */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">
              გამოგვყევი
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="https://www.facebook.com/groups/1465431608622052"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-zinc-400 hover:text-gold transition-colors font-medium group"
              >
                <div className="w-8 h-8 rounded-lg bg-dark border border-dark-border flex items-center justify-center group-hover:border-gold/30 transition-colors">
                  <Facebook size={15} />
                </div>
                Facebook Group
                <ExternalLink
                  size={11}
                  className="text-zinc-600 group-hover:text-gold/50"
                />
              </a>
              <a
                href="https://www.instagram.com/gamitsvale.ge/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-zinc-400 hover:text-gold transition-colors font-medium group"
              >
                <div className="w-8 h-8 rounded-lg bg-dark border border-dark-border flex items-center justify-center group-hover:border-gold/30 transition-colors">
                  <Instagram size={15} />
                </div>
                Instagram
                <ExternalLink
                  size={11}
                  className="text-zinc-600 group-hover:text-gold/50"
                />
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="border-t border-dark-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-zinc-600 font-medium">
            © {new Date().getFullYear()} GAMITSVALE.GE — ყველა უფლება დაცულია
          </p>
          <p className="text-[11px] text-zinc-600 font-medium">
            დამზადებულია <span className="text-gold font-black">ACH</span>-ს
            მიერ
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
