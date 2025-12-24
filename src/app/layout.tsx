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
        <link
          rel="preload"
          href="/fonts/Gilroy-Medium.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Gilroy-SemiBold.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
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
