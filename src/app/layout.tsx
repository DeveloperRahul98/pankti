import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import {
  ScrollProgressBar,
  ScrollToTop,
} from "@/components/shared/scroll-to-top";
import { Preloader } from "@/components/shared/preloader";
import { FestivalBanner } from "@/components/shared/festival-banner";
import { WhatsAppBubble } from "@/components/shared/whatsapp-bubble";
import { SocialProofToast } from "@/components/shared/social-proof-toast";
import { GalleryLightbox } from "@/components/gallery/gallery-lightbox";
import { SITE } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  metadataBase: new URL("https://pankti.local"),
  applicationName: SITE.name,
  keywords: [
    "catering Hyderabad",
    "wedding catering",
    "Indian catering",
    "biryani catering",
    "pooja bhojan",
    "South Indian catering",
    "corporate lunch Hyderabad",
    "Pankti",
  ],
  authors: [{ name: "Pankti Catering" }],
  creator: "Pankti",
  publisher: "Pankti",
  robots: { index: true, follow: true },
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    type: "website",
    siteName: SITE.name,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="grain min-h-full flex flex-col bg-bg text-fg"
      >
        <ThemeProvider>
          <Preloader />
          <ScrollProgressBar />
          <FestivalBanner />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ScrollToTop />
          <WhatsAppBubble />
          <SocialProofToast />
          <GalleryLightbox />
          <Toaster
            position="bottom-center"
            theme="dark"
            toastOptions={{
              style: {
                background: "var(--bg-elev)",
                color: "var(--fg)",
                border: "1px solid var(--border-strong)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
