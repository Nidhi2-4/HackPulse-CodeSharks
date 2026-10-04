"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CookieIcon, ShieldCheckIcon, CloseIcon, InfoIcon } from "@/components/Icons";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(true);
  const [performanceAllowed, setPerformanceAllowed] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem("sarcoscan_cookie_consent");
    if (!consent) {
      // Delay slightly for smooth entrance
      const timer = setTimeout(() => setIsVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      "sarcoscan_cookie_consent",
      JSON.stringify({ essential: true, analytics: true, performance: true, date: new Date().toISOString() })
    );
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(
      "sarcoscan_cookie_consent",
      JSON.stringify({ essential: true, analytics: false, performance: false, date: new Date().toISOString() })
    );
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem(
      "sarcoscan_cookie_consent",
      JSON.stringify({ essential: true, analytics: analyticsAllowed, performance: performanceAllowed, date: new Date().toISOString() })
    );
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-xl z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl border-2 border-[#bac7b6] shadow-xl text-[#1e293b]">
        <div className="flex items-start justify-between gap-3 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#dae3ec] text-[#1e293b]">
              <CookieIcon className="w-6 h-6 text-[#1e293b]" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-[#1e293b]">Privacy & Cookie Preferences</h3>
              <p className="text-xs text-[#475569]">SarcoScan Clinical On-Premise Platform</p>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Close cookie banner"
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-[#475569] leading-relaxed my-2">
          We use essential local session cookies to securely handle clinical screening sessions and on-premise DICOM cache. We do not transmit patient identifiers to external ad networks. Learn more in our{" "}
          <Link
            href="/privacy-policy"
            className="text-[#1e293b] underline font-medium hover:text-[#8c9e88]"
          >
            Privacy Policy
          </Link>
          .
        </p>

        {showPreferences && (
          <div className="my-4 p-4 rounded-xl bg-[#eeeeee] border border-[#d1d9ca] space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#1e293b]">Essential Clinical Cookies</span>
                <p className="text-gray-500">Required for on-premise authentication & DICOM viewports.</p>
              </div>
              <span className="px-2.5 py-1 bg-[#d1d9ca] text-[#1e293b] font-medium rounded-md">Always Active</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#e8e8e8]">
              <div>
                <span className="font-semibold text-[#1e293b]">Local Inference Performance Telemetry</span>
                <p className="text-gray-500">Measures CPU inference ms to ensure under 5s runtime.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={performanceAllowed}
                  onChange={(e) => setPerformanceAllowed(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bac7b6]"></div>
              </label>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-[#e8e8e8]">
          <button
            type="button"
            onClick={() => setShowPreferences(!showPreferences)}
            className="px-3 py-2 text-xs font-medium text-[#475569] hover:text-[#1e293b] hover:bg-[#e8e8e8] rounded-lg transition-colors mr-auto"
          >
            {showPreferences ? "Hide Options" : "Customize"}
          </button>
          <button
            type="button"
            onClick={handleDecline}
            className="px-4 py-2 text-xs font-semibold text-[#475569] bg-[#eeeeee] hover:bg-[#e8e8e8] border border-[#d1d9ca] rounded-lg transition-colors"
          >
            Essential Only
          </button>
          {showPreferences ? (
            <button
              type="button"
              onClick={handleSavePreferences}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#8c9e88] hover:bg-[#7b8c77] rounded-lg transition-colors shadow-sm"
            >
              Save Preferences
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAcceptAll}
              className="px-4 py-2 text-xs font-semibold text-[#1e293b] bg-[#bac7b6] hover:bg-[#a9b8a5] rounded-lg transition-colors shadow-sm"
            >
              Accept All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
