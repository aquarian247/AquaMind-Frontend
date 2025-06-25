# AquaMind Deployment Architecture

## Production Network Architecture

### Overview
AquaMind follows a secure multi-tier architecture with Django backend in protected VLAN and React frontend in DMZ.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Internet                                 │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────────────┐
│                         DMZ                                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              React Frontend                             │    │
│  │           (AquaMind Web App)                           │    │
│  │                                                         │    │
│  │  • Nginx/Apache Static Hosting                        │    │
│  │  • HTTPS Termination                                   │    │
│  │  • Load Balancing                                      │    │
│  │  • CDN Integration                                     │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────────────────┘
                          │ API Calls
                          │ (Internal Network)
┌─────────────────────────────────────────────────────────────────┐
│                   Protected VLAN                               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Django Backend                             │    │
│  │           (AquaMind API Server)                        │    │
│  │                                                         │    │
│  │  • Django REST Framework                              │    │
│  │  • JWT Authentication                                 │    │
│  │  • API Rate Limiting                                  │    │
│  │  • CORS Configuration                                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                          │                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │            PostgreSQL Database                          │    │
│  │          (TimescaleDB Extension)                       │    │
│  │                                                         │    │
│  │  • Master/Replica Setup                               │    │
│  │  • Automated Backups                                  │    │
│  │  • Connection Pooling                                 │    │
│  │  • SSL/TLS Encryption                                 │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Network Configuration

### DMZ Configuration (Frontend)
- **Purpose**: Public-facing React application
- **Security**: Reverse proxy, HTTPS termination, static file serving
- **Access**: Internet → DMZ (Port 443/80)
- **Outbound**: DMZ → Protected VLAN (API calls only)

### Protected VLAN Configuration (Backend)
- **Purpose**: Django API and database services
- **Security**: No direct internet access, firewall rules
- **Access**: DMZ → Protected VLAN (Port 8000 for API)
- **Database**: Internal-only access (Port 5432)

### Firewall Rules

```bash
# DMZ → Protected VLAN (API Access)
allow from DMZ_SUBNET to PROTECTED_VLAN_SUBNET port 8000

# Protected VLAN → Internet (Updates only)
allow from PROTECTED_VLAN_SUBNET to any port 443,80 (outbound only)

# Block all other traffic
deny from any to PROTECTED_VLAN_SUBNET
deny from PROTECTED_VLAN_SUBNET to any
```

## Development & Debugging Strategy

### Local Development Setup

1. **Full Stack Development**
   ```bash
   # Terminal 1: Django Backend
   cd django-backend/
   python manage.py runserver 0.0.0.0:8000
   
   # Terminal 2: React Frontend  
   cd react-frontend/
   VITE_USE_DJANGO_API=true VITE_DJANGO_API_URL=http://localhost:8000 npm run dev
   ```

2. **Frontend-Only Development**
   ```bash
   # Use Express stubs for rapid UI development
   VITE_USE_DJANGO_API=false npm run dev
   ```

3. **Hybrid Development**
   ```bash
   # Test specific features with Django, others with stubs
   VITE_USE_DJANGO_API=true npm run dev
   # Switch dynamically in browser console:
   # DevelopmentTools.switchToExpress()
   # DevelopmentTools.switchToDjango()
   ```

### Debugging Production Issues

#### Network Connectivity
```javascript
// Browser console diagnostics
import { NetworkDiagnostics } from './lib/debug';

// Test backend connection
await NetworkDiagnostics.testConnection();

// Check CORS configuration
await NetworkDiagnostics.checkCORS();
```

#### API Request Tracing
```javascript
// Enable debug logging
localStorage.setItem('VITE_DEBUG_MODE', 'true');
localStorage.setItem('VITE_LOG_LEVEL', 'debug');
window.location.reload();
```

#### Environment Verification
```javascript
// Check current configuration
import { DevelopmentTools } from './lib/debug';
console.log(DevelopmentTools.getEnvironmentInfo());
```

## Deployment Configurations

### Development Environment
```env
VITE_DJANGO_API_URL=http://localhost:8000
VITE_USE_DJANGO_API=true
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

### Staging Environment
```env
VITE_DJANGO_API_URL=https://api-staging.aquamind.internal
VITE_USE_DJANGO_API=true
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=info
```

### Production Environment
```env
VITE_DJANGO_API_URL=https://api.aquamind.internal
VITE_USE_DJANGO_API=true
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=error
```

## Security Considerations

### API Communication
- **HTTPS Only**: All API communication encrypted
- **CORS Policy**: Strict origin restrictions
- **JWT Tokens**: Secure authentication with refresh tokens
- **Rate Limiting**: Prevent API abuse
- **CSRF Protection**: Django CSRF tokens for state-changing operations

### Network Security
- **No Direct Database Access**: Database only accessible from Django
- **Firewall Rules**: Strict ingress/egress controls
- **VPN Access**: Admin access to protected VLAN via VPN
- **Monitoring**: Network traffic analysis and alerting

### Data Protection
- **TLS 1.3**: Modern encryption standards
- **Certificate Management**: Automated cert renewal
- **Secret Management**: Environment-based configuration
- **Audit Logging**: All API access logged

## Monitoring & Observability

### Frontend Monitoring
- **Error Tracking**: JavaScript error reporting
- **Performance**: Core Web Vitals monitoring
- **User Analytics**: Usage patterns and flows
- **Network Health**: API response times and errors

### Backend Monitoring
- **API Metrics**: Response times, error rates, throughput
- **Database Performance**: Query performance and connection pooling
- **Resource Usage**: CPU, memory, disk utilization
- **Security Events**: Failed authentication attempts, rate limiting

### Alerting
- **Critical**: API downtime, database connectivity
- **Warning**: High response times, error rate increases
- **Info**: Deployment events, configuration changes

## Backup & Recovery

### Database Backups
- **Automated**: Daily full backups, hourly incrementals
- **Retention**: 30 days online, 1 year archived
- **Testing**: Monthly restore verification
- **Geography**: Multi-region backup storage

### Application Recovery
- **Blue/Green Deployment**: Zero-downtime updates
- **Rollback Strategy**: Automated rollback on health check failures
- **Disaster Recovery**: Multi-region deployment capability
- **RTO/RPO**: 4-hour recovery time, 1-hour data loss maximum