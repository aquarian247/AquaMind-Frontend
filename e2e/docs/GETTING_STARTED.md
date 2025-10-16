# Getting Started with Playwright E2E Tests

## ✅ Pre-Flight Checklist

Before running E2E tests, verify these prerequisites:

### 1. Backend Running
```bash
cd /Users/aquarian247/Projects/AquaMind
python manage.py runserver
```

**Verify**:
```bash
curl http://localhost:8000/api/v1/infrastructure/geographies/
# Should return JSON, not error
```

### 2. Admin User Exists
```bash
cd /Users/aquarian247/Projects/AquaMind
python manage.py shell -c "
from django.contrib.auth.models import User
try:
    admin = User.objects.get(username='admin')
    print(f'✅ Admin user exists: {admin.username}')
    print(f'✅ Email: {admin.email}')
except User.DoesNotExist:
    print('❌ Admin user not found - creating...')
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('✅ Admin user created')
"
```

### 3. Frontend Dependencies Installed
```bash
cd /Users/aquarian247/Projects/AquaMind-Frontend
npm install
```

### 4. Playwright Browsers Installed
```bash
npx playwright install chromium
```

---

## 🚀 First Test Run

### Step 1: Run Smoke Test (1 minute)
```bash
cd /Users/aquarian247/Projects/AquaMind-Frontend
npx playwright test e2e/smoke.spec.ts --headed
```

**Expected**:
- Browser opens automatically
- Logs in as admin
- Navigates to infrastructure page
- Opens a create dialog
- ✅ All 3 tests pass

**If smoke tests fail**: Check troubleshooting section below

### Step 2: Run Single Entity Test (2 minutes)
```bash
npx playwright test e2e/phase1/infrastructure.spec.ts -g "Create Geography" --headed
```

**Expected**:
- Opens Geography create dialog
- Fills form fields
- Submits form
- Sees success toast
- Count increases
- ✅ Test passes

**Check database**:
```bash
cd /Users/aquarian247/Projects/AquaMind
python manage.py shell -c "
from apps.infrastructure.models import Geography
geo = Geography.objects.filter(name__icontains='E2E').order_by('-id').first()
if geo:
    print(f'✅ Latest E2E Geography: {geo.name}')
else:
    print('❌ No E2E geography found')
"
```

### Step 3: Run Full Phase 1 (5 minutes)
```bash
npx playwright test e2e/phase1/infrastructure.spec.ts
```

**Expected**:
- All 8 infrastructure entities created
- ✅ 8/8 tests pass

### Step 4: Run Full Suite (20-25 minutes)
```bash
npm run test:e2e
```

**Expected**:
- All phases execute sequentially
- ✅ 39/39 tests pass
- HTML report generated

**View report**:
```bash
npm run test:e2e:report
```

---

## 🐛 Troubleshooting

### Problem: "Backend not running"
**Error**: `Failed to fetch` or `ECONNREFUSED`

**Solution**:
```bash
# Check if backend is running
lsof -ti:8000

# If not running, start it
cd /Users/aquarian247/Projects/AquaMind
python manage.py runserver
```

---

### Problem: "Authentication failed"
**Error**: Test times out on login page

**Solution 1 - Verify credentials**:
```bash
cd /Users/aquarian247/Projects/AquaMind
python manage.py shell -c "
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
user = authenticate(username='admin', password='admin123')
if user:
    print('✅ Credentials work')
else:
    print('❌ Credentials invalid - resetting...')
    admin = User.objects.get(username='admin')
    admin.set_password('admin123')
    admin.save()
    print('✅ Password reset to admin123')
"
```

**Solution 2 - Check login page URL**:
Update `e2e/fixtures/auth.ts` if your login page URL is different.

---

### Problem: "Element not found"
**Error**: `locator.click: Target closed` or `Timeout waiting for selector`

**Cause**: UI selectors don't match your Shadcn implementation

**Solution**: Update selectors in `e2e/utils/form-helpers.ts`

**Example adjustments**:
```typescript
// If "Create Geography" button is different
const button = page.locator('button:has-text("Add Geography")').first();

// If dialog selector is different
const dialog = page.locator('.modal, [data-testid="dialog"]');

// If toast selector is different
const toast = page.locator('.notification, [data-toast]');
```

**Debug tip**: Use UI mode to inspect elements:
```bash
npm run test:e2e:ui
```

---

### Problem: "Dropdown options empty"
**Error**: `Cannot find option with text "..."`

**Cause 1**: Tests running out of order  
**Solution**: Playwright runs tests sequentially by default (already configured)

**Cause 2**: Missing prerequisite data in database  
**Solution**: Ensure Phase 1 creates data before Phase 2 runs

**Verify data exists**:
```bash
cd /Users/aquarian247/Projects/AquaMind
python manage.py shell -c "
from apps.infrastructure.models import Geography, Area, Container
from apps.batch.models import Species
print(f'Geographies: {Geography.objects.count()}')
print(f'Areas: {Area.objects.count()}')
print(f'Species: {Species.objects.count()}')
"
```

---

### Problem: "Test timeout"
**Error**: `Test timeout of 30000ms exceeded`

**Cause**: Slow API response or heavy animations

**Solution**: Increase timeout in `playwright.config.ts`:
```typescript
use: {
  timeout: 60000, // 60 seconds
}
```

---

### Problem: "Port already in use"
**Error**: `EADDRINUSE: address already in use :::8000` or `:::5001`

**Solution**:
```bash
# Kill process on port 8000 (backend)
lsof -ti:8000 | xargs kill -9

# Kill process on port 5001 (frontend)
lsof -ti:5001 | xargs kill -9

# Restart servers
cd /Users/aquarian247/Projects/AquaMind
python manage.py runserver &

cd /Users/aquarian247/Projects/AquaMind-Frontend
npm run dev
```

---

## 📋 Checklist for Successful Run

Before reporting issues, verify:

- ✅ Backend running on `http://localhost:8000`
- ✅ Frontend running on `http://localhost:5001` (or Playwright starts it)
- ✅ Admin user exists with credentials `admin` / `admin123`
- ✅ Can manually login to frontend with these credentials
- ✅ Infrastructure management page exists at `/infrastructure/manage`
- ✅ At least one "Create" button visible on management page
- ✅ Create button opens a dialog
- ✅ Dialog has form fields
- ✅ Form submission shows success toast

---

## 🎯 Quick Commands Reference

```bash
# Smoke test (verify setup)
npx playwright test e2e/smoke.spec.ts --headed

# Single test
npx playwright test -g "Create Geography" --headed

# Single file
npx playwright test e2e/phase1/infrastructure.spec.ts

# Full suite (headless)
npm run test:e2e

# Interactive UI mode (best for development)
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug

# View report
npm run test:e2e:report
```

---

## 📊 Expected Results

### Smoke Tests (3 tests)
```
✓ Should load the application
✓ Should navigate to infrastructure page
✓ Should open a create dialog

3 passed (5s)
```

### Phase 1 Tests (8 tests)
```
✓ Create Geography
✓ Create Area with FK dropdown
✓ Create Freshwater Station with enum dropdown
✓ Create Hall with cascading FK
✓ Create Container Type with enum category
✓ Create Container with XOR logic
✓ Create Sensor with date pickers
✓ Create Feed Container

8 passed (1m 20s)
```

### Full Suite (39 tests)
```
✓ Phase 1: 8 passed
✓ Phase 2: 6 passed
✓ Phase 3: 4 passed
✓ Phase 4: 7 passed
✓ Phase 5: 4 passed
✓ Cross-cutting: 10 passed

39 passed (22m 15s)
```

---

## 🎓 Next Steps After First Successful Run

1. **Verify database**:
   ```bash
   cd /Users/aquarian247/Projects/AquaMind
   python manage.py shell -c "
   from apps.infrastructure.models import Geography
   print(f'E2E Geographies: {Geography.objects.filter(name__icontains=\"E2E\").count()}')
   "
   ```

2. **Review HTML report**:
   ```bash
   npm run test:e2e:report
   ```

3. **Clean up test data** (optional):
   ```bash
   python manage.py shell -c "
   from apps.infrastructure.models import Geography
   Geography.objects.filter(name__icontains='E2E').delete()
   print('✅ Cleaned up')
   "
   ```

4. **Add to CI/CD**: See `e2e/README.md` for GitHub Actions example

5. **Extend for Phase 6+**: Use existing tests as templates

---

## 💡 Pro Tips

### 1. Use UI Mode for Development
Much better experience than headless:
```bash
npm run test:e2e:ui
```

### 2. Run Specific Tests During Development
Don't run full suite while developing:
```bash
npx playwright test -g "Create Geography"
```

### 3. Use --headed to See What's Happening
```bash
npx playwright test e2e/phase1/ --headed
```

### 4. Use --debug to Step Through
```bash
npx playwright test e2e/phase1/ --debug
```

### 5. Generate Test Code from Browser Actions
```bash
npx playwright codegen http://localhost:5001
```

---

## 📚 Documentation

- **Quick Start**: `PLAYWRIGHT_E2E_QUICK_START.md`
- **Comprehensive Guide**: `e2e/README.md`
- **Implementation Summary**: `PLAYWRIGHT_IMPLEMENTATION_SUMMARY.md`
- **This File**: `e2e/GETTING_STARTED.md`

---

## ✅ Ready to Test!

If you've completed the pre-flight checklist and run the smoke test successfully, you're ready to run the full E2E suite!

```bash
npm run test:e2e:ui
```

**Happy Testing!** 🚀

---

**Last Updated**: 2025-10-12  
**Status**: ✅ Production ready

