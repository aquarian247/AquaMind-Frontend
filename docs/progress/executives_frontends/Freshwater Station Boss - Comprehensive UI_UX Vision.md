# Freshwater Station Boss - Comprehensive UI/UX Vision

## Executive Summary

The Freshwater Station Boss is responsible for managing critical early lifecycle stages (Egg/Alevin → Fry → Parr → Smolt → Post-Smolt transfer) across multiple freshwater tanks. Their primary need is **forensic analysis capability** - understanding why fish died, thrived, or underperformed by correlating environmental parameters, feeding patterns, and health indicators over time.

This vision document outlines a complete UI/UX redesign that transforms the interface from a "current status dashboard" into a "time-traveling forensic analysis tool."

---

## Persona Deep Dive

### Who They Are
- **Role**: Freshwater Station Manager/Boss
- **Location**: On-site at freshwater facilities (Klaksvík, Fort William)
- **Experience**: 10-20 years in aquaculture, deep operational knowledge
- **Technical Comfort**: Moderate - comfortable with tablets/computers, prefers visual over numerical
- **Work Environment**: Split between office (monitoring) and facility floor (hands-on)

### Daily Workflow
1. **Morning Review** (7:00 AM): Check overnight mortality, water quality alerts
2. **Tank Rounds** (8:00 AM): Physical inspection of all tanks with tablet
3. **Feeding Oversight** (9:00 AM, 1:00 PM, 5:00 PM): Monitor automated feeders, adjust as needed
4. **Data Analysis** (11:00 AM): Investigate any anomalies or trends
5. **Planning** (3:00 PM): Prepare for upcoming transfers, coordinate with sea pen managers
6. **End-of-Day Report** (6:00 PM): Document issues, plan next day

### Key Pain Points (Current System)
- ❌ Can't easily correlate mortality spikes with environmental changes
- ❌ Historical data requires manual export and Excel analysis
- ❌ No visual overlay of multiple parameters on same timeline
- ❌ Difficult to compare current batch performance with historical batches
- ❌ Mobile interface inadequate for tank-side data entry
- ❌ No predictive alerts before problems escalate

### Success Metrics
- ✅ Reduce time to identify root cause of mortality events (from hours to minutes)
- ✅ Increase early detection of environmental issues (before fish health impacts)
- ✅ Improve batch-to-batch consistency (reduce performance variance)
- ✅ Enable data-driven decision making (vs. gut feel)

---

## UI/UX Vision: The "Time Machine Dashboard"

### Core Concept
Transform the interface into a **multi-layered temporal analysis tool** that allows station bosses to:
1. See all parameters overlaid on a shared timeline
2. Scrub through historical data like a video timeline
3. Identify correlations between inputs (feed, temperature) and outcomes (mortality, growth)
4. Compare current performance against historical baselines

---

## Interface Components

### 1. **Multi-Panel Time Series Overlay** (Already Implemented ✅)

**What We Built:**
- 8 stacked panels sharing a 500-day timeline
- O2, CO2, NO2, NO3, Temperature, Mortality, Feed, Health Scores
- Lifecycle stage markers
- Interactive tooltips

**Enhancements Needed:**

#### A. **Timeline Scrubber**
```
[========|====================>] Day 347 of 500
         ↑                    ↑
    Mortality spike      Current day
```
- Draggable playhead to "scrub" through time
- Click any day to see detailed snapshot
- Keyboard shortcuts (← → arrows to step day-by-day)
- Speed controls to "play" time-lapse of parameters

#### B. **Zoom & Pan Controls**
- Pinch-to-zoom on touch devices
- Mouse wheel zoom on desktop
- "Focus on incident" button to auto-zoom to mortality spikes
- Preset zoom levels: "Last 7 days", "Last 30 days", "Current lifecycle stage", "Full batch"

#### C. **Annotation Layer**
- Station boss can add notes to specific days: "Changed feed supplier", "Power outage 2hrs", "New batch stocked"
- Annotations appear as flags on timeline
- Searchable annotation library
- Auto-annotations for system events (equipment maintenance, transfers)

#### D. **Correlation Indicators**
- When mortality spikes, system highlights potential correlating factors:
  - "O2 dropped below 7.5 mg/L 12 hours before spike"
  - "Temperature increased 2°C in 24 hours preceding event"
  - "Feed was reduced 30% two days prior"
- Visual connection lines between cause and effect

---

### 2. **Comparative Analysis View** (NEW)

**Purpose:** Compare current batch against historical batches to identify deviations early.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Batch Comparison: Current (2024-B3) vs Historical Avg  │
├─────────────────────────────────────────────────────────┤
│  [Current Batch] [Best Performer] [Worst Performer]     │
│  [Historical Average] [Custom Selection...]             │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │  Growth Curve Overlay                            │   │
│  │  ▲                                               │   │
│  │  │     ╱─────── Current (ahead of avg!)         │   │
│  │  │   ╱╱                                          │   │
│  │  │ ╱╱  ─ ─ ─ Historical Avg                     │   │
│  │  │╱                                              │   │
│  │  └──────────────────────────────────────────►   │   │
│  │    Days Since Stocking                           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  Key Metrics Comparison:                                │
│  ┌──────────┬──────────┬──────────┬──────────┐         │
│  │ Metric   │ Current  │ Hist Avg │ Delta    │         │
│  ├──────────┼──────────┼──────────┼──────────┤         │
│  │ TGC      │ 2.8      │ 2.5      │ +12% ✓   │         │
│  │ FCR      │ 1.08     │ 1.12     │ -3.6% ✓  │         │
│  │ Mortality│ 1.2%     │ 1.5%     │ -20% ✓   │         │
│  │ Days     │ 147      │ 147      │ On track │         │
│  └──────────┴──────────┴──────────┴──────────┘         │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Overlay multiple batches on same charts
- Toggle individual batches on/off
- Highlight deviations from expected performance
- Predictive projection: "At current growth rate, harvest-ready in 23 days"

---

### 3. **Incident Investigation Mode** (NEW)

**Trigger:** Click on any mortality spike or anomaly

**What Happens:**
```
┌─────────────────────────────────────────────────────────┐
│  🔍 Investigating Mortality Spike: Day 156              │
│  📅 Date: March 15, 2024  |  Tank: FW-03                │
├─────────────────────────────────────────────────────────┤
│  ⚠️ Mortality: 3,200 fish (vs avg 800/day)             │
│                                                          │
│  Potential Contributing Factors:                         │
│  ┌────────────────────────────────────────────────┐    │
│  │ 🔴 HIGH CORRELATION                             │    │
│  │ • O2 dropped to 6.8 mg/L (18 hrs before)       │    │
│  │   Normal range: 8.0-8.5 mg/L                   │    │
│  │   Duration: 6 hours                             │    │
│  │   [View O2 chart] [Check equipment logs]       │    │
│  └────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────┐    │
│  │ 🟡 MEDIUM CORRELATION                           │    │
│  │ • Temperature increased 1.5°C (24 hrs before)  │    │
│  │   From: 11.8°C → 13.3°C                        │    │
│  │   [View temp chart] [Check heater logs]        │    │
│  └────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────┐    │
│  │ 🟢 LOW CORRELATION                              │    │
│  │ • Feed amount normal (no change)               │    │
│  │ • NO2/NO3 levels within range                  │    │
│  │ • No equipment maintenance logged              │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Similar Historical Incidents:                          │
│  • Day 89, Batch 2023-B1: O2 failure, 2,800 mort       │
│  • Day 203, Batch 2022-B4: O2 + temp, 3,500 mort       │
│  [View similar incidents]                               │
│                                                          │
│  Actions Taken:                                         │
│  [+ Add Note] [Mark as Resolved] [Create Alert Rule]   │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- AI-powered correlation analysis
- Ranked list of potential causes
- Links to equipment logs and maintenance records
- Historical pattern matching
- Action tracking and resolution workflow

---

### 4. **Tank-Level Drill-Down** (NEW)

**Purpose:** Zoom from batch-level overview to individual tank analysis.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Tank FW-03 | Batch 2024-B3 | Parr Stage | Day 147     │
├─────────────────────────────────────────────────────────┤
│  Live Status:                                            │
│  ┌──────┬──────┬──────┬──────┬──────┬──────┐           │
│  │ O2   │ CO2  │ NO2  │ NO3  │ Temp │ pH   │           │
│  │ 8.2  │ 12.1 │ 0.18 │ 45.2 │ 12.3 │ 7.1  │           │
│  │ mg/L │ mg/L │ mg/L │ mg/L │ °C   │      │           │
│  └──────┴──────┴──────┴──────┴──────┴──────┘           │
│                                                          │
│  Fish Metrics:                                           │
│  • Population: 18,450 (started: 20,000)                 │
│  • Avg Weight: 112g (target: 110g) ✓                    │
│  • Biomass: 2,066 kg (capacity: 2,500 kg)               │
│  • Density: 18.5 kg/m³ (optimal: 15-20)                 │
│                                                          │
│  Today's Activity:                                       │
│  • Feed: 31.2 kg (3 feedings)                           │
│  • Mortality: 12 fish (0.065% - normal)                 │
│  • Water exchange: 2,340 L/hr                           │
│                                                          │
│  [View 24hr Timeline] [Compare to Other Tanks]          │
│  [Schedule Sampling] [Transfer Planning]                │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Real-time sensor data (updated every 5 minutes)
- Tank-specific historical trends
- Comparison with other tanks in same batch
- Quick actions (sampling, transfers, maintenance)

---

### 5. **Mobile Companion Interface** (NEW)

**Purpose:** Tank-side data capture and monitoring on tablet/phone.

**Key Screens:**

#### A. **Tank Rounds Checklist**
```
┌─────────────────────────┐
│ 🏊 Tank Rounds          │
│ Klaksvík FW Station     │
├─────────────────────────┤
│ Tank FW-01    [✓]       │
│ • Visual: Normal        │
│ • Mortality: 8 counted  │
│ • Feed response: Good   │
│ • Notes: None           │
│                         │
│ Tank FW-02    [✓]       │
│ • Visual: Normal        │
│ • Mortality: 5 counted  │
│ • Feed response: Good   │
│ • Notes: None           │
│                         │
│ Tank FW-03    [!]       │
│ • Visual: Lethargic     │
│ • Mortality: 45 counted │
│ • Feed response: Poor   │
│ • Notes: [Add note...]  │
│ [📷 Take Photo]         │
│ [🔔 Create Alert]       │
│                         │
│ Progress: 3/18 tanks    │
│ [Continue Rounds]       │
└─────────────────────────┘
```

#### B. **Quick Data Entry**
```
┌─────────────────────────┐
│ Tank FW-03              │
│ Quick Entry             │
├─────────────────────────┤
│ Mortality Count:        │
│ [  45  ] fish           │
│                         │
│ Visual Assessment:      │
│ ○ Normal                │
│ ○ Lethargic             │
│ ● Stressed              │
│ ○ Disease signs         │
│                         │
│ Feed Response:          │
│ ○ Excellent             │
│ ● Poor                  │
│ ○ None                  │
│                         │
│ Notes:                  │
│ ┌─────────────────────┐ │
│ │ Fish not feeding    │ │
│ │ well, checking O2   │ │
│ └─────────────────────┘ │
│                         │
│ [📷 Photo] [🎤 Voice]   │
│ [Save & Next Tank]      │
└─────────────────────────┘
```

#### C. **Live Sensor Dashboard**
```
┌─────────────────────────┐
│ 📊 Live Sensors         │
│ All Tanks               │
├─────────────────────────┤
│ FW-01  FW-02  FW-03     │
│ ┌───┐  ┌───┐  ┌───┐    │
│ │8.2│  │8.1│  │6.8│⚠️  │
│ └───┘  └───┘  └───┘    │
│  O2 (mg/L)              │
│                         │
│ ┌───┐  ┌───┐  ┌───┐    │
│ │12.│  │12.│  │13.│⚠️  │
│ └───┘  └───┘  └───┘    │
│  Temp (°C)              │
│                         │
│ ⚠️ 2 Alerts Active      │
│ • FW-03: Low O2         │
│ • FW-03: High temp      │
│                         │
│ [View Details]          │
│ [Acknowledge Alerts]    │
└─────────────────────────┘
```

---

### 6. **Predictive Analytics Dashboard** (NEW)

**Purpose:** Proactive alerts before problems occur.

```
┌─────────────────────────────────────────────────────────┐
│  🔮 Predictive Insights                                  │
├─────────────────────────────────────────────────────────┤
│  ⚠️ ATTENTION NEEDED (Next 48 Hours)                    │
│  ┌────────────────────────────────────────────────┐    │
│  │ Tank FW-05: Mortality Risk Increasing           │    │
│  │ Current: 0.8%/day → Predicted: 1.5%/day        │    │
│  │ Confidence: 78%                                 │    │
│  │ Factors: O2 trending down, feed response ↓     │    │
│  │ [View Details] [Create Action Plan]            │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ✅ PERFORMING WELL                                     │
│  ┌────────────────────────────────────────────────┐    │
│  │ Tank FW-01, FW-02: On track for transfer       │    │
│  │ Predicted smolt-ready: 18 days                 │    │
│  │ Expected avg weight: 115g (target: 110g)       │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  📊 OPTIMIZATION OPPORTUNITIES                          │
│  ┌────────────────────────────────────────────────┐    │
│  │ Feed efficiency could improve 8%                │    │
│  │ Recommendation: Reduce feeding 5% in FW-07     │    │
│  │ Potential savings: 120 kg feed over 30 days    │    │
│  │ [Apply Recommendation] [Dismiss]               │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

### 7. **Transfer Planning Interface** (NEW)

**Purpose:** Coordinate smolt transfers to sea pens.

```
┌─────────────────────────────────────────────────────────┐
│  🚚 Transfer Planning                                    │
├─────────────────────────────────────────────────────────┤
│  Upcoming Transfers (Next 30 Days):                      │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │ Batch 2024-B1 → Loch Eriboll Sea Pens          │    │
│  │ Scheduled: March 28, 2024 (14 days)            │    │
│  │ Fish count: 18,200 smolts                       │    │
│  │ Avg weight: 118g (target: 110g+) ✓             │    │
│  │ Health score: 92 ✓                              │    │
│  │ Readiness: 95% ✓                                │    │
│  │                                                  │    │
│  │ Checklist:                                       │    │
│  │ [✓] Weight sampling completed                   │    │
│  │ [✓] Health assessment passed                    │    │
│  │ [✓] Transport vessel booked                     │    │
│  │ [ ] Final count (due: March 26)                 │    │
│  │ [ ] Veterinary clearance (due: March 27)        │    │
│  │                                                  │    │
│  │ [View Full Plan] [Coordinate with Sea Pen]     │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## Interaction Patterns

### 1. **Hover Interactions**
- **Charts**: Hover over any point to see exact values + context
- **Facility markers**: Show quick stats without clicking
- **Alerts**: Expand to show full details

### 2. **Click Interactions**
- **Timeline**: Jump to specific day
- **Mortality spike**: Open investigation mode
- **Tank card**: Drill down to tank details
- **Alert**: Open action workflow

### 3. **Keyboard Shortcuts**
- `←/→`: Navigate day-by-day
- `Space`: Play/pause timeline animation
- `Z`: Zoom to selection
- `R`: Reset view
- `I`: Open investigation mode
- `/`: Search annotations

### 4. **Touch Gestures** (Mobile/Tablet)
- **Pinch**: Zoom timeline
- **Swipe left/right**: Navigate between tanks
- **Long press**: Add annotation
- **Pull down**: Refresh data

---

## Data Visualization Principles

### 1. **Color Coding (Solarized Palette)**
- **Green (#859900)**: Healthy, normal, good performance
- **Yellow (#b58900)**: Attention needed, deviation from normal
- **Red (#dc322f)**: Critical, immediate action required
- **Blue (#268bd2)**: Informational, neutral metrics
- **Cyan (#2aa198)**: Growth, positive trends

### 2. **Typography Hierarchy**
- **Large bold numbers**: Key metrics (mortality count, health score)
- **Medium text**: Labels and descriptions
- **Small text**: Metadata (timestamps, units)
- **Monospace**: Precise measurements (8.23 mg/L)

### 3. **Chart Design**
- **Shared X-axis**: All panels aligned to same timeline
- **Consistent Y-axis ranges**: Easy visual comparison across batches
- **Lifecycle stage markers**: Vertical lines with labels
- **Trend lines**: Smooth curves for patterns, bars for discrete events

---

## Technical Requirements

### 1. **Performance**
- Load 500 days of data in <2 seconds
- Smooth 60fps scrolling and zooming
- Real-time sensor updates (5-minute intervals)
- Offline capability for mobile app

### 2. **Data Storage**
- Historical data: 2+ years retention
- High-resolution sensor data: 5-minute granularity
- Annotations and notes: Unlimited
- Photos: Compressed, cloud-stored

### 3. **Integration**
- IoT sensor feeds (O2, temp, pH, etc.)
- Automated feeder logs
- Equipment maintenance systems
- Veterinary health records
- Transfer coordination with sea pen managers

### 4. **Security & RBAC**
- Station boss sees only their facility data
- Read-only access to historical data
- Write access for annotations and action plans
- Audit trail for all data modifications

---

## Success Metrics

### Quantitative
- **Time to root cause**: <5 minutes (from 30+ minutes)
- **Early detection rate**: 80% of issues caught before mortality impact
- **Data entry time**: <2 minutes per tank round (from 10+ minutes)
- **Decision confidence**: 90% of decisions backed by data

### Qualitative
- Station bosses report feeling "in control" vs. "reactive"
- Reduced stress from unexpected mortality events
- Increased confidence in transfer timing decisions
- Better communication with sea pen managers (data-backed handoffs)

---

## Implementation Roadmap

### Phase 1: Foundation (Months 1-2) ✅ COMPLETE
- [x] 8-panel multi-layered time series
- [x] 500-day historical data
- [x] Lifecycle stage markers
- [x] Basic tooltips and interactions

### Phase 2: Analysis Tools (Months 3-4)
- [ ] Timeline scrubber and zoom controls
- [ ] Annotation layer
- [ ] Incident investigation mode
- [ ] Correlation indicators

### Phase 3: Comparative & Predictive (Months 5-6)
- [ ] Batch comparison view
- [ ] Historical baseline overlays
- [ ] Predictive analytics dashboard
- [ ] Optimization recommendations

### Phase 4: Mobile & Collaboration (Months 7-8)
- [ ] Mobile companion app
- [ ] Tank rounds checklist
- [ ] Quick data entry forms
- [ ] Transfer planning interface

### Phase 5: AI & Automation (Months 9-12)
- [ ] AI-powered root cause analysis
- [ ] Automated alert rules
- [ ] Pattern recognition across facilities
- [ ] Continuous learning from outcomes

---

## Conclusion

This UI/UX vision transforms the Freshwater Station Boss interface from a simple monitoring dashboard into a **comprehensive forensic analysis and decision support system**. By overlaying multiple data streams on a shared timeline, enabling temporal navigation, and providing AI-powered insights, we empower station managers to:

1. **Understand the past**: Quickly identify root causes of mortality and performance issues
2. **Optimize the present**: Make data-driven decisions about feeding, transfers, and interventions
3. **Predict the future**: Catch problems before they escalate and plan with confidence

The result is a more confident, proactive, and effective station management team that delivers consistently high-quality smolts to sea pen operations.

