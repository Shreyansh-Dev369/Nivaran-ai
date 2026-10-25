import {
  AllocationItem,
  Holding,
  InvestmentHorizon,
  RiskTolerance,
  Stock,
  StockSector,
} from "../types";
import { INDIAN_STOCKS } from "../data/stocks";
import { toPaise, fromPaise } from "./formatters";

export interface PlanGenerationInput {
  amount: number;
  horizon: InvestmentHorizon;
  riskTolerance: RiskTolerance;
  preferredSectors: StockSector[];
  excludedSectors?: StockSector[];
  maxSingleStockCap?: number; // e.g. 25 for 25%
}

export interface RebalanceProposal {
  symbol: string;
  name: string;
  action: "BUY" | "SELL" | "HOLD";
  currentWeight: number;
  targetWeight: number;
  drift: number;
  sharesDelta: number;
  amountDelta: number;
  estimatedPrice: number;
}

/**
 * Deterministic allocation algorithm based on modern portfolio theory (MPT) principles:
 * - Filters stocks matching preferred sectors and risk tolerance tier
 * - Excludes forbidden sectors
 * - Applies single stock allocation cap (default 25%)
 * - Guarantees allocation percentages sum to EXACTLY 100%
 * - Assigns exact rupee amounts and whole-share calculations
 */
export function generateAllocationProposal(input: PlanGenerationInput): AllocationItem[] {
  const {
    amount,
    riskTolerance,
    preferredSectors,
    excludedSectors = [],
    maxSingleStockCap = 25,
  } = input;

  // 1. Filter candidate universe
  const validExcluded = new Set(excludedSectors);
  let candidates = INDIAN_STOCKS.filter((s) => !validExcluded.has(s.sector));

  // If user has specific preferred sectors, prioritize them
  const preferredSet = new Set(preferredSectors);
  if (preferredSectors.length > 0) {
    const preferredCandidates = candidates.filter((s) => preferredSet.has(s.sector));
    if (preferredCandidates.length >= 3) {
      candidates = preferredCandidates;
    }
  }

  // Fallback if universe is too small
  if (candidates.length < 3) {
    candidates = INDIAN_STOCKS.filter((s) => !validExcluded.has(s.sector));
  }
  if (candidates.length === 0) {
    candidates = INDIAN_STOCKS.slice(0, 5);
  }

  // 2. Score candidates based on risk profile
  // Conservative prefers lower Beta, higher market cap, lower PE
  // Growth prefers higher Beta, higher change momentum, technology/consumer/auto
  const scored = candidates.map((stock) => {
    let score = 10;

    if (riskTolerance === "CONSERVATIVE") {
      if (stock.riskLevel === "CONSERVATIVE") score += 20;
      if (stock.riskLevel === "BALANCED") score += 10;
      if (stock.beta <= 0.8) score += 15;
      if (stock.divYield >= 1.5) score += 10;
      score += Math.min(10, stock.marketCapCr / 100000);
    } else if (riskTolerance === "BALANCED") {
      if (stock.riskLevel === "BALANCED") score += 20;
      if (stock.riskLevel === "CONSERVATIVE") score += 12;
      if (stock.riskLevel === "GROWTH") score += 8;
      if (stock.beta >= 0.7 && stock.beta <= 1.15) score += 15;
      score += Math.min(10, stock.marketCapCr / 150000);
    } else {
      // GROWTH
      if (stock.riskLevel === "GROWTH") score += 25;
      if (stock.riskLevel === "BALANCED") score += 15;
      if (stock.beta >= 1.0) score += 15;
      if (["Technology", "Automobile", "Consumer Goods"].includes(stock.sector)) score += 10;
    }

    // Boost if in user's directly selected preferred sectors
    if (preferredSet.has(stock.sector)) {
      score += 15;
    }

    return { stock, score };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Select top 4 to 6 diverse stocks (ensure at least 3 distinct sectors)
  const selected: Stock[] = [];
  const sectorsSeen = new Set<StockSector>();

  for (const item of scored) {
    if (selected.length < 5) {
      selected.push(item.stock);
      sectorsSeen.add(item.stock.sector);
    } else if (selected.length < 6 && !sectorsSeen.has(item.stock.sector)) {
      selected.push(item.stock);
      sectorsSeen.add(item.stock.sector);
    }
  }

  const numStocks = selected.length;
  const cap = Math.min(maxSingleStockCap, 40);

  // 3. Compute target weight percentages that respect single-stock cap and sum to 100%
  // Baseline proportional to score
  const rawWeights = selected.map((s) => {
    const match = scored.find((item) => item.stock.symbol === s.symbol);
    return match ? match.score : 10;
  });
  const totalRaw = rawWeights.reduce((a, b) => a + b, 0);

  const initialPercentages = rawWeights.map((w) =>
    Math.min(cap, Math.max(10, Math.round((w / totalRaw) * 100)))
  );

  // Normalize so sum is exactly 100
  const currentSum = initialPercentages.reduce((a, b) => a + b, 0);
  let diff = 100 - currentSum;

  let idx = 0;
  while (diff !== 0) {
    if (diff > 0) {
      if (initialPercentages[idx] < cap) {
        initialPercentages[idx] += 1;
        diff -= 1;
      }
    } else {
      if (initialPercentages[idx] > 10) {
        initialPercentages[idx] -= 1;
        diff += 1;
      }
    }
    idx = (idx + 1) % numStocks;
  }

  // 4. Calculate Rupee amounts & estimated whole shares
  let allocatedPaise = 0;
  const totalAmountPaise = toPaise(amount);

  const items: AllocationItem[] = selected.map((stock, i) => {
    const pct = initialPercentages[i];
    // Exact paise allocation
    const itemPaise = Math.round((totalAmountPaise * pct) / 100);
    allocatedPaise += itemPaise;
    const targetAmount = fromPaise(itemPaise);
    const estimatedShares = Math.max(1, Math.floor(targetAmount / stock.currentPrice));

    return {
      symbol: stock.symbol,
      name: stock.name,
      sector: stock.sector,
      percentage: pct,
      targetAmount,
      estimatedShares,
      rationale: stock.selectionRationale,
      riskFactor: stock.keyRisks[0] || "General market volatility",
    };
  });

  // Reconcile rupee rounding difference on top allocation item
  const diffPaise = totalAmountPaise - allocatedPaise;
  if (diffPaise !== 0 && items.length > 0) {
    items[0].targetAmount = fromPaise(toPaise(items[0].targetAmount) + diffPaise);
  }

  return items;
}

/**
 * Calculates portfolio diversification score (0-100)
 * Uses Herfindahl-Hirschman Index (HHI) for stock and sector concentration.
 */
export function calculateDiversificationScore(
  holdings: Holding[],
  cashBalance: number,
  totalValue: number
): {
  score: number;
  rating: "Excellent" | "Good" | "Moderate" | "Concentrated";
  maxSectorName: string;
  maxSectorWeight: number;
  topStockWeight: number;
} {
  if (holdings.length === 0 || totalValue <= 0) {
    return {
      score: 50,
      rating: "Moderate",
      maxSectorName: "None",
      maxSectorWeight: 0,
      topStockWeight: 0,
    };
  }

  // Sector concentration
  const sectorWeights: Record<string, number> = {};
  let topStockWeight = 0;

  for (const h of holdings) {
    const weight = (h.currentValue / totalValue) * 100;
    if (weight > topStockWeight) topStockWeight = weight;
    sectorWeights[h.sector] = (sectorWeights[h.sector] || 0) + weight;
  }

  let maxSectorName = "";
  let maxSectorWeight = 0;

  for (const [sec, w] of Object.entries(sectorWeights)) {
    if (w > maxSectorWeight) {
      maxSectorWeight = w;
      maxSectorName = sec;
    }
  }

  // Compute stock HHI
  const stockHHI = holdings.reduce((sum, h) => {
    const w = (h.currentValue / totalValue) * 100;
    return sum + w * w;
  }, 0);

  // Compute sector HHI
  const sectorHHI = Object.values(sectorWeights).reduce((sum, w) => sum + w * w, 0);

  // Ideal HHI for 5-6 equal stocks is ~1600-2000. For sectors ~2000-2500.
  // We map lower HHI to higher score
  let score = Math.round(100 - (stockHHI / 100) * 0.4 - (sectorHHI / 100) * 0.4);
  score = Math.max(25, Math.min(98, score));

  let rating: "Excellent" | "Good" | "Moderate" | "Concentrated" = "Moderate";
  if (score >= 82) rating = "Excellent";
  else if (score >= 68) rating = "Good";
  else if (score >= 50) rating = "Moderate";
  else rating = "Concentrated";

  return {
    score,
    rating,
    maxSectorName,
    maxSectorWeight: Math.round(maxSectorWeight * 10) / 10,
    topStockWeight: Math.round(topStockWeight * 10) / 10,
  };
}

/**
 * Calculates drift between target allocation and current holding weight.
 * Generates rebalancing proposals for stocks that exceed drift threshold.
 */
export function calculateRebalanceProposals(
  holdings: Holding[],
  totalPortfolioValue: number,
  driftThresholdPercent: number = 5
): RebalanceProposal[] {
  if (holdings.length === 0 || totalPortfolioValue <= 0) return [];

  const proposals: RebalanceProposal[] = [];

  for (const holding of holdings) {
    const currentWeight = (holding.currentValue / totalPortfolioValue) * 100;
    const targetWeight = holding.targetWeight;
    const drift = currentWeight - targetWeight;

    const targetRupees = (totalPortfolioValue * targetWeight) / 100;
    const currentRupees = holding.currentValue;
    const amountDelta = targetRupees - currentRupees; // positive means need to BUY, negative means SELL

    const sharesDelta = Math.round(amountDelta / holding.currentPrice);

    let action: "BUY" | "SELL" | "HOLD" = "HOLD";
    if (Math.abs(drift) >= driftThresholdPercent) {
      action = drift > 0 ? "SELL" : "BUY";
    }

    proposals.push({
      symbol: holding.symbol,
      name: holding.name,
      action,
      currentWeight: Math.round(currentWeight * 10) / 10,
      targetWeight: Math.round(targetWeight * 10) / 10,
      drift: Math.round(drift * 10) / 10,
      sharesDelta,
      amountDelta: Math.round(amountDelta),
      estimatedPrice: holding.currentPrice,
    });
  }

  return proposals;
}
