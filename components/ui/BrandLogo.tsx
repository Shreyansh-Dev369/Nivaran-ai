"use client";

import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
  showSubtitle?: boolean;
}

export function BrandLogo({
  size = "md",
  inverted = false,
  showSubtitle = true,
}: BrandLogoProps) {
  const iconSize = size === "sm" ? "h-7 w-7" : size === "lg" ? "h-11 w-11" : "h-9 w-9";
  const titleSize = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";

  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group focus:outline-none select-none">
      {/* Precision Geometric Squircle Emblem with Radiant Mint Cornerstone */}
      <div
        className={`${iconSize} relative shrink-0 rounded-xl transition-all duration-300 group-hover:scale-105 ${
          inverted
            ? "bg-[#10271E] border border-white/20 shadow-sm"
            : "bg-[#0A1D16] border border-[#163628] shadow-sm shadow-[#0A1D16]/10"
        } flex items-center justify-center p-1.5`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Subtle grid lines */}
          <rect x="3" y="3" width="26" height="26" rx="6" stroke="#254F3E" strokeWidth="1.2" />
          <line x1="3" y1="16" x2="29" y2="16" stroke="#254F3E" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.6" />
          <line x1="16" y1="3" x2="16" y2="29" stroke="#254F3E" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.6" />
          {/* Mint Cornerstone Ascendant */}
          <path d="M16 6L26 6L26 16Z" fill="#00E599" />
          <circle cx="16" cy="16" r="2.5" fill="#FFFFFF" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span
          className={`font-serif tracking-tight font-semibold leading-none ${titleSize} ${
            inverted ? "text-white" : "text-[#071912]"
          }`}
        >
          NIVARA
        </span>
        {showSubtitle && (
          <span
            className={`text-[9px] uppercase tracking-[0.2em] font-sans font-semibold mt-1 leading-none ${
              inverted ? "text-emerald-300/80" : "text-[#3C6554]"
            }`}
          >
            Systematic Equities
          </span>
        )}
      </div>
    </Link>
  );
}
