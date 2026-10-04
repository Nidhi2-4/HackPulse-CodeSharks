"use client";

import React from "react";
import Link from "next/link";
import { ActivityIcon, PhoneIcon, MailIcon, ShieldCheckIcon, AlertTriangleIcon } from "@/components/Icons";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      {/* Top Banner: Emergency & Contact Grid */}
      <div className="bg-sky-950/60 border-b border-sky-900/60 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/80 border border-sky-900/50">
            <div className="p-3 rounded-xl bg-sky-600 text-white shadow-sm">
              <PhoneIcon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-sky-400">Clinical Trial Helpline</h4>
              <a
                href="tel:+18005557272"
                className="text-base font-bold text-white hover:text-sky-300 transition-colors block"
              >
                +1 (800) 555-7272
              </a>
              <span className="text-xs text-slate-400">Toll-free 24/7 Clinical Support</span>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/80 border border-sky-900/50">
            <div className="p-3 rounded-xl bg-sky-800 text-white shadow-sm">
              <PhoneIcon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-sky-400">Hospital Deployment Desk</h4>
              <a
                href="tel:+918023456789"
                className="text-base font-bold text-white hover:text-sky-300 transition-colors block"
              >
                +91 (80) 2345-6789
              </a>
              <span className="text-xs text-slate-400">Tier-2 & Tier-3 Pilot Inquiries</span>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/80 border border-sky-900/50">
            <div className="p-3 rounded-xl bg-blue-600 text-white shadow-sm">
              <MailIcon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-sky-400">Direct Support Email</h4>
              <a
                href="mailto:support@sarcoscan.ai"
                className="text-base font-bold text-white hover:text-sky-300 transition-colors block"
              >
                support@sarcoscan.ai
              </a>
              <span className="text-xs text-slate-400">Inquiries, PACS setup & integrations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: About & Info */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="SarcoScan Logo"
              className="h-9 w-auto object-contain rounded-lg"
            />
            <span className="font-bold text-xl tracking-tight text-white">SarcoScan</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            SarcoScan combines routine knee AP X-rays with a 10-second handgrip test to flag sarcopenia & osteoporosis risk on-premise without DEXA or CT scans.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-medium border border-sky-800">Clinical AI</span>
            <span>· On-Premise LAN</span>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Platform</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Screening Suite
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About SarcoScan
              </Link>
            </li>
            <li>
              <Link href="/#clinical-workflow" className="hover:text-white transition-colors">
                Clinical Workflow
              </Link>
            </li>
            <li>
              <Link href="/#validation-targets" className="hover:text-white transition-colors">
                Validation & AUC Metrics
              </Link>
            </li>
            <li>
              <Link href="/non-existent-page" className="hover:text-white transition-colors text-slate-500">
                Custom 404 Test Page
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Compliance & Legal */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Compliance & Legal</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <Link href="/privacy-policy" className="hover:text-white transition-colors font-medium text-slate-300">
                Privacy Policy & HIPAA
              </Link>
            </li>
            <li>
              <Link href="/terms-and-conditions" className="hover:text-white transition-colors font-medium text-slate-300">
                Terms and Conditions
              </Link>
            </li>
            <li>
              <a href="mailto:privacy@sarcoscan.ai" className="hover:text-white transition-colors">
                Data Protection Officer: privacy@sarcoscan.ai
              </a>
            </li>
            <li>
              <span className="inline-flex items-center gap-1 text-sky-400">
                <ShieldCheckIcon className="w-3.5 h-3.5" />
                Zero-Cloud Data Transfer
              </span>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact & Medical Disclaimer */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Medical Disclaimer</h4>
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-400 leading-relaxed">
            <div className="flex items-center gap-1.5 font-semibold text-amber-400 mb-1">
              <AlertTriangleIcon className="w-3.5 h-3.5" />
              <span>Research Prototype</span>
            </div>
            SarcoScan is an AI screening and referral tool designed for clinical research and pilot triaging. It does not replace definitive DEXA diagnosis or physician clinical judgment.
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 py-4 px-4 sm:px-8 text-center text-xs text-slate-500 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} SarcoScan. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-slate-300">Privacy</Link>
            <span>·</span>
            <Link href="/terms-and-conditions" className="hover:text-slate-300">Terms</Link>
            <span>·</span>
            <a href="mailto:support@sarcoscan.ai" className="hover:text-slate-300">support@sarcoscan.ai</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
