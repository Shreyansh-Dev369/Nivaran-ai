import assert from "node:assert";
import { formatINR, formatPercent, toPaise, fromPaise } from "../lib/utils/formatters";
import {
  generateAllocationProposal,
  calculateDiversificationScore,
  calculateRebalanceProposals,
} from "../lib/utils/simulation-engine";
import { Holding } from "../lib/types";

console.log("=== NIVARA AUTOMATED TEST SUITE ===");

// 1. Currency Formatters Tests
console.log("\n[Test 1] Financial Currency Formatters:");
const val1 = formatINR(150000);
assert.strictEqual(val1, "₹1,50,000", "Indian numbering for 1.5 Lakhs should match");
console.log("✓ formatINR(150000) ->", val1);

const val2 = formatINR(12500000, { compact: true });
assert.strictEqual(val2, "₹1.25 Cr", "Compact Crore display should match");
console.log("✓ formatINR(12500000, compact) ->", val2);

const val3 = formatINR(250000, { compact: true });
assert.strictEqual(val3, "₹2.50 L", "Compact Lakh display should match");
console.log("✓ formatINR(250000, compact) ->", val3);

const val4 = formatPercent(12.456);
assert.strictEqual(val4, "+12.46%", "Signed percentage display should match");
console.log("✓ formatPercent(12.456) ->", val4);

// 2. Decimal-safe Paise Arithmetic
console.log("\n[Test 2] Decimal-Safe Money Math:");
const p1 = toPaise(100.55);
assert.strictEqual(p1, 10055, "Paise conversion must be exact integer");
const r1 = fromPaise(10055);
assert.strictEqual(r1, 100.55, "Rupee conversion must round-trip cleanly");
console.log("✓ toPaise(100.55) ->", p1, "| fromPaise(10055) ->", r1);

// 3. Deterministic Allocation Engine - Conservative
console.log("\n[Test 3] Deterministic Allocation Engine (Conservative):");
const allocCons = generateAllocationProposal({
  amount: 50000,
  horizon: "LONG",
  riskTolerance: "CONSERVATIVE",
  preferredSectors: ["Technology", "Banking & Finance", "Consumer Goods"],
  maxSingleStockCap: 25,
});
const sumCons = allocCons.reduce((sum, a) => sum + a.percentage, 0);
assert.strictEqual(sumCons, 100, "Allocation percentages must sum to EXACTLY 100%");
allocCons.forEach((item) => {
  assert(item.percentage <= 25, `Stock ${item.symbol} weight ${item.percentage}% must not exceed 25% cap`);
  assert(item.targetAmount > 0, `Target amount for ${item.symbol} must be positive`);
  assert(item.estimatedShares >= 1, `Estimated shares for ${item.symbol} must be at least 1`);
});
console.log(`✓ Conservative plan generated ${allocCons.length} securities summing to ${sumCons}% (Cap: <=25%)`);

// 4. Deterministic Allocation Engine - Growth with Exclusions
console.log("\n[Test 4] Allocation Engine with Excluded Sectors (Growth):");
const allocGrowth = generateAllocationProposal({
  amount: 100000,
  horizon: "LONG",
  riskTolerance: "GROWTH",
  preferredSectors: ["Technology", "Automobile", "Consumer Goods"],
  excludedSectors: ["Energy & Utilities"],
  maxSingleStockCap: 30,
});
const sumGrowth = allocGrowth.reduce((sum, a) => sum + a.percentage, 0);
assert.strictEqual(sumGrowth, 100, "Growth allocation must sum to EXACTLY 100%");
allocGrowth.forEach((item) => {
  assert.notStrictEqual(item.sector, "Energy & Utilities", "Excluded sector must not be present in proposal");
});
console.log(`✓ Growth plan generated ${allocGrowth.length} securities summing to ${sumGrowth}% with zero Energy & Utilities`);

// 5. Portfolio Diversification Score (HHI)
console.log("\n[Test 5] Diversification & Concentration Scoring:");
const mockHoldings: Holding[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance",
    sector: "Energy & Utilities",
    shares: 10,
    averageBuyPrice: 2800,
    currentPrice: 2900,
    investedValue: 28000,
    currentValue: 29000,
    unrealizedPnl: 1000,
    unrealizedPnlPercent: 3.57,
    currentWeight: 29,
    targetWeight: 25,
  },
  {
    symbol: "TCS",
    name: "TCS",
    sector: "Technology",
    shares: 8,
    averageBuyPrice: 3800,
    currentPrice: 3900,
    investedValue: 30400,
    currentValue: 31200,
    unrealizedPnl: 800,
    unrealizedPnlPercent: 2.63,
    currentWeight: 31.2,
    targetWeight: 25,
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank",
    sector: "Banking & Finance",
    shares: 20,
    averageBuyPrice: 1600,
    currentPrice: 1680,
    investedValue: 32000,
    currentValue: 33600,
    unrealizedPnl: 1600,
    unrealizedPnlPercent: 5.0,
    currentWeight: 33.6,
    targetWeight: 25,
  },
];
const totalVal = 100000;
const cashVal = 6200;
const score = calculateDiversificationScore(mockHoldings, cashVal, totalVal);
assert(score.score >= 0 && score.score <= 100, "Score must be within [0, 100]");
assert(score.maxSectorWeight > 0, "Max sector weight must be computed");
console.log(`✓ Diversification Score computed: ${score.score}/100 (${score.rating}) | Top Sector: ${score.maxSectorName} (${score.maxSectorWeight}%)`);

// 6. Portfolio Drift & Rebalancing Calculation
console.log("\n[Test 6] Rebalance Drift Detection:");
const rebalanceProposals = calculateRebalanceProposals(mockHoldings, totalVal, 5);
assert.strictEqual(rebalanceProposals.length, 3, "Proposals should be calculated for all 3 holdings");
const actionable = rebalanceProposals.filter((p) => p.action !== "HOLD");
assert(actionable.length >= 1, "At least one holding drifting > 5% should trigger rebalance action");
console.log(`✓ Rebalancing proposals evaluated: ${actionable.length} actionable adjustments identified`);

console.log("\n==========================================");
console.log("🎉 ALL AUTOMATED TESTS PASSED SUCCESSFULLY!");
console.log("==========================================");
