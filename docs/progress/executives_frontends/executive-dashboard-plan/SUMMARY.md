# Executive Dashboard - Quick Summary

**Persona:** CEO, CFO  
**Sessions:** 2-3  
**Tasks:** 10  
**Complexity:** Medium

---

## What We're Building

Strategic oversight dashboard with 4 tabs for C-level decision making.

### Tabs
1. **Overview** - 12 KPIs + facility list with health indicators
2. **Financial** - Revenue trends + cost breakdown + key metrics
3. **Strategic** - Capacity utilization + harvest forecasts + scenario integration
4. **Market** - Market share + salmon pricing + outlook

### Key Features
- Geography filtering (Global, Faroe, Scotland)
- Color-coded alerts (lice, financial performance)
- Trend indicators (↑↓ with percentages)
- Export to PDF (future)
- Multi-theme support

---

## Technical Approach

**Reuse from Prototype:**
- KPI calculation formulas
- Alert thresholds
- Color-coding logic

**Rebuild for AquaMind:**
- TypeScript + Shadcn/ui
- Generated ApiService
- TanStack Query hooks
- Features/ structure

---

## Backend Dependencies

**Ready:**
- ✅ Lice summary/trends
- ✅ Infrastructure summaries
- ✅ Batch summaries

**TBD:**
- ⚠️ Financial aggregations
- ⚠️ Market prices (may need external integration)
- ⚠️ Harvest forecast endpoint

---

## Success Metrics

- All KPIs display with real data or honest N/A
- Geography filtering works seamlessly
- Matches prototype UX quality
- Mobile responsive
- < 2 second page load

---

**Start with Task 0 to identify backend API gaps**

