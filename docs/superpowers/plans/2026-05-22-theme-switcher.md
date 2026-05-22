# Theme Switcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Light / Grey / Dark theme switcher to ai-trust-chat using CSS custom properties controlled by a `data-theme` attribute, with a toggle in the app header and localStorage persistence.

**Architecture:** CSS variables are defined per theme on `[data-theme]` selectors in `App.css`; all hardcoded colours are replaced with `var(--variable)` references. A new `ThemeToggle.jsx` component renders three icon buttons. `App.jsx` holds theme state (initialised from localStorage / `prefers-color-scheme`), applies `data-theme` to the root div, persists changes to localStorage, and renders a new `<header>` bar containing the toggle.

**Tech Stack:** React 18, Vite 5, CSS custom properties (`var()`), `localStorage`, `window.matchMedia`.

---

## File Map

| File | Change |
|---|---|
| `client/src/App.css` | Add CSS variable blocks for 3 themes; replace every hardcoded colour with `var()`; add `.app-header` and `.theme-btn` styles |
| `client/src/components/ThemeToggle.jsx` | **Create** — renders ☀️ / 🌥 / 🌙 buttons; props: `theme`, `setTheme` |
| `client/src/App.jsx` | Add `theme` state + `getInitialTheme`; `data-theme` on root div; `useEffect` to persist; render `<header>` with `ThemeToggle` |

---

## Task 1: Add CSS Variables and Theme Styles to App.css

**Files:**
- Modify: `C:\Users\Sarath Marson\ai-trust-chat\client\src\App.css`

This task replaces the entire `App.css` with a version that has CSS variable definitions at the top and uses `var()` everywhere instead of hardcoded hex/rgba values. It also adds the `.app-header` and `.theme-btn` styles needed by Tasks 2 and 3.

After this task, `npm run build` must pass. The app will still look like the dark theme visually because `data-theme` isn't set on the root div yet — that comes in Task 3. The CSS is valid and ready.

- [ ] **Step 1: Replace `client/src/App.css` with the version below**

Replace the entire file with:

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Theme Variables ─────────────────────────────────────────── */
[data-theme="light"] {
  --bg-base:            #f8fafc;
  --bg-panel:           #f1f5f9;
  --bg-input:           #ffffff;
  --bg-message-ai:      #e2e8f0;
  --border:             #cbd5e1;
  --text-primary:       #1e293b;
  --text-secondary:     #475569;
  --text-muted:         #94a3b8;
  --accent:             #6366f1;
  --trust-banner-bg:    rgba(234,179,8,0.1);
  --trust-banner-border:rgba(234,179,8,0.4);
  --trust-banner-text:  #92400e;
}

[data-theme="grey"] {
  --bg-base:            #1e2330;
  --bg-panel:           #252d3d;
  --bg-input:           #2d3748;
  --bg-message-ai:      #2d3748;
  --border:             #374151;
  --text-primary:       #e2e8f0;
  --text-secondary:     #94a3b8;
  --text-muted:         #64748b;
  --accent:             #818cf8;
  --trust-banner-bg:    rgba(234,179,8,0.12);
  --trust-banner-border:rgba(234,179,8,0.25);
  --trust-banner-text:  #f59e0b;
}

[data-theme="dark"] {
  --bg-base:            #0f1117;
  --bg-panel:           #161925;
  --bg-input:           #1e2333;
  --bg-message-ai:      #1e2333;
  --border:             #2d3553;
  --text-primary:       #e2e8f0;
  --text-secondary:     #94a3b8;
  --text-muted:         #64748b;
  --accent:             #6366f1;
  --trust-banner-bg:    rgba(234,179,8,0.1);
  --trust-banner-border:rgba(234,179,8,0.3);
  --trust-banner-text:  #fbbf24;
}

body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: var(--bg-base);
  color: var(--text-primary);
  height: 100vh;
  overflow: hidden;
}

.app { display: flex; flex-direction: column; height: 100vh; }

/* App Header */
.app-header {
  background: var(--bg-panel);
  border-bottom: 1px solid var(--border);
  padding: 8px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}
.app-header-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.02em;
}
.theme-toggle { display: flex; gap: 4px; }
.theme-btn {
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  color: var(--text-muted);
}
.theme-btn:hover { background: var(--bg-input); border-color: var(--border); }
.theme-btn.active { background: var(--bg-input); border-color: var(--accent); }

/* Trust Banner */
.trust-banner {
  background: var(--trust-banner-bg);
  border-bottom: 1px solid var(--trust-banner-border);
  padding: 8px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--trust-banner-text);
  flex-shrink: 0;
}
.trust-banner strong { color: var(--trust-banner-text); }

/* Panels */
.panels { display: grid; grid-template-columns: 380px 1fr; flex: 1; overflow: hidden; }

/* Operator Panel */
.operator-panel {
  background: var(--bg-panel);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 20px;
  gap: 16px;
}
.panel-title {
  font-size: 11px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.1em; color: var(--accent);
}
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 12px; color: var(--text-secondary); font-weight: 500; }
.field-input, .field-select {
  background: var(--bg-input); border: 1px solid var(--border); border-radius: 6px;
  color: var(--text-primary); padding: 8px 12px; font-size: 13px; outline: none; width: 100%;
  transition: border-color 0.15s;
}
.field-input:focus, .field-select:focus { border-color: var(--accent); }
.field-select option { background: var(--bg-input); }
.prompt-preview-label { font-size: 10px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
.prompt-preview {
  background: var(--bg-base); border: 1px solid var(--border); border-radius: 6px;
  padding: 10px 12px; font-size: 11px; color: var(--text-muted); font-family: monospace;
  line-height: 1.6; min-height: 72px; resize: none; width: 100%;
}
.btn-apply {
  background: linear-gradient(135deg,#6366f1,#8b5cf6); color: white; border: none;
  border-radius: 6px; padding: 10px; font-size: 13px; font-weight: 600;
  cursor: pointer; width: 100%; transition: opacity 0.15s;
}
.btn-apply:hover { opacity: 0.85; }
.applied-badge { font-size: 11px; color: #10b981; text-align: center; }

/* Chat Panel */
.chat-panel { display: flex; flex-direction: column; overflow: hidden; background: var(--bg-base); }
.chat-header {
  padding: 12px 20px; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
}
.chat-title {
  font-size: 11px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.1em; color: var(--text-muted); display: flex; align-items: center; gap: 8px;
}
.persona-badge {
  background: rgba(99,102,241,0.15); color: var(--accent);
  border: 1px solid rgba(99,102,241,0.3); border-radius: 999px;
  padding: 2px 10px; font-size: 11px; font-weight: 500; text-transform: none; letter-spacing: 0;
}
.btn-clear {
  background: transparent; border: 1px solid var(--border); color: var(--text-muted);
  border-radius: 6px; padding: 4px 12px; font-size: 11px; cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.btn-clear:hover { border-color: var(--text-secondary); color: var(--text-secondary); }

/* Message List */
.message-list { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
.message { display: flex; flex-direction: column; max-width: 75%; }
.message.user { align-self: flex-end; align-items: flex-end; }
.message.assistant { align-self: flex-start; }
.message.error { align-self: center; max-width: 90%; }
.message-bubble {
  padding: 10px 14px; border-radius: 12px; font-size: 14px;
  line-height: 1.6; white-space: pre-wrap; word-break: break-word;
}
.message.user .message-bubble { background: var(--accent); color: white; border-bottom-right-radius: 4px; }
.message.assistant .message-bubble { background: var(--bg-message-ai); color: var(--text-primary); border-bottom-left-radius: 4px; }
.message.error .message-bubble {
  background: rgba(239,68,68,0.15); color: #fca5a5;
  border: 1px solid rgba(239,68,68,0.3); border-radius: 8px;
}
.streaming-cursor::after { content: '▋'; animation: blink 0.7s step-end infinite; color: var(--accent); }
@keyframes blink { 50% { opacity: 0; } }
.empty-state {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  justify-content: center; color: var(--text-muted); gap: 8px; font-size: 14px;
}
.empty-state .icon { font-size: 36px; }

/* Message Input */
.message-input-row {
  padding: 16px 20px; border-top: 1px solid var(--border);
  display: flex; gap: 10px; flex-shrink: 0;
}
.message-input {
  flex: 1; background: var(--bg-input); border: 1px solid var(--border); border-radius: 8px;
  color: var(--text-primary); padding: 10px 14px; font-size: 14px; outline: none;
  resize: none; min-height: 42px; max-height: 120px; font-family: inherit;
  transition: border-color 0.15s;
}
.message-input:focus { border-color: var(--accent); }
.message-input::placeholder { color: var(--text-secondary); }
.btn-send {
  background: var(--accent); color: white; border: none; border-radius: 8px;
  padding: 10px 20px; font-size: 14px; font-weight: 600; cursor: pointer;
  transition: opacity 0.15s; white-space: nowrap; align-self: flex-end;
}
.btn-send:hover:not(:disabled) { opacity: 0.85; }
.btn-send:disabled { opacity: 0.4; cursor: not-allowed; }
```

- [ ] **Step 2: Verify the build passes**

```bash
cd "C:\Users\Sarath Marson\ai-trust-chat"
npm run build
```

Expected output:
```
vite v5.x.x building for production...
✓ built in ...ms
```

No errors. (The app will still render the dark theme visually because `data-theme` isn't wired up yet — that's fine.)

- [ ] **Step 3: Run backend tests to confirm nothing broken**

```bash
cd "C:\Users\Sarath Marson\ai-trust-chat"
npm test
```

Expected: `8 passing` — all backend tests still green.

- [ ] **Step 4: Commit**

```bash
cd "C:\Users\Sarath Marson\ai-trust-chat"
git add client/src/App.css
git commit -m "feat: add CSS theme variables and replace hardcoded colours with var()"
```

---

## Task 2: Create ThemeToggle.jsx

**Files:**
- Create: `C:\Users\Sarath Marson\ai-trust-chat\client\src\components\ThemeToggle.jsx`

A simple presentational component. Receives `theme` (current theme key: `'light'`, `'grey'`, or `'dark'`) and `setTheme` (setter function) as props. Renders three icon buttons in a row. The active button gets the `.active` CSS class (styled in Task 1's App.css with an accent-coloured border).

- [ ] **Step 1: Create `client/src/components/ThemeToggle.jsx`**

```jsx
export default function ThemeToggle({ theme, setTheme }) {
  const themes = [
    { key: 'light', icon: '☀️', label: 'Light' },
    { key: 'grey',  icon: '🌥',  label: 'Grey'  },
    { key: 'dark',  icon: '🌙',  label: 'Dark'  },
  ]

  return (
    <div className="theme-toggle">
      {themes.map(({ key, icon, label }) => (
        <button
          key={key}
          className={`theme-btn${theme === key ? ' active' : ''}`}
          onClick={() => setTheme(key)}
          title={label}
          aria-label={`Switch to ${label} theme`}
          aria-pressed={theme === key}
        >
          {icon}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Verify the build passes**

```bash
cd "C:\Users\Sarath Marson\ai-trust-chat"
npm run build
```

Expected: `✓ built in ...ms` — no errors.

- [ ] **Step 3: Commit**

```bash
cd "C:\Users\Sarath Marson\ai-trust-chat"
git add client/src/components/ThemeToggle.jsx
git commit -m "feat: add ThemeToggle component (Light / Grey / Dark)"
```

---

## Task 3: Wire Theme State into App.jsx

**Files:**
- Modify: `C:\Users\Sarath Marson\ai-trust-chat\client\src\App.jsx`

This task:
1. Adds `getInitialTheme()` — reads `localStorage` key `ai-trust-chat-theme`, falls back to `prefers-color-scheme`
2. Adds `theme` state initialised from `getInitialTheme`
3. Adds `useEffect` to persist theme changes to `localStorage`
4. Applies `data-theme={theme}` to the root `<div className="app">`
5. Renders a new `<header className="app-header">` bar containing the app title and `<ThemeToggle>`

After this task, the full feature is live: theme switches instantly, choice persists across page reloads, default is Light (or user's system preference on first visit).

- [ ] **Step 1: Replace `client/src/App.jsx` with the version below**

```jsx
import { useState, useEffect } from 'react'
import TrustBanner from './components/TrustBanner.jsx'
import OperatorPanel from './components/OperatorPanel.jsx'
import ChatPanel from './components/ChatPanel.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'

function getInitialTheme() {
  const saved = localStorage.getItem('ai-trust-chat-theme')
  if (saved) return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const [activePersona, setActivePersona] = useState('Default Assistant')
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    localStorage.setItem('ai-trust-chat-theme', theme)
  }, [theme])

  return (
    <div className="app" data-theme={theme}>
      <header className="app-header">
        <span className="app-header-title">AI Trust Level Chat</span>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </header>
      <TrustBanner />
      <div className="panels">
        <OperatorPanel onApply={setActivePersona} />
        <ChatPanel activePersona={activePersona} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Run the dev server and verify all three themes work**

```bash
cd "C:\Users\Sarath Marson\ai-trust-chat"
npm run dev
```

Open http://localhost:5173 in a browser. Verify:
- App loads with **Light theme** (white/off-white background) — default for new visitors
- Clicking ☀️ applies the light theme (bright background, dark text)
- Clicking 🌥 applies the grey theme (dark slate `#1e2330` background)
- Clicking 🌙 applies the dark theme (deep black `#0f1117` background)
- The active button shows an accent-coloured border
- Refreshing the page keeps the last-selected theme (localStorage persistence)
- All UI elements (trust banner, operator panel, inputs, chat messages) use the correct colours in each theme

Stop the server (Ctrl+C).

- [ ] **Step 3: Run backend tests**

```bash
cd "C:\Users\Sarath Marson\ai-trust-chat"
npm test
```

Expected: `8 passing`

- [ ] **Step 4: Run production build**

```bash
cd "C:\Users\Sarath Marson\ai-trust-chat"
npm run build
```

Expected: `✓ built in ...ms` — no errors.

- [ ] **Step 5: Commit**

```bash
cd "C:\Users\Sarath Marson\ai-trust-chat"
git add client/src/App.jsx
git commit -m "feat: wire theme state, localStorage persistence, and app header toggle"
```

---

## Task 4: Push and Deploy via CI/CD

No new files — this task pushes the feature commits through the existing CI/CD pipeline and tags a new release for GitHub Pages deployment.

- [ ] **Step 1: Push to trigger CI**

```bash
cd "C:\Users\Sarath Marson\ai-trust-chat"
git push personal main
```

- [ ] **Step 2: Verify CI passes on GitHub**

Go to `https://github.com/sarathmarson/ai-trust-chat/actions`

Expected:
- A new `CI` workflow run appears for the latest commit
- All steps pass: Checkout → Install → Test → Build
- Green ✅ on the commit

- [ ] **Step 3: Tag v1.1.0 to trigger the release workflow**

```bash
cd "C:\Users\Sarath Marson\ai-trust-chat"
git tag v1.1.0
git push personal v1.1.0
```

- [ ] **Step 4: Verify GitHub Pages deployment**

Go to `https://github.com/sarathmarson/ai-trust-chat/actions`

Expected: A `Release` workflow run appears and completes successfully (≈2 minutes).

Then open `https://sarathmarson.github.io/ai-trust-chat` — the live app now shows the theme toggle ☀️ 🌥 🌙 in the header. Clicking the buttons switches themes.
