# AquaMind Scenario Planning - User Flows and Tasks Analysis

## Primary User Personas

1. **Production Planner**
   - Creates and manages production scenarios
   - Needs to optimize harvest timing and biomass utilization
   - Requires ability to compare multiple scenarios

2. **Operations Manager**
   - Reviews scenarios for operational feasibility
   - Needs to understand resource requirements (feed, equipment, staff)
   - Makes decisions based on scenario comparisons

3. **Supply Chain Manager**
   - Focuses on feed procurement and logistics
   - Needs to forecast feed requirements over time
   - Requires detailed feed consumption projections

4. **Financial Analyst**
   - Evaluates financial implications of different scenarios
   - Needs to understand cost drivers (primarily feed)
   - Requires export functionality for financial modeling

## Key User Flows

### 1. Scenario Creation Flow

1. **Initialize Scenario**
   - Name and describe scenario
   - Set start date and duration
   - Select batch(es) to include in scenario

2. **Configure Model Parameters**
   - TGC Model:
     - Select TGC model variant (if multiple available)
     - Set initial average weight (with defaults for lifecycle stages)
     - Import or define temperature profiles
   
   - FCR Model:
     - Select FCR model variant
     - Review/adjust FCR values per lifecycle stage
   
   - Mortality Model:
     - Set mortality rates per lifecycle stage
     - Define mortality distribution pattern (linear, front-loaded, etc.)

3. **Define Constraints and Targets**
   - Set target harvest weights
   - Define biomass constraints (max capacity)
   - Set feed availability constraints
   - Define harvest plant capacity constraints

4. **Generate Initial Scenario**
   - Calculate projections using all three models
   - Display initial results for review

### 2. Scenario Analysis Flow

1. **Review Projection Data**
   - Examine tabular data (daily/weekly/monthly)
   - Analyze growth curves
   - Evaluate biomass projections
   - Review feed consumption forecasts

2. **Identify Key Milestones**
   - Highlight optimal harvest dates
   - Identify capacity constraint violations
   - Note lifecycle stage transitions

3. **Perform What-If Analysis**
   - Adjust model parameters
   - Modify constraints
   - Observe impact on projections in real-time

### 3. Scenario Comparison Flow

1. **Select Scenarios to Compare**
   - Choose 2-3 scenarios for side-by-side comparison
   - Define comparison metrics

2. **Analyze Differences**
   - Compare growth trajectories
   - Evaluate feed efficiency differences
   - Assess harvest timing variations
   - Review total biomass production

3. **Make Decisions**
   - Select preferred scenario
   - Document rationale
   - Share with stakeholders

### 4. Reporting and Export Flow

1. **Generate Reports**
   - Create summary reports
   - Generate detailed projections
   - Produce visualization exports

2. **Export Data**
   - Export to CSV for further analysis
   - Generate charts for presentations
   - Create standardized reports

## Critical Tasks and Pain Points

### Critical Tasks

1. **Parameter Configuration**
   - Setting appropriate TGC, FCR, and mortality parameters
   - Importing historical temperature data
   - Defining realistic constraints

2. **Visual Analysis**
   - Comparing multiple scenarios visually
   - Identifying optimal harvest windows
   - Spotting potential issues (capacity constraints, feed shortages)

3. **Decision Support**
   - Understanding trade-offs between scenarios
   - Quantifying benefits of different approaches
   - Communicating results to stakeholders

### Pain Points in Current Systems

1. **Model Integration Complexity**
   - Difficulty understanding how models interact
   - Lack of transparency in calculations
   - Limited ability to trace impact of parameter changes

2. **Visualization Limitations**
   - Too many separate graphs
   - Difficulty comparing scenarios
   - Lack of interactive exploration

3. **Parameter Management**
   - Tedious input of model parameters
   - Limited reuse of common configurations
   - No templates for standard scenarios

4. **Reporting Inflexibility**
   - Fixed report formats
   - Limited customization
   - Manual export and formatting required

## Design Opportunities

1. **Guided Scenario Creation**
   - Step-by-step wizard for new scenarios
   - Templates for common scenario types
   - Parameter presets based on lifecycle stages

2. **Interactive Visualization**
   - Unified dashboard with linked visualizations
   - Interactive parameter adjustment
   - Real-time projection updates

3. **Comparison-Focused Interface**
   - Side-by-side visualization of multiple scenarios
   - Difference highlighting
   - Summary of key variations

4. **Contextual Help**
   - Embedded explanations of model relationships
   - Visual indicators of parameter impacts
   - Warnings for unrealistic configurations

5. **Flexible Reporting**
   - Customizable report templates
   - Multiple export formats
   - Shareable dashboards

## Key UI/UX Requirements

1. **Clarity in Model Relationships**
   - Visual representation of sequential model application
   - Clear indication that TGC → Mortality → FCR is the calculation order
   - Transparency in how outputs are generated

2. **Intuitive Parameter Management**
   - Logical grouping of related parameters
   - Sensible defaults with clear override options
   - Visual feedback on parameter changes

3. **Powerful but Approachable Visualization**
   - Progressive disclosure of complexity
   - Focus on key metrics with drill-down capability
   - Consistent visual language across all projections

4. **Efficient Workflow Support**
   - Minimize clicks for common tasks
   - Support for batch operations
   - Clear navigation between related scenarios
