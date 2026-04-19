"use client";

// app/offline/page.tsx
// ეს გვერდი ჩანს როცა ინტერნეტი არ არის

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

export default function OfflinePage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: C.bg,
        color: C.text,
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* ლოგო */}
      <div className="mb-12">
        <span
          className="text-[17px] font-bold tracking-tight"
          style={{ color: C.text }}
        >
          GAMITSVALE<span style={{ color: C.green }}>.GE</span>
        </span>
      </div>

      {/* მთავარი ბარათი */}
      <div
        className="w-full max-w-md rounded-2xl p-10 text-center"
        style={{
          background: C.bg2,
          border: `1px solid ${C.border}`,
        }}
      >
        {/* ანიმირებული იკონი */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl"
          style={{
            background: C.greenLight,
            border: `1px solid rgba(26,138,74,0.15)`,
          }}
        >
          📡
        </div>

        <h1 className="text-2xl font-bold mb-3" style={{ color: C.text }}>
          ინტერნეტი არ არის
        </h1>

        <p className="text-sm leading-relaxed mb-8" style={{ color: C.text2 }}>
          კავშირი ვერ დამყარდა. შეამოწმე ინტერნეტ-კავშირი და სცადე ხელახლა.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all"
          style={{ background: C.green }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background = C.greenDark)
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = C.green)
          }
        >
          ↺ ხელახლა სცადე
        </button>
      </div>

      {/* footer */}
      <p className="mt-8 text-xs" style={{ color: C.text3 }}>
        © 2026 gamitsvale.ge
      </p>
    </div>
  );
}
