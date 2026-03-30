## 2024-03-17 - Consistent Keyboard Focus on Secondary Actions
**Learning:** Many secondary buttons in custom React apps lose default keyboard focus styles when custom Tailwind classes are applied, making keyboard navigation difficult for screen reader or power users. Disabled states on custom buttons also often lack visual distinction (e.g. opacity-50) if not explicitly set.
**Action:** Always add focus-visible:ring and opacity-50 (for disabled) to custom buttons to ensure a11y standards.

## 2024-05-18 - Single-Input Keyboard Submission
**Learning:** For forms containing only a single input (e.g., a one-word check-in), users expect to be able to submit by pressing the 'Enter' key. Forcing them to navigate away from the input to click a "Complete" button disrupts the keyboard-first flow.
**Action:** Always add an `onKeyDown` handler to single inputs to trigger the submit action when `e.key === 'Enter'`, ensuring any necessary validation (like checking if the input is empty) is performed before submission.

## 2024-10-25 - Decorative Icons Screen Reader Noise
**Learning:** `lucide-react` icons are often used purely for visual decoration alongside descriptive text. If these decorative icons lack `aria-hidden="true"`, screen readers may announce them or their SVG properties, creating a confusing and noisy experience for visually impaired users.
**Action:** Always add `aria-hidden="true"` to purely decorative icons (like `<Heart>`, `<CheckCircle2>`, etc.) to ensure a clean and accessible screen reader experience.
## 2024-05-30 - Context-Aware Titles for Dynamically Disabled Elements
**Learning:** In highly interactive apps like `initiative.engine` where primary UI elements (like Start Session or Complete buttons) are dynamically disabled based on complex state logic (e.g., already completed today, missing required input), standard `disabled` attributes are insufficient. Users are often left wondering *why* the button is inactive.
**Action:** Always provide a descriptive, state-aware `title` attribute (or a tooltip component) alongside the `disabled` property. This simple addition clarifies the requirements for interaction (e.g., "Enter a check-in word to complete") rather than leaving the user to guess.

## 2024-11-20 - Dynamic Visual Timers Require Audio Pairing
**Learning:** For features that guide the user through a time-based visual sequence (e.g., a breathing exercise with expanding/contracting circles and a fast countdown), relying strictly on visuals completely blocks visually impaired users. Standard `aria-label`s on containers do not dynamically announce fast-changing states.
**Action:** When creating a guided sequence, place `aria-live="assertive"` on the semantic text that describes the current phase (e.g., "Inhale", "Exhale"). Simultaneously, to prevent the screen reader from overwhelmingly spamming the user with rapidly changing numbers, place `aria-hidden="true"` on the literal numerical countdown ticking every second.

## 2024-03-30 - Add Dynamic Helper Text to Single-Input Forms
**Learning:** For strict form inputs with hidden keyboard shortcuts, users might not know they can submit using 'Enter'.
**Action:** Use dynamic `aria-live="polite"` helper text bound to the input via `aria-describedby` to progressively explain constraints and reveal shortcuts.
