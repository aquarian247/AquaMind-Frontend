# Financial Planning User Guide

**AquaMind Financial Planning & Budgeting Module - User Documentation**

**Version**: 1.0  
**Date**: October 28, 2025  
**Audience**: Finance Managers, CFOs, Budget Analysts

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Chart of Accounts Management](#chart-of-accounts-management)
4. [Cost Center Management](#cost-center-management)
5. [Monthly Budgeting](#monthly-budgeting)
6. [Budget Reports](#budget-reports)
7. [Integration with Scenarios](#integration-with-scenarios)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The **Financial Planning** module in AquaMind provides comprehensive tools for managing your organization's financial planning and budgeting processes. This module enables you to:

- **Configure Chart of Accounts (CoA)**: Define and organize your financial accounts hierarchically
- **Manage Cost Centers**: Allocate costs across operational dimensions (farms, lifecycle stages, projects)
- **Create and Edit Budgets**: Enter monthly budget data in a spreadsheet-like interface
- **Generate Reports**: View P&L projections, budget summaries, and variance analysis
- **Integrate with Scenarios**: Link budgets to scenario planning for what-if analysis

### Key Benefits

1. **Unified Financial Planning**: Replace spreadsheets with a centralized, auditable system
2. **Scenario-Based Budgeting**: Create multiple budget versions linked to operational scenarios
3. **Real-Time Variance Tracking**: Compare budgeted vs. actual performance (integrated with existing `finance` app)
4. **Cost Allocation**: Track costs by farm, lifecycle stage, or project using cost centers
5. **Collaboration**: Multiple users can work on budgets simultaneously with auto-save

---

## Getting Started

### Accessing the Financial Planning Module

1. **Log in** to AquaMind
2. **Navigate** to the sidebar menu
3. **Click** "Finance" → "Financial Planning"

### Initial Setup Checklist

Before creating your first budget, complete these setup tasks:

- [ ] **Configure Chart of Accounts** (Section 3)
- [ ] **Create Cost Centers** (Section 4)
- [ ] **Set Company and Year** (use header dropdowns)

---

## Chart of Accounts Management

The Chart of Accounts (CoA) is the foundation of your financial planning. It defines the categories for tracking revenue, expenses, assets, liabilities, and equity.

### Understanding Account Types

AquaMind supports five standard account types:

| Account Type | Purpose | Example Accounts |
|--------------|---------|------------------|
| **ASSET** | Resources owned by the company | Cash, Inventory, Equipment |
| **LIABILITY** | Obligations owed to others | Loans, Accounts Payable |
| **EQUITY** | Owner's interest in the company | Retained Earnings, Capital |
| **REVENUE** | Income from operations | Harvest Sales, Intercompany Revenue |
| **EXPENSE** | Costs of operations | Feed, Labor, Depreciation |

### Creating Account Groups

Account groups provide hierarchical organization for your accounts.

**Example Hierarchy**:
```
OPEX (Operating Expenses)
├─ FEED (Feed Costs)
│  ├─ 5100 Smolt Feed
│  └─ 5110 Parr Feed
└─ LABOR (Labor Costs)
   └─ 5200 Farm Labor
```

**Steps**:
1. **Navigate** to "Chart of Accounts" tab
2. **Click** "+ Add Account Group"
3. **Fill Form**:
   - **Code**: Short identifier (e.g., "OPEX")
   - **Name**: Descriptive name (e.g., "Operating Expenses")
   - **Account Type**: Select from dropdown (e.g., "EXPENSE")
   - **Parent Group**: (Optional) Select parent for hierarchical nesting
   - **Display Order**: Number for sorting (lower numbers appear first)
4. **Click** "Save"

### Creating Accounts

Accounts are the individual line items in your CoA.

**Steps**:
1. **Navigate** to "Chart of Accounts" tab
2. **Click** "+ Add Account"
3. **Fill Form**:
   - **Code**: Unique identifier (e.g., "5100")
   - **Name**: Descriptive name (e.g., "Smolt Feed")
   - **Account Type**: Select from dropdown (must match group type)
   - **Group**: Select parent account group (e.g., "FEED")
   - **Description**: (Optional) Additional details
   - **Is Active**: Check to make account available for budgeting
4. **Click** "Save"

### Editing and Deactivating Accounts

- **Edit**: Click the pencil icon next to an account → Modify fields → Save
- **Deactivate**: Uncheck "Is Active" → Account will no longer appear in budget entry dropdowns (existing budget entries are preserved)
- **Delete**: Click the trash icon → Confirm deletion (only possible if no budget entries exist)

### Best Practices

- **Use Standard Codes**: Follow your organization's existing account numbering scheme (e.g., 4000-4999 for Revenue, 5000-5999 for Expenses)
- **Group Logically**: Create groups that match your reporting needs (e.g., "Feed Costs", "Labor Costs", "Depreciation")
- **Avoid Over-Granularity**: Don't create too many accounts; use cost centers for additional detail

---

## Cost Center Management

Cost Centers enable you to allocate costs across operational dimensions, providing detailed insights into where money is spent.

### Understanding Cost Centers

**Common Cost Center Types**:
- **Geographic**: Faroe Islands - Farm 1, Scotland - Hatchery
- **Lifecycle Stage**: Hatchery, Smolt Hall, Sea Farm
- **Project**: Farm Expansion 2025, New RAS System

### Creating Cost Centers

**Steps**:
1. **Navigate** to "Cost Centers" tab
2. **Click** "+ Add Cost Center"
3. **Fill Form**:
   - **Code**: Short identifier (e.g., "FARM-01")
   - **Name**: Descriptive name (e.g., "Faroe Islands - Farm 1")
   - **Company**: Select company (e.g., "Bakkafrost P/F")
   - **Description**: (Optional) Additional details
   - **Is Active**: Check to make cost center available for budgeting
4. **Click** "Save"

### Editing and Deactivating Cost Centers

- **Edit**: Click the pencil icon → Modify fields → Save
- **Deactivate**: Uncheck "Is Active" → Cost center will no longer appear in budget entry dropdowns
- **Delete**: Click the trash icon → Confirm deletion (only possible if no budget entries exist)

### Best Practices

- **Align with Operations**: Cost centers should match your operational structure (farms, halls, projects)
- **Use Consistent Naming**: Establish a naming convention (e.g., "FARM-01", "HATCHERY", "SMOLT-HALL")
- **Review Annually**: Deactivate cost centers for closed facilities or completed projects

---

## Monthly Budgeting

The Monthly Budgeting interface provides a spreadsheet-like grid for entering budget data.

### Creating a New Budget

**Steps**:
1. **Navigate** to "Budgeting" tab
2. **Click** "+ Create Budget"
3. **Fill Form**:
   - **Name**: Descriptive name (e.g., "2025 Base Budget")
   - **Year**: Fiscal year (e.g., 2025)
   - **Company**: Select company (e.g., "Bakkafrost P/F")
   - **Scenario**: (Optional) Link to a scenario for what-if analysis
   - **Description**: (Optional) Additional context
   - **Is Active**: Check to set as the active budget for this company/year
4. **Click** "Save"

### Entering Budget Data

**Steps**:
1. **Select Budget**: Use the dropdown at the top of the Budgeting tab
2. **Click** "+ Add Row"
3. **Select**:
   - **Account**: Choose from dropdown (e.g., "5100 Smolt Feed")
   - **Cost Center**: Choose from dropdown (e.g., "FARM-01")
4. **Enter Monthly Amounts**:
   - Click on a cell (e.g., "Jan" column)
   - Type the budgeted amount (e.g., 50000)
   - Press Enter or Tab to move to the next cell
   - The system auto-saves after a short delay
5. **Review Row Total**: The "Total" column shows the sum of all 12 months
6. **Repeat** for all account/cost center combinations

### Editing Budget Data

- **Click** on any cell in the grid
- **Type** the new value
- **Press Enter** or click outside the cell to save
- The system auto-saves changes after 500ms (debounced)

### Copying a Budget to a New Year

**Steps**:
1. **Select** the budget you want to copy (e.g., "2025 Base Budget")
2. **Click** "Copy Budget"
3. **Fill Form**:
   - **New Year**: Enter the target year (e.g., 2026)
   - **New Name**: Enter a name for the new budget (e.g., "2026 Base Budget")
4. **Click** "Copy"
5. **Result**: A new budget is created with all entries copied from the original
6. **Edit** the new budget as needed (e.g., adjust for inflation, new projects)

### Activating a Budget

Only one budget per company/year can be "active". The active budget is used for reporting and variance analysis.

**Steps**:
1. **Select** the budget you want to activate
2. **Click** "Activate"
3. **Confirm** the action
4. **Result**: The selected budget is now active, and any previously active budget for the same company/year is deactivated

### Filtering the Budget Grid

For large budgets with hundreds of rows, use filters to reduce the grid size:

- **Account Type Filter**: Show only Revenue, Expense, Asset, Liability, or Equity accounts
- **Cost Center Filter**: Show only entries for a specific cost center

**Steps**:
1. **Click** the "Account Type" dropdown → Select a type (e.g., "EXPENSE")
2. **Click** the "Cost Center" dropdown → Select a cost center (e.g., "FARM-01")
3. **Result**: The grid now shows only rows matching the filters

---

## Budget Reports

### Budget Summary Report

The Budget Summary report provides aggregated totals by account type and month.

**Accessing the Report**:
1. **Navigate** to "Budgeting" tab
2. **Select** a budget
3. **Click** "View Summary" (below the grid)

**Report Contents**:
- **Monthly Summary**: Total Revenue and Expenses by month
- **Totals by Type**: Total Revenue, Expenses, Assets, Liabilities, Equity
- **Net Income**: Calculated as Total Revenue - Total Expenses

### P&L Projection Report

The P&L (Profit & Loss) Projection report shows monthly and annual net income.

**Accessing the Report**:
1. **Navigate** to "Budgeting" tab
2. **Select** a budget
3. **Click** "View P&L Projection"

**Report Contents**:
- **Monthly P&L**: Revenue, Expenses, and Net Income for each month
- **Annual Totals**: Total Revenue, Total Expenses, Net Income for the year
- **Cumulative Net Income**: Running total of net income by month

### Budget vs. Actuals Report (Coming Soon)

This report compares budgeted amounts to actual performance (integrated with the existing `finance` app).

**Planned Features**:
- **Variance Analysis**: Difference between budget and actuals
- **Variance %**: Percentage difference
- **Drill-Down**: Click on a variance to see details

---

## Integration with Scenarios

Budgets can be linked to **Scenarios** (from the Scenario Planning module) to enable what-if analysis.

### Use Cases

1. **Expansion Scenario**: Create a budget for a scenario where you add a new farm
2. **Efficiency Scenario**: Create a budget for a scenario where you reduce feed costs by 10%
3. **Market Downturn Scenario**: Create a budget for a scenario where harvest prices drop by 20%

### Linking a Budget to a Scenario

**Steps**:
1. **Create** or **Edit** a budget
2. **Select** a scenario from the "Scenario" dropdown
3. **Save** the budget
4. **Result**: The budget is now linked to the scenario and will appear in scenario reports

### Comparing Budgets Across Scenarios

**Steps**:
1. **Navigate** to "Scenario Planning" module
2. **Select** a scenario
3. **View** the "Financial Impact" tab
4. **Result**: The linked budget's P&L projection is displayed alongside operational metrics

---

## Best Practices

### 1. Start with a Template

- **Copy Last Year's Budget**: Use the "Copy Budget" feature to start with last year's budget and adjust for the new year
- **Adjust for Known Changes**: Increase feed costs by expected inflation, add new projects, remove completed projects

### 2. Use Scenarios for What-If Analysis

- **Create Multiple Budgets**: Create a "Base Budget", "Optimistic Budget", and "Pessimistic Budget" for the same year
- **Link to Scenarios**: Link each budget to a corresponding scenario to see the operational impact

### 3. Review and Approve

- **Collaborative Editing**: Multiple users can edit the same budget simultaneously (auto-save prevents conflicts)
- **Activate When Ready**: Only activate a budget when it's been reviewed and approved by management

### 4. Monitor Variance

- **Monthly Reviews**: Compare budgeted vs. actual performance monthly (use Budget vs. Actuals report)
- **Adjust as Needed**: Create a "Revised Budget" if significant variances occur

---

## Troubleshooting

### Issue: Cannot Delete an Account

**Cause**: The account has existing budget entries.

**Solution**:
1. **Deactivate** the account instead of deleting it (uncheck "Is Active")
2. **Alternative**: Delete all budget entries for the account first, then delete the account

### Issue: Budget Grid is Too Large to Navigate

**Cause**: Too many rows in the budget.

**Solution**:
1. **Use Filters**: Filter by Account Type or Cost Center to reduce the number of rows
2. **Split Budgets**: Create separate budgets for different cost centers or divisions

### Issue: Auto-Save is Not Working

**Cause**: Network connectivity issue or server error.

**Solution**:
1. **Check Network**: Ensure you have a stable internet connection
2. **Refresh Page**: Reload the page and try again
3. **Contact Support**: If the issue persists, contact AquaMind support

### Issue: Cannot Activate a Budget

**Cause**: Another budget for the same company/year is already active.

**Solution**:
1. **Deactivate Existing Budget**: Go to the currently active budget and click "Deactivate"
2. **Activate New Budget**: Return to the desired budget and click "Activate"

---

## Conclusion

The Financial Planning module in AquaMind provides a powerful, integrated solution for managing your organization's budgeting and financial planning processes. By following the workflows and best practices in this guide, you can streamline your financial planning, improve accuracy, and gain deeper insights into your organization's financial performance.

For technical implementation details, see the **Financial Core Implementation Plan** and **Financial Core API Specification** documents.
