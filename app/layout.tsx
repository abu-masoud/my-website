import type { Metadata, Viewport } from "next";
import { Syne, Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import PageLoader from "@/components/PageLoader";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",   // prevent invisible text during font load
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500"],
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c0c0c",
};

export const metadata: Metadata = {
  title: {
    default: "Portfolio — Architecture & Design",
    template: "%s — Architecture & Design",
  },
  description:
    "Architecture engineer portfolio — projects, built work, and thoughts on design.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Architecture Portfolio",
  },
  // Prevent phone number detection on mobile
  other: { "format-detection": "telephone=no" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable}`}>
      <head>
        {/* Preconnect to external origins used by the site */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://api.sanity.io" />
      </head>
      <body>
        <PageLoader />
        <SmoothScroll />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
