"use client";

import React, { useState, useEffect, useRef } from "react";
import { soundManager } from "../../lib/utils/sound";
import {
  Terminal as TerminalIcon,
  ChevronUp,
  ChevronDown,
  Trash2,
  Copy,
  Check,
  Pause,
  Play,
  Activity,
  Layers,
} from "lucide-react";

interface LogEntry {
  id: string;
  time: string;
  type: "EXECUTION" | "DRIFT" | "AUDIT" | "LEDGER";
  message: string;
}

const INITIAL_LOGS: LogEntry[] = [
  { id: "1", time: "23:40:02", type: "AUDIT", message: "FastAPI persistent connection verified via SQLite/PostgreSQL bridge." },
  { id: "2", time: "23:40:05", type: "EXECUTION", message: "Rule-based order matching: 12 sh RELIANCE allocated @ ₹2,945.60 on NSE." },
  { id: "3", time: "23:40:08", type: "DRIFT", message: "Continuous drift monitoring: 5 active holdings within ±5% MPT tolerance." },
  { id: "4", time: "23:40:12", type: "LEDGER", message: "Double-entry settlement voucher #NVR-2026-NSE-08492 signed with SHA-256." },
  { id: "5", time: "23:40:15", type: "EXECUTION", message: "Paise precision check: 2,500,000 paise split without remainder loss." },
];

export function LiveExecutionTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [copied, setCopied] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused) return;

    const streamTicker = [
      { type: "DRIFT" as const, text: "Drift check: TCS current weight 22.4% vs target 22.0% (Δ +0.4%). Normal." },
      { type: "EXECUTION" as const, text: "Simulated tick: HDFCBANK 18 sh valued at ₹28,989 (NSE book depth 8,000 sh)." },
      { type: "AUDIT" as const, text: "Concentration audit: Max single-stock cap 24.2% ≤ 25.0% ceiling. Compliant." },
      { type: "LEDGER" as const, text: "Journal entry validated: Debit DEMO_PORTFOLIO, Credit CASH_RESERVE." },
    ];

    let count = 6;
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      const sample = streamTicker[Math.floor(Math.random() * streamTicker.length)];

      setLogs((prev) => [
        ...prev.slice(-30),
        {
          id: String(count++),
          time: timeStr,
          type: sample.type,
          message: sample.text,
        },
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleCopyLogs = () => {
    soundManager.playTick();
    const text = logs.map((l) => `[${l.time}] [${l.type}] ${l.message}`).join("\n");
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    soundManager.playTick();
    setLogs([]);
  };

  return (
    <div className="fixed bottom-0 right-4 sm:right-8 z-40 max-w-lg w-full font-mono text-xs select-none">
      {/* Minimized Dock Header Button */}
      {!isOpen ? (
        <button
          onClick={() => {
            soundManager.playTick();
            setIsOpen(true);
          }}
          className="ml-auto mb-3 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A1D16] text-[#00E599] border border-[#163628] shadow-xl hover:bg-[#122E23] transition-all hover:scale-105"
        >
          <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse"></span>
          <TerminalIcon className="h-3.5 w-3.5" />
          <span className="font-bold text-[11px] tracking-wider uppercase">Live Engine Stream</span>
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
      ) : (
        /* Expanded Terminal Window */
        <div
          ref={terminalRef}
          className="bg-[#0A1D16] text-[#EDF6F2] rounded-t-2xl border-t-2 border-x-2 border-[#163628] shadow-2xl overflow-hidden flex flex-col max-h-72 animate-in slide-in-from-bottom duration-200"
        >
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#183D2D] bg-[#071711] text-[10px]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00E599] animate-ping"></span>
              <span className="font-bold uppercase tracking-wider text-[#00E599]">
                Engine Execution Stream
              </span>
              <span className="text-zinc-500">• 12ms latency</span>
            </div>

            <div className="flex items-center gap-1.5 text-zinc-400">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1 hover:text-white transition-colors"
                title={isPaused ? "Resume live streaming" : "Pause stream"}
              >
                {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
              </button>
              <button
                onClick={handleCopyLogs}
                className="p-1 hover:text-white transition-colors"
                title="Copy all logs"
              >
                {copied ? <Check className="h-3 w-3 text-[#00E599]" /> : <Copy className="h-3 w-3" />}
              </button>
              <button
                onClick={handleClear}
                className="p-1 hover:text-white transition-colors"
                title="Clear logs"
              >
                <Trash2 className="h-3 w-3" />
              </button>
              <button
                onClick={() => {
                  soundManager.playTick();
                  setIsOpen(false);
                }}
                className="p-1 hover:text-white transition-colors ml-1"
                aria-label="Minimize terminal"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Log Messages Stream */}
          <div className="p-3 overflow-y-auto space-y-1.5 font-mono text-[11px] leading-relaxed flex-1 max-h-56">
            {logs.length === 0 ? (
              <div className="text-zinc-500 italic py-4 text-center">
                Terminal stream cleared. Awaiting next simulated tick...
              </div>
            ) : (
              logs.map((log) => {
                const badgeColor =
                  log.type === "EXECUTION"
                    ? "text-[#00E599]"
                    : log.type === "DRIFT"
                    ? "text-amber-400"
                    : log.type === "LEDGER"
                    ? "text-sky-400"
                    : "text-zinc-400";

                return (
                  <div key={log.id} className="flex items-start gap-2 text-zinc-300">
                    <span className="text-zinc-500 shrink-0 select-none">[{log.time}]</span>
                    <span className={`font-bold shrink-0 ${badgeColor}`}>[{log.type}]</span>
                    <span className="break-all">{log.message}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
