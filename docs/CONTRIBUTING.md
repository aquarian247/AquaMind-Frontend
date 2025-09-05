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

### Backend Integration Testing

#### Express Mock Server (Default)
```bash
# Uses in-memory data for rapid development
VITE_USE_DJANGO_API=false npm run dev
```

#### Django Backend Integration

**⚠️ IMPORTANT**: When integrating with the Django backend, authentication setup is required. The frontend uses JWT tokens, but the backend may not have them configured by default.

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

The frontend uses a **centralized AuthService** (`/client/src/services/auth.service.ts`) that handles all authentication automatically. The system is designed for JWT tokens with automatic token refresh.

**Quick Start:**
```bash
# 1. Start Django backend
cd /path/to/AquaMind
python manage.py runserver 8000 --settings=aquamind.settings

# 2. Start frontend with Django integration
cd /path/to/AquaMind-Frontend
VITE_USE_DJANGO_API=true npm run dev

# 3. Login through the frontend UI - AuthService handles everything automatically
```

**Authentication Architecture:**

The frontend uses a **standardized authentication system** with these components:
- **AuthService** (`/client/src/services/auth.service.ts`) - Centralized auth logic
- **AuthContext** (`/client/src/contexts/AuthContext.tsx`) - React state management
- **Authenticated Fetch** - Automatic token attachment to all API calls
- **Event-driven** 401 handling with automatic token clearing

**No Manual Token Management Required:**
```typescript
// ❌ OLD: Manual token handling (deprecated)
const token = localStorage.getItem("auth_token");
const response = await fetch(url, {
  headers: { Authorization: `Bearer ${token}` }
});

// ✅ NEW: AuthService handles everything
const response = await authenticatedFetch(url);
// AuthService automatically:
// - Gets token from localStorage
// - Attaches Authorization header
// - Handles 401 responses
// - Refreshes tokens when needed
```

**Testing Authentication:**
```bash
# Test Django backend directly
curl -s "http://localhost:8000/api/v1/batch/batches/" \
  -H "Authorization: Bearer YOUR_JWT_ACCESS_TOKEN"

# Test frontend proxy (automatic auth handled by AuthService)
curl -s "http://localhost:5001/api/v1/batch/batches/"
# AuthService adds Authorization header automatically
```

**Common Authentication Issues:**

❌ **Problem**: "No authentication token available" error
✅ **Solution**: Login through the frontend first. AuthService manages tokens automatically.

❌ **Problem**: 401 errors after login
✅ **Solution**: Check Django backend is running. AuthService handles token refresh automatically.

❌ **Problem**: API calls fail in frontend but work in curl
✅ **Solution**: AuthService may not have tokens. Login through frontend UI first.

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
- Shared API types are generated automatically into `client/src/api/generated` via `npm run generate:client`.

### React Components
- Functional components with hooks
- Use TanStack Query for server state
- Follow Shadcn/ui patterns for UI components

### API Integration
- **Always** use the generated client in `client/src/api/generated`. Do **not** hand-craft `fetch`/Axios calls.
- Wrap calls in TanStack Query hooks (e.g. `useBatches()`), handle loading/error states via Suspense & Error Boundaries.
- Mutations must call `queryClient.invalidateQueries(...)` to refresh stale data.

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

## Testing

### Environment Testing
```bash
# Test Express mock server
npm run dev

# Test live backend (requires backend running)
VITE_USE_BACKEND_API=true VITE_BACKEND_API_URL=http://localhost:8000 npm run dev

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

### Accessibility
- Follow ARIA guidelines
- Use semantic HTML
- Test with screen readers
- Ensure keyboard navigation

## Documentation

Update relevant documentation:
- `README.md` for user-facing changes
- `docs/` for architectural changes
- Component documentation for new UI components

## Questions?

- Check existing issues on GitHub
- Review documentation in `docs/`
- Contact the development team
- Create an issue for bugs or feature requests