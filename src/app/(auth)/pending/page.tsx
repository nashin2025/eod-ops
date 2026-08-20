"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggleCompact } from "@/components/ui/ThemeToggle";

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
      <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in" style={{ background: 'hsl(var(--background))' }}>
        <div className="text-center p-8">
          <ThemeToggleCompact />
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking approval status...</p>
        </div>
      </div>
    );
  }

  if (status === "approved") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in" style={{ background: 'hsl(var(--background))' }}>
        <div className="text-center p-8">
          <ThemeToggleCompact />
          <div className="text-green-500 mb-4 text-6xl">✓</div>
          <h1 className="text-2xl font-bold mb-4 text-foreground">Approved!</h1>
          <p className="text-muted-foreground mb-6">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in" style={{ background: 'hsl(var(--background))' }}>
        <div className="text-center p-8">
          <ThemeToggleCompact />
          <h1 className="text-2xl font-bold mb-4 text-destructive">Account Rejected</h1>
          <p className="text-muted-foreground mb-6">Your account registration has been rejected. Please contact admin.</p>
          <a href="/api/auth/logout" className="btn-neo-accent dark:btn-mono-primary inline-block">
            Logout
          </a>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in" style={{ background: 'hsl(var(--background))' }}>
        <div className="text-center p-8">
          <ThemeToggleCompact />
          <h1 className="text-2xl font-bold mb-4 text-foreground">Error Checking Status</h1>
          <p className="text-muted-foreground mb-6">Unable to verify approval status. Please try again later.</p>
          <button onClick={() => window.location.reload()} className="btn-neo-accent dark:btn-mono-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // status === "pending"
  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in" style={{ background: 'hsl(var(--background))' }}>
      <div className="text-center p-8">
        <ThemeToggleCompact />
        <h1 className="text-2xl font-bold mb-4 text-foreground">Account Pending Approval</h1>
        <p className="text-muted-foreground mb-6">
          Your account has been registered but is awaiting admin approval. This page will auto-refresh every 10 seconds.
        </p>
        <div className="flex flex-col gap-4">
          <a href="tel:+0009947180" className="btn-neo-accent dark:btn-mono-primary">
            Call Admin
          </a>
          <a
            href="/api/auth/logout"
            className="btn-neo-secondary dark:btn-mono-secondary"
          >
            Logout
          </a>
        </div>
        <p className="text-sm text-muted-foreground mt-8">Auto-checking every 10 seconds...</p>
      </div>
    </div>
  );
}
