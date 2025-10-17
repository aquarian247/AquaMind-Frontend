# Freshwater Dashboard - Quick Summary

**Persona:** Oversight Manager of All Freshwater Stations  
**Sessions:** 3-4  
**Tasks:** 13  
**Complexity:** High

---

## What We're Building

Auto-generated weekly report dashboard replacing manual Excel reporting (16-page report).

### Tabs
1. **Weekly Report** - Auto-generated version of current manual report (8 sections)
2. **Forensic Analysis** - 8-panel time series for root cause analysis
3. **Transfer Planning** - Batches ready for sea pen transfer (180-350g smolts)
4. **Station Details** - Per-station overview cards

### Key Features
- Auto-generates weekly report from real-time data
- Size distribution calculation (normal distribution from growth samples)
- 90-day historical comparison (2021-2025)
- Color-coded performance thresholds
- Environmental correlation analysis
- Transfer readiness indicators
- Export to PDF

---

## Technical Approach

**Build from Scratch:**
- No full prototype (only analysis docs)
- Guided by screenshots + weekly report analysis
- Follow existing infrastructure patterns

**Complex Calculations:**
- Size distribution from `avg_weight_g` + `std_deviation_weight`
- SGR, FCR, TGC formulas
- 14/30/90-day rolling metrics
- Environmental correlation

---

## Backend Dependencies

**Ready:**
- ✅ Station summaries
- ✅ Hall summaries
- ✅ Growth samples
- ✅ Environmental readings
- ✅ Feeding events
- ✅ Mortality events

**May Need:**
- ⚠️ Size distribution endpoint (or calc client-side - acceptable)
- ⚠️ 90-day performance aggregation (or calc from growth samples)
- ⚠️ Transfer readiness endpoint (or filter growth samples)

---

## Success Metrics

- Replaces manual 16-page weekly report
- All calculations match current report
- Color-coding thresholds accurate
- Forensic analysis enables root cause identification
- Transfer planning works
- Export to PDF functional

---

## Color-Coding Thresholds

**Mortality:**
- 14 days: <0.50% green, 0.50-0.75% yellow, >0.75% red
- 30 days: <0.75% green, 0.75-1.20% yellow, >1.20% red
- 90 days: <1.20% green, 1.20-3.00% yellow, >3.00% red

**TGC (90-day):**
- >3.5 green (good)
- 3.0-3.5 yellow (medium)
- <3.0 red (poor)

**Temperature by Size:**
- Varies by fish weight class
- Documented in weekly report analysis

---

**Start with Task 0 to map report sections to data sources**

