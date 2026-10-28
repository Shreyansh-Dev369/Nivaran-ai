"use client";

import React, { useState, useMemo } from "react";
import { formatINR } from "../../lib/utils/formatters";
import { soundManager } from "../../lib/utils/sound";
import {
  TrendingUp,
  Sparkles,
  Target,
  Clock,
  ShieldCheck,
  Award,
  ArrowRight,
  Flame,
} from "lucide-react";

export function SIPTimeMachine() {
  const [monthlySIP, setMonthlySIP] = useState<number>(20000);
  const [years, setYears] = useState<number>(10);
  const [cagr, setCagr] = useState<number>(14.5);
  const [adjustInflation, setAdjustInflation] = useState<boolean>(false);

  // Compounding math: Monthly compounding
  const { totalInvested, futureValue, wealthGain, realValue, timeTo10Lakh, timeToOneCrore } = useMemo(() => {
    const monthlyRate = cagr / 100 / 12;
    const months = years * 12;
    const invested = monthlySIP * months;

    // Future Value of monthly SIP: P * ((1 + r)^n - 1) / r * (1 + r)
    const fv = monthlySIP * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const gain = Math.max(0, fv - invested);

    // 6% annual inflation discount
    const inflationRate = 0.06;
    const inflationDiscount = Math.pow(1 + inflationRate, years);
    const realFv = fv / inflationDiscount;

    // Calculate time to milestone in years
    const calcMonthsToTarget = (target: number) => {
      let current = 0;
      let m = 0;
      while (current < target && m < 360) {
        m++;
        current = (current + monthlySIP) * (1 + monthlyRate);
      }
      return (m / 12).toFixed(1);
    };

    return {
      totalInvested: invested,
      futureValue: Math.round(fv),
      wealthGain: Math.round(gain),
      realValue: Math.round(realFv),
      timeTo10Lakh: calcMonthsToTarget(1000000),
      timeToOneCrore: calcMonthsToTarget(10000000),
    };
  }, [monthlySIP, years, cagr]);

  const displayValue = adjustInflation ? realValue : futureValue;

  // Generate 10-point SVG projection path
  const chartPoints = useMemo(() => {
    const points: { year: number; invested: number; fv: number }[] = [];
    const monthlyRate = cagr / 100 / 12;

    const step = Math.max(1, Math.floor(years / 8));
    for (let y = 1; y <= years; y += step) {
      const m = y * 12;
      const inv = monthlySIP * m;
      const val = monthlySIP * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) * (1 + monthlyRate);
      points.push({ year: y, invested: inv, fv: val });
    }
    // Ensure final year is included
    if (points[points.length - 1]?.year !== years) {
      const m = years * 12;
      points.push({
        year: years,
        invested: monthlySIP * m,
        fv: monthlySIP * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) * (1 + monthlyRate),
      });
    }
    return points;
  }, [monthlySIP, years, cagr]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: number) => void) => {
    setter(Number(e.target.value));
  };

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#D3E5DC] shadow-xs space-y-8 artistic-card">
      {/* Masthead Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D3E5DC] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00A86B] font-bold">
              Compounding Time Machine
            </span>
            <span className="text-[10px] font-mono text-[#587F6E]">• Mathematical Projection</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#071912] font-semibold mt-0.5">
            Systematic Investment Growth Engine
          </h3>
          <p className="text-xs text-[#587F6E] mt-1 max-w-xl">
            Simulate how regular rupee-cost averaging compounding into disciplined Indian equities transforms modest monthly cash into generational corpus.
          </p>
        </div>

        {/* Inflation Adjustment Switch */}
        <button
          onClick={() => {
            soundManager.playTick();
            setAdjustInflation(!adjustInflation);
          }}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-mono transition-all ${
            adjustInflation
              ? "bg-[#0A1D16] text-[#00E599] border-[#0A1D16] shadow-xs font-bold"
              : "bg-[#F4FAF7] text-[#587F6E] border-[#D3E5DC] hover:text-[#071912]"
          }`}
        >
          <Flame className={`h-3.5 w-3.5 ${adjustInflation ? "text-[#00E599]" : "text-amber-500"}`} />
          <span>{adjustInflation ? "Inflation Adjusted (6% CPI)" : "Nominal Returns"}</span>
        </button>
      </div>

      {/* Two-Column Interactive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Sliders & Presets */}
        <div className="lg:col-span-6 space-y-6">
          {/* Monthly SIP Slider */}
          <div className="space-y-2 bg-[#F4FAF7] p-5 rounded-2xl border border-[#D3E5DC]">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#587F6E] uppercase font-semibold">Monthly SIP Contribution</span>
              <strong className="text-base font-serif text-[#071912] tabular-nums font-bold">
                {formatINR(monthlySIP)}/mo
              </strong>
            </div>
            <input
              type="range"
              min="2000"
              max="100000"
              step="2000"
              value={monthlySIP}
              onChange={(e) => handleSliderChange(e, setMonthlySIP)}
              className="w-full accent-[#00A86B] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#587F6E]">
              <span>₹2,000</span>
              <span>₹25,000</span>
              <span>₹50,000</span>
              <span>₹1,00,000</span>
            </div>
          </div>

          {/* Horizon Slider */}
          <div className="space-y-2 bg-[#F4FAF7] p-5 rounded-2xl border border-[#D3E5DC]">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#587F6E] uppercase font-semibold">Investment Horizon</span>
              <strong className="text-base font-serif text-[#071912] tabular-nums font-bold">
                {years} {years === 1 ? "Year" : "Years"} ({years * 12} Months)
              </strong>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={years}
              onChange={(e) => handleSliderChange(e, setYears)}
              className="w-full accent-[#00A86B] cursor-pointer"
            />
            <div className="flex items-center gap-2 pt-1">
              {[3, 5, 10, 15, 20, 25].map((y) => (
                <button
                  key={y}
                  onClick={() => {
                    soundManager.playTick();
                    setYears(y);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition-colors ${
                    years === y
                      ? "bg-[#0A1D16] text-[#00E599]"
                      : "bg-white text-[#587F6E] border border-[#D3E5DC] hover:text-[#071912]"
                  }`}
                >
                  {y}Y
                </button>
              ))}
            </div>
          </div>

          {/* Expected CAGR Selector */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-[#587F6E] font-semibold block">
              Expected Annual Growth Rate (CAGR)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: "10.5% Debt/Defensive", val: 10.5 },
                { label: "12.8% Nifty 50 Avg", val: 12.8 },
                { label: "14.5% Nivaran Balanced", val: 14.5 },
                { label: "16.8% Nivaran Growth", val: 16.8 },
              ].map((tier) => (
                <button
                  key={tier.val}
                  onClick={() => {
                    soundManager.playTick();
                    setCagr(tier.val);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    cagr === tier.val
                      ? "bg-[#0A1D16] text-[#00E599] border-[#0A1D16] shadow-xs font-bold"
                      : "bg-white text-[#071912] border-[#D3E5DC] hover:bg-[#EDF6F2]"
                  }`}
                >
                  <div className="text-xs font-mono font-bold">{tier.val}%</div>
                  <div className="text-[10px] text-zinc-400 truncate">{tier.label.split(" ")[1]}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Output Showcase & Visual Curve */}
        <div className="lg:col-span-6 space-y-6">
          {/* Big Result Card */}
          <div className="rounded-3xl bg-[#0A1D16] text-white p-6 sm:p-7 border border-[#163628] shadow-xl space-y-5 relative overflow-hidden">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#00E599] font-bold block">
                {adjustInflation ? "Purchasing Power Value" : "Estimated Maturity Corpus"}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl sm:text-5xl text-white font-semibold tabular-nums tracking-tight">
                  {formatINR(displayValue)}
                </span>
              </div>
              <p className="text-[11px] font-mono text-zinc-400 pt-0.5">
                On total simulated contribution of <strong className="text-white">{formatINR(totalInvested)}</strong>
              </p>
            </div>

            {/* Split Attribution Breakdown */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#183D2D] text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#071711] border border-[#143324]">
                <span className="text-zinc-400 text-[10px] uppercase block">Principal Invested</span>
                <span className="font-bold text-white text-sm tabular-nums mt-0.5 block">
                  {formatINR(totalInvested)}
                </span>
                <span className="text-zinc-400 text-[10px]">
                  {Math.round((totalInvested / futureValue) * 100)}% of total
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#071711] border border-[#143324]">
                <span className="text-[#00E599] text-[10px] uppercase block">Compounding Gain</span>
                <span className="font-bold text-[#00E599] text-sm tabular-nums mt-0.5 block">
                  +{formatINR(wealthGain)}
                </span>
                <span className="text-[#00E599] text-[10px]">
                  +{Math.round((wealthGain / totalInvested) * 100)}% return
                </span>
              </div>
            </div>

            {/* Visual SVG Curve */}
            <div className="rounded-2xl bg-[#071711] p-3 border border-[#143324] space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                <span>Year 1</span>
                <span>Year {years} Milestone Trajectory</span>
              </div>
              <div className="h-20 w-full">
                <svg viewBox="0 0 320 80" fill="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="timeMachineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00E599" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#00E599" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Wealth Curve */}
                  <path
                    d={`M 5 70 Q 100 65, 180 40 T 315 10 L 315 75 L 5 75 Z`}
                    fill="url(#timeMachineGrad)"
                  />
                  <path
                    d={`M 5 70 Q 100 65, 180 40 T 315 10`}
                    stroke="#00E599"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Linear Principal Line */}
                  <path
                    d={`M 5 70 L 315 48`}
                    stroke="#94A3B8"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <circle cx="315" cy="10" r="3.5" fill="#00E599" />
                </svg>
              </div>
            </div>

            {/* Milestone Milestones Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-300 pt-1">
              <div className="flex items-center gap-2">
                <Target className="h-3.5 w-3.5 text-[#00E599] shrink-0" />
                <span>First ₹10 Lakhs: <strong className="text-white font-bold">{timeTo10Lakh} Yrs</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>₹1 Crore Target: <strong className="text-white font-bold">{timeToOneCrore} Yrs</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
