# Production Planner User Guide

**Version**: 1.0  
**Last Updated**: October 28, 2025  
**Target Repository**: `aquarian247/AquaMind-Frontend/docs/progress/`

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Key Workflows](#key-workflows)
4. [Integration with Transfer Workflows](#integration-with-transfer-workflows)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## Overview

The **Production Planner** is AquaMind's operational scheduling tool that enables farming managers to plan, track, and execute operational activities across scenarios. It provides a timeline-based view of all planned activities (vaccinations, treatments, transfers, culling, sales) for batches within a scenario.

### Key Features

1. **Scenario-Based Planning**: All activities belong to a scenario, enabling what-if analysis
2. **Timeline Visualization**: Gantt chart view of activities grouped by batch
3. **KPI Dashboard**: Quick overview of upcoming, overdue, and completed activities
4. **Transfer Workflow Integration**: Planned transfer activities can spawn and track existing Transfer Workflows
5. **Mobile-Friendly**: Responsive design for field workers to mark activities as completed

### User Personas

- **Production Manager**: Plans operational activities for batches across scenarios
- **Farm Manager**: Reviews and executes planned activities in the field
- **Scenario Analyst**: Analyzes planned vs. actual execution for variance reporting

---

## Getting Started

### Accessing the Production Planner

1. Navigate to the main menu
2. Click on **"Production Planner"** (under "Operational Planning" section)
3. Select a scenario from the dropdown at the top of the page

### Understanding the Dashboard

The Production Planner page is divided into four main sections:

1. **KPI Dashboard** (Top): Four cards showing:
   - **Upcoming (Next 7 Days)**: Activities due in the next week
   - **Overdue**: Activities past their due date that are still pending
   - **This Month**: Activities due in the current month
   - **Completed**: Activities that have been marked as completed

2. **Filters** (Below KPI Dashboard): Multi-select filters for:
   - Activity Type (Vaccination, Treatment, Transfer, etc.)
   - Status (Pending, In Progress, Completed, Overdue)
   - Batch
   - Date Range

3. **Timeline View** (Main Area): Interactive Gantt chart showing activities grouped by batch

4. **Footer**: Summary statistics (Total Activities, Overdue Count)

---

## Key Workflows

### Workflow 1: Creating a Planned Activity

**Scenario**: A Production Manager wants to plan a vaccination for Batch SCO-2024-001 on December 15, 2024.

**Steps**:

1. **Navigate to Production Planner**
   - Click "Production Planner" in the main menu
   - Select the target scenario from the dropdown (e.g., "2025 Growth Plan")

2. **Open Create Activity Form**
   - Click the **"Create Activity"** button (top-right corner)
   - A modal dialog will appear

3. **Fill in Required Fields**
   - **Batch**: Select "SCO-2024-001" from the dropdown
   - **Activity Type**: Select "Vaccination"
   - **Due Date**: Select December 15, 2024 from the date picker

4. **Fill in Optional Fields** (Recommended)
   - **Container**: Select the target container (e.g., "Tank A-01") if known
   - **Notes**: Enter context, e.g., "First vaccination at 50g average weight"

5. **Submit the Form**
   - Click **"Create Activity"** button
   - The modal will close, and the timeline will refresh
   - A toast notification will confirm creation

6. **Verify Creation**
   - The new activity will appear in the timeline under "Batch SCO-2024-001"
   - It will have a "PENDING" status badge

**Result**: The vaccination is now planned and visible to all users viewing this scenario.

---

### Workflow 2: Viewing Activity Details

**Scenario**: A Farm Manager wants to see the details of a planned vaccination before executing it.

**Steps**:

1. **Navigate to Production Planner**
   - Click "Production Planner" in the main menu
   - Select the scenario containing the activity

2. **Locate the Activity**
   - Use filters to narrow down the list (e.g., filter by Activity Type = "Vaccination")
   - Or scroll through the timeline to find the batch

3. **Click on the Activity**
   - Click anywhere on the activity row in the timeline
   - An Activity Detail modal will appear

4. **Review Information**
   - **Core Information**: Due Date, Status, Container, Created By
   - **Notes**: Any context provided by the planner
   - **Audit Trail**: Creation and last update timestamps

5. **Close the Modal**
   - Click "Close" button or press Escape key

**Result**: The Farm Manager has all the information needed to execute the activity.

---

### Workflow 3: Marking an Activity as Completed

**Scenario**: A Farm Manager has just completed a vaccination and wants to mark it as done in the system.

**Steps**:

1. **Navigate to Production Planner** (or Batch Detail Page)
   - Option A: Click "Production Planner" in the main menu
   - Option B: Navigate to Batch Detail page and click the "Planned Activities" tab

2. **Locate the Activity**
   - Find the vaccination activity in the timeline or table
   - Click on it to open the Activity Detail modal

3. **Mark as Completed**
   - Click the **"Mark as Completed"** button in the modal footer
   - A confirmation dialog may appear (optional)
   - Click "Confirm"

4. **Verify Completion**
   - The modal will close
   - The activity status will change to "COMPLETED"
   - The activity will show a green "Completed" badge
   - The "Completed" KPI card count will increment by 1

5. **Review Completion Info**
   - Reopen the activity detail modal
   - The modal will now show:
     - **Completed By**: Your name
     - **Completed At**: Current timestamp

**Result**: The activity is marked as completed, and the completion is recorded in the audit trail.

---

### Workflow 4: Spawning a Transfer Workflow from a Planned Activity

**Scenario**: A Production Manager has planned a transfer activity and now wants to create a detailed Transfer Workflow to execute it.

**Steps**:

1. **Navigate to Production Planner**
   - Click "Production Planner" in the main menu
   - Select the scenario containing the transfer activity

2. **Locate the Transfer Activity**
   - Filter by Activity Type = "Transfer"
   - Click on the transfer activity to open the detail modal

3. **Initiate Workflow Creation**
   - Click the **"Create Workflow"** button in the modal footer
   - A nested "Spawn Workflow" form will appear

4. **Configure the Workflow**
   - **Workflow Type**: Select "Lifecycle Stage Transition" (default)
   - **Source Lifecycle Stage**: Select the current stage (e.g., "Fry")
   - **Destination Lifecycle Stage**: Select the target stage (e.g., "Parr")

5. **Submit the Form**
   - Click **"Create Workflow"** button
   - The system will create a new Transfer Workflow and link it to the planned activity

6. **Navigate to the Workflow**
   - The system will automatically redirect you to the Transfer Workflow detail page
   - Or you can click the "View Workflow" link in the activity detail modal

7. **Add Transfer Actions**
   - Follow the existing Transfer Workflow process to add container-to-container movements
   - Set the workflow status to "Active"

8. **Execute the Workflow**
   - Farm workers execute individual transfer actions
   - When all actions are completed, the workflow status changes to "Completed"

9. **Automatic Activity Update**
   - When the workflow is marked as "Completed", the linked planned activity is automatically marked as "Completed"
   - No manual update needed

**Result**: The planned transfer activity is now linked to a detailed Transfer Workflow, and completion is automatically synchronized.

---

### Workflow 5: Filtering Activities by KPI Card

**Scenario**: A Production Manager wants to quickly see all overdue activities to prioritize them.

**Steps**:

1. **Navigate to Production Planner**
   - Click "Production Planner" in the main menu
   - Select the scenario

2. **Click on the "Overdue" KPI Card**
   - Click anywhere on the "Overdue" card in the KPI Dashboard
   - The timeline view will automatically filter to show only overdue activities

3. **Review Overdue Activities**
   - The timeline will now show only activities with:
     - Status = "PENDING"
     - Due Date < Today
   - Each activity will have a red "OVERDUE" badge

4. **Take Action**
   - Click on an overdue activity to view details
   - Either:
     - Mark it as completed (if already done)
     - Edit the due date (if it needs to be rescheduled)
     - Add notes explaining the delay

5. **Clear the Filter**
   - Click the **"Clear Filters"** button to return to the full view

**Result**: The Production Manager has a clear view of overdue activities and can take corrective action.

---

### Workflow 6: Viewing Planned Activities for a Specific Batch

**Scenario**: A Farm Manager wants to see all planned activities for Batch SCO-2024-001 across all scenarios.

**Steps**:

1. **Navigate to Batch Detail Page**
   - Click "Batch Management" in the main menu
   - Search for and click on "SCO-2024-001"

2. **Open the Planned Activities Tab**
   - Click the **"Planned Activities"** tab in the batch detail page
   - This tab shows all planned activities for this batch across all scenarios

3. **Filter by Scenario** (Optional)
   - Use the scenario dropdown to filter activities for a specific scenario
   - Or leave it as "All Scenarios" to see the full list

4. **Review the Activity Table**
   - The table shows:
     - Activity Type
     - Due Date
     - Status
     - Scenario Name
     - Actions (Edit, Complete, View Workflow)

5. **Take Action**
   - Click "Edit" to modify an activity
   - Click "Complete" to mark an activity as done
   - Click "View Workflow" (for transfer activities) to see the linked workflow

**Result**: The Farm Manager has a batch-centric view of all planned activities, making it easy to plan the batch's lifecycle.

---

## Integration with Transfer Workflows

### How Planned Activities and Transfer Workflows Coexist

**Planned Activities** and **Transfer Workflows** serve different purposes:

| Aspect | Planned Activities | Transfer Workflows |
|--------|-------------------|-------------------|
| **Purpose** | Plan single-event operational activities | Execute multi-step, multi-day batch transfers |
| **Scope** | All activity types (vaccinations, treatments, transfers, etc.) | Transfers only |
| **Complexity** | Low (single-event) | High (multi-action workflows with progress tracking) |
| **Finance Integration** | No | Yes (automatic intercompany transaction creation) |
| **Mobile Execution** | Yes (mark as completed) | Yes (ship crew can execute actions in the field) |

### Linking Mechanism

When a planned TRANSFER activity is created, the user can optionally **spawn a Transfer Workflow** from it. This creates a one-to-one link between the two entities:

```
PlannedActivity (TRANSFER)
    ↓ (spawns)
TransferWorkflow
    ↓ (completes)
PlannedActivity (status → COMPLETED)
```

**Key Benefits**:
1. **Planning**: Users can plan transfers in advance (in the Production Planner)
2. **Execution**: Users can execute transfers using the detailed Transfer Workflow UI
3. **Tracking**: Completion is automatically synchronized (no manual updates needed)

### When to Use Which?

**Use Planned Activities for**:
- Simple, single-event activities (vaccinations, treatments, culling, sales)
- Scenario-based what-if analysis
- High-level planning and timeline visualization

**Use Transfer Workflows for**:
- Complex, multi-day transfers with multiple container movements
- Transfers with financial implications (intercompany transactions)
- Transfers requiring approval workflows

**Use Both (Linked) for**:
- Planned transfers that need detailed execution tracking
- Transfers that are part of a scenario plan but also need operational detail

---

## Best Practices

### 1. Plan Early, Execute Later

- Create planned activities as soon as you know the due date (e.g., when a batch is created)
- Use the timeline view to visualize the batch's lifecycle
- Adjust due dates as needed based on actual growth rates or environmental conditions

### 2. Use Notes Liberally

- Add context to every planned activity (e.g., "First vaccination at 50g average weight")
- Include any special instructions or dependencies
- Notes are visible to all users and help with execution

### 3. Link Containers When Possible

- If you know the target container, link it to the planned activity
- This helps farm workers locate the batch quickly
- For transfers, the container can be updated when the workflow is created

### 4. Monitor Overdue Activities

- Check the "Overdue" KPI card daily
- Investigate why activities are overdue (delays, resource constraints, etc.)
- Either complete them or reschedule them with updated due dates

### 5. Use Scenarios for What-If Analysis

- Create multiple scenarios to compare different operational plans
- Example: "Aggressive Growth Plan" vs. "Conservative Growth Plan"
- Each scenario can have different planned activities (e.g., more frequent vaccinations in the aggressive plan)

### 6. Leverage Batch-Centric Views

- Use the "Planned Activities" tab in the Batch Detail page for focused planning
- This view shows all activities for a single batch across all scenarios
- Useful for reviewing the batch's lifecycle plan

---

## Troubleshooting

### Issue 1: Activity Not Appearing in Timeline

**Symptoms**: You created an activity, but it's not visible in the timeline.

**Possible Causes**:
1. Wrong scenario selected
2. Filters are hiding the activity
3. Date range is outside the visible timeline

**Solutions**:
1. Check the scenario dropdown at the top of the page
2. Click "Clear Filters" to reset all filters
3. Adjust the timeline view mode (Week → Month → Quarter) to expand the visible date range

---

### Issue 2: Cannot Mark Activity as Completed

**Symptoms**: The "Mark as Completed" button is disabled or missing.

**Possible Causes**:
1. Activity is already completed
2. User lacks permission
3. Activity is linked to an in-progress Transfer Workflow

**Solutions**:
1. Check the activity status badge (if it's "COMPLETED", it's already done)
2. Contact your system administrator to verify your permissions
3. For transfer activities, complete the linked workflow first (it will auto-complete the activity)

---

### Issue 3: Transfer Workflow Not Auto-Completing Activity

**Symptoms**: You completed a Transfer Workflow, but the linked planned activity is still "PENDING".

**Possible Causes**:
1. Workflow is not fully completed (some actions are still pending)
2. System sync issue

**Solutions**:
1. Verify that ALL transfer actions in the workflow are marked as "Completed"
2. Refresh the page to trigger a data sync
3. If the issue persists, manually mark the activity as completed

---

### Issue 4: Duplicate Activities

**Symptoms**: The same activity appears multiple times in the timeline.

**Possible Causes**:
1. Activity was created in multiple scenarios
2. User accidentally created duplicates

**Solutions**:
1. Check the scenario filter—each scenario can have its own copy of the same activity
2. Delete duplicate activities via the Edit modal (click activity → Edit → Delete)

---

## References

1. Transfer Workflow Finance Guide - `AquaMind/aquamind/docs/user_guides/TRANSFER_WORKFLOW_FINANCE_GUIDE.md`
2. AquaMind PRD - `AquaMind/aquamind/docs/prd.md`
3. Operational Scheduling Architecture - `AquaMind/aquamind/docs/progress/operational_scheduling_architecture.md`

---

**End of Document**
