import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";

const components = {
  types: {
    image: ({ value }: { value: { asset: unknown; caption?: string; alt?: string } }) => (
      <figure className="my-10">
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <Image
            src={urlFor(value).width(1200).url()}
            alt={value.alt ?? value.caption ?? ""}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
          />
        </div>
        {value.caption && (
          <figcaption className="mt-3 text-center text-xs text-[#6b6b6b] font-[family-name:var(--font-inter)] tracking-wide">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
  },
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="font-[family-name:var(--font-syne)] text-2xl md:text-3xl font-700 text-[#f0ede8] mt-12 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="font-[family-name:var(--font-syne)] text-xl font-600 text-[#f0ede8] mt-8 mb-3">
        {children}
      </h3>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="font-[family-name:var(--font-inter)] text-base leading-8 text-[#c0bdb8] mb-6">
        {children}
      </p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-2 border-[#c9956a] pl-6 my-8 italic text-[#6b6b6b] font-[family-name:var(--font-inter)]">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="text-[#f0ede8] font-500">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="text-[#c9956a]">{children}</em>
    ),
    link: ({
      value,
      children,
    }: {
      value?: { href: string };
      children?: React.ReactNode;
    }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#c9956a] underline underline-offset-4 hover:text-[#e0b48a] transition-colors"
      >
        {children}
      </a>
    ),
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PortableTextRenderer({ value }: { value: any[] }) {
  return <PortableText value={value} components={components} />;
}
