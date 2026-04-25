import Navbar from "./Navbar";
import Footer from "./Footer";
import PageTransition from "./PageTransition";
import ScrollToTop from "./ScrollToTop";
import { getSiteSettings } from "@/lib/sanity";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings().catch(() => null);
  const siteName: string = settings?.siteName ?? "Studio";
  const footerTagline: string = settings?.footerTagline ?? "Architecture & Design";
  const email: string | undefined = settings?.email;
  const instagram: string | undefined = settings?.instagram;
  const linkedin: string | undefined = settings?.linkedin;

  return (
    <>
      <Navbar siteName={siteName} />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer tagline={footerTagline} email={email} instagram={instagram} linkedin={linkedin} />
      <ScrollToTop />
    </>
  );
}
