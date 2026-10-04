import React from "react";
import Link from "next/link";
import {
  ActivityIcon,
  BoneIcon,
  ScanIcon,
  ShieldCheckIcon,
  SparklesIcon,
  PhoneIcon,
  MailIcon,
  UsersIcon,
  ServerIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "@/components/Icons";

export const metadata = {
  title: "About SarcoScan · Team CodeSharks (HackPulse)",
  description: "Learn about SarcoScan, the on-premise AI screening tool combining routine knee AP X-rays with handgrip strength for early sarcopenia and osteoporosis triage.",
};

export default function AboutPage() {
  return (
    <div className="py-12 px-4 sm:px-8 max-w-6xl mx-auto space-y-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-[#dae3ec] shadow-sm p-8 sm:p-14 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dae3ec] text-[#1e293b] text-xs font-semibold">
          <SparklesIcon className="w-4 h-4 text-[#8c9e88]" />
          <span>Team CodeSharks · HackPulse 2026</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1e293b] leading-tight">
          Democratizing Musculoskeletal & Sarcopenia Screening
        </h1>
        <p className="text-base sm:text-lg text-[#475569] max-w-3xl leading-relaxed">
          SarcoScan combines two diagnostic tests already performed routinely in community and rural hospitals—a <strong>routine knee AP radiograph</strong> and a <strong>10-second handgrip test</strong>—to detect sarcopenia and osteoporosis risk years before a catastrophic fall occurs.
        </p>

        <div className="flex flex-wrap gap-4 pt-4">
          <Link
            href="/#screening-demo"
            className="px-6 py-3 rounded-xl bg-[#bac7b6] hover:bg-[#8c9e88] hover:text-white text-[#1e293b] font-semibold text-sm transition-all shadow-sm inline-flex items-center gap-2"
          >
            <span>Launch Live Screening Demo</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
          <a
            href="tel:+18005557272"
            className="px-6 py-3 rounded-xl bg-[#eeeeee] hover:bg-[#e8e8e8] border border-[#d1d9ca] text-[#1e293b] font-semibold text-sm transition-all inline-flex items-center gap-2"
          >
            <PhoneIcon className="w-4 h-4" />
            <span>Speak with Research Team</span>
          </a>
        </div>
      </div>

      {/* The Problem & The Insight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-[#eeeeee] border border-[#d1d9ca] space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#dae3ec] flex items-center justify-center text-[#1e293b] shadow-sm">
            <BoneIcon className="w-6 h-6 text-[#1e293b]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1e293b]">The Clinical Dilemma</h2>
          <p className="text-sm text-[#475569] leading-relaxed">
            Sarcopenia (age-related loss of skeletal muscle mass and functional strength) is critically under-diagnosed in elderly populations. Gold-standard confirmation requires dual-energy X-ray absorptiometry (DEXA) or whole-body CT scans, which most Tier-2 and Tier-3 hospitals simply do not possess. As a result, patients are typically identified only after experiencing a fragility fracture.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#d1d9ca]/50 border border-[#bac7b6] space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#bac7b6] flex items-center justify-center text-[#1e293b] shadow-sm">
            <ActivityIcon className="w-6 h-6 text-[#1e293b]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1e293b]">The SarcoScan Solution</h2>
          <p className="text-sm text-[#475569] leading-relaxed">
            Hospitals already routinely capture knee radiographs for joint pain and measure grip strength. SarcoScan uses deep learning to segment femur, tibia, and soft tissue from the knee AP X-ray, computes soft-tissue-to-bone cross ratios, and fuses them with grip dynamics to yield an instant risk stratification.
          </p>
        </div>
      </div>

      {/* 4-Step Pipeline */}
      <div className="bg-white rounded-3xl border border-[#dae3ec] p-8 sm:p-12 space-y-8 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8c9e88]">How It Works</span>
          <h2 className="text-3xl font-extrabold text-[#1e293b]">The 4-Step Screening Pipeline</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-[#eeeeee] border border-[#e8e8e8] space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#dae3ec] font-bold text-sm flex items-center justify-center text-[#1e293b]">
              1
            </div>
            <h3 className="font-bold text-base text-[#1e293b]">Data Ingestion</h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              Technician registers patient, enters 3 handgrip trials per hand, and uploads standard knee AP DICOM or image.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#eeeeee] border border-[#e8e8e8] space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#d1d9ca] font-bold text-sm flex items-center justify-center text-[#1e293b]">
              2
            </div>
            <h3 className="font-bold text-base text-[#1e293b]">AI Segmentation</h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              U-Net neural network segments bone vs soft tissue and calculates precise thigh-to-calf muscle thickness ratios.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#eeeeee] border border-[#e8e8e8] space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#bac7b6] font-bold text-sm flex items-center justify-center text-[#1e293b]">
              3
            </div>
            <h3 className="font-bold text-base text-[#1e293b]">Multimodal Fusion</h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              Gradient-boosted fusion model combines image features with AWGS 2019 grip thresholds, age, sex, and BMI.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#eeeeee] border border-[#e8e8e8] space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#8c9e88] font-bold text-sm flex items-center justify-center text-white">
              4
            </div>
            <h3 className="font-bold text-base text-[#1e293b]">Clinical Triage</h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              Doctor receives stage (No / Possible / Probable / Severe), osteoporosis risk tier, explainable heatmap, and PDF report.
            </p>
          </div>
        </div>
      </div>

      {/* Target Validation Metrics Table */}
      <div className="bg-[#eeeeee] rounded-3xl border border-[#d1d9ca] p-8 sm:p-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1e293b]">Pilot Validation Targets</h2>
            <p className="text-xs text-[#475569]">Empirical milestones targeted for clinical pilot trials</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#d1d9ca] text-xs font-bold text-[#1e293b]">
            Benchmarked on CPU Only
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm bg-white rounded-2xl overflow-hidden border border-[#dae3ec]">
            <thead className="bg-[#dae3ec] text-[#1e293b] font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4">Clinical Metric</th>
                <th className="p-4">Target Standard</th>
                <th className="p-4">Validation Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8e8] text-[#334155]">
              <tr>
                <td className="p-4 font-semibold text-[#1e293b]">Fusion Model AUC vs Grip Alone</td>
                <td className="p-4 text-emerald-800 font-bold">Statistically Higher</td>
                <td className="p-4 text-xs">DeLong paired test (p &lt; 0.05)</td>
              </tr>
              <tr className="bg-[#eeeeee]/30">
                <td className="p-4 font-semibold text-[#1e293b]">Screening Sensitivity</td>
                <td className="p-4 text-emerald-800 font-bold">85% or higher</td>
                <td className="p-4 text-xs">Screening threshold against reference DEXA</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-[#1e293b]">Osteoporosis Risk AUC</td>
                <td className="p-4 text-emerald-800 font-bold">0.80 or higher</td>
                <td className="p-4 text-xs">Proximal tibia radiograph vs DXA T-scores</td>
              </tr>
              <tr className="bg-[#eeeeee]/30">
                <td className="p-4 font-semibold text-[#1e293b]">Inference Time</td>
                <td className="p-4 font-bold text-[#1e293b]">Under 5.0 seconds</td>
                <td className="p-4 text-xs">Standard Intel i5 CPU, 16GB RAM, no GPU required</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-[#1e293b]">Total Workflow Time Per Patient</td>
                <td className="p-4 font-bold text-[#1e293b]">Under 5 minutes</td>
                <td className="p-4 text-xs">Registration to printable clinician report</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Team CodeSharks Contact & Direct Links */}
      <div className="bg-white rounded-3xl border border-[#dae3ec] p-8 sm:p-12 space-y-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#dae3ec] text-[#1e293b]">
            <UsersIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1e293b]">Connect with Team CodeSharks</h2>
            <p className="text-xs text-[#475569]">HackPulse 2026 Developers & Medical Technology Researchers</p>
          </div>
        </div>

        <p className="text-sm text-[#475569] leading-relaxed">
          Interested in bringing SarcoScan to your hospital or clinic for clinical trials? Reach out to our engineering and medical liaisons:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <a
            href="tel:+18005557272"
            className="p-4 rounded-2xl bg-[#eeeeee] hover:bg-[#e8e8e8] border border-[#d1d9ca] flex items-center gap-4 transition-all"
          >
            <div className="p-3 rounded-xl bg-[#bac7b6] text-[#1e293b]">
              <PhoneIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#64748b]">Toll-Free Clinical Support</span>
              <p className="font-bold text-[#1e293b] text-base">+1 (800) 555-7272</p>
            </div>
          </a>

          <a
            href="mailto:support@sarcoscan.ai"
            className="p-4 rounded-2xl bg-[#eeeeee] hover:bg-[#e8e8e8] border border-[#d1d9ca] flex items-center gap-4 transition-all"
          >
            <div className="p-3 rounded-xl bg-[#dae3ec] text-[#1e293b]">
              <MailIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#64748b]">Email Project Team</span>
              <p className="font-bold text-[#1e293b] text-base">support@sarcoscan.ai</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
