# Contributing to AquaMind Frontend

## Development Setup

### Prerequisites
- Node.js 24.x (recommended: 24.5.0). Use the provided `.nvmrc` to align your local version.
- Git configured with your GitHub credentials
- (Optional) Access to AquaMind backend for live integration testing – not required for most frontend tasks because the **OpenAPI spec & generated client** allow fully offline development.

### Local Development
```bash
git clone https://github.com/aquarian247/AquaMind-Frontend.git
cd AquaMind-Frontend
npm install
npm run dev
```

### Agent Rules — ALWAYS DO

* **Contract-first** — `api/openapi.yaml` is the single source of truth.
  Run `npm run sync:openapi` to sync with backend and regenerate client.
* **Backend-first API Strategy** — Use generated ApiService for ALL operations including aggregations (see ADR: API Aggregation Strategy)
* **Always Use Generated ApiService** — Use `client/src/api/generated` exclusively for contract-first alignment; server-side aggregation endpoints are now available for all KPI needs
* **Honest Fallbacks** — Use `formatFallback()`, `formatCount()`, `formatPercentage()` from `@/lib/formatFallback` to display "N/A" when data unavailable (never hardcode zeros or "No data")
* **Canonical auth endpoints** —
  `POST /api/token/` and `POST /api/token/refresh/` (optional: `GET /api/v1/users/auth/profile/`).
  _Avoid_ legacy `/api/v1/auth/token/*` or `/api/auth/jwt/*` routes.
* **Testing** — Vitest + React Testing Library. Use simple `fetch` mocks (`vi.fn`) or mock the generated client. **Do not use MSW**.
* **Scripts** — `npm run test` (one-off), `npm run test:watch` (watch), `npm run test:ci` (coverage).
* **Environment** — use **`VITE_USE_DJANGO_API`** with `VITE_DJANGO_API_URL`.
* **Quality gates** — code must lint & type-check before PR
  `npm run type-check && npm run lint` must pass.
* **Debug API issues first** — Check browser console for JavaScript errors (Map constructor, etc.) before debugging auth issues
* **Documentation** — update README / docs when endpoints or workflows change.

### Backend Integration Testing

#### Express Mock Server (Default)
```bash
# Uses in-memory data for rapid development
VITE_USE_DJANGO_API=false npm run dev
```

#### Django Backend Integration

**⚠️ IMPORTANT**: When integrating with the Django backend, authentication setup is required. The frontend uses JWT tokens, but the backend may not have them configured by default.

**🚀 BACKEND OPTIMIZATION NOTE**: The Django backend has been recently refactored for improved maintainability and performance:
- **Modular ViewSets**: Split from monolithic structure into focused, single-responsibility modules
- **Enhanced Filtering**: Advanced filtering capabilities with date ranges, numeric ranges, and multi-choice filters
- **Improved MI**: Maintainability Index improved from 35.95 to 79.03-100.00 across all modules
- **Reduced Complexity**: Cyclomatic complexity reduced from D (21+) to A-B (≤15) ratings
- **Better Error Handling**: More robust error handling and validation throughout

These improvements result in faster API responses and more reliable data fetching for your frontend components.

```bash
# 1. Start Django backend
cd /path/to/AquaMind
python manage.py runserver 8000 --settings=aquamind.settings

# 2. Configure frontend environment
VITE_USE_DJANGO_API=true
VITE_DJANGO_API_URL=http://localhost:8000
npm run dev
```

##### Authentication Setup (Standardized)

The frontend uses a centralized authentication system with JWT tokens. The authentication flow is handled by `AuthService` and requires proper backend configuration.

**Current Authentication Architecture:**
- ✅ **JWT-based authentication** with access/refresh tokens
- ✅ **Centralized AuthService** (`/src/services/auth.service.ts`)
- ✅ **Event-driven auth state** management
- ✅ **Automatic token refresh** on 401 responses
- ✅ **Environment-based configuration** (`.env` files)

**Backend Requirements:**
```bash
# Django backend must support JWT authentication
pip install djangorestframework-simplejwt

# Settings configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

# URL patterns
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('api/v1/auth/token/', TokenObtainPairView.as_view()),
    path('api/v1/auth/token/refresh/', TokenRefreshView.as_view()),
]
```

**Frontend Environment Setup:**
```bash
# .env.local or .env.development
VITE_DJANGO_API_URL=http://localhost:8000
```

**Testing Authentication:**
```typescript
import { AuthService } from '@/services/auth.service';

// Test login programmatically
try {
  const tokens = await AuthService.login('admin', 'admin123');
  console.log('Login successful:', tokens);
} catch (error) {
  console.error('Login failed:', error);
}
```

**Troubleshooting:**
- Check that `VITE_DJANGO_API_URL` is set correctly
- Verify JWT endpoints are configured in Django
- Ensure CORS is properly configured for the frontend origin
- Check browser console for authentication errors

##### Large Dataset & Pagination Handling

When working with large datasets (like feeding events), the frontend automatically handles multi-page fetching. However, there are some important considerations:

**Automatic Multi-Page Fetching:**
- The frontend uses `fetchAllPages()` utility for endpoints that return paginated data
- It automatically fetches all pages until no more data is available
- Progress callbacks provide loading feedback for large datasets
- Caching prevents redundant API calls (5-10 minute cache duration)

**Performance Considerations:**
- Large datasets (>50,000 records) may take time to load completely
- The UI shows loading states during data fetching
- Network requests are batched efficiently
- Consider filtering by date ranges for better performance

**Testing Large Datasets:**
```bash
# Check total count of feeding events
curl -s "http://localhost:8000/api/v1/inventory/feeding-events/?batch=258&page=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" | jq '.count'

# The frontend will automatically fetch all pages when you view the Feed History tab
```

**Common Pagination Issues:**

❌ **Problem**: Only seeing 20-50 records instead of thousands
✅ **Solution**: Check if the API endpoint supports pagination and if the frontend is configured to fetch all pages.

❌ **Problem**: Slow loading of large datasets
✅ **Solution**: The pagination system includes progress indicators and caching. For very large datasets, consider date filtering.

❌ **Problem**: Memory issues with extremely large datasets
✅ **Solution**: The system uses efficient data structures and cleanup. For datasets >100k records, consider virtual scrolling.

### Architecture Testing

For testing the DMZ/Protected VLAN architecture locally, see `docs/LOCAL_VLAN_SETUP.md`.

## Code Standards

### TypeScript
- Strict type checking enabled
- Use generated types from `client/src/api/generated/models/`
> Run `npm run generate:api` after spec changes (CI does this automatically).

### React Components
- Functional components with hooks
- Use TanStack Query for server state
- Follow Shadcn/ui patterns for UI components

### API Integration

#### ✅ Primary Rule: Always Use Generated ApiService

- **ALWAYS** use the generated client in `client/src/api/generated` for all CRUD operations
- The generated client is configured with `OpenAPI.BASE` and `OpenAPI.TOKEN` - authentication is automatic
- Do **NOT** hand-craft `fetch`/Axios calls for endpoints that exist in the generated client

#### ⚠️ Exception: Custom Bulk/Action Endpoints Only

For endpoints **NOT in the generated client** (bulk operations, custom actions):
- Use `apiRequest()` from `lib/queryClient.ts`
- `apiRequest()` automatically uses `OpenAPI.BASE` (same as generated client)
- `apiRequest()` automatically uses `getAuthToken()` (same as generated client)
- This ensures consistency with the generated client

**Example:**
```typescript
// ✅ CORRECT: Use generated client for standard CRUD
import { ApiService } from '@/api/generated';
const profiles = await ApiService.apiV1ScenarioTemperatureProfilesList();

// ✅ CORRECT: Use apiRequest for custom bulk endpoint
import { apiRequest } from '@/lib/queryClient';
const result = await apiRequest("POST", "/api/v1/scenario/temperature-profiles/bulk_date_ranges/", data);

// ❌ WRONG: Don't use fetch() directly or create custom wrappers
const result = await fetch("http://localhost:8000/api/v1/...", { headers: {...} });
```

#### 🔧 Integration Pattern

- Wrap API calls in TanStack Query hooks (e.g. `useBatches()`)
- Handle loading/error states via Suspense & Error Boundaries
- Mutations must call `queryClient.invalidateQueries(...)` to refresh stale data

### File Organization
```
client/src/
├── components/          # Reusable components
│   ├── ui/             # Base UI components (Shadcn)
│   ├── [module]/       # Module-specific components
├── pages/              # Page components
├── hooks/              # Custom hooks
├── lib/                # Utilities and config
└── App.tsx             # Main app component
```

> **📖 For detailed guidelines on component decomposition and feature slicing, see [Code Organization Guidelines](../code_organization_guidelines.md) and [Refactoring Large Pages Guide](../refactor_large_pages.md)**

## Debugging Authentication & API Issues

### **🔍 Step-by-Step Debug Process**

When encountering "N/A" values or authentication issues:

1. **Check Browser Console First** - JavaScript errors (like `Map constructor` errors) can mask auth issues
2. **Verify API endpoint exists** - Check that the server-side aggregation endpoint is available in the OpenAPI spec
3. **Test with Generated ApiService**:
   - ✅ **Always use Generated ApiService** for all operations including aggregations
   - ✅ **Server-side endpoints** handle all KPI calculations
4. **Verify Authentication Flow**:
   ```typescript
   // ✅ Correct pattern - using generated ApiService
   const { data: summary } = useQuery({
     queryKey: ['area-summary', areaId],
     queryFn: () => ApiService.apiV1InfrastructureAreasSummaryRetrieve(areaId),
     enabled: !!areaId
   });
   ```

### **🚨 Common Pitfalls to Avoid**

- **❌ Don't use authenticatedFetch** - Generated ApiService with server-side aggregation is now available
- **❌ Don't create client-side aggregation** - Server endpoints handle all KPI calculations
- **❌ Don't ignore JavaScript errors** in console - they can mask auth issues
- **❌ Don't assume auth issues** without checking for JS runtime errors first
- **❌ Don't use Map constructors** in production code - use plain objects instead

### **✅ Server-Side Aggregation is Now Standard**

**All KPI aggregations are handled server-side:**
1. Infrastructure summaries (Geography, Area, Station, Hall)
2. Container assignment summaries with location filters
3. Feeding event summaries with date ranges
4. FCR trends with weighted averaging

**Example using server-side aggregation:**
```typescript
// ✅ CURRENT: Server-side aggregation via generated ApiService
const { data: areaKpis } = useQuery({
  queryKey: ['area-summary', areaId],
  queryFn: () => ApiService.apiV1InfrastructureAreasSummaryRetrieve(areaId)
});

// ✅ CURRENT: Server-side filtering and date ranges
const { data: feedingSummary } = useQuery({
  queryKey: ['feeding-summary', { startDate, endDate }],
  queryFn: () => ApiService.apiV1InventoryFeedingEventsSummaryList({
    start_date: startDate,
    end_date: endDate,
    batch: batchId
  })
});
```

### **🎯 Backend Feature Request Template**

When using authenticatedFetch for aggregation, document:

```
🎯 BACKEND FEATURE REQUEST

Title: Add Station Summary Aggregation Endpoints
Priority: High (Performance & UX Impact)
Impact: Reduces client-side data processing and improves page load times

Current Problem:
- Frontend fetches all halls, containers, batch assignments
- Client-side aggregation: 1000+ API calls for complex calculations
- Poor performance for large datasets
- Increased bandwidth usage

Requested Endpoints:

1. GET /api/v1/stations/summary
   Response: {
     total_stations: number,
     total_halls: number,
     total_containers: number,
     total_biomass_kg: number,
     total_population: number
   }

2. GET /api/v1/stations/{id}/details
   Response: {
     halls_count: number,
     containers_count: number,
     biomass_total_kg: number,
     population_total: number,
     last_updated: string
   }

Benefits:
- ✅ 90% reduction in API calls for dashboard views
- ✅ Improved frontend performance
- ✅ Reduced bandwidth usage
- ✅ Better user experience
- ✅ Proper backend business logic encapsulation

Migration Plan:
1. Backend implements endpoints
2. Frontend updates to use new endpoints
3. Remove client-side aggregation code
4. Performance monitoring and optimization
```

## Testing

### Environment Testing
```bash
# Test Express mock server
npm run dev

# Test live backend (requires backend running)
VITE_USE_DJANGO_API=true VITE_DJANGO_API_URL=http://localhost:8000 npm run dev

# Test production build
npm run build && npm run start
```

### API Testing
Use the included debug utilities:
```typescript
import { debugAPI } from '@/lib/debug';

// Test Django connectivity
debugAPI.testConnection();

// Test specific endpoints
debugAPI.testEndpoint('/api/v1/infrastructure/geographies/');
```

### Integration smoke tests (optional)

- Local auth-only smoke (fast):
  ```bash
  node quick-integration-test.cjs --auth-only
  ```
- Full headless check (optional):
  ```bash
  node test-integration.js -v
  ```
- CI hint: add a workflow step to run the auth-only smoke after services are reachable (Node 24.x).

## Pull Request Process

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes
4. Test with both Express and Django backends
5. Update documentation if needed
6. Submit pull request with clear description

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Messages
```
feat: add scenario projection visualization
fix: resolve CSRF token handling in Django integration
docs: update deployment architecture guide
refactor: improve API error handling
```

## Architecture Considerations

### Security
- Never commit API keys or secrets
- Use environment variables for configuration
- Implement proper CORS and CSRF handling
- Follow VLAN security policies

### Performance
- Use React.memo for expensive components
- Implement proper caching with TanStack Query
- Optimize bundle size with code splitting
- Use proper loading states

> **⚡ For component performance optimization and large page refactoring, see [Refactoring Large Pages Guide](../refactor_large_pages.md)**

### Accessibility
- Follow ARIA guidelines
- Use semantic HTML
- Test with screen readers
- Ensure keyboard navigation

## OpenAPI Specification Synchronization

### Why This Matters

The frontend uses **contract-first development** with the OpenAPI specification as the single source of truth. All API interactions must use the **generated TypeScript client** from `client/src/api/generated`. The frontend's `api/openapi.yaml` must always stay synchronized with the backend's generated specification.

### Automated Synchronization (Recommended)

When the backend CI/CD completes successfully, it automatically triggers the frontend to regenerate its API client. This requires the `FRONTEND_REPO_PAT` secret to be configured in the backend repository.

### Manual Synchronization

When the automated workflow fails or you need immediate synchronization:

#### Option 1: NPM Scripts (Recommended)
```bash
# Sync from main branch
npm run sync:openapi

# Sync from specific branch
npm run sync:openapi:branch develop

# Sync from specific branch using environment variable
BACKEND_BRANCH=feature/new-endpoints npm run sync:openapi:branch $BACKEND_BRANCH
```

#### Option 2: GitHub Actions Manual Trigger
1. Go to **Actions** → **Regenerate API Client**
2. Click **Run workflow**
3. Select the backend branch to sync from
4. The workflow will create a PR with the updated API client

#### Option 3: Direct API Calls (Fallback)
```bash
curl -L https://raw.githubusercontent.com/aquarian247/AquaMind/main/api/openapi.yaml -o api/openapi.yaml
cp api/openapi.yaml tmp/openapi/openapi.yaml
npm run generate:api
```

### Developer Workflow Integration

**ALWAYS run OpenAPI synchronization before starting development:**

```bash
# Fresh clone or after backend API changes
npm run sync:openapi

# Start development
npm run dev
```

**Before implementing new features that use backend APIs:**
```bash
# Ensure you have the latest API definitions
npm run sync:openapi

# Check for new endpoints or schema changes
git diff api/openapi.yaml
```

**When you encounter TypeScript errors about missing API endpoints:**
```bash
# Sync and regenerate client
npm run sync:openapi

# Verify the endpoint exists
grep -R "your-endpoint" client/src/api/generated
```

### Troubleshooting

#### Common Issues

**"Cannot find module '@/api/generated/models/SomeModel'"**
```bash
# The OpenAPI spec is out of sync
npm run sync:openapi
```

**"Property 'someField' does not exist on type 'SomeModel'"**
```bash
# Backend schema has changed
npm run sync:openapi
```

**"Endpoint not found" errors**
```bash
# API structure has changed
npm run sync:openapi
```

**Branch sync script fails**
```bash
# Manual fallback for branch-specific sync
curl -L https://raw.githubusercontent.com/aquarian247/AquaMind/YOUR_BRANCH/api/openapi.yaml -o api/openapi.yaml
cp api/openapi.yaml tmp/openapi/openapi.yaml
npm run generate:api
```

**Verify sync worked**
```bash
# Check if new endpoints are in generated client
grep -r "your-endpoint" client/src/api/generated/services/
```

#### Verification Steps
```bash
# Check if OpenAPI is up to date
npm run sync:openapi

# Verify generated client has expected endpoints
grep -R "/api/v1/" client/src/api/generated/services/

# Run type checking
npm run type-check
```

### Best Practices

1. **Always sync before starting work** on features that touch backend APIs
2. **Sync after backend merges** that affect API contracts
3. **Check git diff** of `api/openapi.yaml` to understand API changes
4. **Run type checking** after sync to catch integration issues early
5. **Use the generated client only** - never hand-craft API calls

## Documentation

Update relevant documentation:
- `README.md` for user-facing changes
- `docs/` for architectural changes
- Component documentation for new UI components

> **📚 Key documentation references:**
> - [Code Organization Guidelines](../code_organization_guidelines.md) - Architecture patterns and file structure
> - [Refactoring Large Pages Guide](../refactor_large_pages.md) - Step-by-step refactoring instructions
> - [Complexity Thresholds Guide](../complexity-thresholds-and-remediation.md) - Code quality metrics and analysis
> - [Multi-Entity Filtering Guide](../multi-entity-filtering-guide.md) - Complete guide to `__in` filtering with examples

## Questions?

- Check existing issues on GitHub
- Review documentation in `docs/`
- Contact the development team
- Create an issue for bugs or feature requests