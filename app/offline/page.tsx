"use client";

// app/offline/page.tsx
// ეს გვერდი ჩანს როცა ინტერნეტი არ არის

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-dark text-white flex items-center justify-center">
      <div className="text-center px-6">
        <div className="text-8xl mb-6">📡</div>
        <h1 className="text-3xl font-black mb-3">ინტერნეტი არ არის</h1>
        <p className="text-zinc-400 mb-8 text-lg">
          კავშირი ვერ დამყარდა. შეამოწმე ინტერნეტ-კავშირი და სცადე ხელახლა.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 rounded-xl bg-gold text-dark font-bold text-lg hover:brightness-110 transition-all"
        >
          ხელახლა სცადე
        </button>
        <p className="text-zinc-600 text-sm mt-6">gamitsvale.ge</p>
      </div>
    </div>
  );
}
