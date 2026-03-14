## 2025-03-14 - Removed hardcoded admin password from system override
**Vulnerability:** A hardcoded plain-text string `"build2025"` was used as the admin override password in `App.jsx`, allowing anyone who can read the source code to bypass normal access controls and view the System Override panel.
**Learning:** Hardcoded secrets and credentials compromise the security of the application by permanently embedding sensitive information into the version control history and the distributed client code.
**Prevention:** Always use environment variables (e.g., `import.meta.env.VITE_ADMIN_PASS`) to manage secrets, and never hardcode credentials directly in the source code.
