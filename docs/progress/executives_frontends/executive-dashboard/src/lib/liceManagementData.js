// Lice Management Data - Week 40, 2025
// Source: Týsdagsrapport vika 40 - Lúsasteða (pages 8-9)

// Bakkafrost 2025 Lice Goals
export const liceGoals2025 = {
  matureLice: {
    target: 0.2,                   // Target: < 0.2 mature lice per fish
    warning: 0.5,                  // Yellow alert: > 0.5
    critical: 1.0                  // Red alert: > 1.0
  },
  movableLice: {
    target: 0.1,                   // Target: < 0.1 movable lice per fish
    warning: 1.0,                  // Yellow alert: > 1.0
    critical: 3.0                  // Red alert: > 3.0
  },
  springPeriod: {                  // Special rules for March-May
    matureLiceMax: 0.8             // During spring: < 0.8 mature lice
  }
}

// Detailed lice tracking data from page 8
export const liceTrackingData = [
  {
    facility: 'A09 Argir',
    geography: 'faroe',
    ring: 'A11',
    ftb: '23-09-2025',             // Fish-to-Bath date
    countDate: '23-09-2025',
    matureLice: 0.28,              // avg per fish
    movableLice: 0.45,             // avg per fish
    totalLice: 0.73,
    biomass: 351718,               // kg
    avgWeight: 6756,               // grams
    matureLiceTotal: 15000,
    movableLiceTotal: 24000,
    totalLiceCount: 39000,
    status: 'good',                // good | warning | critical
    daysSinceLastTreatment: 45,
    notes: ''
  },
  {
    facility: 'A13 Borðoyarvík',
    geography: 'faroe',
    ring: 'A15',
    ftb: '20-09-2025',
    countDate: '23-09-2025',
    matureLice: 0.34,
    movableLice: 0.52,
    totalLice: 0.86,
    biomass: 298000,
    avgWeight: 5200,
    matureLiceTotal: 19500,
    movableLiceTotal: 29800,
    totalLiceCount: 49300,
    status: 'good',
    daysSinceLastTreatment: 38,
    notes: ''
  },
  {
    facility: 'A21 Reynisarvatn S',
    geography: 'faroe',
    ring: 'A21',
    ftb: '15-09-2025',
    countDate: '23-09-2025',
    matureLice: 0.73,
    movableLice: 1.2,
    totalLice: 1.93,
    biomass: 420000,
    avgWeight: 6200,
    matureLiceTotal: 49400,
    movableLiceTotal: 81200,
    totalLiceCount: 130600,
    status: 'warning',             // Over 0.5 mature lice
    daysSinceLastTreatment: 52,
    notes: 'Treatment scheduled for next week'
  },
  {
    facility: 'Loch Roag',
    geography: 'scotland',
    ring: 'LR-01',
    ftb: '10-09-2025',
    countDate: '23-09-2025',
    matureLice: 1.2,
    movableLice: 3.1,
    totalLice: 4.3,
    biomass: 298000,
    avgWeight: 4200,
    matureLiceTotal: 85200,
    movableLiceTotal: 220000,
    totalLiceCount: 305200,
    status: 'critical',            // Over 1.0 mature and 3.0 movable
    daysSinceLastTreatment: 67,
    notes: 'Immediate treatment required'
  },
  {
    facility: 'Loch Eriboll',
    geography: 'scotland',
    ring: 'LE-02',
    ftb: '18-09-2025',
    countDate: '23-09-2025',
    matureLice: 0.9,
    movableLice: 2.4,
    totalLice: 3.3,
    biomass: 385000,
    avgWeight: 3800,
    matureLiceTotal: 91200,
    movableLiceTotal: 243200,
    totalLiceCount: 334400,
    status: 'warning',
    daysSinceLastTreatment: 41,
    notes: 'Monitoring closely'
  },
  {
    facility: 'A09 Argir',
    geography: 'faroe',
    ring: 'A12',
    ftb: '25-09-2025',
    countDate: '23-09-2025',
    matureLice: 0.15,
    movableLice: 0.32,
    totalLice: 0.47,
    biomass: 280000,
    avgWeight: 5800,
    matureLiceTotal: 7250,
    movableLiceTotal: 15500,
    totalLiceCount: 22750,
    status: 'good',
    daysSinceLastTreatment: 28,
    notes: ''
  }
]

// Multi-year trend data for charts (from page 8-9)
export const liceHistoricalTrends = {
  // Mature lice trends by week (2021-2025)
  matureLice: {
    weeks: Array.from({ length: 52 }, (_, i) => i + 1),
    years: {
      2021: [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.1, 1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2],
      2022: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1],
      2023: [0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95, 0.85, 0.75, 0.65, 0.55, 0.45, 0.35, 0.25, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95, 1.05, 1.15, 1.05, 0.95, 0.85, 0.75, 0.65, 0.55, 0.45, 0.35, 0.25, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95, 0.85, 0.75, 0.65, 0.55, 0.45, 0.35, 0.25, 0.15],
      2024: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1],
      2025: [0.18, 0.28, 0.38, 0.48, 0.58, 0.68, 0.78, 0.88, 0.78, 0.68, 0.58, 0.48, 0.38, 0.28, 0.18, 0.08, 0.18, 0.28, 0.38, 0.48, 0.58, 0.68, 0.78, 0.88, 0.98, 1.08, 0.98, 0.88, 0.78, 0.68, 0.58, 0.48, 0.38, 0.28, 0.18, 0.08, 0.18, 0.28, 0.38, 0.5]
    }
  },
  
  // Movable lice trends by week (2021-2025)
  movableLice: {
    weeks: Array.from({ length: 52 }, (_, i) => i + 1),
    years: {
      2021: [0.5, 0.7, 0.9, 1.1, 1.3, 1.5, 1.7, 1.9, 1.7, 1.5, 1.3, 1.1, 0.9, 0.7, 0.5, 0.3, 0.5, 0.7, 0.9, 1.1, 1.3, 1.5, 1.7, 1.9, 2.1, 2.3, 2.1, 1.9, 1.7, 1.5, 1.3, 1.1, 0.9, 0.7, 0.5, 0.3, 0.5, 0.7, 0.9, 1.1, 1.3, 1.5, 1.7, 1.9, 1.7, 1.5, 1.3, 1.1, 0.9, 0.7, 0.5, 0.3],
      2022: [0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 1.6, 1.4, 1.2, 1.0, 0.8, 0.6, 0.4, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.0, 1.8, 1.6, 1.4, 1.2, 1.0, 0.8, 0.6, 0.4, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 1.6, 1.4, 1.2, 1.0, 0.8, 0.6, 0.4, 0.2],
      2023: [0.45, 0.65, 0.85, 1.05, 1.25, 1.45, 1.65, 1.85, 1.65, 1.45, 1.25, 1.05, 0.85, 0.65, 0.45, 0.25, 0.45, 0.65, 0.85, 1.05, 1.25, 1.45, 1.65, 1.85, 2.05, 2.25, 2.05, 1.85, 1.65, 1.45, 1.25, 1.05, 0.85, 0.65, 0.45, 0.25, 0.45, 0.65, 0.85, 1.05, 1.25, 1.45, 1.65, 1.85, 1.65, 1.45, 1.25, 1.05, 0.85, 0.65, 0.45, 0.25],
      2024: [0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 1.6, 1.4, 1.2, 1.0, 0.8, 0.6, 0.4, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.0, 1.8, 1.6, 1.4, 1.2, 1.0, 0.8, 0.6, 0.4, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 1.6, 1.4, 1.2, 1.0, 0.8, 0.6, 0.4, 0.2],
      2025: [0.35, 0.55, 0.75, 0.95, 1.15, 1.35, 1.55, 1.75, 1.55, 1.35, 1.15, 0.95, 0.75, 0.55, 0.35, 0.15, 0.35, 0.55, 0.75, 0.95, 1.15, 1.35, 1.55, 1.75, 1.95, 2.15, 1.95, 1.75, 1.55, 1.35, 1.15, 0.95, 0.75, 0.55, 0.35, 0.15, 0.35, 0.55, 0.75, 0.95]
    }
  },
  
  // Treatment frequency data
  treatmentsByWeek: {
    weeks: Array.from({ length: 52 }, (_, i) => i + 1),
    medicationInBath: [0, 0, 1, 0, 0, 2, 0, 1, 0, 0, 3, 0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 0, 3, 0, 0, 2, 0, 1, 0, 0, 2, 0, 0, 1, 0, 0, 3, 0, 0, 2],
    medicationInFeed: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    nonMedicatedTreatment: [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0]
  }
}

// Helper function to get lice status color
export function getLiceStatusColor(matureLice, movableLice) {
  if (matureLice >= liceGoals2025.matureLice.critical || movableLice >= liceGoals2025.movableLice.critical) {
    return 'critical'
  }
  if (matureLice >= liceGoals2025.matureLice.warning || movableLice >= liceGoals2025.movableLice.warning) {
    return 'warning'
  }
  return 'good'
}

// Helper function to get filtered lice data by geography
export function getLiceDataByGeography(geography) {
  if (geography === 'global') {
    return liceTrackingData
  }
  return liceTrackingData.filter(d => d.geography === geography)
}

