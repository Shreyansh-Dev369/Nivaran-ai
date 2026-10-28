"use client";

import React, { useMemo } from "react";

interface MiniSparklineProps {
  changePercent: number;
  width?: number;
  height?: number;
  className?: string;
}

export function MiniSparkline({
  changePercent,
  width = 72,
  height = 22,
  className = "",
}: MiniSparklineProps) {
  const isPositive = changePercent >= 0;

  // Generate a deterministic 7-point curve based on changePercent
  const points = useMemo(() => {
    const pts: number[] = [];
    const count = 7;
    const sign = isPositive ? 1 : -1;
    const mag = Math.min(10, Math.abs(changePercent));

    for (let i = 0; i < count; i++) {
      const progress = i / (count - 1);
      // Trend upwards or downwards with subtle sine wave oscillation
      const oscillation = Math.sin(i * 1.5) * 1.2;
      const val = progress * mag * sign + oscillation;
      pts.push(val);
    }
    return pts;
  }, [changePercent, isPositive]);

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const svgPoints = points
    .map((val, idx) => {
      const x = (idx / (points.length - 1)) * (width - 4) + 2;
      // Invert Y coordinate so higher values are higher up
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const color = isPositive ? "#00A86B" : "#E63946";

  return (
    <div className={`inline-block select-none ${className}`} style={{ width, height }}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={svgPoints}
        />
        {/* End pulse dot */}
        {points.length > 0 && (
          <circle
            cx={svgPoints.split(" ").slice(-1)[0].split(",")[0]}
            cy={svgPoints.split(" ").slice(-1)[0].split(",")[1]}
            r="2"
            fill={color}
          />
        )}
      </svg>
    </div>
  );
}
