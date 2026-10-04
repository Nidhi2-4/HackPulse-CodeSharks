import React from "react";
import Link from "next/link";
import { ShieldCheckIcon, PhoneIcon, MailIcon, ServerIcon, CheckCircleIcon } from "@/components/Icons";

export const metadata = {
  title: "Privacy Policy · SarcoScan On-Premise Clinical AI",
  description: "Learn how SarcoScan protects patient confidentiality, DICOM image safety, and grip dynamometer metrics on local hospital infrastructure.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 px-4 sm:px-8 max-w-5xl mx-auto space-y-12">
      {/* Header section */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#dae3ec] shadow-sm space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dae3ec] text-[#1e293b] text-xs font-semibold">
          <ShieldCheckIcon className="w-4 h-4 text-emerald-700" />
          <span>Local On-Premise Data Isolation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1e293b]">
          SarcoScan Privacy Policy & Clinical Data Governance
        </h1>
        <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
          Effective Date: October 2026 · SarcoScan Clinical Platform
        </p>
      </div>

      {/* Core Highlights Box in Palette Colors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#dae3ec]/70 border border-[#bac7b6] space-y-2">
          <div className="flex items-center gap-2 text-[#1e293b] font-semibold text-base">
            <ServerIcon className="w-5 h-5 text-[#1e293b]" />
            <h3>100% On-Premise LAN</h3>
          </div>
          <p className="text-xs text-[#475569] leading-relaxed">
            All knee AP X-ray DICOMs and handgrip dynamometer data are processed inside your hospital network. Zero patient records leave the facility.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#d1d9ca]/70 border border-[#bac7b6] space-y-2">
          <div className="flex items-center gap-2 text-[#1e293b] font-semibold text-base">
            <CheckCircleIcon className="w-5 h-5 text-emerald-700" />
            <h3>Anonymized Ingestion</h3>
          </div>
          <p className="text-xs text-[#475569] leading-relaxed">
            DICOM metadata tags (such as patient names and national IDs) are scrubbed before ML inference, maintaining strict HIPAA de-identification standards.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#bac7b6]/50 border border-[#bac7b6] space-y-2">
          <div className="flex items-center gap-2 text-[#1e293b] font-semibold text-base">
            <ShieldCheckIcon className="w-5 h-5 text-[#1e293b]" />
            <h3>Audit-Logged Access</h3>
          </div>
          <p className="text-xs text-[#475569] leading-relaxed">
            Role-based access controls strictly separate technician data entry from doctor review and clinician overrides with immutable audit logs.
          </p>
        </div>
      </div>

      {/* Detailed Legal Sections */}
      <div className="bg-white rounded-3xl border border-[#dae3ec] shadow-sm p-8 sm:p-12 space-y-10 text-sm text-[#334155] leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#1e293b] border-b border-[#e8e8e8] pb-2">
            1. Scope & Architecture
          </h2>
          <p>
            SarcoScan operates as an on-premise software suite deployed via Docker Compose on local hospital infrastructure. Unlike cloud-native consumer applications, SarcoScan instances communicate exclusively over local intranet connections between the Next.js frontend, FastAPI backend, local MinIO storage, and local Orthanc PACS.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#1e293b] border-b border-[#e8e8e8] pb-2">
            2. Categories of Clinical Data Processed
          </h2>
          <p>The system collects and analyzes the following clinical parameters solely for screening:</p>
          <ul className="list-disc pl-5 space-y-1 text-[#475569]">
            <li><strong>Medical Imaging:</strong> Standard knee anterior-posterior (AP) radiographs in DICOM, PNG, or JPEG formats.</li>
            <li><strong>Biomechanical Metrics:</strong> Handgrip dynamometer force measurements (3 trials per hand recorded via BLE or manual entry).</li>
            <li><strong>Demographics & Anthropometrics:</strong> Patient age, biological sex, height, weight, calculated BMI, and optional SARC-F questionnaire score.</li>
            <li><strong>System Audit Metrics:</strong> Doctor override notes, timestamped visit history, and technician operator IDs.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#1e293b] border-b border-[#e8e8e8] pb-2">
            3. Local Storage, Encryption & Retention
          </h2>
          <p>
            Image segmentations and inference outputs are stored in local encrypted MinIO buckets and PostgreSQL databases configured by the hospital IT administrator. Data retention adheres to the hosting medical institution&apos;s records policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#1e293b] border-b border-[#e8e8e8] pb-2">
            4. Patient Confidentiality & Rights
          </h2>
          <p>
            Patients screened using SarcoScan have the right to request deletion of their visit records from the local hospital database by contacting their treating physician or the hospital data administration desk.
          </p>
        </section>

        <section className="space-y-4 pt-4 border-t border-[#dae3ec]">
          <h2 className="text-xl font-bold text-[#1e293b]">
            5. Contact our Data Protection Officer
          </h2>
          <p className="text-[#475569]">
            If you have questions regarding privacy compliance, data isolation, or local deployment security, please reach out directly:
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="mailto:privacy@sarcoscan.ai"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#dae3ec] hover:bg-[#bac7b6] text-[#1e293b] font-semibold transition-colors shadow-sm"
            >
              <MailIcon className="w-4 h-4" />
              <span>privacy@sarcoscan.ai</span>
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
