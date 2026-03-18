## 2024-03-17 - Consistent Keyboard Focus on Secondary Actions
**Learning:** Many secondary buttons in custom React apps lose default keyboard focus styles when custom Tailwind classes are applied, making keyboard navigation difficult for screen reader or power users. Disabled states on custom buttons also often lack visual distinction (e.g. opacity-50) if not explicitly set.
**Action:** Always add focus-visible:ring and opacity-50 (for disabled) to custom buttons to ensure a11y standards.

## 2024-05-18 - Single-Input Keyboard Submission
**Learning:** For forms containing only a single input (e.g., a one-word check-in), users expect to be able to submit by pressing the 'Enter' key. Forcing them to navigate away from the input to click a "Complete" button disrupts the keyboard-first flow.
**Action:** Always add an `onKeyDown` handler to single inputs to trigger the submit action when `e.key === 'Enter'`, ensuring any necessary validation (like checking if the input is empty) is performed before submission.
