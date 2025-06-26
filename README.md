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

- Node.js 18+
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

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run type-check   # Run TypeScript type checking
npm run lint         # Run ESLint
```

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
│   │   ├── api.ts          # API client configuration
│   │   └── django-api.ts   # Django integration layer
│   └── App.tsx             # Main application component
├── server/                 # Express.js mock server
├── shared/                 # Shared schemas and types
└── docs/                   # Documentation
```

## 🏢 Deployment Architecture

### DMZ/Protected VLAN Setup

This frontend is designed for enterprise deployment where:

- **Frontend (DMZ)**: React application served from DMZ for public access
- **Backend (Protected VLAN)**: Django API and PostgreSQL in isolated network
- **Security**: Firewall rules, CORS policies, and JWT authentication

### Deployment Options

1. **Development**: Express mock server + in-memory data
2. **Staging**: Django API + PostgreSQL database
3. **Production**: DMZ frontend + Protected VLAN Django backend

See `docs/DEPLOYMENT_ARCHITECTURE.md` for detailed deployment instructions.

## 🔌 Backend Integration

### Django REST API Integration

The frontend includes comprehensive TypeScript definitions for 8 Django apps:

- **Infrastructure**: Geographies, areas, containers, sensors
- **Batch Management**: Species, lifecycle stages, batch tracking
- **Inventory**: Feed management and FIFO tracking
- **Health**: Veterinary records and assessments
- **Environmental**: Sensor readings and weather data
- **Broodstock**: Breeding programs and genetic tracking
- **Scenario Planning**: Predictive modeling and projections
- **Users**: Authentication and role management

### API Configuration

Switch between backends using environment variables:

```typescript
// Automatic backend detection
const API_BASE_URL = import.meta.env.VITE_USE_DJANGO_API === 'true'
  ? import.meta.env.VITE_DJANGO_API_URL
  : import.meta.env.VITE_EXPRESS_API_URL;
```

## 🧪 Local VLAN Testing

For testing the DMZ/Protected VLAN architecture locally:

1. **VM1 (Protected VLAN)**: Django + PostgreSQL in Docker
2. **VM2 (DMZ)**: React frontend in Docker
3. **Network Isolation**: Firewall rules and security policies

See `docs/LOCAL_VLAN_SETUP.md` for complete virtualization setup instructions.

## 📊 Features Deep Dive

### Dashboard
- Real-time KPI monitoring (125,350+ fish tracked)
- Water quality charts with multiple parameters
- Growth rate visualization and trend analysis
- Alert system with severity levels

### Batch Management
- Complete fish lifecycle tracking
- Species and lifecycle stage management
- Container assignments and transfers
- Growth sampling and mortality reporting

### Scenario Planning
- TGC (Thermal Growth Coefficient) modeling
- FCR (Feed Conversion Ratio) analysis
- Mortality prediction models
- Interactive projection visualization
- Realistic salmon aquaculture data (2-3M smolt populations)

### Infrastructure Management
- Hierarchical asset organization
- Geographic area management
- Container and sensor monitoring
- Station and hall tracking

## 🔒 Security Features

- JWT authentication with automatic refresh
- CSRF token handling for Django integration
- CORS configuration for cross-origin requests
- Environment-based security policies
- Network isolation support for VLAN deployments

## 🌐 Multi-tenancy Support

- Multiple geographic locations (Faroe Islands, Scotland)
- Role-based access control
- User profile management
- Organization-level data separation

## 📱 Responsive Design

- Mobile-first approach with hamburger navigation
- Tablet and desktop optimized layouts
- Touch-friendly controls and gestures
- Progressive web app capabilities

## 🎨 Theming

Multiple theme options with light/dark mode support:
- Ocean Depths (blues and teals)
- Warm Earth (browns and oranges)
- Solarized (developer-friendly colors)

## 🧩 Component Library

Built on Shadcn/ui with custom aquaculture-specific components:
- Data tables with sorting and filtering
- Interactive charts and graphs
- Form components with validation
- Modal dialogs and overlays
- Navigation and layout components

## 📈 Performance

- Optimized bundle size with code splitting
- Efficient state management with TanStack Query
- Caching strategies for API responses
- Progressive loading for large datasets

## 🔧 Development Tools

- TypeScript for type safety
- ESLint and Prettier for code quality
- Hot module replacement for fast development
- Source maps for debugging
- Comprehensive error boundaries

## 📚 Documentation

- `docs/DEPLOYMENT_ARCHITECTURE.md` - Production deployment guide
- `docs/DEVELOPMENT_WORKFLOW.md` - Development best practices
- `docs/DJANGO_INTEGRATION_GUIDE.md` - Backend integration details
- `docs/LOCAL_VLAN_SETUP.md` - Local testing with virtualization
- `DJANGO_API_ALIGNMENT.md` - API compatibility documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software developed for Bakkafrost salmon farming operations.

## 🐟 About Bakkafrost

Bakkafrost is one of the largest salmon farming companies in the world, operating primarily in the Faroe Islands and Scotland. This application supports their large-scale aquaculture operations with advanced monitoring and management capabilities.

## 🆘 Support

For technical support or questions:
- Create an issue in this repository
- Contact the development team
- Refer to the comprehensive documentation in the `docs/` directory

---

**Built with ❤️ for sustainable salmon farming**