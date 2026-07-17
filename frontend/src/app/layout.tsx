import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nivora — Thoughtful tech for everyday life",
    template: "%s · Nivora",
  },
  description:
    "Nivora is a curated store for everyday technology and lifestyle accessories: audio, workspace, smart home, mobile accessories, and travel tech.",
  applicationName: "Nivora",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-canvas font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
