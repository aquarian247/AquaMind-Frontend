# Contributing to AquaMind Frontend

## Development Setup

### Prerequisites
- Node.js 18+
- Git configured with your GitHub credentials
- Access to AquaMind Django backend (for full integration testing)

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
```bash
# Requires Django backend running
VITE_USE_DJANGO_API=true
VITE_DJANGO_API_URL=http://localhost:8000
npm run dev
```

### Architecture Testing

For testing the DMZ/Protected VLAN architecture locally, see `docs/LOCAL_VLAN_SETUP.md`.

## Code Standards

### TypeScript
- Strict type checking enabled
- Use shared types from `shared/schema.ts`
- Define Django types in `client/src/lib/types/django.ts`

### React Components
- Functional components with hooks
- Use TanStack Query for server state
- Follow Shadcn/ui patterns for UI components

### API Integration
- Use `apiRequest` from `lib/queryClient.ts`
- Handle loading and error states
- Invalidate cache after mutations

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

# Test Django integration (requires backend)
VITE_USE_DJANGO_API=true npm run dev

# Test production build
npm run build && npm run start
```

### API Testing
Use the included debug utilities:
```typescript
import { debugAPI } from '@/lib/debug';

// Test Django connectivity
debugAPI.testDjangoConnection();

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
- `replit.md` for project context
- Component documentation for new UI components

## Questions?

- Check existing issues on GitHub
- Review documentation in `docs/`
- Contact the development team
- Create an issue for bugs or feature requests