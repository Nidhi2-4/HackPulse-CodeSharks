import React from "react";
import Link from "next/link";
import { AlertTriangleIcon, FileTextIcon, PhoneIcon, MailIcon, ShieldCheckIcon } from "@/components/Icons";

export const metadata = {
  title: "Terms and Conditions · SarcoScan AI Screening Platform",
  description: "Terms and conditions of use for SarcoScan research and pilot clinical screening software by Team CodeSharks.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="py-12 px-4 sm:px-8 max-w-5xl mx-auto space-y-12">
      {/* Header section */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#dae3ec] shadow-sm space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dae3ec] text-[#1e293b] text-xs font-semibold">
          <FileTextIcon className="w-4 h-4 text-[#1e293b]" />
          <span>Research & Pilot Terms of Service</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1e293b]">
          SarcoScan Terms and Conditions
        </h1>
        <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
          Last Updated: October 2026 · Team CodeSharks (HackPulse)
        </p>
      </div>

      {/* Critical Medical Disclaimer Warning Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#eeeeee] border-2 border-[#bac7b6] space-y-3">
        <div className="flex items-center gap-2.5 text-amber-800 font-bold text-lg">
          <AlertTriangleIcon className="w-6 h-6 text-amber-700" />
          <h2>Mandatory Clinical Research Disclaimer</h2>
        </div>
        <p className="text-sm text-[#1e293b] leading-relaxed font-medium">
          SarcoScan is a software prototype developed for hackathon demonstration and clinical research validation. It is <strong>NOT</strong> an FDA/CE-cleared diagnostic medical device and must <strong>NOT</strong> be used as a standalone diagnostic determination or treatment prescription.
        </p>
        <p className="text-xs text-[#475569] leading-relaxed">
          All algorithmic risk tiers (Sarcopenia staging and Osteoporosis probability) are intended solely as auxiliary screening prompts to assist licensed healthcare professionals in triage and referral decisions.
        </p>
      </div>

      {/* Legal terms breakdown */}
      <div className="bg-white rounded-3xl border border-[#dae3ec] shadow-sm p-8 sm:p-12 space-y-10 text-sm text-[#334155] leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#1e293b] border-b border-[#e8e8e8] pb-2">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or operating the SarcoScan web portal, technician dynamometer client, or automated inference pipeline, medical institutions, technicians, and clinicians agree to abide by these terms of use.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#1e293b] border-b border-[#e8e8e8] pb-2">
            2. Intended User Roles & Obligations
          </h2>
          <p>The platform provides distinct interfaces for verified operational roles:</p>
          <ul className="list-disc pl-5 space-y-1 text-[#475569]">
            <li><strong>Radiology Technicians & Nurses:</strong> Responsible for verifying patient positioning during knee AP X-ray acquisition and ensuring proper dynamometer calibration.</li>
            <li><strong>Orthopedic & Geriatric Clinicians:</strong> Responsible for reviewing AI-generated segmentations, evaluating confidence intervals, and applying independent clinical judgment before making diagnostic referrals.</li>
            <li><strong>Hospital Administrators:</strong> Responsible for local server security, user access revocation, and backup integrity.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#1e293b] border-b border-[#e8e8e8] pb-2">
            3. Limitation of Liability
          </h2>
          <p>
            Team CodeSharks, HackPulse organizers, and affiliated developers assume no liability for patient treatment decisions, misdiagnoses, delayed interventions, or inaccuracies arising from distorted radiograph inputs or patient dynamometer non-compliance.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#1e293b] border-b border-[#e8e8e8] pb-2">
            4. Open Research & Intellectual Property
          </h2>
          <p>
            The underlying deep learning fusion architecture, soft-tissue-to-bone ratio extraction algorithms, and UX design belong to Team CodeSharks under open academic research licensing for participating pilot hospitals.
          </p>
        </section>

        <section className="space-y-4 pt-4 border-t border-[#dae3ec]">
          <h2 className="text-xl font-bold text-[#1e293b]">
            5. Inquiries & Legal Governance
          </h2>
          <p className="text-[#475569]">
            For institutional licensing, trial agreements, or questions about these terms:
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="mailto:legal@sarcoscan.ai"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#dae3ec] hover:bg-[#bac7b6] text-[#1e293b] font-semibold transition-colors shadow-sm"
            >
              <MailIcon className="w-4 h-4" />
              <span>legal@sarcoscan.ai</span>
            </a>
            <a
              href="tel:+18005557272"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#eeeeee] hover:bg-[#e8e8e8] border border-[#d1d9ca] text-[#1e293b] font-semibold transition-colors shadow-sm"
            >
              <PhoneIcon className="w-4 h-4" />
              <span>+1 (800) 555-7272</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
