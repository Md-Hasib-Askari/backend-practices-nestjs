# Exercise 1 Baseline Observation (CSRF Vulnerability)

## Goal
Demonstrate that a cookie-authenticated user can be tricked into sending a state-changing request without CSRF protection.

## Setup
1. Start Nest app:
   pnpm --dir ./project run start:dev
2. Open browser login page and create session:
   - Visit: http://localhost:3000/login-demo
   - Submit the form (default userId is alice)
3. Serve evil page from a separate origin:
   python3 -m http.server 5500
   Then open: http://localhost:5500/evil.html

## Expected Vulnerable Behavior
- The hidden form in evil.html auto-submits to POST http://localhost:3000/transfer.
- Server accepts request using victim session (req.session.userId) without CSRF token validation.
- Transfer executes even though user did not intentionally submit transfer from trusted app UI.

## Example Observation
- Login response: ok=true, userId=alice
- Server log after opening evil page:
  Transfer executed for user=alice, amount=10000, to=attacker-account
- Transfer response shows success with fromUserId=alice

This is the insecure baseline to fix in the next exercises.
