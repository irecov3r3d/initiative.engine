## 2024-05-24 - Native Disabled States for Interactive Cards
**Learning:** Custom interactive elements (like cards built with `<button>`) often rely on CSS for visual disabled states but miss the native `disabled` attribute, allowing focus and requiring manual click prevention.
**Action:** Always use the native `disabled` attribute on `<button>` elements when they should be inactive, preventing both keyboard focus and click events naturally while improving semantic accessibility for screen readers.
