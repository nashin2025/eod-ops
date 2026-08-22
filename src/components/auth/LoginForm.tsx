"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mailbox, Lock, Warning, Spinner } from "@phosphor-icons/react";
import { useToast } from "@/hooks/use-toast";

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.redirectTo) {
          router.push(data.redirectTo);
          return;
        }
        setError(data.error || "Login failed");
        toast({ title: "Login failed", description: data.error, variant: "destructive" });
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
      toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in">
      <Card className="w-full max-w-md animate-slide-in-right">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Welcome back</CardTitle>
          <CardDescription style={{ color: "var(--text-tertiary)" }}>Sign in to your EOD-Ops account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Email
              </label>
              <div className="relative">
                <Mailbox className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-tertiary" />
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
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-tertiary" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <p className="text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
            Don&apos;t have an account?{" "}
            <a href="/register" className="font-medium hover:underline" style={{ color: "var(--accent)" }}>
              Sign up
            </a>
          </p>
          <p className="text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
            <a href="/forgot-password" className="font-medium hover:underline" style={{ color: "var(--accent)" }}>
              Forgot password?
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}