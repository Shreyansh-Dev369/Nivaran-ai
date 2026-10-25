"use client";

import React from "react";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-[#EAEAE2] rounded ${className}`}
    />
  );
}

// Geometric Skeleton matching the Panoramic Dashboard Net Worth Canvas
export function PortfolioSummarySkeleton() {
  return (
    <div className="border border-charcoal-200 bg-white p-5 shadow-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-charcoal-200">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Geometric Skeleton matching the Financial Area Chart
export function ChartSkeleton() {
  return (
    <div className="border border-charcoal-200 bg-white p-6 shadow-xs space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-charcoal-200">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-64" />
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-6 w-9 rounded" />
          ))}
        </div>
      </div>
      <div className="h-64 flex items-end gap-2 pt-8">
        {[30, 45, 60, 40, 75, 55, 80, 65, 90, 85, 95].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-[#EAEAE2] rounded-t"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

// Geometric Skeleton matching Holdings and Market Stock Table rows
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="border border-charcoal-200 bg-white shadow-xs overflow-hidden">
      <div className="p-4 border-b border-charcoal-200 flex justify-between items-center">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-7 w-32 rounded" />
      </div>
      <div className="divide-y divide-charcoal-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-44" />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
