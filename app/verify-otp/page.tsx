"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import { BrandLogo } from "../../components/ui/BrandLogo";
import { soundManager } from "../../lib/utils/sound";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Lock,
} from "lucide-react";

export default function VerifyOtpPage() {
  const router = useRouter();
  const { showToast, signIn } = useApp();

  const DEMO_OTP = "882941";
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    setError("");
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    soundManager.playTick();

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pasted)) return;

    const chars = pasted.slice(0, 6).split("");
    const newDigits = [...digits];
    chars.forEach((c, idx) => {
      newDigits[idx] = c;
    });
    setDigits(newDigits);
    soundManager.playTick();

    const focusIdx = Math.min(chars.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const code = digits.join("");

    if (code.length < 6) {
      setError("Please enter all 6 digits of the authentication token.");
      soundManager.playNotice();
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (code === DEMO_OTP || code === "123456" || code === "999999") {
        setIsSuccess(true);
        soundManager.playSuccess();
        showToast({
          type: "success",
          title: "Simulated KYC Token Verified",
          message: "Authentication successful. Accessing simulated investment portfolio...",
        });
        setTimeout(() => {
          signIn("arjun.sharma@example.com", "Arjun Sharma");
          router.push("/dashboard");
        }, 1000);
      } else {
        setIsLoading(false);
        setError(`Invalid token. For this college demonstration, use demo code: ${DEMO_OTP}`);
        soundManager.playNotice();
      }
    }, 700);
  };

  const handleAutoFill = () => {
    const chars = DEMO_OTP.split("");
    setDigits(chars);
    setError("");
    soundManager.playTick();
    inputRefs.current[5]?.focus();
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    setError("");
    soundManager.playSuccess();
    showToast({
      type: "info",
      title: "New Token Dispatched",
      message: `Simulated SMS/Email token re-issued: ${DEMO_OTP}`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-ivory px-6 sm:px-8 py-16 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4 text-center">
        <div className="flex justify-center">
          <BrandLogo size="lg" />
        </div>
        <div className="space-y-1">
          <h2 className="font-serif text-2xl sm:text-3xl text-ink-950 font-normal">
            Simulated 2-Factor Authentication
          </h2>
          <p className="text-xs text-ink-500 font-sans">
            Verify your simulated login session via demo SMS token or one-click verification.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="border border-hairline bg-paper p-7 sm:p-8 space-y-6">
          {/* Quick Demo Pre-fill Pill */}
          <div className="p-3 bg-sage-50 border border-pine-900/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-pine-900 shrink-0" />
              <span className="font-mono text-ink-800">
                Demo Code: <strong className="text-pine-950 font-bold">{DEMO_OTP}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={handleAutoFill}
              className="font-mono text-[10px] uppercase font-bold text-pine-900 hover:underline"
            >
              Auto-Fill
            </button>
          </div>

          {error && (
            <div className="border border-loss/20 bg-loss-bg p-3 text-xs font-mono text-loss">
              {error}
            </div>
          )}

          {isSuccess && (
            <div className="border border-forest-200 bg-forest-50 p-4 text-xs font-mono text-forest-900 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-forest-700" />
              <span>Identity verified. Redirecting to portfolio canvas...</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-center font-mono text-[10px] uppercase tracking-wider text-ink-500 mb-3">
                Enter 6-Digit Simulated Token
              </label>

              {/* Segmented OTP Input Grid */}
              <div
                className="grid grid-cols-6 gap-2"
                onPaste={handlePaste}
              >
                {digits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    disabled={isLoading || isSuccess}
                    className="h-12 w-full text-center font-mono text-lg font-bold text-ink-950 border border-hairline bg-ivory focus:border-pine-900 focus:bg-white focus:outline-none transition-colors"
                    aria-label={`Digit ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full py-2.5 bg-pine-900 text-ivory text-xs font-mono uppercase tracking-wider hover:bg-pine-950 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Validating Token...</span>
              ) : (
                <>
                  <span>Verify Identity & Enter</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Resend & Return Controls */}
          <div className="pt-2 flex items-center justify-between text-xs font-sans text-ink-600 border-t border-hairline">
            <div>
              {resendTimer > 0 ? (
                <span className="font-mono text-[11px] text-ink-400">
                  Resend token in {resendTimer}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-mono text-xs font-semibold text-pine-900 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Resend Token</span>
                </button>
              )}
            </div>

            <Link
              href="/login"
              className="text-xs text-ink-500 hover:text-ink-950 font-medium"
            >
              &larr; Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
