# Integration Guide: Operations Manager into AquaMind Main Application

This guide provides step-by-step instructions for integrating the Operations Manager prototype into your main AquaMind application.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Integration Options](#integration-options)
4. [Option 1: Direct Component Integration](#option-1-direct-component-integration)
5. [Option 2: API Integration](#option-2-api-integration)
6. [Option 3: Iframe Embed](#option-3-iframe-embed)
7. [Database Integration](#database-integration)
8. [Authentication & Authorization](#authentication--authorization)
9. [Deployment](#deployment)
10. [Testing](#testing)

---

## Overview

The Operations Manager prototype is a standalone React application built with:
- React 18.3.1
- Vite 7.1.10
- Tailwind CSS 3.4.18
- shadcn/ui components
- Recharts 2.15.0

It can be integrated into your main AquaMind application (Django + Vue/React) in several ways.

---

## Prerequisites

### Main Application Stack
- **Backend:** Django (Python)
- **Frontend:** Vue.js or React
- **Database:** PostgreSQL with TimescaleDB
- **Authentication:** Django REST Framework + JWT

### Required Knowledge
- React component architecture
- Django REST Framework
- API design and integration
- PostgreSQL/TimescaleDB

---

## Integration Options

### Comparison Matrix

| Feature | Option 1: Direct | Option 2: API | Option 3: Iframe |
|---------|-----------------|---------------|------------------|
| **Complexity** | Medium | High | Low |
| **Performance** | Excellent | Good | Fair |
| **Maintenance** | Medium | High | Low |
| **Flexibility** | High | Highest | Low |
| **Time to Integrate** | 2-3 days | 5-7 days | 1 day |
| **Recommended For** | React apps | Any stack | Quick demo |

---

## Option 1: Direct Component Integration

**Best for:** React-based main applications

### Step 1: Copy Component Files

```bash
# From the prototype directory
cp -r src/pages/OperationsManager.jsx /path/to/main-app/src/pages/
cp -r src/lib/* /path/to/main-app/src/lib/
cp -r src/components/ui/* /path/to/main-app/src/components/ui/
```

### Step 2: Install Dependencies

```bash
cd /path/to/main-app
npm install recharts react-router-dom clsx tailwind-merge lucide-react
npm install @radix-ui/react-select @radix-ui/react-tabs
```

### Step 3: Update Tailwind Configuration

Add to your `tailwind.config.js`:

```javascript
module.exports = {
  // ... existing config
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
}
```

### Step 4: Add Route

In your main app router:

```jsx
import OperationsManager from './pages/OperationsManager'

// In your Routes component
<Route path="/operations-manager" element={<OperationsManager />} />
```

### Step 5: Wrap with RBAC Provider

In your `App.jsx`:

```jsx
import { RBACProvider } from './lib/RBACContext'

function App() {
  return (
    <RBACProvider>
      <Router>
        {/* Your routes */}
      </Router>
    </RBACProvider>
  )
}
```

### Step 6: Test

```bash
npm run dev
# Navigate to http://localhost:3000/operations-manager
```

---

## Option 2: API Integration

**Best for:** Django-based applications with any frontend framework

### Backend Implementation

#### Step 1: Create Django Models

```python
# models.py
from django.db import models
from django.contrib.postgres.fields import JSONField

class WeeklyReport(models.Model):
    week_number = models.IntegerField()
    year = models.IntegerField()
    report_date = models.DateField()
    kpis = JSONField()  # Store KPIs as JSON
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('week_number', 'year')
        ordering = ['-year', '-week_number']

class Facility(models.Model):
    GEOGRAPHY_CHOICES = [
        ('faroe', 'Faroe Islands'),
        ('scotland', 'Scotland'),
    ]
    
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    geography = models.CharField(max_length=20, choices=GEOGRAPHY_CHOICES)
    active = models.BooleanField(default=True)

class LiceCount(models.Model):
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE)
    ring = models.CharField(max_length=50)
    count_date = models.DateField()
    mature_lice = models.DecimalField(max_digits=5, decimal_places=2)
    movable_lice = models.DecimalField(max_digits=5, decimal_places=2)
    biomass = models.IntegerField()
    days_since_treatment = models.IntegerField()
    
    class Meta:
        ordering = ['-count_date']

class MarketPrice(models.Model):
    week_number = models.IntegerField()
    year = models.IntegerField()
    size_class = models.CharField(max_length=20)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    currency = models.CharField(max_length=3, default='NOK')
    
    class Meta:
        unique_together = ('week_number', 'year', 'size_class')
```

#### Step 2: Create Serializers

```python
# serializers.py
from rest_framework import serializers
from .models import WeeklyReport, Facility, LiceCount, MarketPrice

class WeeklyReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyReport
        fields = '__all__'

class FacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = '__all__'

class LiceCountSerializer(serializers.ModelSerializer):
    facility_name = serializers.CharField(source='facility.name', read_only=True)
    
    class Meta:
        model = LiceCount
        fields = '__all__'

class MarketPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketPrice
        fields = '__all__'
```

#### Step 3: Create API Views

```python
# views.py
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import WeeklyReport, Facility, LiceCount, MarketPrice
from .serializers import (
    WeeklyReportSerializer,
    FacilitySerializer,
    LiceCountSerializer,
    MarketPriceSerializer
)

class WeeklyReportViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = WeeklyReport.objects.all()
    serializer_class = WeeklyReportSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['week_number', 'year']
    
    @action(detail=False, methods=['get'])
    def latest(self, request):
        """Get the latest weekly report"""
        latest_report = self.queryset.first()
        serializer = self.get_serializer(latest_report)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def kpis(self, request):
        """Get KPIs for a specific week"""
        week = request.query_params.get('week')
        year = request.query_params.get('year')
        geography = request.query_params.get('geography', 'global')
        
        report = self.queryset.filter(
            week_number=week,
            year=year
        ).first()
        
        if not report:
            return Response({'error': 'Report not found'}, status=404)
        
        # Filter KPIs by geography if needed
        kpis = report.kpis
        if geography != 'global':
            # Apply geography filtering logic
            pass
        
        return Response(kpis)

class FacilityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Facility.objects.filter(active=True)
    serializer_class = FacilitySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['geography']

class LiceCountViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LiceCount.objects.all()
    serializer_class = LiceCountSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['facility', 'count_date']
    ordering_fields = ['count_date', 'mature_lice', 'movable_lice']
    
    @action(detail=False, methods=['get'])
    def current_status(self, request):
        """Get current lice status for all facilities"""
        geography = request.query_params.get('geography', 'global')
        
        # Get latest count for each facility
        from django.db.models import Max
        latest_counts = LiceCount.objects.values('facility').annotate(
            latest_date=Max('count_date')
        )
        
        results = []
        for item in latest_counts:
            count = LiceCount.objects.filter(
                facility_id=item['facility'],
                count_date=item['latest_date']
            ).first()
            
            if geography == 'global' or count.facility.geography == geography:
                results.append(count)
        
        serializer = self.get_serializer(results, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def trends(self, request):
        """Get lice trends over time"""
        geography = request.query_params.get('geography', 'global')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        queryset = self.queryset
        if geography != 'global':
            queryset = queryset.filter(facility__geography=geography)
        if start_date:
            queryset = queryset.filter(count_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(count_date__lte=end_date)
        
        # Group by week and calculate averages
        from django.db.models import Avg
        from django.db.models.functions import TruncWeek
        
        trends = queryset.annotate(
            week=TruncWeek('count_date')
        ).values('week', 'facility__name').annotate(
            avg_mature=Avg('mature_lice'),
            avg_movable=Avg('movable_lice')
        ).order_by('week')
        
        return Response(trends)

class MarketPriceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MarketPrice.objects.all()
    serializer_class = MarketPriceSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['week_number', 'year', 'size_class']
    
    @action(detail=False, methods=['get'])
    def price_matrix(self, request):
        """Get price matrix for recent weeks"""
        weeks = int(request.query_params.get('weeks', 4))
        
        # Get latest weeks
        from django.db.models import Max
        latest_week = self.queryset.aggregate(Max('week_number'))['week_number__max']
        latest_year = self.queryset.aggregate(Max('year'))['year__max']
        
        prices = self.queryset.filter(
            year=latest_year,
            week_number__gte=latest_week - weeks + 1
        ).order_by('size_class', 'week_number')
        
        # Reshape data into matrix format
        matrix = {}
        for price in prices:
            if price.size_class not in matrix:
                matrix[price.size_class] = {}
            matrix[price.size_class][f'week_{price.week_number}'] = float(price.price)
        
        return Response(matrix)
```

#### Step 4: Configure URLs

```python
# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    WeeklyReportViewSet,
    FacilityViewSet,
    LiceCountViewSet,
    MarketPriceViewSet
)

router = DefaultRouter()
router.register(r'weekly-reports', WeeklyReportViewSet)
router.register(r'facilities', FacilityViewSet)
router.register(r'lice-counts', LiceCountViewSet)
router.register(r'market-prices', MarketPriceViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
```

### Frontend Implementation

#### Step 1: Create API Service

```javascript
// src/services/api.js
import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const operationsAPI = {
  // Weekly Reports
  getLatestWeeklyReport: () => api.get('/weekly-reports/latest/'),
  getWeeklyKPIs: (week, year, geography = 'global') => 
    api.get('/weekly-reports/kpis/', { params: { week, year, geography } }),
  
  // Facilities
  getFacilities: (geography = null) => 
    api.get('/facilities/', { params: geography ? { geography } : {} }),
  
  // Lice Management
  getCurrentLiceStatus: (geography = 'global') => 
    api.get('/lice-counts/current_status/', { params: { geography } }),
  getLiceTrends: (geography = 'global', startDate, endDate) => 
    api.get('/lice-counts/trends/', { 
      params: { geography, start_date: startDate, end_date: endDate } 
    }),
  
  // Market Prices
  getPriceMatrix: (weeks = 4) => 
    api.get('/market-prices/price_matrix/', { params: { weeks } }),
}

export default api
```

#### Step 2: Update Data Files to Use API

```javascript
// src/lib/operationsWeeklyData.js
import { operationsAPI } from '@/services/api'

export const fetchWeeklyKPIs = async (week, year, geography) => {
  try {
    const response = await operationsAPI.getWeeklyKPIs(week, year, geography)
    return response.data
  } catch (error) {
    console.error('Error fetching weekly KPIs:', error)
    // Return fallback data
    return weeklyKPIs
  }
}

export const fetchFacilitySummary = async (geography) => {
  try {
    const response = await operationsAPI.getFacilities(geography)
    return response.data
  } catch (error) {
    console.error('Error fetching facility summary:', error)
    return facilitySummary
  }
}
```

#### Step 3: Update Components to Use Async Data

```jsx
// src/pages/OperationsManager.jsx
import { useState, useEffect } from 'react'
import { fetchWeeklyKPIs, fetchFacilitySummary } from '@/lib/operationsWeeklyData'

const OperationsManager = () => {
  const { selectedGeography } = useRBAC()
  const [kpis, setKPIs] = useState(null)
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [kpisData, facilitiesData] = await Promise.all([
          fetchWeeklyKPIs(40, 2025, selectedGeography),
          fetchFacilitySummary(selectedGeography)
        ])
        setKPIs(kpisData)
        setFacilities(facilitiesData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [selectedGeography])
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  return (
    // ... component JSX
  )
}
```

---

## Option 3: Iframe Embed

**Best for:** Quick demos or temporary integration

### Step 1: Deploy Prototype

Deploy the prototype to a static hosting service:

```bash
cd /home/ubuntu/executive-dashboard
pnpm build
# Deploy dist/ folder to Netlify, Vercel, or AWS S3
```

### Step 2: Embed in Main App

```html
<!-- In your main application -->
<div class="operations-manager-container">
  <iframe 
    src="https://your-prototype-url.com"
    width="100%"
    height="800px"
    frameborder="0"
    allow="fullscreen"
  ></iframe>
</div>
```

### Step 3: Communication via postMessage

**In Prototype:**
```javascript
// Send data to parent
window.parent.postMessage({
  type: 'GEOGRAPHY_CHANGED',
  geography: 'faroe'
}, '*')

// Receive data from parent
window.addEventListener('message', (event) => {
  if (event.data.type === 'UPDATE_GEOGRAPHY') {
    setSelectedGeography(event.data.geography)
  }
})
```

**In Main App:**
```javascript
// Send data to iframe
const iframe = document.querySelector('iframe')
iframe.contentWindow.postMessage({
  type: 'UPDATE_GEOGRAPHY',
  geography: 'scotland'
}, '*')

// Receive data from iframe
window.addEventListener('message', (event) => {
  if (event.data.type === 'GEOGRAPHY_CHANGED') {
    console.log('Geography changed to:', event.data.geography)
  }
})
```

---

## Database Integration

### Step 1: Create Migration Script

```python
# migrations/import_weekly_report.py
from django.core.management.base import BaseCommand
import json
from datetime import date
from myapp.models import WeeklyReport, Facility, LiceCount, MarketPrice

class Command(BaseCommand):
    help = 'Import weekly report data from JSON'
    
    def handle(self, *args, **kwargs):
        # Import facilities
        facilities = [
            {'code': 'A09', 'name': 'A09 Argir', 'geography': 'faroe'},
            {'code': 'A13', 'name': 'A13 Borðoyarvík', 'geography': 'faroe'},
            {'code': 'A21', 'name': 'A21 Reynisarvatn S', 'geography': 'faroe'},
            {'code': 'LR', 'name': 'Loch Roag', 'geography': 'scotland'},
            {'code': 'LE', 'name': 'Loch Eriboll', 'geography': 'scotland'},
        ]
        
        for fac_data in facilities:
            Facility.objects.get_or_create(**fac_data)
        
        # Import weekly report
        kpis = {
            'biomass': 57586,
            'avgWeight': 2.896,
            'feed': 3200,
            'tgc': 2.95,
            'sgr': 0.76,
            # ... more KPIs
        }
        
        WeeklyReport.objects.create(
            week_number=40,
            year=2025,
            report_date=date(2025, 10, 5),
            kpis=kpis
        )
        
        # Import lice counts
        lice_data = [
            {
                'facility': Facility.objects.get(code='A09'),
                'ring': 'A11',
                'count_date': date(2025, 9, 23),
                'mature_lice': 0.28,
                'movable_lice': 0.45,
                'biomass': 351718,
                'days_since_treatment': 45
            },
            # ... more lice counts
        ]
        
        for lice in lice_data:
            LiceCount.objects.create(**lice)
        
        # Import market prices
        prices = [
            {'week_number': 39, 'year': 2025, 'size_class': '1-2 kg', 'price': 57.37},
            {'week_number': 39, 'year': 2025, 'size_class': '2-3 kg', 'price': 67.54},
            # ... more prices
        ]
        
        for price in prices:
            MarketPrice.objects.create(**price)
        
        self.stdout.write(self.style.SUCCESS('Successfully imported data'))
```

### Step 2: Run Migration

```bash
python manage.py import_weekly_report
```

---

## Authentication & Authorization

### Step 1: Add Permission Checks

```python
# permissions.py
from rest_framework import permissions

class IsOperationsManager(permissions.BasePermission):
    """
    Only allow operations managers to access this view.
    """
    def has_permission(self, request, view):
        return request.user.role == 'operations_manager'

class GeographyPermission(permissions.BasePermission):
    """
    Check if user has access to the requested geography.
    """
    def has_permission(self, request, view):
        geography = request.query_params.get('geography', 'global')
        
        if geography == 'global':
            return request.user.has_perm('view_global_data')
        elif geography == 'faroe':
            return request.user.has_perm('view_faroe_data')
        elif geography == 'scotland':
            return request.user.has_perm('view_scotland_data')
        
        return False
```

### Step 2: Apply Permissions to Views

```python
# views.py
from .permissions import IsOperationsManager, GeographyPermission

class WeeklyReportViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsOperationsManager, GeographyPermission]
    # ... rest of the viewset
```

---

## Deployment

### Step 1: Build for Production

```bash
cd /home/ubuntu/executive-dashboard
pnpm build
```

### Step 2: Deploy to Static Hosting

**Option A: Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Option B: Vercel**
```bash
npm install -g vercel
vercel --prod
```

**Option C: AWS S3 + CloudFront**
```bash
aws s3 sync dist/ s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## Testing

### Unit Tests

```javascript
// __tests__/OperationsManager.test.jsx
import { render, screen } from '@testing-library/react'
import { RBACProvider } from '@/lib/RBACContext'
import OperationsManager from '@/pages/OperationsManager'

describe('OperationsManager', () => {
  it('renders weekly report tab', () => {
    render(
      <RBACProvider>
        <OperationsManager />
      </RBACProvider>
    )
    
    expect(screen.getByText('Executive Summary - Week 40')).toBeInTheDocument()
  })
  
  it('filters data by geography', async () => {
    // Test geography filtering
  })
})
```

### Integration Tests

```python
# tests/test_api.py
from django.test import TestCase
from rest_framework.test import APIClient
from myapp.models import WeeklyReport, Facility

class OperationsAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Create test data
        
    def test_get_weekly_report(self):
        response = self.client.get('/api/weekly-reports/latest/')
        self.assertEqual(response.status_code, 200)
        
    def test_geography_filtering(self):
        response = self.client.get('/api/facilities/?geography=faroe')
        self.assertEqual(len(response.data), 3)
```

---

## Troubleshooting

### Common Issues

**Issue 1: CORS Errors**
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://your-frontend-domain.com",
]
```

**Issue 2: Authentication Failures**
- Check JWT token expiration
- Verify token is being sent in headers
- Check user permissions

**Issue 3: Data Not Loading**
- Check API endpoints are accessible
- Verify database has data
- Check network tab in browser DevTools

---

## Next Steps

1. **Set up CI/CD pipeline** for automated deployments
2. **Add monitoring** with Sentry or similar
3. **Implement caching** with Redis for better performance
4. **Add real-time updates** with WebSockets
5. **Create mobile version** with React Native

---

**End of Integration Guide**

