"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mailbox, Lock, User, Warning, Spinner } from "@phosphor-icons/react";
import { useToast } from "@/hooks/use-toast";

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        toast({ title: "Registration failed", description: data.error, variant: "destructive" });
        return;
      }

      toast({
        title: "Account created",
        description: "Please check your email to verify your account. Your account is pending admin approval.",
      });
      router.push("/login");
    } catch (err) {
      console.error("Registration error:", err);
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
          <CardTitle className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Create account</CardTitle>
          <CardDescription style={{ color: "var(--text-tertiary)" }}>Sign up for EOD-Ops</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-tertiary" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-11"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-tertiary" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="pl-11"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

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
                  placeholder="•••••••• (min 8 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11"
                  required
                  disabled={isLoading}
                  minLength={8}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-tertiary" />
                <Input
                  id="confirmPassword"
                  type="password"
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
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" style={{ borderBottom: "1px solid var(--border-subtle)" }} />
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-2" style={{ color: "var(--text-tertiary)" }}>Or continue with</span>
              </div>
            </div>
            <Button
              variant="secondary"
              className="w-full justify-center gap-3"
              onClick={() => window.location.href = "/api/auth/login"}
              disabled={isLoading}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" style={{ width: 20, height: 20 }}>
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <p className="text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
            Already have an account?{" "}
            <a href="/login" className="font-medium hover:underline" style={{ color: "var(--accent)" }}>
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}