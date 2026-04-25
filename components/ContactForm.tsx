"use client";

import { useState, useRef, useEffect } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { ArrowUpRight } from "lucide-react";

const RAW_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
// Only treat as valid if it looks like a real Cloudflare key (starts with "0x")
const SITE_KEY = RAW_SITE_KEY.startsWith("0x") ? RAW_SITE_KEY : "";

export default function ContactForm({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [turnstileFailed, setTurnstileFailed] = useState(false);
  const loadedAt = useRef<number>(Date.now());

  useEffect(() => {
    loadedAt.current = Date.now();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot check
    if (data.get("_honey")) return;

    // Time gate
    if (Date.now() - loadedAt.current < 3000) return;

    const name = (data.get("name") as string).trim();
    const userEmail = (data.get("email") as string).trim();
    const subject = (data.get("subject") as string).trim();
    const message = (data.get("message") as string).trim();

    const errs: Record<string, string> = {};
    if (!name) errs.name = "Required";
    if (!userEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) errs.email = "Valid email required";
    if (!message || message.length < 10) errs.message = "At least 10 characters";
    // Only block if Turnstile is active AND hasn't succeeded AND hasn't errored out
    if (SITE_KEY && !turnstileToken && !turnstileFailed) errs.captcha = "Please wait for verification to complete";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setErrors({});
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: userEmail, subject, message, turnstileToken }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      form.reset();
      setTurnstileToken("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-[#1e1e1e] p-12 flex flex-col items-center text-center gap-4">
        <div className="w-10 h-px bg-[#c9956a]" />
        <h3 className="font-[family-name:var(--font-syne)] text-2xl font-700 text-[#f0ede8]">
          Message received.
        </h3>
        <p className="font-[family-name:var(--font-inter)] text-sm text-[#6b6b6b] max-w-xs">
          I&apos;ll get back to you at <span className="text-[#c9956a]">{email}</span> as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Honeypot — invisible to humans */}
      <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-[family-name:var(--font-inter)] text-[10px] tracking-[0.25em] uppercase text-[#333333] mb-2">
            Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="Your name"
            className={`w-full bg-transparent border px-4 py-3 text-sm font-[family-name:var(--font-inter)] text-[#f0ede8] placeholder:text-[#2a2a2a] focus:outline-none transition-colors ${errors.name ? "border-red-800" : "border-[#1e1e1e] focus:border-[#c9956a]"}`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-700">{errors.name}</p>}
        </div>

        <div>
          <label className="block font-[family-name:var(--font-inter)] text-[10px] tracking-[0.25em] uppercase text-[#333333] mb-2">
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="your@email.com"
            className={`w-full bg-transparent border px-4 py-3 text-sm font-[family-name:var(--font-inter)] text-[#f0ede8] placeholder:text-[#2a2a2a] focus:outline-none transition-colors ${errors.email ? "border-red-800" : "border-[#1e1e1e] focus:border-[#c9956a]"}`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-700">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label className="block font-[family-name:var(--font-inter)] text-[10px] tracking-[0.25em] uppercase text-[#333333] mb-2">
          Subject
        </label>
        <input
          name="subject"
          type="text"
          placeholder="Project brief, collaboration, consultation..."
          className="w-full bg-transparent border border-[#1e1e1e] focus:border-[#c9956a] px-4 py-3 text-sm font-[family-name:var(--font-inter)] text-[#f0ede8] placeholder:text-[#2a2a2a] focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label className="block font-[family-name:var(--font-inter)] text-[10px] tracking-[0.25em] uppercase text-[#333333] mb-2">
          Message
        </label>
        <textarea
          name="message"
          rows={6}
          placeholder="Tell me about your project or idea..."
          className={`w-full bg-transparent border px-4 py-3 text-sm font-[family-name:var(--font-inter)] text-[#f0ede8] placeholder:text-[#2a2a2a] focus:outline-none transition-colors resize-none ${errors.message ? "border-red-800" : "border-[#1e1e1e] focus:border-[#c9956a]"}`}
        />
        {errors.message && <p className="mt-1 text-xs text-red-700">{errors.message}</p>}
      </div>

      {/* Cloudflare Turnstile — invisible bot check */}
      {SITE_KEY && (
        <Turnstile
          siteKey={SITE_KEY}
          onSuccess={setTurnstileToken}
          onError={() => { setTurnstileToken(""); setTurnstileFailed(true); }}
          onExpire={() => setTurnstileToken("")}
          options={{ theme: "dark", size: "invisible" }}
        />
      )}
      {errors.captcha && <p className="text-xs text-red-700">{errors.captcha}</p>}

      {status === "error" && (
        <p className="font-[family-name:var(--font-inter)] text-xs text-red-700">
          Something went wrong — try emailing directly at{" "}
          <a href={`mailto:${email}`} className="underline">{email}</a>
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="group inline-flex items-center gap-2 font-[family-name:var(--font-syne)] text-xs tracking-[0.2em] uppercase bg-[#c9956a] text-[#0c0c0c] px-8 py-4 hover:bg-[#e0b48a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
        {status !== "sending" && (
          <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        )}
      </button>
    </form>
  );
}
