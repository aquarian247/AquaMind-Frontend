# Task 7 — Environment Variable Consistency Audit (Use VITE_USE_DJANGO_API Only)

## Executive Summary
Environment variables have been standardized on `VITE_USE_DJANGO_API`. All references to `VITE_USE_BACKEND_API` have been removed to ensure unambiguous Django API toggling.

---

## GitHub Issue (copy-paste into a new issue)

**Title:** Replace VITE_USE_BACKEND_API with VITE_USE_DJANGO_API across repo

### Background
The codebase has been standardized on `VITE_USE_DJANGO_API`. All legacy references to `VITE_USE_BACKEND_API` have been removed from docs and server logic.

### Goals
- All references to `VITE_USE_BACKEND_API` have been removed
- All behavior now uses `VITE_USE_DJANGO_API` consistently

### Scope
- Source code: `client/src`, `server/*`, scripts
- Documentation: `README.md`, `docs/*`

### Detailed Requirements
1) Environment variable standardization
   - All occurrences of `VITE_USE_BACKEND_API` have been replaced with `VITE_USE_DJANGO_API` in code and scripts.

2) Documentation
   - All documentation has been updated to reference `VITE_USE_DJANGO_API` only.

3) Validation  
   - If `.env.example` or similar exists, ensure it lists `VITE_USE_DJANGO_API` and removes the legacy variable.

### Acceptance Criteria
- `grep -R "VITE_USE_BACKEND_API" .` returns no matches (environment variables standardized)
- Running the server and app with `VITE_USE_DJANGO_API=1` behaves as expected
- `npm run type-check && npm run lint && npm run test` pass

### Verification Steps
```bash
# verify no legacy environment variables remain
grep -R "VITE_USE_BACKEND_API" . || echo "OK"

# test standardized environment variable
VITE_USE_DJANGO_API=1 npm run dev:server &
# then run the app and verify requests route correctly
```

### Risks/Notes
- Keep variable semantics identical; this is a rename, not a behavior change.

### Branch & PR
- Branch: `chore/envvar-consistency-django`
- PR title: `chore: replace VITE_USE_BACKEND_API with VITE_USE_DJANGO_API`

---

## Optimal Droid Prompt (for a code-execution agent)

```
Goal: Replace VITE_USE_BACKEND_API with VITE_USE_DJANGO_API everywhere.

1) Prep
   git checkout main && git pull --ff-only
   git switch -c chore/envvar-consistency-django

2) Verify standardization
   rg -n "VITE_USE_BACKEND_API" || true
   # should return no matches (already standardized)

3) Verify docs
   rg -n "VITE_USE_BACKEND_API" docs README.md || true
   # should return no matches (documentation updated)

4) Quality gates
   npm run type-check && npm run lint && npm run test

5) Commit & PR
   git add -A
   git commit -m "chore: replace VITE_USE_BACKEND_API with VITE_USE_DJANGO_API"
   git push -u origin chore/envvar-consistency-django
```

---

## Sources
1. `server/index.ts`  
2. `server/mock-api.ts`  
3. `README.md`, `docs/*`
