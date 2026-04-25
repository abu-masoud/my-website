import Navbar from "./Navbar";
import Footer from "./Footer";
import { getSiteSettings } from "@/lib/sanity";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings().catch(() => null);
  const siteName: string = settings?.siteName ?? "Studio";
  const footerTagline: string = settings?.footerTagline ?? "Architecture & Design";

  return (
    <>
      <Navbar siteName={siteName} />
      <main>{children}</main>
      <Footer tagline={footerTagline} />
    </>
  );
}
