"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import { AppSidebar } from "./AppSidebar";
import { AppNavbar } from "./AppNavbar";
import { MobileBottomNav } from "./MobileBottomNav";
import { PageTransition } from "../ui/PageTransition";
import { ScrollProgressBar } from "../ui/ScrollProgressBar";
import { LiveExecutionTerminal } from "../ui/LiveExecutionTerminal";
import Link from "next/link";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const { isAuthenticated } = useApp();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EDF6F2] p-4 font-mono text-xs text-[#587F6E]">
        Authenticating simulated session...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#EDF6F2] text-[#071912] font-sans max-w-full overflow-x-hidden">
      <ScrollProgressBar />
      {/* Top Demo Context Bar - Sleek Dark Obsidian with Live Mint Spark */}
      <div className="bg-[#0A1D16] text-[#EDF6F2] text-[10px] font-mono uppercase tracking-wider py-1.5 px-4 sm:px-6 flex items-center justify-between border-b border-[#14352A] shrink-0">
        <div className="flex items-center gap-2 truncate">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00E599] animate-pulse shrink-0"></span>
          <span className="truncate">
            NIVARAN Academic Evaluation Engine • Simulated Indian Equities & Cash Ledger
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-3">
          <span className="hidden md:inline-flex items-center gap-1.5 text-[10px] font-mono text-[#00E599] bg-[#14352A] px-2 py-0.5 rounded-md">
            <span className="h-1 w-1 rounded-full bg-[#00E599]"></span>
            FastAPI + PostgreSQL / SQLite Persistent
          </span>
          <Link
            href="/safety"
            className="text-[#00E599] hover:underline underline-offset-2 shrink-0 hidden sm:inline font-semibold"
          >
            Demo Disclosures
          </Link>
        </div>
      </div>

      <div className="flex flex-1 min-h-[calc(100vh-32px)] min-w-0">
        {/* Desktop Sidebar */}
        <AppSidebar />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 min-w-0 overflow-x-hidden">
          <AppNavbar />

          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl w-full mx-auto space-y-6 sm:space-y-8 min-w-0 pb-28 md:pb-10">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>

      {/* Mobile Floating Bottom Dock */}
      <MobileBottomNav />

      {/* Real-Time Engine Audit Terminal Stream */}
      <LiveExecutionTerminal />
    </div>
  );
}
