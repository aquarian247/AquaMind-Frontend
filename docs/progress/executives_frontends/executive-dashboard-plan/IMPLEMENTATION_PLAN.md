# Executive Dashboard - Implementation Plan

**Target Persona:** Chief Executive Officer, Chief Financial Officer  
**Goal:** Strategic oversight and decision-making dashboard  
**Approach:** Rebuild prototype using AquaMind patterns (features/ structure, generated API, TypeScript)  
**RBAC:** Dynamic menu based on user role (executives see this dashboard)

---

## Overview

Transform the executive dashboard prototype into production-ready AquaMind feature following contract-first development with server-side aggregation. The dashboard provides 4 tabs: Overview, Financial, Strategic, and Market Intelligence.

### UI Reference
Based on screenshots:
- `screencapture-...12_10_09.png` - Overview tab with KPIs and facility list
- `screencapture-...12_10_19.png` - Financial tab with revenue/cost charts
- `screencapture-...12_10_33.png` - Strategic tab with capacity and forecasts
- `screencapture-...12_10_40.png` - Market tab with pricing data

### Source Material
- Prototype: `docs/progress/executives_frontends/executive-dashboard/`
- Data structures: `src/lib/operationsWeeklyData.js`, `liceManagementData.js`, `marketPriceData.js`, `facilityComparisonData.js`
- Component: `src/pages/OperationsManager.jsx` (796 lines - extract business logic)

---

## Prerequisites

✅ Backend lice enhancement complete (summary/trends endpoints available)  
✅ Existing infrastructure/batch/inventory aggregation endpoints  
⚠️ **May Need:** Market price tracking endpoints (check if exists)  
⚠️ **May Need:** Financial aggregation endpoints (revenue, EBITDA, costs)

---

## Backend API Requirements Analysis

### Already Available
1. **Infrastructure Summary** - `/api/v1/infrastructure/geographies/{id}/summary/`
2. **Batch Summary** - `/api/v1/batch/container-assignments/summary/`
3. **Lice Summary** - `/api/v1/health/lice-counts/summary/` ✅ NEW
4. **Lice Trends** - `/api/v1/health/lice-counts/trends/` ✅ NEW
5. **FCR Trends** - `/api/v1/operational/fcr-trends/`

### May Need to Create
1. **Market Prices** - `/api/v1/market/prices/` or external API integration?
2. **Financial Summary** - `/api/v1/finance/summary/` (revenue, EBITDA, costs)
3. **Harvest Forecast** - `/api/v1/scenario/harvest-forecast/` or use existing scenario projections?
4. **Facility Performance Rankings** - May be client-side from existing data

---

## Feature Structure

```
client/src/features/executive/
├── api/
│   ├── api.ts              # TanStack Query hooks for executive endpoints
│   └── api.test.ts         # API hook tests
├── components/
│   ├── OverviewTab.tsx     # Tab 1: KPI cards + facility overview
│   ├── FinancialTab.tsx    # Tab 2: Revenue/cost charts
│   ├── StrategicTab.tsx    # Tab 3: Capacity + forecasts
│   ├── MarketTab.tsx       # Tab 4: Market intelligence
│   ├── KPICard.tsx         # Reusable KPI card with trend indicator
│   ├── FacilityList.tsx    # Facility overview table with health indicators
│   └── GeographyFilter.tsx # Geography dropdown filter
├── hooks/
│   ├── useExecutiveKPIs.ts # KPI aggregation hook
│   └── useFacilityData.ts  # Facility summary hook
├── pages/
│   └── ExecutiveDashboardPage.tsx  # Main page component (<150 LOC)
├── types.ts                # TypeScript interfaces
└── utils/
    ├── kpiCalculations.ts  # Extract from prototype
    └── alertLevels.ts      # Color-coding thresholds
```

---

## Task Breakdown (Session-Sized)

### Task 0: Backend API Gap Analysis (READ-ONLY)
**Scope:** Identify which endpoints exist vs need to be created  
**Actions:**
- Search OpenAPI spec for market/finance endpoints
- Check if harvest forecast exists in scenario endpoints
- Document gaps for backend team
- Create backend feature requests if needed

**Deliverables:**
- `BACKEND_API_GAPS.md` with endpoint requirements
- Decision: proceed with available endpoints + mock placeholders OR wait for backend

**Estimated Context:** 10-15%

---

### Task 1: Feature Scaffolding & Types
**Scope:** Create feature folder structure, TypeScript types, utility functions  
**Actions:**
- Create `features/executive/` folder structure
- Extract KPI calculation logic from prototype (`operationsWeeklyData.js`)
- Convert to TypeScript utilities (`kpiCalculations.ts`)
- Define TypeScript interfaces (`types.ts`)
- Create alert level utilities (`alertLevels.ts`)

**Files Created:**
- `features/executive/types.ts`
- `features/executive/utils/kpiCalculations.ts`
- `features/executive/utils/alertLevels.ts`
- `features/executive/utils/kpiCalculations.test.ts`

**Success Criteria:**
- Type-check passes
- Utility functions tested (80%+ coverage)
- No linter errors

**Estimated Context:** 20-25%

---

### Task 2: API Layer & TanStack Query Hooks
**Scope:** Create API hooks using generated ApiService  
**Actions:**
- Create `features/executive/api/api.ts`
- Implement hooks:
  - `useExecutiveSummary(geography)` - Overall KPIs
  - `useFacilitySummaries(geography)` - Per-facility data
  - `useLiceTrends(geography, interval)` - Historical lice data
  - `useMarketPrices()` - Market intelligence (mock if endpoint missing)
  - `useFinancialSummary(geography)` - Financial KPIs (mock if endpoint missing)
- Use existing aggregation endpoints from backend
- Apply formatFallback utilities
- Handle loading/error states

**Backend Endpoints Used:**
```typescript
// Geography-level aggregation
ApiService.apiV1InfrastructureGeographiesSummaryRetrieve(id)

// Lice data (NEW endpoints)
ApiService.apiV1HealthLiceCountsSummaryRetrieve({ geography, startDate, endDate })
ApiService.apiV1HealthLiceCountsTrendsRetrieve({ geography, interval })

// Batch/container summaries
ApiService.apiV1BatchContainerAssignmentsSummaryRetrieve({ geography })

// Financial (TBD - may need mocks)
// Market prices (TBD - may need mocks)
```

**Files Created:**
- `features/executive/api/api.ts`
- `features/executive/api/api.test.ts`

**Success Criteria:**
- All hooks tested with mocked ApiService
- Proper error/loading state handling
- formatFallback used for missing data

**Estimated Context:** 25-30%

---

### Task 3: Shared Components (KPICard, GeographyFilter)
**Scope:** Create reusable components for dashboard  
**Actions:**
- Create `KPICard.tsx` component
  - Props: title, value, unit, trend, subtitle
  - Trend indicators (↑↓ with percentages)
  - Solarized color scheme support
- Create `GeographyFilter.tsx` component
  - Dropdown with Global/Faroe/Scotland options
  - Integrates with existing theme system
- Create `FacilityHealthBadge.tsx`
  - Color-coded health indicator (green/yellow/red)
  - Based on lice levels or other metrics

**Files Created:**
- `features/executive/components/KPICard.tsx`
- `features/executive/components/KPICard.test.tsx`
- `features/executive/components/GeographyFilter.tsx`
- `features/executive/components/FacilityHealthBadge.tsx`

**Success Criteria:**
- Components render without errors
- Theme integration works (ocean-depths, arctic-aurora, serenity-cove)
- Accessibility: proper ARIA labels
- Tests cover rendering and interactions

**Estimated Context:** 20-25%

---

### Task 4: Overview Tab Implementation
**Scope:** Implement Tab 1 with KPI cards and facility overview  
**Actions:**
- Create `OverviewTab.tsx` component
- Implement 12 KPI cards (extract from prototype):
  - Total Biomass, Average Weight, Feed This Week
  - TGC, SGR, Mortality Count
  - Mortality Biomass, Mature Lice, Movable Lice
  - Released from Freshwater, Total Rings, Largest Mortality Size
- Create `FacilityList.tsx` table component
  - Columns: Facility, Biomass, Avg Weight, TGC, FCR, Mortality %, Mature Lice, Rings
  - Color-coded lice alerts
  - Health status indicators
- Use `useExecutiveSummary` and `useFacilitySummaries` hooks
- Apply honest fallbacks (N/A) for missing data

**Files Created:**
- `features/executive/components/OverviewTab.tsx`
- `features/executive/components/FacilityList.tsx`
- `features/executive/components/OverviewTab.test.tsx`

**Success Criteria:**
- All KPIs display with proper formatting
- Facility table renders with real data or N/A
- Color coding works (lice alerts)
- Geography filter updates data
- No hardcoded values

**Estimated Context:** 30-35%

---

### Task 5: Financial Tab Implementation
**Scope:** Implement Tab 2 with revenue/cost analytics  
**Actions:**
- Create `FinancialTab.tsx` component
- Implement components:
  - Revenue Trend chart (monthly revenue by region)
  - Cost Breakdown pie chart (Feed 45%, Labor 25%, Transport 15%, Maintenance 10%, Other 5%)
  - Key Financial Metrics panel (Gross Margin, Operating Margin, ROI, Cash Flow)
- Use `useFinancialSummary` hook (may be mock if endpoint missing)
- Recharts for visualizations
- Color-coded metrics (green for positive trends)

**Note:** If financial endpoints don't exist, display "Financial integration pending" with mock data disclosure banner.

**Files Created:**
- `features/executive/components/FinancialTab.tsx`
- `features/executive/components/FinancialTab.test.tsx`

**Success Criteria:**
- Charts render without errors
- Mock data clearly disclosed if used
- Honest fallbacks for missing backend data
- Responsive design

**Estimated Context:** 25-30%

---

### Task 6: Strategic Tab Implementation
**Scope:** Implement Tab 3 with capacity utilization and forecasts  
**Actions:**
- Create `StrategicTab.tsx` component
- Implement components:
  - Scenario Planning Integration card (link to existing scenario planner)
  - Capacity Utilization chart (Sea Farms 87%, Freshwater 92%, Hatcheries 78%)
  - Harvest Forecast panel (Next 30/90 days in tonnes)
  - Market Timing indicator
- Use scenario endpoints if available, otherwise display "Connect to scenario planner" button
- Link to `/scenario-planning` route

**Files Created:**
- `features/executive/components/StrategicTab.tsx`
- `features/executive/components/StrategicTab.test.tsx`

**Success Criteria:**
- Integration with existing scenario feature
- Capacity data from infrastructure summaries
- Harvest forecast from scenario projections or honest "Not calculated"
- Navigation to scenario planner works

**Estimated Context:** 25-30%

---

### Task 7: Market Tab Implementation
**Scope:** Implement Tab 4 with market intelligence  
**Actions:**
- Create `MarketTab.tsx` component
- Implement components:
  - Market Share chart (Global salmon production - company vs competitors)
  - Salmon Price card (Current €/kg with trend)
  - Market Outlook indicators (Supply/Demand, Price Outlook)
- Note: Market data likely external - may need backend integration task
- If no endpoint exists, display "Market data integration pending" banner

**Files Created:**
- `features/executive/components/MarketTab.tsx`
- `features/executive/components/MarketTab.test.tsx`

**Success Criteria:**
- Chart renders (with mock data if needed)
- Clear disclosure if using placeholder data
- Price display formatted correctly
- Market outlook indicators

**Estimated Context:** 20-25%

---

### Task 8: Main Dashboard Page & Routing
**Scope:** Create main page component and integrate with app routing  
**Actions:**
- Create `ExecutiveDashboardPage.tsx` (< 150 LOC)
  - Page header with title and geography filter
  - Tabs component with 4 tabs
  - Tab content routing
- Add route to `App.tsx`: `/executive` or `/dashboard/executive`
- Add menu item to sidebar (with RBAC check)
- Lazy load tab components for performance

**Files Created:**
- `features/executive/pages/ExecutiveDashboardPage.tsx`
- `features/executive/pages/ExecutiveDashboardPage.test.tsx`
- `features/executive/index.ts` (barrel export)

**Routes Added:**
- `/executive` → ExecutiveDashboardPage

**Sidebar Updates:**
- Add "Executive Dashboard" menu item
- Icon: `fas fa-chart-pie`
- RBAC: Show for CEO, CFO roles

**Success Criteria:**
- Page loads without errors
- All 4 tabs accessible
- Geography filter works across tabs
- Theme integration works
- Mobile responsive

**Estimated Context:** 20-25%

---

### Task 9: Testing & Polish
**Scope:** Comprehensive testing and UX refinements  
**Actions:**
- Test all tabs with real backend data
- Test with empty data (verify N/A fallbacks)
- Test geography filtering (Global, Faroe, Scotland)
- Test theme switching (all 3 themes)
- Test mobile responsiveness
- Add loading states for slow endpoints
- Add error boundaries
- Performance optimization (lazy loading, memoization)

**Test Coverage:**
- Unit tests for all components (80%+ coverage)
- Integration tests for data flow
- E2E smoke test (if time permits)

**Success Criteria:**
- All tests pass (0 failures)
- No console errors
- Lighthouse performance > 90
- Accessibility: keyboard navigation works
- No hardcoded mock values

**Estimated Context:** 25-30%

---

### Task 10: Documentation & Integration
**Scope:** Document feature and create integration guide  
**Actions:**
- Create `features/executive/README.md`
- Document API dependencies
- Update main README with executive dashboard
- Add screenshots to documentation
- Create user guide for executives (optional)

**Deliverables:**
- `features/executive/README.md`
- Updated `/README.md`
- Integration notes for deployment

**Estimated Context:** 10-15%

---

## Total Estimated Tasks: 10
**Aggregate Context:** ~220-280% (requires 2-3 sessions with context handoff)

---

## Success Criteria

### Functional
✅ All 4 tabs implemented and functional  
✅ Geography filtering works (Global, Faroe Islands, Scotland)  
✅ Real backend data displayed (no mocks unless clearly disclosed)  
✅ Honest fallbacks (N/A) for missing data  
✅ KPI calculations match prototype logic  
✅ Color-coded alerts work (lice, mortality, financial)

### Technical
✅ TypeScript strict mode (0 errors)  
✅ All tests passing (80%+ coverage)  
✅ No linter errors  
✅ Generated ApiService used exclusively  
✅ formatFallback utilities used  
✅ Theme integration (all 3 themes)  
✅ Mobile responsive

### UX
✅ Page loads < 2 seconds  
✅ Smooth tab switching  
✅ Clear loading states  
✅ Error messages user-friendly  
✅ Keyboard navigation works  
✅ Matches prototype UX quality

---

## Known Challenges

1. **Market Price Data**
   - May need external API (Stágri Salmon Index)
   - Backend endpoint TBD
   - Fallback: Display "Integration pending" banner

2. **Financial Aggregations**
   - Finance app has transaction data
   - May need summary endpoint
   - Fallback: Calculate from available harvest data

3. **Harvest Forecasting**
   - Scenario app has projections
   - May need dedicated forecast endpoint
   - Fallback: Link to scenario planner

4. **Multi-Year Historical Data**
   - Need sufficient test data for trends
   - May show "Insufficient data" for some charts
   - Solution: Accept with honest disclosure

---

## Migration from Prototype

### Reuse (Business Logic)
- ✅ KPI calculation formulas
- ✅ Alert level thresholds
- ✅ Color-coding logic
- ✅ Data aggregation patterns

### Rebuild (Implementation)
- ❌ JSX → TypeScript + TSX
- ❌ Static data → ApiService calls
- ❌ Radix UI directly → Shadcn/ui (which wraps Radix)
- ❌ RBACContext.jsx → useAuth from AuthContext
- ❌ Recharts config → Match AquaMind theme

---

## RBAC Integration

The dashboard will be visible based on user role:

```typescript
// In AuthContext or useAuth hook
const canViewExecutiveDashboard = user?.role in ['ceo', 'cfo', 'executive'];

// In Sidebar.tsx
{canViewExecutiveDashboard && (
  <Link href="/executive">
    <div className="sidebar-nav-item">
      <i className="fas fa-chart-pie mr-3" />
      Executive Dashboard
    </div>
  </Link>
)}
```

---

## Dependencies

**Backend:**
- Lice summary/trends endpoints ✅ COMPLETE
- Infrastructure summaries ✅ EXISTS
- Batch summaries ✅ EXISTS
- Finance summaries ⚠️ TBD
- Market prices ⚠️ TBD

**Frontend:**
- Generated API client (sync after backend changes)
- formatFallback utilities ✅ EXISTS
- Theme system ✅ EXISTS
- AuthContext ✅ EXISTS

---

## Timeline Estimate

**With Full Backend Support:** 10 tasks × 1-2 hours each = 10-20 hours (2-3 sessions)  
**With Partial Backend (Mocks):** Add 2-3 hours for mock data structure + disclosure banners

---

## Next Steps After Completion

1. UAT with executive team
2. Gather feedback on KPI selection
3. Iterate on financial metrics (based on CFO needs)
4. Add PDF export functionality (optional)
5. Add email report scheduling (optional)
6. Integrate real market price feed (if available)

---

## Optional Follow-Up Tasks

### Task 11 (Optional): Batch Management Analytics Optimization
**Scope:** Replace client-side aggregation with server-side aggregation endpoints  
**Priority:** ⚡ High Impact, Low Effort (Immediate Win)  
**Type:** Performance Optimization (Frontend Only)

**Current Problem:**
- Batch History tab fetches 690 growth samples (~35 paginated API calls)
- Fetches 5720 mortality events (~286 paginated API calls)
- Total: ~376 API calls, ~20 second load time

**Solution:**
- Use `/api/v1/batch/batches/{id}/growth_analysis/` (1 call, replaces 35)
- Use `/api/v1/batch/batches/{id}/performance_metrics/` (1 call, replaces 286)

**Impact:**
- 🚀 Load time: 20s → <1s (95% faster)
- 📉 API calls: 376 → 2 (99% reduction)
- 💾 Browser memory: 90% reduction
- ✅ No backend changes required

**Files to Modify:**
- `client/src/hooks/useBatchAnalyticsData.ts`
- `client/src/hooks/use-analytics-data.ts`
- `client/src/components/batch-management/BatchAnalyticsView.tsx`

**Estimated Effort:** 2-3 hours

---

### Task 12 (Optional): Geography-Level Growth & Mortality KPIs
**Scope:** Enable real TGC, SGR, Mortality data in Executive Dashboard  
**Priority:** 🎯 Medium Impact, Requires Backend Work  
**Type:** Feature Enhancement (Backend + Frontend)

**Current State:**
- Executive Dashboard shows "N/A" for TGC, SGR, Feed This Week, Mortality metrics
- These metrics exist per-batch but need geography-level aggregation

**Solution:**
Create new backend endpoint:
```
GET /api/v1/batch/batches/geography-summary/
  ?geography={id}
  &start_date={date}
  &end_date={date}
```

Returns:
```json
{
  "geography_id": 1,
  "growth_metrics": {
    "avg_tgc": 0.42,
    "avg_sgr": 1.8,
    "avg_growth_rate": 2.5
  },
  "mortality_metrics": {
    "total_count": 50000,
    "avg_mortality_rate": 12.5,
    "by_cause": [...]
  },
  "feed_metrics": {
    "total_feed_kg": 250000,
    "avg_fcr": 1.15
  }
}
```

**Backend Work:**
- Create geography-level aggregation endpoint (following aggregation playbook)
- Aggregate data across all batches in geography
- Add filters: geography, start_date, end_date
- Write tests
- Update OpenAPI spec

**Frontend Work:**
- Add `useGeographyPerformanceMetrics` hook
- Update `OverviewTab` to use real metrics
- Replace N/A placeholders with actual data
- Add tests

**Estimated Effort:** 4-6 hours (3h backend, 1-2h frontend)

**See:** Backend GitHub issue (to be created)

---

**Plan Ready for Execution**

