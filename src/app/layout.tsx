import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

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
        <link href="https://fonts.cdnfonts.com/css/gilroy-bold" rel="stylesheet" />
        <link href="https://db.onlinewebfonts.com/c/1dc8ecd8056a5ea7aa7de1db42b5b639?family=Gilroy-Regular" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/gilroy" rel="stylesheet" />
      </head>
      <body
        className="font-gilroy antialiased bg-[#0A0A0A] text-white"
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
