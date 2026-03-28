import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "GAMITSVALE.GE";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const APP_URL = process.env.APP_URL || "https://gamitsvale.ge";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let listing: any = null;
  try {
    const res = await fetch(`${APP_URL}/api/listings/${id}`, {
      cache: "no-store",
    });
    if (res.ok) listing = await res.json();
  } catch {}

  const title = listing?.title || "განცხადება";
  const listingType = listing?.listingType || "NORMAL";
  const wantedType = listing?.wantedType || "items";
  const wantedItems: string[] = listing?.wantedItems || [];
  const serviceWanted: string = listing?.serviceWanted || "";

  // Cloudinary URL — პირდაპირ გამოვიყენებთ
  const image = listing?.images?.[0] || null;

  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        background: "#0a0a0a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* მარცხენა — ფოტო */}
      <div
        style={{
          width: "560px",
          height: "630px",
          position: "relative",
          display: "flex",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {image ? (
          <img
            src={image}
            width="560"
            height="630"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "#141414",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "120px",
            }}
          >
            📦
          </div>
        )}
        {/* gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, transparent 50%, #0a0a0a 100%)",
          }}
        />
      </div>

      {/* მარჯვენა — ტექსტი */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "48px 48px 48px 24px",
        }}
      >
        {/* VIP / SILVER badge */}
        {listingType !== "NORMAL" && (
          <div style={{ display: "flex", marginBottom: "16px" }}>
            <div
              style={{
                background: "rgba(212,160,23,0.15)",
                border: "1px solid rgba(212,160,23,0.4)",
                borderRadius: "8px",
                padding: "4px 14px",
                color: "#D4A017",
                fontSize: "12px",
                fontWeight: "900",
                letterSpacing: "2px",
              }}
            >
              {listingType === "VIP" ? "⭐ VIP" : "🥈 SILVER"}
            </div>
          </div>
        )}

        {/* სათაური */}
        <div
          style={{
            fontSize: title.length > 25 ? "34px" : "42px",
            fontWeight: "900",
            color: "#FFFFFF",
            lineHeight: 1.15,
            marginBottom: "20px",
            letterSpacing: "-0.5px",
          }}
        >
          {title.length > 55 ? title.slice(0, 55) + "..." : title}
        </div>

        {/* გაცვლა მინდა */}
        {wantedType === "items" && wantedItems.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                fontSize: "11px",
                color: "#D4A017",
                fontWeight: "900",
                letterSpacing: "2px",
                marginBottom: "10px",
              }}
            >
              გაცვლა მინდა:
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {wantedItems.slice(0, 3).map((item: string, i: number) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(212,160,23,0.1)",
                    border: "1px solid rgba(212,160,23,0.25)",
                    borderRadius: "8px",
                    padding: "6px 14px",
                    color: "#D4A017",
                    fontSize: "14px",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

        {wantedType === "service" && serviceWanted && (
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                fontSize: "11px",
                color: "#D4A017",
                fontWeight: "900",
                letterSpacing: "2px",
                marginBottom: "10px",
              }}
            >
              მინდა მომსახურება:
            </div>
            <div
              style={{
                background: "rgba(212,160,23,0.1)",
                border: "1px solid rgba(212,160,23,0.25)",
                borderRadius: "8px",
                padding: "6px 14px",
                color: "#D4A017",
                fontSize: "14px",
                display: "flex",
              }}
            >
              {serviceWanted.slice(0, 60)}
            </div>
          </div>
        )}

        <div
          style={{
            width: "100%",
            height: "1px",
            background: "rgba(255,255,255,0.07)",
            marginBottom: "20px",
          }}
        />

        {/* ლოგო */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{ fontSize: "20px", fontWeight: "900", color: "#FFFFFF" }}
          >
            GAMITSVALE
          </span>
          <span
            style={{ color: "#D4A017", fontSize: "20px", fontWeight: "900" }}
          >
            .GE
          </span>
          <span
            style={{
              marginLeft: "8px",
              fontSize: "11px",
              color: "#444",
              letterSpacing: "1px",
            }}
          >
            გაცვლის პლატფორმა
          </span>
        </div>
      </div>

      {/* ზედა ოქროსფერი ხაზი */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "#D4A017",
        }}
      />
    </div>,
    { ...size },
  );
}
