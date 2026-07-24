# Ascend AI — Design System Reference

> The complete visual language of Ascend AI. Every color, font, space, radius, shadow, and animation token — documented and cross-referenced.

---

## Design Philosophy

Inspired by **Apple**, **Linear**, **Vercel**, **Stripe**, and **Arc Browser**:

- **Dark-first** — dark mode is the primary experience, light is beautifully supported
- **Token-first** — every visual value is a CSS custom property, no hardcoded colors
- **Motion-aware** — animations respect `prefers-reduced-motion`
- **Glassmorphism** — translucent surfaces with backdrop blur
- **Premium density** — information-dense but airy, using whitespace purposefully

---

## Color Palette

All colors are defined as **RGB channel triplets** to enable Tailwind opacity modifiers.

### Brand Colors (Violet/Purple)

| Token | Tailwind Class | RGB | Hex | Use |
|---|---|---|---|---|
| `brand-50` | `bg-brand-50` | `246 244 255` | `#F6F4FF` | Subtle tints |
| `brand-100` | `bg-brand-100` | `237 233 255` | `#EDE9FF` | Hover states |
| `brand-200` | `bg-brand-200` | `221 214 255` | `#DDD6FF` | Borders |
| `brand-300` | `bg-brand-300` | `196 181 253` | `#C4B5FD` | Disabled |
| `brand-400` | `bg-brand-400` | `167 139 250` | `#A78BFA` | Highlights |
| **`brand-500`** | **`bg-brand-500`** | **`139 92 246`** | **`#8B5CF6`** | **Primary** |
| `brand-600` | `bg-brand-600` | `124 58 237` | `#7C3AED` | Hover |
| `brand-700` | `bg-brand-700` | `109 40 217` | `#6D28D9` | Active |
| `brand-800` | `bg-brand-800` | `91 33 182` | `#5B21B6` | Dark variant |
| `brand-900` | `bg-brand-900` | `76 29 149` | `#4C1D95` | Deep |
| `brand-950` | `bg-brand-950` | `46 16 101` | `#2E1065` | Darkest |

### Accent Colors

| Token | Tailwind Class | Hex | Use |
|---|---|---|---|
| `accent-cyan` | `text-accent-cyan` | `#06B6D4` | Growth, data |
| `accent-indigo` | `text-accent-indigo` | `#6366F1` | AI features |
| `accent-rose` | `text-accent-rose` | `#F43F5E` | Alerts, heart |
| `accent-amber` | `text-accent-amber` | `#F59E0B` | Warnings, stars |
| `accent-emerald` | `text-accent-emerald` | `#10B981` | Success, habits |

### Semantic Colors (Theme-Adaptive)

| Token | Light | Dark | Purpose |
|---|---|---|---|
| `background` | `#FFFFFF` | `#09090B` | Page background |
| `background-secondary` | `#FAFAFA` | `#121215` | Subtle sections |
| `background-tertiary` | `#F4F4F5` | `#18181B` | Hover surfaces |
| `surface` | `#FFFFFF` | `#121215` | Card surfaces |
| `surface-elevated` | `#FAFAFA` | `#18181B` | Elevated cards |
| `border` | `#E4E4E7` | `#27272A` | Dividers |
| `border-subtle` | `#F4F4F5` | `#18181B` | Subtle borders |
| `text-primary` | `#09090B` | `#FAFAFA` | Headings, labels |
| `text-secondary` | `#52525B` | `#A1A1AA` | Body copy |
| `text-tertiary` | `#71717A` | `#71717A` | Captions, hints |
| `text-disabled` | `#A1A1AA` | `#3F3F46` | Disabled state |

---

## Typography

### Font Families

| Token | CSS Variable | Fonts |
|---|---|---|
| `font-sans` | `--font-sans` | Inter → system-ui → sans-serif |
| `font-display` | `--font-display` | Cal Sans → Inter → sans-serif |
| `font-mono` | `--font-mono` | JetBrains Mono → Cascadia Code → monospace |

**Usage:**
- `font-sans` — all body text, UI elements
- `font-display` — hero headlines, section titles, logo
- `font-mono` — code, keyboard shortcuts, badges

### Type Scale

| Size | px | Tailwind | Use |
|---|---|---|---|
| `text-xs` | 12px | `text-xs` | Captions, badges |
| `text-sm` | 14px | `text-sm` | Body, UI labels |
| `text-base` | 16px | `text-base` | Default |
| `text-lg` | 18px | `text-lg` | Subheadings |
| `text-xl` | 20px | `text-xl` | Card titles |
| `text-2xl` | 24px | `text-2xl` | Section subheads |
| `text-3xl` | 30px | `text-3xl` | Section heads |
| `text-4xl` | 36px | `text-4xl` | Page titles |
| `text-5xl` | 48px | `text-5xl` | Hero subtitle |
| `text-6xl` | 60px | `text-6xl` | Hero headline |
| `text-7xl` | 72px | `text-7xl` | Large hero |

---

## Spacing Scale

Uses Tailwind defaults + custom additions:

| Token | Value | Key uses |
|---|---|---|
| `spacing-navbar` | `4rem (64px)` | Navbar height offset |
| `spacing-sidebar` | `16rem (256px)` | Expanded sidebar width |
| `spacing-sidebar-collapsed` | `4.5rem (72px)` | Collapsed sidebar width |

---

## Border Radius

| Token | Value | Tailwind | Use |
|---|---|---|---|
| `radius-none` | `0` | `rounded-none` | Sharp corners |
| `radius-sm` | `4px` | `rounded-sm` | Badges, tags |
| `radius-md` | `8px` | `rounded-md` | Small buttons |
| `radius-lg` | `12px` | `rounded-lg` | Buttons, inputs |
| `radius-xl` | `16px` | `rounded-xl` | Cards |
| `radius-2xl` | `20px` | `rounded-2xl` | Large cards |
| `radius-3xl` | `24px` | `rounded-3xl` | Panels |
| `radius-4xl` | `32px` | `rounded-4xl` | Hero cards |
| `radius-full` | `9999px` | `rounded-full` | Pills, avatars |

---

## Shadow System

| Token | Tailwind | Use |
|---|---|---|
| `shadow-xs` | `shadow-xs` | Subtle depth |
| `shadow-sm` | `shadow-sm` | Light cards |
| `shadow-md` | `shadow-md` | Default cards |
| `shadow-lg` | `shadow-lg` | Popovers |
| `shadow-xl` | `shadow-xl` | Modals |
| `shadow-2xl` | `shadow-2xl` | Full-page overlays |
| `shadow-brand` | `shadow-brand` | Brand-colored glow ring |
| `shadow-glow` | `shadow-glow` | Diffuse violet glow |

**Dark mode** shadows are automatically deeper/more saturated.

---

## Animation Tokens

### Duration Scale

| Token | ms | CSS Variable |
|---|---|---|
| `INSTANT` | 50ms | `--duration-instant` |
| `FAST` | 100ms | `--duration-fast` |
| `NORMAL` | 200ms | `--duration-normal` |
| `SLOW` | 300ms | `--duration-slow` |
| `SLOWER` | 500ms | `--duration-slower` |
| `SLUGGISH` | 700ms | `--duration-sluggish` |

### Easing Functions

| Name | CSS Variable | Value | Use |
|---|---|---|---|
| `ease-out` | `--ease-out` | `cubic-bezier(0,0,0.2,1)` | Default UI transitions |
| `ease-in` | `--ease-in` | `cubic-bezier(0.4,0,1,1)` | Exit animations |
| `ease-in-out` | `--ease-in-out` | `cubic-bezier(0.4,0,0.2,1)` | Theme toggle |
| `ease-spring` | `--ease-spring` | `cubic-bezier(0.34,1.56,0.64,1)` | Entrances, scale |
| `ease-bounce` | `--ease-bounce` | `cubic-bezier(0.68,-0.55,0.265,1.55)` | Bouncy feedback |

### Named Animations

| Class | Duration | Description |
|---|---|---|
| `animate-fade-in` | 500ms | Opacity 0→1 |
| `animate-fade-in-up` | 500ms | Slide up + fade in |
| `animate-fade-in-down` | 500ms | Slide down + fade in |
| `animate-scale-in` | 300ms | Scale 95%→100% + fade |
| `animate-float` | 3s ∞ | Gentle floating bob |
| `animate-pulse-glow` | 2s ∞ | Brand glow pulse |
| `animate-shimmer` | 2s ∞ | Skeleton loading shimmer |
| `animate-gradient-shift` | 4s ∞ | Animated gradient |
| `animate-spin-slow` | 8s ∞ | Slow rotation |

---

## Glassmorphism System

All glass effects are applied via utility classes:

```css
/* Standard glass card */
.glass {
  background: var(--glass-bg);        /* rgba(255,255,255,0.7) light | rgba(18,18,21,0.8) dark */
  border: 1px solid var(--glass-border); /* rgba(255,255,255,0.5) | rgba(255,255,255,0.08) */
  backdrop-filter: blur(20px);
}

/* Lighter glass for overlapping surfaces */
.glass-subtle {
  backdrop-filter: blur(12px);
}
```

---

## Gradient Utilities

| Class | Description |
|---|---|
| `gradient-text` | Violet → indigo → cyan text gradient |
| `gradient-text-warm` | Amber → rose → violet text gradient |
| `gradient-mesh` | Radial mesh background (hero, CTA sections) |
| `border-gradient` | Animated gradient border via CSS mask |

### Tailwind Gradient Presets (from `constants/`)

| Name | Classes |
|---|---|
| `BRAND` | `from-brand-400 via-brand-500 to-accent-indigo` |
| `WARM` | `from-accent-amber via-accent-rose to-brand-500` |
| `COOL` | `from-accent-cyan via-accent-indigo to-brand-500` |
| `HERO` | `from-brand-600 via-brand-500 to-accent-cyan` |

---

## Component Variants Reference

### Button

| Variant | Description |
|---|---|
| `default` | Solid brand-500 fill |
| `outline` | Border with brand hover |
| `ghost` | No border, hover bg |
| `secondary` | Neutral fill |
| `destructive` | Red error fill |
| `link` | Text only, underline |
| `glass` | Glassmorphism |
| `gradient` | Brand→indigo gradient |

### Badge

| Variant | Description |
|---|---|
| `default` | Brand tinted pill |
| `secondary` | Neutral pill |
| `outline` | Border only |
| `success` | Emerald tint |
| `warning` | Amber tint |
| `destructive` | Red tint |
| `ai` | Brand with subtle border |
| `new` | Gradient fill (brand→indigo) |

### Card

| Variant | Description |
|---|---|
| `default` | Surface + border + shadow-sm |
| `glass` | Glassmorphism card |
| `elevated` | Stronger shadow, elevated bg |
| `outline` | Border only, transparent bg |
| `ghost` | No border or background |
| `gradient` | Gradient border via CSS mask |

---

## Design Tokens: CSS → Tailwind Mapping

```
CSS var                    → Tailwind class
────────────────────────────────────────────
--color-brand-500          → bg-brand-500 / text-brand-500
--color-background         → bg-background
--color-text-primary       → text-text-primary
--color-border             → border-border
--shadow-brand             → shadow-brand
--radius-xl                → rounded-xl
--duration-normal          → (use DURATION.NORMAL in JS)
--ease-spring              → (use in Framer Motion transitions)
```
