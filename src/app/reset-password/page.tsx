"use client";

import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { ThemeToggleCompact } from "@/components/ui/ThemeToggle";

function ResetPasswordContent() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in" style={{ background: 'hsl(var(--background))' }}>
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-6">
          <ThemeToggleCompact />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">EOD-Ops</h1>
          <p className="text-muted-foreground mt-2">Event Operations Dashboard</p>
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