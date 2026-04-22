// app/swap-temporary/[type]/page.tsx
// Routes: /swap-temporary/vehicles   /swap-temporary/realestate
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import Header from "@/components/Header";
import ListingCard from "@/components/ListingCard";
import OfferModal from "@/components/OfferModal";
import Toast from "@/components/Toast";
import { Loader2 } from "lucide-react";

const GOLD = "#D4AF37";
const GREEN = "#1a8a4a";

// ─── per-type config ─────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<
  string,
  {
    catId: string;
    title: string;
    icon: string;
    description: string;
    formTitle: string;
    formFields: {
      id: string;
      label: string;
      type?: string;
      placeholder?: string;
    }[];
  }
> = {
  vehicles: {
    catId: "vehicles",
    title: "ტრანსპორტის დროებითი გაცვლა",
    icon: "🚗",
    description:
      "გაცვალეთ მანქანა, ტრაქტორი ან სხვა ტრანსპორტი დროებით — ორმხრივი იურიდიული ხელშეკრულებით.",
    formTitle: "ხელშეკრულების ფორმა",
    formFields: [
      {
        id: "owner_a_name",
        label: "მხარე ა — სახელი, გვარი",
        placeholder: "ანზორ ჩინჩარაული",
      },
      {
        id: "owner_a_id",
        label: "მხარე ა — პირადი ნომერი",
        placeholder: "01234567890",
      },
      {
        id: "vehicle_a",
        label: "მხარე ა — სატრ. საშ.",
        placeholder: "Toyota Hilux 2018, ABC-123",
      },
      {
        id: "owner_b_name",
        label: "მხარე ბ — სახელი, გვარი",
        placeholder: "გიორგი ბერიძე",
      },
      {
        id: "owner_b_id",
        label: "მხარე ბ — პირადი ნომერი",
        placeholder: "09876543210",
      },
      {
        id: "vehicle_b",
        label: "მხარე ბ — სატრ. საშ.",
        placeholder: "Mitsubishi Pajero 2015, XYZ-456",
      },
      { id: "start_date", label: "დაწყება", type: "date" },
      { id: "end_date", label: "დასრულება", type: "date" },
      {
        id: "notes",
        label: "დამატებითი პირობები",
        placeholder: "მილაჟი, ვადამდელი დაბრ. და სხვ.",
        type: "textarea",
      },
      {
        id: "email_a",
        label: "მხარე ა — ელ-ფოსტა",
        type: "email",
        placeholder: "anzor@example.com",
      },
      {
        id: "email_b",
        label: "მხარე ბ — ელ-ფოსტა",
        type: "email",
        placeholder: "giorgi@example.com",
      },
    ],
  },
  realestate: {
    catId: "realestate",
    title: "სახლების დროებითი გაცვლა",
    icon: "🏠",
    description:
      "გაცვალეთ საცხოვრებელი სახლი ან ბინა დროებით — ორმხრივი იურიდიული ხელშეკრულებით.",
    formTitle: "ხელშეკრულების ფორმა",
    formFields: [
      {
        id: "owner_a_name",
        label: "მხარე ა — სახელი, გვარი",
        placeholder: "ანი კაკაბაძე",
      },
      {
        id: "owner_a_id",
        label: "მხარე ა — პირადი ნომერი",
        placeholder: "01234567890",
      },
      {
        id: "property_a",
        label: "მხარე ა — მისამართი",
        placeholder: "თბილისი, ვაკე, ჭავჭავაძის 5",
      },
      {
        id: "owner_b_name",
        label: "მხარე ბ — სახელი, გვარი",
        placeholder: "ლელა ჯავახიშვილი",
      },
      {
        id: "owner_b_id",
        label: "მხარე ბ — პირადი ნომერი",
        placeholder: "09876543210",
      },
      {
        id: "property_b",
        label: "მხარე ბ — მისამართი",
        placeholder: "ბათუმი, ნიკეა, 12",
      },
      { id: "start_date", label: "დაწყება", type: "date" },
      { id: "end_date", label: "დასრულება", type: "date" },
      {
        id: "notes",
        label: "დამატებითი პირობები",
        placeholder: "შინ. ცხოვ., მოვლა, ა.შ.",
        type: "textarea",
      },
      {
        id: "email_a",
        label: "მხარე ა — ელ-ფოსტა",
        type: "email",
        placeholder: "ani@example.com",
      },
      {
        id: "email_b",
        label: "მხარე ბ — ელ-ფოსტა",
        type: "email",
        placeholder: "lela@example.com",
      },
    ],
  },
};

// ─── main page ───────────────────────────────────────────────────────────────
export default function SwapTemporaryPage() {
  const params = useParams();
  const typeKey = (params?.type as string) ?? "vehicles";
  const config = TYPE_CONFIG[typeKey] ?? TYPE_CONFIG.vehicles;

  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const PAGE_SIZE = 20;

  const [showOfferModal, setShowOfferModal] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);

  // form
  const [form, setForm] = useState<Record<string, string>>({});
  const [formStatus, setFormStatus] = useState<"idle" | "done">("idle");

  async function fetchListings(pageNum = 1, reset = false) {
    reset ? setLoading(true) : setLoadingMore(true);
    // filter by category AND tradePeriod=temporary
    const res = await fetch(
      `/api/listings?category=${config.catId}&tradePeriod=temporary&page=${pageNum}&limit=${PAGE_SIZE}&sort=newest`,
    );
    const data = await res.json();
    const t = parseInt(res.headers.get("X-Total-Count") || "0", 10);
    setTotal(t);
    setHasMore(pageNum * PAGE_SIZE < t);
    const arr = Array.isArray(data) ? data : [];
    // VIP first
    const sorted = [...arr].sort((a, b) => {
      const rank = (l: any) =>
        l.listingType === "VIP" || l.isVIP
          ? 0
          : l.listingType === "SILVER"
            ? 1
            : 2;
      return rank(a) - rank(b);
    });
    reset ? setListings(sorted) : setListings((prev) => [...prev, ...sorted]);
    setPage(pageNum);
    setLoading(false);
    setLoadingMore(false);
  }

  useEffect(() => {
    fetchListings(1, true);
  }, [config.catId]);

  // ── generate contract .txt ──
  function handleDownload() {
    const lines: string[] = [
      "=".repeat(58),
      "        GAMITSVALE.GE — დროებითი გაცვლის ხელშეკრულება",
      "=".repeat(58),
      "",
      `სახელშეკრ. ტიპი: ${config.title}`,
      `შედგენის თარიღი: ${new Date().toLocaleDateString("ka-GE")}`,
      "",
    ];
    for (const f of config.formFields) {
      const v = form[f.id];
      if (v) lines.push(`${f.label}: ${v}`);
    }
    lines.push(
      "",
      "-".repeat(58),
      "ზოგადი პირობები:",
      "1. ორივე მხარე ვალდებულია დაიცვას ქონება/ტრანსპორტი.",
      "2. ნებისმიერი დაზიანება ანაზღაურდება ადგილზე შეფასებით.",
      "3. ხელშეკრ. ძალაშია ხელმოწერის მომენტიდან.",
      "4. დავის შ-ვაში გამოიყენება საქ. სამოქ. კოდექსი.",
      "",
      "მხარე ა ხელმ.: ____________________   თარიღი: _________",
      "მხარე ბ ხელმ.: ____________________   თარიღი: _________",
      "",
      "=".repeat(58),
      "       gamitsvale.ge — გაცვალე ნივთები ფულის გარეშე",
      "=".repeat(58),
    );
    const blob = new Blob(["\uFEFF" + lines.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gamitsvale_${typeKey}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setFormStatus("done");
    setTimeout(() => setFormStatus("idle"), 3000);
  }

  const requireAuth = (action: () => void) => {
    if (!user) {
      setToast("გთხოვთ გაიაროთ ავტორიზაცია 🔐");
      return;
    }
    action();
  };

  return (
    <div style={{ background: "#f8faf8", minHeight: "100vh" }}>
      <Header onAddListing={() => {}} onSearch={() => {}} />

      <div className="max-w-[1100px] mx-auto px-4 py-8">
        <Link
          href="/"
          style={{
            color: GREEN,
            fontSize: 13,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            marginBottom: 20,
          }}
        >
          ← მთავარზე
        </Link>

        {/* Hero */}
        <div
          style={{
            background: "linear-gradient(135deg,#1a3c34 0%,#2d6a4f 100%)",
            borderRadius: 16,
            padding: "28px 28px 24px",
            marginBottom: 28,
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>{config.icon}</div>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 24,
              fontWeight: 800,
              color: "#fff",
              margin: "0 0 8px",
            }}
          >
            {config.title}
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.8)",
              margin: "0 0 14px",
            }}
          >
            {config.description}
          </p>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: GOLD,
              borderRadius: 99,
              padding: "5px 14px",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            ⚖️ იურიდიული ხელშეკრულებით დაცული
          </span>
        </div>

        {/* Two-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* ── Left: listings ── */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                marginBottom: 14,
              }}
            >
              <h2
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#111",
                  margin: 0,
                }}
              >
                აქტიური განცხადებები
              </h2>
              {!loading && (
                <span style={{ fontSize: 12, color: "#999" }}>
                  <strong style={{ color: GOLD }}>{total}</strong> სულ
                </span>
              )}
            </div>

            {loading ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2,1fr)",
                  gap: 12,
                }}
              >
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      borderRadius: 16,
                      overflow: "hidden",
                      border: "1px solid #e8ebe8",
                      background: "#f8faf8",
                      animation: "pulse 1.5s ease-in-out infinite",
                    }}
                  >
                    <div
                      style={{ aspectRatio: "1/1", background: "#f0f4f0" }}
                    />
                    <div
                      style={{
                        padding: 12,
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <div
                        style={{
                          height: 14,
                          borderRadius: 4,
                          background: "#f0f4f0",
                          width: "75%",
                        }}
                      />
                      <div
                        style={{
                          height: 11,
                          borderRadius: 4,
                          background: "#f0f4f0",
                          width: "50%",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div
                style={{
                  background: "#fff",
                  border: "1px dashed #ccc",
                  borderRadius: 12,
                  padding: 28,
                  textAlign: "center",
                  color: "#999",
                  fontSize: 13,
                }}
              >
                <p style={{ fontSize: 36, marginBottom: 8 }}>{config.icon}</p>
                ამ კატეგორიაში დროებითი გაცვლის განცხადება ჯერ არ არის.
                <br />
                <Link href="/add" style={{ color: GREEN, fontWeight: 600 }}>
                  + დაამატე პირველი
                </Link>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2,1fr)",
                    gap: 12,
                  }}
                >
                  {listings.map((listing) => (
                    <ListingCard
                      key={listing._id}
                      listing={listing}
                      user={user}
                      onOffer={() =>
                        requireAuth(() => setShowOfferModal(listing))
                      }
                      onEdit={() => {}}
                      onDelete={() => {}}
                    />
                  ))}
                </div>

                {hasMore && (
                  <div style={{ textAlign: "center", marginTop: 20 }}>
                    <button
                      onClick={() => fetchListings(page + 1)}
                      disabled={loadingMore}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "10px 24px",
                        borderRadius: 10,
                        border: "1px solid #e8ebe8",
                        background: "#fff",
                        color: "#555",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />{" "}
                          იტვირთება...
                        </>
                      ) : (
                        `მეტის ნახვა (${total - listings.length} დარჩა)`
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── Right: legal form ── */}
          <div
            style={{
              background: "#fff",
              border: `1.5px solid ${GOLD}`,
              borderRadius: 16,
              padding: "20px 20px 22px",
              position: "sticky",
              top: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 18 }}>⚖️</span>
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  color: "#111",
                }}
              >
                {config.formTitle}
              </span>
            </div>
            <p style={{ fontSize: 12, color: "#999", marginBottom: 16 }}>
              შეავსე მონაცემები და გადმოიწერე ხელშეკრულება
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {config.formFields.map((field) => (
                <div key={field.id}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#555",
                      marginBottom: 3,
                    }}
                  >
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      placeholder={field.placeholder}
                      rows={2}
                      value={form[field.id] ?? ""}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, [field.id]: e.target.value }))
                      }
                      style={{
                        width: "100%",
                        border: "1px solid #e0e0e0",
                        borderRadius: 7,
                        padding: "7px 10px",
                        fontSize: 12,
                        outline: "none",
                        resize: "vertical",
                        fontFamily: "inherit",
                        boxSizing: "border-box",
                      }}
                    />
                  ) : (
                    <input
                      type={field.type ?? "text"}
                      placeholder={field.placeholder}
                      value={form[field.id] ?? ""}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, [field.id]: e.target.value }))
                      }
                      style={{
                        width: "100%",
                        border: "1px solid #e0e0e0",
                        borderRadius: 7,
                        padding: "7px 10px",
                        fontSize: 12,
                        outline: "none",
                        fontFamily: "inherit",
                        boxSizing: "border-box",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleDownload}
              style={{
                marginTop: 16,
                width: "100%",
                background: formStatus === "done" ? GREEN : GOLD,
                color: "#fff",
                border: "none",
                borderRadius: 9,
                padding: "11px 0",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Space Grotesk', sans-serif",
                transition: "background .2s",
              }}
            >
              {formStatus === "done"
                ? "✅ ხელშეკრ. გადმოიწერა!"
                : "📄 გადმოიწერე ხელშეკრულება"}
            </button>
            <p
              style={{
                fontSize: 10,
                color: "#bbb",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              .txt ფორმატი — ბეჭდვა + ხელმოწერა საჭიროა
            </p>
          </div>
        </div>
      </div>

      {showOfferModal && (
        <OfferModal
          listing={showOfferModal}
          onClose={() => setShowOfferModal(null)}
        />
      )}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
