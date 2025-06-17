# Infrastructure Management UI/UX Information Architecture

## Navigation Structure

### Primary Navigation
- **Geography-based Navigation**
  - Faroe Islands
  - Scotland
  - (Future geographies)

### Secondary Navigation (Context-sensitive)
- **For each Geography:**
  - Areas (Sea)
  - Freshwater Stations
  - Overview Dashboard

### Tertiary Navigation
- **For Areas:**
  - Sea Pens/Rings
  - Feed Barges
  - Environmental Monitoring
  
- **For Freshwater Stations:**
  - Halls
  - Tanks
  - Environmental Monitoring

## User Flows

### 1. Geographic Overview Flow
1. User selects Geography (Faroe Islands/Scotland)
2. System displays map with all Areas and Freshwater Stations
3. User can filter by status (active/inactive)
4. User can view summary metrics (total biomass, capacity utilization)

### 2. Area Management Flow
1. User selects specific Area from map or list
2. System displays Area details with sea pens/rings
3. User can view/edit Area properties
4. User can add/remove sea pens
5. User can view batch distribution across sea pens

### 3. Freshwater Station Management Flow
1. User selects specific Station from map or list
2. System displays Station details with halls and tanks
3. User can view/edit Station properties
4. User can manage halls and tanks
5. User can view batch distribution across tanks

### 4. Container Detail Flow
1. User selects specific container (tank/sea pen)
2. System displays container details:
   - Physical properties (volume, max biomass)
   - Current batch(es) with biomass
   - Sensor readings with thresholds
   - Recent feeding events
   - Environmental parameters

### 5. Sensor Management Flow
1. User navigates to container detail
2. User can view all sensors and readings
3. User can add/edit/calibrate sensors
4. User can configure thresholds and alerts

## Information Hierarchy

### Level 1: Geographic Overview
- Map visualization
- Summary metrics by geography
- Status indicators

### Level 2: Area/Station List
- Filterable list of areas/stations
- Key metrics (biomass, capacity)
- Status indicators
- Quick actions

### Level 3: Area/Station Detail
- Map/layout visualization
- Container list/grid
- Environmental summary
- Batch distribution

### Level 4: Container Detail
- Container specifications
- Current batch information
- Sensor readings dashboard
- Feeding history
- Environmental parameters

## Integration Points

### Batch Integration
- Container views show current batch(es)
- Batch distribution visualization
- Batch-specific metrics in context

### Inventory Integration
- Feed consumption metrics
- Recent feeding events
- Feed stock levels at feed barges

### Environmental Integration
- Sensor readings visualization
- Threshold indicators
- Historical trends

## Role-Based Access Considerations

### Farm Managers
- Full access to all infrastructure views
- Management capabilities for all entities

### Area Managers
- Access limited to assigned geography/areas
- Management capabilities within assigned scope

### Farm Operators
- Read access to all infrastructure
- Write access to sensor readings and feeding events
- Limited configuration capabilities

### Field Workers
- Mobile-optimized views
- Focus on daily operational tasks
- Quick data entry for readings and events

## Mobile Considerations

### Field Worker Experience
- Simplified container selection
- Quick sensor reading entry
- Offline capability for remote areas
- Barcode/QR scanning for container identification

### Manager Experience
- Dashboard-focused mobile view
- Alert notifications
- Quick approval workflows
