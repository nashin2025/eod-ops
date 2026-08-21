"use client";

import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { ThemeToggleCompact } from "@/components/ui/ThemeToggle";

function ResetPasswordContent() {
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
        <ResetPasswordForm />
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}