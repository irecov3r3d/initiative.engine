## 2026-03-15 - Heavy Static DOM in High-Frequency Render Paths
**Learning:** Co-locating heavy, static UI elements (like complex blurred gradients) within components that undergo high-frequency state updates (e.g., interval timers) causes severe VDOM thrashing. In App.jsx, a 1-second timer triggered full re-renders of expensive CSS filters.
**Action:** Extract heavy, static elements into their own components wrapped in React.memo() to isolate them from high-frequency state changes.

## 2026-03-15 - Avoid Inline Data Structures in Hot Paths
**Learning:** Defining data structures (like arrays or objects) inside functions or loops leads to unnecessary memory allocations and garbage collection overhead on every execution. In `App.jsx`, a milestone array `[7, 14, 30, 60]` was being created on every session completion call.
**Action:** Move static data structures to constants outside of the component or function. Use a `Set` for membership checks (`.includes()` vs `.has()`) to achieve O(1) lookup time, especially when the check is performed frequently or against larger data sets.
