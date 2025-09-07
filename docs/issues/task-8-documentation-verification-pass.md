# Task 8 — Documentation Verification Pass

## Executive Summary
Ensure all documentation reflects the final state: canonical auth endpoints, removal of MSW, and consistent environment variable usage (`VITE_USE_DJANGO_API`). Purge stale references such as `/api/token/*`, `/api/auth/jwt/*`, `/api/v1/users/auth/token/*`, `VITE_USE_BACKEND_API`, `django-api.ts`, and `DJANGO_API_ALIGNMENT.md` [1][2][3][4][5].

---

## GitHub Issue (copy-paste into a new issue)

**Title:** Documentation Verification: Canonical Endpoints, No MSW, Env Var Consistency

### Background
Docs have been updated across multiple PRs. Perform a final verification pass to ensure consistency with code changes:
- Canonical `/api/v1/auth/token/*`
- No MSW usage
- Env var: `VITE_USE_DJANGO_API` only

### Goals
- Eliminate stale references
- Confirm examples and commands match repo reality

### Scope
- `README.md`
- `docs/*.md` (especially: `CONTRIBUTING.md`, `frontend_testing_guide.md`, `DJANGO_INTEGRATION_GUIDE.md`, `code_organization_guidelines.md`, `NAVIGATION_ARCHITECTURE.md`, `UAT_TASKS.md`)

### Detailed Requirements
1) Grep docs for stale patterns and remove/replace:
   - `MSW`, `/api/token/`, `/api/auth/jwt/`, `/api/v1/users/auth/token/`, `VITE_USE_BACKEND_API`, `django-api.ts`, `DJANGO_API_ALIGNMENT.md`.
2) Ensure command snippets compile with current scripts (`npm run test`, `npm run generate:api`).
3) Keep canonical auth endpoints and environment variable consistent in all examples.

### Acceptance Criteria
- Greps for stale patterns return no matches in docs
- All example commands run without errors

### Verification Steps
```bash
# search across docs
rg -n "MSW|/api/token/|/api/auth/jwt/|/api/v1/users/auth/token/|VITE_USE_BACKEND_API|django-api.ts|DJANGO_API_ALIGNMENT.md" docs README.md || echo "OK"

# quick smoke for commands
npm run -s test -- --help >/dev/null || true
npm run -s generate:api --help >/dev/null || true
```

### Risks/Notes
- If any doc depends on future changes (Tasks 1–7), block until those PRs are merged; then finalize.

### Branch & PR
- Branch: `docs/verification-pass`
- PR title: `docs: verification pass for auth endpoints, MSW removal, and env var consistency`

---

## Optimal Droid Prompt (for a code-execution agent)

```
Goal: Verify and fix documentation to match canonical endpoints, no MSW, and env var consistency.

1) Prep
   git checkout main && git pull --ff-only
   git switch -c docs/verification-pass

2) Grep and update
   rg -n "MSW|/api/token/|/api/auth/jwt/|/api/v1/users/auth/token/|VITE_USE_BACKEND_API|django-api.ts|DJANGO_API_ALIGNMENT.md" docs README.md || true
   # edit and remove/replace all stale references

3) Quality gates
   npm run -s test -- --help >/dev/null || true
   npm run -s generate:api --help >/dev/null || true

4) Commit & PR
   git add -A
   git commit -m "docs: verification pass for auth endpoints, MSW removal, and env var consistency"
   git push -u origin docs/verification-pass
```

---

## Sources
1. `README.md`
2. `docs/CONTRIBUTING.md`
3. `docs/frontend_testing_guide.md`
4. `docs/DJANGO_INTEGRATION_GUIDE.md`
5. `docs/code_organization_guidelines.md`
