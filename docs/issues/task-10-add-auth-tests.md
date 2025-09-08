# Task 10 — Add Targeted Tests for Authentication Flows

## Executive Summary
Add focused unit/integration tests for `AuthContext` covering login, token-refresh success, and refresh failure leading to logout. Use generated client mocks and Vitest fake timers to simulate expiry/refresh behaviour. These tests will boost coverage to meet the new thresholds from Task 5 and validate the refactors shipped in Tasks 1–3 [1][2][3][4].

---

## GitHub Issue (copy-paste into a new issue)

**Title:** Add Tests for AuthContext Login/Refresh Flows (Generated Client Mocks)

### Background
Now that:
• canonical endpoints exist (Task 1),  
• frontend config is aligned (Task 2), and  
• `AuthContext` relies solely on the generated client (Task 3),  

we need deterministic tests for the core authentication lifecycle to lock in behaviour and raise coverage.

### Goals
1. High-confidence tests for login, scheduled refresh, and failure handling.  
2. Use lightweight generated-client mocks (no MSW).  
3. Raise `AuthContext.tsx` line coverage to ≥ 60 %.

### Scope
• `client/src/contexts/AuthContext.tsx` – implementation under test  
• New test file `client/src/contexts/AuthContext.test.tsx` (name may vary)

### Detailed Requirements
1. **Login flow**  
   – Mock generated client login method (`/api/token/`) to resolve `{ access, refresh }`.  
   – Render a component tree with `<AuthProvider>` and a child that consumes context.  
   – Trigger `login()` via context; assert:  
     • `isAuthenticated === true`,  
     • `setAuthToken(access)` invoked,  
     • a refresh timer is scheduled (`setTimeout` spy count).

2. **Refresh success**  
   – Use `vi.useFakeTimers()`; advance time to just before expiry (e.g., 55 min on a 60 min token).  
   – Mock refresh endpoint (`/api/token/refresh/`) to resolve a new `access`.  
   – Assert `access` token in context is updated and a new timer is scheduled.

3. **Refresh failure → logout**  
   – Mock refresh endpoint to reject with 401.  
   – Advance timers; assert context becomes unauthenticated, timers cleared (`clearTimeout` called), and OpenAPI auth token removed.

4. **Test harness**  
   – Use React Testing Library (RTL) helpers.  
   – No MSW; mocks created via `vi.spyOn` or module stubbing.  
   – Restore all spies/timers after each test.

### Acceptance Criteria
• New test file exists and `npm run test` passes.  
• `AuthContext.tsx` line coverage ≥ 60 % (functions/statements similar).  
• No MSW import warnings.

### Verification Steps
```bash
npm run test -- --coverage
# Inspect summary; expect >= 60 % lines for AuthContext.tsx
```

### Risks / Notes
• Time-based logic is tricky—ensure `vi.runOnlyPendingTimers()` / `vi.advanceTimersByTime()` used consistently.  
• Keep mocks test-local; do **not** modify production code solely to make it more “mockable.”

### Branch & PR
• **Branch:** `test/authcontext-login-refresh`  
• **PR title:** `test(auth): add AuthContext login/refresh tests using generated client mocks`

---

## Optimal Droid Prompt (for a code-execution agent)

```
Goal: Implement unit/integration tests for AuthContext login and refresh flows.

1) Prep
   git checkout main && git pull --ff-only
   git switch -c test/authcontext-login-refresh

2) Create tests
   mkdir -p client/src/contexts
   touch client/src/contexts/AuthContext.test.tsx
   # Implement tests:
   #  • mock generated AuthService.login() and AuthService.refresh()
   #  • vi.useFakeTimers() to control time
   #  • RTL to render <AuthProvider> and invoke context methods
   #  • assertions per requirements

3) Run coverage
   npm run test -- --coverage
   # ensure AuthContext.tsx >= 60 % lines

4) Commit & PR
   git add client/src/contexts/AuthContext.test.tsx
   git commit -m "test(auth): add AuthContext login/refresh tests using generated client mocks"
   git push -u origin test/authcontext-login-refresh
```

---

## Sources
1. `client/src/contexts/AuthContext.tsx`  
2. `client/src/api/generated/services/AuthService.ts` (or equivalent)  
3. `docs/frontend_testing_guide.md`  
4. `docs/UAT_TASKS.md`
