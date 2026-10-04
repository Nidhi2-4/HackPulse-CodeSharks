"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ActivityIcon, PhoneIcon, MailIcon } from "@/components/Icons";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 transition-all">
      {/* Top micro bar with Clickable Phone & Email */}
      <div className="bg-sky-50 text-slate-700 text-xs py-1.5 px-4 sm:px-8 border-b border-sky-100">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <span className="font-semibold text-slate-800">SarcoScan · On-Premise Clinical AI</span>
            <span className="hidden sm:inline text-slate-500">| Local LAN Ready</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <a
              href="tel:+18005557272"
              className="flex items-center gap-1.5 text-sky-700 hover:text-sky-900 transition-colors"
              title="Call SarcoScan Clinical Support"
            >
              <PhoneIcon className="w-3.5 h-3.5" />
              <span>+1 (800) 555-7272</span>
            </a>
            <span className="text-slate-300">·</span>
            <a
              href="mailto:support@sarcoscan.ai"
              className="flex items-center gap-1.5 text-sky-700 hover:text-sky-900 transition-colors"
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
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="SarcoScan Logo"
              className="h-9 w-auto object-contain rounded-lg"
            />
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Sarco<span className="text-sky-600">Scan</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link
              href="/"
              className="hover:text-sky-600 transition-colors hover:underline underline-offset-4"
            >
              Screening Suite
            </Link>
            <Link
              href="/about"
              className="hover:text-sky-600 transition-colors hover:underline underline-offset-4"
            >
              About Project
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-sky-600 transition-colors hover:underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="hover:text-sky-600 transition-colors hover:underline underline-offset-4"
            >
              Terms & Conditions
            </Link>
          </nav>

          {/* CTA / Quick Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+18005557272"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 flex items-center gap-2 transition-all shadow-sm"
            >
              <PhoneIcon className="w-4 h-4" />
              <span>Call Helpline</span>
            </a>
            <Link
              href="/#screening-demo"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-sm shadow-sky-600/20 flex items-center gap-1.5 transition-all"
            >
              <span>Launch Screening</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
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
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-sky-50"
          >
            Screening Suite
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-sky-50"
          >
            About Project
          </Link>
          <Link
            href="/privacy-policy"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-sky-50"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-and-conditions"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-sky-50"
          >
            Terms & Conditions
          </Link>
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <a
              href="tel:+18005557272"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-sky-700 bg-sky-50"
            >
              <PhoneIcon className="w-4 h-4" />
              <span>Call Helpline: +1 (800) 555-7272</span>
            </a>
            <a
              href="mailto:support@sarcoscan.ai"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-slate-50"
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
