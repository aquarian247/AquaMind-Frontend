# Health App Navigation and Information Architecture

## Navigation Structure Overview

The health app navigation should balance specialized health workflows with contextual batch/container integration, while accommodating different user roles and access patterns.

### Primary Navigation Approaches

1. **Standalone Health Module**
   - Accessible via main sidebar "Health" menu item
   - Provides comprehensive health management for veterinarians and QA
   - Contains all specialized health submenu items

2. **Contextual Health Views**
   - Embedded within batch and container detail views
   - Provides relevant health data in context
   - Simplified for non-specialist users

## Health App Submenu Structure

### Main Health Menu Item
When users click on the "Health" sidebar item, they should see these submenu options:

1. **Medical Journal**
   - Complete journal entries across all batches/containers
   - Advanced filtering and search capabilities
   - Chronological view with batch/container context

2. **Health Sampling**
   - Sampling event planning and recording
   - Parameter scoring interface
   - Sampling results analysis

3. **Treatments & Vaccinations**
   - Treatment planning and recording
   - Vaccination scheduling and tracking
   - Treatment effectiveness analysis

4. **Mortality Tracking**
   - Mortality recording and analysis
   - Cause of death tracking
   - Mortality patterns and trends

5. **Lice Management**
   - Lice counting data entry and tracking
   - Lice level trends and alerts
   - Treatment correlation

6. **Health Analytics**
   - Cross-batch health comparisons
   - Environmental correlation analysis
   - Health trend reporting

## Role-Based Navigation Variations

### Veterinarian View
- Full access to all submenu items
- Default landing on Medical Journal
- Prominent treatment planning tools

### Quality Assurance View
- Emphasis on Health Sampling and Analytics
- Parameter scoring as primary workflow
- Compliance reporting tools prominent

### Farm Operator View
- Simplified data entry interfaces
- Quick access to Mortality and Lice recording
- Batch/container context always visible

### Manager View
- Analytics and reporting focused
- Exception highlighting
- Area or production-wide summaries

## Information Architecture

### Medical Journal Structure
- Hierarchical: Batch > Container > Journal Entry
- Filterable by: Date range, health parameter, treatment type, mortality cause
- Sortable by: Severity, date, container, parameter

### Health Data Organization
- **Primary organization**: By batch and container
- **Secondary organization**: By date and event type
- **Tertiary organization**: By health parameter

### Data Relationships to Visualize
- Health parameters to environmental conditions
- Treatments to outcome effectiveness
- Mortality patterns to batch characteristics
- Lice counts to environmental factors

## Contextual Integration Points

### Batch Detail View Integration
- Health summary card with key metrics
- Recent journal entries
- Mortality trend mini-chart
- Treatment history timeline

### Container Detail View Integration
- Current health status indicators
- Container-specific journal entries
- Environmental correlation to health
- Treatment history for this container

### Area Overview Integration
- Health status heatmap across containers
- Exception highlighting for health issues
- Comparative health metrics

## Mobile Considerations

### Field Data Collection
- Simplified forms for mortality and lice counting
- Offline capability for remote locations
- Camera integration for visual documentation
- Quick-entry patterns for routine observations

### Apple Watch Integration
- Ultra-simplified mortality counting
- Basic health parameter recording
- Alert notifications for critical issues

## Navigation Patterns

### Primary Workflows

1. **Journal Entry Workflow**
   - Select batch/container context
   - Create new journal entry
   - Record observations and parameters
   - Link to treatments if needed
   - Save and notify relevant personnel

2. **Health Sampling Workflow**
   - Schedule sampling event
   - Record individual fish observations
   - Calculate parameter scores
   - Compare to historical values
   - Flag exceptions and recommend actions

3. **Treatment Management Workflow**
   - Review health status
   - Plan treatment
   - Record treatment details
   - Schedule follow-up
   - Track effectiveness

4. **Mortality Recording Workflow**
   - Select container
   - Enter mortality count
   - Specify cause if known
   - Submit for veterinary review if threshold exceeded
