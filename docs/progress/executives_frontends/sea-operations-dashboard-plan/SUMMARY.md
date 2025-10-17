# Sea Operations Dashboard - Quick Summary

**Persona:** Oversight Manager of All Farming Areas (Sea-Based)  
**Sessions:** 4-5  
**Tasks:** 14  
**Complexity:** Very High

---

## What We're Building

Replace 47-page manual weekly report (Týsdagsrapport) with comprehensive real-time operations dashboard.

### Tabs
1. **Weekly Report** - 12 KPI cards + facility summary table + lice alerts
2. **Lice Management** - Bakkafrost 2025 goals + current status + multi-year trends
3. **Market Intelligence** - Stágri Salmon Index pricing + harvest timing optimizer
4. **Facility Comparison** - Performance rankings (TGC, FCR, mortality, lice)

### Key Features
- 12 comprehensive KPIs (biomass, growth, mortality, lice, feed, releases)
- Per-facility performance tracking
- Color-coded lice alerts (Bakkafrost 2025 standards)
- Multi-year trend charts (2021-2025)
- Performance rankings (top 5 per metric)
- Market price matrix (9 size classes × 4 weeks)
- Geography filtering
- Export to PDF (future)

---

## Technical Approach

**Extract from Prototype:**
- Complete working implementation in tarball
- Business logic in `lib/*.js` files
- 796-line `OperationsManager.jsx` component

**Conversion Strategy (Combination Approach):**
- ✅ Reuse: KPI formulas, thresholds, ranking algorithms
- ❌ Rebuild: UI components (JSX → TSX), data layer (static → API)
- Follow AquaMind patterns (features/ structure, ApiService, formatFallback)

---

## Backend Dependencies

**Ready:**
- ✅ Lice summary/trends (NEW)
- ✅ Infrastructure summaries
- ✅ Batch/container summaries
- ✅ Feeding summaries
- ✅ FCR trends
- ✅ Mortality events

**TBD:**
- ⚠️ Market prices (external integration needed)
- ⚠️ Ring-specific lice counts (available via lice-counts list)
- ⚠️ Treatment history (available via treatments list)

---

## Key Metrics (from Prototype)

**12 KPIs:**
1. Total Biomass: 57,586 tons
2. Average Weight: 2.896 kg
3. Feed This Week: 3,200 tons
4. TGC: 2.95
5. SGR: 0.76%
6. Mortality Count: 30,972
7. Mortality Biomass: 106 tons
8. Mature Lice: 8.39M
9. Movable Lice: 17.63M
10. Released from FW: 623,141
11. Total Rings: 175
12. Largest Mortality Size: 7,164 (3500-4000g)

**Lice Thresholds (Bakkafrost 2025):**
- Mature Lice: < 0.2 per fish (goal)
- Movable Lice: < 0.1 per fish (goal)
- Spring Period: < 0.8 mature per fish
- Alert Colors: < 0.5 green, 0.5-1.0 yellow, > 1.0 red

**Performance Rankings:**
- Top 5 by TGC (higher better)
- Top 5 by FCR (lower better)
- Top 5 by lowest mortality
- Top 5 by lowest lice counts

---

## Success Metrics

- Replaces 47-page manual weekly report
- All metrics calculable from backend
- Lice management matches Bakkafrost standards
- Rankings accurate
- Market data integrated (or clearly marked as pending)
- Geography filtering works
- Export functionality

---

## Data Sources (from Prototype)

**Facilities (Example Data):**
- Faroe Islands: A09 Argir, A13 Borðoyarvík, A21 Reynisarvatn S
- Scotland: Loch Roag, Loch Eriboll

**Lice Goals 2025:**
- Mature: < 0.2/fish
- Movable: < 0.1/fish
- Spring: < 0.8/fish

**Market Pricing (Stágri Index):**
- 9 size classes (1-2kg through 9+kg)
- Weekly price updates
- Historical trends 2023-2025

---

**Start with Task 0 to extract prototype logic**

