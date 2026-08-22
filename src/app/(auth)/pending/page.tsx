"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggleCompact } from "@/components/ui/ThemeToggle";
import { Spinner, CheckCircle, Warning, Clock, Phone, SignOut } from "@phosphor-icons/react";

export default function PendingApprovalPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | "error">("pending");

  useEffect(() => {
    const checkApproval = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        const { data: profile } = await supabase
          .from("users")
          .select("approval_status")
          .eq("id", user.id)
          .single();

        if (profile) {
          setStatus(profile.approval_status as "pending" | "approved" | "rejected");
          if (profile.approval_status === "approved") {
            router.push("/dashboard");
            return;
          }
        }
      } catch (error) {
        console.error("Error checking approval:", error);
        setStatus("error");
      } finally {
        setChecking(false);
      }
    };

    checkApproval();

    // Poll every 10 seconds
    const interval = setInterval(checkApproval, 10000);

    return () => clearInterval(interval);
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in">
        <div className="text-center p-8 animate-scale-in">
          <div className="flex justify-end mb-6">
            <ThemeToggleCompact />
          </div>
          <div className="inline-flex items-center justify-center w-12 h-12 mb-4" style={{ border: "3px solid var(--border-subtle)", borderTopColor: "var(--accent)", borderRadius: "50%" }}>
            <Spinner className="h-6 w-6 animate-spin" style={{ color: "var(--accent)" }} />
          </div>
          <p style={{ color: "var(--text-tertiary)" }}>Checking approval status...</p>
        </div>
      </div>
    );
  }

  if (status === "approved") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in">
        <div className="text-center p-8 animate-scale-in">
          <div className="flex justify-end mb-6">
            <ThemeToggleCompact />
          </div>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: "var(--success)", boxShadow: "var(--neu-raised-sm)" }}>
            <CheckCircle className="h-8 w-8" style={{ color: "white" }} />
          </div>
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Approved!</h1>
          <p style={{ color: "var(--text-tertiary)" }}>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in">
        <div className="text-center p-8 animate-scale-in">
          <div className="flex justify-end mb-6">
            <ThemeToggleCompact />
          </div>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: "var(--danger)", boxShadow: "var(--neu-raised-sm)" }}>
            <Warning className="h-8 w-8" style={{ color: "white" }} />
          </div>
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--danger)" }}>Account Rejected</h1>
          <p className="mb-6" style={{ color: "var(--text-tertiary)" }}>Your account registration has been rejected. Please contact admin.</p>
          <a href="/api/auth/logout" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium" style={{ background: "var(--accent)", color: "white", boxShadow: "var(--neu-raised-sm)" }}>
            <SignOut className="h-5 w-5" />
            <span>Logout</span>
          </a>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in">
        <div className="text-center p-8 animate-scale-in">
          <div className="flex justify-end mb-6">
            <ThemeToggleCompact />
          </div>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: "var(--warning)", boxShadow: "var(--neu-raised-sm)" }}>
            <Clock className="h-8 w-8" style={{ color: "white" }} />
          </div>
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Error Checking Status</h1>
          <p className="mb-6" style={{ color: "var(--text-tertiary)" }}>Unable to verify approval status. Please try again later.</p>
          <button onClick={() => window.location.reload()} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium" style={{ background: "var(--accent)", color: "white", boxShadow: "var(--neu-raised-sm)" }}>
            <Spinner className="h-5 w-5" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  // status === "pending"
  return (
    <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-8">
          <ThemeToggleCompact />
        </div>
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6" style={{ background: "var(--accent)", boxShadow: "var(--neu-raised-sm)" }}>
            <span className="text-2xl font-bold" style={{ color: "white" }}>N</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>EOD-Ops</h1>
          <p className="mt-2" style={{ color: "var(--text-tertiary)" }}>Event Operations Dashboard</p>
        </div>
        <div className="text-center p-8 animate-slide-in-right">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ background: "var(--accent-soft)", boxShadow: "var(--neu-raised-sm)" }}>
            <Clock className="h-8 w-8" style={{ color: "var(--accent)" }} />
          </div>
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Account Pending Approval</h1>
          <p className="mb-8" style={{ color: "var(--text-tertiary)" }}>
            Your account has been registered but is awaiting admin approval. This page will auto-refresh every 10 seconds.
          </p>
          <div className="flex flex-col gap-3">
            <a href="tel:+0009947180" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium" style={{ background: "var(--accent)", color: "white", boxShadow: "var(--neu-raised-sm)" }}>
              <Phone className="h-5 w-5" />
              <span>Call Admin</span>
            </a>
            <a href="/api/auth/logout" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium" style={{ background: "var(--surface-raised)", color: "var(--text-primary)", border: "1px solid var(--border-subtle)", boxShadow: "var(--neu-raised-sm)" }}>
              <SignOut className="h-5 w-5" />
              <span>Logout</span>
            </a>
          </div>
          <div className="flex items-center justify-center gap-2 mt-8" style={{ color: "var(--text-tertiary)" }}>
            <Clock className="h-4 w-4" />
            <span className="text-sm">Auto-checking every 10 seconds...</span>
          </div>
        </div>
      </div>
    </div>
  );
}