# AquaMind Scenario Planning - Information Architecture

## Navigation Structure

### Primary Navigation

1. **Scenario Planning Hub**
   - Dashboard overview of all scenarios
   - Quick access to recent scenarios
   - Templates and wizards for new scenarios
   - Comparison tools

2. **Scenario Management**
   - Create new scenario
   - Edit existing scenarios
   - Archive/delete scenarios
   - Clone scenarios

3. **Analysis & Reporting**
   - Detailed scenario analysis
   - Multi-scenario comparison
   - Report generation
   - Data export

### Secondary Navigation (Within Scenario)

1. **Overview**
   - Summary metrics
   - Key milestones
   - Status indicators
   - Quick actions

2. **Model Configuration**
   - TGC model parameters
   - FCR model parameters
   - Mortality model parameters
   - Environmental data (temperature)

3. **Projections**
   - Growth projections
   - Population projections
   - Biomass projections
   - Feed projections

4. **Visualization**
   - Interactive charts
   - Tabular data
   - Milestone markers
   - Constraint indicators

5. **Optimization**
   - Harvest timing optimization
   - Feed efficiency optimization
   - Capacity utilization optimization
   - What-if analysis tools

6. **Reports & Export**
   - Standard reports
   - Custom reports
   - Data export options
   - Visualization export

## Information Hierarchy

### Level 1: Scenario Planning Hub
- List of scenarios with status indicators
- Quick metrics (harvest dates, total biomass, total feed)
- Action buttons (create, compare, archive)

### Level 2: Scenario Detail
- Scenario metadata (name, description, dates)
- Summary metrics and KPIs
- Navigation to specialized views

### Level 3: Specialized Views
- Model configuration details
- Detailed projections (tabular and visual)
- Optimization tools
- Reporting options

## Key Screens

1. **Scenario Planning Hub**
   - Purpose: Central access point for all scenario planning activities
   - Primary elements:
     - Scenario list with filtering and sorting
     - Quick action buttons
     - Recent activity feed
     - Template gallery

2. **Scenario Creation Wizard**
   - Purpose: Guide users through creating new scenarios
   - Primary elements:
     - Step indicator
     - Parameter input forms
     - Contextual help
     - Preview of impacts

3. **Model Configuration Screen**
   - Purpose: Detailed setup of all model parameters
   - Primary elements:
     - Parameter groups (TGC, FCR, Mortality)
     - Visual model relationship diagram
     - Parameter impact indicators
     - Validation warnings

4. **Projection Dashboard**
   - Purpose: Comprehensive view of all projections
   - Primary elements:
     - Interactive charts
     - Tabular data views
     - Time scale controls
     - Milestone markers

5. **Scenario Comparison Screen**
   - Purpose: Side-by-side analysis of multiple scenarios
   - Primary elements:
     - Scenario selector
     - Comparison metrics
     - Difference highlighter
     - Decision support tools

6. **Reporting & Export Screen**
   - Purpose: Generate and export reports and data
   - Primary elements:
     - Report template selector
     - Customization options
     - Preview pane
     - Export format options

## Data Structure

### Scenario Metadata
- ID
- Name
- Description
- Creation date
- Last modified date
- Author
- Status (draft, active, archived)
- Tags

### Model Parameters
- TGC model parameters
  - Model variant
  - Initial average weight
  - Temperature profile
  - Growth exponents (n, m)

- FCR model parameters
  - Model variant
  - Stage-specific FCR values
  - Feed type specifications

- Mortality model parameters
  - Stage-specific mortality rates
  - Distribution pattern

### Constraints & Targets
- Target harvest weights
- Biomass capacity constraints
- Feed availability constraints
- Harvest plant capacity

### Projection Data
- Daily projections
  - Date
  - Average weight
  - Population
  - Biomass
  - Feed consumption
  - Lifecycle stage

- Aggregated projections (weekly/monthly)
- Milestone events
  - Stage transitions
  - Harvest windows
  - Constraint violations

## Interaction Patterns

### Parameter Configuration
- Grouped input forms
- Slider controls for numerical values
- Toggle switches for options
- Template selection
- Parameter inheritance from batch data

### Visualization Interaction
- Zoom and pan controls
- Metric toggling
- Time scale switching
- Milestone highlighting
- Constraint visualization

### Comparison Tools
- Scenario selection (checkbox list)
- Metric selection (multi-select)
- Difference visualization (overlay, side-by-side)
- Summary table generation

### Optimization Controls
- Target parameter selection
- Constraint definition
- Optimization goal setting
- Result preview

## Responsive Considerations

### Desktop Focus
- Multi-panel layouts
- Advanced visualization options
- Keyboard shortcuts
- Batch operations

### Tablet Adaptations
- Collapsible panels
- Simplified visualizations
- Touch-optimized controls
- Limited multi-tasking

### Mobile Adaptations
- Single panel focus
- Essential metrics only
- Basic visualization
- Read-mostly functionality
