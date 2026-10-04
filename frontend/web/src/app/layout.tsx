import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SarcoScan · On-Premise AI Screening for Sarcopenia & Osteoporosis",
  description:
    "SarcoScan by Team CodeSharks combines routine knee AP X-rays with a 10-second handgrip test to flag sarcopenia and osteoporosis risk on-premise without DEXA or CT scans.",
  keywords: [
    "SarcoScan",
    "Sarcopenia Screening",
    "Osteoporosis Risk",
    "Knee AP X-Ray",
    "Handgrip Dynamometer",
    "AI Medical Imaging",
    "CodeSharks",
    "HackPulse",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#eeeeee] text-[#1e293b] font-sans selection:bg-[#bac7b6] selection:text-[#1e293b]">
        <Navbar />
        <main className="flex-1 w-full flex flex-col">{children}</main>
        <CookieBanner />
        <Footer />
      </body>
    </html>
  );
}
