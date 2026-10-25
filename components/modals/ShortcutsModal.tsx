"use client";

import React from "react";
import { motion } from "motion/react";
import { X, Keyboard, Command } from "lucide-react";

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "⌘ / Ctrl + K", description: "Open Command Palette & Stock Search" },
    { key: "?", description: "Open this Keyboard Shortcuts cheat sheet" },
    { key: "Esc", description: "Close any active modal, dialog, or drawer" },
    { key: "↑ / ↓", description: "Navigate list items in Command Palette" },
    { key: "Enter", description: "Execute selected command or open security" },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard Shortcuts"
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-950/60 p-4 backdrop-blur-xs"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-md border border-charcoal-200 bg-white p-6 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-charcoal-200">
          <div className="flex items-center gap-2">
            <Keyboard className="h-4 w-4 text-forest-800" />
            <h3 className="font-serif text-lg font-normal text-charcoal-950">
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-charcoal-400 hover:text-charcoal-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="divide-y divide-charcoal-100 text-xs font-sans">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2.5">
              <span className="text-charcoal-700">{s.description}</span>
              <kbd className="font-mono text-[11px] font-semibold text-charcoal-900 bg-[#F4F4EE] border border-charcoal-300 px-2 py-0.5 rounded shadow-2xs">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-charcoal-900 text-xs font-medium text-white hover:bg-black transition-colors"
          >
            Dismiss
          </button>
        </div>
      </motion.div>
    </div>
  );
}
