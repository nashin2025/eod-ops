"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  src?: string;
  alt?: string;
  fallback?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = "md", src, alt, fallback, ...props }, ref) => {
    const sizes = {
      sm: "avatar avatar-sm",
      md: "avatar avatar-md",
      lg: "avatar avatar-lg",
      xl: "avatar avatar-xl",
    };

    const initials = fallback || "U";

    if (src) {
      return (
        <div
          ref={ref}
          className={cn(sizes[size], className)}
          style={{ backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center" }}
          {...props}
        />
      );
    }

    return (
      <div
        ref={ref}
        className={cn(sizes[size], className)}
        {...props}
      >
        {initials}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };