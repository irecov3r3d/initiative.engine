## 2026-03-15 - Heavy Static DOM in High-Frequency Render Paths
**Learning:** Co-locating heavy, static UI elements (like complex blurred gradients) within components that undergo high-frequency state updates (e.g., interval timers) causes severe VDOM thrashing. In App.jsx, a 1-second timer triggered full re-renders of expensive CSS filters.
**Action:** Extract heavy, static elements into their own components wrapped in React.memo() to isolate them from high-frequency state changes.
