"use client";

import React, { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "../../../components/layout/AppShell";
import { useApp } from "../../../context/AppContext";
import { INDIAN_STOCKS } from "../../../lib/data/stocks";
import { formatINR, formatPercent, formatMarketCapCr } from "../../../lib/utils/formatters";
import { StockHistoryChart } from "../../../components/charts/StockHistoryChart";
import {
  ArrowLeft,
  Star,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Layers,
  Info,
  Check,
  Plus,
  Minus,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export function StockDetailClient({ symbol }: { symbol: string }) {
  const { watchlist, toggleWatchlist, holdings, cashBalance, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<"ORDER_BOOK" | "HISTORY" | "RATIONALE" | "RISKS">("ORDER_BOOK");
  const [tradeModalOpen, setTradeModalOpen] = useState<"BUY" | "SELL" | null>(null);
  const [tradeQuantity, setTradeQuantity] = useState<number>(5);

  const stock = INDIAN_STOCKS.find(
    (s) => s.symbol.toUpperCase() === symbol.toUpperCase()
  );

  if (!stock) {
    return notFound();
  }

  const isFav = watchlist.includes(stock.symbol);
  const existingHolding = holdings.find((h) => h.symbol === stock.symbol);
  const isUp = stock.change >= 0;

  // Realistic Order Book generator based on stock price (Inspired by Image 1)
  const bids = [
    { price: stock.currentPrice - 1.2, size: 450, total: 450 },
    { price: stock.currentPrice - 2.8, size: 1200, total: 1650 },
    { price: stock.currentPrice - 4.5, size: 850, total: 2500 },
    { price: stock.currentPrice - 6.0, size: 2100, total: 4600 },
    { price: stock.currentPrice - 8.5, size: 3400, total: 8000 },
  ];

  const asks = [
    { price: stock.currentPrice + 1.4, size: 520, total: 520 },
    { price: stock.currentPrice + 2.9, size: 980, total: 1500 },
    { price: stock.currentPrice + 4.8, size: 1450, total: 2950 },
    { price: stock.currentPrice + 7.2, size: 1800, total: 4750 },
    { price: stock.currentPrice + 9.5, size: 2900, total: 7650 },
  ];

  const maxDepth = 8000;

  const handleSimulateTrade = () => {
    showToast({
      title: `${tradeModalOpen === "BUY" ? "Simulated Purchase" : "Simulated Sale"} Executed`,
      message: `${tradeQuantity} shares of ${stock.symbol} processed via local ledger at ₹${stock.currentPrice}.`,
      type: "success",
    });
    setTradeModalOpen(null);
  };

  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8 w-full font-sans">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/markets"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#587F6E] hover:text-[#0A1D16] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Equity Universe</span>
          </Link>
        </div>

        {/* Security Masthead Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#D3E5DC]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#00A86B] bg-[#E6F9F1] px-2.5 py-0.5 rounded-full border border-[#00A86B]/20">
                {stock.sector}
              </span>
              <span className="font-mono text-xs text-[#587F6E]">
                {stock.exchange} • Beta {stock.beta}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#071912] font-semibold">
              {stock.name}
            </h1>
            <p className="font-mono text-xs text-[#587F6E]">
              Ticker: <strong className="text-[#071912]">{stock.symbol}</strong> • ISIN: INE002A010{stock.symbol.length}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => toggleWatchlist(stock.symbol)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider border transition-all ${
                isFav
                  ? "bg-[#0A1D16] text-[#00E599] border-[#0A1D16] font-bold shadow-xs"
                  : "bg-white text-[#18382C] border-[#D3E5DC] hover:bg-[#EDF6F2]"
              }`}
            >
              <Star className={`h-3.5 w-3.5 ${isFav ? "fill-[#00E599] text-[#00E599]" : "text-[#587F6E]"}`} />
              <span>{isFav ? "In Watchlist" : "Add Watchlist"}</span>
            </button>
            <Link
              href="/investment-plan/create"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#0A1D16] text-[#00E599] text-xs font-mono uppercase font-bold hover:bg-[#122E23] transition-all shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Incorporate into Plan</span>
            </Link>
          </div>
        </div>

        {/* Existing Holding Position Callout (Directly from Image 4) */}
        {existingHolding && (
          <div className="rounded-2xl border border-[#00E599]/40 bg-[#E6F9F1] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-[#0A1D16] gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00E599]"></span>
              <span>Your Current Position:</span>
              <strong className="font-bold text-sm">{existingHolding.shares} shares</strong>
              <span>({formatINR(existingHolding.currentValue)})</span>
            </div>
            <div className="flex flex-wrap gap-4 tabular-nums text-xs">
              <span>Avg Buy: {formatINR(existingHolding.averageBuyPrice)}</span>
              <span className={existingHolding.unrealizedPnl >= 0 ? "text-[#00A86B] font-bold" : "text-[#E63946] font-bold"}>
                P&L: {formatINR(existingHolding.unrealizedPnl)} ({formatPercent(existingHolding.unrealizedPnlPercent)})
              </span>
            </div>
          </div>
        )}

        {/* Price History Chart */}
        <div className="rounded-3xl border border-[#D3E5DC] bg-white p-6 sm:p-7 shadow-xs">
          <StockHistoryChart
            history={stock.history}
            currentPrice={stock.currentPrice}
            change={stock.change}
            changePercent={stock.changePercent}
          />
        </div>

        {/* SECTION: ORDER BOOK & DEPTH LADDER (Directly inspired by Image 1 & 2) */}
        <div className="rounded-3xl border border-[#D3E5DC] bg-white p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D3E5DC]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00A86B] font-bold block">
                Execution Depth
              </span>
              <span className="text-xs text-[#587F6E]">• Real-time Simulated Liquidity</span>
            </div>

            {/* Tab switch (Order Book / History / Rationale / Risks) */}
            <div className="flex items-center gap-1 bg-[#EDF6F2] p-1 rounded-full border border-[#D3E5DC]">
              <button
                onClick={() => setActiveTab("ORDER_BOOK")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  activeTab === "ORDER_BOOK"
                    ? "bg-[#0A1D16] text-[#00E599] shadow-xs"
                    : "text-[#587F6E] hover:text-[#071912]"
                }`}
              >
                Order Book
              </button>
              <button
                onClick={() => setActiveTab("RATIONALE")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  activeTab === "RATIONALE"
                    ? "bg-[#0A1D16] text-[#00E599] shadow-xs"
                    : "text-[#587F6E] hover:text-[#071912]"
                }`}
              >
                Investment Thesis
              </button>
              <button
                onClick={() => setActiveTab("RISKS")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  activeTab === "RISKS"
                    ? "bg-[#0A1D16] text-[#00E599] shadow-xs"
                    : "text-[#587F6E] hover:text-[#071912]"
                }`}
              >
                Risk Analysis
              </button>
            </div>
          </div>

          {activeTab === "ORDER_BOOK" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bid Column (Buy orders) */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-mono text-[#587F6E] uppercase border-b border-[#D3E5DC] pb-1">
                    <span>Bid Quantity</span>
                    <span className="text-[#00A86B] font-bold">Bid Price (INR)</span>
                  </div>
                  <div className="space-y-1 font-mono text-xs">
                    {bids.map((b, i) => (
                      <div key={i} className="relative flex items-center justify-between py-1 px-2 rounded-lg overflow-hidden">
                        <div
                          className="absolute right-0 top-0 bottom-0 bg-[#00E599]/15 rounded-lg pointer-events-none"
                          style={{ width: `${(b.total / maxDepth) * 100}%` }}
                        />
                        <span className="relative z-10 text-[#071912] font-semibold">{b.size.toLocaleString()}</span>
                        <span className="relative z-10 text-[#00A86B] font-bold tabular-nums">
                          {formatINR(b.price, { showPaise: true })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ask Column (Sell orders) */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-mono text-[#587F6E] uppercase border-b border-[#D3E5DC] pb-1">
                    <span className="text-[#E63946] font-bold">Ask Price (INR)</span>
                    <span>Ask Quantity</span>
                  </div>
                  <div className="space-y-1 font-mono text-xs">
                    {asks.map((a, i) => (
                      <div key={i} className="relative flex items-center justify-between py-1 px-2 rounded-lg overflow-hidden">
                        <div
                          className="absolute left-0 top-0 bottom-0 bg-[#E63946]/15 rounded-lg pointer-events-none"
                          style={{ width: `${(a.total / maxDepth) * 100}%` }}
                        />
                        <span className="relative z-10 text-[#E63946] font-bold tabular-nums">
                          {formatINR(a.price, { showPaise: true })}
                        </span>
                        <span className="relative z-10 text-[#071912] font-semibold">{a.size.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sticky Buy & Sell Action Bar - Direct inspiration from Image 1 */}
              <div className="pt-4 border-t border-[#D3E5DC] flex items-center justify-end gap-3">
                <button
                  onClick={() => setTradeModalOpen("BUY")}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-full bg-[#00E599] hover:bg-[#1AFF9F] text-[#052619] font-mono font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>Simulate Buy ↓</span>
                  <span className="text-[10px] opacity-80">({formatINR(stock.currentPrice)})</span>
                </button>
                <button
                  onClick={() => setTradeModalOpen("SELL")}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-full bg-[#0A1D16] hover:bg-[#153426] text-white font-mono font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>Simulate Sell ↑</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === "RATIONALE" && (
            <div className="p-4 rounded-2xl bg-[#F4FAF7] border border-[#D3E5DC] space-y-2">
              <h4 className="font-serif text-base text-[#071912] font-semibold">
                Why NIVARAN Algorithms Include {stock.name}
              </h4>
              <p className="text-xs text-[#4B665A] leading-relaxed">
                {stock.selectionRationale}
              </p>
            </div>
          )}

          {activeTab === "RISKS" && (
            <div className="p-4 rounded-2xl bg-[#F4FAF7] border border-[#D3E5DC] space-y-2">
              <h4 className="font-serif text-base text-[#071912] font-semibold">
                Key Identified Risk Factors
              </h4>
              <ul className="space-y-1.5 text-xs text-[#4B665A]">
                {stock.keyRisks.map((risk, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-mono text-[#00A86B] font-bold">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Fundamentals Valuation Grid */}
        <div className="rounded-3xl border border-[#D3E5DC] bg-white p-6 sm:p-7 shadow-xs space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00A86B] font-bold block">
            Fundamental Valuation Multiples
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs font-mono border-t border-[#D3E5DC] pt-4">
            <div>
              <span className="text-[#587F6E] block text-[10px] uppercase">Market Capitalization</span>
              <p className="font-serif text-lg text-[#071912] font-bold tabular-nums mt-0.5">
                {formatMarketCapCr(stock.marketCapCr)}
              </p>
            </div>
            <div>
              <span className="text-[#587F6E] block text-[10px] uppercase">P/E Ratio</span>
              <p className="font-serif text-lg text-[#071912] font-bold tabular-nums mt-0.5">
                {stock.peRatio}x
              </p>
            </div>
            <div>
              <span className="text-[#587F6E] block text-[10px] uppercase">P/B Ratio</span>
              <p className="font-serif text-lg text-[#071912] font-bold tabular-nums mt-0.5">
                {stock.pbRatio}x
              </p>
            </div>
            <div>
              <span className="text-[#587F6E] block text-[10px] uppercase">Dividend Yield</span>
              <p className="font-serif text-lg text-[#00A86B] font-bold tabular-nums mt-0.5">
                {stock.divYield}%
              </p>
            </div>
            <div>
              <span className="text-[#587F6E] block text-[10px] uppercase">52-Week High</span>
              <p className="text-[#071912] font-semibold tabular-nums mt-0.5">
                {formatINR(stock.fiftyTwoWeekHigh)}
              </p>
            </div>
            <div>
              <span className="text-[#587F6E] block text-[10px] uppercase">52-Week Low</span>
              <p className="text-[#071912] font-semibold tabular-nums mt-0.5">
                {formatINR(stock.fiftyTwoWeekLow)}
              </p>
            </div>
            <div>
              <span className="text-[#587F6E] block text-[10px] uppercase">Stock Beta</span>
              <p className="text-[#071912] font-semibold tabular-nums mt-0.5">
                {stock.beta}
              </p>
            </div>
            <div>
              <span className="text-[#587F6E] block text-[10px] uppercase">Mandate Tier</span>
              <p className="text-[#00A86B] font-bold mt-0.5 uppercase">
                {stock.riskLevel}
              </p>
            </div>
          </div>
        </div>

        {/* Simulated Quick Order Modal */}
        {tradeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 border border-[#D3E5DC] shadow-2xl space-y-4 font-sans">
              <div className="flex items-center justify-between pb-3 border-b border-[#D3E5DC]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#00A86B] font-bold block">
                    Simulated Order Desk
                  </span>
                  <h3 className="font-serif text-xl text-[#071912] font-semibold">
                    {tradeModalOpen === "BUY" ? "Simulate Buy" : "Simulate Sell"} {stock.symbol}
                  </h3>
                </div>
                <button
                  onClick={() => setTradeModalOpen(null)}
                  className="p-1 rounded-full text-[#587F6E] hover:bg-[#EDF6F2]"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-2xl bg-[#F4FAF7] border border-[#D3E5DC] space-y-1">
                  <div className="flex justify-between text-[#587F6E]">
                    <span>Current Market Price:</span>
                    <span className="font-bold text-[#071912]">{formatINR(stock.currentPrice, { showPaise: true })}</span>
                  </div>
                  <div className="flex justify-between text-[#587F6E]">
                    <span>Available Cash:</span>
                    <span className="font-bold text-[#00A86B]">{formatINR(cashBalance)}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase text-[#587F6E] font-semibold">Order Quantity (Shares)</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setTradeQuantity(Math.max(1, tradeQuantity - 1))}
                      className="w-10 h-10 rounded-xl bg-[#EDF6F2] hover:bg-[#D3E5DC] text-base font-bold flex items-center justify-center"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={tradeQuantity}
                      onChange={(e) => setTradeQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="flex-1 py-2 text-center rounded-xl border border-[#D3E5DC] font-bold text-base text-[#071912]"
                    />
                    <button
                      onClick={() => setTradeQuantity(tradeQuantity + 1)}
                      className="w-10 h-10 rounded-xl bg-[#EDF6F2] hover:bg-[#D3E5DC] text-base font-bold flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#0A1D16] text-white flex justify-between items-center">
                  <span className="text-zinc-400">Total Estimated Amount:</span>
                  <span className="font-serif text-lg font-bold text-[#00E599]">
                    {formatINR(stock.currentPrice * tradeQuantity, { showPaise: true })}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => setTradeModalOpen(null)}
                  className="flex-1 py-2.5 rounded-full border border-[#D3E5DC] text-xs font-semibold text-[#587F6E] hover:bg-[#EDF6F2]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSimulateTrade}
                  className="flex-1 py-2.5 rounded-full bg-[#00E599] hover:bg-[#1AFF9F] text-[#052619] text-xs font-bold transition-all shadow-sm"
                >
                  Confirm Execution
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
