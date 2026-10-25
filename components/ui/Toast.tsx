"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Info, AlertTriangle, AlertCircle, X } from "lucide-react";
import { soundManager } from "../../lib/utils/sound";

export interface ToastItem {
  id: string;
  type: "success" | "info" | "warning" | "error";
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const [isPaused, setIsPaused] = useState(false);
  const duration = toast.duration ?? 4500;

  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, isPaused, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-forest-700 shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-[#B82B2B] shrink-0" />;
      default:
        return <Info className="h-4 w-4 text-charcoal-700 shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case "success":
        return "border-forest-600/40 bg-white shadow-md";
      case "warning":
        return "border-amber-400 bg-white shadow-md";
      case "error":
        return "border-red-400 bg-white shadow-md";
      default:
        return "border-charcoal-300 bg-white shadow-md";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.15 } }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`pointer-events-auto relative overflow-hidden border p-4 ${getBorderColor()}`}
      role="status"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5">{getIcon()}</div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-semibold text-charcoal-950 font-sans tracking-tight">
              {toast.title}
            </h4>
            {toast.message && (
              <p className="text-[11px] text-charcoal-600 leading-relaxed font-sans">
                {toast.message}
              </p>
            )}
            {toast.action && (
              <button
                type="button"
                onClick={() => {
                  toast.action?.onClick();
                  onDismiss(toast.id);
                }}
                className="mt-1 font-mono text-[10px] font-bold text-forest-800 hover:underline uppercase tracking-wider"
              >
                {toast.action.label} &rarr;
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => onDismiss(toast.id)}
          className="p-1 text-charcoal-400 hover:text-charcoal-800 transition-colors"
          aria-label="Close notification"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Subtle hairline timer bar */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: isPaused ? undefined : "0%" }}
        transition={{ duration: duration / 1000, ease: "linear" }}
        className={`absolute bottom-0 left-0 h-[2px] ${
          toast.type === "success"
            ? "bg-forest-700"
            : toast.type === "warning"
            ? "bg-amber-600"
            : toast.type === "error"
            ? "bg-[#B82B2B]"
            : "bg-charcoal-800"
        }`}
      />
    </motion.div>
  );
}
