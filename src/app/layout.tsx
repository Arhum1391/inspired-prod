import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundaryWrapper from "@/components/ErrorBoundaryWrapper";
import ScrollNewsletterModal from "@/components/modals/ScrollNewsletterModal";

export const metadata: Metadata = {
  title: "Inspired Analyst - Making Finance & Tech Accessible",
  description: "Expert analysis on stocks, crypto, and data science - delivered with clarity and humor",
  icons: {
    icon: "/logo/favicon.svg",
    shortcut: "/logo/favicon.svg",
    apple: "/logo/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* LCP image - preload before React to avoid 27s delay */}
        <link rel="preload" href="/team-mob/6.jpg" as="image" />
        {/* Single font preload - SemiBold for h1 (LCP candidate). Medium loads async. */}
        <link
          rel="preload"
          href="/fonts/Gilroy-SemiBold.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <meta name="theme-color" content="#0A0A0A" />
      </head>
      <body
        className="font-gilroy antialiased bg-[#0A0A0A] text-white"
      >
        <ErrorBoundaryWrapper>
          <AuthProvider>
            {children}
            <ScrollNewsletterModal />
          </AuthProvider>
        </ErrorBoundaryWrapper>
      </body>
    </html>
  );
}
