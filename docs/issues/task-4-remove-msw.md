# Task 4 — Remove MSW From Test Setup

## Executive Summary
MSW is imported in the test setup and handlers exist under `client/src/test/msw`, but the server is disabled. Remove MSW completely and standardize on simple fetch or client mocks per current testing guidance [1][2].

---

## GitHub Issue (copy-paste into a new issue)

**Title:** Remove MSW From Test Setup and Standardize on Simple Mocks

### Background
The repository previously experimented with MSW, but our testing strategy now uses Vitest + RTL with simple fetch/client mocks. Keeping MSW artifacts adds confusion and maintenance overhead [2].

### Goals
• Remove all MSW references and directories  
• Ensure tests run with lightweight mocks only

### Scope
• `client/src/setupTests.ts`  
• `client/src/test/msw/*` (delete directory)  
• Optional: remove `msw` from `devDependencies` if present

### Detailed Requirements
1. **Test setup**  
   • Remove all MSW imports and event listeners from `client/src/setupTests.ts`.  
   • Ensure no references like `server.listen`, `server.resetHandlers`, `server.close`, or `import { server }` remain.

2. **Handlers & server**  
   • Delete `client/src/test/msw` folder entirely.

3. **Optional cleanup**  
   • If `msw` exists in `package.json`, remove it and run `npm install`.

### Acceptance Criteria
• `grep -R "msw" client/src` returns **no matches**  
• `npm run test` passes

### Verification Steps
```bash
rm -rf client/src/test/msw
sed -i '' '/msw/d' client/src/setupTests.ts || true

# verify
grep -R "msw" client/src || echo "OK"

# run tests
npm run test
```

### Risks / Notes
• If any test depended on MSW, replace with minimal `vi.fn()` fetch mocks or mock the generated client.

### Branch & PR
• **Branch:** `chore/remove-msw-testing`  
• **PR title:** `chore(test): remove MSW and standardize on simple mocks`

---

## Optimal Droid Prompt (for a code-execution agent)

```
Goal: Remove MSW completely and ensure tests pass with simple mocks.

1) Prep
   git checkout main && git pull --ff-only
   git switch -c chore/remove-msw-testing

2) Remove MSW
   rm -rf client/src/test/msw
   # edit client/src/setupTests.ts to remove all MSW imports and listeners

3) Sanity checks
   grep -R "msw" client/src || echo OK

4) Quality gates
   npm run test

5) Commit & PR
   git add -A
   git commit -m "chore(test): remove MSW and standardize on simple mocks"
   git push -u origin chore/remove-msw-testing
```

---

## Sources
1. `client/src/setupTests.ts`  
2. `docs/frontend_testing_guide.md`
