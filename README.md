# AquaMind Frontend

A comprehensive React frontend for AquaMind, an enterprise salmon farming management platform built for Bakkafrost. This frontend integrates with the Django REST API backend and supports deployment in DMZ/Protected VLAN architectures.

## 🐟 Project Overview

AquaMind Frontend is a modern, responsive web application that provides real-time monitoring and management capabilities for large-scale salmon farming operations across multiple geographic locations (Faroe Islands and Scotland).

### Key Features

- **Real-time Dashboard**: KPI monitoring with water quality and growth charts
- **Infrastructure Management**: Hierarchical asset management (Areas → Rings, Stations → Halls → Containers)
- **Batch Lifecycle**: Complete fish tracking from egg to harvest
- **Health Monitoring**: Veterinary records and health assessments
- **Inventory System**: FIFO feed management with purchase tracking
- **Environmental Monitoring**: Real-time sensor data and environmental parameters
- **Broodstock Management**: Breeding programs and genetic tracking
- **Scenario Planning**: Predictive analytics with TGC, FCR, and mortality modeling
- **Audit Trail**: Enterprise-grade change history tracking with 62+ history endpoints across all modules
- **Multi-theme Support**: Ocean Depths, Warm Earth, Solarized themes with light/dark modes

#### Audit Trail Features

The comprehensive audit trail system provides:

- **6 App Domains**: Full coverage of Batch, Infrastructure, Health, Inventory, Scenario, and Users modules
- **Advanced Filtering**: Date range, change type, username, and entity-specific filters
- **Interactive Sorting**: Column sorting with visual indicators for all data tables
- **Rich Entity Context**: Smart entity name resolution with role, department, and location information
- **Before/After Comparison**: Visual comparison for update operations with intelligent fallbacks
- **Mobile Responsive**: Adaptive design that works seamlessly across all device sizes
- **WCAG Accessibility**: Full keyboard navigation and screen reader support
- **Enterprise UX**: Professional-grade interface with robust error handling and loading states

## 🏗️ Architecture

### Technology Stack

- **Frontend**: React 18 with TypeScript
- **Routing**: Wouter for client-side navigation
- **State Management**: TanStack Query for server state
- **UI Framework**: Tailwind CSS with Shadcn/ui components
- **Charts**: Chart.js and Recharts for data visualization
- **Build Tool**: Vite for development and production builds

### Backend Integration

This frontend is designed to integrate with the AquaMind Django REST API backend:

- **Development**: Can run against Express.js mock server (included)
- **Production**: Connects to Django REST API in protected VLAN
- **Authentication**: JWT tokens with CSRF protection
- **API Endpoints**: 100+ endpoints across 8 Django apps (including 62+ audit trail history endpoints)

## 🚀 Quick Start

### Prerequisites

- Node.js 24.x (recommended: 24.5.0). A `.nvmrc` is provided.
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/aquarian247/AquaMind-Frontend.git
cd AquaMind-Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5001`

### Environment Configuration

Create a `.env` file:

```bash
# Backend Configuration
VITE_USE_DJANGO_API=false          # Set to true for Django backend
VITE_DJANGO_API_URL=http://localhost:8000  # Django API URL
PORT=5001  # Combined Express + Vite dev server port

# Debug Settings
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

### OpenAPI Specification Synchronization

⚠️ **Important**: The automated sync between backend and frontend repositories is currently unreliable. **Manual sync is required** before starting any frontend development session.

The frontend generates TypeScript API clients from the backend's OpenAPI specification. Always sync before development to ensure you have the latest API definitions.

#### Manual Sync (Required - Recommended)

**Before starting any frontend development session**, run:

```bash
# Sync OpenAPI spec and regenerate API client
npm run sync:openapi

# This will:
# 1. Fetch the latest OpenAPI spec from backend main branch
# 2. Regenerate the TypeScript API client
# 3. Update all generated models and services
# 4. Run type checking to verify compatibility
```

#### Troubleshooting

If you encounter TypeScript errors after sync:
1. Ensure the backend is running and accessible
2. Check that the backend OpenAPI spec is valid
3. Verify you're on the correct backend branch (usually `main`)
4. Run `npm run type-check` to see specific errors

#### Automated Sync (Currently Unreliable)
The GitHub Actions workflow attempts to sync automatically when backend changes are merged, but this process is not consistently reliable. Manual sync is the current best practice.

#### GitHub Actions Manual Trigger

You can also trigger the sync manually via GitHub Actions:

1. Go to **Actions** → **Regenerate API Client**
2. Click **Run workflow**
3. Select the backend branch to sync from
4. The workflow will create a PR with the updated API client

#### Local Development

When working locally, always run `npm run sync:openapi` before starting development to ensure you have the latest API definitions. This is especially important when:

- Backend API changes have been merged
- You're getting TypeScript errors about missing API endpoints
- You're implementing new features that use backend APIs

(Use `VITE_USE_DJANGO_API` as the single toggle for backend selection.)

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server (built assets)
npm run type-check   # Run TypeScript type checking
npm run lint         # Run ESLint
npm run test         # Run unit tests once (non-watch)
npm run test:watch   # Run unit tests in interactive watch mode
```

_For contributors: see `docs/CONTRIBUTING.md` and `docs/code_organization_guidelines.md` for day-to-day rules and best practices._

### Project Structure

```
├── client/src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Shadcn/ui base components
│   │   ├── dashboard/      # Dashboard-specific components
│   │   ├── batch-management/
│   │   ├── scenario/       # Scenario planning components
│   │   └── ...
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and configurations
│   │   ├── types/          # TypeScript type definitions
│   │   └── api.ts          # API client configuration
│   └── App.tsx             # Main application component
├── server/                 # Express.js mock server
├── shared/                 # Shared schemas and types
└── docs/                   # Documentation
```

## 🏢 Deployment Architecture

The current shared test deployment is a lightweight Caddy-fronted stack on
`srv-docker1`, not the future DMZ/VLAN target-state architecture.

Use:

- `docs/DEPLOYMENT_ARCHITECTURE.md` for frontend deployment expectations
- `aquamind/docs/deployment/bakkamind_test_environment.md` in the backend repo for the canonical shared test setup

## 🔌 Backend Integration
*(content unchanged)*

## 📚 Documentation

- `docs/DEPLOYMENT_ARCHITECTURE.md` - Current test deployment plus future production architecture notes
- `docs/CONTRIBUTING.md` - Development best practices
- `docs/DJANGO_INTEGRATION_GUIDE.md` - Backend integration details
- `docs/LOCAL_VLAN_SETUP.md` - Local testing with virtualization
- `docs/multi-entity-filtering-guide.md` - Complete guide to multi-entity filtering with `__in` support

## 🤝 Contributing
*(section unchanged)*

## 📄 License
*(section unchanged)*

## 🐟 About Bakkafrost
*(section unchanged)*

## 🆘 Support
*(section unchanged)*

---

**Built with ❤️ for sustainable salmon farming**

