"use client";

import React from "react";
import Link from "next/link";
import { INDIAN_STOCKS } from "../../lib/data/stocks";
import { formatINR } from "../../lib/utils/formatters";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export function LiveTickerRibbon() {
  // Duplicate array for seamless infinite marquee loop
  const tickerItems = [...INDIAN_STOCKS, ...INDIAN_STOCKS];

  return (
    <div className="w-full bg-[#061610] border-y border-[#14352A] py-2 overflow-hidden select-none relative group z-20">
      {/* Subtle edge fading gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#061610] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#061610] to-transparent z-10 pointer-events-none" />

      <div className="flex items-center">
        {/* Live Indicator Chip */}
        <div className="px-3 shrink-0 flex items-center gap-1.5 border-r border-[#14352A] bg-[#0A1D16] py-0.5 rounded-l-md ml-2 z-10 hidden sm:flex">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E599] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E599]" />
          </span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#00E599]">
            NSE / BSE
          </span>
        </div>

        {/* Marquee Track */}
        <div className="overflow-hidden w-full">
          <div className="animate-marquee flex items-center gap-6 pl-4">
            {tickerItems.map((stock, idx) => {
              const isUp = stock.change >= 0;

              return (
                <Link
                  key={`${stock.symbol}-${idx}`}
                  href={`/stocks/${stock.symbol}`}
                  className="flex items-center gap-2 px-2.5 py-1 rounded-lg hover:bg-white/5 transition-colors shrink-0 group/item"
                >
                  <span className="font-mono font-bold text-xs text-white group-hover/item:text-[#00E599] transition-colors">
                    {stock.symbol}
                  </span>
                  <span className="font-mono text-xs text-[#cfe0d8]">
                    {formatINR(stock.currentPrice)}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                      isUp
                        ? "bg-[#00E599]/15 text-[#00E599]"
                        : "bg-[#E63946]/15 text-[#FF6B6B]"
                    }`}
                  >
                    {isUp ? (
                      <TrendingUp className="h-2.5 w-2.5" />
                    ) : (
                      <TrendingDown className="h-2.5 w-2.5" />
                    )}
                    {isUp ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
