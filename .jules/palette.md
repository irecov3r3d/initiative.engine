## 2024-05-24 - Native Disabled States for Interactive Cards
**Learning:** Custom interactive elements (like cards built with `<button>`) often rely on CSS for visual disabled states but miss the native `disabled` attribute, allowing focus and requiring manual click prevention.
**Action:** Always use the native `disabled` attribute on `<button>` elements when they should be inactive, preventing both keyboard focus and click events naturally while improving semantic accessibility for screen readers.

## 2026-03-16 - Emergency Exits in Step-Based Flows
**Learning:** Users can feel trapped when entering a focused, step-based workflow (like a breathing session) if there's no clear, intuitive way to cancel or go back before the action begins. Without a 'Cancel' button, the only option is often to reload the page or complete the unwanted action.
**Action:** Always provide an 'emergency exit' or 'Cancel' option on the initial screen of a focused multi-step workflow.
