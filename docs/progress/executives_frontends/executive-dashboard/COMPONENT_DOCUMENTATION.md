# Operations Manager Component Documentation

This document provides detailed technical documentation for each component in the Operations Manager interface.

---

## Table of Contents

1. [OperationsManager.jsx](#operationsmanagerjsx)
2. [Data Structures](#data-structures)
3. [UI Components](#ui-components)
4. [RBAC Context](#rbac-context)
5. [Styling and Theming](#styling-and-theming)

---

## OperationsManager.jsx

**Location:** `/src/pages/OperationsManager.jsx`

### Overview

The main component that orchestrates all 4 tabs and provides the overall layout for the Operations Manager interface.

### Component Structure

```jsx
const OperationsManager = () => {
  const { selectedGeography, setSelectedGeography } = useRBAC()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('weekly-report')
  
  // ... component logic
  
  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Header />
      <Tabs />
      <TabContent />
    </div>
  )
}
```

### State Management

**Local State:**
- `isDarkMode` - Boolean for dark/light mode toggle
- `activeTab` - String for current active tab

**Context State:**
- `selectedGeography` - String for RBAC filtering ('global', 'faroe', 'scotland')

### Props

None - This is a top-level page component.

### Key Functions

#### `toggleDarkMode()`
Toggles between light and dark mode.

```jsx
const toggleDarkMode = () => {
  setIsDarkMode(!isDarkMode)
}
```

#### `handleGeographyChange(value)`
Updates the selected geography for RBAC filtering.

```jsx
const handleGeographyChange = (value) => {
  setSelectedGeography(value)
}
```

### Tab Components

#### 1. Weekly Report Tab

**Features:**
- 12 KPI cards in a 4-column grid
- Facility summary table
- Export to PDF button

**Code Structure:**
```jsx
<TabsContent value="weekly-report">
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2>Executive Summary - Week 40</h2>
      <Button>Export to PDF</Button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 12 KPI Cards */}
    </div>
    
    <Card>
      <CardHeader>
        <CardTitle>Facility Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <table>{/* Facility data */}</table>
      </CardContent>
    </Card>
  </div>
</TabsContent>
```

**KPI Card Component:**
```jsx
<Card>
  <CardContent className="pt-6">
    <div className="text-sm text-muted-foreground mb-2">
      {kpi.label}
    </div>
    <div className="text-3xl font-bold mb-2">
      {kpi.value}
    </div>
    <div className={`text-sm ${kpi.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
      {kpi.trend > 0 ? '↑' : '↓'} {Math.abs(kpi.trend)}% from last week
    </div>
  </CardContent>
</Card>
```

#### 2. Lice Management Tab

**Features:**
- Bakkafrost 2025 goals card
- Color-coded lice status table
- Multi-year trend charts (Recharts)

**Code Structure:**
```jsx
<TabsContent value="lice-management">
  <div className="space-y-6">
    <Card className="bg-blue-50 dark:bg-blue-950">
      <CardHeader>
        <CardTitle>Bakkafrost 2025 Lice Goals</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Goals display */}
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle>Current Lice Status</CardTitle>
      </CardHeader>
      <CardContent>
        <table>{/* Lice tracking table */}</table>
      </CardContent>
    </Card>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Mature Lice Trends (2021-2025)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={matureLiceTrends}>
              {/* Chart configuration */}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Movable Lice Trends (2021-2025)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={movableLiceTrends}>
              {/* Chart configuration */}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </div>
</TabsContent>
```

**Color-Coded Cell Logic:**
```jsx
const getLiceColor = (value, type) => {
  if (type === 'mature') {
    if (value < 0.5) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    if (value < 1.0) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  } else {
    if (value < 1.0) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    if (value < 2.0) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
}
```

#### 3. Market Intelligence Tab

**Features:**
- Stágri Salmon Index price matrix
- Average price trends chart
- Harvest timing optimizer

**Code Structure:**
```jsx
<TabsContent value="market-intelligence">
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Stágri Salmon Index - Price by Size Class</CardTitle>
        <CardDescription>Prices in NOK per kg</CardDescription>
      </CardHeader>
      <CardContent>
        <table>{/* Price matrix */}</table>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle>Average Price Trends (2023-2025)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={priceTrends}>
            {/* Chart configuration */}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle>Harvest Timing Optimizer</CardTitle>
      </CardHeader>
      <CardContent>
        <table>{/* Optimization recommendations */}</table>
      </CardContent>
    </Card>
  </div>
</TabsContent>
```

**Price Change Color Logic:**
```jsx
const getPriceChangeColor = (change) => {
  if (change > 0) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  if (change < 0) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}
```

#### 4. Facility Comparison Tab

**Features:**
- 4 performance ranking charts
- Top performers by TGC, FCR, Mortality, Lice

**Code Structure:**
```jsx
<TabsContent value="facility-comparison">
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Top Performers by TGC</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tgcRankings}>
              <Bar dataKey="tgc" fill="#859900" />
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
            <BarChart data={fcrRankings}>
              <Bar dataKey="fcr" fill="#268bd2" />
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
            <BarChart data={mortalityRankings}>
              <Bar dataKey="mortality" fill="#2aa198" />
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
            <BarChart data={liceRankings}>
              <Bar dataKey="lice" fill="#6c71c4" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </div>
</TabsContent>
```

---

## Data Structures

### 1. operationsWeeklyData.js

**Purpose:** Provides weekly KPIs and facility summary data.

**Structure:**
```javascript
export const weeklyKPIs = {
  biomass: {
    value: 57586,
    unit: 'tons',
    trend: 2.3,
    details: '6,714 tons over 6.2kg'
  },
  avgWeight: {
    value: 2.896,
    unit: 'kg',
    trend: 0,
    details: '6,714 tons over 6.2kg'
  },
  // ... more KPIs
}

export const facilitySummary = [
  {
    facility: 'A09 Argir',
    geography: 'faroe',
    biomass: 20048,
    avgWeight: 7.58,
    tgc: 3.10,
    fcr: 1.15,
    mortality: 2.1,
    matureLice: 0.28,
    rings: 4
  },
  // ... more facilities
]
```

**Functions:**
```javascript
export const getFilteredFacilities = (geography) => {
  if (geography === 'global') return facilitySummary
  return facilitySummary.filter(f => f.geography === geography)
}

export const calculateAggregateKPIs = (facilities) => {
  // Aggregate calculations
}
```

### 2. liceManagementData.js

**Purpose:** Provides lice management goals, current status, and historical trends.

**Structure:**
```javascript
export const bakkafrost2025Goals = {
  matureLice: 0.2,
  movableLice: 0.1,
  springPeriod: 0.8
}

export const currentLiceStatus = [
  {
    facility: 'A09 Argir',
    geography: 'faroe',
    ring: 'A11',
    countDate: '23-09-2025',
    mature: 0.28,
    movable: 0.45,
    total: 0.73,
    biomass: 351718,
    daysSinceTreatment: 45,
    status: 'GOOD'
  },
  // ... more records
]

export const matureLiceTrends = [
  {
    week: 'W01',
    'A09 Argir': 0.15,
    'A13 Borðoyarvík': 0.22,
    'A21 Reynisarvatn S': 0.18,
    'Loch Roag': 0.95,
    'Loch Eriboll': 0.78
  },
  // ... more weeks
]

export const movableLiceTrends = [
  // Similar structure
]
```

### 3. marketPriceData.js

**Purpose:** Provides salmon market prices and harvest optimization data.

**Structure:**
```javascript
export const salmonPrices = {
  weeks: ['Week 36', 'Week 37', 'Week 38', 'Week 39'],
  sizeClasses: [
    {
      class: '1-2 kg',
      week36: 50.17,
      week37: 53.74,
      week38: 58.80,
      week39: 57.37,
      change: -1.43
    },
    // ... more size classes
  ]
}

export const priceTrends = [
  {
    month: 'Jan 2023',
    avgPrice: 65.2
  },
  // ... more months
]

export const harvestOptimizer = [
  {
    facility: 'A09 Argir',
    currentSize: 7.58,
    targetSize: 8.5,
    weeksToTarget: 4,
    currentPrice: 82.29,
    projectedPrice: 85.00,
    recommendation: 'Hold 4 weeks'
  },
  // ... more facilities
]
```

### 4. facilityComparisonData.js

**Purpose:** Provides facility performance rankings.

**Structure:**
```javascript
export const facilityPerformance = [
  {
    facility: 'A09 Argir',
    geography: 'faroe',
    tgc: 3.10,
    fcr: 1.15,
    mortality: 2.1,
    matureLice: 0.28
  },
  // ... more facilities
]

export const getRankings = (geography, metric) => {
  const facilities = getFilteredFacilities(geography)
  return facilities
    .sort((a, b) => {
      if (metric === 'fcr' || metric === 'mortality' || metric === 'lice') {
        return a[metric] - b[metric] // Lower is better
      } else {
        return b[metric] - a[metric] // Higher is better
      }
    })
    .slice(0, 5)
}
```

---

## UI Components

### Button Component

**Location:** `/src/components/ui/button.jsx`

**Usage:**
```jsx
import { Button } from '@/components/ui/button'

<Button variant="default" size="md">
  Click Me
</Button>
```

**Variants:**
- `default` - Primary button (Solarized blue)
- `outline` - Outlined button
- `ghost` - Transparent button
- `destructive` - Red button for dangerous actions

**Sizes:**
- `sm` - Small button
- `md` - Medium button (default)
- `lg` - Large button

### Card Component

**Location:** `/src/components/ui/card.jsx`

**Usage:**
```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

### Tabs Component

**Location:** `/src/components/ui/tabs.jsx`

**Usage:**
```jsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    Tab 1 content
  </TabsContent>
  <TabsContent value="tab2">
    Tab 2 content
  </TabsContent>
</Tabs>
```

### Badge Component

**Location:** `/src/components/ui/badge.jsx`

**Usage:**
```jsx
import { Badge } from '@/components/ui/badge'

<Badge variant="success">GOOD</Badge>
<Badge variant="warning">WARNING</Badge>
<Badge variant="destructive">CRITICAL</Badge>
```

**Variants:**
- `default` - Gray badge
- `success` - Green badge
- `warning` - Yellow badge
- `destructive` - Red badge

### Select Component

**Location:** `/src/components/ui/select.jsx`

**Usage:**
```jsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

<Select value={selectedValue} onValueChange={handleChange}>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

---

## RBAC Context

**Location:** `/src/lib/RBACContext.jsx`

### Overview

Provides global state management for geography-based RBAC filtering.

### Implementation

```jsx
import React, { createContext, useContext, useState } from 'react'

const RBACContext = createContext()

export const RBACProvider = ({ children }) => {
  const [selectedGeography, setSelectedGeography] = useState('global')
  
  const value = {
    selectedGeography,
    setSelectedGeography
  }
  
  return (
    <RBACContext.Provider value={value}>
      {children}
    </RBACContext.Provider>
  )
}

export const useRBAC = () => {
  const context = useContext(RBACContext)
  if (!context) {
    throw new Error('useRBAC must be used within RBACProvider')
  }
  return context
}
```

### Usage

**In App.jsx:**
```jsx
import { RBACProvider } from './lib/RBACContext'

function App() {
  return (
    <RBACProvider>
      <Router>
        <Routes>
          <Route path="/" element={<OperationsManager />} />
        </Routes>
      </Router>
    </RBACProvider>
  )
}
```

**In Components:**
```jsx
import { useRBAC } from '@/lib/RBACContext'

const MyComponent = () => {
  const { selectedGeography, setSelectedGeography } = useRBAC()
  
  // Filter data based on selectedGeography
  const filteredData = data.filter(item => 
    selectedGeography === 'global' || item.geography === selectedGeography
  )
  
  return (
    // ... component JSX
  )
}
```

---

## Styling and Theming

### Tailwind CSS Configuration

**Location:** `tailwind.config.js`

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        solarized: {
          base03: '#002b36',
          base02: '#073642',
          base01: '#586e75',
          base00: '#657b83',
          base0: '#839496',
          base1: '#93a1a1',
          base2: '#eee8d5',
          base3: '#fdf6e3',
          yellow: '#b58900',
          orange: '#cb4b16',
          red: '#dc322f',
          magenta: '#d33682',
          violet: '#6c71c4',
          blue: '#268bd2',
          cyan: '#2aa198',
          green: '#859900',
        },
      },
    },
  },
  plugins: [],
}
```

### CSS Variables

**Location:** `src/index.css`

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 192 81% 14%;
    --primary: 205 69% 49%;
    --secondary: 45 100% 71%;
    --accent: 68 100% 30%;
    --destructive: 1 71% 52%;
    --border: 192 13% 86%;
    --radius: 0.5rem;
  }
  
  .dark {
    --background: 192 100% 11%;
    --foreground: 44 87% 94%;
    --border: 192 33% 15%;
  }
}
```

### Dark Mode Implementation

**Toggle Logic:**
```jsx
const [isDarkMode, setIsDarkMode] = useState(false)

const toggleDarkMode = () => {
  setIsDarkMode(!isDarkMode)
}

return (
  <div className={isDarkMode ? 'dark' : ''}>
    {/* Content */}
  </div>
)
```

**Dark Mode Classes:**
```jsx
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-gray-100">
    This text adapts to dark mode
  </p>
</div>
```

---

## Recharts Configuration

### Line Chart Example

```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="week" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="A09 Argir" stroke="#859900" strokeWidth={2} />
    <Line type="monotone" dataKey="A13 Borðoyarvík" stroke="#268bd2" strokeWidth={2} />
    <Line type="monotone" dataKey="A21 Reynisarvatn S" stroke="#2aa198" strokeWidth={2} />
    <Line type="monotone" dataKey="Loch Roag" stroke="#6c71c4" strokeWidth={2} />
    <Line type="monotone" dataKey="Loch Eriboll" stroke="#d33682" strokeWidth={2} />
  </LineChart>
</ResponsiveContainer>
```

### Bar Chart Example

```jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="facility" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="tgc" fill="#859900" />
  </BarChart>
</ResponsiveContainer>
```

---

## Utility Functions

### cn() - Class Name Merger

**Location:** `/src/lib/utils.js`

```javascript
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
```

**Usage:**
```jsx
<div className={cn(
  'base-class',
  isDarkMode && 'dark-class',
  isActive && 'active-class'
)}>
  Content
</div>
```

### Number Formatting

```javascript
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num)
}

export const formatCurrency = (num, currency = 'NOK') => {
  return new Intl.NumberFormat('no-NO', {
    style: 'currency',
    currency: currency
  }).format(num)
}

export const formatPercentage = (num, decimals = 1) => {
  return `${num.toFixed(decimals)}%`
}
```

---

## Performance Optimization

### React.memo for Charts

```jsx
import React, { memo } from 'react'

const LiceTrendChart = memo(({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        {/* Chart configuration */}
      </LineChart>
    </ResponsiveContainer>
  )
})
```

### useMemo for Expensive Calculations

```jsx
import { useMemo } from 'react'

const filteredData = useMemo(() => {
  return data.filter(item => 
    selectedGeography === 'global' || item.geography === selectedGeography
  )
}, [data, selectedGeography])
```

---

## Accessibility

### ARIA Labels

```jsx
<button aria-label="Toggle dark mode" onClick={toggleDarkMode}>
  {isDarkMode ? <Sun /> : <Moon />}
</button>

<table aria-label="Facility summary">
  {/* Table content */}
</table>
```

### Keyboard Navigation

```jsx
<TabsList>
  <TabsTrigger value="weekly-report" aria-label="Weekly Report">
    Weekly Report
  </TabsTrigger>
</TabsList>
```

---

**End of Component Documentation**

