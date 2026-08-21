"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mailbox, CheckCircle, Warning, Spinner } from "@phosphor-icons/react";
import { useToast } from "@/hooks/use-toast";

export function ForgotPasswordForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send reset email");
        toast({ title: "Error", description: data.error, variant: "destructive" });
        return;
      }

      setSuccess(true);
      toast({ title: "Email sent", description: "Check your inbox for password reset instructions" });
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("An unexpected error occurred");
      toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in">
        <Card className="w-full max-w-md animate-scale-in">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ background: "var(--success)", boxShadow: "var(--neu-raised-sm)" }}>
              <CheckCircle className="h-6 w-6" style={{ color: "white" }} />
            </div>
            <CardTitle className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Check your email</CardTitle>
            <CardDescription style={{ color: "var(--text-tertiary)" }}>We&apos;ve sent password reset instructions to {email}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-6" style={{ color: "var(--text-tertiary)" }}>
              Follow the link in the email to reset your password. The link expires in 1 hour.
            </p>
            <Button className="w-full" size="lg" onClick={() => router.push("/login")}>
              Back to Sign In
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
          <CardTitle className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Forgot password?</CardTitle>
          <CardDescription style={{ color: "var(--text-tertiary)" }}>Enter your email and we&apos;ll send you reset instructions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Email
              </label>
              <div className="relative">
                <Mailbox className="absolute left-4 top-1/2 -translate-y-1/2" style={{ width: 18, height: 18, color: "var(--text-tertiary)" }} />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm p-3 rounded-xl" style={{ background: "rgba(239, 68, 68, 0.1)", color: "var(--danger)" }}>
                <Warning className="h-4 w-4 flex-shrink-0" style={{ width: 16, height: 16 }} />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading} size="lg">
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4 animate-spin" style={{ width: 18, height: 18 }} />
                  Sending...
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <p className="text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
            Remember your password?{" "}
            <a href="/login" className="font-medium hover:underline" style={{ color: "var(--accent)" }}>
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}