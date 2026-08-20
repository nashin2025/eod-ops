# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** EOD Ops
**Generated:** 2026-08-20 16:29:14
**Category:** Smart Home/IoT Dashboard

---

## Global Rules

### Color Palette - LIGHT MODE (Neomorphism / Soft UI)

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#E0E5EC` | `--color-primary` |
| On Primary | `#3D4852` | `--color-on-primary` |
| Secondary | `#D1D9E6` | `--color-secondary` |
| Accent/CTA | `#6C63FF` | `--color-accent` |
| Background | `#E0E5EC` | `--color-background` |
| Foreground | `#3D4852` | `--color-foreground` |
| Muted | `#A0A8B8` | `--color-muted` |
| Border | `#C8D0E0` | `--color-border` |
| Destructive | `#EF4444` | `--color-destructive` |
| Ring | `#6C63FF` | `--color-ring` |
| Shadow Light | `rgba(255,255,255,0.6)` | `--shadow-light` |
| Shadow Dark | `rgba(163,177,198,0.7)` | `--shadow-dark` |

**Color Notes:** Neomorphic light mode - single base color `#E0E5EC` (Cool Clay), dual shadows for depth

### Color Palette - DARK MODE (Monochromatic / OLED)

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#0F172A` | `--color-primary-dark` |
| On Primary | `#FFFFFF` | `--color-on-primary-dark` |
| Secondary | `#1E293B` | `--color-secondary-dark` |
| Accent/CTA | `#22C55E` | `--color-accent-dark` |
| Background | `#020617` | `--color-background-dark` |
| Foreground | `#F8FAFC` | `--color-foreground-dark` |
| Muted | `#1A1E2F` | `--color-muted-dark` |
| Border | `#334155` | `--color-border-dark` |
| Destructive | `#EF4444` | `--color-destructive-dark` |
| Ring | `#0F172A` | `--color-ring-dark` |

**Color Notes:** Monochromatic dark mode - deep slate scale with green accent for positive indicators

### Typography

- **Heading Font:** Plus Jakarta Sans
- **Body Font:** Plus Jakarta Sans
- **Mood:** enterprise, saas, b2b, professional, indigo, modern, approachable, legible
- **Google Fonts:** [Plus Jakarta Sans](https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap)

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths - LIGHT MODE (Neomorphic)

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `-2px -2px 6px rgba(255,255,255,0.6), 2px 2px 6px rgba(163,177,198,0.4)` | Subtle embossed |
| `--shadow-md` | `-4px -4px 10px rgba(255,255,255,0.6), 4px 4px 10px rgba(163,177,198,0.5)` | Cards, buttons (raised) |
| `--shadow-lg` | `-8px -8px 20px rgba(255,255,255,0.5), 8px 8px 20px rgba(163,177,198,0.6)` | Modals, featured |
| `--shadow-inset` | `inset 2px 2px 4px rgba(163,177,198,0.4), inset -2px -2px 4px rgba(255,255,255,0.5)` | Pressed/active state |

### Shadow Depths - DARK MODE (Monochromatic)

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm-dark` | `0 1px 2px rgba(0,0,0,0.3)` | Subtle lift |
| `--shadow-md-dark` | `0 4px 6px rgba(0,0,0,0.4)` | Cards, buttons |
| `--shadow-lg-dark` | `0 10px 15px rgba(0,0,0,0.5)` | Modals, dropdowns |
| `--shadow-xl-dark` | `0 20px 25px rgba(0,0,0,0.6)` | Hero images, featured cards |

---

## Component Specs

### Buttons - LIGHT MODE (Neomorphic)

```css
/* Primary Button - Neomorphic Raised */
.btn-primary {
  background: #E0E5EC;
  color: #3D4852;
  padding: 12px 24px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 14px;
  border: none;
  box-shadow: -4px -4px 10px rgba(255,255,255,0.6), 4px 4px 10px rgba(163,177,198,0.5);
  transition: all 150ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  box-shadow: -6px -6px 14px rgba(255,255,255,0.7), 6px 6px 14px rgba(163,177,198,0.6);
  transform: translateY(-1px);
}

.btn-primary:active {
  box-shadow: inset 2px 2px 4px rgba(163,177,198,0.4), inset -2px -2px 4px rgba(255,255,255,0.5);
  transform: translateY(0);
}

/* Secondary Button - Neomorphic Outlined */
.btn-secondary {
  background: transparent;
  color: #3D4852;
  border: 2px solid #C8D0E0;
  padding: 10px 22px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 14px;
  transition: all 150ms ease;
  cursor: pointer;
}

.btn-secondary:hover {
  border-color: #6C63FF;
  color: #6C63FF;
}

/* Accent Button - Violet */
.btn-accent {
  background: #6C63FF;
  color: white;
  padding: 12px 24px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 14px;
  border: none;
  box-shadow: 0 4px 14px rgba(108,99,255,0.4);
  transition: all 150ms ease;
  cursor: pointer;
}

.btn-accent:hover {
  box-shadow: 0 6px 20px rgba(108,99,255,0.5);
  transform: translateY(-1px);
}
```

### Buttons - DARK MODE (Monochromatic)

```css
/* Primary Button - Dark Mode */
.btn-primary-dark {
  background: #22C55E;
  color: #020617;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  border: none;
  box-shadow: 0 4px 14px rgba(34,197,94,0.3);
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary-dark:hover {
  box-shadow: 0 6px 20px rgba(34,197,94,0.4);
  transform: translateY(-1px);
}

.btn-primary-dark:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(34,197,94,0.3);
}

/* Secondary Button - Dark Mode */
.btn-secondary-dark {
  background: transparent;
  color: #F8FAFC;
  border: 2px solid #334155;
  padding: 10px 22px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-secondary-dark:hover {
  border-color: #22C55E;
  color: #22C55E;
  background: rgba(34,197,94,0.1);
}
```

### Cards - LIGHT MODE (Neomorphic)

```css
.card {
  background: #E0E5EC;
  border-radius: 20px;
  padding: 24px;
  box-shadow: -4px -4px 10px rgba(255,255,255,0.6), 4px 4px 10px rgba(163,177,198,0.5);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: -8px -8px 20px rgba(255,255,255,0.5), 8px 8px 20px rgba(163,177,198,0.6);
  transform: translateY(-2px);
}

.card:active {
  box-shadow: inset 2px 2px 4px rgba(163,177,198,0.4), inset -2px -2px 4px rgba(255,255,255,0.5);
  transform: translateY(0);
}

/* Neomorphic Input/Field */
.card-input {
  background: #D1D9E6;
  border-radius: 12px;
  padding: 16px;
  box-shadow: inset 2px 2px 4px rgba(163,177,198,0.4), inset -2px -2px 4px rgba(255,255,255,0.5);
  border: none;
  color: #3D4852;
  font-size: 16px;
  transition: all 150ms ease;
}

.card-input:focus {
  outline: none;
  box-shadow: inset 2px 2px 6px rgba(163,177,198,0.5), inset -2px -2px 6px rgba(255,255,255,0.3);
}
```

### Cards - DARK MODE (Monochromatic)

```css
.card-dark {
  background: #0E1223;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.4);
  border: 1px solid #334155;
  transition: all 200ms ease;
  cursor: pointer;
}

.card-dark:hover {
  box-shadow: 0 10px 15px rgba(0,0,0,0.5);
  border-color: #475569;
  transform: translateY(-2px);
}
```

### Inputs - LIGHT MODE (Neomorphic)

```css
.input {
  padding: 14px 16px;
  background: #D1D9E6;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  color: #3D4852;
  box-shadow: inset 2px 2px 4px rgba(163,177,198,0.4), inset -2px -2px 4px rgba(255,255,255,0.5);
  transition: all 150ms ease;
  width: 100%;
}

.input:focus {
  outline: none;
  box-shadow: inset 2px 2px 6px rgba(163,177,198,0.5), inset -2px -2px 6px rgba(255,255,255,0.3);
}

.input::placeholder {
  color: #A0A8B8;
}
```

### Inputs - DARK MODE (Monochromatic)

```css
.input-dark {
  padding: 14px 16px;
  background: #0E1223;
  border: 1px solid #334155;
  border-radius: 10px;
  font-size: 16px;
  color: #F8FAFC;
  transition: all 200ms ease;
  width: 100%;
}

.input-dark:focus {
  outline: none;
  border-color: #22C55E;
  box-shadow: 0 0 0 3px rgba(34,197,94,0.2);
}

.input-dark::placeholder {
  color: #64748B;
}
```

### Modals - LIGHT MODE

```css
.modal-overlay {
  background: rgba(61, 72, 82, 0.4);
  backdrop-filter: blur(8px);
}

.modal {
  background: #E0E5EC;
  border-radius: 24px;
  padding: 32px;
  box-shadow: -8px -8px 20px rgba(255,255,255,0.5), 8px 8px 20px rgba(163,177,198,0.6);
  max-width: 500px;
  width: 90%;
}
```

### Modals - DARK MODE

```css
.modal-overlay-dark {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
}

.modal-dark {
  background: #0E1223;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 25px rgba(0,0,0,0.6);
  border: 1px solid #334155;
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

### LIGHT MODE: Neomorphism / Soft UI Evolution

**Style:** Soft UI Evolution (accessibility-focused neomorphism)
**Keywords:** Soft UI, embossed, debossed, convex, concave, light source, subtle depth, rounded (12-16px), monochromatic, improved contrast
**Best For:** Enterprise SaaS dashboards, health/wellness, modern business tools, professional hybrid

**Key Effects:**
- Dual-layer shadows (light top-left, dark bottom-right) for embossed effect
- Inset shadows for pressed/active states
- Single base background color `#E0E5EC` (Cool Clay)
- Rounded corners 12-20px consistent
- Smooth press animation 150ms with shadow interpolation
- Improved contrast WCAG AA+ over pure neumorphism

### DARK MODE: Monochromatic OLED

**Style:** Dark Mode (OLED) / Monochromatic
**Keywords:** Dark theme, low light, high contrast, deep black, midnight blue, eye-friendly, OLED, night mode
**Best For:** Night-mode apps, coding platforms, operations dashboards, eye-strain prevention

**Key Effects:**
- Deep black `#020617` background (not pure #000000 to avoid OLED smear)
- Single accent color `#22C55E` (green) for positive indicators
- Minimal glow effects
- High contrast text (7:1+)
- Standard elevation shadows (no dual-shadow neumorphism)

---

## Page Pattern

**Pattern Name:** Enterprise Gateway / Real-Time Operations Dashboard

- **Conversion Strategy:** For ops/security/iot products. Demo or sandbox link. Trust signals prominent.
- **CTA Placement:** Primary CTA in nav + After metrics
- **Section Order:** 1. Hero (Video/Mission), 2. Solutions by Industry/Role, 3. Key Metrics/Indicators, 4. Client Logos/Trust Signals, 5. Contact/CTA

---

## Anti-Patterns (Do NOT Use)

- ❌ Slow updates + No automation
- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio (7:1 for dark mode)
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y
- ❌ **Pure neumorphism in dark mode** — Breaks material metaphor, use monochromatic instead
- ❌ **Multiple accent colors** — One accent per mode (violet light, green dark)

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide/Phosphor)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum (WCAG AA)
- [ ] Dark mode: text contrast 7:1 minimum (WCAG AAA)
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
- [ ] Neomorphic shadows consistent in light mode
- [ ] Monochromatic elevation shadows in dark mode
- [ ] Single base background in light mode (`#E0E5EC`)
- [ ] Deep slate background in dark mode (`#020617`)

---

## Design Dials Applied

| Dial | Value | Effect |
|------|-------|--------|
| `--variance` | 7/10 | Balanced / Modern - asymmetric layouts, modern aesthetics |
| `--motion` | 6/10 | Standard - stagger reveals, scroll animations, spring modals |
| `--density` | 6/10 | Standard - 16-64px spacing scale |

---

## GSAP Motion Presets (Standard Tier)

### Stagger List Reveal
```js
gsap.from('.grid-item', {
  opacity: 0,
  scale: 0.92,
  y: 16,
  duration: 0.4,
  stagger: { each: 0.06, from: 'start', grid: 'auto' },
  ease: 'back.out(1.4)'
});
```

### Spring Modal
```js
gsap.from('.modal', {
  scale: 0.95,
  opacity: 0,
  duration: 0.35,
  ease: 'back.out(1.2)'
});
```

### Page Transition
```js
gsap.from('.page-content', {
  opacity: 0,
  y: 20,
  duration: 0.5,
  ease: 'expo.out'
});
```

---

## Implementation Notes

1. **Light Mode Base:** Use `#E0E5EC` as THE background color. All cards, inputs, buttons use this same base with shadow variations.
2. **Dark Mode Base:** Use `#020617` as THE background color. Cards use `#0E1223` with subtle borders.
3. **Border Radius:** 16-20px for cards, 12-16px for buttons/inputs in light mode; 10-16px in dark mode.
4. **Transitions:** 150ms for light mode press/tap, 200ms for dark mode.
5. **Font:** Plus Jakarta Sans loaded via next/font for optimal performance.
6. **Icons:** Phosphor Icons (priority) or Lucide - consistent stroke width 1.5.