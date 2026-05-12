"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof sessionStorage === "undefined") return;
    const seen = sessionStorage.getItem("loader_seen");
    if (!seen) {
      const showTimer = setTimeout(() => {
        setVisible(true);
        document.documentElement.style.overflow = "hidden";
      }, 0);
      const hideTimer = setTimeout(() => {
        setVisible(false);
        document.documentElement.style.overflow = "";
        sessionStorage.setItem("loader_seen", "1");
      }, 2200);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
        document.documentElement.style.overflow = "";
      };
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] bg-[#0c0c0c] flex flex-col items-center justify-center pointer-events-none"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
        >
          {/* Counter line */}
          <motion.p
            className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.4em] uppercase text-[#6b6b6b] mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Loading
          </motion.p>

          {/* Wordmark */}
          <div className="overflow-hidden">
            <motion.h1
              className="font-[family-name:var(--font-syne)] text-3xl md:text-4xl font-700 tracking-[0.15em] uppercase text-[#f0ede8]"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              Architecture
            </motion.h1>
          </div>

          {/* Thin accent line that grows */}
          <motion.div
            className="mt-8 h-px bg-[#c9956a]"
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
