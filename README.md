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
- **Multi-theme Support**: Ocean Depths, Warm Earth, Solarized themes with light/dark modes

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
- **API Endpoints**: 50+ endpoints across 8 Django apps

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

The application will be available at `http://localhost:5000`

### Environment Configuration

Create a `.env` file:

```bash
# Backend Configuration
VITE_USE_DJANGO_API=false          # Set to true for Django backend
VITE_DJANGO_API_URL=http://localhost:8000  # Django API URL
VITE_EXPRESS_API_URL=http://localhost:5000  # Express mock API URL

# Debug Settings
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

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
*(content unchanged)*

## 🔌 Backend Integration
*(content unchanged)*

## 📚 Documentation

- `docs/DEPLOYMENT_ARCHITECTURE.md` - Production deployment guide
- `docs/CONTRIBUTING.md` - Development best practices
- `docs/DJANGO_INTEGRATION_GUIDE.md` - Backend integration details
- `docs/LOCAL_VLAN_SETUP.md` - Local testing with virtualization

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
