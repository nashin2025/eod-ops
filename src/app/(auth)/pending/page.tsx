"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Checking approval status...</p>
        </div>
      </div>
    );
  }

  if (status === "approved") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center p-8">
          <div className="text-green-600 mb-4">✓</div>
          <h1 className="text-2xl font-bold mb-4">Approved!</h1>
          <p className="text-gray-600 mb-6">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Account Rejected</h1>
          <p className="text-gray-600 mb-6">Your account registration has been rejected. Please contact admin.</p>
          <a href="/api/auth/logout" className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 inline-block">
            Logout
          </a>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Error Checking Status</h1>
          <p className="text-gray-600 mb-6">Unable to verify approval status. Please try again later.</p>
          <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // status === "pending"
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Account Pending Approval</h1>
        <p className="text-gray-600 mb-6">
          Your account has been registered but is awaiting admin approval. This page will auto-refresh every 10 seconds.
        </p>
        <div className="flex flex-col gap-4">
          <a href="tel:+0009947180" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Call Admin
          </a>
          <a
            href="/api/auth/logout"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
          >
            Logout
          </a>
        </div>
        <p className="text-sm text-gray-500 mt-8">Auto-checking every 10 seconds...</p>
      </div>
    </div>
  );
}
