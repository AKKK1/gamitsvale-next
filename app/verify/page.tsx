"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function VerifyContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const email = params.get("email");
    const code = params.get("code");

    if (!email || !code) {
      setStatus("error");
      setMessage("ლინკი არასწორია");
      return;
    }

    fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setStatus("success");
          setTimeout(() => router.push("/"), 2000);
        } else {
          setStatus("error");
          setMessage(data.error || "ვერიფიკაცია ვერ მოხერხდა");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("შეცდომა. სცადე თავიდან.");
      });
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "#f8faf8",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 text-center shadow-xl"
        style={{ background: "#fff", border: "1px solid #e8ebe8" }}
      >
        {status === "loading" && (
          <>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse"
              style={{ background: "#e6f5ec" }}
            >
              <span className="text-3xl">⏳</span>
            </div>
            <h2 className="text-lg font-bold mb-2" style={{ color: "#111" }}>
              ვამოწმებთ...
            </h2>
            <p className="text-sm" style={{ color: "#999" }}>
              გთხოვთ დაელოდოთ
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "#e6f5ec" }}
            >
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-lg font-bold mb-2" style={{ color: "#1a8a4a" }}>
              ანგარიში გააქტიურდა!
            </h2>
            <p className="text-sm" style={{ color: "#999" }}>
              მთავარ გვერდზე გადადის...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(239,68,68,0.08)" }}
            >
              <span className="text-3xl">❌</span>
            </div>
            <h2 className="text-lg font-bold mb-2" style={{ color: "#111" }}>
              შეცდომა
            </h2>
            <p className="text-sm mb-6" style={{ color: "#999" }}>
              {message}
            </p>
            <Link
              href="/"
              className="inline-block py-3 px-6 rounded-xl text-white text-sm font-semibold"
              style={{ background: "#1a8a4a", textDecoration: "none" }}
            >
              მთავარზე დაბრუნება
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  );
}
