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
    path('api/v1/users/auth/token/', TokenObtainPairView.as_view()),
    path('api/v1/users/auth/token/refresh/', TokenRefreshView.as_view()),
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