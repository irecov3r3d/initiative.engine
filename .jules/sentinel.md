## 2025-02-14 - Hardcoded Secret Removal in App.jsx
**Vulnerability:** A hardcoded admin password ("build2025") was present in `App.jsx`, used to access a "System Override" interface.
**Learning:** Hardcoded secrets in frontend source code are exposed to users, especially since this is a React application where the source is ultimately bundled and served to the client. This bypasses the intended authentication mechanism for the admin dashboard.
**Prevention:** Always use environment variables (e.g., `import.meta.env.VITE_ADMIN_PASS`) to manage secrets, and for more robust security, avoid embedding administrative secrets in client-side code entirely; perform authentication on the backend instead.
## 2025-02-14 - Input Validation & Length Limits in App.jsx
**Vulnerability:** Missing input length validation (`maxLength`) on the `adminPass` input and missing existence validation on `activeUser` before processing state.
**Learning:** These small oversights in frontend state management can lead to state corruption and potentially Denial of Service (DoS) due to processing arbitrarily long strings.
**Prevention:** Always add sensible `maxLength` limits to string inputs and always validate that a piece of state exists in a known collection or enum before updating the main application state using it.
