"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AllocationItem,
  AppNotification,
  Goal,
  Holding,
  InvestmentPlan,
  PlanFrequency,
  RiskTolerance,
  StockSector,
  Transaction,
  UserProfile,
} from "../lib/types";
import { INDIAN_STOCKS } from "../lib/data/stocks";
import {
  generateAllocationProposal,
  calculateRebalanceProposals,
} from "../lib/utils/simulation-engine";
import { toPaise, fromPaise } from "../lib/utils/formatters";
import { ToastItem, ToastContainer } from "../components/ui/Toast";
import { CommandPalette } from "../components/ui/CommandPalette";
import { ShortcutsModal } from "../components/modals/ShortcutsModal";
import { AddFundsModal } from "../components/modals/AddFundsModal";
import { RebalanceModal } from "../components/modals/RebalanceModal";
import { soundManager } from "../lib/utils/sound";

// Default Seed User
const SEED_USER: UserProfile = {
  id: "usr_demo_8829",
  name: "Arjun Sharma",
  email: "arjun.sharma@example.com",
  phone: "+91 98765 43210",
  joinedDate: "2026-06-15",
  investorTier: "Tier 1 Verified (Demo)",
  panMasked: "ABCDE****F",
};

// Default Seed Holdings (5 stocks matching realistic portfolio)
const SEED_HOLDINGS: Holding[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    sector: "Energy & Utilities",
    shares: 12,
    averageBuyPrice: 2810.00,
    currentPrice: 2945.60,
    investedValue: 33720.00,
    currentValue: 35347.20,
    unrealizedPnl: 1627.20,
    unrealizedPnlPercent: 4.83,
    currentWeight: 26.2,
    targetWeight: 25.0,
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services Ltd",
    sector: "Technology",
    shares: 8,
    averageBuyPrice: 3720.00,
    currentPrice: 3892.40,
    investedValue: 29760.00,
    currentValue: 31139.20,
    unrealizedPnl: 1379.20,
    unrealizedPnlPercent: 4.63,
    currentWeight: 23.1,
    targetWeight: 22.0,
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    sector: "Banking & Finance",
    shares: 18,
    averageBuyPrice: 1610.50,
    currentPrice: 1682.15,
    investedValue: 28989.00,
    currentValue: 30278.70,
    unrealizedPnl: 1289.70,
    unrealizedPnlPercent: 4.45,
    currentWeight: 22.5,
    targetWeight: 20.0,
  },
  {
    symbol: "INFOSYS",
    name: "Infosys Ltd",
    sector: "Technology",
    shares: 15,
    averageBuyPrice: 1480.00,
    currentPrice: 1545.80,
    investedValue: 22200.00,
    currentValue: 23187.00,
    unrealizedPnl: 987.00,
    unrealizedPnlPercent: 4.45,
    currentWeight: 17.2,
    targetWeight: 18.0,
  },
  {
    symbol: "LT",
    name: "Larsen & Toubro Ltd",
    sector: "Industrials",
    shares: 4,
    averageBuyPrice: 3450.00,
    currentPrice: 3640.75,
    investedValue: 13800.00,
    currentValue: 14563.00,
    unrealizedPnl: 763.00,
    unrealizedPnlPercent: 5.53,
    currentWeight: 10.8,
    targetWeight: 15.0,
  },
];

const SEED_PLAN: InvestmentPlan = {
  id: "plan_nv_001",
  name: "Core Indian Growth Plan",
  status: "ACTIVE",
  frequency: "MONTHLY",
  simulatedAmount: 25000,
  horizon: "LONG",
  riskTolerance: "BALANCED",
  preferredSectors: ["Technology", "Banking & Finance", "Energy & Utilities", "Industrials"],
  excludedSectors: [],
  maxSingleStockCap: 25,
  rebalanceThreshold: 5,
  createdAt: "2026-07-01T10:00:00Z",
  lastExecutedAt: "2026-10-01T09:30:00Z",
  nextScheduledDate: "2026-11-01T09:30:00Z",
  allocations: [
    {
      symbol: "RELIANCE",
      name: "Reliance Industries Ltd",
      sector: "Energy & Utilities",
      percentage: 25,
      targetAmount: 6250,
      estimatedShares: 2,
      rationale: "Core anchor with integrated consumer and energy cash flows.",
      riskFactor: "Global refining margin cycles",
    },
    {
      symbol: "TCS",
      name: "Tata Consultancy Services Ltd",
      sector: "Technology",
      percentage: 22,
      targetAmount: 5500,
      estimatedShares: 1,
      rationale: "Pristine balance sheet with continuous free cash generation.",
      riskFactor: "Enterprise IT spending headwinds",
    },
    {
      symbol: "HDFCBANK",
      name: "HDFC Bank Ltd",
      sector: "Banking & Finance",
      percentage: 20,
      targetAmount: 5000,
      estimatedShares: 3,
      rationale: "India's largest retail deposit franchise and private lender.",
      riskFactor: "Post-merger loan-deposit ratio adjustment",
    },
    {
      symbol: "INFOSYS",
      name: "Infosys Ltd",
      sector: "Technology",
      percentage: 18,
      targetAmount: 4500,
      estimatedShares: 3,
      rationale: "Digital transformation leader and strong dividend payer.",
      riskFactor: "Overseas client discretionary budget constraints",
    },
    {
      symbol: "LT",
      name: "Larsen & Toubro Ltd",
      sector: "Industrials",
      percentage: 15,
      targetAmount: 3750,
      estimatedShares: 1,
      rationale: "Record order book backed by domestic capex expansion.",
      riskFactor: "Input commodity costs and international execution",
    },
  ],
};

const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: "tx_dep_001",
    type: "DEPOSIT",
    date: "2026-07-01T09:00:00Z",
    amount: 150000,
    description: "Initial Demo Capital Allocation",
    status: "COMPLETED",
    referenceId: "NVR-DEMO-9912",
  },
  {
    id: "tx_inv_001",
    type: "INVESTMENT",
    date: "2026-07-01T10:15:00Z",
    amount: 128469,
    description: "Automated Portfolio Initial Allocation (5 Securities)",
    status: "COMPLETED",
    referenceId: "NVR-ALLOC-7721",
  },
  {
    id: "tx_pln_002",
    type: "PLAN_TRIGGER",
    date: "2026-08-01T09:30:00Z",
    amount: 25000,
    description: "Scheduled Monthly Automated Contribution",
    status: "COMPLETED",
    referenceId: "NVR-SIP-8831",
  },
  {
    id: "tx_pln_003",
    type: "PLAN_TRIGGER",
    date: "2026-09-01T09:30:00Z",
    amount: 25000,
    description: "Scheduled Monthly Automated Contribution",
    status: "COMPLETED",
    referenceId: "NVR-SIP-8832",
  },
  {
    id: "tx_pln_004",
    type: "PLAN_TRIGGER",
    date: "2026-10-01T09:30:00Z",
    amount: 25000,
    description: "Scheduled Monthly Automated Contribution",
    status: "COMPLETED",
    referenceId: "NVR-SIP-8833",
  },
];

const SEED_GOALS: Goal[] = [
  {
    id: "goal_001",
    name: "Long-term Wealth Creation",
    targetAmount: 2500000,
    currentAmount: 184515,
    monthlyContribution: 20000,
    targetDate: "2031-12-31",
    category: "WEALTH",
  },
  {
    id: "goal_002",
    name: "Retirement Corpus Seed",
    targetAmount: 10000000,
    currentAmount: 184515,
    monthlyContribution: 25000,
    targetDate: "2045-06-30",
    category: "RETIREMENT",
  },
];

const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif_001",
    title: "Monthly Plan Executed Successfully",
    message: "Your simulated monthly investment of ₹25,000 was deployed across 5 target stocks.",
    date: "2026-10-01T09:31:00Z",
    read: false,
    type: "PLAN",
  },
  {
    id: "notif_002",
    title: "Quarterly Portfolio Health Check",
    message: "Diversification score remains strong at 84/100. Single-stock concentration is within policy cap (26.2%).",
    date: "2026-10-10T14:20:00Z",
    read: false,
    type: "SYSTEM",
  },
  {
    id: "notif_003",
    title: "Market Simulation Update",
    message: "Indian benchmark indices opened higher today. Energy & Banking stocks showed positive momentum.",
    date: "2026-10-15T09:15:00Z",
    read: true,
    type: "MARKET",
  },
];

interface AppContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  signIn: (email: string, name?: string) => void;
  signUp: (name: string, email: string) => void;
  signOut: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;

  cashBalance: number;
  holdings: Holding[];
  totalInvested: number;
  totalHoldingsValue: number;
  totalPortfolioValue: number;
  totalUnrealizedPnl: number;
  totalUnrealizedPnlPercent: number;

  plan: InvestmentPlan | null;
  createPlan: (newPlan: Omit<InvestmentPlan, "id" | "createdAt" | "status">) => void;
  updatePlan: (updates: Partial<InvestmentPlan>) => void;
  pausePlan: () => void;
  resumePlan: () => void;
  stopPlan: () => void;
  executeContribution: (customAmount?: number) => { success: boolean; message: string };

  transactions: Transaction[];
  addDemoFunds: (amount: number, note?: string) => Transaction;

  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id">) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  watchlist: string[];
  toggleWatchlist: (symbol: string) => void;
  isWatchlisted: (symbol: string) => boolean;

  notifications: AppNotification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;

  rebalancePortfolio: () => { success: boolean; message: string; tradesCount: number };
  resetDemoData: () => void;
  resetToEmptyState: () => void;

  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, "id">) => void;
  dismissToast: (id: string) => void;

  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;
  isAddFundsOpen: boolean;
  setIsAddFundsOpen: (open: boolean) => void;
  isRebalanceOpen: boolean;
  setIsRebalanceOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = "nivara_investing_state_v1";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  // States
  const [user, setUser] = useState<UserProfile | null>(SEED_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [cashBalance, setCashBalance] = useState<number>(50000);
  const [holdings, setHoldings] = useState<Holding[]>(SEED_HOLDINGS);
  const [plan, setPlan] = useState<InvestmentPlan | null>(SEED_PLAN);
  const [transactions, setTransactions] = useState<Transaction[]>(SEED_TRANSACTIONS);
  const [goals, setGoals] = useState<Goal[]>(SEED_GOALS);
  const [watchlist, setWatchlist] = useState<string[]>(["RELIANCE", "TCS", "HDFCBANK", "TATAMOTORS", "ITC"]);
  const [notifications, setNotifications] = useState<AppNotification[]>(SEED_NOTIFICATIONS);

  // Interactive UI Modal & Toast States
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [isRebalanceOpen, setIsRebalanceOpen] = useState(false);

  const showToast = (toast: Omit<ToastItem, "id">) => {
    const id = "toast_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev.slice(-3), { ...toast, id }]);
    if (toast.type === "success") {
      soundManager.playSuccess();
    } else if (toast.type === "error" || toast.type === "warning") {
      soundManager.playNotice();
    } else {
      soundManager.playTick();
    }
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. Hydrate from localStorage on client mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.user !== undefined) setUser(parsed.user);
          if (parsed.isAuthenticated !== undefined) setIsAuthenticated(parsed.isAuthenticated);
          if (parsed.cashBalance !== undefined) setCashBalance(parsed.cashBalance);
          if (parsed.holdings) setHoldings(parsed.holdings);
          if (parsed.plan !== undefined) setPlan(parsed.plan);
          if (parsed.transactions) setTransactions(parsed.transactions);
          if (parsed.goals) setGoals(parsed.goals);
          if (parsed.watchlist) setWatchlist(parsed.watchlist);
          if (parsed.notifications) setNotifications(parsed.notifications);
        }
      } catch (e) {
        console.warn("Failed to parse stored Nivara state, using seed defaults:", e);
      }
      setIsHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // 2. Persist to localStorage whenever state changes after hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const stateToSave = {
        user,
        isAuthenticated,
        cashBalance,
        holdings,
        plan,
        transactions,
        goals,
        watchlist,
        notifications,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Failed to persist state to localStorage:", e);
    }
  }, [
    isHydrated,
    user,
    isAuthenticated,
    cashBalance,
    holdings,
    plan,
    transactions,
    goals,
    watchlist,
    notifications,
  ]);

  // Derived financial totals
  const totalInvested = holdings.reduce((sum, h) => sum + h.investedValue, 0);
  const totalHoldingsValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalPortfolioValue = totalHoldingsValue + cashBalance;
  const totalUnrealizedPnl = totalHoldingsValue - totalInvested;
  const totalUnrealizedPnlPercent =
    totalInvested > 0 ? (totalUnrealizedPnl / totalInvested) * 100 : 0;

  // Recalculate holding weights whenever holdings change
  const recalculateWeights = (currentHoldings: Holding[]): Holding[] => {
    const totalHValue = currentHoldings.reduce((sum, h) => sum + h.currentValue, 0);
    return currentHoldings.map((h) => ({
      ...h,
      currentWeight: totalHValue > 0 ? Math.round((h.currentValue / totalHValue) * 1000) / 10 : 0,
    }));
  };

  // Auth actions
  const signIn = (email: string, name?: string) => {
    const u: UserProfile = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      name: name || "Demo Investor",
      email,
      phone: "+91 98765 43210",
      joinedDate: new Date().toISOString().split("T")[0],
      investorTier: "Tier 1 Verified (Demo)",
      panMasked: "ABCDE****F",
    };
    setUser(u);
    setIsAuthenticated(true);
  };

  const signUp = (name: string, email: string) => {
    const u: UserProfile = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      name,
      email,
      phone: "+91 98765 43210",
      joinedDate: new Date().toISOString().split("T")[0],
      investorTier: "Tier 1 Verified (Demo)",
      panMasked: "ABCDE****F",
    };
    setUser(u);
    setIsAuthenticated(true);
  };

  const signOut = () => {
    setIsAuthenticated(false);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
  };

  // Funding action
  const addDemoFunds = (amount: number, note?: string): Transaction => {
    const newTx: Transaction = {
      id: "tx_dep_" + Date.now().toString(36),
      type: "DEPOSIT",
      date: new Date().toISOString(),
      amount,
      description: note || `Simulated Demo Funds Credited (₹${amount.toLocaleString("en-IN")})`,
      status: "COMPLETED",
      referenceId: "NVR-FND-" + Math.floor(100000 + Math.random() * 900000),
    };

    setCashBalance((prev) => fromPaise(toPaise(prev) + toPaise(amount)));
    setTransactions((prev) => [newTx, ...prev]);

    const notif: AppNotification = {
      id: "notif_" + Date.now().toString(36),
      title: "Demo Funds Added",
      message: `Successfully credited ₹${amount.toLocaleString("en-IN")} to simulated cash ledger. Available balance updated.`,
      date: new Date().toISOString(),
      read: false,
      type: "SYSTEM",
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast({
      type: "success",
      title: "Demo Cash Credited",
      message: `₹${amount.toLocaleString("en-IN")} added to simulated cash ledger. Available balance updated.`,
    });

    return newTx;
  };

  // Plan actions
  const createPlan = (newPlanData: Omit<InvestmentPlan, "id" | "createdAt" | "status">) => {
    const newPlan: InvestmentPlan = {
      ...newPlanData,
      id: "plan_" + Date.now().toString(36),
      createdAt: new Date().toISOString(),
      status: "ACTIVE",
    };
    setPlan(newPlan);

    const notif: AppNotification = {
      id: "notif_" + Date.now().toString(36),
      title: "Investment Plan Created",
      message: `Your ${newPlan.name} (${newPlan.riskTolerance} risk, ₹${newPlan.simulatedAmount.toLocaleString("en-IN")} ${newPlan.frequency}) is now active.`,
      date: new Date().toISOString(),
      read: false,
      type: "PLAN",
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const updatePlan = (updates: Partial<InvestmentPlan>) => {
    if (!plan) return;
    setPlan({ ...plan, ...updates });
  };

  const pausePlan = () => {
    if (!plan) return;
    setPlan({ ...plan, status: "PAUSED" });
    const notif: AppNotification = {
      id: "notif_" + Date.now().toString(36),
      title: "Investment Plan Paused",
      message: "Automated contributions have been temporarily paused. Your existing holdings remain untouched.",
      date: new Date().toISOString(),
      read: false,
      type: "PLAN",
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const resumePlan = () => {
    if (!plan) return;
    setPlan({ ...plan, status: "ACTIVE" });
    const notif: AppNotification = {
      id: "notif_" + Date.now().toString(36),
      title: "Investment Plan Resumed",
      message: "Automated recurring investments are active according to your schedule.",
      date: new Date().toISOString(),
      read: false,
      type: "PLAN",
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const stopPlan = () => {
    if (!plan) return;
    setPlan({ ...plan, status: "STOPPED" });
    const notif: AppNotification = {
      id: "notif_" + Date.now().toString(36),
      title: "Investment Plan Stopped",
      message: "Plan has been discontinued. You can create a fresh plan at any time.",
      date: new Date().toISOString(),
      read: false,
      type: "PLAN",
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Automated Contribution execution
  const executeContribution = (customAmount?: number): { success: boolean; message: string } => {
    if (!plan || plan.allocations.length === 0) {
      return { success: false, message: "No active investment plan found." };
    }

    const deployAmount = customAmount || plan.simulatedAmount;
    if (cashBalance < deployAmount) {
      return {
        success: false,
        message: `Insufficient simulated cash (Available: ₹${cashBalance.toLocaleString("en-IN")}, Required: ₹${deployAmount.toLocaleString("en-IN")}). Please add demo funds first.`,
      };
    }

    // Deduct cash ledger
    setCashBalance((prev) => fromPaise(toPaise(prev) - toPaise(deployAmount)));

    // Deploy across plan allocations
    const newHoldingsMap = new Map<string, Holding>();
    holdings.forEach((h) => newHoldingsMap.set(h.symbol, { ...h }));

    const stockTrades: { symbol: string; shares: number; price: number; amount: number }[] = [];

    for (const alloc of plan.allocations) {
      const targetRupees = (deployAmount * alloc.percentage) / 100;
      const stockInfo = INDIAN_STOCKS.find((s) => s.symbol === alloc.symbol);
      const price = stockInfo ? stockInfo.currentPrice : 1000;
      const sharesToBuy = Math.max(1, Math.round(targetRupees / price));
      const tradeAmount = sharesToBuy * price;

      stockTrades.push({ symbol: alloc.symbol, shares: sharesToBuy, price, amount: tradeAmount });

      if (newHoldingsMap.has(alloc.symbol)) {
        const existing = newHoldingsMap.get(alloc.symbol)!;
        const totalOldCost = existing.shares * existing.averageBuyPrice;
        const totalNewCost = totalOldCost + tradeAmount;
        const newShares = existing.shares + sharesToBuy;
        const newAvg = totalNewCost / newShares;
        const newCurrentVal = newShares * price;
        const pnl = newCurrentVal - totalNewCost;

        newHoldingsMap.set(alloc.symbol, {
          ...existing,
          shares: newShares,
          averageBuyPrice: Math.round(newAvg * 100) / 100,
          currentPrice: price,
          investedValue: Math.round(totalNewCost * 100) / 100,
          currentValue: Math.round(newCurrentVal * 100) / 100,
          unrealizedPnl: Math.round(pnl * 100) / 100,
          unrealizedPnlPercent: Math.round((pnl / totalNewCost) * 10000) / 100,
          targetWeight: alloc.percentage,
        });
      } else {
        newHoldingsMap.set(alloc.symbol, {
          symbol: alloc.symbol,
          name: alloc.name,
          sector: alloc.sector,
          shares: sharesToBuy,
          averageBuyPrice: price,
          currentPrice: price,
          investedValue: tradeAmount,
          currentValue: tradeAmount,
          unrealizedPnl: 0,
          unrealizedPnlPercent: 0,
          currentWeight: 0,
          targetWeight: alloc.percentage,
        });
      }
    }

    const updatedHoldingsList = recalculateWeights(Array.from(newHoldingsMap.values()));
    setHoldings(updatedHoldingsList);

    // Record ledger transactions
    const planTx: Transaction = {
      id: "tx_pln_" + Date.now().toString(36),
      type: "PLAN_TRIGGER",
      date: new Date().toISOString(),
      amount: deployAmount,
      description: `Automated Plan Execution: ₹${deployAmount.toLocaleString("en-IN")} deployed across ${plan.allocations.length} stocks`,
      status: "COMPLETED",
      referenceId: "NVR-AUTO-" + Math.floor(100000 + Math.random() * 900000),
    };

    setTransactions((prev) => [planTx, ...prev]);

    // Update plan's lastExecutedAt
    setPlan({
      ...plan,
      lastExecutedAt: new Date().toISOString(),
      nextScheduledDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
    });

    const notif: AppNotification = {
      id: "notif_" + Date.now().toString(36),
      title: "Automated Investment Complete",
      message: `Deployed ₹${deployAmount.toLocaleString("en-IN")} according to your target allocation rules.`,
      date: new Date().toISOString(),
      read: false,
      type: "PLAN",
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast({
      type: "success",
      title: "Automated Mandate Run Complete",
      message: `Deployed ₹${deployAmount.toLocaleString("en-IN")} across ${plan.allocations.length} securities with zero drift.`,
    });

    return {
      success: true,
      message: `Successfully deployed ₹${deployAmount.toLocaleString("en-IN")} across ${plan.allocations.length} securities.`,
    };
  };

  // Rebalancing action
  const rebalancePortfolio = (): { success: boolean; message: string; tradesCount: number } => {
    if (holdings.length === 0) {
      showToast({ type: "warning", title: "No Active Holdings", message: "Portfolio has no holdings to rebalance." });
      return { success: false, message: "No active holdings to rebalance.", tradesCount: 0 };
    }

    const proposals = calculateRebalanceProposals(holdings, totalHoldingsValue, plan?.rebalanceThreshold || 5);
    const actionable = proposals.filter((p) => p.action !== "HOLD");

    if (actionable.length === 0) {
      showToast({
        type: "info",
        title: "Portfolio Well-Balanced",
        message: "All positions are currently within the allowable ±5% drift threshold.",
      });
      return {
        success: true,
        message: "Portfolio is already well-balanced within the drift threshold.",
        tradesCount: 0,
      };
    }

    // Execute simulated rebalance sells and buys
    const newHoldings = holdings.map((h) => {
      const prop = proposals.find((p) => p.symbol === h.symbol);
      if (!prop || prop.action === "HOLD") return h;

      const newShares = Math.max(1, h.shares + prop.sharesDelta);
      const newVal = newShares * h.currentPrice;
      const pnl = newVal - h.investedValue;

      return {
        ...h,
        shares: newShares,
        currentValue: Math.round(newVal * 100) / 100,
        unrealizedPnl: Math.round(pnl * 100) / 100,
        unrealizedPnlPercent: h.investedValue > 0 ? Math.round((pnl / h.investedValue) * 10000) / 100 : 0,
        targetWeight: prop.targetWeight,
      };
    });

    setHoldings(recalculateWeights(newHoldings));

    // Ledger entry for rebalance
    const rebalanceTx: Transaction = {
      id: "tx_reb_" + Date.now().toString(36),
      type: "REBALANCE_BUY",
      date: new Date().toISOString(),
      amount: totalHoldingsValue,
      description: `Automated Rebalancing Execution (${actionable.length} securities adjusted to target weights)`,
      status: "COMPLETED",
      referenceId: "NVR-REB-" + Math.floor(100000 + Math.random() * 900000),
    };
    setTransactions((prev) => [rebalanceTx, ...prev]);

    const notif: AppNotification = {
      id: "notif_" + Date.now().toString(36),
      title: "Portfolio Rebalancing Completed",
      message: `Adjusted ${actionable.length} holdings to eliminate allocation drift and restore risk profile alignment.`,
      date: new Date().toISOString(),
      read: false,
      type: "REBALANCE",
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast({
      type: "success",
      title: "Portfolio Rebalanced",
      message: `Adjusted ${actionable.length} positions to restore target risk weights.`,
    });

    return {
      success: true,
      message: `Executed rebalancing across ${actionable.length} positions successfully.`,
      tradesCount: actionable.length,
    };
  };

  // Goal actions
  const addGoal = (goalData: Omit<Goal, "id">) => {
    const newGoal: Goal = {
      ...goalData,
      id: "goal_" + Date.now().toString(36),
    };
    setGoals((prev) => [newGoal, ...prev]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Watchlist actions
  const toggleWatchlist = (symbol: string) => {
    const isCurrently = watchlist.includes(symbol);
    setWatchlist((prev) =>
      isCurrently ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
    showToast({
      type: "info",
      title: isCurrently ? "Removed from Watchlist" : "Saved to Watchlist",
      message: `${symbol} was ${isCurrently ? "removed from" : "added to"} your tracked securities.`,
    });
  };

  const isWatchlisted = (symbol: string) => watchlist.includes(symbol);

  // Notification actions
  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast({ type: "info", title: "Notices Marked as Read", message: "All system audit notifications updated." });
  };

  const clearNotifications = () => {
    setNotifications([]);
    showToast({ type: "info", title: "Notices Cleared", message: "All notifications cleared from audit feed." });
  };

  // Full reset demo data
  const resetDemoData = () => {
    setUser(SEED_USER);
    setIsAuthenticated(true);
    setCashBalance(50000);
    setHoldings(SEED_HOLDINGS);
    setPlan(SEED_PLAN);
    setTransactions(SEED_TRANSACTIONS);
    setGoals(SEED_GOALS);
    setWatchlist(["RELIANCE", "TCS", "HDFCBANK", "TATAMOTORS", "ITC"]);
    setNotifications(SEED_NOTIFICATIONS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    showToast({
      type: "warning",
      title: "Sandbox Reset",
      message: "Restored pristine evaluation portfolio (₹1.84L) and default seed cash ledger.",
    });
  };

  // Reset to fresh, uninvested empty state
  const resetToEmptyState = () => {
    setUser({
      id: "usr_demo_new",
      name: "New Evaluator",
      email: "evaluator@university.edu.in",
      phone: "+91 98765 00000",
      joinedDate: new Date().toISOString().split("T")[0],
      investorTier: "Tier 1 Verified (Demo)",
      panMasked: "ABCDE****F",
    });
    setIsAuthenticated(true);
    setCashBalance(100000);
    setHoldings([]);
    setPlan(null);
    setTransactions([
      {
        id: "tx_init_cash",
        type: "DEPOSIT",
        date: new Date().toISOString(),
        amount: 100000,
        description: "Initial Demo Capital Allocation",
        status: "COMPLETED",
        referenceId: "NVR-INIT-100K",
      },
    ]);
    setGoals([]);
    setWatchlist(["RELIANCE", "TCS", "HDFCBANK"]);
    setNotifications([
      {
        id: "notif_welcome",
        title: "Welcome to NIVARA",
        message: "Your demo sandbox is ready with ₹1,00,000 available demo cash. Create your first automated plan to begin.",
        date: new Date().toISOString(),
        read: false,
        type: "SYSTEM",
      },
    ]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    showToast({
      type: "info",
      title: "Fresh Account Initialized",
      message: "Cleared all holdings. Set available demo cash to ₹1,00,000 for fresh plan evaluation.",
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        signIn,
        signUp,
        signOut,
        updateProfile,

        cashBalance,
        holdings,
        totalInvested,
        totalHoldingsValue,
        totalPortfolioValue,
        totalUnrealizedPnl,
        totalUnrealizedPnlPercent,

        plan,
        createPlan,
        updatePlan,
        pausePlan,
        resumePlan,
        stopPlan,
        executeContribution,

        transactions,
        addDemoFunds,

        goals,
        addGoal,
        updateGoal,
        deleteGoal,

        watchlist,
        toggleWatchlist,
        isWatchlisted,

        notifications,
        markAsRead,
        markAllAsRead,
        clearNotifications,

        rebalancePortfolio,
        resetDemoData,
        resetToEmptyState,

        toasts,
        showToast,
        dismissToast,

        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isShortcutsOpen,
        setIsShortcutsOpen,
        isAddFundsOpen,
        setIsAddFundsOpen,
        isRebalanceOpen,
        setIsRebalanceOpen,
      }}
    >
      {children}

      {/* Global Interactive Experience Layers */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenAddFunds={() => {
          setIsCommandPaletteOpen(false);
          setIsAddFundsOpen(true);
        }}
        onOpenRebalance={() => {
          setIsCommandPaletteOpen(false);
          setIsRebalanceOpen(true);
        }}
        onOpenShortcuts={() => {
          setIsCommandPaletteOpen(false);
          setIsShortcutsOpen(true);
        }}
        onTriggerSIP={() => {
          setIsCommandPaletteOpen(false);
          executeContribution();
        }}
        onResetDemo={() => {
          setIsCommandPaletteOpen(false);
          resetDemoData();
        }}
        onToast={(msg) => showToast({ type: "info", title: "Preference Updated", message: msg })}
      />
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
      <AddFundsModal
        isOpen={isAddFundsOpen}
        onClose={() => setIsAddFundsOpen(false)}
      />
      <RebalanceModal
        isOpen={isRebalanceOpen}
        onClose={() => setIsRebalanceOpen(false)}
      />
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
