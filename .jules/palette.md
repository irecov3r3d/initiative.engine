## 2024-03-17 - Consistent Keyboard Focus on Secondary Actions
**Learning:** Many secondary buttons in custom React apps lose default keyboard focus styles when custom Tailwind classes are applied, making keyboard navigation difficult for screen reader or power users. Disabled states on custom buttons also often lack visual distinction (e.g. opacity-50) if not explicitly set.
**Action:** Always add focus-visible:ring and opacity-50 (for disabled) to custom buttons to ensure a11y standards.
