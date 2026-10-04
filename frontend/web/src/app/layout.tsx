import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    "SarcoScan combines routine knee AP X-rays with a 10-second handgrip test to flag sarcopenia and osteoporosis risk on-premise without DEXA or CT scans.",
  keywords: [
    "SarcoScan",
    "Sarcopenia Screening",
    "Osteoporosis Risk",
    "Knee AP X-Ray",
    "Handgrip Dynamometer",
    "AI Medical Imaging",
    "Clinical AI",
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
        {children}
      </body>
    </html>
  );
}
