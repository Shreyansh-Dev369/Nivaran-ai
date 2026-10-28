"use client";

import React, { useEffect, useState } from "react";

/**
 * Scroll Progress Indicator
 * Adheres to Modern Web Guidance:
 * - Purely decorative visual progress bar sets aria-hidden="true"
 * - Supports modern animation-timeline: scroll() with progressive JS scroll fallback
 * - Respects prefers-reduced-motion
 */
export function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [supportsCssScrollTimeline, setSupportsCssScrollTimeline] = useState(true);

  useEffect(() => {
    // Check if browser natively supports animation-timeline: scroll()
    const supportsScrollTimeline =
      typeof CSS !== "undefined" &&
      CSS.supports &&
      CSS.supports("animation-timeline", "scroll()");

    setSupportsCssScrollTimeline(supportsScrollTimeline);

    if (!supportsScrollTimeline) {
      const handleScroll = () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight <= 0) {
          setScrollProgress(0);
          return;
        }
        const currentProgress = window.scrollY / totalHeight;
        setScrollProgress(Math.min(1, Math.max(0, currentProgress)));
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();

      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div
      aria-hidden="true"
      className="scroll-progress-bar"
      style={
        !supportsCssScrollTimeline
          ? { transform: `scaleX(${scrollProgress})` }
          : undefined
      }
    />
  );
}
