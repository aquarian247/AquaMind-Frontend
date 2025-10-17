# AquaMind Executive Frontends - Master Implementation Plan

**Date Created:** October 17, 2025  
**Status:** Ready for Execution  
**Prerequisites:** ✅ Backend Lice Enhancement Complete

---

## Overview

Comprehensive plan to implement three role-specific operational dashboards that replace manual weekly reporting with real-time, auto-generated analytics. Combined, these dashboards will serve 5+ key personas and replace 70+ pages of manual Excel/PDF reporting.

---

## Three Dashboard Plans

### 1. Executive Dashboard
**Folder:** `executive-dashboard-plan/`  
**Persona:** CEO, CFO  
**Complexity:** Medium  
**Sessions:** 2-3  
**Tasks:** 10

**Scope:**
- Strategic KPIs (biomass, revenue, EBITDA, survival rate)
- Facility health overview
- Financial analytics
- Capacity planning
- Market intelligence

**Start:** Task 0 - Backend API gap analysis

---

### 2. Freshwater Station Manager Dashboard
**Folder:** `freshwater-dashboard-plan/`  
**Persona:** Oversight Manager of All Freshwater Stations  
**Complexity:** High  
**Sessions:** 3-4  
**Tasks:** 13

**Scope:**
- Auto-generated 16-page weekly report
- Facility overview, growth performance, size distribution
- 90-day historical comparison (2021-2025)
- Forensic analysis (8-panel time series)
- Transfer planning (batches ready for sea)
- Station details grid

**Start:** Task 0 - Weekly report analysis & data mapping

---

### 3. Sea Area Operations Manager Dashboard
**Folder:** `sea-operations-dashboard-plan/`  
**Persona:** Oversight Manager of All Farming Areas (Sea-Based)  
**Complexity:** Very High  
**Sessions:** 4-5  
**Tasks:** 14

**Scope:**
- Replace 47-page Týsdagsrapport (manual weekly report)
- 12 comprehensive KPIs
- Lice management (Bakkafrost 2025 goals + multi-year trends)
- Market intelligence (Stágri Salmon Index)
- Facility performance rankings

**Start:** Task 0 - Prototype extraction & analysis

---

## Recommended Execution Order

### Approach A: Sequential (Lowest Risk)
Execute dashboards one at a time to completion:

1. **Executive Dashboard** (simplest, establishes patterns)
2. **Freshwater Dashboard** (medium complexity, different data sources)
3. **Sea Operations Dashboard** (most complex, has prototype to extract from)

**Pros:**
- Each dashboard fully functional before moving to next
- Patterns established early can be reused
- Easier to UAT incrementally
- Lower context-switching cost

**Cons:**
- Longer total calendar time
- May discover shared components late

---

### Approach B: Parallel Foundation (Faster)
Execute foundational tasks in parallel, then complete vertically:

**Phase 1 - Foundations (Parallel):**
- Exec Task 0-2 (scaffolding, types, API layer)
- Freshwater Task 0-2 (analysis, types, API layer)
- Sea Ops Task 0-2 (extraction, types, API layer)

**Phase 2 - Vertical Completion:**
- Complete Executive Dashboard (Tasks 3-10)
- Complete Freshwater Dashboard (Tasks 3-13)
- Complete Sea Operations Dashboard (Tasks 3-14)

**Pros:**
- Faster time to market (all foundations ready)
- Shared components identified early
- API patterns consistent
- Can parallelize if multiple agents

**Cons:**
- Higher context-switching
- More coordination needed
- Risk of duplication

---

### Approach C: Hybrid (Recommended)
Complete Executive first (establishes patterns), then parallel on others:

**Phase 1:** Executive Dashboard Tasks 0-10 (COMPLETE)
**Phase 2:** Freshwater + Sea Ops Tasks 0-4 in parallel (Foundations)
**Phase 3:** Freshwater Tasks 5-13 (COMPLETE)
**Phase 4:** Sea Ops Tasks 5-14 (COMPLETE)

**Pros:**
- Patterns established (Executive serves as template)
- Shared components identified from Executive
- Freshwater and Sea Ops can reuse patterns
- Moderate parallelization benefit

**Cons:**
- Executive may need refactoring if shared components emerge
- Requires discipline to extract shared code

---

## Shared Components Opportunity

After analyzing all three dashboards, these components could be shared:

### Candidates for `/features/shared/executive-common/`
1. **KPICard** - Used by all 3 dashboards (trend indicators, color-coding)
2. **GeographyFilter** - Used by Executive and Sea Ops
3. **FacilityHealthBadge** - Used by all 3
4. **PerformanceTable** - Used by Freshwater and Sea Ops
5. **TrendChart** - Multi-year trend visualization (Freshwater, Sea Ops)
6. **StatusBadge** - Color-coded status (all 3)

### Recommendation
- Don't create `shared/executive-common/` prematurely
- Build within each feature first
- Refactor to shared after patterns clear (2nd dashboard reveals duplication)

---

## Backend API Status

### Complete & Ready ✅
- Infrastructure summaries (Geography, Area, Station, Hall)
- Batch container assignments summary
- Lice counts summary & trends (NEW from prerequisite plan)
- Feeding events summary
- FCR trends
- Environmental readings
- Health sampling
- Mortality events
- Growth samples

### May Need Creation ⚠️
1. **Market Prices API** - Stágri Salmon Index integration
   - Options: External API integration, Manual entry, Mock data
   - Priority: Medium (only Sea Ops + Exec market tab)
   
2. **Financial Aggregations** - Revenue, EBITDA, costs
   - Finance app exists, may just need summary endpoint
   - Priority: Medium (Executive financial tab)

3. **Harvest Forecast** - Next 30/90 days
   - Scenario app has projections
   - May need dedicated forecast endpoint
   - Priority: Low (Executive strategic tab)

4. **Size Distribution Aggregation** - Weight class distribution
   - Can calculate client-side from growth samples
   - Server-side would be more efficient
   - Priority: Low (optimization opportunity)

5. **90-Day Performance Aggregation** - Historical batch metrics
   - Can calculate from growth samples + mortality events
   - Server-side would reduce client processing
   - Priority: Low (Freshwater 90-day charts)

---

## Testing Strategy

### Per-Dashboard Testing
Each dashboard plan includes comprehensive testing tasks.

### Integration Testing (After All Complete)
**Cross-Dashboard Tests:**
- Same user can access multiple dashboards (if RBAC allows)
- Geography filter state doesn't leak between dashboards
- Theme changes apply to all dashboards
- Shared API cache works correctly

**E2E Scenarios:**
1. Executive reviews overview → drills into facility → sees lice alert → switches to Sea Ops lice management
2. Freshwater manager sees transfer-ready batch → creates transfer → Sea Ops sees incoming smolt
3. CEO switches geography filter → all dashboards update appropriately

---

## RBAC Integration Plan

### Current Sidebar (Static)
All users see all menu items (not role-based yet).

### Enhanced Sidebar (Post-Implementation)
Menu items shown based on `user.role`:

```typescript
// Sidebar.tsx enhancement
const menuItems = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'fas fa-tachometer-alt',
    roles: ['*'] // Everyone
  },
  {
    path: '/executive',
    label: 'Executive Dashboard',
    icon: 'fas fa-chart-pie',
    roles: ['ceo', 'cfo', 'executive']
  },
  {
    path: '/freshwater',
    label: 'Freshwater Operations',
    icon: 'fas fa-water',
    roles: ['freshwater_manager', 'freshwater_operator', 'ceo']
  },
  {
    path: '/sea-operations',
    label: 'Sea Operations',
    icon: 'fas fa-ship',
    roles: ['sea_operations_manager', 'regional_manager_sea', 'ceo']
  },
  // ... existing items
];

const visibleItems = menuItems.filter(item => 
  item.roles.includes('*') || 
  item.roles.includes(user?.role)
);
```

### Implementation Approach
1. **Phase 1:** Add menu items for all users (current approach - your answer to Q1)
2. **Phase 2:** (Later) Implement dynamic filtering based on user.role
3. **Phase 3:** (Optional) User preferences for dashboard defaults

---

## Data Requirements

### Minimum Test Data Needed
- **Geographies:** 2+ (Faroe Islands, Scotland)
- **Sea Areas:** 5+ (A09, A13, A21, Loch Roag, Loch Eriboll)
- **Freshwater Stations:** 5+ (S03, S08, S16, S21, S24)
- **Rings (Sea Containers):** 175+ (realistic load)
- **Tanks (Freshwater):** 50+ across stations
- **Batches:** 30+ active (15 sea, 15 freshwater)
- **Lice Counts:** 6+ months of data (for trends)
- **Growth Samples:** Regular samples for size distribution
- **Mortality Events:** For trend calculations
- **Feeding Events:** For FCR and consumption metrics

**If Insufficient Data:**
- Accept "Insufficient data" messages with honest disclosure
- Focus testing on available data
- Use data generation scripts if available
- Document data requirements for production UAT

---

## Timeline Estimates

### Conservative (Sequential - Approach A)
- **Executive:** 2-3 sessions = 10-15 hours
- **Freshwater:** 3-4 sessions = 15-20 hours
- **Sea Operations:** 4-5 sessions = 20-25 hours
- **Total:** 9-12 sessions = 45-60 hours = 5-6 full days

### Optimistic (Hybrid - Approach C)
- **Executive:** 2 sessions = 10 hours
- **Freshwater:** 3 sessions = 15 hours (reuses Executive patterns)
- **Sea Operations:** 4 sessions = 20 hours (reuses Freshwater + Executive)
- **Total:** 9 sessions = 45 hours = 4-5 full days

---

## Risk Assessment

### Low Risk
- ✅ Backend APIs mostly ready
- ✅ Patterns established in existing features
- ✅ UI/UX defined by prototypes
- ✅ Business logic available for extraction

### Medium Risk
- ⚠️ Market price integration (external data)
- ⚠️ Financial aggregations (may need backend work)
- ⚠️ Size distribution calculations (complex statistics)
- ⚠️ Performance with large datasets (500 days × 8 params)

### Mitigation Strategies
- **Market Prices:** Mock data with disclosure banner, backend implements later
- **Financial:** Use available finance data, create lightweight aggregations
- **Size Distribution:** Validate calculation against prototype thoroughly
- **Performance:** Virtualization, lazy loading, date range limits

---

## Success Criteria (All Dashboards)

### Functional Excellence
✅ All tabs implemented and working  
✅ Real backend data (no mocks except where disclosed)  
✅ Geography filtering seamless  
✅ Color-coding accurate  
✅ Calculations match manual reports  
✅ Export functionality works

### Technical Quality
✅ TypeScript strict mode (0 errors)  
✅ All tests passing (80%+ coverage per dashboard)  
✅ Generated ApiService exclusively  
✅ No client-side aggregation (use backend endpoints)  
✅ Honest fallbacks (N/A) for missing data  
✅ Performance targets met (< 3s load)

### User Experience
✅ Matches or exceeds prototype UX  
✅ Intuitive navigation  
✅ Clear loading states  
✅ Helpful error messages  
✅ Mobile responsive  
✅ Keyboard accessible  
✅ Multi-theme support (ocean-depths, arctic-aurora, serenity-cove)

---

## Post-Implementation Tasks

### UAT & Iteration
1. UAT with CEO (Executive Dashboard)
2. UAT with Freshwater Station Boss (Freshwater Dashboard)
3. UAT with Sea Operations Manager (Sea Operations Dashboard)
4. Gather feedback and iterate
5. Performance optimization based on real usage
6. Add requested features

### Future Enhancements
1. **PDF Export** - Server-side report generation
2. **Email Scheduling** - Automated weekly email delivery
3. **Mobile Apps** - Native iOS/Android for field use
4. **Real-time Alerts** - WebSocket integration for critical events
5. **AI Insights** - Anomaly detection, predictive analytics
6. **Offline Support** - PWA for unreliable connectivity areas
7. **Custom Dashboards** - User-configurable KPI selection

---

## Questions & Decisions Log

### Q1: Layout/Navigation Approach → **a) Add new menu items to sidebar**
- Menu items: Executive Dashboard, Freshwater Operations, Sea Operations
- RBAC filtering can be added later (dynamic menu)
- Current: All users see all items
- Future: Filter based on user.role

### Q2: Backend Lice Enhancement → **b) Separate prerequisite plan ✅ COMPLETE**
- LiceType model created
- Enhanced LiceCount model
- Summary and trends endpoints added
- 32 tests passing

### Q3: Freshwater Pages Source → **c) Use screenshots + analysis docs**
- 4 screenshots provided
- Weekly report analysis document
- UI/UX vision document
- Build from these specifications

### Q4: Executive Dashboard Integration → **b) Rebuild using AquaMind patterns**
- Extract business logic from prototype
- Rebuild UI with TypeScript, Shadcn/ui
- Follow features/ structure
- Use generated ApiService

### Q5: Sea Area Operations Source → **c) Combination approach**
- Reuse business logic and calculations
- Rebuild UI components
- Follow AquaMind patterns
- Best of both worlds

### Q6: Backend API Endpoints → **Cross-referenced both implementation plans**
- Infrastructure summaries ✅
- Batch summaries ✅
- Feeding summaries ✅
- Lice endpoints ✅ NEW
- FCR trends ✅
- Market prices ⚠️ TBD
- Financial aggregations ⚠️ TBD

---

## Dependencies Map

```
Backend Lice Enhancement (COMPLETE)
    ↓
Executive Dashboard
    ├─ Financial endpoints (TBD)
    ├─ Market prices (TBD)
    └─ Existing aggregations ✅
        ↓
Freshwater Dashboard
    ├─ Can reuse KPICard from Executive
    ├─ Size distribution calculations (new)
    └─ Existing aggregations ✅
        ↓
Sea Operations Dashboard
    ├─ Can reuse KPICard, StatusBadge from previous
    ├─ Can reuse TrendChart from Freshwater
    ├─ Market prices (same TBD as Executive)
    └─ Existing aggregations ✅
```

---

## Resource Allocation Recommendations

### Single Agent (Sequential)
**Recommended Order:** Executive → Freshwater → Sea Operations

**Reasoning:**
- Executive establishes base patterns
- Freshwater introduces environmental complexity
- Sea Operations most complex but can reuse most components

**Timeline:** 9-12 sessions over 5-6 days

---

### Multiple Agents (Parallel)
**Agent 1:** Executive Dashboard (Tasks 0-10)  
**Agent 2:** Freshwater Dashboard (Tasks 0-13)  
**Agent 3:** Sea Operations Dashboard (Tasks 0-14)

**Coordination Required:**
- Shared component decisions (who creates KPICard?)
- Theme integration consistency
- Testing strategy alignment
- API hook patterns

**Timeline:** 4-5 sessions (parallel) = 2-3 days

**Recommendation:** Single agent sequential unless urgent deadline.

---

## Shared Code Extraction Strategy

### After Executive Dashboard Complete
Extract to `features/shared/operations/`:
- `KPICard.tsx`
- `StatusBadge.tsx`
- `TrendIndicator.tsx`

### After Freshwater Dashboard Complete
Extract additionally:
- `PerformanceTable.tsx`
- `MultiYearTrendChart.tsx`

### After Sea Operations Complete
Refactor if needed:
- `RankingChart.tsx`
- Market pricing utilities (if used by multiple)

---

## Documentation Structure

```
executives_frontends/
├── MASTER_IMPLEMENTATION_PLAN.md (this file)
├── executive-dashboard-plan/
│   ├── IMPLEMENTATION_PLAN.md (10 tasks, detailed)
│   ├── SUMMARY.md (quick reference)
│   └── [implementation artifacts as created]
├── freshwater-dashboard-plan/
│   ├── IMPLEMENTATION_PLAN.md (13 tasks, detailed)
│   ├── SUMMARY.md (quick reference)
│   └── [implementation artifacts as created]
├── sea-operations-dashboard-plan/
│   ├── IMPLEMENTATION_PLAN.md (14 tasks, detailed)
│   ├── SUMMARY.md (quick reference)
│   └── [implementation artifacts as created]
└── [existing prototype files and screenshots]
```

---

## Quality Gates

### Each Dashboard Must Pass
- ✅ All tasks complete
- ✅ All tests passing (80%+ coverage)
- ✅ TypeScript 0 errors
- ✅ Linter 0 errors
- ✅ Performance acceptable
- ✅ Accessibility basics (keyboard nav, ARIA)

### Before UAT
- ✅ All 3 dashboards complete
- ✅ Integration testing complete
- ✅ No console errors
- ✅ Mobile tested
- ✅ Documentation complete

### Before Production
- ✅ UAT feedback incorporated
- ✅ Performance optimized
- ✅ Error handling robust
- ✅ Monitoring in place

---

## Communication Plan

### Status Updates
After each dashboard completion:
1. Create `COMPLETION_SUMMARY.md` in plan folder
2. List accomplishments
3. Note any deviations from plan
4. Document any new shared components
5. Update this master plan

### Issue Tracking
- Backend gaps → Create GitHub issues in AquaMind repo
- Frontend bugs → Create GitHub issues in AquaMind-Frontend repo
- Shared component needs → Document in master plan

---

## Rollout Strategy

### Soft Launch (Recommended)
1. **Week 1:** Executive Dashboard → CEO/CFO testing
2. **Week 2:** Freshwater Dashboard → Freshwater manager testing
3. **Week 3:** Sea Operations Dashboard → Sea operations manager testing
4. **Week 4:** Gather feedback, iterate
5. **Week 5:** Full rollout to all users

### Big Bang (Alternative)
- Complete all 3 dashboards
- Launch all at once
- Higher risk but faster adoption

---

## Success Metrics (Post-Launch)

### Adoption Metrics
- % of users using dashboards vs old reports
- Time spent in each dashboard
- Feature usage (which tabs most visited)

### Operational Metrics
- Time saved vs manual reporting
- Faster issue identification
- Better decision-making speed
- Reduced data entry errors

### Technical Metrics
- Page load times
- Error rates
- API response times
- User satisfaction scores

---

## Next Steps

1. **Review Plans:** Review all 3 plans for completeness
2. **Choose Approach:** Sequential (A), Parallel (B), or Hybrid (C)
3. **Backend Coordination:** Identify which TBD endpoints are critical
4. **Start Execution:** Begin with chosen dashboard Task 0

---

## Contact & Support

**Questions on Plans:**
- Review detailed plan in respective folder
- Check SUMMARY.md for quick overview
- Reference source materials (prototypes, screenshots, analysis docs)

**Backend Coordination:**
- API gaps documented in each plan
- Can proceed with mocks + disclosure banners
- Backend team can implement missing endpoints in parallel

**Implementation Support:**
- Follow plan task-by-task
- Update completion status in each plan
- Flag blockers immediately
- Communicate deviations from plan

---

**All Plans Ready - Ready to Rock! 🚀**

Choose your starting dashboard and begin with Task 0!

