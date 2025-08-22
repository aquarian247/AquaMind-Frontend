# AquaMind Integration Testing Guide

This document explains how to validate that the **React frontend** correctly communicates with the **Django API**.  
Three complementary tools are provided:

| Tool | Purpose | When to use |
|------|---------|-------------|
| `quick-integration-test.js` | 60-second smoke test (service availability, auth, key endpoints, schema fetch). | CI pre-merge / local pre-commit. |
| `test-integration.js` | Full, headless end-to-end suite (JWT flow, every critical endpoint, Puppeteer network inspection, JSON report). | Scheduled nightly runs / before releases. |
| `public/integration-test.html` | Interactive browser harness with rich UI, network sniffer and live console. | Manual exploratory testing, demo sessions. |

---

## 1. Prerequisites

1. **Backend**: Django server running on `http://localhost:8000`  
   ```bash
   poetry run python manage.py runserver 0.0.0.0:8000
   ```
2. **Frontend**: React dev server on `http://localhost:5001`  
   ```bash
   cd client && npm start
   ```
3. **Node ≥ 16** and **npm** available globally.
4. A **test user** with API access:  
   ```
   username: testuser
   password: testpassword
   ```
   Adjust with env variables if needed.

---

## 2. Installing the test harness

```bash
# From repository root
cd integration-tests          # or wherever you placed the files
cp test-package.json package.json
npm install                   # installs axios, puppeteer, chalk, commander …
```

*Tip:* Puppeteer downloads Chromium on first install; behind proxies set  
`PUPPETEER_DOWNLOAD_HOST` accordingly.

---

## 3. Quick smoke test

Runs in ~1 minute, zero external deps.

```bash
node quick-integration-test.js --verbose
```

Options:

```
--auth-only     Exit after JWT flow checks
--verbose       Extra logging
```

Exit code `0` = pass, `1` = at least one failure.

---

## 4. Full headless test suite

```bash
node test-integration.js --verbose
```

Key features  
• Acquires & refreshes JWT, hits every core `/api/v1/*` endpoint  
• Launches **Puppeteer** to visit Dashboard, Batches, Environmental, Health pages  
• Captures every frontend → backend request, compares with direct API calls  
• Generates `integration-report.json` (timings, data snapshots, consistency status)

CLI flags:

| Flag | Description |
|------|-------------|
| `-v` / `--verbose` | Chatty output with request/response dumps |
| `-e` / `--endpoint <path>` | Test only matching endpoint(s) |
| `-a` / `--auth-only` | Run JWT tests only |
| `-r` / `--report-file <file>` | Custom report file name |

Example (CI friendly):

```bash
npx wait-on http://localhost:8000/api/ http://localhost:5001 && \
node test-integration.js -v -r artifacts/report.json
```

---

## 5. Interactive browser harness

1. Ensure backend & frontend are running.  
2. Open `public/integration-test.html` **directly in the browser** (or serve via `npm run preview`).  
3. Configure base URLs & credentials, then click **Run All Tests**.

Features:

* Tabbed UI for Auth, Endpoints, Network, Data, Console  
* Live network sniffer (monkey-patches `fetch`)  
* Collapsible JSON samples, schema validation, pass/fail badges  
* Sticky summary panel with progress bar

---

## 6. Continuous Integration

Add to GitHub Actions:

```yaml
- uses: actions/setup-node@v4
  with: { node-version: '20' }

- name: Run integration smoke test
  run: |
    npm ci --prefix integration-tests
    node integration-tests/quick-integration-test.js --auth-only
```

For nightly runs, execute `test-integration.js` and upload `integration-report.json` as an artifact.

---

## 7. Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| `ECONNREFUSED` to `localhost:8000` | Backend not running / wrong port | `python manage.py runserver 8000`, update `DJANGO_URL`. |
| **CORS** errors in browser harness | Missing CORS headers on Django | Ensure `django-cors-headers` configured for `localhost:5001`. |
| Puppeteer “chrome-sandbox” failure | Running inside container without sandbox | `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1` then `apt-get install -y chromium` and launch with `--no-sandbox`. |
| Authentication fails | Wrong creds / CSRF | Verify user exists, try `--auth-only` flag first. |
| Report shows data inconsistency | Frontend using stale cache / mock data | Hard-refresh frontend, ensure `.env` points to live API, inspect captured request list. |

---

## 8. Extending the suite

* Add new endpoints in **`state.endpoints`** (HTML) or `endpoints[]` (JS).
* For advanced schema checks, import **AJV** and drop JSON-Schema files in `schemas/`.
* To profile performance, analyze `duration` fields in `integration-report.json`.

---

Happy testing! 🎉
