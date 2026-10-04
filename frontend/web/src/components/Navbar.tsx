"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ActivityIcon, PhoneIcon, MailIcon, ShieldCheckIcon } from "@/components/Icons";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#eeeeee]/90 backdrop-blur-md border-b border-[#dae3ec] transition-all">
      {/* Top micro bar with Clickable Phone & Email */}
      <div className="bg-[#dae3ec] text-[#1e293b] text-xs py-1.5 px-4 sm:px-8 border-b border-[#bac7b6]/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-medium">SarcoScan · Clinical AI Screening Platform</span>
            <span className="hidden sm:inline text-slate-500">| On-Premise LAN Ready</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <a
              href="tel:+18005557272"
              className="flex items-center gap-1.5 hover:text-[#8c9e88] transition-colors"
              title="Call SarcoScan Clinical Support"
            >
              <PhoneIcon className="w-3.5 h-3.5" />
              <span>+1 (800) 555-7272</span>
            </a>
            <span className="text-slate-400">·</span>
            <a
              href="mailto:support@sarcoscan.ai"
              className="flex items-center gap-1.5 hover:text-[#8c9e88] transition-colors"
              title="Email SarcoScan Support"
            >
              <MailIcon className="w-3.5 h-3.5" />
              <span>support@sarcoscan.ai</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#bac7b6] flex items-center justify-center text-[#1e293b] shadow-sm group-hover:bg-[#8c9e88] group-hover:text-white transition-all">
              <ActivityIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-[#1e293b] flex items-center gap-1">
                Sarco<span className="text-[#8c9e88]">Scan</span>
              </span>
              <p className="text-[10px] uppercase tracking-wider text-[#475569] font-medium">Team CodeSharks</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#475569]">
            <Link
              href="/"
              className="hover:text-[#1e293b] transition-colors hover:underline underline-offset-4"
            >
              Screening Suite
            </Link>
            <Link
              href="/about"
              className="hover:text-[#1e293b] transition-colors hover:underline underline-offset-4"
            >
              About Project
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-[#1e293b] transition-colors hover:underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="hover:text-[#1e293b] transition-colors hover:underline underline-offset-4"
            >
              Terms & Conditions
            </Link>
          </nav>

          {/* CTA / Quick Phone Action */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+18005557272"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#1e293b] bg-[#dae3ec] hover:bg-[#d1d9ca] border border-[#bac7b6] flex items-center gap-2 transition-all shadow-sm"
            >
              <PhoneIcon className="w-4 h-4 text-[#1e293b]" />
              <span>Call Helpline</span>
            </a>
            <Link
              href="#screening-demo"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#8c9e88] hover:bg-[#7b8c77] shadow-sm flex items-center gap-1.5 transition-all"
            >
              <span>Launch Demo</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#1e293b] hover:bg-[#e8e8e8] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 border-b border-[#dae3ec] px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-[#1e293b] hover:bg-[#eeeeee]"
          >
            Screening Suite
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-[#1e293b] hover:bg-[#eeeeee]"
          >
            About Project
          </Link>
          <Link
            href="/privacy-policy"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-[#1e293b] hover:bg-[#eeeeee]"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-and-conditions"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-[#1e293b] hover:bg-[#eeeeee]"
          >
            Terms & Conditions
          </Link>
          <div className="pt-3 border-t border-[#e8e8e8] space-y-2">
            <a
              href="tel:+18005557272"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-[#1e293b] bg-[#dae3ec]"
            >
              <PhoneIcon className="w-4 h-4" />
              <span>Call Helpline: +1 (800) 555-7272</span>
            </a>
            <a
              href="mailto:support@sarcoscan.ai"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-[#1e293b] bg-[#e8e8e8]"
            >
              <MailIcon className="w-4 h-4" />
              <span>Email: support@sarcoscan.ai</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
