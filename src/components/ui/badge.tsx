"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "accent";
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", dot, ...props }, ref) => {
    const variants = {
      default: "badge badge-accent",
      success: "badge badge-success",
      warning: "badge badge-warning",
      danger: "badge badge-danger",
      accent: "badge badge-accent",
    };

    return (
      <span
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      >
        {dot && <span className="badge-dot" />}
        {props.children}
      </span>
    );
  }
);
Badge.displayName = "Badge";

export { Badge };