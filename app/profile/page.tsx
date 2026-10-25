"use client";

import React, { useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { useApp } from "../../context/AppContext";
import { formatDate } from "../../lib/utils/formatters";
import {
  User,
  ShieldCheck,
  Mail,
  Phone,
  FileCheck,
  Save,
  CheckCircle2,
} from "lucide-react";

export default function ProfilePage() {
  const { user, updateProfile, plan } = useApp();

  const [name, setName] = useState(user?.name || "Arjun Sharma");
  const [email, setEmail] = useState(user?.email || "arjun.sharma@example.com");
  const [phone, setPhone] = useState(user?.phone || "+91 98765 43210");
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email, phone });
    setFeedback("Investor profile particulars successfully recorded.");
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto font-sans">
        {/* Editorial Masthead */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D3E5DC]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#00A86B] bg-[#E6F9F1] px-2.5 py-0.5 rounded-full border border-[#00A86B]/20 font-bold">
                ACCOUNT LEDGER
              </span>
              <span className="text-[10px] font-mono text-[#587F6E]">
                DEMO SUITABILITY
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#071912]">
              Investor Profile & Identification
            </h1>
            <p className="text-xs text-[#587F6E] mt-0.5">
              Personal investor tier records, simulated KYC status, and investor suitability preferences
            </p>
          </div>
        </div>

        {feedback && (
          <div className="rounded-2xl border border-[#00E599]/40 bg-[#E6F9F1] p-4 text-xs text-[#0A1D16] flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#00A86B] shrink-0" />
            <span className="font-semibold">{feedback}</span>
          </div>
        )}

        {/* Profile Card & KYC Verification Canvas */}
        <div className="rounded-3xl border border-[#D3E5DC] bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#D3E5DC]">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-[#0A1D16] text-[#00E599] font-mono font-bold text-2xl flex items-center justify-center border border-[#163628] shadow-sm">
                {name.charAt(0)}
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-[#071912]">
                  {name}
                </h2>
                <p className="text-xs text-[#587F6E] font-mono mt-0.5">
                  Client Identifier: {user?.id || "usr_demo_8829"} • Member since {user?.joinedDate || "June 2026"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#E6F9F1] border border-[#00A86B]/30 px-3.5 py-1.5 rounded-full text-xs font-mono text-[#00A86B] font-bold">
              <ShieldCheck className="h-4 w-4" />
              <span>{user?.investorTier || "Tier 1 Demo Verified"}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#071912]">Legal Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-[#D3E5DC] bg-[#EDF6F2]/40 p-2.5 text-xs text-[#071912] focus:bg-white focus:border-[#0A1D16] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#071912]">Email Contact</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-[#D3E5DC] bg-[#EDF6F2]/40 p-2.5 text-xs text-[#071912] focus:bg-white focus:border-[#0A1D16] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#071912]">Phone (Simulated SMS Alerts)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-2xl border border-[#D3E5DC] bg-[#EDF6F2]/40 p-2.5 text-xs text-[#071912] focus:bg-white focus:border-[#0A1D16] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#071912]">Simulated PAN Number</label>
                <input
                  type="text"
                  disabled
                  value={user?.panMasked || "ABCDE****F"}
                  className="w-full rounded-2xl border border-[#D3E5DC] bg-[#EDF6F2]/70 p-2.5 text-xs font-mono text-[#587F6E] cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#0A1D16] text-[#00E599] font-mono text-xs font-bold hover:bg-[#122E23] transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Save Particulars</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
