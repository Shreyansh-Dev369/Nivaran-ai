"use client";

import React, { useRef, useState } from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { soundManager } from "../../lib/utils/sound";
import { Loader2 } from "lucide-react";

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger";
  magnetic?: boolean;
  isLoading?: boolean;
}

export function MagneticButton({
  children,
  variant = "primary",
  magnetic = true,
  isLoading = false,
  className = "",
  onClick,
  disabled,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!magnetic || disabled || isLoading) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Subtle magnetic deflection (max 5px)
    const deltaX = (e.clientX - centerX) * 0.16;
    const deltaY = (e.clientY - centerY) * 0.16;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    soundManager.playTick();
    if (onClick) onClick(e);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return "bg-charcoal-900 text-white hover:bg-black border border-charcoal-900";
      case "outline":
        return "bg-white text-charcoal-800 hover:bg-[#F4F4EE] border border-charcoal-300";
      case "danger":
        return "bg-[#B82B2B] text-white hover:bg-red-700 border border-red-700";
      default:
        return "bg-forest-800 text-white hover:bg-forest-900 border border-forest-900 shadow-xs";
    }
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      disabled={disabled || isLoading}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      className={`relative inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-700 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${getVariantStyles()} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}
