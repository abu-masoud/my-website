import { getSiteSettings } from "@/lib/sanity";
import ContactForm from "@/components/ContactForm";
import { FadeIn } from "@/components/FadeIn";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact" };
export const revalidate = 60;

export default async function ContactPage() {
  const s = await getSiteSettings().catch(() => null);

  const email: string = s?.email ?? "hello@yourdomain.com";
  const basedIn: string = s?.basedIn ?? "Your City, Country";
  const availableFor: string[] = s?.availableFor ?? ["New projects", "Consultations", "Collaborations"];

  return (
    <div className="pt-32 pb-24 px-6 md:px-10 max-w-7xl mx-auto">

      {/* Header */}
      <FadeIn className="mb-20">
        <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.3em] uppercase text-[#6b6b6b] mb-3">
          Get in Touch
        </p>
        <h1 className="font-[family-name:var(--font-syne)] text-5xl md:text-7xl font-800 text-[#f0ede8] leading-none">
          Contact
        </h1>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-16 lg:gap-24">

        {/* Left — info */}
        <FadeIn delay={0.1}>
          <div className="space-y-10">
            <p className="font-[family-name:var(--font-inter)] font-300 text-base leading-8 text-[#6b6b6b]">
              Have a project in mind, a question, or just want to connect? I&apos;d love to hear from you. I typically respond within 24 hours.
            </p>

            <div className="space-y-6 border-t border-[#1e1e1e] pt-8">
              <div className="flex items-start gap-3">
                <Mail size={14} className="text-[#c9956a] mt-0.5 shrink-0" />
                <div>
                  <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.25em] uppercase text-[#333333] mb-1">Email</p>
                  <a
                    href={`mailto:${email}`}
                    className="font-[family-name:var(--font-syne)] text-sm text-[#f0ede8] hover:text-[#c9956a] transition-colors"
                  >
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={14} className="text-[#c9956a] mt-0.5 shrink-0" />
                <div>
                  <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.25em] uppercase text-[#333333] mb-1">Location</p>
                  <p className="font-[family-name:var(--font-syne)] text-sm text-[#f0ede8]">{basedIn}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#1e1e1e] pt-8">
              <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.25em] uppercase text-[#333333] mb-4">Available For</p>
              <ul className="space-y-2">
                {availableFor.map((item) => (
                  <li key={item} className="flex items-center gap-3 font-[family-name:var(--font-inter)] text-sm text-[#6b6b6b]">
                    <span className="w-4 h-px bg-[#c9956a] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[#1e1e1e] pt-8">
              <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.25em] uppercase text-[#333333] mb-4">Prefer email?</p>
              <a
                href={`mailto:${email}?subject=Project%20Inquiry`}
                className="group inline-flex items-center gap-2 font-[family-name:var(--font-syne)] text-xs tracking-[0.2em] uppercase text-[#6b6b6b] border border-[#1e1e1e] px-5 py-3 hover:border-[#c9956a] hover:text-[#c9956a] transition-all"
              >
                Open Email App
                <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </FadeIn>

        {/* Right — form */}
        <FadeIn delay={0.2}>
          <ContactForm email={email} />
        </FadeIn>
      </div>
    </div>
  );
}
