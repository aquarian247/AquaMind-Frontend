# AquaMind - Aquaculture Management System

## Overview

AquaMind is a comprehensive aquaculture management system designed for salmon farming operations. Built with React, TypeScript, Node.js/Express, and PostgreSQL with Drizzle ORM, it provides real-time monitoring, batch lifecycle management, and FIFO inventory tracking for large-scale aquaculture operations.

The system serves as a full-stack web application with responsive design optimized for both desktop and mobile interfaces, supporting operations across multiple geographic locations (Faroe Islands and Scotland).

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: Tailwind CSS with Shadcn/ui component library
- **Charts**: Chart.js for data visualization
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API structure with planned Django alignment
- **Data Layer**: In-memory storage with production-ready Drizzle ORM schemas

### Database Design
- **Database**: PostgreSQL (configured but using in-memory storage currently)
- **ORM**: Drizzle ORM with TypeScript-first schema definitions
- **Time-Series**: Prepared for TimescaleDB extension for environmental data
- **Migrations**: Drizzle Kit for schema management

## Key Components

### Core Modules
1. **Dashboard**: Real-time KPI monitoring with water quality and growth charts
2. **Infrastructure Management**: Hierarchical asset management (Areas → Rings, Stations → Halls → Containers)
3. **Batch Management**: Complete fish lifecycle tracking from egg to harvest
4. **Health Monitoring**: Veterinary records and health assessments
5. **Inventory System**: FIFO feed management with purchase tracking
6. **Environmental Monitoring**: Real-time sensor data and environmental parameters

### Component Architecture
- **Responsive Design**: Mobile-first approach with hamburger navigation
- **Theme System**: Multi-theme support (Ocean Depths, Warm Earth, Solarized) with light/dark modes
- **Accessibility**: Full ARIA compliance through Radix UI primitives
- **Reusable Components**: Modular UI components following design system principles

## Data Flow

### Client-Server Communication
1. **API Requests**: RESTful endpoints with JSON responses
2. **State Management**: TanStack Query handles caching, synchronization, and background updates
3. **Real-time Updates**: Configurable polling intervals for different data types
4. **Error Handling**: Comprehensive error boundaries and user feedback

### Data Models
- **Users & Authentication**: User profiles with role-based permissions
- **Infrastructure**: Geographic hierarchy with containers and sensors
- **Batch Lifecycle**: Species, stages, and batch progression tracking
- **Health Records**: Veterinary observations and health assessments
- **Feed Management**: FIFO inventory with supplier tracking and consumption analysis

### API Structure
Current endpoints follow `/api/` pattern with planned migration to Django-style `/api/v1/` structure:
- Environmental: `/api/v1/environmental/`
- Batch: `/api/v1/batch/`
- Inventory: `/api/v1/inventory/`
- Health: `/api/v1/health/`

## External Dependencies

### Core Dependencies
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **chart.js**: Data visualization
- **drizzle-orm**: Database ORM
- **wouter**: Lightweight routing
- **date-fns**: Date manipulation
- **zod**: Runtime type validation

### Development Tools
- **TypeScript**: Type safety and developer experience
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast development and optimized builds
- **ESBuild**: Production bundling

## Deployment Strategy

### Replit Configuration
- **Environment**: Node.js 20 with PostgreSQL 16 support
- **Development**: `npm run dev` runs development server on port 5000
- **Production**: `npm run build && npm run start` for optimized deployment
- **Auto-deployment**: Configured for Replit's autoscale deployment target

### Build Process
1. **Frontend**: Vite builds optimized React bundle to `dist/public`
2. **Backend**: ESBuild bundles Node.js server to `dist/index.js`
3. **Assets**: Static file serving with appropriate caching headers
4. **Environment**: Production/development environment detection

### Database Strategy
- **Development**: In-memory storage with seeded data for rapid development
- **Production Ready**: Drizzle schemas prepared for PostgreSQL deployment
- **Migration Path**: Structured migration system using Drizzle Kit

## Changelog

- June 24, 2025. Initial setup
- June 24, 2025. Implemented comprehensive Broodstock Management module with tabbed navigation following consistent UI patterns from Infrastructure, Batch, and Health modules
- June 24, 2025. Added "View Details" functionality to breeding programs and broodstock containers with dedicated detail pages featuring tabbed interfaces, matching the UX patterns from batch management module
- June 25, 2025. **Scenario Planning Module Implementation Complete:**
  - ✓ **Phase 1:** Foundation with 13 data models, 25+ storage methods, 20+ API endpoints, comprehensive schema design
  - ✓ **Phase 2:** Tab navigation system, real-time KPI cards, responsive UI integration matching AquaMind patterns
  - ✓ **Phase 3:** Complete scenario CRUD operations, search/filtering, creation wizard, editing, batch integration
  - ✓ **Phase 4:** Interactive projection visualization with Recharts, scenario detail dialogs, performance analysis
  - ✓ Professional-grade UI following established design patterns with mobile-first responsive approach
  - ✓ All core functionality operational and ready for deployment
- June 25, 2025. **Model Creation Wizards Implementation:**
  - ✓ Created sophisticated multi-step wizards for TGC, FCR, and mortality model creation
  - ✓ Implemented comprehensive validation, presets, and professional UI components
  - ✓ Fixed JSON API communication ensuring all endpoints return proper JSON responses
  - ✓ Cleaned up duplicate UI elements in Models tab for improved user experience
  - ✓ Resolved duplicate model cards issue and restored proper section headers for FCR and mortality models
- June 25, 2025. **Scenario Planning Module Complete with Realistic Salmon Aquaculture Data:**
  - ✓ Updated all scenarios to reflect realistic sea cage production (smolt transfer to harvest)
  - ✓ Implemented proper salmon lifecycle: 2-3M smolt population, 300-400g start weight, 5-7kg harvest weight
  - ✓ Fixed TGC-based growth calculations with temperature profiles and realistic sea cage conditions
  - ✓ Added feed consumption tracking with dynamic FCR calculations based on fish size and temperature
  - ✓ Enhanced projection charts with proper aquaculture metrics and feed consumption cards
  - ✓ All scenarios now properly linked to existing TGC, FCR, and mortality models as per PRS requirements
  - ✓ Converted scenario detail from popup dialog to dedicated page following Batch Management pattern
  - ✓ Updated tab menu styling to span full width matching page layout consistency
  - ✓ Ready for deployment with professional-grade salmon aquaculture demonstration data
- June 26, 2025. **Complete Django Backend Integration for DMZ/Protected VLAN Architecture:**
  - ✓ **8 Active Apps Integration:** Full TypeScript definitions and API endpoints for all apps (infrastructure, batch, inventory, health, environmental, broodstock, scenario, users)
  - ✓ **VLAN-Ready Architecture:** DMZ frontend with Protected VLAN Django backend configuration
  - ✓ **Development Tools:** Backend switching, network diagnostics, CSRF handling, debugging utilities
  - ✓ **Security Implementation:** JWT authentication, CORS configuration, firewall-ready network policies
  - ✓ **Comprehensive Documentation:** DEPLOYMENT_ARCHITECTURE.md, DEVELOPMENT_WORKFLOW.md, DJANGO_INTEGRATION_GUIDE.md
  - ✓ **Production Ready:** Environment-based configuration for development/staging/production deployments

## User Preferences

Preferred communication style: Simple, everyday language.