import Navbar from "./Navbar";
import Footer from "./Footer";
import CustomCursor from "./CustomCursor";
import PageTransition from "./PageTransition";
import { getSiteSettings } from "@/lib/sanity";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings().catch(() => null);
  const siteName: string = settings?.siteName ?? "Studio";
  const footerTagline: string = settings?.footerTagline ?? "Architecture & Design";

  return (
    <>
      <CustomCursor />
      <Navbar siteName={siteName} />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer tagline={footerTagline} />
    </>
  );
}
