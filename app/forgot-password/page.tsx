"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "../../components/ui/BrandLogo";
import { ArrowLeft, Check, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-ivory px-6 sm:px-8 py-16 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4 text-center">
        <div className="flex justify-center">
          <BrandLogo size="lg" />
        </div>
        <div className="space-y-1">
          <h2 className="font-serif text-2xl sm:text-3xl text-ink-950 font-normal">
            Account Access Recovery
          </h2>
          <p className="text-xs text-ink-500">
            Simulated password recovery for demonstration environments.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="border border-hairline bg-paper p-7 sm:p-8 space-y-5">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="border border-hairline bg-ivory p-3.5 space-y-1 font-mono text-[11px] text-ink-600">
                <span className="font-bold text-pine-900 uppercase tracking-wider block">
                  Demonstration Protocol
                </span>
                <p>
                  You can sign into any demo profile immediately using password <code className="bg-sage-100 px-1 py-0.5 text-pine-900 font-bold">demo1234</code>.
                </p>
              </div>

              <div>
                <label className="block font-mono uppercase tracking-wider text-ink-700 mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full border border-hairline bg-ivory py-2 px-3 pl-8 text-xs text-ink-950 focus:border-pine-900 focus:outline-none"
                  />
                  <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-400" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-pine-900 text-ivory text-xs font-mono uppercase tracking-wider hover:bg-pine-950 transition-colors"
              >
                Send Simulated Recovery Token
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4 py-2">
              <div className="mx-auto h-10 w-10 bg-sage-100 border border-sage-200 text-pine-900 flex items-center justify-center">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-xl text-ink-950 font-normal">
                Recovery Dispatch Simulated
              </h3>
              <p className="text-xs text-ink-600 leading-relaxed font-sans">
                A simulated reset token has been dispatched for <strong className="text-ink-900">{email}</strong>. For demonstration evaluation, test the OTP verification interface below.
              </p>
              <div className="pt-2">
                <Link
                  href="/verify-otp"
                  className="w-full py-2.5 bg-pine-900 text-ivory text-xs font-mono uppercase tracking-wider hover:bg-pine-950 transition-colors inline-block font-semibold"
                >
                  Verify Simulated 6-Digit OTP Token
                </Link>
              </div>
            </div>
          )}

          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-pine-900 hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
