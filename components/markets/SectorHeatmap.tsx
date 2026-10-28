"use client";

import React, { useMemo } from "react";
import { INDIAN_STOCKS } from "../../lib/data/stocks";
import { formatPercent } from "../../lib/utils/formatters";
import { soundManager } from "../../lib/utils/sound";
import { Layers, TrendingUp, TrendingDown, Info } from "lucide-react";

interface SectorHeatmapProps {
  selectedSector: string;
  onSelectSector: (sector: string) => void;
}

interface SectorMetrics {
  name: string;
  count: number;
  totalMarketCapCr: number;
  avgChangePercent: number;
  avgBeta: number;
  stocks: string[];
}

export function SectorHeatmap({
  selectedSector,
  onSelectSector,
}: SectorHeatmapProps) {
  const sectors = useMemo(() => {
    const map = new Map<string, { count: number; cap: number; changes: number[]; betas: number[]; symbols: string[] }>();

    for (const stock of INDIAN_STOCKS) {
      if (!map.has(stock.sector)) {
        map.set(stock.sector, { count: 0, cap: 0, changes: [], betas: [], symbols: [] });
      }
      const data = map.get(stock.sector)!;
      data.count += 1;
      data.cap += stock.marketCapCr;
      data.changes.push(stock.changePercent);
      data.betas.push(stock.beta);
      data.symbols.push(stock.symbol);
    }

    const list: SectorMetrics[] = [];
    for (const [name, d] of map.entries()) {
      const avgChange = d.changes.reduce((a, b) => a + b, 0) / d.changes.length;
      const avgBeta = d.betas.reduce((a, b) => a + b, 0) / d.betas.length;
      list.push({
        name,
        count: d.count,
        totalMarketCapCr: d.cap,
        avgChangePercent: Math.round(avgChange * 100) / 100,
        avgBeta: Math.round(avgBeta * 100) / 100,
        stocks: d.symbols,
      });
    }

    // Sort by total market cap descending
    return list.sort((a, b) => b.totalMarketCapCr - a.totalMarketCapCr);
  }, []);

  const totalCap = sectors.reduce((sum, s) => sum + s.totalMarketCapCr, 0);

  const handleClick = (sectorName: string) => {
    soundManager.playTick();
    onSelectSector(selectedSector === sectorName ? "ALL" : sectorName);
  };

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-7 border border-[#D3E5DC] shadow-xs space-y-4 artistic-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D3E5DC] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00A86B] font-bold">
              Market Distribution
            </span>
            <span className="text-[10px] font-mono text-[#587F6E]">• NSE / BSE Sector Capitalization</span>
          </div>
          <h3 className="font-serif text-lg sm:text-xl text-[#071912] font-semibold mt-0.5">
            Indian Equity Sector Heatmap
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#587F6E]">
          <span>Click sector to filter list below</span>
          {selectedSector !== "ALL" && (
            <button
              onClick={() => onSelectSector("ALL")}
              className="text-[#00A86B] font-bold hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Heatmap Tiles Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sectors.map((sector) => {
          const isSelected = selectedSector === sector.name;
          const isUp = sector.avgChangePercent >= 0;
          const share = Math.round((sector.totalMarketCapCr / totalCap) * 100);

          return (
            <div
              key={sector.name}
              onClick={() => handleClick(sector.name)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? "bg-[#0A1D16] text-white border-[#0A1D16] shadow-md scale-[1.02]"
                  : "bg-[#F4FAF7] text-[#071912] border-[#D3E5DC] hover:border-[#00E599] hover:bg-[#EAF5F0]"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`text-[10px] font-mono uppercase tracking-wider block ${isSelected ? "text-[#00E599]" : "text-[#587F6E]"}`}>
                    {sector.count} {sector.count === 1 ? "Enterprise" : "Enterprises"} • {share}% Universe
                  </span>
                  <h4 className={`text-sm font-semibold truncate ${isSelected ? "text-white" : "text-[#071912]"}`}>
                    {sector.name}
                  </h4>
                </div>

                <span
                  className={`inline-flex items-center gap-0.5 text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                    isUp
                      ? isSelected
                        ? "bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/30"
                        : "bg-[#E6F9F1] text-[#00A86B]"
                      : isSelected
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{formatPercent(sector.avgChangePercent)}</span>
                </span>
              </div>

              {/* Ticker Badges Strip */}
              <div className="flex flex-wrap items-center gap-1.5 pt-3">
                {sector.stocks.map((sym) => (
                  <span
                    key={sym}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                      isSelected
                        ? "bg-[#183D2D] text-[#EDF6F2] border border-[#23533E]"
                        : "bg-white text-[#18382C] border border-[#D3E5DC]"
                    }`}
                  >
                    {sym}
                  </span>
                ))}
              </div>

              {/* Sector Beta & Cap */}
              <div className="flex items-center justify-between text-[11px] font-mono pt-3 border-t mt-3 border-[#D3E5DC]/50">
                <span className={isSelected ? "text-zinc-400" : "text-[#587F6E]"}>
                  Beta: <strong className={isSelected ? "text-white" : "text-[#071912]"}>{sector.avgBeta}</strong>
                </span>
                <span className={isSelected ? "text-zinc-400" : "text-[#587F6E]"}>
                  Cap: <strong className={isSelected ? "text-white" : "text-[#071912]"}>₹{(sector.totalMarketCapCr / 100000).toFixed(1)} L Cr</strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
