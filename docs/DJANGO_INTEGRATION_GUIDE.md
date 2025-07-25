# Django Backend Integration Guide

## Architecture Overview

Your React frontend with Django backend integration is now configured for the VLAN deployment architecture:

- **DMZ**: React frontend served as static files
- **Protected VLAN**: Django API and PostgreSQL database
- **Development**: Seamless local debugging with backend switching

## Integration Components Created

### 1. Configuration System
- `client/src/lib/config.ts` - Environment-based backend switching
- `client/src/lib/types/django.ts` - TypeScript definitions for Django models
- `.env.example` - Environment configuration templates

### 2. API Integration Layer
- `client/src/lib/django-api.ts` - Complete Django REST API client
- `client/src/lib/api.ts` - Unified API that switches between Django/Express
- `client/src/lib/queryClient.ts` - Enhanced with CSRF token handling

### 3. Development & Debugging Tools
- `client/src/lib/debug.ts` - Network diagnostics and logging utilities
- Browser console tools for switching backends during development
- Production troubleshooting capabilities

### 4. Documentation
- `docs/DEPLOYMENT_ARCHITECTURE.md` - Complete VLAN deployment strategy
- `docs/DEVELOPMENT_WORKFLOW.md` - Development and debugging workflows

## Configuration for Your Environment

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
- `POST /api/v1/auth/login/` - User login
- `GET /api/v1/auth/csrf/` - CSRF token
- `GET /api/v1/auth/user/` - Current user info

### Infrastructure App
- `GET /api/v1/infrastructure/geographies/`
- `GET /api/v1/infrastructure/areas/`
- `GET /api/v1/infrastructure/containers/`
- `GET /api/v1/infrastructure/sensors/`

### Batch Management App
- `GET /api/v1/batch/batches/`
- `GET /api/v1/batch/species/`
- `GET /api/v1/batch/lifecycle-stages/`
- `GET /api/v1/batch/container-assignments/`
- `GET /api/v1/batch/transfers/`
- `GET /api/v1/batch/growth-samples/`
- `GET /api/v1/batch/mortality-events/`

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
The system supports seamless switching between Django and Express:

```javascript
// Browser console commands
DevelopmentTools.switchToDjango();  // Use real Django API
DevelopmentTools.switchToExpress(); // Use Express stubs

// Check current configuration
console.log(DevelopmentTools.getEnvironmentInfo());
```

### Phase 3: Network Diagnostics
For production troubleshooting:

```javascript
// Test API connectivity
await NetworkDiagnostics.testConnection();

// Verify CORS configuration
await NetworkDiagnostics.checkCORS();
```

## Security Implementation

### CSRF Protection
The system automatically handles Django CSRF tokens:
- Fetches tokens from `/api/v1/auth/csrf/`
- Includes tokens in state-changing requests
- Manages token refresh automatically

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