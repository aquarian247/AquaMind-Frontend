# Weekly Freshwater Report Analysis - Key Insights

## Report Overview
**Bakkafrost Weekly Report - Week 40 (Sept 29 - Oct 5, 2025)**

This is a comprehensive 16-page weekly report created by the Freshwater Station Boss covering all freshwater operations in the Faroe Islands.

---

## Critical Pages (1-8) - What Must Be Real-Time in AquaMind

### Page 2: YVIRLIT (Overview Summary)
**Current Status Across All Facilities:**

Organized by facility (S03 Norðtoftir, S08 Gjógv, S16 Glyvraðalur, S21 Viðareiði, S24 Strond):

**Key Metrics Per Facility:**
- **Inni á støðini** (Currently at station):
  - Miðalvekt (g) - Average weight
  - Tal (mió stk) - Count (millions)
  - Biomassi (tons) - Total biomass
  - Útfóðring (tons) - Feed consumption
  - Felli (stk) - Mortality count
  - Felli (%) - Mortality percentage
  - Felli (mvg) - Average mortality weight

- **Burturbein** (Moved out/Transferred):
  - Count and weight of fish transferred

- **Útseting í vikuni** (Released this week):
  - Fish released to sea pens
  - Destination (e.g., A18 Hov, A06 Argir)

- **Útseting higartil 2025** (Total released 2025):
  - Cumulative transfers for the year

**GRAND TOTAL**: 33.4 million fish, 2,519 tons biomass across all facilities

---

### Page 3: VIKA 40 - VØKSTUR (Week 40 - Growth)
**Detailed Growth Metrics by Tank/Batch:**

**Table Columns:**
- Tal av fiski (stk) - Fish count
- Biomassi inni (kg) - Biomass
- Primo vekt (g) - Starting weight
- Út vekt (g) - Current weight
- SGR - Specific Growth Rate
- Vøkstur (kg) - Growth in kg
- Fóður nógd - Feed amount
- Temp (°C) - Temperature

**Color-Coded Performance Indicators:**
- Temperature ranges by weight class (7°C for under 5g → 15°C for 700-999g)
- FCR (Feed Conversion Ratio) color coding (purple = excellent <1.0)

**Key Insight:** Station boss needs to see growth performance vs. targets with color-coded alerts

---

### Page 4: VIKA 40 - FELLI (Week 40 - Mortality)
**Mortality Tracking:**

**Table Columns:**
- Tal av fiski (stk) - Fish count
- Mv (g) - Average weight
- Felli (%) - Mortality percentage
- Felli (stk) - Mortality count
- Mv (g) Felli - Average weight of dead fish
- Felli higartil (%) - Cumulative mortality
- Frávik (%) - Deviation from expected
- **Felli higartil + Frávik (%)** - Total mortality + deviation

**Color Coding:**
- Green: Low mortality (<0.5%)
- Yellow: Moderate (0.5-1.5%)
- Red: High (>1.5%)

**Viðmerking** (Notes section) - Space for comments on mortality causes

**Key Insight:** Mortality must be tracked with cumulative totals and deviation from baseline

---

### Page 5: STØDD AV FISKI Á SMOLTSTØÐUNUM (Fish Size Distribution at Smolt Stations)
**Size Distribution Tables:**

**Three time snapshots:**
- 05-10-2025 (Current)
- 28-09-2025 (Last week)
- 05-10-2025 (Comparison with % change)

**Size Classes:**
- <0.1g, 0.1-5g, 5-70g, 70-180g, 180-350g, >350g

**Charts:**
- **Smolt 180-350g** - Line chart showing monthly trends (2021-2025)
- **Smolt >350g** - Line chart showing larger smolt trends

**Key Insight:** Station boss needs to see size distribution to plan transfers and identify growth bottlenecks

---

### Page 6: ÚTSET MIÐALVEKT OG FELLI EFTIR 90 DAGAR (2021-2025)
**90-Day Performance Tracking:**

**Six-panel dashboard showing:**
1. **acc. Avg. Weight (gr)** - Growth curve over 90 days (2021-2025 comparison)
2. **Monthly avg. weight (g)** - Bar chart by month and year
3. **acc. Monthly sales biomass (kg)** - Cumulative sales
4. **Monthly sales in biomass (g)** - Monthly sales breakdown
5. **acc. 90 d mortality (%)** - Cumulative mortality trends
6. **Monthly 90 day mortality (%)** - Monthly mortality patterns
7. **acc. Monthly sales count (pcs)** - Cumulative count
8. **Monthly sales count (pcs)** - Monthly count breakdown

**Key Insight:** Historical comparison is CRITICAL - station boss needs to see if current performance matches historical patterns

---

### Page 7-8: FELLI OG VØKSTUR 2024 (14, 30 OG 90 DAGAR)
**Detailed Batch Performance Tables:**

**For each batch (Alíøki):**
- Ringur - Ring/batch ID
- Dato (útset) - Release date
- Smoltstøð - Smolt station
- Árgangur - Year class
- Mv (g) - Average weight
- Tal (stk) - Count
- Biomassi (kg) - Biomass

**Performance Metrics:**
- **akk. Felli (%)** - Cumulative mortality at 14d, 30d, 90d
- **akk. TGC** - Thermal Growth Coefficient at 14d, 30d, 90d

**Color-Coded KPIs:**
- Green: Excellent performance
- Yellow: Acceptable
- Red: Poor performance

**KPI Thresholds shown:**
- Felli eftir sjóseting (Mortality after sea transfer):
  - 14 days: <0.50% (green), 0.50-0.75% (yellow), >0.75% (red)
  - 30 days: <0.75%, 0.75-1.20%, >1.20%
  - 90 days: <1.20%, 1.20-3.00%, >3.00%
- TGC eftir sjóseting:
  - 90 days: <3.0 (red), 3.0-3.5 (yellow), >3.5 (green)

---

## What This Means for AquaMind UI/UX

### 1. **Weekly Report Should Be Auto-Generated in Real-Time**
The station boss currently creates this manually. AquaMind should:
- ✅ Auto-generate all 8 critical pages in real-time
- ✅ Allow export to PDF for sharing
- ✅ Update continuously (not just weekly)
- ✅ Maintain historical snapshots for comparison

### 2. **Dashboard Must Include:**

#### A. **Facility Overview Panel** (Page 2 equivalent)
- Current biomass, count, avg weight per facility
- Weekly feed consumption
- Mortality count and percentage
- Transfers in/out
- Grand totals across all facilities

#### B. **Growth Performance Panel** (Page 3 equivalent)
- Growth rate (SGR) by tank/batch
- Temperature monitoring
- FCR tracking with color-coded performance
- Comparison to targets

#### C. **Mortality Tracking Panel** (Page 4 equivalent)
- Daily/weekly/cumulative mortality
- Deviation from baseline
- Color-coded alerts
- Notes/annotations for incidents

#### D. **Size Distribution Panel** (Page 5 equivalent)
- Real-time size class distribution
- Transfer readiness indicators
- Trend charts comparing to historical data

#### E. **90-Day Performance Dashboard** (Page 6 equivalent)
- Multi-year comparison charts
- Growth curves
- Mortality trends
- Sales/transfer patterns

#### F. **Batch Performance Table** (Pages 7-8 equivalent)
- Detailed batch-level metrics
- 14/30/90-day KPIs
- Color-coded performance vs. thresholds
- Sortable/filterable by performance

### 3. **Key UX Principles from This Report:**

#### Color Coding is Essential
- **Green/Yellow/Red** for performance indicators
- **Temperature ranges** color-coded by fish size
- **FCR performance** with purple for excellent (<1.0)

#### Tabular Data is Important
- Station bosses are comfortable with dense tables
- But tables must be:
  - Sortable
  - Filterable
  - Color-coded for quick scanning
  - Exportable

#### Historical Comparison is Critical
- Every metric should show:
  - Current value
  - Last week
  - Last year same period
  - 5-year trend
- Charts must overlay multiple years

#### Aggregation Levels Matter
- **Facility level** - Total across all tanks
- **Tank/batch level** - Individual performance
- **Grand total** - All facilities combined
- Easy drill-down from summary to detail

### 4. **Missing from Current Prototype:**

❌ **Facility-level aggregation** - We show tank-level but not facility totals
❌ **Size distribution tracking** - No size class breakdown
❌ **90-day performance dashboard** - No multi-year historical comparison
❌ **Batch performance table** - No detailed batch-level KPI tracking
❌ **Transfer planning** - No "ready for transfer" indicators based on size
❌ **FCR tracking** - Not prominently displayed
❌ **SGR (Specific Growth Rate)** - Not calculated/shown
❌ **Temperature by size class** - Not integrated with growth data

---

## Recommended Enhancements to Freshwater Station Interface

### New Tab: "Weekly Report"
Auto-generated version of pages 2-8 with:
- Real-time updates (not just weekly snapshots)
- Export to PDF button
- Historical snapshot comparison
- All the tables and charts from the current manual report

### Enhanced "Batch Overview" Tab
Add:
- Size distribution chart (like page 5)
- 90-day performance comparison (like page 6)
- Batch performance table (like pages 7-8)
- Transfer readiness indicators

### New "Facility Summary" Panel
- Aggregate view across all tanks
- Matches page 2 "YVIRLIT" structure
- Quick overview before drilling into details

### Integration with Transfer Planning
- Automatically flag batches ready for transfer (180-350g smolts)
- Show destination sea pen capacity
- Coordinate with logistics

---

## Conclusion

This weekly report reveals that the Freshwater Station Boss needs:

1. **Dense, tabular data** with smart color coding
2. **Historical comparison** as a first-class feature
3. **Multi-level aggregation** (tank → facility → total)
4. **Size distribution tracking** for transfer planning
5. **Auto-generated reports** that replace manual Excel work

The current prototype's 8-panel time series is excellent for forensic analysis, but we need to add:
- Facility-level summary dashboards
- Batch performance tables with KPIs
- Size distribution tracking
- 90-day historical comparison charts
- Auto-report generation

This transforms the interface from "monitoring tool" to "complete management system" that replaces the manual weekly reporting process.

