# DEPRECATED – See `docs/deprecated/DEVELOPMENT_WORKFLOW.md`

This file has been moved to the `docs/deprecated` directory and is retained only for historical reference. Please refer to:

* `docs/CONTRIBUTING.md` for current development workflow (OpenAPI-first)
* `docs/DEPLOYMENT_ARCHITECTURE.md` for deployment details


## Overview
This workflow supports seamless development and debugging across three scenarios:
1. **Frontend-only development** (Express stubs)
2. **Full-stack development** (Django + React)
3. **Production debugging** (DMZ + VLAN architecture)

## Quick Start

### 1. Clone and Setup
```bash
# Clone your repositories
git clone <your-django-backend-repo> django-backend
git clone <your-react-frontend-repo> react-frontend

# Setup Django backend
cd django-backend/
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000

# Setup React frontend
cd ../react-frontend/
npm install
```

### 2. Development Modes

#### Mode A: Frontend-Only (Rapid UI Development)
```bash
cd react-frontend/
cp .env.example .env.local
# Edit .env.local:
# VITE_USE_DJANGO_API=false
# VITE_DEBUG_MODE=true

npm run dev
# Uses Express stubs for immediate feedback
```

#### Mode B: Full-Stack Development
```bash
# Terminal 1: Django Backend
cd django-backend/
python manage.py runserver 0.0.0.0:8000

# Terminal 2: React Frontend
cd react-frontend/
cp .env.example .env.local
# Edit .env.local:
# VITE_USE_DJANGO_API=true
# VITE_DJANGO_API_URL=http://localhost:8000
# VITE_DEBUG_MODE=true

npm run dev
```

#### Mode C: Production Testing
```bash
# Test against staging/production Django API
cd react-frontend/
cp .env.example .env.production
# Edit .env.production:
# VITE_USE_DJANGO_API=true
# VITE_DJANGO_API_URL=https://api-staging.aquamind.internal
# VITE_DEBUG_MODE=true

npm run build
npm run preview
```

## Debugging Strategies

### 1. Network Issues
Open browser console and run:
```javascript
// Test backend connectivity
import { NetworkDiagnostics } from './lib/debug';
await NetworkDiagnostics.testConnection();

// Check CORS configuration
await NetworkDiagnostics.checkCORS();
```

### 2. API Endpoint Issues
```javascript
// Enable detailed API logging
localStorage.setItem('VITE_DEBUG_MODE', 'true');
localStorage.setItem('VITE_LOG_LEVEL', 'debug');
window.location.reload();

// All API requests will now be logged
```

### 3. Backend Switching
```javascript
// Switch between Django and Express without restart
import { DevelopmentTools } from './lib/debug';

// Switch to Django backend
DevelopmentTools.switchToDjango();

// Switch to Express stubs
DevelopmentTools.switchToExpress();

// Check current environment
console.log(DevelopmentTools.getEnvironmentInfo());
```

### 4. Django API Integration
The system automatically handles:
- **CSRF tokens** for Django security
- **JWT authentication** for session management
- **Pagination** for large datasets
- **Error handling** with fallbacks

### 5. Data Mapping
Django responses are automatically mapped:
```javascript
// Django List Response
{
  "count": 150,
  "next": "http://api/v1/batches/?page=2",
  "previous": null,
  "results": [...] // Actual data
}

// Automatically extracted to: results array
```

## Workflow Scenarios

### Scenario 1: New Feature Development
1. **Start with Express stubs** for rapid UI iteration
2. **Define API contract** based on UI requirements
3. **Switch to Django** once backend endpoints exist
4. **Test integration** with real data
5. **Deploy to staging** for end-to-end testing

### Scenario 2: Bug Investigation
1. **Enable debug logging** to trace requests
2. **Use network diagnostics** to identify connectivity issues
3. **Switch backends** to isolate frontend vs backend problems
4. **Check environment configuration** for mismatched settings

### Scenario 3: Production Deployment
1. **Build with production config** pointing to protected VLAN
2. **Test CORS and network policies** in staging
3. **Deploy frontend to DMZ** with appropriate firewall rules
4. **Monitor API connectivity** through debug tools

## API Development Guidelines

### Django Backend Requirements
Your Django backend should provide these endpoints for full compatibility:

```python
# Core endpoints
/api/v1/auth/csrf/          # CSRF token
/api/v1/auth/login/         # Authentication
/api/v1/auth/user/          # Current user

# Infrastructure
/api/v1/infrastructure/geographies/
/api/v1/infrastructure/areas/
/api/v1/infrastructure/containers/
/api/v1/infrastructure/sensors/

# Batch Management
/api/v1/batch/batches/
/api/v1/batch/species/
/api/v1/batch/lifecycle-stages/
/api/v1/batch/assignments/
/api/v1/batch/transfers/

# Dashboard (Optional - has fallbacks)
/api/v1/dashboard/kpis/
/api/v1/dashboard/farm-sites/
/api/v1/dashboard/alerts/
```

### Response Format
All list endpoints should return:
```json
{
  "count": 100,
  "next": "url_to_next_page",
  "previous": "url_to_previous_page", 
  "results": []
}
```

### CORS Configuration
Django settings.py:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "https://app.aquamind.com",  # Production DMZ
]

CORS_ALLOW_CREDENTIALS = True
```

## Testing Strategy

### Unit Tests
```bash
# Frontend tests
npm run test

# Backend tests  
cd django-backend/
python manage.py test
```

### Integration Tests
```bash
# Test against live Django API
VITE_USE_DJANGO_API=true npm run test:integration

# Test Express fallbacks
VITE_USE_DJANGO_API=false npm run test:integration
```

### End-to-End Tests
```bash
# Full workflow testing
npm run test:e2e
```

## Git Workflow

### Repository Structure
```
aquamind-project/
├── django-backend/     # Django API repository
├── react-frontend/     # React frontend repository  
└── docs/              # Shared documentation
```

### Branch Strategy
- **main**: Production-ready code
- **develop**: Integration branch
- **feature/**: Feature development
- **hotfix/**: Production fixes

### Integration Points
1. **API contract changes** require coordination
2. **Environment variables** should be documented
3. **Docker compose** for local full-stack testing
4. **CI/CD pipelines** for automated testing

This workflow ensures you can develop efficiently while maintaining the security and scalability of your VLAN production architecture.