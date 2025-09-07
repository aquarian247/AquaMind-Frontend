# Task 6 — Remove Misleading Fallback Values From API Layer

## Executive Summary
`client/src/lib/api.ts` embeds hardcoded fallback values (e.g., `3500`, `21805000`) which can silently mask backend or mock-server behavior. Remove inline fallbacks and route data through the generated API client or the mock server. Keep test fixtures in tests only [1][2][3].

---

## GitHub Issue (copy-paste into a new issue)

**Title:** Remove Misleading Hardcoded Fallbacks From API Layer

### Background
Inline fallbacks in `client/src/lib/api.ts` create confusion and may produce inconsistent data across environments. We already have a mock server (`server/mock-api.ts`) and can inject test data in unit tests. The client layer should avoid hardcoded domain values [1][2].

### Goals
- Remove hardcoded fallbacks from the client API layer  
- Use generated client for real calls and mock server or test fixtures for development/tests

### Scope
- `client/src/lib/api.ts`  
- Grep for magic numbers and fallback constants

### Detailed Requirements
1. **Remove fallbacks**  
   - Delete or refactor branches that return literal constants such as `3500`, `21805000`, or similar domain values.  
   - If a function must provide defaults, they should be neutral (empty arrays, null/undefined) and clearly typed.

2. **Routing**  
   - When `VITE_USE_DJANGO_API` is true, always use the generated client.  
   - For local development without backend, prefer the Express mock API via `server/mock-api.ts` rather than inline fallbacks.

3. **Tests**  
   - Move any needed sample data into test fixtures (e.g., `client/src/__tests__/fixtures/*`).

### Acceptance Criteria
- `grep -R "\b3500\b\|\b21805000\b" client/src/lib/api.ts` returns no matches  
- No conditional branches in `client/src/lib/api.ts` return hardcoded domain values  
- `npm run type-check && npm run lint && npm run test` pass

### Verification Steps
```bash
grep -n "\b3500\b\|\b21805000\b" client/src/lib/api.ts || echo "OK"

npm run type-check && npm run lint && npm run test
```

### Risks / Notes
- If any UI relied on fixed values for layout, ensure tests define fixtures accordingly. Prefer visual constants to live in dedicated theming/config, not API code.

### Branch & PR
- **Branch:** `refactor/remove-hardcoded-fallbacks-from-api-layer`  
- **PR title:** `refactor(api): remove misleading hardcoded fallbacks from client API layer`

---

## Optimal Droid Prompt (for a code-execution agent)

```
Goal: Remove hardcoded fallbacks from client API layer and rely on generated client/mock server.

1) Prep
   git checkout main && git pull --ff-only
   git switch -c refactor/remove-hardcoded-fallbacks-from-api-layer

2) Edit
   - client/src/lib/api.ts: remove branches returning literal constants like 3500, 21805000
   - Ensure code uses generated client or calls out to mock API when backend is off

3) (Optional) Add test fixtures
   mkdir -p client/src/__tests__/fixtures
   # move any inline sample data into fixtures and import in tests

4) Quality gates
   grep -n "\\b3500\\b\\|\\b21805000\\b" client/src/lib/api.ts || echo OK
   npm run type-check && npm run lint && npm run test

5) Commit & PR
   git add -A
   git commit -m "refactor(api): remove misleading hardcoded fallbacks from client API layer"
   git push -u origin refactor/remove-hardcoded-fallbacks-from-api-layer
```

---

## Sources
1. `client/src/lib/api.ts`  
2. `server/mock-api.ts`  
3. `docs/UAT_TASKS.md`
