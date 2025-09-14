# Django Backend Integration Guide

## Architecture Overview

Your React frontend with Django backend integration is now configured for the VLAN deployment architecture:

- **DMZ**: React frontend served as static files
- **Protected VLAN**: Django API and PostgreSQL database
- **Development**: Seamless local debugging with backend switching

## Recent Backend Optimizations

**🚀 PERFORMANCE & MAINTAINABILITY IMPROVEMENTS**: The Django backend has undergone significant refactoring to improve performance and code quality:

### Key Improvements
- **Modular Architecture**: ViewSets split from monolithic 1,089-line file into 8 focused modules
- **Enhanced Filtering**: Advanced query capabilities with date ranges, numeric filters, and multi-choice options
- **Code Quality**: Maintainability Index improved from 35.95 to 79.03-100.00 (A rating)
- **Complexity Reduction**: Cyclomatic complexity reduced from D (21+) to A-B (≤15) ratings
- **Better Error Handling**: More robust validation and error responses

### Frontend Benefits
- **Faster API Responses**: Optimized database queries and reduced processing overhead
- **Enhanced Filtering**: Richer data filtering options available in UI components
- **Improved Reliability**: Better error handling and validation reduce frontend edge cases
- **Future-Proof**: Modular structure makes backend evolution easier and safer

## Integration Components Created

### 1. Configuration System
- `client/src/lib/config.ts` - Environment-based backend switching
- `client/src/api/generated/models/*` - Auto-generated TypeScript models from OpenAPI (single source of truth)
- `.env.example` - Environment configuration templates

### 2. API Integration Layer
- `client/src/api/generated/*` – **Generated client (single source of truth)** © `openapi-generator`
- `client/src/lib/api.ts` – Legacy unified wrapper (new code should prefer the generated client)
- `client/src/lib/queryClient.ts` – React-Query setup with *optional* CSRF header injection for Django

### 3. Development & Debugging Tools
- `client/src/lib/debug.ts` - Network diagnostics and logging utilities
- Production troubleshooting utilities

### 4. Documentation
- `docs/DEPLOYMENT_ARCHITECTURE.md` - Complete VLAN deployment strategy

## Configuration for Your Environment

### JWT-Only Development Approach
**Important**: This frontend is configured for JWT authentication exclusively, even in development mode. Always use JWT endpoints (`/api/token/`, `/api/token/refresh/`) for authentication. DRF Token endpoints are available on the backend for testing purposes only and should not be used by the frontend.

### Local Development Setup
```bash
# Create environment file
cp .env.example .env.local

# For Django backend development
VITE_USE_DJANGO_API=true
VITE_DJANGO_API_URL=http://localhost:8000
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug

# For frontend-only development
VITE_USE_DJANGO_API=false
VITE_DEBUG_MODE=true
```

### Production Configuration
```bash
# DMZ frontend environment
VITE_USE_DJANGO_API=true
VITE_DJANGO_API_URL=https://api.aquamind.internal
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=error
```

## Django Backend Requirements

Your Django backend needs these endpoints for full compatibility across all 8 active apps:

### Authentication
- `POST /api/token/` — Obtain **access** / **refresh** tokens
- `POST /api/token/refresh/` — Refresh access token
  *Optional*: `GET /api/v1/users/auth/profile/` — Retrieve current user profile

### Infrastructure App
- `GET /api/v1/infrastructure/geographies/`
- `GET /api/v1/infrastructure/areas/`
- `GET /api/v1/infrastructure/containers/`
- `GET /api/v1/infrastructure/sensors/`

### Batch Management App
- `GET /api/v1/batch/batches/` ✅ **Enhanced** - Advanced filtering, analytics endpoints
- `GET /api/v1/batch/species/`
- `GET /api/v1/batch/lifecycle-stages/` ✅ **New** - Added during recent refactoring
- `GET /api/v1/batch/container-assignments/` ✅ **Enhanced** - Advanced location-based filtering
- `GET /api/v1/batch/transfers/`
- `GET /api/v1/batch/growth-samples/`
- `GET /api/v1/batch/mortality-events/`
- `GET /api/v1/batch/batch-compositions/`

### Inventory App
- `GET /api/v1/inventory/feed/`
- `GET /api/v1/inventory/purchases/`
- `GET /api/v1/inventory/stock/`
- `GET /api/v1/inventory/feeding-events/`

### Health App
- `GET /api/v1/health/records/`
- `GET /api/v1/health/assessments/`
- `GET /api/v1/health/lab-samples/`

### Environmental App (Section 3.1.5)
- `GET /api/v1/environmental/readings/`
- `GET /api/v1/environmental/parameters/`
- `GET /api/v1/environmental/weather/`
- `GET /api/v1/environmental/photoperiod/`

### Broodstock App (Section 3.1.8)
- `GET /api/v1/broodstock/fish/`
- `GET /api/v1/broodstock/breeding-plans/`
- `GET /api/v1/broodstock/breeding-pairs/`
- `GET /api/v1/broodstock/egg-production/`
- `GET /api/v1/broodstock/egg-suppliers/`
- `GET /api/v1/broodstock/fish-movements/`
- `GET /api/v1/broodstock/maintenance-tasks/`

### Scenario Planning App (Section 3.3.1)
- `GET /api/v1/scenario/scenarios/`
- `GET /api/v1/scenario/tgc-models/`
- `GET /api/v1/scenario/fcr-models/`
- `GET /api/v1/scenario/mortality-models/`
- `GET /api/v1/scenario/projections/`
- `GET /api/v1/scenario/templates/`

### Users App (Section 3.1.6)
- `GET /api/v1/users/users/`
- `GET /api/v1/users/profiles/`
- `GET /api/v1/users/groups/`
- `GET /api/v1/users/permissions/`

### Response Format
All list endpoints should return Django REST Framework pagination:
```json
{
  "count": 100,
  "next": "http://api/v1/endpoint/?page=2",
  "previous": null,
  "results": [...]
}
```

## Development Workflow

### Phase 1: Setup Integration
1. Clone your Django backend repository alongside this frontend
2. Configure Django CORS settings for your development environment
3. Set environment variables to point to your Django API

### Phase 2: Backend Switching
Switch backends via **environment variables**.  
Set `VITE_USE_DJANGO_API` (and `VITE_DJANGO_API_URL`) then restart the dev server.

### Phase 3: Network Diagnostics
For manual connectivity checks use helper functions in `client/src/lib/debug.ts`.

## Security Implementation

### CSRF Protection
When `VITE_USE_DJANGO_API=true`, `client/src/lib/queryClient.ts` injects the  
`X-CSRFToken` header **only for state-changing requests** (`POST`, `PUT`, `PATCH`, `DELETE`)  
if a cookie named `csrftoken` is present. No explicit call to a CSRF endpoint is required.

### CORS Configuration
Your Django settings.py should include:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Development
    "https://aquamind.yourdomain.com",  # Production DMZ
]
CORS_ALLOW_CREDENTIALS = True
```

### Network Policies
- DMZ frontend can only access Protected VLAN on port 8000
- Protected VLAN has no direct internet access
- Database access restricted to Django application only

## Production Deployment

### Frontend (DMZ)
```bash
# Build for production
VITE_USE_DJANGO_API=true VITE_DJANGO_API_URL=https://api.internal npm run build

# Deploy static files to your DMZ web server
```

### Network Configuration
- Configure firewall rules allowing DMZ → Protected VLAN API access
- Set up reverse proxy in DMZ for HTTPS termination
- Implement monitoring for API connectivity

## Benefits of This Architecture

1. **Security**: Backend isolated in protected VLAN
2. **Scalability**: Independent scaling of frontend/backend
3. **Development Flexibility**: Switch between real/stub APIs
4. **Debugging**: Comprehensive diagnostic tools
5. **Production Ready**: CSRF, CORS, and authentication handled

## Next Steps

1. **Django Backend**: Implement the required API endpoints
2. **Environment Setup**: Configure your local Django development server
3. **Testing**: Use the switching functionality to test both backends
4. **Deployment**: Follow the VLAN architecture documentation

The integration is designed to be progressive - you can start with Express stubs for rapid frontend development, then gradually integrate with your Django backend as endpoints become available.