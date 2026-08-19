"use client";

import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">EOD-Ops</h1>
          <p className="text-gray-500 mt-2">Event Operations Dashboard</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}