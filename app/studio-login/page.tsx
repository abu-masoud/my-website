"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StudioLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/studio-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/studio");
      router.refresh();
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.3em] uppercase text-[#6b6b6b] mb-3 text-center">
          Restricted Access
        </p>
        <h1 className="font-[family-name:var(--font-syne)] text-3xl font-700 text-[#f0ede8] text-center mb-10">
          Studio
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#111111] border border-[#1e1e1e] text-[#f0ede8] px-4 py-3 text-sm font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9956a] transition-colors placeholder:text-[#6b6b6b]"
            autoFocus
          />
          {error && (
            <p className="font-[family-name:var(--font-inter)] text-xs text-red-500 text-center">
              Incorrect password
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="font-[family-name:var(--font-syne)] text-xs tracking-[0.2em] uppercase bg-[#c9956a] text-[#0c0c0c] px-6 py-3 hover:bg-[#e0b48a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Checking..." : "Enter Studio"}
          </button>
        </form>
      </div>
    </div>
  );
}
