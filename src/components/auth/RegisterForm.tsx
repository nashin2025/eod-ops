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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <Card className="card-auth w-full">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
          Create account
        </CardTitle>
        <CardDescription style={{ color: "var(--text-tertiary)" }}>
          Sign up for EOD-Ops
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="firstName" className="label">
                First Name
              </label>
              <div className="relative">
                <User className="input-icon" aria-hidden="true" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input-auth pl-11"
                  required
                  disabled={isLoading}
                  autoComplete="given-name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="label">
                Last Name
              </label>
              <div className="relative">
                <User className="input-icon" aria-hidden="true" />
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input-auth pl-11"
                  required
                  disabled={isLoading}
                  autoComplete="family-name"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="label">
              Email
            </label>
            <div className="relative">
              <Mailbox className="input-icon" aria-hidden="true" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-auth pl-11"
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="label">
              Password
            </label>
            <div className="relative">
              <Lock className="input-icon" aria-hidden="true" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="•••••••• (min 8 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-auth pl-11 pr-11"
                required
                disabled={isLoading}
                autoComplete="new-password"
                minLength={8}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <Lock className="h-5 w-5" weight="duotone" />
                ) : (
                  <Lock className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="label">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="input-icon" aria-hidden="true" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-auth pl-11 pr-11"
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <Lock className="h-5 w-5" weight="duotone" />
                ) : (
                  <Lock className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm p-3 rounded-xl" style={{ background: "var(--danger-soft)", color: "var(--danger)" }}>
              <Warning className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" className="w-full btn-auth" disabled={isLoading} size="lg">
            {isLoading ? (
              <>
                <Spinner className="mr-2 h-4 w-4 animate-spin" />
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 pt-4">
        <p className="text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
          Already have an account?{" "}
          <a href="/login" className="font-medium hover:underline" style={{ color: "var(--accent)" }}>
            Sign in
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}