# Task 5 — Raise Coverage Thresholds in Vitest

## Executive Summary
Increase Vitest coverage thresholds from the current very low defaults (lines / statements / functions ≈ 10%, branches ≈ 5%) to more meaningful levels: **40 % for lines, statements, and functions, and 20 % for branches**, enforced via `vite.config.ts` [1].

---

## GitHub Issue (copy-paste into a new issue)

**Title:** Raise Coverage Thresholds to 40 % (lines/statements/functions) and 20 % (branches)

### Background
Coverage thresholds are too low to provide any quality signal. We need moderate baselines that encourage incremental improvements without causing widespread failures [1][3].

### Goals
• Set coverage thresholds to: **lines 40 %, statements 40 %, functions 40 %, branches 20 %**.  
• Keep the rest of the test config unchanged.

### Scope
• `vite.config.ts`

### Detailed Requirements
1. Update `test.coverage.thresholds` in `vite.config.ts` to:
   * `lines: 40`
   * `statements: 40`
   * `functions: 40`
   * `branches: 20`
2. Do **not** change reporters or include/exclude settings.

### Acceptance Criteria
• `vite.config.ts` contains thresholds `{ lines: 40, statements: 40, functions: 40, branches: 20 }`.  
• `npm run test` passes locally (failures due solely to thresholds are acceptable if they reveal truly untested areas; Task 10 will raise coverage).

### Verification Steps
```bash
grep -n "coverage" -n vite.config.ts | sed -n '1,200p'

npm run test
```

### Risks / Notes
• Raising thresholds can surface previously hidden test gaps; Task 10 will help cover authentication code.  
• If tests fail because coverage is below the new thresholds, raise additional tests in Task 10 rather than lowering thresholds.

### Branch & PR
• **Branch:** `chore/raise-coverage-thresholds`  
• **PR title:** `chore(test): raise coverage thresholds to 40/20`

---

## Optimal Droid Prompt (for a code-execution agent)

```
Goal: Raise Vitest coverage thresholds to 40 % (lines/statements/functions) and 20 % (branches).

1) Prep
   git checkout main && git pull --ff-only
   git switch -c chore/raise-coverage-thresholds

2) Edit vite config
   # In vite.config.ts, set:
   # test.coverage.thresholds = { lines: 40, functions: 40, statements: 40, branches: 20 }

3) Quality gates
   npm run test || true    # allow failures here; they reveal gaps to fix in Task 10

4) Commit & PR
   git add vite.config.ts
   git commit -m "chore(test): raise coverage thresholds to 40/20"
   git push -u origin chore/raise-coverage-thresholds
```

---

## Sources
1. `vite.config.ts`  
2. `docs/frontend_testing_guide.md`  
3. `docs/UAT_TASKS.md`
