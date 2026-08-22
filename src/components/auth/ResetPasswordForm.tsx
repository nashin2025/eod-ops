"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, CheckCircle, Warning, Spinner, Eye, EyeSlash } from "@phosphor-icons/react";
import { useToast } from "@/hooks/use-toast";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState(true);

  // Validate token on mount
  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const type = searchParams.get("type");
    if (!accessToken || type !== "recovery") {
      setValidToken(false);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to reset password");
        toast({ title: "Error", description: data.error, variant: "destructive" });
        return;
      }

      setSuccess(true);
      toast({ title: "Password reset", description: "Your password has been updated successfully" });
    } catch (err) {
      console.error("Reset password error:", err);
      setError("An unexpected error occurred");
      toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in">
        <Card className="w-full max-w-md animate-scale-in">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ background: "var(--danger)", boxShadow: "var(--neu-raised-sm)" }}>
              <Warning className="h-6 w-6" style={{ color: "white" }} />
            </div>
            <CardTitle className="text-2xl font-bold" style={{ color: "var(--danger)" }}>Invalid reset link</CardTitle>
            <CardDescription style={{ color: "var(--text-tertiary)" }}>This password reset link is invalid or has expired</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-6" style={{ color: "var(--text-tertiary)" }}>
              Please request a new password reset link.
            </p>
            <Button className="w-full" size="lg" onClick={() => router.push("/forgot-password")}>
              Request new link
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in">
        <Card className="w-full max-w-md animate-scale-in">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ background: "var(--success)", boxShadow: "var(--neu-raised-sm)" }}>
              <CheckCircle className="h-6 w-6" style={{ color: "white" }} />
            </div>
            <CardTitle className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Password updated</CardTitle>
            <CardDescription style={{ color: "var(--text-tertiary)" }}>Your password has been successfully reset</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" size="lg" onClick={() => router.push("/login")}>
              Sign in with new password
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in">
      <Card className="w-full max-w-md animate-slide-in-right">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Reset password</CardTitle>
          <CardDescription style={{ color: "var(--text-tertiary)" }}>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-tertiary" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="•••••••• (min 8 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11"
                  required
                  disabled={isLoading}
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {showPassword ? <EyeSlash className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-tertiary" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-11"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm p-3 rounded-xl" style={{ background: "var(--danger-soft)", color: "var(--danger)" }}>
                <Warning className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading} size="lg">
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}