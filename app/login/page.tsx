"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import { BrandLogo } from "../../components/ui/BrandLogo";
import { DemoBadge } from "../../components/ui/DemoBadge";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useApp();

  const [email, setEmail] = useState("arjun.sharma@example.com");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      signIn(email, email.split("@")[0]);
      router.push("/dashboard");
    }, 300);
  };

  const handleQuickDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      signIn("arjun.sharma@example.com", "Arjun Sharma");
      router.push("/dashboard");
    }, 200);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#EDF6F2] px-6 sm:px-8 py-16 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4 text-center">
        <div className="flex justify-center">
          <BrandLogo size="lg" />
        </div>
        <div className="space-y-1">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#071912] font-semibold">
            Sign in to your simulated account
          </h2>
          <p className="text-xs text-[#587F6E]">
            Access your Indian equity portfolio ledger or use the one-click evaluator login.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-[#D3E5DC] bg-white p-7 sm:p-8 space-y-6 shadow-xl">
          {/* Quick Evaluator Login */}
          <button
            type="button"
            onClick={handleQuickDemo}
            disabled={isLoading}
            className="w-full flex items-center justify-between p-4 rounded-2xl border border-[#00E599]/40 bg-[#E6F9F1] hover:bg-[#D4F5E7] transition-all text-left group cursor-pointer shadow-xs"
          >
            <div className="space-y-0.5">
              <span className="font-mono text-xs uppercase tracking-wider font-bold text-[#0A1D16] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#00A86B]" />
                Quick Evaluator Login
              </span>
              <p className="text-[11px] font-sans text-[#587F6E]">
                Arjun Sharma (₹12.48L simulated portfolio • 5 Blue-Chips)
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-[#0A1D16] group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#D3E5DC] w-full"></div>
            <span className="bg-white px-3 text-[10px] font-mono text-[#587F6E] uppercase tracking-widest">
              Or Manual Sign-In
            </span>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-mono text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-[#071912]">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full rounded-2xl border border-[#D3E5DC] bg-[#EDF6F2]/40 px-3.5 py-2.5 text-xs text-[#071912] focus:bg-white focus:border-[#0A1D16] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold text-[#071912]">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="font-mono text-[10px] text-[#587F6E] hover:text-[#0A1D16] underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-2xl border border-[#D3E5DC] bg-[#EDF6F2]/40 px-3.5 py-2.5 pr-10 text-xs text-[#071912] focus:bg-white focus:border-[#0A1D16] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#587F6E] hover:text-[#071912]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#D3E5DC] accent-[#00E599]"
                />
                <span className="text-[11px] text-[#587F6E]">Remember evaluation session</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full bg-[#0A1D16] hover:bg-[#122E23] text-[#00E599] font-mono text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <span>{isLoading ? "Signing In..." : "Sign In to Platform"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          <div className="pt-2 border-t border-[#D3E5DC] text-center text-xs text-[#587F6E]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-[#0A1D16] underline">
              Create simulated account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
