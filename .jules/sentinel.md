## 2025-02-14 - Hardcoded Secret Removal in App.jsx
**Vulnerability:** A hardcoded admin password ("build2025") was present in `App.jsx`, used to access a "System Override" interface.
**Learning:** Hardcoded secrets in frontend source code are exposed to users, especially since this is a React application where the source is ultimately bundled and served to the client. This bypasses the intended authentication mechanism for the admin dashboard.
**Prevention:** Always use environment variables (e.g., `import.meta.env.VITE_ADMIN_PASS`) to manage secrets, and for more robust security, avoid embedding administrative secrets in client-side code entirely; perform authentication on the backend instead.
