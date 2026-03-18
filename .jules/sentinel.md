## 2025-02-14 - Hardcoded Secret Removal in App.jsx
**Vulnerability:** A hardcoded admin password ("build2025") was present in `App.jsx`, used to access a "System Override" interface.
**Learning:** Hardcoded secrets in frontend source code are exposed to users, especially since this is a React application where the source is ultimately bundled and served to the client. This bypasses the intended authentication mechanism for the admin dashboard.
**Prevention:** Always use environment variables (e.g., `import.meta.env.VITE_ADMIN_PASS`) to manage secrets, and for more robust security, avoid embedding administrative secrets in client-side code entirely; perform authentication on the backend instead.

## 2025-03-17 - Client-Side Authentication Refactor
**Vulnerability:** Even when using environment variables, client-side authentication checks (e.g., `pass === import.meta.env.VITE_ADMIN_PASS`) expose the secret value in the built JavaScript bundle.
**Learning:** Any secret used in a client-side comparison is effectively public. A malicious user can inspect the bundle or memory to retrieve the value.
**Prevention:** Move authentication logic to a secure backend. As a temporary mitigation in frontend-only apps, use an asynchronous flow and a cryptographic hash (e.g., SHA-256) for comparisons. This ensures that the raw secret is not stored in the client-side bundle, though it remains vulnerable to brute-force or pre-computation attacks compared to a true backend implementation.
