"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Sun, Moon, Monitor } from "@phosphor-icons/react";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div className="theme-toggle" role="group" aria-label="Theme">
      {(["light", "dark", "system"] as const).map((t) => (
        <button
          key={t}
          className={`theme-toggle-btn ${theme === t ? "active" : ""}`}
          onClick={() => setTheme(t)}
          aria-label={t === "system" ? "System theme" : t === "light" ? "Light mode" : "Dark mode"}
          aria-pressed={theme === t}
        >
          {t === "light" && <Sun className="h-4 w-4" />}
          {t === "dark" && <Moon className="h-4 w-4" />}
          {t === "system" && <Monitor className="h-4 w-4" />}
        </button>
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
    <div className="theme-toggle" role="group" aria-label="Theme">
      <button
        className={`theme-toggle-btn ${resolvedTheme === "light" ? "active" : ""}`}
        onClick={toggleTheme}
        aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        aria-pressed={resolvedTheme === "dark"}
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        className={`theme-toggle-btn ${resolvedTheme === "dark" ? "active" : ""}`}
        onClick={toggleTheme}
        aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        aria-pressed={resolvedTheme === "dark"}
      >
        <Moon className="h-4 w-4" />
      </button>
    </div>
  );
}