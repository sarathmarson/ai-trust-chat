# Theme Switcher — Design Spec

**Date:** 2026-05-22
**Status:** Approved
**Project:** `C:\Users\Sarath Marson\ai-trust-chat\`

---

## Overview

Add a theme switcher to ai-trust-chat using the global industry standard: CSS custom properties (variables) controlled by a `data-theme` attribute on `<html>`. Three themes: **Light** (default), **Grey**, **Dark**. A toggle in the app header lets users switch at any time. Choice persists in `localStorage`. On first visit, respects the system `prefers-color-scheme` setting.

**Pattern used by:** GitHub, VS Code, Notion, Linear, Tailwind docs.

---

## Themes

| Theme | Key | Background | Feel |
|---|---|---|---|
| **Light** | `light` | `#f8fafc` | Bright, high contrast, daylight-friendly — **default** |
| **Grey** | `grey` | `#1e2330` | Softer dark slate, balanced all-day use |
| **Dark** | `dark` | `#0f1117` | Deep black, easy on eyes at night |

---

## CSS Variables

All colours defined as CSS custom properties on `[data-theme]`. Components use variables — never hardcoded colours.

### Variables defined per theme

```css
[data-theme="light"] {
  --bg-base:       #f8fafc;
  --bg-panel:      #f1f5f9;
  --bg-input:      #ffffff;
  --bg-message-ai: #e2e8f0;
  --border:        #cbd5e1;
  --text-primary:  #1e293b;
  --text-secondary:#475569;
  --text-muted:    #94a3b8;
  --accent:        #6366f1;
  --trust-banner-bg:    rgba(234,179,8,0.1);
  --trust-banner-border:rgba(234,179,8,0.4);
  --trust-banner-text:  #92400e;
}

[data-theme="grey"] {
  --bg-base:       #1e2330;
  --bg-panel:      #252d3d;
  --bg-input:      #2d3748;
  --bg-message-ai: #2d3748;
  --border:        #374151;
  --text-primary:  #e2e8f0;
  --text-secondary:#94a3b8;
  --text-muted:    #64748b;
  --accent:        #818cf8;
  --trust-banner-bg:    rgba(234,179,8,0.12);
  --trust-banner-border:rgba(234,179,8,0.25);
  --trust-banner-text:  #f59e0b;
}

[data-theme="dark"] {
  --bg-base:       #0f1117;
  --bg-panel:      #161925;
  --bg-input:      #1e2333;
  --bg-message-ai: #1e2333;
  --border:        #2d3553;
  --text-primary:  #e2e8f0;
  --text-secondary:#94a3b8;
  --text-muted:    #64748b;
  --accent:        #6366f1;
  --trust-banner-bg:    rgba(234,179,8,0.1);
  --trust-banner-border:rgba(234,179,8,0.3);
  --trust-banner-text:  #fbbf24;
}
```

---

## Architecture

### New file

**`client/src/components/ThemeToggle.jsx`**
- Renders three icon buttons in the header: ☀️ Light · 🌥 Grey · 🌙 Dark
- Receives `theme` (current) and `setTheme` (setter) as props
- Active theme button is highlighted

### Modified files

**`client/src/App.css`**
- Add CSS variable definitions for all three themes (as above)
- Replace all hardcoded colour values with `var(--variable)` references
- Add `.app-header` styles for the new header bar containing the toggle

**`client/src/App.jsx`**
- Add `theme` state, initialized from `localStorage` or `prefers-color-scheme`
- Apply `data-theme={theme}` to root `<div className="app">`
- Persist theme changes to `localStorage`
- Render new `<AppHeader>` containing `<ThemeToggle>`

---

## Theme Initialization Logic

```js
function getInitialTheme() {
  const saved = localStorage.getItem('ai-trust-chat-theme')
  if (saved) return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
```

---

## Header Layout

```
┌─────────────────────────────────────────────────────┐
│  AI Trust Level Chat                    ☀️  🌥  🌙  │  ← new app-header
├─────────────────────────────────────────────────────┤
│  🔒 Trust Level 1 — Anthropic: Core guidelines...   │  ← existing TrustBanner
├──────────────────────┬──────────────────────────────┤
│  ⚙ Operator (L2)    │  💬 User Chat (L3)            │
└──────────────────────┴──────────────────────────────┘
```

---

## File Changes Summary

| File | Change |
|---|---|
| `client/src/components/ThemeToggle.jsx` | **Create** — 3-button toggle (Light / Grey / Dark) |
| `client/src/App.css` | **Modify** — add CSS variables, replace hardcoded colours, add header styles |
| `client/src/App.jsx` | **Modify** — add theme state, `data-theme` attribute, `AppHeader`, localStorage persistence |

---

## localStorage Key

`ai-trust-chat-theme` — stores `'light'`, `'grey'`, or `'dark'`

---

## CI/CD

After implementation:
- Push to main → CI runs (tests + build check) → green ✅ on commit
- Push version tag `v1.1.0` → Release workflow → deploys updated app to GitHub Pages

---

## Out of Scope

- Animated theme transitions (keep it instant)
- More than 3 themes
- Per-component theme overrides
- Custom colour picker
