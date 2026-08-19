"use client";

import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

function ResetPasswordContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">EOD-Ops</h1>
          <p className="text-gray-500 mt-2">Event Operations Dashboard</p>
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