"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "../../../components/ui/BrandLogo";
import { useApp } from "../../../context/AppContext";
import { soundManager } from "../../../lib/utils/sound";
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Building,
  Sparkles,
} from "lucide-react";

export function InviteClient({ code }: { code: string }) {
  const router = useRouter();
  const { signIn, showToast } = useApp();

  const [status, setStatus] = useState<"PENDING" | "ACCEPTED" | "DECLINED">("PENDING");
  const [isLoading, setIsLoading] = useState(false);

  const invitation = {
    inviterName: "Devansh Mehta",
    inviterRole: "Senior Portfolio Strategist",
    workspaceName: "Alpha Capital Advisory Mandate",
    targetAllocation: "Balanced Indian Blue-Chip Equities",
    role: "Co-Investor & Audit Viewer",
    expiresIn: "6 Days Remaining",
  };

  const handleAccept = () => {
    setIsLoading(true);
    soundManager.playSuccess();

    setTimeout(() => {
      setStatus("ACCEPTED");
      showToast({
        type: "success",
        title: "Workspace Invitation Accepted",
        message: `Welcome to ${invitation.workspaceName}. Accessing portfolio workspace...`,
      });

      setTimeout(() => {
        signIn("arjun.sharma@example.com", "Arjun Sharma");
        router.push("/dashboard");
      }, 1200);
    }, 600);
  };

  const handleDecline = () => {
    setStatus("DECLINED");
    soundManager.playNotice();
    showToast({
      type: "info",
      title: "Invitation Declined",
      message: "The simulated advisory invitation has been declined.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-ivory px-6 sm:px-8 py-16 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4 text-center">
        <div className="flex justify-center">
          <BrandLogo size="lg" />
        </div>
        <div className="space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-forest-800 bg-forest-50 px-2 py-0.5 rounded border border-forest-100">
            SIMULATED ADVISORY INVITATION
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink-950 font-normal mt-2">
            You&apos;ve Been Invited to Collaborate
          </h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="border border-hairline bg-paper p-7 sm:p-8 space-y-6">
          {status === "PENDING" && (
            <>
              {/* Inviter Badge */}
              <div className="p-4 bg-white border border-hairline space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-pine-900 text-ivory font-serif text-lg font-semibold flex items-center justify-center shrink-0">
                    DM
                  </div>
                  <div>
                    <h3 className="font-sans text-xs font-bold text-ink-950">
                      {invitation.inviterName}
                    </h3>
                    <p className="text-[11px] text-ink-500 font-sans">
                      {invitation.inviterRole}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-hairline divide-y divide-hairline text-xs font-sans">
                  <div className="flex justify-between py-1.5">
                    <span className="text-ink-500">Workspace</span>
                    <span className="font-semibold text-ink-900">{invitation.workspaceName}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-ink-500">Strategy Focus</span>
                    <span className="font-medium text-ink-800">{invitation.targetAllocation}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-ink-500">Assigned Role</span>
                    <span className="font-mono text-[11px] font-bold text-pine-900">
                      {invitation.role}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-ink-500">Invite Token</span>
                    <span className="font-mono text-[11px] text-ink-500">{code}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleAccept}
                  disabled={isLoading}
                  className="flex-1 py-2.5 bg-pine-900 text-ivory text-xs font-mono uppercase tracking-wider hover:bg-pine-950 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  {isLoading ? (
                    <span>Joining Workspace...</span>
                  ) : (
                    <>
                      <span>Accept Invitation</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleDecline}
                  disabled={isLoading}
                  className="px-4 py-2.5 border border-hairline bg-white text-ink-700 text-xs font-mono uppercase tracking-wider hover:bg-paper-subtle transition-colors"
                >
                  Decline
                </button>
              </div>
            </>
          )}

          {status === "ACCEPTED" && (
            <div className="p-6 bg-forest-50 border border-forest-200 text-center space-y-3">
              <CheckCircle2 className="h-8 w-8 text-forest-700 mx-auto" />
              <h3 className="font-serif text-xl font-normal text-charcoal-950">
                Invitation Accepted
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                You are now linked to {invitation.workspaceName}. Loading your simulated mandate and live allocations...
              </p>
            </div>
          )}

          {status === "DECLINED" && (
            <div className="p-6 bg-[#FFFBFB] border border-red-200 text-center space-y-3">
              <XCircle className="h-8 w-8 text-[#B82B2B] mx-auto" />
              <h3 className="font-serif text-xl font-normal text-charcoal-950">
                Invitation Declined
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                The invitation token has been dismissed. You can return to your personal dashboard at any time.
              </p>
              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-charcoal-900 text-white text-xs font-mono uppercase"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          )}

          <div className="pt-2 text-center text-xs text-ink-500 font-sans border-t border-hairline">
            Already have a separate login?{" "}
            <Link href="/login" className="font-semibold text-pine-900 hover:underline">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
