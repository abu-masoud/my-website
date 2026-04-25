"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  heroLine1: string;
  heroLine2: string;
  heroLine3: string;
  heroSubtitle: string;
  heroCTALabel: string;
  heroTagline: string;
}

function RevealWord({ word, delay }: { word: string; delay: number }) {
  return (
    <span className="inline-block overflow-hidden align-bottom">
      <motion.span
        className="inline-block"
        initial={{ y: "110%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {word}
      </motion.span>
    </span>
  );
}

function RevealLine({ text, baseDelay, accent }: { text: string; baseDelay: number; accent?: boolean }) {
  const words = text.split(" ");
  return (
    <span className={accent ? "text-[#c9956a]" : ""}>
      {words.map((word, i) => (
        <span key={i}>
          <RevealWord word={word} delay={baseDelay + i * 0.06} />
          {i < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

export default function AnimatedHero({
  heroLine1,
  heroLine2,
  heroLine3,
  heroSubtitle,
  heroCTALabel,
  heroTagline,
}: Props) {
  return (
    <section className="relative min-h-screen flex flex-col justify-end px-6 md:px-10 pb-20 pt-32 overflow-hidden">
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#f0ede8 1px, transparent 1px), linear-gradient(90deg, #f0ede8 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative max-w-7xl mx-auto w-full">
        {/* Tagline */}
        <motion.p
          className="font-[family-name:var(--font-inter)] text-xs tracking-[0.3em] uppercase text-[#6b6b6b] mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          01 / {heroTagline}
        </motion.p>

        {/* Hero headline — word-by-word reveal */}
        <h1 className="font-[family-name:var(--font-syne)] font-800 text-[clamp(3.5rem,10vw,9rem)] leading-[0.9] tracking-[-0.02em] text-[#f0ede8] max-w-5xl">
          <RevealLine text={heroLine1} baseDelay={0.45} />
          <br />
          <RevealLine text={heroLine2} baseDelay={0.6} accent />
          <br />
          <RevealLine text={heroLine3} baseDelay={0.75} />
        </h1>

        {/* Subtitle + CTA */}
        <motion.div
          className="mt-12 flex flex-col md:flex-row md:items-end gap-8 justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-[family-name:var(--font-inter)] font-300 text-base leading-7 text-[#6b6b6b] max-w-md">
            {heroSubtitle}
          </p>

          <div className="flex gap-6">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 font-[family-name:var(--font-syne)] text-sm tracking-[0.15em] uppercase text-[#f0ede8] border border-[#1e1e1e] px-6 py-3 hover:border-[#c9956a] hover:text-[#c9956a] transition-all duration-300"
            >
              {heroCTALabel}
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <Link
              href="/about"
              className="font-[family-name:var(--font-inter)] text-xs tracking-[0.15em] uppercase text-[#6b6b6b] hover:text-[#f0ede8] transition-colors self-center"
            >
              About
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-[#c9956a] to-transparent"
          initial={{ scaleY: 0, originY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
        />
      </div>
    </section>
  );
}
