// Facility Comparison Data
// Source: Aggregated from Týsdagsrapport vika 40

import { weeklyReportData } from './operationsWeeklyData'
import { liceTrackingData } from './liceManagementData'

// Comprehensive facility performance metrics
export const facilityPerformanceMetrics = weeklyReportData.facilitySummaries.map(facility => {
  // Find lice data for this facility
  const liceData = liceTrackingData.filter(l => l.facility === facility.name)
  const avgMatureLice = liceData.length > 0 
    ? liceData.reduce((sum, l) => sum + l.matureLice, 0) / liceData.length 
    : facility.lice.mature
  const avgMovableLice = liceData.length > 0
    ? liceData.reduce((sum, l) => sum + l.movableLice, 0) / liceData.length
    : facility.lice.movable

  return {
    ...facility,
    matureLiceAvg: avgMatureLice,
    movableLiceAvg: avgMovableLice,
    biomassGrowth: facility.biomass > 0 ? Math.random() * 10 + 5 : 0, // Simulated monthly growth
    feedEfficiency: facility.fcr > 0 ? 100 - (facility.fcr - 1) * 50 : 0,
    welfareScore: facility.biomass > 0 ? 4.5 - facility.mortality * 0.5 - avgMatureLice * 0.3 : 0,
    overcrowdedRings: 0
  }
})

// Performance rankings
export const performanceRankings = {
  byTGC: facilityPerformanceMetrics
    .filter(f => f.tgc > 0)
    .sort((a, b) => b.tgc - a.tgc)
    .map((f, index) => ({
      facility: f.name,
      geography: f.geography,
      value: f.tgc,
      rank: index + 1
    })),
    
  byFCR: facilityPerformanceMetrics
    .filter(f => f.fcr > 0)
    .sort((a, b) => a.fcr - b.fcr) // Lower is better
    .map((f, index) => ({
      facility: f.name,
      geography: f.geography,
      value: f.fcr,
      rank: index + 1
    })),
    
  byMortality: facilityPerformanceMetrics
    .filter(f => f.mortality > 0)
    .sort((a, b) => a.mortality - b.mortality) // Lower is better
    .map((f, index) => ({
      facility: f.name,
      geography: f.geography,
      value: f.mortality,
      rank: index + 1
    })),
    
  byLice: facilityPerformanceMetrics
    .filter(f => f.matureLiceAvg > 0)
    .sort((a, b) => a.matureLiceAvg - b.matureLiceAvg) // Lower is better
    .map((f, index) => ({
      facility: f.name,
      geography: f.geography,
      value: f.matureLiceAvg,
      rank: index + 1
    })),
    
  byBiomass: facilityPerformanceMetrics
    .filter(f => f.biomass > 0)
    .sort((a, b) => b.biomass - a.biomass)
    .map((f, index) => ({
      facility: f.name,
      geography: f.geography,
      value: f.biomass,
      rank: index + 1
    }))
}

// Helper function to get facility rank for a specific metric
export function getFacilityRank(facilityName, metric) {
  const rankings = performanceRankings[`by${metric}`]
  if (!rankings) return null
  
  const entry = rankings.find(r => r.facility === facilityName)
  return entry ? entry.rank : null
}

// Helper function to get performance tier (top/middle/bottom)
export function getPerformanceTier(rank, totalFacilities) {
  const percentile = rank / totalFacilities
  if (percentile <= 0.33) return 'top'
  if (percentile <= 0.67) return 'middle'
  return 'bottom'
}

// Helper function to get filtered facilities by geography
export function getFacilitiesByGeography(geography) {
  if (geography === 'global') {
    return facilityPerformanceMetrics
  }
  return facilityPerformanceMetrics.filter(f => f.geography === geography)
}

// Helper function to compare two facilities
export function compareFacilities(facility1Name, facility2Name) {
  const f1 = facilityPerformanceMetrics.find(f => f.name === facility1Name)
  const f2 = facilityPerformanceMetrics.find(f => f.name === facility2Name)
  
  if (!f1 || !f2) return null
  
  return {
    facility1: f1,
    facility2: f2,
    comparison: {
      biomass: {
        f1: f1.biomass,
        f2: f2.biomass,
        diff: f1.biomass - f2.biomass,
        winner: f1.biomass > f2.biomass ? f1.name : f2.name
      },
      tgc: {
        f1: f1.tgc,
        f2: f2.tgc,
        diff: f1.tgc - f2.tgc,
        winner: f1.tgc > f2.tgc ? f1.name : f2.name
      },
      fcr: {
        f1: f1.fcr,
        f2: f2.fcr,
        diff: f1.fcr - f2.fcr,
        winner: f1.fcr < f2.fcr ? f1.name : f2.name // Lower is better
      },
      mortality: {
        f1: f1.mortality,
        f2: f2.mortality,
        diff: f1.mortality - f2.mortality,
        winner: f1.mortality < f2.mortality ? f1.name : f2.name // Lower is better
      },
      lice: {
        f1: f1.matureLiceAvg,
        f2: f2.matureLiceAvg,
        diff: f1.matureLiceAvg - f2.matureLiceAvg,
        winner: f1.matureLiceAvg < f2.matureLiceAvg ? f1.name : f2.name // Lower is better
      }
    }
  }
}

// Helper function to get geography summary
export function getGeographySummary(geography) {
  const facilities = getFacilitiesByGeography(geography)
  const activeFacilities = facilities.filter(f => f.biomass > 0)
  
  if (activeFacilities.length === 0) {
    return {
      totalFacilities: facilities.length,
      activeFacilities: 0,
      totalBiomass: 0,
      avgTGC: 0,
      avgFCR: 0,
      avgMortality: 0,
      avgLice: 0
    }
  }
  
  return {
    totalFacilities: facilities.length,
    activeFacilities: activeFacilities.length,
    totalBiomass: activeFacilities.reduce((sum, f) => sum + f.biomass, 0),
    avgTGC: activeFacilities.reduce((sum, f) => sum + f.tgc, 0) / activeFacilities.length,
    avgFCR: activeFacilities.reduce((sum, f) => sum + f.fcr, 0) / activeFacilities.length,
    avgMortality: activeFacilities.reduce((sum, f) => sum + f.mortality, 0) / activeFacilities.length,
    avgLice: activeFacilities.reduce((sum, f) => sum + f.matureLiceAvg, 0) / activeFacilities.length
  }
}

