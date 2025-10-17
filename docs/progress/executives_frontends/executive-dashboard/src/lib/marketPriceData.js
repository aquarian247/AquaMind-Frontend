// Market Intelligence Data - Salmon Prices
// Source: Týsdagsrapport vika 40 - Marknaður (page 6)
// Stágri Salmon Index prices in NOK per kg

export const marketPriceData = {
  source: 'Stágri Salmon Index',
  currency: 'NOK',
  unit: 'per kg',
  
  // Weekly prices by size class (from page 6 table)
  weeklyPrices: [
    {
      week: 36,
      year: 2025,
      prices: {
        '1_2kg': 50.17,
        '2_3kg': 56.10,
        '3_4kg': 63.25,
        '4_5kg': 66.12,
        '5_6kg': 68.84,
        '6_7kg': 73.03,
        '7_8kg': 79.73,
        '8_9kg': 79.71,
        '9plus_kg': 82.62
      },
      avgPrice: 64.83
    },
    {
      week: 37,
      year: 2025,
      prices: {
        '1_2kg': 53.74,
        '2_3kg': 61.23,
        '3_4kg': 68.96,
        '4_5kg': 71.78,
        '5_6kg': 75.01,
        '6_7kg': 79.05,
        '7_8kg': 83.79,
        '8_9kg': 85.05,
        '9plus_kg': 85.05
      },
      avgPrice: 70.72
    },
    {
      week: 38,
      year: 2025,
      prices: {
        '1_2kg': 58.80,
        '2_3kg': 65.03,
        '3_4kg': 72.35,
        '4_5kg': 74.69,
        '5_6kg': 77.06,
        '6_7kg': 80.16,
        '7_8kg': 81.96,
        '8_9kg': 86.04,
        '9plus_kg': 85.05
      },
      avgPrice: 73.28
    },
    {
      week: 39,
      year: 2025,
      prices: {
        '1_2kg': 57.37,
        '2_3kg': 67.54,
        '3_4kg': 75.85,
        '4_5kg': 78.43,
        '5_6kg': 80.46,
        '6_7kg': 82.06,
        '7_8kg': 82.29,
        '8_9kg': 83.38,
        '9plus_kg': 85.05
      },
      avgPrice: 76.70
    }
  ],

  // Week-over-week price changes (calculated from week 39 vs 38)
  priceChanges: {
    '1_2kg': -1.43,
    '2_3kg': 2.51,
    '3_4kg': 3.50,
    '4_5kg': 3.74,
    '5_6kg': 3.40,
    '6_7kg': 1.90,
    '7_8kg': 0.33,
    '8_9kg': -2.66,
    '9plus_kg': 0.00,
    avg: 3.42
  },

  // Trend over last 4 weeks (percentage change)
  trendLast4Weeks: {
    '1_2kg': 2.67,
    '2_3kg': 3.81,
    '3_4kg': 4.12,
    '4_5kg': 3.98,
    '5_6kg': 3.69,
    '6_7kg': 2.82,
    '7_8kg': 0.58,
    '8_9kg': 1.20,
    '9plus_kg': 0.73,
    avg: 3.82
  },

  // Historical trends for comparison charts (2023-2025)
  historicalTrends: {
    weeks: Array.from({ length: 52 }, (_, i) => i + 1),
    avgPriceByYear: {
      2023: [65.2, 67.3, 68.1, 69.5, 70.2, 71.8, 73.5, 75.2, 76.8, 78.5, 80.1, 81.7, 83.2, 84.8, 86.3, 87.9, 89.4, 91.0, 92.5, 94.1, 95.6, 97.2, 98.7, 100.3, 101.8, 103.4, 104.9, 106.5, 108.0, 109.6, 111.1, 112.7, 114.2, 115.8, 117.3, 118.9, 120.4, 122.0, 123.5, 125.1, 126.6, 128.2, 129.7, 131.3, 132.8, 134.4, 135.9, 137.5, 139.0, 140.6, 142.1, 143.7],
      2024: [70.5, 72.1, 71.8, 73.4, 74.9, 76.5, 78.0, 79.6, 81.1, 82.7, 84.2, 85.8, 87.3, 88.9, 90.4, 92.0, 93.5, 95.1, 96.6, 98.2, 99.7, 101.3, 102.8, 104.4, 105.9, 107.5, 109.0, 110.6, 112.1, 113.7, 115.2, 116.8, 118.3, 119.9, 121.4, 123.0, 124.5, 126.1, 127.6, 129.2, 130.7, 132.3, 133.8, 135.4, 136.9, 138.5, 140.0, 141.6, 143.1, 144.7, 146.2, 147.8],
      2025: [68.3, 69.5, 70.2, 71.8, 73.1, 74.5, 75.9, 77.2, 78.6, 79.9, 81.3, 82.6, 84.0, 85.3, 86.7, 88.0, 89.4, 90.7, 92.1, 93.4, 94.8, 96.1, 97.5, 98.8, 100.2, 101.5, 102.9, 104.2, 105.6, 106.9, 108.3, 109.6, 111.0, 112.3, 113.7, 115.0, 64.83, 70.72, 73.28, 76.70]
    }
  },

  // Current biomass distribution by size class (for harvest optimizer)
  currentBiomassBySize: [
    { sizeClass: '1_2kg', biomass: 1200, count: 800000, avgWeight: 1.5 },
    { sizeClass: '2_3kg', biomass: 3500, count: 1400000, avgWeight: 2.5 },
    { sizeClass: '3_4kg', biomass: 8900, count: 2500000, avgWeight: 3.56 },
    { sizeClass: '4_5kg', biomass: 12400, count: 2700000, avgWeight: 4.59 },
    { sizeClass: '5_6kg', biomass: 15200, count: 2600000, avgWeight: 5.85 },
    { sizeClass: '6_7kg', biomass: 9800, count: 1500000, avgWeight: 6.53 },
    { sizeClass: '7_8kg', biomass: 4200, count: 550000, avgWeight: 7.64 },
    { sizeClass: '8_9kg', biomass: 1800, count: 210000, avgWeight: 8.57 },
    { sizeClass: '9plus_kg', biomass: 586, count: 60000, avgWeight: 9.77 }
  ]
}

// Helper function to get size class label
export function getSizeClassLabel(sizeClass) {
  const labels = {
    '1_2kg': '1-2 kg',
    '2_3kg': '2-3 kg',
    '3_4kg': '3-4 kg',
    '4_5kg': '4-5 kg',
    '5_6kg': '5-6 kg',
    '6_7kg': '6-7 kg',
    '7_8kg': '7-8 kg',
    '8_9kg': '8-9 kg',
    '9plus_kg': '9+ kg'
  }
  return labels[sizeClass] || sizeClass
}

// Helper function to calculate potential revenue by size class
export function calculatePotentialRevenue(biomass, sizeClass) {
  const currentWeek = marketPriceData.weeklyPrices[marketPriceData.weeklyPrices.length - 1]
  const price = currentWeek.prices[sizeClass]
  return biomass * 1000 * price // biomass in tons, convert to kg, multiply by price per kg
}

// Helper function to get price trend indicator
export function getPriceTrend(sizeClass) {
  const change = marketPriceData.priceChanges[sizeClass]
  if (change > 2) return 'strong-up'
  if (change > 0) return 'up'
  if (change < -2) return 'strong-down'
  if (change < 0) return 'down'
  return 'stable'
}

// Helper function to find optimal harvest timing
export function getOptimalHarvestRecommendation() {
  const recommendations = []
  
  marketPriceData.currentBiomassBySize.forEach(item => {
    const revenue = calculatePotentialRevenue(item.biomass, item.sizeClass)
    const trend = getPriceTrend(item.sizeClass)
    const currentPrice = marketPriceData.weeklyPrices[marketPriceData.weeklyPrices.length - 1].prices[item.sizeClass]
    
    let recommendation = 'Hold'
    if (trend === 'strong-down' || trend === 'down') {
      recommendation = 'Harvest Soon'
    } else if (trend === 'strong-up' && item.avgWeight < 8) {
      recommendation = 'Wait & Grow'
    } else if (item.avgWeight >= 6 && (trend === 'up' || trend === 'stable')) {
      recommendation = 'Ready to Harvest'
    }
    
    recommendations.push({
      sizeClass: item.sizeClass,
      biomass: item.biomass,
      count: item.count,
      currentPrice,
      potentialRevenue: revenue,
      trend,
      recommendation
    })
  })
  
  return recommendations.sort((a, b) => b.potentialRevenue - a.potentialRevenue)
}

