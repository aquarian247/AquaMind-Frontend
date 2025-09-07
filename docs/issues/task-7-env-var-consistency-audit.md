# Task 7 — Environment Variable Consistency Audit (Use VITE_USE_DJANGO_API Only)

## Executive Summary
Standardize on `VITE_USE_DJANGO_API` and remove any references to `VITE_USE_BACKEND_API`. Update code and docs accordingly so toggling the Django API is unambiguous [1][2][3].

---

## GitHub Issue (copy-paste into a new issue)

**Title:** Replace VITE_USE_BACKEND_API with VITE_USE_DJANGO_API across repo

### Background
The codebase previously mixed `VITE_USE_BACKEND_API` and `VITE_USE_DJANGO_API`. We standardized on `VITE_USE_DJANGO_API` in docs and server logic; ensure the entire repo follows suit [1][2].

### Goals
- Remove all references to `VITE_USE_BACKEND_API`
- Confirm all behavior uses `VITE_USE_DJANGO_API`

### Scope
- Source code: `client/src`, `server/*`, scripts
- Documentation: `README.md`, `docs/*`

### Detailed Requirements
1) Replace env var name  
   - Search for `VITE_USE_BACKEND_API` and replace with `VITE_USE_DJANGO_API` in code and scripts.

2) Documentation  
   - Ensure all docs reference `VITE_USE_DJANGO_API` only.

3) Validation  
   - If `.env.example` or similar exists, ensure it lists `VITE_USE_DJANGO_API` and removes the legacy variable.

### Acceptance Criteria
- `grep -R "VITE_USE_BACKEND_API" .` returns no matches
- Running the server and app with `VITE_USE_DJANGO_API=1` behaves as expected
- `npm run type-check && npm run lint && npm run test` pass

### Verification Steps
```bash
grep -R "VITE_USE_BACKEND_API" . || echo "OK"

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

2) Replace occurrences
   rg -n "VITE_USE_BACKEND_API" || true
   # edit files to use VITE_USE_DJANGO_API instead

3) Docs
   rg -n "VITE_USE_BACKEND_API" docs README.md || true
   # update docs to reference VITE_USE_DJANGO_API only

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
