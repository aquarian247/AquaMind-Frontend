import { useState } from 'react'
import { useRBAC } from '../lib/RBACContext'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { 
  Moon, Sun, Globe2, FileText, Bug, TrendingUp, BarChart3,
  ArrowUp, ArrowDown, Download
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

import { weeklyReportData, getFacilitiesByGeography, getGeographyTotals } from '../lib/operationsWeeklyData'
import { liceTrackingData, liceHistoricalTrends, liceGoals2025, getLiceDataByGeography } from '../lib/liceManagementData'
import { marketPriceData, getSizeClassLabel, getOptimalHarvestRecommendation } from '../lib/marketPriceData'
import { facilityPerformanceMetrics, performanceRankings, getFacilitiesByGeography as getComparisonFacilities } from '../lib/facilityComparisonData'

export default function OperationsManager() {
  const { currentGeography, setCurrentGeography, isDark, setIsDark } = useRBAC()
  const [activeTab, setActiveTab] = useState('weekly')

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Operations Control Tower
              </h1>
              <p className="text-sm text-muted-foreground">
                Week {weeklyReportData.weekNumber} - {weeklyReportData.weekDates}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Select value={currentGeography} onValueChange={setCurrentGeography}>
                <SelectTrigger className="w-[180px]">
                  <Globe2 className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">🌍 Global View</SelectItem>
                  <SelectItem value="faroe">🇫🇴 Faroe Islands</SelectItem>
                  <SelectItem value="scotland">🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" onClick={() => setIsDark(!isDark)}>
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-3xl">
            <TabsTrigger value="weekly">
              <FileText className="w-4 h-4 mr-2" />
              Weekly Report
            </TabsTrigger>
            <TabsTrigger value="lice">
              <Bug className="w-4 h-4 mr-2" />
              Lice Management
            </TabsTrigger>
            <TabsTrigger value="market">
              <TrendingUp className="w-4 h-4 mr-2" />
              Market Intelligence
            </TabsTrigger>
            <TabsTrigger value="comparison">
              <BarChart3 className="w-4 h-4 mr-2" />
              Facility Comparison
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            <WeeklyReportTab geography={currentGeography} />
          </TabsContent>

          <TabsContent value="lice">
            <LiceManagementTab geography={currentGeography} />
          </TabsContent>

          <TabsContent value="market">
            <MarketIntelligenceTab geography={currentGeography} />
          </TabsContent>

          <TabsContent value="comparison">
            <FacilityComparisonTab geography={currentGeography} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

// Weekly Report Tab Component
function WeeklyReportTab({ geography }) {
  const facilities = getFacilitiesByGeography(geography)
  const totals = getGeographyTotals(geography)
  const data = weeklyReportData.summary

  return (
    <div className="space-y-6">
      {/* Export Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Executive Summary - Week {weeklyReportData.weekNumber}</h2>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export to PDF
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Biomass */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Biomass</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalBiomass.toLocaleString()} tons</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUp className="w-3 h-3 text-green-600" />
              <span className="text-green-600">+{weeklyReportData.changes.biomass}%</span> from last week
            </p>
          </CardContent>
        </Card>

        {/* Average Weight */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.avgWeight} kg</div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.biomassOver6_2kg.toLocaleString()} tons over 6.2kg
            </p>
          </CardContent>
        </Card>

        {/* Feed */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Feed This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.feedThisWeek.toLocaleString()} tons</div>
            <p className="text-xs text-muted-foreground mt-1">
              Efficiency: {data.feedEfficiency}%
            </p>
          </CardContent>
        </Card>

        {/* TGC */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">TGC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.tgc}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUp className="w-3 h-3 text-green-600" />
              <span className="text-green-600">+{weeklyReportData.changes.tgc}</span> from last week
            </p>
          </CardContent>
        </Card>

        {/* SGR */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">SGR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.sgr}%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowDown className="w-3 h-3 text-red-600" />
              <span className="text-red-600">{weeklyReportData.changes.sgr}%</span> from last week
            </p>
          </CardContent>
        </Card>

        {/* Mortality Count */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mortality Count</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.mortalityCount.toLocaleString()} fish</div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg weight: {data.mortalityAvgWeight} kg
            </p>
          </CardContent>
        </Card>

        {/* Mortality Biomass */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mortality Biomass</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.mortalityBiomass} tons</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowDown className="w-3 h-3 text-green-600" />
              <span className="text-green-600">{weeklyReportData.changes.mortality}%</span> from last week
            </p>
          </CardContent>
        </Card>

        {/* Mature Lice */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mature Lice</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data.lice.matureCount / 1000000).toFixed(2)}m</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUp className="w-3 h-3 text-red-600" />
              <span className="text-red-600">+{weeklyReportData.changes.lice}%</span> from last week
            </p>
          </CardContent>
        </Card>

        {/* Movable Lice */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Movable Lice</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data.lice.movableCount / 1000000).toFixed(2)}m</div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.lice.ringsWithHighLice} rings with high lice
            </p>
          </CardContent>
        </Card>

        {/* Released from Freshwater */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Released from Freshwater</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.releasedFromFreshwater.count.toLocaleString()} fish</div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg weight: {data.releasedFromFreshwater.avgWeight}g
            </p>
          </CardContent>
        </Card>

        {/* Total Rings */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Rings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalRings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Overcrowded: {data.overcrowdedRings}
            </p>
          </CardContent>
        </Card>

        {/* Largest Mortality Size */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Largest Mortality Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.mortalityBySize['3500_4000g'].toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              3500-4000g fish
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Facility Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Facility Summary</CardTitle>
          <CardDescription>Performance overview by facility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Facility</th>
                  <th className="text-right p-2">Biomass (tons)</th>
                  <th className="text-right p-2">Avg Weight (kg)</th>
                  <th className="text-right p-2">TGC</th>
                  <th className="text-right p-2">FCR</th>
                  <th className="text-right p-2">Mortality (%)</th>
                  <th className="text-right p-2">Mature Lice</th>
                  <th className="text-right p-2">Rings</th>
                </tr>
              </thead>
              <tbody>
                {facilities.filter(f => f.biomass > 0).map(facility => (
                  <tr key={facility.id} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{facility.name}</td>
                    <td className="text-right p-2">{facility.biomass.toLocaleString()}</td>
                    <td className="text-right p-2">{facility.avgWeight.toFixed(2)}</td>
                    <td className="text-right p-2">{facility.tgc.toFixed(2)}</td>
                    <td className="text-right p-2">{facility.fcr.toFixed(2)}</td>
                    <td className="text-right p-2">{facility.mortality.toFixed(1)}</td>
                    <td className="text-right p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        facility.lice.mature < 0.5 ? 'bg-green-100 text-green-700' :
                        facility.lice.mature < 1.0 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {facility.lice.mature.toFixed(2)}
                      </span>
                    </td>
                    <td className="text-right p-2">{facility.rings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Lice Management Tab Component
function LiceManagementTab({ geography }) {
  const liceData = getLiceDataByGeography(geography)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Lice Management</h2>
        <p className="text-muted-foreground">Tracking and trend analysis</p>
      </div>

      {/* Bakkafrost 2025 Goals */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle>Bakkafrost 2025 Lice Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium">Mature Lice Target</p>
              <p className="text-2xl font-bold text-blue-600">&lt; {liceGoals2025.matureLice.target}</p>
              <p className="text-xs text-muted-foreground">per fish</p>
            </div>
            <div>
              <p className="text-sm font-medium">Movable Lice Target</p>
              <p className="text-2xl font-bold text-blue-600">&lt; {liceGoals2025.movableLice.target}</p>
              <p className="text-xs text-muted-foreground">per fish</p>
            </div>
            <div>
              <p className="text-sm font-medium">Spring Period (Mar-May)</p>
              <p className="text-2xl font-bold text-blue-600">&lt; {liceGoals2025.springPeriod.matureLiceMax}</p>
              <p className="text-xs text-muted-foreground">mature lice per fish</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lice Tracking Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Lice Status</CardTitle>
          <CardDescription>Color-coded alerts based on Bakkafrost 2025 goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Facility</th>
                  <th className="text-left p-2">Ring</th>
                  <th className="text-right p-2">Count Date</th>
                  <th className="text-right p-2">Mature</th>
                  <th className="text-right p-2">Movable</th>
                  <th className="text-right p-2">Total</th>
                  <th className="text-right p-2">Biomass (kg)</th>
                  <th className="text-right p-2">Days Since Treatment</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {liceData.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{row.facility}</td>
                    <td className="p-2">{row.ring}</td>
                    <td className="text-right p-2">{row.countDate}</td>
                    <td className="text-right p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        row.matureLice < liceGoals2025.matureLice.warning ? 'bg-green-100 text-green-700' :
                        row.matureLice < liceGoals2025.matureLice.critical ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {row.matureLice.toFixed(2)}
                      </span>
                    </td>
                    <td className="text-right p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        row.movableLice < liceGoals2025.movableLice.warning ? 'bg-green-100 text-green-700' :
                        row.movableLice < liceGoals2025.movableLice.critical ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {row.movableLice.toFixed(2)}
                      </span>
                    </td>
                    <td className="text-right p-2">{row.totalLice.toFixed(2)}</td>
                    <td className="text-right p-2">{row.biomass.toLocaleString()}</td>
                    <td className="text-right p-2">{row.daysSinceLastTreatment}</td>
                    <td className="p-2">
                      <Badge variant={
                        row.status === 'good' ? 'default' :
                        row.status === 'warning' ? 'secondary' :
                        'destructive'
                      }>
                        {row.status.toUpperCase()}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Multi-year Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mature Lice Trends (2021-2025)</CardTitle>
            <CardDescription>Average mature lice per fish by week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={liceHistoricalTrends.matureLice.weeks.slice(0, 40).map((week, i) => ({
                week,
                '2021': liceHistoricalTrends.matureLice.years[2021][i],
                '2022': liceHistoricalTrends.matureLice.years[2022][i],
                '2023': liceHistoricalTrends.matureLice.years[2023][i],
                '2024': liceHistoricalTrends.matureLice.years[2024][i],
                '2025': liceHistoricalTrends.matureLice.years[2025][i]
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="2021" stroke="#93a1a1" strokeWidth={1} dot={false} />
                <Line type="monotone" dataKey="2022" stroke="#6c71c4" strokeWidth={1} dot={false} />
                <Line type="monotone" dataKey="2023" stroke="#268bd2" strokeWidth={1} dot={false} />
                <Line type="monotone" dataKey="2024" stroke="#2aa198" strokeWidth={1} dot={false} />
                <Line type="monotone" dataKey="2025" stroke="#dc322f" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Movable Lice Trends (2021-2025)</CardTitle>
            <CardDescription>Average movable lice per fish by week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={liceHistoricalTrends.movableLice.weeks.slice(0, 40).map((week, i) => ({
                week,
                '2021': liceHistoricalTrends.movableLice.years[2021][i],
                '2022': liceHistoricalTrends.movableLice.years[2022][i],
                '2023': liceHistoricalTrends.movableLice.years[2023][i],
                '2024': liceHistoricalTrends.movableLice.years[2024][i],
                '2025': liceHistoricalTrends.movableLice.years[2025][i]
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="2021" stroke="#93a1a1" strokeWidth={1} dot={false} />
                <Line type="monotone" dataKey="2022" stroke="#6c71c4" strokeWidth={1} dot={false} />
                <Line type="monotone" dataKey="2023" stroke="#268bd2" strokeWidth={1} dot={false} />
                <Line type="monotone" dataKey="2024" stroke="#2aa198" strokeWidth={1} dot={false} />
                <Line type="monotone" dataKey="2025" stroke="#dc322f" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Market Intelligence Tab Component
function MarketIntelligenceTab({ geography }) {
  const harvestRecommendations = getOptimalHarvestRecommendation()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Market Intelligence</h2>
        <p className="text-muted-foreground">Salmon prices and harvest optimization</p>
      </div>

      {/* Price Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Stágri Salmon Index - Price by Size Class</CardTitle>
          <CardDescription>Prices in NOK per kg</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Size Class</th>
                  {marketPriceData.weeklyPrices.map(week => (
                    <th key={week.week} className="text-right p-2">Week {week.week}</th>
                  ))}
                  <th className="text-right p-2">Change</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(marketPriceData.weeklyPrices[0].prices).map(sizeClass => (
                  <tr key={sizeClass} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{getSizeClassLabel(sizeClass)}</td>
                    {marketPriceData.weeklyPrices.map(week => (
                      <td key={week.week} className="text-right p-2">
                        {week.prices[sizeClass].toFixed(2)}
                      </td>
                    ))}
                    <td className="text-right p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        marketPriceData.priceChanges[sizeClass] > 0 ? 'bg-green-100 text-green-700' :
                        marketPriceData.priceChanges[sizeClass] < 0 ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {marketPriceData.priceChanges[sizeClass] > 0 ? '+' : ''}
                        {marketPriceData.priceChanges[sizeClass].toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="border-b font-bold">
                  <td className="p-2">Average</td>
                  {marketPriceData.weeklyPrices.map(week => (
                    <td key={week.week} className="text-right p-2">
                      {week.avgPrice.toFixed(2)}
                    </td>
                  ))}
                  <td className="text-right p-2">
                    <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                      +{marketPriceData.priceChanges.avg.toFixed(2)}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Price Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Average Price Trends (2023-2025)</CardTitle>
          <CardDescription>Historical comparison by year</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={marketPriceData.historicalTrends.weeks.slice(0, 40).map((week, i) => ({
              week,
              '2023': marketPriceData.historicalTrends.avgPriceByYear[2023][i],
              '2024': marketPriceData.historicalTrends.avgPriceByYear[2024][i],
              '2025': marketPriceData.historicalTrends.avgPriceByYear[2025][i]
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="2023" stroke="#93a1a1" strokeWidth={1} dot={false} />
              <Line type="monotone" dataKey="2024" stroke="#268bd2" strokeWidth={1} dot={false} />
              <Line type="monotone" dataKey="2025" stroke="#859900" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Harvest Optimizer */}
      <Card>
        <CardHeader>
          <CardTitle>Harvest Timing Optimizer</CardTitle>
          <CardDescription>Recommendations based on current prices and biomass distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Size Class</th>
                  <th className="text-right p-2">Biomass (tons)</th>
                  <th className="text-right p-2">Fish Count</th>
                  <th className="text-right p-2">Current Price</th>
                  <th className="text-right p-2">Potential Revenue</th>
                  <th className="text-right p-2">Price Trend</th>
                  <th className="text-left p-2">Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {harvestRecommendations.map(rec => (
                  <tr key={rec.sizeClass} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{getSizeClassLabel(rec.sizeClass)}</td>
                    <td className="text-right p-2">{rec.biomass.toLocaleString()}</td>
                    <td className="text-right p-2">{rec.count.toLocaleString()}</td>
                    <td className="text-right p-2">{rec.currentPrice.toFixed(2)} NOK</td>
                    <td className="text-right p-2">{(rec.potentialRevenue / 1000000).toFixed(2)}M NOK</td>
                    <td className="text-right p-2">
                      <Badge variant={
                        rec.trend.includes('up') ? 'default' :
                        rec.trend.includes('down') ? 'destructive' :
                        'secondary'
                      }>
                        {rec.trend}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge variant={
                        rec.recommendation === 'Ready to Harvest' ? 'default' :
                        rec.recommendation === 'Harvest Soon' ? 'destructive' :
                        'secondary'
                      }>
                        {rec.recommendation}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Facility Comparison Tab Component
function FacilityComparisonTab({ geography }) {
  const facilities = getComparisonFacilities(geography).filter(f => f.biomass > 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Facility Comparison</h2>
        <p className="text-muted-foreground">Performance rankings and analysis</p>
      </div>

      {/* Performance Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performers by TGC</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceRankings.byTGC.filter(r => 
                geography === 'global' || r.geography === geography
              ).slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="facility" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="var(--color-green)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best FCR (Lower is Better)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceRankings.byFCR.filter(r => 
                geography === 'global' || r.geography === geography
              ).slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="facility" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="var(--color-blue)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lowest Mortality</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceRankings.byMortality.filter(r => 
                geography === 'global' || r.geography === geography
              ).slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="facility" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="var(--color-cyan)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lowest Lice Counts</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceRankings.byLice.filter(r => 
                geography === 'global' || r.geography === geography
              ).slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="facility" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="var(--color-violet)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Comprehensive Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Comprehensive Facility Comparison</CardTitle>
          <CardDescription>All active facilities with key performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Facility</th>
                  <th className="text-right p-2">Biomass</th>
                  <th className="text-right p-2">TGC</th>
                  <th className="text-right p-2">FCR</th>
                  <th className="text-right p-2">Mortality</th>
                  <th className="text-right p-2">Lice</th>
                  <th className="text-right p-2">Rings</th>
                </tr>
              </thead>
              <tbody>
                {facilities.map(facility => (
                  <tr key={facility.id} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{facility.name}</td>
                    <td className="text-right p-2">{facility.biomass.toLocaleString()} t</td>
                    <td className="text-right p-2">{facility.tgc.toFixed(2)}</td>
                    <td className="text-right p-2">{facility.fcr.toFixed(2)}</td>
                    <td className="text-right p-2">{facility.mortality.toFixed(1)}%</td>
                    <td className="text-right p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        facility.matureLiceAvg < 0.5 ? 'bg-green-100 text-green-700' :
                        facility.matureLiceAvg < 1.0 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {facility.matureLiceAvg.toFixed(2)}
                      </span>
                    </td>
                    <td className="text-right p-2">{facility.rings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

