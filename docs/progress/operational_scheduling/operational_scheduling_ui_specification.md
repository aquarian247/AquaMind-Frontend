# Operational Scheduling UI Specification

**Version**: 1.0  
**Last Updated**: October 28, 2025  
**Target Repository**: `aquarian247/AquaMind-Frontend/docs/progress/`

---

## Table of Contents

1. [Overview](#overview)
2. [Design System](#design-system)
3. [Page Structure](#page-structure)
4. [Component Specifications](#component-specifications)
5. [User Flows](#user-flows)
6. [API Integration](#api-integration)
7. [State Management](#state-management)
8. [Responsive Design](#responsive-design)

---

## Overview

This document specifies the frontend implementation for the **Operational Scheduling** feature in AquaMind. The UI provides a Production Planner interface for creating, viewing, and managing planned operational activities across scenarios.

### Technology Stack

- **Framework**: React 18 + TypeScript
- **State Management**: TanStack Query (React Query) for server state
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Routing**: React Router v6
- **Charts**: Recharts or D3.js for timeline visualization
- **Forms**: React Hook Form + Zod validation

### Design Principles

1. **Scenario-Centric**: All views are filtered by the selected scenario
2. **Batch-Aware**: Activities are organized by batch for clarity
3. **Timeline-First**: The primary view is a Gantt/Timeline chart
4. **Mobile-Friendly**: Responsive design for field workers
5. **Integration**: Seamless integration with existing Batch and Scenario pages

---

## Design System

### Color Palette

The UI uses the **Solarized** theme (as per existing AquaMind design):

**Light Mode**:
- Background: `#fdf6e3` (base3)
- Surface: `#eee8d5` (base2)
- Primary: `#268bd2` (blue)
- Secondary: `#2aa198` (cyan)
- Accent: `#859900` (green)
- Warning: `#b58900` (yellow)
- Error: `#dc322f` (red)
- Text: `#657b83` (base00)

**Dark Mode**:
- Background: `#002b36` (base03)
- Surface: `#073642` (base02)
- Primary: `#268bd2` (blue)
- Secondary: `#2aa198` (cyan)
- Accent: `#859900` (green)
- Warning: `#b58900` (yellow)
- Error: `#dc322f` (red)
- Text: `#839496` (base0)

### Typography

- **Headings**: `font-family: 'Inter', sans-serif; font-weight: 600;`
- **Body**: `font-family: 'Inter', sans-serif; font-weight: 400;`
- **Monospace**: `font-family: 'Fira Code', monospace;` (for IDs, codes)

### Spacing

Use Tailwind's spacing scale (`p-4`, `m-6`, etc.) consistently.

---

## Page Structure

### 1. Production Planner Page

**Route**: `/production-planner`

**Layout**:

```
┌─────────────────────────────────────────────────────────────┐
│ Header: "Production Planner" | Scenario Selector | Actions │
├─────────────────────────────────────────────────────────────┤
│ KPI Dashboard (4 cards)                                     │
├─────────────────────────────────────────────────────────────┤
│ Filters: Activity Type | Status | Batch | Date Range        │
├─────────────────────────────────────────────────────────────┤
│ Timeline View (Gantt Chart)                                 │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ Batch 206 ▼                                           │   │
│ │   ├─ Vaccination (Dec 15) [PENDING]                   │   │
│ │   └─ Transfer (Jan 10) [IN_PROGRESS]                  │   │
│ │ Batch 207 ▼                                           │   │
│ │   ├─ Culling (Dec 20) [OVERDUE]                       │   │
│ │   └─ Sale (Feb 1) [PENDING]                           │   │
│ └───────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│ Footer: Total Activities: 45 | Overdue: 3                  │
└─────────────────────────────────────────────────────────────┘
```

**Key Features**:
- **Scenario Selector**: Dropdown to switch between scenarios
- **KPI Cards**: Upcoming (7 days), Overdue, This Month, Completed
- **Filters**: Multi-select filters for activity type, status, batch, date range
- **Timeline View**: Interactive Gantt chart grouped by batch
- **Actions**: "Create Activity" button, "Export to CSV" button

---

### 2. Batch Detail Page - Planned Activities Tab

**Route**: `/batch-management/:id` (new tab)

**Layout**:

```
┌─────────────────────────────────────────────────────────────┐
│ Batch SCO-2024-001 | Tabs: Overview | Containers | ...     │
├─────────────────────────────────────────────────────────────┤
│ Tab: Planned Activities                                     │
├─────────────────────────────────────────────────────────────┤
│ Scenario Selector | "Create Activity" Button               │
├─────────────────────────────────────────────────────────────┤
│ Activity List (Table)                                       │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ Type      | Due Date  | Status    | Actions           │   │
│ ├───────────────────────────────────────────────────────┤   │
│ │ Vaccination│ Dec 15   │ PENDING   │ [Edit] [Complete] │   │
│ │ Transfer  │ Jan 10   │ IN_PROGRESS│ [View Workflow]   │   │
│ │ Culling   │ Dec 20   │ OVERDUE   │ [Edit] [Complete] │   │
│ └───────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Key Features**:
- **Scenario Filter**: Show activities for selected scenario only
- **Activity Table**: Sortable, filterable table with actions
- **Quick Actions**: Edit, Complete, View Workflow (for transfers)

---

### 3. Scenario Planning Page - Planned Activities Section

**Route**: `/scenario-planning/:id` (new section)

**Layout**:

```
┌─────────────────────────────────────────────────────────────┐
│ Scenario: "2025 Growth Plan" | Tabs: Overview | Projections│
├─────────────────────────────────────────────────────────────┤
│ Section: Planned Activities                                 │
├─────────────────────────────────────────────────────────────┤
│ "View Full Production Planner" Link                         │
├─────────────────────────────────────────────────────────────┤
│ Summary Cards                                               │
│ ┌─────────────┬─────────────┬─────────────┬─────────────┐   │
│ │ Total: 45   │ Pending: 30 │ Overdue: 3  │ Completed:12│   │
│ └─────────────┴─────────────┴─────────────┴─────────────┘   │
├─────────────────────────────────────────────────────────────┤
│ Recent Activities (List)                                    │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ • Vaccination for Batch 206 - Dec 15 (PENDING)        │   │
│ │ • Transfer for Batch 207 - Jan 10 (IN_PROGRESS)       │   │
│ │ • Culling for Batch 208 - Dec 20 (OVERDUE)            │   │
│ └───────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Key Features**:
- **Summary Cards**: Quick overview of activity status
- **Recent Activities**: Last 5 activities (sorted by due date)
- **Link to Full View**: Navigate to Production Planner page

---

## Component Specifications

### 1. KPI Dashboard

**Component**: `ProductionPlannerKPIDashboard.tsx`

**Props**:
```typescript
interface ProductionPlannerKPIDashboardProps {
  scenarioId: number;
}
```

**Data Fetching**:
```typescript
const { data: activities } = useQuery({
  queryKey: ['planned-activities', scenarioId],
  queryFn: () => ScenarioService.apiV1ScenarioScenariosPlannedActivitiesRetrieve({ id: scenarioId }),
});
```

**Computed Metrics**:
```typescript
const kpis = useMemo(() => {
  const now = new Date();
  const sevenDaysFromNow = addDays(now, 7);
  
  return {
    upcoming: activities?.filter(a => 
      a.status === 'PENDING' && 
      new Date(a.due_date) >= now && 
      new Date(a.due_date) <= sevenDaysFromNow
    ).length || 0,
    overdue: activities?.filter(a => a.is_overdue).length || 0,
    thisMonth: activities?.filter(a => 
      a.status !== 'COMPLETED' && 
      isSameMonth(new Date(a.due_date), now)
    ).length || 0,
    completed: activities?.filter(a => a.status === 'COMPLETED').length || 0,
  };
}, [activities]);
```

**UI Structure**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
  <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleFilterChange({ upcoming: true })}>
    <CardHeader>
      <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming (Next 7 Days)</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-primary">{kpis.upcoming}</div>
    </CardContent>
  </Card>
  
  <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleFilterChange({ overdue: true })}>
    <CardHeader>
      <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-destructive">{kpis.overdue}</div>
    </CardContent>
  </Card>
  
  <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleFilterChange({ thisMonth: true })}>
    <CardHeader>
      <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-secondary">{kpis.thisMonth}</div>
    </CardContent>
  </Card>
  
  <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleFilterChange({ completed: true })}>
    <CardHeader>
      <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-accent">{kpis.completed}</div>
    </CardContent>
  </Card>
</div>
```

**Interactions**:
- Clicking a card filters the timeline view to show only relevant activities
- Cards update in real-time as activities are created/completed

---

### 2. Activity Filters

**Component**: `PlannedActivityFilters.tsx`

**Props**:
```typescript
interface PlannedActivityFiltersProps {
  onFilterChange: (filters: ActivityFilters) => void;
  initialFilters?: ActivityFilters;
}

interface ActivityFilters {
  activityTypes: string[];
  statuses: string[];
  batches: number[];
  dateRange: { start: Date | null; end: Date | null };
}
```

**UI Structure**:
```tsx
<div className="flex flex-wrap gap-4 mb-6 p-4 bg-surface rounded-lg">
  <div className="flex-1 min-w-[200px]">
    <Label>Activity Type</Label>
    <MultiSelect
      options={activityTypeOptions}
      value={filters.activityTypes}
      onChange={(value) => handleFilterChange({ activityTypes: value })}
      placeholder="All Types"
    />
  </div>
  
  <div className="flex-1 min-w-[200px]">
    <Label>Status</Label>
    <MultiSelect
      options={statusOptions}
      value={filters.statuses}
      onChange={(value) => handleFilterChange({ statuses: value })}
      placeholder="All Statuses"
    />
  </div>
  
  <div className="flex-1 min-w-[200px]">
    <Label>Batch</Label>
    <MultiSelect
      options={batchOptions}
      value={filters.batches}
      onChange={(value) => handleFilterChange({ batches: value })}
      placeholder="All Batches"
    />
  </div>
  
  <div className="flex-1 min-w-[250px]">
    <Label>Date Range</Label>
    <DateRangePicker
      value={filters.dateRange}
      onChange={(value) => handleFilterChange({ dateRange: value })}
    />
  </div>
  
  <div className="flex items-end">
    <Button variant="outline" onClick={handleClearFilters}>
      Clear Filters
    </Button>
  </div>
</div>
```

**Filter Logic**:
```typescript
const filteredActivities = useMemo(() => {
  return activities?.filter(activity => {
    // Activity type filter
    if (filters.activityTypes.length > 0 && !filters.activityTypes.includes(activity.activity_type)) {
      return false;
    }
    
    // Status filter
    if (filters.statuses.length > 0 && !filters.statuses.includes(activity.status)) {
      return false;
    }
    
    // Batch filter
    if (filters.batches.length > 0 && !filters.batches.includes(activity.batch)) {
      return false;
    }
    
    // Date range filter
    if (filters.dateRange.start && new Date(activity.due_date) < filters.dateRange.start) {
      return false;
    }
    if (filters.dateRange.end && new Date(activity.due_date) > filters.dateRange.end) {
      return false;
    }
    
    return true;
  }) || [];
}, [activities, filters]);
```

---

### 3. Production Planner Timeline

**Component**: `ProductionPlannerTimeline.tsx`

**Props**:
```typescript
interface ProductionPlannerTimelineProps {
  activities: PlannedActivity[];
  onActivityClick: (activity: PlannedActivity) => void;
  onCreateActivity: () => void;
}
```

**Data Transformation**:
```typescript
const timelineData = useMemo(() => {
  // Group activities by batch
  const grouped = activities.reduce((acc, activity) => {
    const batchId = activity.batch;
    if (!acc[batchId]) {
      acc[batchId] = {
        batchId,
        batchName: `Batch ${batchId}`,
        activities: [],
      };
    }
    acc[batchId].activities.push(activity);
    return acc;
  }, {} as Record<number, { batchId: number; batchName: string; activities: PlannedActivity[] }>);
  
  return Object.values(grouped);
}, [activities]);
```

**UI Structure** (using Recharts Gantt):
```tsx
<div className="bg-surface rounded-lg p-6">
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-semibold">Timeline View</h3>
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={() => setViewMode('week')}>
        Week
      </Button>
      <Button variant="outline" size="sm" onClick={() => setViewMode('month')}>
        Month
      </Button>
      <Button variant="outline" size="sm" onClick={() => setViewMode('quarter')}>
        Quarter
      </Button>
    </div>
  </div>
  
  <div className="overflow-x-auto">
    <div className="min-w-[800px]">
      {timelineData.map((batch) => (
        <div key={batch.batchId} className="mb-6">
          <div className="flex items-center mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleBatchExpansion(batch.batchId)}
            >
              {expandedBatches.includes(batch.batchId) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            <span className="font-semibold">{batch.batchName}</span>
            <Badge variant="secondary" className="ml-2">
              {batch.activities.length} activities
            </Badge>
          </div>
          
          {expandedBatches.includes(batch.batchId) && (
            <div className="ml-8">
              {batch.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 py-2 hover:bg-accent/10 cursor-pointer rounded"
                  onClick={() => onActivityClick(activity)}
                >
                  <div className="w-32">
                    <Badge variant={getActivityTypeBadgeVariant(activity.activity_type)}>
                      {activity.activity_type_display}
                    </Badge>
                  </div>
                  <div className="w-24 text-sm text-muted-foreground">
                    {format(new Date(activity.due_date), 'MMM dd, yyyy')}
                  </div>
                  <div className="w-24">
                    <Badge variant={getStatusBadgeVariant(activity.status)}>
                      {activity.status_display}
                    </Badge>
                  </div>
                  <div className="flex-1 text-sm truncate">
                    {activity.notes || 'No notes'}
                  </div>
                  <div className="w-8">
                    {activity.is_overdue && (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
</div>
```

**Alternative: D3.js Gantt Chart**

For a more sophisticated timeline, use D3.js:

```typescript
import * as d3 from 'd3';

const TimelineChart: React.FC<{ data: TimelineData[] }> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current || !data.length) return;
    
    const svg = d3.select(svgRef.current);
    const width = 1000;
    const height = data.length * 60;
    const margin = { top: 20, right: 20, bottom: 30, left: 150 };
    
    // Create scales
    const xScale = d3.scaleTime()
      .domain([
        d3.min(data, d => new Date(d.due_date))!,
        d3.max(data, d => new Date(d.due_date))!,
      ])
      .range([margin.left, width - margin.right]);
    
    const yScale = d3.scaleBand()
      .domain(data.map(d => d.batch_name))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);
    
    // Draw bars
    svg.selectAll('.activity-bar')
      .data(data)
      .join('rect')
      .attr('class', 'activity-bar')
      .attr('x', d => xScale(new Date(d.due_date)))
      .attr('y', d => yScale(d.batch_name)!)
      .attr('width', 10)
      .attr('height', yScale.bandwidth())
      .attr('fill', d => getActivityColor(d.activity_type))
      .attr('opacity', 0.8)
      .on('click', (event, d) => onActivityClick(d));
    
    // Draw axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    
    svg.select('.x-axis')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis);
    
    svg.select('.y-axis')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yAxis);
      
  }, [data, onActivityClick]);
  
  return (
    <svg ref={svgRef} width="100%" height="600">
      <g className="x-axis" />
      <g className="y-axis" />
    </svg>
  );
};
```

---

### 4. Create/Edit Activity Form

**Component**: `PlannedActivityForm.tsx`

**Props**:
```typescript
interface PlannedActivityFormProps {
  scenarioId: number;
  activity?: PlannedActivity; // For editing
  onSuccess: () => void;
  onCancel: () => void;
}
```

**Form Schema** (Zod):
```typescript
const plannedActivitySchema = z.object({
  scenario: z.number(),
  batch: z.number({ required_error: 'Batch is required' }),
  activity_type: z.enum([
    'VACCINATION',
    'TREATMENT',
    'CULL',
    'SALE',
    'FEED_CHANGE',
    'TRANSFER',
    'MAINTENANCE',
    'SAMPLING',
    'OTHER',
  ], { required_error: 'Activity type is required' }),
  due_date: z.date({ required_error: 'Due date is required' }),
  container: z.number().optional(),
  notes: z.string().optional(),
});

type PlannedActivityFormData = z.infer<typeof plannedActivitySchema>;
```

**Form Implementation**:
```typescript
const form = useForm<PlannedActivityFormData>({
  resolver: zodResolver(plannedActivitySchema),
  defaultValues: activity ? {
    scenario: activity.scenario,
    batch: activity.batch,
    activity_type: activity.activity_type,
    due_date: new Date(activity.due_date),
    container: activity.container || undefined,
    notes: activity.notes || '',
  } : {
    scenario: scenarioId,
    batch: undefined,
    activity_type: undefined,
    due_date: new Date(),
    container: undefined,
    notes: '',
  },
});

const createMutation = useMutation({
  mutationFn: (data: PlannedActivityFormData) => 
    PlanningService.apiV1PlanningPlannedActivitiesCreate({
      ...data,
      due_date: format(data.due_date, 'yyyy-MM-dd'),
    }),
  onSuccess: () => {
    queryClient.invalidateQueries(['planned-activities', scenarioId]);
    toast.success('Activity created successfully');
    onSuccess();
  },
  onError: (error) => {
    toast.error('Failed to create activity');
    console.error(error);
  },
});

const updateMutation = useMutation({
  mutationFn: (data: PlannedActivityFormData) => 
    PlanningService.apiV1PlanningPlannedActivitiesPartialUpdate({
      id: activity!.id,
      ...data,
      due_date: format(data.due_date, 'yyyy-MM-dd'),
    }),
  onSuccess: () => {
    queryClient.invalidateQueries(['planned-activities', scenarioId]);
    toast.success('Activity updated successfully');
    onSuccess();
  },
  onError: (error) => {
    toast.error('Failed to update activity');
    console.error(error);
  },
});

const onSubmit = (data: PlannedActivityFormData) => {
  if (activity) {
    updateMutation.mutate(data);
  } else {
    createMutation.mutate(data);
  }
};
```

**UI Structure**:
```tsx
<Dialog open={true} onOpenChange={onCancel}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>{activity ? 'Edit' : 'Create'} Planned Activity</DialogTitle>
    </DialogHeader>
    
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="batch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Batch *</FormLabel>
              <FormControl>
                <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches?.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id.toString()}>
                        {batch.batch_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="activity_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity Type *</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VACCINATION">Vaccination</SelectItem>
                    <SelectItem value="TREATMENT">Treatment/Health Intervention</SelectItem>
                    <SelectItem value="CULL">Culling</SelectItem>
                    <SelectItem value="SALE">Sale/Harvest</SelectItem>
                    <SelectItem value="FEED_CHANGE">Feed Strategy Change</SelectItem>
                    <SelectItem value="TRANSFER">Transfer</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                    <SelectItem value="SAMPLING">Sampling</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date *</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="container"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Container (Optional)</FormLabel>
              <FormControl>
                <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select container" />
                  </SelectTrigger>
                  <SelectContent>
                    {containers?.map((container) => (
                      <SelectItem key={container.id} value={container.id.toString()}>
                        {container.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Add any relevant notes or context"
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {(createMutation.isPending || updateMutation.isPending) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {activity ? 'Update' : 'Create'} Activity
          </Button>
        </DialogFooter>
      </form>
    </Form>
  </DialogContent>
</Dialog>
```

---

### 5. Activity Detail Modal

**Component**: `PlannedActivityDetailModal.tsx`

**Props**:
```typescript
interface PlannedActivityDetailModalProps {
  activity: PlannedActivity;
  onClose: () => void;
  onEdit: () => void;
  onComplete: () => void;
  onSpawnWorkflow?: () => void;
}
```

**UI Structure**:
```tsx
<Dialog open={true} onOpenChange={onClose}>
  <DialogContent className="max-w-3xl">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <Badge variant={getActivityTypeBadgeVariant(activity.activity_type)}>
          {activity.activity_type_display}
        </Badge>
        <span>for Batch {activity.batch}</span>
        {activity.is_overdue && (
          <Badge variant="destructive">OVERDUE</Badge>
        )}
      </DialogTitle>
    </DialogHeader>
    
    <div className="space-y-6">
      {/* Core Information */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-muted-foreground">Due Date</Label>
          <p className="text-lg font-semibold">
            {format(new Date(activity.due_date), 'MMMM dd, yyyy')}
          </p>
        </div>
        <div>
          <Label className="text-muted-foreground">Status</Label>
          <p>
            <Badge variant={getStatusBadgeVariant(activity.status)}>
              {activity.status_display}
            </Badge>
          </p>
        </div>
        <div>
          <Label className="text-muted-foreground">Container</Label>
          <p className="text-lg">
            {activity.container_name || 'Not specified'}
          </p>
        </div>
        <div>
          <Label className="text-muted-foreground">Created By</Label>
          <p className="text-lg">{activity.created_by_name}</p>
        </div>
      </div>
      
      {/* Notes */}
      {activity.notes && (
        <div>
          <Label className="text-muted-foreground">Notes</Label>
          <p className="mt-2 p-4 bg-surface rounded-lg">{activity.notes}</p>
        </div>
      )}
      
      {/* Completion Info */}
      {activity.status === 'COMPLETED' && (
        <div className="bg-accent/10 p-4 rounded-lg">
          <Label className="text-muted-foreground">Completed</Label>
          <p className="mt-2">
            <strong>{activity.completed_by_name}</strong> marked this activity as completed on{' '}
            <strong>{format(new Date(activity.completed_at!), 'MMMM dd, yyyy HH:mm')}</strong>
          </p>
        </div>
      )}
      
      {/* Transfer Workflow Link */}
      {activity.transfer_workflow && (
        <div className="bg-primary/10 p-4 rounded-lg">
          <Label className="text-muted-foreground">Linked Transfer Workflow</Label>
          <p className="mt-2">
            This activity is linked to Transfer Workflow{' '}
            <Link to={`/transfer-workflows/${activity.transfer_workflow}`} className="text-primary underline">
              #{activity.transfer_workflow}
            </Link>
          </p>
        </div>
      )}
      
      {/* Audit Trail */}
      <div className="text-sm text-muted-foreground">
        <p>Created: {format(new Date(activity.created_at), 'MMMM dd, yyyy HH:mm')}</p>
        <p>Last Updated: {format(new Date(activity.updated_at), 'MMMM dd, yyyy HH:mm')}</p>
      </div>
    </div>
    
    <DialogFooter>
      <Button variant="outline" onClick={onClose}>
        Close
      </Button>
      {activity.status !== 'COMPLETED' && (
        <>
          <Button variant="outline" onClick={onEdit}>
            Edit
          </Button>
          {activity.activity_type === 'TRANSFER' && !activity.transfer_workflow && onSpawnWorkflow && (
            <Button variant="secondary" onClick={onSpawnWorkflow}>
              Create Workflow
            </Button>
          )}
          <Button variant="default" onClick={onComplete}>
            Mark as Completed
          </Button>
        </>
      )}
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## User Flows

### Flow 1: Create a Planned Activity

1. User navigates to Production Planner page
2. User selects scenario from dropdown
3. User clicks "Create Activity" button
4. Create Activity form modal opens
5. User fills in required fields (Batch, Activity Type, Due Date)
6. User optionally fills in Container and Notes
7. User clicks "Create Activity" button
8. API request is sent to `/api/v1/planning/planned-activities/`
9. On success, modal closes and timeline refreshes
10. Toast notification confirms creation

### Flow 2: Mark Activity as Completed

1. User navigates to Production Planner page or Batch Detail page
2. User clicks on an activity in the timeline/table
3. Activity Detail modal opens
4. User clicks "Mark as Completed" button
5. API request is sent to `/api/v1/planning/planned-activities/{id}/mark-completed/`
6. On success, modal closes and timeline/table refreshes
7. Toast notification confirms completion

### Flow 3: Spawn Transfer Workflow from Planned Activity

1. User navigates to Production Planner page
2. User clicks on a TRANSFER activity in the timeline
3. Activity Detail modal opens
4. User clicks "Create Workflow" button
5. Spawn Workflow form modal opens (nested)
6. User selects source and destination lifecycle stages
7. User clicks "Create Workflow" button
8. API request is sent to `/api/v1/planning/planned-activities/{id}/spawn-workflow/`
9. On success, user is redirected to Transfer Workflow detail page
10. Toast notification confirms workflow creation

### Flow 4: Filter Activities by KPI Card

1. User navigates to Production Planner page
2. User clicks on "Overdue" KPI card
3. Filters are automatically applied (status=PENDING, overdue=true)
4. Timeline view updates to show only overdue activities
5. User can clear filters by clicking "Clear Filters" button

---

## API Integration

### Data Fetching

Use TanStack Query for all API calls:

```typescript
// Fetch all planned activities for a scenario
const { data: activities, isLoading, isError } = useQuery({
  queryKey: ['planned-activities', scenarioId],
  queryFn: () => ScenarioService.apiV1ScenarioScenariosPlannedActivitiesRetrieve({ id: scenarioId }),
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Fetch batches for dropdown
const { data: batches } = useQuery({
  queryKey: ['batches'],
  queryFn: () => BatchService.apiV1BatchBatchesList(),
});

// Fetch containers for dropdown
const { data: containers } = useQuery({
  queryKey: ['containers'],
  queryFn: () => InfrastructureService.apiV1InfrastructureContainersList(),
});
```

### Mutations

Use TanStack Query mutations for create/update/delete operations:

```typescript
// Create activity
const createMutation = useMutation({
  mutationFn: (data: PlannedActivityFormData) => 
    PlanningService.apiV1PlanningPlannedActivitiesCreate(data),
  onSuccess: () => {
    queryClient.invalidateQueries(['planned-activities', scenarioId]);
    toast.success('Activity created successfully');
  },
});

// Mark as completed
const completeMutation = useMutation({
  mutationFn: (id: number) => 
    PlanningService.apiV1PlanningPlannedActivitiesMarkCompletedCreate({ id }),
  onSuccess: () => {
    queryClient.invalidateQueries(['planned-activities', scenarioId]);
    toast.success('Activity marked as completed');
  },
});

// Spawn workflow
const spawnWorkflowMutation = useMutation({
  mutationFn: ({ id, data }: { id: number; data: SpawnWorkflowData }) => 
    PlanningService.apiV1PlanningPlannedActivitiesSpawnWorkflowCreate({ id, ...data }),
  onSuccess: (workflow) => {
    queryClient.invalidateQueries(['planned-activities', scenarioId]);
    navigate(`/transfer-workflows/${workflow.id}`);
    toast.success('Transfer workflow created');
  },
});
```

---

## State Management

### Global State

Use React Context for global state:

```typescript
interface ProductionPlannerContextValue {
  selectedScenario: number | null;
  setSelectedScenario: (id: number) => void;
  filters: ActivityFilters;
  setFilters: (filters: ActivityFilters) => void;
}

const ProductionPlannerContext = createContext<ProductionPlannerContextValue | null>(null);

export const ProductionPlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const [filters, setFilters] = useState<ActivityFilters>({
    activityTypes: [],
    statuses: [],
    batches: [],
    dateRange: { start: null, end: null },
  });
  
  return (
    <ProductionPlannerContext.Provider value={{ selectedScenario, setSelectedScenario, filters, setFilters }}>
      {children}
    </ProductionPlannerContext.Provider>
  );
};

export const useProductionPlanner = () => {
  const context = useContext(ProductionPlannerContext);
  if (!context) {
    throw new Error('useProductionPlanner must be used within ProductionPlannerProvider');
  }
  return context;
};
```

### Local State

Use `useState` for component-specific state:

```typescript
const [expandedBatches, setExpandedBatches] = useState<number[]>([]);
const [selectedActivity, setSelectedActivity] = useState<PlannedActivity | null>(null);
const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
```

---

## Responsive Design

### Breakpoints

Use Tailwind's responsive prefixes:

- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up

### Mobile Optimizations

**KPI Dashboard**:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Cards */}
</div>
```

**Filters**:
```tsx
<div className="flex flex-col md:flex-row gap-4">
  {/* Filter inputs */}
</div>
```

**Timeline**:
- On mobile, switch to a list view instead of Gantt chart
- Use accordion for batch grouping

```tsx
{isMobile ? (
  <ActivityListView activities={filteredActivities} />
) : (
  <ProductionPlannerTimeline activities={filteredActivities} />
)}
```

**Activity Table**:
- On mobile, use card layout instead of table
- Show only essential fields (type, due date, status)

```tsx
{isMobile ? (
  <div className="space-y-4">
    {activities.map(activity => (
      <Card key={activity.id} className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <Badge>{activity.activity_type_display}</Badge>
            <p className="text-sm text-muted-foreground mt-1">
              {format(new Date(activity.due_date), 'MMM dd, yyyy')}
            </p>
          </div>
          <Badge variant={getStatusBadgeVariant(activity.status)}>
            {activity.status_display}
          </Badge>
        </div>
      </Card>
    ))}
  </div>
) : (
  <Table>
    {/* Table content */}
  </Table>
)}
```

---

## References

1. AquaMind Frontend Architecture - `AquaMind-Frontend/docs/architecture.md`
2. AquaMind Django Integration Guide - `AquaMind-Frontend/docs/DJANGO_INTEGRATION_GUIDE.md`
3. Shadcn/ui Documentation - https://ui.shadcn.com/
4. TanStack Query Documentation - https://tanstack.com/query/latest
5. React Hook Form Documentation - https://react-hook-form.com/
6. Recharts Documentation - https://recharts.org/

---

**End of Document**
