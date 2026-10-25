"use client";

import React, { useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { useApp } from "../../context/AppContext";
import { formatDate } from "../../lib/utils/formatters";
import {
  Bell,
  Check,
  Trash2,
  Sliders,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
  Clock,
} from "lucide-react";

export default function NotificationsPage() {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useApp();

  const [filterUnread, setFilterUnread] = useState(false);

  const displayed = filterUnread
    ? notifications.filter((n) => !n.read)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotifMeta = (type: string) => {
    switch (type) {
      case "PLAN":
        return { label: "MANDATE SIP", icon: Sliders };
      case "REBALANCE":
        return { label: "PORTFOLIO DRIFT", icon: RefreshCw };
      case "MARKET":
        return { label: "MARKET MOVEMENT", icon: TrendingUp };
      default:
        return { label: "SYSTEM NOTICE", icon: ShieldCheck };
    }
  };

  return (
    <AppShell>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Editorial Masthead */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-charcoal-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono tracking-widest uppercase text-forest-700 bg-forest-50 px-2 py-0.5 rounded border border-forest-100">
                AUDIT LOG
              </span>
              <span className="text-[10px] font-mono text-charcoal-400">
                DISPATCHES
              </span>
            </div>
            <h1 className="font-serif text-3xl font-normal tracking-tight text-charcoal-950">
              System Notices & Dispatches
            </h1>
            <p className="text-xs text-charcoal-600 mt-1">
              Audit alerts for simulated SIP triggers, portfolio rebalancing events, and safety notices
            </p>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-charcoal-300 bg-white text-xs font-medium text-charcoal-800 hover:bg-[#F4F4EE] transition-colors shadow-xs"
              >
                <Check className="h-3.5 w-3.5 text-forest-700" />
                <span>Mark All Read</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-charcoal-200 text-xs font-medium text-charcoal-600 hover:text-[#B82B2B] hover:border-red-200 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-1 font-mono text-xs">
          <button
            onClick={() => setFilterUnread(false)}
            className={`px-3 py-1.5 rounded text-[11px] transition-colors ${
              !filterUnread
                ? "bg-charcoal-900 text-white font-medium"
                : "bg-[#F4F4EE] text-charcoal-600 hover:text-charcoal-950 border border-charcoal-200"
            }`}
          >
            All Notices ({notifications.length})
          </button>
          <button
            onClick={() => setFilterUnread(true)}
            className={`px-3 py-1.5 rounded text-[11px] transition-colors ${
              filterUnread
                ? "bg-charcoal-900 text-white font-medium"
                : "bg-[#F4F4EE] text-charcoal-600 hover:text-charcoal-950 border border-charcoal-200"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications Ledger List */}
        <div className="space-y-3">
          {displayed.map((n) => {
            const meta = getNotifMeta(n.type);
            const Icon = meta.icon;

            return (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`border p-5 transition-colors cursor-pointer group ${
                  !n.read
                    ? "bg-white border-forest-600/40 shadow-xs"
                    : "bg-[#FBFBF8] border-charcoal-200/80 hover:border-charcoal-300"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="h-8 w-8 rounded bg-[#F4F4EE] flex items-center justify-center shrink-0 border border-charcoal-200 mt-0.5 text-forest-800">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-charcoal-500 bg-[#F4F4EE] px-1.5 py-0.5 rounded border border-charcoal-200">
                          {meta.label}
                        </span>
                        <h3 className="text-sm font-semibold text-charcoal-950 group-hover:text-forest-800 transition-colors">
                          {n.title}
                        </h3>
                      </div>
                      <p className="text-xs text-charcoal-600 leading-relaxed max-w-2xl">
                        {n.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-[11px] text-charcoal-400">
                      {formatDate(n.date, { showTime: true })}
                    </span>
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-forest-700"></span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {displayed.length === 0 && (
            <div className="border border-charcoal-200 bg-white p-12 text-center text-xs text-charcoal-500">
              No audit notices found in this view.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
