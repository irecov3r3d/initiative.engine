## 2026-03-15 - Heavy Static DOM in High-Frequency Render Paths
**Learning:** Co-locating heavy, static UI elements (like complex blurred gradients) within components that undergo high-frequency state updates (e.g., interval timers) causes severe VDOM thrashing. In App.jsx, a 1-second timer triggered full re-renders of expensive CSS filters.
**Action:** Extract heavy, static elements into their own components wrapped in React.memo() to isolate them from high-frequency state changes.

## 2026-03-18 - High-Frequency State in Parent Component
**Learning:** Managing high-frequency, interval-based state (like a 1-second countdown timer) in the top-level parent component forces re-rendering of the entire component tree on every tick.
**Action:** Extract high-frequency state into dedicated, localized child components (e.g., `<BreathCountdown />`) and use `setTimeout` for slower phase transitions in the parent.

## 2026-03-24 - Cryptographic Thrashing on Keypress
**Learning:** Attaching expensive, asynchronous cryptographic operations (like `crypto.subtle.digest` via `TextEncoder`) directly to high-frequency events (like keystrokes in a `useEffect` monitoring a controlled input) causes the main thread to queue an excessive number of unresolved promises, leading to severe input lag on slower devices.
**Action:** Always debounce asynchronous, compute-intensive tasks triggered by user input using `setTimeout` and `clearTimeout` within the `useEffect` cleanup function.
