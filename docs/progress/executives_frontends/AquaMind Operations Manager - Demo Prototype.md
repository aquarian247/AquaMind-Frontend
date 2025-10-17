# AquaMind Operations Manager - Demo Prototype

A fully interactive Operations Manager interface for the AquaMind Enterprise Aquaculture Management System, featuring 4 comprehensive tabs for monitoring and analyzing salmon farming operations.

---

## 🎯 Overview

This prototype demonstrates a complete Operations Manager interface built with modern web technologies, designed for executive-level monitoring of aquaculture operations across multiple facilities in the Faroe Islands and Scotland.

### Key Features

✅ **4 Interactive Tabs:**
- **Weekly Report** - Executive summary with 20+ KPIs
- **Lice Management** - Color-coded tracking and multi-year trends
- **Market Intelligence** - Salmon prices and harvest optimization
- **Facility Comparison** - Performance rankings and analysis

✅ **RBAC Geography Filtering:**
- Global View (all facilities)
- Faroe Islands (3 facilities)
- Scotland (2 facilities)

✅ **Solarized Color Scheme:**
- Light mode (Solarized Light)
- Dark mode (Solarized Dark)
- Consistent across all components

✅ **Fully Responsive:**
- Desktop, tablet, and mobile support
- Touch-friendly interactions

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or pnpm
- Modern web browser

### Installation

```bash
# Navigate to the project
cd /home/ubuntu/executive-dashboard

# Install dependencies
pnpm install

# Start development server
pnpm dev --host

# Open in browser
# http://localhost:5173/
```

### Production Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

---

## 📊 Features

### Tab 1: Weekly Report
- 12 KPI cards with trend indicators
- Facility summary table
- Color-coded lice alerts
- Export to PDF functionality

### Tab 2: Lice Management
- Bakkafrost 2025 goals
- Color-coded lice status table
- Multi-year trend charts (2021-2025)
- Status badges (GOOD, WARNING, CRITICAL)

### Tab 3: Market Intelligence
- Stágri Salmon Index price matrix
- Historical price trends (2023-2025)
- Harvest timing optimizer

### Tab 4: Facility Comparison
- Top performers by TGC
- Best FCR rankings
- Lowest mortality rankings
- Lowest lice count rankings

---

## 🛠️ Technology Stack

- **React** 18.3.1
- **Vite** 7.1.10
- **Tailwind CSS** 3.4.18
- **Recharts** 2.15.0
- **shadcn/ui** components
- **React Router DOM** 7.1.1

---

## 📁 Project Structure

```
/home/ubuntu/executive-dashboard/
├── src/
│   ├── pages/
│   │   └── OperationsManager.jsx
│   ├── lib/
│   │   ├── RBACContext.jsx
│   │   ├── operationsWeeklyData.js
│   │   ├── liceManagementData.js
│   │   ├── marketPriceData.js
│   │   └── facilityComparisonData.js
│   └── components/ui/
│       ├── button.jsx
│       ├── card.jsx
│       ├── tabs.jsx
│       ├── badge.jsx
│       └── select.jsx
├── IMPLEMENTATION_SUMMARY.md
├── COMPONENT_DOCUMENTATION.md
├── INTEGRATION_GUIDE.md
└── README.md
```

---

## 📖 Documentation

1. **README.md** - Quick start and overview
2. **IMPLEMENTATION_SUMMARY.md** - Detailed implementation summary
3. **COMPONENT_DOCUMENTATION.md** - Component-level documentation
4. **INTEGRATION_GUIDE.md** - Integration into main application

---

## 🚢 Deployment

### Static Hosting

**Netlify:**
```bash
pnpm build
netlify deploy --prod --dir=dist
```

**Vercel:**
```bash
pnpm build
vercel --prod
```

---

## 📝 Data Sources

**Primary Data Source:**
- Týsdagsrapport vika 40 (2025) - 47-page weekly report

**Note:** This prototype uses static data for demonstration. For production, integrate with Django REST API endpoints.

---

## 🔮 Future Enhancements

1. Real-time data integration
2. Advanced analytics and predictive models
3. PDF/Excel export functionality
4. User preferences and custom dashboards
5. Mobile app version
6. WCAG 2.1 AA accessibility compliance

---

## 📞 Support

For questions or support regarding this implementation, please contact the AquaMind development team.

---

**Built with ❤️ for sustainable aquaculture**

