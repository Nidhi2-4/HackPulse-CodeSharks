import React from "react";
import Link from "next/link";
import { ActivityIcon, PhoneIcon, MailIcon, ArrowRightIcon, AlertTriangleIcon } from "@/components/Icons";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 sm:p-12">
      <div className="max-w-2xl w-full bg-white rounded-3xl border border-[#dae3ec] shadow-xl p-8 sm:p-12 text-center space-y-8">
        {/* Visual Badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#dae3ec] text-[#1e293b] border-2 border-[#bac7b6] shadow-inner mx-auto">
          <span className="text-3xl font-extrabold text-[#1e293b]">404</span>
        </div>

        {/* Heading and details */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eeeeee] border border-[#d1d9ca] text-xs font-semibold text-[#475569]">
            <AlertTriangleIcon className="w-4 h-4 text-amber-600" />
            <span>Diagnostic Path Not Found</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1e293b]">
            Page or Clinical Record Missing
          </h1>
          <p className="text-sm sm:text-base text-[#475569] max-w-lg mx-auto leading-relaxed">
            The screening module, patient record, or documentation endpoint you are looking for has moved, expired, or does not exist on this on-premise SarcoScan instance.
          </p>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
          <Link
            href="/"
            className="p-4 rounded-xl bg-[#eeeeee] hover:bg-[#e8e8e8] border border-[#d1d9ca] transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-sm text-[#1e293b] group-hover:text-[#8c9e88]">
                Screening Suite
              </span>
              <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:text-[#8c9e88] transition-all" />
            </div>
            <p className="text-xs text-[#64748b]">Run AI knee AP X-ray + grip test fusion model</p>
          </Link>

          <Link
            href="/about"
            className="p-4 rounded-xl bg-[#eeeeee] hover:bg-[#e8e8e8] border border-[#d1d9ca] transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-sm text-[#1e293b] group-hover:text-[#8c9e88]">
                About SarcoScan
              </span>
              <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:text-[#8c9e88] transition-all" />
            </div>
            <p className="text-xs text-[#64748b]">Learn about SarcoScan and the clinical mission</p>
          </Link>
        </div>

        {/* Need assistance helpline */}
        <div className="pt-6 border-t border-[#dae3ec] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#475569]">
          <div className="flex items-center gap-2">
            <span>Need immediate hospital support?</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:+18005557272"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#dae3ec] hover:bg-[#bac7b6] text-[#1e293b] font-medium transition-colors"
            >
              <PhoneIcon className="w-3.5 h-3.5" />
              <span>+1 (800) 555-7272</span>
            </a>
            <a
              href="mailto:support@sarcoscan.ai"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e8e8e8] hover:bg-[#d1d9ca] text-[#1e293b] font-medium transition-colors"
            >
              <MailIcon className="w-3.5 h-3.5" />
              <span>support@sarcoscan.ai</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
