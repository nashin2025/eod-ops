# EOD-Ops Design System Specification

**Version:** 2.0  
**Last Updated:** 2026-08-20  
**Status:** Active Implementation

---

## Design Philosophy

EOD-Ops uses a **dual-theme design system** with strict adherence to an **8-point spacing grid** and **semantic color tokens**.

### Themes

| Mode | Philosophy | Base Color | Accent |
|------|------------|------------|--------|
| **Light** | Neomorphism / Soft UI | `#E0E5EC` (Cool Clay) | `#7C3AED` (Violet) |
| **Dark** | Monochromatic / OLED | `#020617` (Near Black) | `#10B981` (Emerald) |

### Core Principles

1. **8-Point Grid Only** — All spacing, padding, margins, gaps use multiples of 4px (4, 8, 12, 16, 20, 24, 32, 40, 48)
2. **Semantic Tokens** — Never use raw colors; always use CSS custom properties
3. **Auto-Theme Components** — Single component classes that adapt to light/dark via `[data-theme]`
4. **No Inline Styles** — Use utility classes or CSS custom properties
5. **WCAG AA Minimum** — Contrast ratios validated for both themes
6. **Reduced Motion** — Respects `prefers-reduced-motion`

---

## Spacing Scale (8-Point Grid)

| Token | Value | Use Cases |
|-------|-------|-----------|
| `--space-1` | 4px | Icon-label gaps, badge offsets, tight clusters |
| `--space-2` | 8px | Chip padding, related text lines, small gaps |
| `--space-3` | 12px | Button/input padding, nav icon-text, card inner gaps |
| `--space-4` | 16px | Standard card padding, label-control gap, standard gaps |
| `--space-5` | 20px | Card-to-card gaps, KPI card padding |
| `--space-6` | 24px | **Page padding**, large card padding, section gaps |
| `--space-7` | 32px | Major section breaks |
| `--space-8` | 40px | Large section dividers, hero breathing room |
| `--space-9` | 48px | Hero/welcome blocks, major page separators |

---

## Layout Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `--layout-page-padding` | 24px | Main content horizontal padding |
| `--layout-sidebar-expanded` | 288px | Sidebar width (expanded) |
| `--layout-sidebar-collapsed` | 72px | Sidebar width (collapsed) |
| `--layout-sidebar-pad-h` | 18px | Sidebar horizontal padding (intentional non-8pt) |
| `--layout-sidebar-pad-v` | 24px | Sidebar vertical padding |
| `--layout-topbar-height` | 68px | Top bar height |
| `--layout-topbar-pad-h` | 20px | Top bar horizontal padding |
| `--layout-topbar-action-gap` | 10px | Gap between top bar actions |
| `--layout-topbar-control-height` | 40px | Height of icon buttons in top bar |
| `--layout-card-padding` | 24px | Standard card internal padding |
| `--layout-kpi-card-padding` | 20px | KPI card internal padding |
| `--layout-card-row-gap` | 20px | Gap between cards in a row |
| `--layout-section-gap` | 32px | Gap between major sections |
| `--layout-topbar-to-hero` | 24px | Gap from top bar to hero |
| `--layout-hero-to-kpi` | 24px | Gap from hero to KPI row |
| `--layout-kpi-to-charts` | 32px | Gap from KPI row to charts |
| `--layout-charts-to-table` | 32px | Gap from charts to table |
| `--layout-nav-item-height` | 44px | Navigation item height |
| `--layout-brand-logo-size` | 40px | Brand logo size |
| `--layout-breadcrumb-sep-size` | 14px | Breadcrumb separator size |
| `--layout-breadcrumb-sep-gap` | 8px | Breadcrumb separator gap |
| `--layout-notif-dot-size` | 8px | Notification dot size |
| `--layout-notif-dot-offset` | 8px | Notification dot offset |

---

## Color Tokens

### Light Mode (Neomorphism)

```css
:root {
  /* Base */
  --base: #E0E5EC;
  --surface: #E0E5EC;
  --surface-raised: #E6EBF2;
  
  /* Shadows (Neumorphic) */
  --shadow-dark: #A3B1C6;
  --shadow-light: #FFFFFF;
  --neu-raised: 8px 8px 16px #A3B1C6, -8px -8px 16px #FFFFFF;
  --neu-raised-sm: 5px 5px 10px #A3B1C6, -5px -5px 10px #FFFFFF;
  --neu-pressed: inset 4px 4px 8px #A3B1C6, inset -4px -4px 8px #FFFFFF;
  --neu-inset: inset 3px 3px 6px #A3B1C6, inset -3px -3px 6px #FFFFFF;
  
  /* Text */
  --text-primary: #2D3748;
  --text-secondary: #718096;
  --text-tertiary: #A0AEC0;
  
  /* Borders */
  --border: #CBD5E0;
  
  /* Accent (Violet) */
  --accent: #7C3AED;
  --accent-hover: #6D28D9;
  --accent-soft: #EDE9FE;
  
  /* Semantic */
  --success: #10B981;
  --danger: #EF4444;
  --warning: #F59E0B;
  
  /* Component Backgrounds */
  --card-bg: #E0E5EC;
  --sidebar-bg: #E0E5EC;
  --topbar-bg: #E0E5EC;
  --input-bg: #E0E5EC;
  --table-row-hover: rgba(124,58,237,0.05);
}
```

### Dark Mode (Monochromatic)

```css
[data-theme="dark"] {
  /* Base */
  --base-dark: #020617;
  --surface-dark: #020617;
  --surface-raised-dark: #0B1120;
  --shadow-dark-dark: rgba(0,0,0,0.5);
  --shadow-light-dark: rgba(255,255,255,0.02);
  
  /* Text */
  --text-primary-dark: #F1F5F9;
  --text-secondary-dark: #94A3B8;
  --text-tertiary-dark: #64748B;
  
  /* Borders */
  --border-dark: #1E293B;
  --border-strong-dark: #334155;
  
  /* Accent (Emerald) */
  --accent-dark: #10B981;
  --accent-hover-dark: #059669;
  --accent-soft-dark: rgba(16,185,129,0.12);
  --accent-glow-dark: rgba(16,185,129,0.35);
  
  /* Semantic */
  --success-dark: #10B981;
  --danger-dark: #EF4444;
  --warning-dark: #F59E0B;
  
  /* Component Backgrounds */
  --card-bg-dark: #0B1120;
  --sidebar-bg-dark: #0B1120;
  --topbar-bg-dark: #0B1120;
  --input-bg-dark: #111827;
  --table-row-hover-dark: rgba(16,185,129,0.06);
  
  /* Neumorphic dark (subtle) */
  --neu-raised-dark: 0 1px 2px rgba(0,0,0,0.4);
  --neu-raised-sm-dark: 0 1px 2px rgba(0,0,0,0.3);
  --neu-pressed-dark: inset 0 1px 2px rgba(0,0,0,0.4);
}
```

### Shadcn/UI Compatible Tokens (for Radix components)

```css
:root {
  --background: var(--base);
  --foreground: var(--text-primary);
  --card: var(--card-bg);
  --card-foreground: var(--text-primary);
  --popover: var(--card-bg);
  --popover-foreground: var(--text-primary);
  --primary: var(--accent);
  --primary-foreground: #FFFFFF;
  --secondary: var(--surface-raised);
  --secondary-foreground: var(--text-primary);
  --muted: var(--surface-raised);
  --muted-foreground: var(--text-tertiary);
  --accent: var(--accent);
  --accent-foreground: #FFFFFF;
  --destructive: var(--danger);
  --destructive-foreground: #FFFFFF;
  --border: var(--border);
  --input: var(--border);
  --ring: var(--accent);
  --radius: 0.75rem; /* 12px */
}

[data-theme="dark"] {
  --background: var(--base-dark);
  --foreground: var(--text-primary-dark);
  --card: var(--card-bg-dark);
  --card-foreground: var(--text-primary-dark);
  --popover: var(--card-bg-dark);
  --popover-foreground: var(--text-primary-dark);
  --primary: var(--accent-dark);
  --primary-foreground: var(--base-dark);
  --secondary: var(--surface-raised-dark);
  --secondary-foreground: var(--text-primary-dark);
  --muted: var(--surface-raised-dark);
  --muted-foreground: var(--text-tertiary-dark);
  --accent: var(--accent-dark);
  --accent-foreground: var(--base-dark);
  --destructive: var(--danger-dark);
  --destructive-foreground: var(--text-primary-dark);
  --border: var(--border-dark);
  --input: var(--border-dark);
  --ring: var(--accent-dark);
}
```

---

## Typography

### Font Stack

```css
--font-sans: 'Geist', system-ui, -apple-system, sans-serif;
--font-mono: 'Geist Mono', ui-monospace, SFMono-Regular, monospace;
```

### Type Scale

| Role | Size | Weight | Line Height | Letter Spacing |
|------|------|--------|-------------|----------------|
| Display / Hero | 26px / 32px | 800 | 1.2 | -0.02em |
| H1 / Page Title | 22px | 700 | 1.3 | -0.01em |
| H2 / Section Title | 18px | 700 | 1.3 | -0.01em |
| H3 / Card Title | 15px | 700 | 1.3 | 0 |
| Body Large | 14px | 400 | 1.5 | 0.01em |
| Body | 13px | 400 | 1.5 | 0.01em |
| Small / Caption | 12px | 400 | 1.4 | 0.02em |
| Micro / Label | 11px | 600 | 1.3 | 0.08em (uppercase) |
| Tabular Numbers | - | 700-800 | - | `font-variant-numeric: tabular-nums` |

---

## Border Radius

| Token | Value | Use Cases |
|-------|-------|-----------|
| `--radius-sm` | 8px | Badges, small chips, avatar |
| `--radius-md` | 12px | Buttons, inputs, cards (compact), icon buttons |
| `--radius-lg` | 16px | Standard cards, dropdowns, modals |
| `--radius-xl` | 20px | **Primary cards**, panels, major containers |
| `--radius-full` | 9999px | Pills, avatars, notification dots, toggle buttons |

---

## Shadows & Elevation

### Light Mode (Neumorphic)

| Level | Shadow |
|-------|--------|
| Raised (Card) | `8px 8px 16px #A3B1C6, -8px -8px 16px #FFFFFF` |
| Raised Small | `5px 5px 10px #A3B1C6, -5px -5px 10px #FFFFFF` |
| Pressed | `inset 4px 4px 8px #A3B1C6, inset -4px -4px 8px #FFFFFF` |
| Inset (Input) | `inset 3px 3px 6px #A3B1C6, inset -3px -3px 6px #FFFFFF` |

### Dark Mode (Layered Elevation)

| Level | Shadow |
|-------|--------|
| Raised (Card) | `0 1px 2px rgba(0,0,0,0.4)` |
| Raised Small | `0 1px 2px rgba(0,0,0,0.3)` |
| Pressed | `inset 0 1px 2px rgba(0,0,0,0.4)` |
| Elevated (Modal/Dropdown) | `0 10px 15px rgba(0,0,0,0.5)` |
| Glow (Accent Active) | `0 0 12px rgba(16,185,129,0.35)` |

---

## Component Specifications

### Button

**Variants:** Primary, Secondary, Ghost, Destructive, Outline  
**Sizes:** Default (44px), SM (40px), LG (48px), Icon (40x40px)

```css
.btn-primary {
  height: 44px;
  padding: var(--space-3) var(--space-5); /* 12px 20px */
  border-radius: var(--radius-md); /* 12px */
  font-size: 13.5px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2); /* 8px */
  transition: all 0.2s ease;
}

/* Light */
[data-theme="light"] .btn-primary {
  background: var(--accent);
  color: white;
  box-shadow: 6px 6px 12px rgba(124,58,237,0.25), -4px -4px 10px #FFFFFF;
}
[data-theme="light"] .btn-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}
[data-theme="light"] .btn-primary:active {
  transform: translateY(0) scale(0.98);
}

/* Dark */
[data-theme="dark"] .btn-primary {
  background: var(--accent-dark);
  color: var(--base-dark);
  box-shadow: 0 4px 14px rgba(16,185,129,0.3);
}
[data-theme="dark"] .btn-primary:hover {
  background: var(--accent-hover-dark);
  box-shadow: 0 6px 20px rgba(16,185,129,0.4);
  transform: translateY(-1px);
}
[data-theme="dark"] .btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(16,185,129,0.3);
}

/* Icon centering */
.btn-primary svg { width: 16px; height: 16px; transform: translateY(0.5px); }
```

### Card

```css
.card {
  background: var(--card-bg);
  border-radius: var(--radius-xl); /* 20px */
  padding: var(--layout-card-padding); /* 24px */
  transition: background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Light */
[data-theme="light"] .card {
  box-shadow: var(--neu-raised);
}
[data-theme="light"] .card:hover {
  box-shadow: 12px 12px 24px var(--shadow-dark), -12px -12px 24px var(--shadow-light);
  transform: translateY(-2px);
}

/* Dark */
[data-theme="dark"] .card {
  border: 1px solid var(--border-dark);
  box-shadow: var(--neu-raised-dark);
}
[data-theme="dark"] .card:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.5);
  border-color: var(--border-strong-dark);
  transform: translateY(-2px);
}
```

### Input

```css
.input {
  width: 100%;
  height: 44px;
  padding: var(--space-3) var(--space-3) var(--space-3) var(--space-4); /* 12px 12px 12px 16px */
  border-radius: var(--radius-md); /* 12px */
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: all 0.2s ease;
}

/* Light */
[data-theme="light"] .input {
  background: var(--input-bg);
  color: var(--text-primary);
  border: none;
  box-shadow: var(--neu-inset);
}
[data-theme="light"] .input:focus {
  box-shadow: inset 4px 4px 8px var(--shadow-dark), inset -4px -4px 8px var(--shadow-light);
}
[data-theme="light"] .input::placeholder { color: var(--text-tertiary); }

/* Dark */
[data-theme="dark"] .input {
  background: var(--input-bg-dark);
  color: var(--text-primary-dark);
  border: 1px solid var(--border-dark);
}
[data-theme="dark"] .input:focus {
  border-color: var(--accent-dark);
  box-shadow: 0 0 0 3px var(--accent-soft-dark);
}
[data-theme="dark"] .input::placeholder { color: var(--text-tertiary-dark); }
```

### Icon Button

```css
.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md); /* 12px */
  display: grid;
  place-items: center;
  color: var(--text-secondary);
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

/* Light */
[data-theme="light"] .icon-btn {
  box-shadow: var(--neu-raised-sm);
  background: var(--surface);
}
[data-theme="light"] .icon-btn:active { box-shadow: var(--neu-pressed); }
[data-theme="light"] .icon-btn:hover { color: var(--accent); }

/* Dark */
[data-theme="dark"] .icon-btn {
  border: 1px solid var(--border-dark);
  background: var(--surface-raised-dark);
  box-shadow: var(--neu-raised-sm-dark);
}
[data-theme="dark"] .icon-btn:hover {
  border-color: var(--border-strong-dark);
  color: var(--text-primary-dark);
}

.icon-btn svg { width: 18px; height: 18px; }
```

### Badge / Status Pill

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1); /* 4px */
  padding: var(--space-1) var(--space-2); /* 4px 8px */
  border-radius: var(--radius-full); /* 9999px */
  font-size: 11px;
  font-weight: 600;
  line-height: 1.3;
  white-space: nowrap;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}

/* Success */
.badge-success { color: var(--success); background: color-mix(in srgb, var(--success) 14%, transparent); }
[data-theme="dark"] .badge-success { color: var(--success-dark); background: color-mix(in srgb, var(--success-dark) 14%, transparent); }

/* Warning */
.badge-warning { color: var(--warning); background: color-mix(in srgb, var(--warning) 14%, transparent); }
[data-theme="dark"] .badge-warning { color: var(--warning-dark); background: color-mix(in srgb, var(--warning-dark) 14%, transparent); }

/* Danger */
.badge-danger { color: var(--danger); background: color-mix(in srgb, var(--danger) 14%, transparent); }
[data-theme="dark"] .badge-danger { color: var(--danger-dark); background: color-mix(in srgb, var(--danger-dark) 14%, transparent); }

/* Accent/Info */
.badge-accent { color: var(--accent); background: color-mix(in srgb, var(--accent) 14%, transparent); }
[data-theme="dark"] .badge-accent { color: var(--accent-dark); background: color-mix(in srgb, var(--accent-dark) 14%, transparent); }
```

### Avatar

```css
.avatar {
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: white;
  font-weight: 700;
  background: linear-gradient(135deg, var(--accent), var(--accent-hover));
}

.avatar-sm { width: 32px; height: 32px; font-size: 12px; }
.avatar-md { width: 38px; height: 38px; font-size: 14px; }
.avatar-lg { width: 48px; height: 48px; font-size: 16px; }
.avatar-xl { width: 80px; height: 80px; font-size: 28px; }
```

### Theme Toggle

```css
.theme-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-1); /* 4px */
  padding: var(--space-1); /* 4px */
  border-radius: var(--radius-full); /* 9999px */
  height: 40px;
}

.theme-toggle-btn {
  width: 34px;
  height: 30px;
  border-radius: var(--radius-full);
  display: grid;
  place-items: center;
  color: var(--text-tertiary);
  transition: all 0.25s ease;
}

.theme-toggle-btn svg { width: 16px; height: 16px; }

.theme-toggle-btn.active {
  background: var(--accent);
  color: white;
}

[data-theme="light"] .theme-toggle { box-shadow: var(--neu-inset); }
[data-theme="light"] .theme-toggle-btn.active { box-shadow: var(--neu-raised-sm); }

[data-theme="dark"] .theme-toggle { background: var(--input-bg-dark); border: 1px solid var(--border-dark); }
[data-theme="dark"] .theme-toggle-btn.active { box-shadow: 0 0 12px var(--accent-glow-dark); }
```

---

## Grid System

### 12-Column Grid (Main Content)

```css
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-5); /* 20px */
}

/* Common spans */
.col-span-3 { grid-column: span 3; }  /* KPI cards: 4 per row */
.col-span-4 { grid-column: span 4; }
.col-span-6 { grid-column: span 6; }
.col-span-8 { grid-column: span 8; }  /* Main chart */
.col-span-12 { grid-column: span 12; }
```

### Breakpoints

| Breakpoint | Width | Use |
|------------|-------|-----|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop (sidebar visible) |
| `xl` | 1280px | Wide desktop |
| `2xl` | 1536px | Ultra-wide |

---

## Animation System

### Timing

| Duration | Use Case |
|----------|----------|
| 150ms | Micro-interactions (button press, hover) |
| 200ms | Standard transitions (card hover, sidebar) |
| 250ms | Theme toggle, modal open |
| 300ms | Page transitions, major state changes |
| 500ms | Hero entrance, stagger animations |

### Easing

```css
--ease-standard: cubic-bezier(0.16, 1, 0.3, 1);  /* Primary */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Playful */
--ease-expo: cubic-bezier(0.19, 1, 0.22, 1);      /* Expressive */
```

### Keyframe Animations

```css
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes staggerIn { from { opacity: 0; transform: scale(0.92) translateY(16px); } to { opacity: 1; transform: scale(1) translateY(0); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Accessibility Requirements

1. **Focus Visible** — All interactive elements have `:focus-visible` styles
2. **Color Contrast** — WCAG AA (4.5:1) for text, 3:1 for UI elements
3. **Semantic HTML** — Proper heading hierarchy, landmarks, ARIA labels
4. **Keyboard Navigation** — All interactions accessible via keyboard
5. **Screen Readers** — Proper ARIA attributes, live regions for dynamic content
6. **Reduced Motion** — All animations respect `prefers-reduced-motion`

---

## Implementation Rules

### DO ✅

- Use CSS custom properties from this spec
- Use spacing tokens (`var(--space-N)`) for all spacing
- Use layout constants (`var(--layout-*)`) for structural dimensions
- Use unified component classes (`.card`, `.btn-primary`, `.input`, etc.)
- Use auto-theme via `[data-theme="light/dark"]` selectors
- Import Geist font via `next/font`
- Use Phosphor icons exclusively

### DON'T ❌

- Use raw pixel values for spacing (except 1px borders)
- Use inline styles for theming (use CSS classes)
- Mix light/dark colors in same component without `[data-theme]`
- Use `lucide-react` icons
- Use `Inter` font (use Geist)
- Use emoji in UI (use icons)
- Hardcode border-radius values (use `--radius-*` tokens)
- Use `h-screen` for viewport height (use `min-h-[100dvh]`)

---

## File Structure

```
src/
├── app/
│   └── globals.css          # All design tokens + utility classes
├── components/
│   ├── providers/
│   │   └── ThemeProvider.tsx
│   ├── ui/                  # Shared UI primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── dropdown.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── index.ts         # Barrel exports
│   └── dashboard/
│       ├── DashboardLayout.tsx
│       ├── Sidebar.tsx
│       ├── TopBar.tsx
│       └── index.ts
└── lib/
    └── utils.ts             # cn() helper
```

---

## Migration Checklist

- [ ] Update `globals.css` with consolidated tokens
- [ ] Create/Update shared UI components (`button`, `card`, `input`, `badge`, `avatar`, `dropdown`)
- [ ] Update `ThemeProvider` and `ThemeToggle`
- [ ] Refactor `DashboardLayout` into `Sidebar` + `TopBar` + `DashboardLayout`
- [ ] Refactor `dashboard-client.tsx` to use shared components
- [ ] Update all dashboard sub-pages (admin, members, events, equipment, archive, map, profile)
- [ ] Update auth pages (login, register, pending, forgot-password, reset-password)
- [ ] Run quality gates: `pnpm run build && pnpm run lint && pnpm run typecheck && pnpm run test`
- [ ] Deploy to Vercel