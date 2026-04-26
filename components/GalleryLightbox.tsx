"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: { url: string; alt: string }[];
}

export default function GalleryLightbox({ images }: Props) {
  const [index, setIndex] = useState<number | null>(null);

  const open = (i: number) => setIndex(i);
  const close = () => setIndex(null);

  const prev = useCallback(() => {
    setIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);

  const next = useCallback(() => {
    setIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, prev, next]);

  return (
    <>
      {/* ── Grid ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1e1e1e]">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => open(i)}
            className="group relative aspect-[4/3] overflow-hidden bg-[#111111] cursor-zoom-in focus:outline-none"
            aria-label={`Open image ${i + 1}`}
          >
            <Image
              src={img.url}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-[#0c0c0c]/0 group-hover:bg-[#0c0c0c]/30 transition-colors duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity font-[family-name:var(--font-inter)] text-[10px] tracking-[0.3em] uppercase text-[#f0ede8] border border-[#f0ede8]/30 px-4 py-2">
                View
              </span>
            </div>
          </button>
        ))}
        {/* Fill trailing empty cell on odd image count */}
        {images.length % 2 !== 0 && (
          <div className="aspect-[4/3] bg-[#0c0c0c] hidden md:block" />
        )}
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────────── */}
      {index !== null && (
        <div
          className="fixed inset-0 z-[100] bg-[#000]/95 flex items-center justify-center"
          style={{ animation: "fadeIn 0.2s ease" }}
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-6 right-6 text-[#6b6b6b] hover:text-[#f0ede8] transition-colors z-10"
            aria-label="Close"
          >
            <X size={22} />
          </button>

          {/* Counter */}
          <p className="absolute top-6 left-1/2 -translate-x-1/2 font-[family-name:var(--font-inter)] text-xs tracking-[0.3em] text-[#6b6b6b]">
            {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </p>

          {/* Prev */}
          <button
            onClick={prev}
            className="absolute left-4 md:left-8 text-[#6b6b6b] hover:text-[#f0ede8] transition-colors z-10 p-2"
            aria-label="Previous"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Image */}
          <div
            className="relative w-full max-w-5xl mx-16 md:mx-24"
            style={{ animation: "scaleIn 0.25s ease" }}
            key={index}
          >
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={images[index].url}
                alt={images[index].alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Next */}
          <button
            onClick={next}
            className="absolute right-4 md:right-8 text-[#6b6b6b] hover:text-[#f0ede8] transition-colors z-10 p-2"
            aria-label="Next"
          >
            <ChevronRight size={28} />
          </button>

          {/* Thumbnail strip */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-8 h-1 transition-all duration-300 ${
                  i === index ? "bg-[#c9956a]" : "bg-[#333333] hover:bg-[#6b6b6b]"
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>

          {/* Click outside to close */}
          <div
            className="absolute inset-0 -z-10"
            onClick={close}
            aria-hidden
          />
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
