"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import { BrandLogo } from "../../components/ui/BrandLogo";
import {
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useApp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("Please acknowledge the academic simulation terms.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      signUp(name, email);
      router.push("/onboarding");
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-ivory px-6 sm:px-8 py-16 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4 text-center">
        <div className="flex justify-center">
          <BrandLogo size="lg" />
        </div>
        <div className="space-y-1">
          <h2 className="font-serif text-2xl sm:text-3xl text-ink-950 font-normal">
            Create an investor profile
          </h2>
          <p className="text-xs text-ink-500">
            Configure preference-driven automated equity investing in Indian markets.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="border border-hairline bg-paper p-7 sm:p-8 space-y-5">
          {error && (
            <div className="border border-loss/20 bg-loss-bg p-3 text-xs font-mono text-loss">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block font-mono uppercase tracking-wider text-ink-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Priya Patel"
                required
                className="w-full border border-hairline bg-ivory px-3 py-2 text-xs text-ink-950 focus:border-pine-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono uppercase tracking-wider text-ink-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@example.com"
                required
                className="w-full border border-hairline bg-ivory px-3 py-2 text-xs text-ink-950 focus:border-pine-900 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-mono uppercase tracking-wider text-ink-700">
                  Password
                </label>
                {password && (
                  <span className="font-mono text-[10px] text-ink-500 uppercase">
                    Strength:{" "}
                    <strong
                      className={
                        password.length < 6
                          ? "text-loss"
                          : password.length >= 10 && /[0-9]/.test(password)
                          ? "text-forest-800"
                          : "text-amber-700"
                      }
                    >
                      {password.length < 6
                        ? "Weak"
                        : password.length >= 10 && /[0-9]/.test(password)
                        ? "Strong"
                        : "Moderate"}
                    </strong>
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full border border-hairline bg-ivory px-3 py-2 pr-9 text-xs text-ink-950 focus:border-pine-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-800"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>

              {/* Password strength visual bar */}
              {password && (
                <div className="grid grid-cols-3 gap-1 pt-1.5">
                  <div
                    className={`h-1 rounded-full ${
                      password.length > 0
                        ? password.length < 6
                          ? "bg-loss"
                          : "bg-forest-800"
                        : "bg-charcoal-200"
                    }`}
                  />
                  <div
                    className={`h-1 rounded-full ${
                      password.length >= 6 ? "bg-forest-800" : "bg-charcoal-200"
                    }`}
                  />
                  <div
                    className={`h-1 rounded-full ${
                      password.length >= 10 && /[0-9]/.test(password)
                        ? "bg-forest-800"
                        : "bg-charcoal-200"
                    }`}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block font-mono uppercase tracking-wider text-ink-700 mb-1">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className="w-full border border-hairline bg-ivory px-3 py-2 text-xs text-ink-950 focus:border-pine-900 focus:outline-none"
              />
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="h-3.5 w-3.5 rounded-none border-hairline text-pine-900 mt-0.5"
                />
                <span className="text-[11px] text-ink-600 leading-snug">
                  I understand that NIVARAN is an academic software demonstration operating with simulated demo capital, sample Indian market approximations, and zero real money execution.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-pine-900 text-ivory text-xs font-mono uppercase tracking-wider hover:bg-pine-950 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Initializing...</span>
              ) : (
                <>
                  <span>Create Account & Start Onboarding</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-ink-500">
            Already possess an account?{" "}
            <Link href="/login" className="font-semibold text-pine-900 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
