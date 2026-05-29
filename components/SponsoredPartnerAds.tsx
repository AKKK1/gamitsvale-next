"use client";

type SponsoredPartnerAdsProps = {
  variant?: "compact" | "wide";
};

const partners = [
  {
    label: "რეკლამა",
    brand: "Ubani.",
    title: "გაქვს ბიზნესი, მაგრამ არ გაქვს ცნობადობა?",
    description:
      "UBANI.WEBSITE დაგეხმარება შენი ბიზნესის ინტერნეტში გამოჩენაში.",
    cta: "ნახე სერვისი",
    href: "https://ubani.website",
    tone: "business",
  },
  {
    label: "რეკლამა",
    brand: "GeorgianSoul.online",
    title: "აღმოაჩინე საქართველო ახლიდან",
    description: "ტურები და ლაშქრობები საქართველოში — GeorgianSoul.online",
    cta: "დაგეგმე ტური",
    href: "https://georgiansoul.online",
    tone: "travel",
  },
];

export default function SponsoredPartnerAds({
  variant = "compact",
}: SponsoredPartnerAdsProps) {
  const isWide = variant === "wide";

  return (
    <div
      className={
        isWide
          ? "grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
          : "grid w-full grid-cols-1 gap-2 sm:grid-cols-2"
      }
    >
      {partners.map((partner) => {
        const isTravel = partner.tone === "travel";

        return (
          <a
            key={partner.href}
            href={partner.href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={
              isWide
                ? "group relative overflow-hidden rounded-2xl p-5 transition-all"
                : "group relative overflow-hidden rounded-xl px-4 py-3 transition-all"
            }
            style={{
              background: isTravel
                ? "linear-gradient(135deg, #eefcf6 0%, #fff7ed 100%)"
                : "linear-gradient(135deg, #ffffff 0%, #eef8f2 100%)",
              border: isTravel
                ? "1px solid rgba(217,119,6,0.22)"
                : "1px solid rgba(26,138,74,0.18)",
              boxShadow: isWide
                ? "0 16px 42px rgba(15,23,42,0.08)"
                : "0 8px 22px rgba(15,23,42,0.06)",
              textDecoration: "none",
            }}
          >
            <div
              className="absolute -right-8 -top-10 h-24 w-24 rounded-full"
              style={{
                background: isTravel
                  ? "rgba(217,119,6,0.12)"
                  : "rgba(26,138,74,0.1)",
              }}
            />
            <div className={isWide ? "relative space-y-2" : "relative"}>
              <div className="mb-1 flex items-center gap-2">
                <span
                  className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white"
                  style={{ background: "#111827" }}
                >
                  {partner.label}
                </span>
                <span
                  className="text-[11px] font-black"
                  style={{ color: isTravel ? "#b45309" : "#111827" }}
                >
                  {partner.brand}
                </span>
              </div>
              <h3
                className={
                  isWide
                    ? "text-base font-black leading-tight"
                    : "text-xs font-black leading-tight"
                }
                style={{ color: "#111827" }}
              >
                {partner.title}
              </h3>
              <p
                className={
                  isWide
                    ? "text-sm font-medium leading-relaxed"
                    : "mt-1 line-clamp-2 text-[11px] font-medium"
                }
                style={{ color: "#526057" }}
              >
                {partner.description}
              </p>
              <span
                className={
                  isWide
                    ? "mt-3 inline-flex rounded-xl px-4 py-2 text-xs font-bold text-white"
                    : "mt-1 inline-flex text-[11px] font-bold"
                }
                style={{
                  background: isWide ? (isTravel ? "#d97706" : "#1a8a4a") : "transparent",
                  color: isWide ? "#ffffff" : isTravel ? "#b45309" : "#1a8a4a",
                }}
              >
                {partner.cta}
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );
}

