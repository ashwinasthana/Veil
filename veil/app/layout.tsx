/**
 * Root Layout
 * Provides global fonts, metadata, and the Navbar shell.
 * Typography: Satoshi (headings) + Inter Tight (body)
 */
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

/* ─── Satoshi — Variable weight local font for headings ─── */
const satoshi = localFont({
  src: [
    {
      path: "./fonts/Satoshi-Variable.woff2",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi-VariableItalic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
  weight: "300 900",
});

/* ─── Inter Tight — Google font for body text ─── */
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://veils.dev"),
  title: "Veil — Anonymous URL Shortener",
  description:
    "Shorten links anonymously. No sign-ups, no tracking, no logs. Privacy-first URL shortener with password protection, expiring links, and self-destruct. Built by Ashwin Asthana.",
  keywords: [
    "url shortener",
    "anonymous",
    "privacy",
    "no tracking",
    "encrypted links",
    "self destruct",
    "veil",
    "ashwin asthana",
  ],
  authors: [{ name: "Ashwin Asthana", url: "https://github.com/ashwinasthana" }],
  creator: "Ashwin Asthana",
  openGraph: {
    title: "Veil — Anonymous URL Shortener",
    description: "Anonymous links for a surveillance internet. Built by Ashwin Asthana.",
    type: "website",
    siteName: "Veil",
    url: "https://veils.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "Veil — Anonymous URL Shortener",
    description: "Anonymous links for a surveillance internet.",
    creator: "@ashwinasthana",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${satoshi.variable} ${interTight.variable} font-interTight antialiased bg-background text-neutral-900`}
      >
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
