"use client";

import React, { useState, useEffect } from "react";
import { soundManager } from "../../lib/utils/sound";
import { Volume2, VolumeX, Clock } from "lucide-react";

export function MarketStatusBadge() {
  const [istTime, setIstTime] = useState<string>("");
  const [marketStatus, setMarketStatus] = useState<{
    label: string;
    sublabel: string;
    isOpen: boolean;
    isPreOpen: boolean;
  }>({
    label: "LIVE SESSION",
    sublabel: "NSE / BSE Trading",
    isOpen: true,
    isPreOpen: false,
  });
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    setSoundEnabled(soundManager.isEnabled());

    const updateMarketTime = () => {
      const now = new Date();
      // Format to Indian Standard Time (Asia/Kolkata)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      const timeStr = now.toLocaleTimeString("en-IN", options);
      setIstTime(timeStr);

      // Extract IST hours & minutes
      const istDate = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );
      const hours = istDate.getHours();
      const minutes = istDate.getMinutes();
      const day = istDate.getDay(); // 0 is Sunday, 6 is Saturday
      const totalMinutes = hours * 60 + minutes;

      const isWeekend = day === 0 || day === 6;
      const isPreOpen = !isWeekend && totalMinutes >= 9 * 60 && totalMinutes < 9 * 60 + 15;
      const isMarketHours = !isWeekend && totalMinutes >= 9 * 60 + 15 && totalMinutes < 15 * 60 + 30;

      if (isMarketHours) {
        setMarketStatus({
          label: "MARKET OPEN",
          sublabel: "Regular NSE/BSE Trading",
          isOpen: true,
          isPreOpen: false,
        });
      } else if (isPreOpen) {
        setMarketStatus({
          label: "PRE-OPEN",
          sublabel: "Price Discovery Window",
          isOpen: false,
          isPreOpen: true,
        });
      } else {
        setMarketStatus({
          label: "MARKET CLOSED",
          sublabel: isWeekend ? "Weekend Session (Simulated)" : "After-Hours Simulation",
          isOpen: false,
          isPreOpen: false,
        });
      }
    };

    updateMarketTime();
    const interval = setInterval(updateMarketTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const nextState = soundManager.toggle();
    setSoundEnabled(nextState);
  };

  return (
    <div className="inline-flex items-center gap-2 font-mono text-[11px] select-none">
      {/* Live Market State Pill */}
      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/90 border border-[#D3E5DC] text-[#0A1D16] shadow-xs">
        <span className="relative flex h-2 w-2">
          {marketStatus.isOpen ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E599] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00A86B]"></span>
            </>
          ) : marketStatus.isPreOpen ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-400"></span>
          )}
        </span>

        <span className="font-bold text-[10px] tracking-wider uppercase text-[#071912]">
          {marketStatus.label}
        </span>

        {istTime && (
          <span className="text-[#587F6E] text-[10px] hidden sm:inline border-l border-[#D3E5DC] pl-2">
            {istTime} IST
          </span>
        )}
      </div>

      {/* Tactile Audio Effects Switch */}
      <button
        onClick={handleToggleSound}
        className={`p-1.5 rounded-full border transition-all ${
          soundEnabled
            ? "bg-[#0A1D16] text-[#00E599] border-[#0A1D16] shadow-xs"
            : "bg-white text-[#587F6E] border-[#D3E5DC] hover:text-[#071912] hover:bg-[#EDF6F2]"
        }`}
        title={soundEnabled ? "Mute tactile UI chimes" : "Enable tactile UI chimes (synthesized Web Audio)"}
        aria-label="Toggle tactile UI sounds"
      >
        {soundEnabled ? (
          <Volume2 className="h-3.5 w-3.5 stroke-[2.2]" />
        ) : (
          <VolumeX className="h-3.5 w-3.5 stroke-[2]" />
        )}
      </button>
    </div>
  );
}
