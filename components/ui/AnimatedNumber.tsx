"use client";

import React, { useEffect, useState, useRef } from "react";
import { formatINR, formatPercent } from "../../lib/utils/formatters";

interface AnimatedNumberProps {
  value: number;
  duration?: number; // milliseconds
  format?: "inr" | "percent" | "integer" | "decimal";
  compact?: boolean;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedNumber({
  value,
  duration = 900,
  format = "inr",
  compact = false,
  prefix = "",
  suffix = "",
  className = "",
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const startValueRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Check for reduced motion preference
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplayValue(value);
      return;
    }

    const startVal = displayValue;
    startValueRef.current = startVal;
    startTimeRef.current = null;

    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic: 1 - (1 - t)^3
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (value - startVal) * easeOut;

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  const formatted = () => {
    if (format === "inr") {
      return formatINR(displayValue, { compact });
    }
    if (format === "percent") {
      return formatPercent(displayValue);
    }
    if (format === "integer") {
      return Math.round(displayValue).toLocaleString("en-IN");
    }
    return displayValue.toFixed(2);
  };

  return (
    <span className={`tabular-nums transition-colors ${className}`}>
      {prefix}
      {formatted()}
      {suffix}
    </span>
  );
}
