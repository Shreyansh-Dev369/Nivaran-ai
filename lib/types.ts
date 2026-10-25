export type RiskTolerance = "CONSERVATIVE" | "BALANCED" | "GROWTH";
export type InvestmentHorizon = "SHORT" | "MEDIUM" | "LONG";
export type PlanFrequency = "MONTHLY" | "WEEKLY" | "ONE_TIME";
export type PlanStatus = "ACTIVE" | "PAUSED" | "STOPPED";

export type StockSector =
  | "Technology"
  | "Banking & Finance"
  | "Energy & Utilities"
  | "Healthcare & Pharma"
  | "Consumer Goods"
  | "Industrials"
  | "Automobile";

export interface StockHistoryPoint {
  date: string;
  price: number;
}

export interface Stock {
  symbol: string;
  name: string;
  exchange: "NSE" | "BSE";
  sector: StockSector;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  marketCapCr: number; // In ₹ Crores
  peRatio: number;
  pbRatio: number;
  divYield: number; // percentage
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  beta: number;
  riskLevel: RiskTolerance;
  description: string;
  selectionRationale: string;
  keyRisks: string[];
  history: StockHistoryPoint[];
}

export interface Holding {
  symbol: string;
  name: string;
  sector: StockSector;
  shares: number;
  averageBuyPrice: number;
  currentPrice: number;
  investedValue: number;
  currentValue: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  currentWeight: number; // percentage
  targetWeight: number; // percentage
}

export interface AllocationItem {
  symbol: string;
  name: string;
  sector: StockSector;
  percentage: number;
  targetAmount: number;
  estimatedShares: number;
  rationale: string;
  riskFactor: string;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  status: PlanStatus;
  frequency: PlanFrequency;
  simulatedAmount: number; // In INR
  horizon: InvestmentHorizon;
  riskTolerance: RiskTolerance;
  preferredSectors: StockSector[];
  excludedSectors: StockSector[];
  maxSingleStockCap: number; // percentage, e.g. 25
  rebalanceThreshold: number; // percentage drift, e.g. 5
  createdAt: string;
  lastExecutedAt?: string;
  nextScheduledDate?: string;
  allocations: AllocationItem[];
}

export type TransactionType =
  | "DEPOSIT"
  | "INVESTMENT"
  | "REBALANCE_BUY"
  | "REBALANCE_SELL"
  | "WITHDRAWAL"
  | "PLAN_TRIGGER";

export interface Transaction {
  id: string;
  type: TransactionType;
  date: string;
  amount: number;
  symbol?: string;
  shares?: number;
  price?: number;
  description: string;
  status: "COMPLETED" | "PENDING";
  referenceId?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  targetDate: string;
  category: "WEALTH" | "RETIREMENT" | "EMERGENCY" | "PURCHASE";
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: "PLAN" | "MARKET" | "SYSTEM" | "REBALANCE";
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joinedDate: string;
  investorTier: string;
  panMasked: string;
}
