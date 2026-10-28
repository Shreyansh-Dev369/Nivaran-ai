"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { INDIAN_STOCKS } from "../../lib/data/stocks";
import { formatINR } from "../../lib/utils/formatters";
import { soundManager } from "../../lib/utils/sound";
import {
  Search,
  TrendingUp,
  Sliders,
  PieChart,
  History,
  Activity,
  Target,
  Settings,
  PlusCircle,
  RefreshCw,
  Volume2,
  VolumeX,
  Keyboard,
  ArrowRight,
  RotateCcw,
  Sparkles,
  GraduationCap,
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddFunds?: () => void;
  onOpenRebalance?: () => void;
  onOpenShortcuts?: () => void;
  onTriggerSIP?: () => void;
  onResetDemo?: () => void;
  onToast?: (msg: string) => void;
  onOpenPitch?: () => void;
}

interface CommandItem {
  id: string;
  category: "PAGES" | "ACTIONS" | "SECURITIES";
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  badge?: string;
}

export function CommandPalette({
  isOpen,
  onClose,
  onOpenAddFunds,
  onOpenRebalance,
  onOpenShortcuts,
  onTriggerSIP,
  onResetDemo,
  onToast,
  onOpenPitch,
}: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setQuery("");
        setSelectedIndex(0);
        inputRef.current?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Global Ctrl/Cmd + K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting inside text inputs unless it's Cmd+K
      const target = e.target as HTMLElement;
      const isInput = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
          soundManager.playTick();
        }
      }

      if (e.key === "?" && !isInput && !isOpen) {
        e.preventDefault();
        onOpenShortcuts?.();
      }

      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onOpenShortcuts]);

  // Base navigation and action items
  const baseItems: CommandItem[] = useMemo(
    () => [
      // Quick Navigation
      {
        id: "nav-dash",
        category: "PAGES",
        title: "Portfolio Dashboard",
        subtitle: "Panoramic net worth & active allocations",
        icon: TrendingUp,
        action: () => router.push("/dashboard"),
      },
      {
        id: "nav-plan",
        category: "PAGES",
        title: "Investment Mandate",
        subtitle: "Preference rules and automated plan parameters",
        icon: Sliders,
        action: () => router.push("/investment-plan"),
      },
      {
        id: "nav-port",
        category: "PAGES",
        title: "Holdings & Target Drift",
        subtitle: "Variance between live weights and model targets",
        icon: PieChart,
        action: () => router.push("/portfolio"),
      },
      {
        id: "nav-mark",
        category: "PAGES",
        title: "NSE & BSE Markets",
        subtitle: "Explore Indian blue-chips across 7 sectors",
        icon: TrendingUp,
        action: () => router.push("/markets"),
      },
      {
        id: "nav-act",
        category: "PAGES",
        title: "Activity & General Ledger",
        subtitle: "Audited journal vouchers for all simulated transactions",
        icon: History,
        action: () => router.push("/activity"),
      },
      {
        id: "nav-ins",
        category: "PAGES",
        title: "Health & Scenario Insights",
        subtitle: "HHI diversification index and stress tests",
        icon: Activity,
        action: () => router.push("/insights"),
      },
      {
        id: "nav-goals",
        category: "PAGES",
        title: "Financial Milestone Goals",
        subtitle: "Target wealth tracking against life milestones",
        icon: Target,
        action: () => router.push("/goals"),
      },
      {
        id: "nav-set",
        category: "PAGES",
        title: "Platform Settings",
        subtitle: "Display preferences, notification triggers, and data control",
        icon: Settings,
        action: () => router.push("/settings"),
      },

      // Instant Actions
      {
        id: "act-pitch",
        category: "ACTIONS",
        title: "Open University Architecture & Viva Guide",
        subtitle: "Full-stack architecture, algorithms, and examiner Q&A walkthrough",
        icon: GraduationCap,
        badge: "VIVA",
        action: () => {
          onClose();
          onOpenPitch?.();
        },
      },
      {
        id: "act-funds",
        category: "ACTIONS",
        title: "Credit Demo Funds",
        subtitle: "Top up simulated cash ledger balance",
        icon: PlusCircle,
        badge: "CASH",
        action: () => onOpenAddFunds?.(),
      },
      {
        id: "act-rebalance",
        category: "ACTIONS",
        title: "Simulate Portfolio Rebalance",
        subtitle: "Evaluate weight drift and align with target mandate",
        icon: RefreshCw,
        badge: "DRIFT",
        action: () => onOpenRebalance?.(),
      },
      {
        id: "act-sip",
        category: "ACTIONS",
        title: "Execute Monthly Contribution Now",
        subtitle: "Run deterministic SIP deployment from cash ledger",
        icon: Sparkles,
        badge: "SIP",
        action: () => onTriggerSIP?.(),
      },
      {
        id: "act-sound",
        category: "ACTIONS",
        title: soundManager.isEnabled() ? "Disable Tactile Audio" : "Enable Tactile Audio",
        subtitle: "Synthesized Web Audio clicks for key financial events",
        icon: soundManager.isEnabled() ? VolumeX : Volume2,
        action: () => {
          const newState = soundManager.toggle();
          onToast?.(newState ? "Tactile audio feedback enabled." : "Audio feedback muted.");
        },
      },
      {
        id: "act-keys",
        category: "ACTIONS",
        title: "View Keyboard Shortcuts",
        subtitle: "Quick keystroke reference sheet",
        icon: Keyboard,
        action: () => onOpenShortcuts?.(),
      },
      {
        id: "act-reset",
        category: "ACTIONS",
        title: "Restore Baseline Demo State",
        subtitle: "Reset holdings and cash ledger for evaluator presentations",
        icon: RotateCcw,
        badge: "RESET",
        action: () => onResetDemo?.(),
      },
    ],
    [router, onOpenAddFunds, onOpenRebalance, onTriggerSIP, onOpenShortcuts, onResetDemo, onToast, onOpenPitch]
  );

  // Security items from database
  const stockItems: CommandItem[] = useMemo(
    () =>
      INDIAN_STOCKS.map((stock) => ({
        id: `stock-${stock.symbol}`,
        category: "SECURITIES",
        title: `${stock.symbol} — ${stock.name}`,
        subtitle: `${stock.sector} • LTP: ${formatINR(stock.currentPrice, { showPaise: true })} • P/E: ${stock.peRatio}`,
        badge: stock.sector,
        icon: TrendingUp,
        action: () => router.push(`/stocks/${stock.symbol}`),
      })),
    [router]
  );

  // Filtered results
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return baseItems;
    }

    const matchesBase = baseItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q))
    );

    const matchesStocks = stockItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q))
    );

    return [...matchesBase, ...matchesStocks];
  }, [query, baseItems, stockItems]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        soundManager.playTick();
        filteredItems[selectedIndex].action();
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-charcoal-950/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.16 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl border border-charcoal-300 bg-white shadow-2xl overflow-hidden"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-charcoal-200 bg-[#FBFBF8]">
          <Search className="h-4 w-4 text-charcoal-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, page, or Indian equity ticker (e.g. RELIANCE, TCS, SIP)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full py-3.5 px-3 bg-transparent text-xs font-sans text-charcoal-950 placeholder:text-charcoal-400 focus:outline-none"
          />
          <kbd className="font-mono text-[10px] text-charcoal-500 bg-[#F4F4EE] border border-charcoal-200 px-1.5 py-0.5 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[360px] overflow-y-auto divide-y divide-charcoal-100 p-1">
          {filteredItems.map((item, index) => {
            const Icon = item.icon;
            const isSelected = index === selectedIndex;

            return (
              <div
                key={item.id}
                onClick={() => {
                  soundManager.playTick();
                  item.action();
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                  isSelected ? "bg-[#F4F4EE]" : "hover:bg-[#FBFBF8]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-7 w-7 rounded flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? "bg-forest-800 text-white border-forest-900"
                        : "bg-white text-charcoal-700 border-charcoal-200"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-xs font-semibold text-charcoal-950">
                        {item.title}
                      </span>
                      {item.badge && (
                        <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 rounded bg-forest-50 text-forest-800 border border-forest-200">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.subtitle && (
                      <p className="font-sans text-[11px] text-charcoal-500">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 font-mono text-[10px] text-charcoal-400">
                  {isSelected && (
                    <span className="flex items-center gap-0.5 text-forest-800 font-medium">
                      <span>Select</span>
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="p-8 text-center text-xs text-charcoal-500">
              No matching commands or securities found for &ldquo;{query}&rdquo;.
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2 border-t border-charcoal-200 bg-[#FBFBF8] flex items-center justify-between text-[11px] font-mono text-charcoal-500">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span>NIVARAN Global Command Bar</span>
        </div>
      </motion.div>
    </div>
  );
}
