## 2025-02-14 - Hardcoded Secret Removal in App.jsx
**Vulnerability:** A hardcoded admin password ("build2025") was present in `App.jsx`, used to access a "System Override" interface.
**Learning:** Hardcoded secrets in frontend source code are exposed to users, especially since this is a React application where the source is ultimately bundled and served to the client. This bypasses the intended authentication mechanism for the admin dashboard.
**Prevention:** Always use environment variables (e.g., `import.meta.env.VITE_ADMIN_PASS`) to manage secrets, and for more robust security, avoid embedding administrative secrets in client-side code entirely; perform authentication on the backend instead.
## 2025-02-14 - Input Validation & Length Limits in App.jsx
**Vulnerability:** Missing input length validation (`maxLength`) on the `adminPass` input and missing existence validation on `activeUser` before processing state.
**Learning:** These small oversights in frontend state management can lead to state corruption and potentially Denial of Service (DoS) due to processing arbitrarily long strings.
**Prevention:** Always add sensible `maxLength` limits to string inputs and always validate that a piece of state exists in a known collection or enum before updating the main application state using it.
## 2025-02-14 - Vite Environment Variable Bundle Exposure
**Vulnerability:** A fallback authentication check referenced `import.meta.env.VITE_ADMIN_PASS`, unintentionally embedding the plaintext password directly into the client-side JavaScript bundle, effectively bypassing the `VITE_ADMIN_PASS_HASH` mechanism.
**Learning:** Build tools like Vite statically replace `import.meta.env.VITE_*` variables with their values during the build process. Referencing sensitive environment variables anywhere in the frontend code, even within fallback or unused code paths, exposes those secrets to anyone inspecting the client bundle.
**Prevention:** Never prefix sensitive environment variables (like passwords or API secrets) with `VITE_` and never reference them in client-side code. Instead, pass only non-sensitive data (like hashes) or use a backend proxy for authentication. Fail securely if required environment configuration is missing, rather than falling back to plaintext.
## 2025-02-14 - Insecure Client-Side Session Management in App.jsx
**Vulnerability:** The admin authentication state (`isAdminAuth` and `adminPass`) persisted indefinitely in React state as long as the page wasn't refreshed, and abandoning a login attempt without submitting left the partial/full password in state.
**Learning:** In purely client-side applications (like this React dashboard) without a backend to handle traditional session invalidation, sensitive administrative access remains vulnerable if a user walks away from an unlocked device or abandons a login flow, as the state remains active in memory.
**Prevention:** Always explicitly clear sensitive state (like passwords) upon cancelling actions, and implement client-side timeout mechanisms (e.g., `setTimeout` linked to inactivity or session duration) to automatically invalidate authentication state and return to a secure default screen. Furthermore, always configure sensitive input fields with `autoComplete="off"` and `spellCheck="false"` to prevent browser leakage.
## 2025-02-14 - Authorization Bypass via State Persistence in App.jsx
**Vulnerability:** Navigating away from the admin panel without explicitly clearing the authentication state (`isAdminAuth`) allowed the session to persist in memory, potentially enabling unauthorized access if the application state was not refreshed.
**Learning:** Even with an inactivity timeout, user-initiated navigation away from a secure area must explicitly clear the authentication session to prevent immediate authorization bypass upon returning.
**Prevention:** Always explicitly clear authentication state (`setIsAdminAuth(false)`) when a user manually cancels or exits a secure session flow, in addition to automated timeout mechanisms.
## 2025-02-14 - Fix Timing Attack Vulnerability in Hash Comparison
**Vulnerability:** Timing attack in hash comparison using strict equality.
**Learning:** Using `===` for sensitive data comparison allows attackers to deduce the content of the secret by measuring time differences.
**Prevention:** Use constant-time comparison algorithms for all sensitive data verification.
