// Weekly Report Data - Week 40, 2025 (29/09 - 05/10/25)
// Source: Týsdagsrapport vika 40 - Biologiska gongdin - sjógvaling

export const weeklyReportData = {
  weekNumber: 40,
  year: 2025,
  weekDates: '29/09 - 05/10/25',
  
  summary: {
    // Biomass metrics
    totalBiomass: 57586,           // tons
    avgWeight: 2.896,              // kg
    biomassOver6_2kg: 6714,        // tons
    
    // Feed metrics
    feedThisWeek: 3200,            // tons
    feedEfficiency: 96.7,          // percentage
    
    // Growth metrics
    tgc: 2.95,
    sgr: 0.76,                     // percentage
    
    // Mortality metrics
    mortalityCount: 30972,         // fish
    mortalityBiomass: 106,         // tons
    mortalityAvgWeight: 3.190,     // kg
    mortalityBySize: {
      '3500_4000g': 7164,          // largest mortality size class
      '2500_3000g': 4434           // second largest
    },
    
    // Freshwater releases
    releasedFromFreshwater: {
      count: 623141,               // fish
      avgWeight: 782               // grams
    },
    
    // Lice metrics
    lice: {
      matureCount: 8390000,        // total mature lice (8.39m)
      movableCount: 17630000,      // total movable lice (17.63m)
      ringsWithHighLice: 65        // rings with concerning lice levels
    },
    
    // Facility metrics
    overcrowdedRings: 0,           // eingin (none)
    totalRings: 175
  },

  // Facility-level summaries (from page 5 - Dygd section)
  facilitySummaries: [
    {
      id: 1,
      name: 'A04 Lambavík',
      geography: 'faroe',
      biomass: 0,
      avgWeight: 0,
      mortality: 0,
      lice: { mature: 0, movable: 0 },
      tgc: 0,
      fcr: 0,
      rings: 0
    },
    {
      id: 2,
      name: 'A06 Undir Síðu',
      geography: 'faroe',
      biomass: 0,
      avgWeight: 0,
      mortality: 0,
      lice: { mature: 0, movable: 0 },
      tgc: 0,
      fcr: 0,
      rings: 0
    },
    {
      id: 3,
      name: 'A09 Argir',
      geography: 'faroe',
      biomass: 20048,
      avgWeight: 7.581,
      mortality: 2.1,
      lice: { mature: 0.28, movable: 0.45 },
      tgc: 3.1,
      fcr: 1.15,
      rings: 4
    },
    {
      id: 4,
      name: 'A11 Glyvursnes',
      geography: 'faroe',
      biomass: 0,
      avgWeight: 0,
      mortality: 0,
      lice: { mature: 0, movable: 0 },
      tgc: 0,
      fcr: 0,
      rings: 0
    },
    {
      id: 5,
      name: 'A12 Kunoyarnes',
      geography: 'faroe',
      biomass: 0,
      avgWeight: 0,
      mortality: 0,
      lice: { mature: 0, movable: 0 },
      tgc: 0,
      fcr: 0,
      rings: 0
    },
    {
      id: 6,
      name: 'A13 Borðoyarvík',
      geography: 'faroe',
      biomass: 108097,
      avgWeight: 6.616,
      mortality: 1.8,
      lice: { mature: 0.34, movable: 0.52 },
      tgc: 2.9,
      fcr: 1.18,
      rings: 8
    },
    {
      id: 7,
      name: 'A18 Hov',
      geography: 'faroe',
      biomass: 0,
      avgWeight: 0,
      mortality: 0,
      lice: { mature: 0, movable: 0 },
      tgc: 0,
      fcr: 0,
      rings: 0
    },
    {
      id: 8,
      name: 'A19 Viðareiði',
      geography: 'faroe',
      biomass: 0,
      avgWeight: 0,
      mortality: 0,
      lice: { mature: 0, movable: 0 },
      tgc: 0,
      fcr: 0,
      rings: 0
    },
    {
      id: 9,
      name: 'A21 Reynisarvatn S',
      geography: 'faroe',
      biomass: 351718,
      avgWeight: 6.756,
      mortality: 2.3,
      lice: { mature: 0.28, movable: 0.73 },
      tgc: 3.0,
      fcr: 1.16,
      rings: 12
    },
    {
      id: 10,
      name: 'A25 Glyvursnes',
      geography: 'faroe',
      biomass: 0,
      avgWeight: 0,
      mortality: 0,
      lice: { mature: 0, movable: 0 },
      tgc: 0,
      fcr: 0,
      rings: 0
    },
    {
      id: 11,
      name: 'Loch Roag',
      geography: 'scotland',
      biomass: 15200,
      avgWeight: 4.2,
      mortality: 2.8,
      lice: { mature: 1.2, movable: 3.1 },
      tgc: 2.7,
      fcr: 1.22,
      rings: 8
    },
    {
      id: 12,
      name: 'Loch Eriboll',
      geography: 'scotland',
      biomass: 18500,
      avgWeight: 3.8,
      mortality: 3.2,
      lice: { mature: 0.9, movable: 2.4 },
      tgc: 2.8,
      fcr: 1.19,
      rings: 10
    }
  ],

  // Week-over-week changes (for trend indicators)
  changes: {
    biomass: 2.3,                  // percentage increase
    mortality: -0.5,               // percentage decrease
    lice: 8.2,                     // percentage increase
    feed: 1.2,                     // percentage increase
    tgc: 0.05,                     // absolute increase
    sgr: -0.02                     // absolute decrease
  }
}

// Helper function to get filtered facilities
export function getFacilitiesByGeography(geography) {
  if (geography === 'global') {
    return weeklyReportData.facilitySummaries
  }
  return weeklyReportData.facilitySummaries.filter(f => f.geography === geography)
}

// Helper function to calculate totals for a geography
export function getGeographyTotals(geography) {
  const facilities = getFacilitiesByGeography(geography)
  
  return {
    totalBiomass: facilities.reduce((sum, f) => sum + f.biomass, 0),
    totalRings: facilities.reduce((sum, f) => sum + f.rings, 0),
    avgTGC: facilities.filter(f => f.tgc > 0).reduce((sum, f) => sum + f.tgc, 0) / facilities.filter(f => f.tgc > 0).length || 0,
    avgFCR: facilities.filter(f => f.fcr > 0).reduce((sum, f) => sum + f.fcr, 0) / facilities.filter(f => f.fcr > 0).length || 0,
    avgMortality: facilities.filter(f => f.mortality > 0).reduce((sum, f) => sum + f.mortality, 0) / facilities.filter(f => f.mortality > 0).length || 0
  }
}

