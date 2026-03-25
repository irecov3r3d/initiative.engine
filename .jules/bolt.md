## 2026-03-15 - Heavy Static DOM in High-Frequency Render Paths
**Learning:** Co-locating heavy, static UI elements (like complex blurred gradients) within components that undergo high-frequency state updates (e.g., interval timers) causes severe VDOM thrashing. In App.jsx, a 1-second timer triggered full re-renders of expensive CSS filters.
**Action:** Extract heavy, static elements into their own components wrapped in React.memo() to isolate them from high-frequency state changes.

## 2026-03-18 - High-Frequency State in Parent Component
**Learning:** Managing high-frequency, interval-based state (like a 1-second countdown timer) in the top-level parent component forces re-rendering of the entire component tree on every tick.
**Action:** Extract high-frequency state into dedicated, localized child components (e.g., `<BreathCountdown />`) and use `setTimeout` for slower phase transitions in the parent.

## 2026-03-20 - Expensive Operations on Input Keystrokes
**Learning:** Running expensive asynchronous operations like cryptographic hashing (`crypto.subtle.digest`) on every keystroke in a controlled input blocks the main thread and causes severe VDOM thrashing.
**Action:** Debounce expensive operations tied to input changes using `setTimeout` in the `useEffect` and clearing the timeout in the cleanup function.

## 2026-03-21 - ArrayBuffer to Hex String Conversion
**Learning:** Using `Array.from(new Uint8Array(buffer)).map(b => b.toString(16)).join('')` inside high-frequency execution paths creates significant intermediate object allocation (an array, mapped objects, string chunks) triggering excessive garbage collection.
**Action:** Use a raw `for` loop over the `Uint8Array` view to iteratively concatenate strings (`hashHex += view[i].toString(16)`), keeping memory overhead low and execution time faster. Additionally, extract instances of objects like `TextEncoder` outside of component scope.

## 2026-03-25 - O(1) Lookup Over Inline Array Instantiation
**Learning:** Using an inline array for membership checks inside a function causes unnecessary per-call array allocation overhead.
**Action:** Use a module-level Set for O(1) lookup complexity and to eliminate per-call allocation overhead.
