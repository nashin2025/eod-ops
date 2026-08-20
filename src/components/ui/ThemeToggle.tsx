"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 dark:bg-muted/30">
      {(["light", "dark", "system"] as const).map((t) => (
        <Button
          key={t}
          variant={theme === t ? "default" : "ghost"}
          size="icon"
          onClick={() => setTheme(t)}
          className={`rounded-lg transition-all duration-200 ${
            theme === t
              ? "shadow-md dark:shadow-lg"
              : "hover:bg-muted/50"
          }`}
          aria-label={t === "system" ? "System theme" : t === "light" ? "Light mode" : "Dark mode"}
          aria-pressed={theme === t}
        >
          {t === "light" && <Sun className="h-4 w-4" />}
          {t === "dark" && <Moon className="h-4 w-4" />}
          {t === "system" && <Monitor className="h-4 w-4" />}
        </Button>
      ))}
    </div>
  );
}

export function ThemeToggleCompact() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "system") {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    } else {
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-lg transition-all duration-200 hover:bg-muted/50"
      aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={resolvedTheme === "dark"}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-5 w-5 text-amber-500" />
      ) : (
        <Moon className="h-5 w-5 text-blue-500" />
      )}
    </Button>
  );
}