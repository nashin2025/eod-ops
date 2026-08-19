"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Form = ({ children, ...props }: React.FormHTMLAttributes<HTMLFormElement>) => (
  <form {...props}>{children}</form>
);
Form.displayName = "Form";

const FormField = ({ control, name, render }: { control: any; name: string; render: (field: any) => React.ReactNode }) => {
  return <>{render({})}</>;
};
FormField.displayName = "FormField";

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-2", className)} {...props} />
  )
);
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<"label">,
  React.ComponentPropsWithoutRef<"label">
>(({ className, ...props }, ref) => (
  <label ref={ref} className={cn("text-sm font-medium", className)} {...props} />
));
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  React.ElementRef<"input">,
  React.ComponentPropsWithoutRef<"input">
>(({ ...props }, ref) => <input ref={ref} {...props} />);
FormControl.displayName = "FormControl";

const FormMessage = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm font-medium text-destructive", className)} {...props} />
);
FormMessage.displayName = "FormMessage";

export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage };