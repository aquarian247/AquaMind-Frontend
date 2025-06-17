# AquaMind Navigation Architecture & Information Design

## Core Navigation Philosophy

AquaMind employs a **dual-perspective information architecture** that reflects the operational reality of salmon farming: the same physical assets serve different management purposes depending on operational context.

## Infrastructure vs Batch Management: Distinct Purposes

### Infrastructure Management
**Focus**: Physical assets, operational status, environmental systems
**Primary Users**: Facility managers, maintenance teams, compliance officers
**Data Perspective**: Asset-centric (containers → halls → stations → areas)

**Key Characteristics:**
- Emphasizes physical infrastructure health and capacity
- Environmental monitoring and regulatory compliance
- Maintenance scheduling and system performance
- Geographic distribution and facility status
- Power consumption, water usage, structural integrity

### Batch Management  
**Focus**: Biological lifecycle, production optimization, fish welfare
**Primary Users**: Production managers, fish health specialists, feed coordinators
**Data Perspective**: Biology-centric (batches → life stages → health records → growth metrics)

**Key Characteristics:**
- Tracks fish populations from egg to harvest
- Growth rates, feed conversion, mortality tracking
- Health assessments and treatment protocols
- Production planning and harvest scheduling
- Species-specific management protocols

## Drill-Down Navigation Strategy

### Infrastructure Hierarchy
```
Geography (Faroe Islands/Scotland)
├── Areas (Sea farming zones)
│   ├── Rings (Individual sea pens) 
│   └── Environmental monitoring
├── Stations (Freshwater facilities)
│   ├── Halls (Production buildings)
│   │   └── Containers (Individual tanks)
│   └── Infrastructure systems
```

### Navigation Design Decisions

#### 1. Clickable Metric Boxes
**Implementation**: Key metrics become interactive navigation elements
- **Production Rings card** → Ring layout view (infrastructure focus)
- **Production Halls card** → Hall system view (infrastructure focus)
- **Total Containers** → Direct container access (bypass halls when appropriate)

**Rationale**: Users often need quick access to specific operational levels without navigating full hierarchies.

#### 2. Dual Access Paths
**Hierarchical Navigation**: Geography → Areas/Stations → Rings/Halls → Containers
**Direct Access**: "View Batches" button provides biology-focused view of same assets

**Example User Flows:**
- **Facility Manager**: Infrastructure → Station → Halls → "Configure water systems"
- **Production Manager**: Infrastructure → Station → "View Batches" → Batch lifecycle

#### 3. Cross-Navigation Integration
**Infrastructure-to-Batch Links**: Every infrastructure detail page includes "View Batches" button
**Batch-to-Infrastructure Links**: Batch pages include facility status and environmental conditions

## Information Architecture Justification

### Why Separate Menu Items?

1. **Operational Workflows**: Different teams use different mental models
   - Infrastructure teams think: "Is the equipment running properly?"
   - Production teams think: "How are the fish growing?"

2. **Data Relationships**: Same physical container appears in both contexts
   - Infrastructure view: Tank capacity, filtration status, power consumption
   - Batch view: Fish count, growth rate, feeding schedule

3. **Regulatory Requirements**: Different compliance frameworks
   - Infrastructure: Environmental permits, facility certifications
   - Batch: Fish health regulations, traceability requirements

4. **Decision Making**: Different optimization criteria
   - Infrastructure: Maximize facility utilization, minimize downtime
   - Batch: Optimize biological conditions, maximize feed conversion

### Cross-Reference Design

**Shared Data Elements**:
- Environmental readings (relevant to both facility operations and fish health)
- Capacity utilization (infrastructure limits vs biological stocking density)
- Geographic location (regulatory compliance vs environmental conditions)

**Navigation Bridges**:
- Infrastructure details include biological productivity metrics
- Batch management includes facility operational status
- Alerts system spans both perspectives (equipment failure affects fish welfare)

## UX Implementation Guidelines

### Visual Hierarchy
1. **Primary Navigation**: Distinct Infrastructure and Batch Management sections
2. **Secondary Navigation**: Geographic and operational subsections
3. **Tertiary Navigation**: Individual facility/batch detail views
4. **Cross-Navigation**: Contextual buttons connecting perspectives

### Interaction Patterns
1. **Progressive Disclosure**: Start with overview, drill down as needed
2. **Contextual Access**: Quick links bypass unnecessary hierarchy levels
3. **Cross-Reference**: Always provide path to related perspective
4. **Breadcrumb Navigation**: Clear path back to higher levels

### Data Consistency
- Same underlying data sources serve both navigation trees
- Real-time synchronization between infrastructure and batch views
- Consistent status indicators across all contexts
- Unified alert system spans both operational perspectives

This architecture ensures users can efficiently access information from their operational perspective while maintaining awareness of interconnected systems.