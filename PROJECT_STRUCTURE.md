# Ascend AI — Project Structure

> Complete reference for the codebase layout, every folder's purpose, and key files.

---

## Root Directory

```
ascend-ai/
├── app/                    # Next.js 15 App Router
├── components/             # All React components
│   ├── common/             # Shared primitive components
│   ├── layout/             # Page layout structure components
│   ├── sections/           # Landing page content sections
│   └── ui/                 # Design system UI components
├── config/                 # Site-wide configuration
├── constants/              # Immutable app constants
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions & helpers
├── public/                 # Static assets
├── store/                  # Zustand state stores
├── styles/                 # Global CSS / Design System
├── types/                  # TypeScript type definitions
├── utils/                  # (reserved for feature-specific utils)
├── .prettierrc             # Prettier code style config
├── .prettierignore         # Prettier exclude list
├── eslint.config.mjs       # ESLint rules
├── next.config.ts          # Next.js production config
├── package.json            # Dependencies & scripts
├── postcss.config.mjs      # PostCSS / Tailwind v4 setup
├── tailwind.config.ts      # Tailwind design token extensions
└── tsconfig.json           # TypeScript strict-mode config
```

---

## `app/` — Next.js App Router

The heart of the application. All pages, layouts, and API routes live here.

```
app/
├── favicon.ico             # Browser tab icon
├── layout.tsx              # Root layout (Server Component)
│                           # → Sets HTML, fonts, metadata, providers
├── page.tsx                # Home page (Server Component)
│                           # → Assembles Navbar + sections + Footer
└── providers.tsx           # Client-side provider boundary
                            # → ThemeProvider + QueryClientProvider
```

**Key decisions:**
- `layout.tsx` is a **Server Component** for maximum performance — no `"use client"` 
- `providers.tsx` is isolated as a **Client Component** boundary
- All Next.js metadata and viewport config lives in `layout.tsx`

---

## `components/` — React Components

### `components/common/` — Primitive shared components

| File | Purpose |
|---|---|
| `logo.tsx` | Animated SVG logo mark + wordmark. Multiple sizes, link/div modes |
| `theme-toggle.tsx` | Animated sun/moon button using `next-themes` |

### `components/layout/` — Page structure components

| File | Purpose |
|---|---|
| `navbar.tsx` | Sticky glass navbar with scroll detection, mobile menu |
| `sidebar.tsx` | Collapsible dashboard sidebar with grouped nav |
| `footer.tsx` | Rich multi-column footer with social links |
| `container.tsx` | Responsive max-width container (narrow/wide variants) |

### `components/sections/` — Landing page sections

| File | Purpose |
|---|---|
| `hero.tsx` | Above-the-fold hero with animated headline, preview card, stats |
| `features.tsx` | 6-card feature grid with glassmorphism and icon colors |
| `social-proof.tsx` | Testimonials + trust pillars + final CTA |

### `components/ui/` — Design system primitives

| File | Purpose |
|---|---|
| `button.tsx` | CVA-powered button: 7 variants × 8 sizes, loading state, icons |
| `badge.tsx` | Status/label badge: 8 variants including `ai` and `new` gradient |
| `card.tsx` | Compound card: Root + Header + Title + Description + Content + Footer |

---

## `styles/` — Global Design System CSS

```
styles/
└── globals.css             # All design tokens as CSS custom properties
                            # Both light + dark themes defined here
                            # Keyframe animations, utility classes
```

This is the **single source of truth** for all visual tokens. No hardcoded colors anywhere in components.

---

## `config/` — Site Configuration

```
config/
└── site.ts                 # siteConfig: metadata, OG, Twitter
                            # mainNav: top nav links
                            # footerNav: grouped footer links  
                            # sidebarNav: dashboard navigation
                            # featureCards: home page feature data
                            # featureFlags: feature on/off switches
```

---

## `constants/` — Application Constants

```
constants/
└── index.ts                # APP_NAME, LAYOUT dimensions
                            # BREAKPOINTS, STORAGE_KEYS
                            # DURATION timings, ROUTES enum
                            # EXTERNAL_URLS, QUERY_KEYS
                            # HERO_STATS, GRADIENTS
```

No magic strings or numbers in components — everything references `constants/`.

---

## `hooks/` — Custom React Hooks

```
hooks/
├── use-sidebar.ts          # Sidebar collapse + keyboard shortcut (⌘B)
├── use-media-query.ts      # Reactive CSS media query hook (SSR-safe)
└── use-local-storage.ts    # localStorage with cross-tab sync
```

---

## `lib/` — Shared Utilities

```
lib/
└── utils.ts                # cn() — Tailwind class merger (clsx + twMerge)
                            # Format: formatCompact, formatDate, formatRelativeTime
                            # String: truncate, toTitleCase, toSlug, getInitials
                            # Array: range, shuffle, groupBy
                            # Object: pick, omit
                            # DOM: isBrowser, getLocalStorage, setLocalStorage
                            # Async: sleep, debounce, throttle
```

---

## `store/` — Zustand State

```
store/
└── ui.store.ts             # UIStore: sidebar, mobileNav, modals, commandPalette
                            # Persists sidebar state to localStorage via middleware
                            # Exports fine-grained selectors to prevent over-renders
```

---

## `types/` — TypeScript Definitions

```
types/
└── index.ts                # NavItem, SidebarItem
                            # Theme, UIState, UIActions
                            # Size, Variant, ColorScheme
                            # FeatureCard, Testimonial, Stat, PricingTier
                            # SiteConfig
                            # ApiResponse, ApiError
                            # Utility: Nullable, Prettify, WithChildren, RequireFields
```

---

## `public/` — Static Assets

Reserved for static images, fonts, OG images, and other public assets.

```
public/
└── favicon.ico             # (default from scaffold)
```

---

## `tailwind.config.ts` — Design Token Extensions

Extends Tailwind with all custom tokens:
- `colors.brand.*` — primary purple scale
- `colors.accent.*` — cyan, indigo, rose, amber, emerald
- `colors.background.*`, `colors.surface.*`, `colors.border.*`, `colors.text.*`
- `fontFamily.sans`, `.display`, `.mono`
- `spacing.sidebar`, `.sidebar-collapsed`, `.navbar`
- `borderRadius.*` — all 9 radii
- `boxShadow.brand`, `.glow`
- All custom keyframe animations

---

## Scripts Reference

| Script | Command | Purpose |
|---|---|---|
| `dev` | `next dev` | Start Turbopack dev server |
| `build` | `next build` | Production build |
| `start` | `next start` | Run production server |
| `lint` | `next lint` | Run ESLint |
| `lint:fix` | `next lint --fix` | Auto-fix ESLint errors |
| `type-check` | `tsc --noEmit` | TypeScript validation |
| `format` | `prettier --write` | Format all files |
| `format:check` | `prettier --check` | Check formatting |
