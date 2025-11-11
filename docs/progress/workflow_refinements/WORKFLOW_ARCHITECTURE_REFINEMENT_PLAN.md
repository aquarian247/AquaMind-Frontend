# Workflow Architecture Refinement Plan

**Version**: 1.0  
**Date**: November 11, 2025  
**Status**: DRAFT - Approved for Implementation  
**Scope**: Part A (Immediate Fixes) + Part B (Batch Creation Workflow Architecture)

---

## Executive Summary

This plan refines the Transfer Workflow system based on post-implementation review and extends it to support Batch Creation workflows. It addresses UX issues, removes unused workflow types, and introduces timeline-aware container selection for both transfer and creation operations.

### Key Decisions
- ✅ **Option 2: Parallel Workflow Models** - Separate `BatchCreationWorkflow` from `BatchTransferWorkflow`
- ✅ **Finance Integration**: Use existing `finance` app (no `finance_core` dependency)
- ✅ **Container Selection**: Timeline-aware with occupancy forecasting
- ✅ **Big Bang Rollout**: Replace simple batch creation form entirely

---

## Table of Contents

1. [Part A: Immediate Fixes](#part-a-immediate-fixes)
2. [Part B: Batch Creation Workflow](#part-b-batch-creation-workflow)
3. [Container Selection Improvements](#container-selection-improvements)
4. [Finance Integration](#finance-integration)
5. [Implementation Timeline](#implementation-timeline)
6. [Testing Strategy](#testing-strategy)

---

## Part A: Immediate Fixes

### Fix 1: Make Cancellation Reason Mandatory

**Current State**: Label says "optional" but backend requires it

**Changes Needed**:

**Frontend** (`WorkflowDetailPage.tsx`):
```typescript
// Update label from:
<Label htmlFor="cancel-reason" className="text-sm font-medium">
  Reason for cancellation (optional)
</Label>

// To:
<Label htmlFor="cancel-reason" className="text-sm font-medium">
  Reason for cancellation *
  <span className="text-xs text-muted-foreground ml-2">(Required for compliance)</span>
</Label>

// Add validation:
const handleCancelWorkflow = async () => {
  if (!cancelReason.trim()) {
    toast({
      title: 'Cancellation Reason Required',
      description: 'Please provide a reason for cancelling this workflow',
      variant: 'destructive',
    });
    return;
  }
  // ... existing logic
};
```

**Implementation**:
- File: `client/src/features/batch-management/workflows/pages/WorkflowDetailPage.tsx`
- Lines: ~426 (label), ~137-143 (validation in handler)
- Testing: Attempt to cancel without reason → Shows validation error

---

### Fix 2: Remove PARTIAL_HARVEST Workflow Type

**Rationale**: Harvest operations go directly to factory via tube transfer. No multi-day container-to-container workflow needed. Harvest uses separate `harvest_harvestevent` model.

**Changes Needed**:

**Backend** (`apps/batch/models/workflow.py`):
```python
# Remove from choices:
WORKFLOW_TYPE_CHOICES = [
    ('LIFECYCLE_TRANSITION', 'Lifecycle Stage Transition'),
    ('CONTAINER_REDISTRIBUTION', 'Container Redistribution'),
    ('EMERGENCY_CASCADE', 'Emergency Cascading Transfer'),
    # ('PARTIAL_HARVEST', 'Partial Harvest Preparation'),  # REMOVED
]
```

**Backend Migration**:
```python
# apps/batch/migrations/0024_remove_partial_harvest_type.py
# Add data migration to check if any workflows use PARTIAL_HARVEST
# If yes: Warn and convert to CONTAINER_REDISTRIBUTION or fail
# If no: Safe to remove
```

**Frontend** (`CreateWorkflowWizard.tsx`):
```typescript
// Remove from schema:
workflow_type: z.enum([
  'LIFECYCLE_TRANSITION',
  'CONTAINER_REDISTRIBUTION',
  'EMERGENCY_CASCADE',
  // 'PARTIAL_HARVEST',  // REMOVED
]),

// Remove from dropdown options (lines ~250-261):
<SelectItem value="PARTIAL_HARVEST">
  Partial Harvest Preparation
</SelectItem>
```

**Implementation**:
- Backend file: `AquaMind/apps/batch/models/workflow.py` (line 28-33)
- Frontend file: `client/src/features/batch-management/workflows/components/CreateWorkflowWizard.tsx` (lines 63-67, 259-261)
- Migration: Check for existing PARTIAL_HARVEST workflows first

---

### Fix 3: Document "No Stage Filtering" Decision

**Decision**: Do NOT filter lifecycle stage dropdown in Step 2 based on batch's current stages

**Rationale**:
- Batch can span 2-3 stages simultaneously (rare but possible)
- AddActionsDialog already handles validation perfectly (shows containers with actual fish)
- Step 2 is declarative intent, not strict validation
- Over-filtering adds complexity without benefit

**Action**: Add comment to code + update documentation

---

## Part B: Batch Creation Workflow

### Overview

Batch creation from egg delivery is a multi-week operation requiring:
- Planning: Which trays, when, how many eggs per tray
- Execution: Recording actual deliveries, mortality on arrival, quality scores
- Finance: Tracking costs (internal intercompany or external expense)
- Compliance: Linking to broodstock or supplier provenance

### Architecture: Parallel Workflow Model

**Why Separate from BatchTransferWorkflow?**

| Aspect | Transfer Workflow | Creation Workflow |
|--------|------------------|-------------------|
| **Batch Existence** | Must exist BEFORE workflow | Created BY workflow (or just before) |
| **Source** | `source_assignment` (container with fish) | No source assignment (eggs from external) |
| **Destination** | `dest_assignment` (existing/planned container) | `dest_assignment` (new, Egg/Alevin stage) |
| **Count Semantics** | `transferred_count` (live fish) | `egg_count` (eggs, not yet swimming) |
| **Finance** | Intercompany ONLY (Post-Smolt → Adult) | Intercompany OR Expense |
| **Lifecycle Change** | Often changes stage | Always starts at Egg/Alevin |

**Semantic Difference Is Fundamental** → Separate models are cleaner.

---

### Data Model: `BatchCreationWorkflow`

**File**: `AquaMind/apps/batch/models/workflow_creation.py` (NEW)

```python
"""
BatchCreationWorkflow model for the batch app.

Orchestrates batch creation from egg delivery/transfer over days or weeks.
Creates Batch record on workflow creation to enable action planning.
"""
from decimal import Decimal
from django.db import models, transaction
from django.core.validators import MinValueValidator
from django.utils import timezone
from simple_history.models import HistoricalRecords

from apps.batch.models.batch import Batch
from apps.batch.models.species import LifeCycleStage
from apps.broodstock.models import EggProduction, EggSupplier
from django.contrib.auth.models import User


class BatchCreationWorkflow(models.Model):
    """
    Orchestrates batch creation from egg delivery that may take days/weeks.
    
    Creates Batch record on workflow creation (status: PLANNED).
    Tracks egg delivery actions to destination containers.
    
    State Machine: DRAFT → PLANNED → IN_PROGRESS → COMPLETED / CANCELLED
    """
    
    # Status Choices (State Machine)
    STATUS_CHOICES = [
        ('DRAFT', 'Draft - Planning'),
        ('PLANNED', 'Planned - Ready to Receive'),
        ('IN_PROGRESS', 'In Progress - Receiving Eggs'),
        ('COMPLETED', 'Completed - All Eggs Received'),
        ('CANCELLED', 'Cancelled - Not Executed'),
    ]
    
    # Egg Source Types
    EGG_SOURCE_CHOICES = [
        ('INTERNAL', 'Internal Broodstock'),
        ('EXTERNAL', 'External Supplier'),
    ]
    
    # Identification
    workflow_number = models.CharField(
        max_length=50,
        unique=True,
        help_text="Unique workflow identifier (e.g., CRT-2025-001)"
    )
    batch = models.ForeignKey(
        Batch,
        on_delete=models.PROTECT,
        related_name='creation_workflows',
        help_text="Batch being created (created when workflow created)"
    )
    
    # Egg Source
    egg_source_type = models.CharField(
        max_length=20,
        choices=EGG_SOURCE_CHOICES,
        default='EXTERNAL'
    )
    
    # Internal Source (Broodstock)
    egg_production = models.ForeignKey(
        EggProduction,
        on_delete=models.PROTECT,
        related_name='creation_workflows',
        null=True,
        blank=True,
        help_text="Internal egg production (if egg_source_type=INTERNAL)"
    )
    
    # External Source (Supplier)
    external_supplier = models.ForeignKey(
        EggSupplier,
        on_delete=models.PROTECT,
        related_name='creation_workflows',
        null=True,
        blank=True,
        help_text="External supplier (if egg_source_type=EXTERNAL)"
    )
    external_batch_number = models.CharField(
        max_length=100,
        blank=True,
        help_text="Supplier's batch number"
    )
    external_provenance_data = models.TextField(
        blank=True,
        help_text="Provenance info (source farm, transport, certifications)"
    )
    
    # Finance Tracking (External purchases)
    external_cost_per_thousand = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Cost per 1000 eggs for external purchases"
    )
    external_currency = models.CharField(
        max_length=3,
        blank=True,
        help_text="Currency code (DKK, EUR, NOK, etc.)"
    )
    
    # State Machine
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='DRAFT'
    )
    
    # Timeline
    planned_start_date = models.DateField(
        help_text="Planned start date for egg deliveries"
    )
    planned_completion_date = models.DateField(
        null=True,
        blank=True,
        help_text="Planned completion date for all deliveries"
    )
    actual_start_date = models.DateField(
        null=True,
        blank=True,
        help_text="Date when first delivery was executed"
    )
    actual_completion_date = models.DateField(
        null=True,
        blank=True,
        help_text="Date when last delivery was executed"
    )
    
    # Summary Metrics (Calculated from actions)
    total_eggs_planned = models.PositiveIntegerField(
        default=0,
        help_text="Total eggs planned across all actions"
    )
    total_eggs_received = models.PositiveIntegerField(
        default=0,
        help_text="Total eggs actually received"
    )
    total_mortality_on_arrival = models.PositiveIntegerField(
        default=0,
        help_text="Total eggs DOA (dead on arrival) across deliveries"
    )
    
    # Progress Tracking
    total_actions_planned = models.PositiveIntegerField(
        default=0,
        help_text="Number of delivery actions planned"
    )
    actions_completed = models.PositiveIntegerField(
        default=0,
        help_text="Number of delivery actions completed"
    )
    completion_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[
            MinValueValidator(Decimal('0.00')),
            MaxValueValidator(Decimal('100.00'))
        ],
        help_text="Percentage of actions completed"
    )
    
    # User Attribution
    initiated_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='initiated_creation_workflows',
        help_text="User who created this workflow"
    )
    
    # Notes
    notes = models.TextField(
        blank=True,
        default='',
        help_text="General notes about this batch creation"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # History tracking
    history = HistoricalRecords()
    
    class Meta:
        db_table = 'batch_batchcreationworkflow'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['workflow_number']),
            models.Index(fields=['batch']),
            models.Index(fields=['status']),
            models.Index(fields=['egg_source_type']),
        ]
    
    def __str__(self):
        return f"{self.workflow_number} - {self.batch.batch_number}"
    
    def can_add_actions(self):
        """Check if actions can be added to this workflow."""
        return self.status == 'DRAFT'
    
    def can_plan(self):
        """Check if workflow can be planned."""
        return self.status == 'DRAFT' and self.total_actions_planned > 0
    
    def can_cancel(self):
        """
        Check if workflow can be cancelled.
        Only allow cancellation if NO actions have been executed
        (once eggs arrive physically, they must be managed).
        """
        return self.status in ['DRAFT', 'PLANNED'] and self.actions_completed == 0
    
    def update_progress(self):
        """Update completion percentage based on completed actions."""
        if self.total_actions_planned > 0:
            self.completion_percentage = Decimal(
                (self.actions_completed / self.total_actions_planned) * 100
            )
        else:
            self.completion_percentage = Decimal('0.00')
        self.save(update_fields=['completion_percentage'])
    
    def check_completion(self):
        """Check if all actions are completed and auto-complete workflow."""
        if (self.status == 'IN_PROGRESS' and 
            self.actions_completed >= self.total_actions_planned and
            self.total_actions_planned > 0):
            self.status = 'COMPLETED'
            self.actual_completion_date = timezone.now().date()
            self.batch.status = 'ACTIVE'  # Batch now fully operational
            self.batch.save(update_fields=['status'])
            self.save(update_fields=['status', 'actual_completion_date'])
            
            # Create intercompany transaction if internal source
            if self.egg_source_type == 'INTERNAL':
                self._create_intercompany_transaction()
    
    def _create_intercompany_transaction(self):
        """Create intercompany transaction for internal egg delivery."""
        from apps.finance.services.transfer_finance import TransferFinanceService
        
        try:
            TransferFinanceService.create_egg_delivery_transaction(self)
        except Exception as e:
            # Log error but don't fail workflow completion
            import logging
            logger = logging.getLogger(__name__)
            logger.error(
                f"Failed to create intercompany transaction for workflow {self.id}: {e}"
            )
```

---

### Data Model: `CreationAction`

**File**: `AquaMind/apps/batch/models/workflow_creation_action.py` (NEW)

```python
"""
CreationAction model for batch creation workflows.

Represents individual egg delivery/placement actions within a creation workflow.
Unlike TransferAction, there is NO source_assignment (eggs come from external).
"""
from decimal import Decimal
from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone
from simple_history.models import HistoricalRecords

from apps.batch.models.assignment import BatchContainerAssignment
from apps.batch.models.workflow_creation import BatchCreationWorkflow
from django.contrib.auth.models import User


class CreationAction(models.Model):
    """
    Individual egg delivery/placement action within a batch creation workflow.
    
    Tracks delivery of eggs to destination container (tray/tank).
    NO source_assignment - eggs come from external source or broodstock facility.
    """
    
    # Action Status Choices
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
        ('SKIPPED', 'Skipped'),
    ]
    
    # Transfer Method Choices
    DELIVERY_METHOD_CHOICES = [
        ('TRANSPORT', 'Ground Transport'),
        ('HELICOPTER', 'Helicopter'),
        ('BOAT', 'Boat'),
        ('INTERNAL_TRANSFER', 'Internal Facility Transfer'),
    ]
    
    # Identification
    workflow = models.ForeignKey(
        BatchCreationWorkflow,
        on_delete=models.CASCADE,
        related_name='actions',
        help_text="Parent batch creation workflow"
    )
    action_number = models.PositiveIntegerField(
        help_text="Sequential action number within workflow (1, 2, 3...)"
    )
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDING'
    )
    
    # Destination (only - no source for creation)
    dest_assignment = models.ForeignKey(
        BatchContainerAssignment,
        on_delete=models.PROTECT,
        related_name='creation_actions_as_dest',
        help_text="Destination container assignment (tray/tank)"
    )
    
    # Delivery Details
    egg_count_planned = models.PositiveIntegerField(
        help_text="Number of eggs planned for this delivery"
    )
    egg_count_actual = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Actual number of eggs delivered (if different from planned)"
    )
    mortality_on_arrival = models.PositiveIntegerField(
        default=0,
        help_text="Number of eggs DOA (dead on arrival)"
    )
    
    # Timing
    expected_delivery_date = models.DateField(
        help_text="Expected delivery date for this action"
    )
    actual_delivery_date = models.DateField(
        null=True,
        blank=True,
        help_text="Actual delivery date (when executed)"
    )
    
    # Execution Details
    delivery_method = models.CharField(
        max_length=20,
        choices=DELIVERY_METHOD_CHOICES,
        null=True,
        blank=True,
        help_text="Method of egg delivery"
    )
    water_temp_on_arrival = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Water temperature in destination container (°C)"
    )
    egg_quality_score = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Visual egg quality score on arrival (1=poor, 5=excellent)"
    )
    execution_duration_minutes = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Duration of delivery operation (minutes)"
    )
    
    # User Attribution
    executed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='executed_creation_actions',
        null=True,
        blank=True,
        help_text="User who executed this delivery"
    )
    
    # Notes
    notes = models.TextField(
        blank=True,
        default='',
        help_text="Notes about this delivery (transport conditions, etc.)"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # History tracking
    history = HistoricalRecords()
    
    class Meta:
        db_table = 'batch_creationaction'
        ordering = ['workflow', 'action_number']
        constraints = [
            models.UniqueConstraint(
                fields=['workflow', 'action_number'],
                name='creation_action_workflow_number_uniq'
            )
        ]
        indexes = [
            models.Index(fields=['workflow', 'status']),
            models.Index(fields=['expected_delivery_date']),
        ]
    
    def __str__(self):
        return f"{self.workflow.workflow_number} - Action #{self.action_number}"
    
    @property
    def dest_container_name(self):
        """Helper to get destination container name."""
        return self.dest_assignment.container.name if self.dest_assignment else None
    
    def execute(self, **execution_data):
        """
        Execute this delivery action.
        
        Args:
            mortality_on_arrival: Number of eggs DOA
            delivery_method: How eggs were delivered
            water_temp_on_arrival: Water temperature (°C)
            egg_quality_score: Quality score (1-5)
            execution_duration_minutes: Duration of operation
            notes: Additional notes
        """
        from django.db import transaction as db_transaction
        
        with db_transaction.atomic():
            # Validate
            if self.status not in ['PENDING', 'FAILED']:
                raise ValidationError(
                    f"Cannot execute action in {self.status} status"
                )
            
            # Update action status
            self.status = 'IN_PROGRESS'
            self.actual_delivery_date = timezone.now().date()
            self.executed_by = execution_data.get('executed_by')
            
            # Record execution details
            self.mortality_on_arrival = execution_data.get('mortality_on_arrival', 0)
            self.delivery_method = execution_data.get('delivery_method')
            self.water_temp_on_arrival = execution_data.get('water_temp_on_arrival')
            self.egg_quality_score = execution_data.get('egg_quality_score')
            self.execution_duration_minutes = execution_data.get('execution_duration_minutes')
            self.notes = execution_data.get('notes', '')
            
            # Calculate actual eggs received
            planned_eggs = self.egg_count_planned
            doa = self.mortality_on_arrival
            actual_received = planned_eggs - doa
            self.egg_count_actual = actual_received
            
            # Update destination assignment population
            self.dest_assignment.population_count += actual_received
            self.dest_assignment.is_active = True
            self.dest_assignment.save(update_fields=['population_count', 'is_active'])
            
            # Mark action completed
            self.status = 'COMPLETED'
            self.save()
            
            # Update workflow progress
            self.workflow.actions_completed += 1
            self.workflow.total_eggs_received += actual_received
            self.workflow.total_mortality_on_arrival += doa
            self.workflow.update_progress()
            
            # Update batch status if first action
            if self.workflow.actions_completed == 1:
                self.workflow.status = 'IN_PROGRESS'
                self.workflow.actual_start_date = self.actual_delivery_date
                self.workflow.batch.status = 'RECEIVING'
                self.workflow.batch.save(update_fields=['status'])
                self.workflow.save(update_fields=['status', 'actual_start_date'])
            
            # Check if workflow complete
            self.workflow.check_completion()
```

---

### Batch Status Extensions

**Required New Statuses**:

```python
# In apps/batch/models/batch.py
BATCH_STATUS_CHOICES = [
    ('PLANNED', 'Planned - Awaiting Delivery'),        # NEW
    ('RECEIVING', 'Receiving - Partial Delivery'),     # NEW
    ('ACTIVE', 'Active'),                              # EXISTING
    ('COMPLETED', 'Completed'),                        # EXISTING
    ('TERMINATED', 'Terminated'),                      # EXISTING
    ('CANCELLED', 'Cancelled - Never Delivered'),      # NEW
]
```

**Status Transitions**:
```
PLANNED (workflow created)
  ↓ First action executed
RECEIVING (eggs arriving)
  ↓ All actions completed
ACTIVE (normal operations)
  ↓ Batch lifecycle completes
COMPLETED

OR

PLANNED (no actions executed)
  ↓ Workflow cancelled
CANCELLED (clean cancellation)
```

---

### Lifecycle Stage: Typical Duration

**Extension to `batch.LifeCycleStage`**:

```python
# Add field to existing model:
typical_duration_days = models.PositiveIntegerField(
    null=True,
    blank=True,
    help_text="Typical duration for this stage (days) - used for capacity planning"
)
```

**Seed Data** (Migration or management command):
```python
stages_duration = {
    'Egg/Alevin': 90,    # Combined stage at Bakkafrost
    'Fry': 90,
    'Parr': 90,
    'Smolt': 90,
    'Post-Smolt': 90,
    'Adult': 400,
}
```

---

## Container Selection Improvements

### Problem Statement

Current AddActionsDialog (transfer workflows) only shows **empty containers**. This is insufficient because:

1. **Planners work weeks/months ahead** - containers occupied today will be empty later
2. **Multi-delivery scenarios** - same container receives eggs across multiple days
3. **No visibility** into container occupancy timeline causes planning friction

### Solution: Timeline-Aware Container Selection

**Enhancement Applies To**:
- ✅ `AddActionsDialog` (existing - transfer workflows)
- ✅ `AddCreationActionsDialog` (new - batch creation workflows)

---

### Backend API Enhancement

**New Endpoint**: `GET /api/v1/batch/containers/availability/`

**Purpose**: Return containers with occupancy forecasting for action planning

**Query Parameters**:
- `geography`: Filter by geography ID (required)
- `container_type`: Filter by type (TANK, PEN, TRAY, etc.)
- `lifecycle_stage`: Filter by compatible lifecycle stage
- `delivery_date`: Date when action will execute (for availability calculation)
- `include_occupied`: Boolean (default: true) - include occupied containers

**Response Schema**:
```typescript
{
  count: number;
  results: Array<{
    id: number;
    name: string;
    container_type: string;
    volume_m3: number;
    max_biomass_kg: number;
    
    // Current occupancy
    current_status: 'EMPTY' | 'OCCUPIED';
    current_assignments: Array<{
      batch_id: number;
      batch_number: string;
      population_count: number;
      lifecycle_stage: string;
      assignment_date: string;
      expected_departure_date: string;  // NEW - calculated
    }>;
    
    // Availability forecast (based on delivery_date param)
    availability_status: 'EMPTY' | 'AVAILABLE' | 'OCCUPIED_BUT_OK' | 'CONFLICT';
    days_until_available: number | null;  // Negative if conflict
    availability_message: string;  // Human-readable explanation
    
    // Capacity
    available_capacity_kg: number;  // max_biomass_kg - current_biomass_kg
    available_capacity_percent: number;  // (available / max) * 100
  }>
}
```

**Example Response**:
```json
{
  "count": 4,
  "results": [
    {
      "id": 501,
      "name": "S-FW-24-INC-T01",
      "container_type": "TRAY",
      "volume_m3": 2.5,
      "max_biomass_kg": 50.0,
      "current_status": "EMPTY",
      "current_assignments": [],
      "availability_status": "EMPTY",
      "days_until_available": null,
      "availability_message": "Empty and ready",
      "available_capacity_kg": 50.0,
      "available_capacity_percent": 100.0
    },
    {
      "id": 502,
      "name": "S-FW-24-INC-T02",
      "container_type": "TRAY",
      "volume_m3": 2.5,
      "max_biomass_kg": 50.0,
      "current_status": "OCCUPIED",
      "current_assignments": [
        {
          "batch_id": 207,
          "batch_number": "FT-FI-2024-089",
          "population_count": 132121,
          "lifecycle_stage": "Egg/Alevin",
          "assignment_date": "2025-10-15",
          "expected_departure_date": "2026-01-13"  // 90 days later
        }
      ],
      "availability_status": "AVAILABLE",
      "days_until_available": 18,  // 2026-01-31 - 2026-01-13
      "availability_message": "Available from 2026-01-13 (18 days before your delivery)",
      "available_capacity_kg": 0.0,
      "available_capacity_percent": 0.0
    },
    {
      "id": 503,
      "name": "S-FW-24-INC-T03",
      "container_type": "TRAY",
      "volume_m3": 2.5,
      "max_biomass_kg": 50.0,
      "current_status": "OCCUPIED",
      "current_assignments": [
        {
          "batch_id": 208,
          "batch_number": "FT-FI-2024-090",
          "population_count": 145000,
          "lifecycle_stage": "Egg/Alevin",
          "assignment_date": "2025-11-01",
          "expected_departure_date": "2026-01-30"
        }
      ],
      "availability_status": "CONFLICT",
      "days_until_available": -1,  // 2026-01-31 - 2026-01-30 (conflict!)
      "availability_message": "⚠️ Conflict: Occupied until 2026-01-30 (1 day after your delivery)",
      "available_capacity_kg": 0.0,
      "available_capacity_percent": 0.0
    }
  ]
}
```

**Backend Implementation** (`apps/batch/api/viewsets/containers.py`):

```python
from datetime import timedelta
from rest_framework.decorators import action
from rest_framework.response import Response

class ContainerAvailabilityViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Enhanced container endpoint with occupancy forecasting.
    """
    
    @action(detail=False, methods=['get'])
    def availability(self, request):
        """
        Get containers with availability forecasting.
        """
        geography = request.query_params.get('geography')
        delivery_date_str = request.query_params.get('delivery_date')
        container_type = request.query_params.get('container_type')
        
        if not delivery_date_str:
            delivery_date = timezone.now().date()
        else:
            delivery_date = datetime.strptime(delivery_date_str, '%Y-%m-%d').date()
        
        # Get containers
        containers = Container.objects.filter(
            area__geography_id=geography,
            active=True
        )
        
        if container_type:
            containers = containers.filter(container_type__category=container_type)
        
        # Enrich with availability info
        enriched = []
        for container in containers:
            availability_info = self._calculate_availability(container, delivery_date)
            enriched.append(availability_info)
        
        # Sort by availability priority
        enriched.sort(key=lambda x: x['sort_priority'])
        
        return Response({
            'count': len(enriched),
            'results': enriched
        })
    
    def _calculate_availability(self, container, delivery_date):
        """Calculate container availability for specific delivery date."""
        from apps.batch.models import BatchContainerAssignment
        
        # Get active assignments
        assignments = BatchContainerAssignment.objects.filter(
            container=container,
            is_active=True
        ).select_related('batch', 'lifecycle_stage')
        
        if not assignments.exists():
            # Empty container
            return {
                'id': container.id,
                'name': container.name,
                'container_type': container.container_type.name,
                'current_status': 'EMPTY',
                'current_assignments': [],
                'availability_status': 'EMPTY',
                'days_until_available': None,
                'availability_message': 'Empty and ready',
                'sort_priority': 1,
                'disabled': False,
            }
        
        # Calculate expected departure for each assignment
        assignment_data = []
        latest_departure = None
        
        for assignment in assignments:
            # Get typical stage duration
            duration_days = assignment.lifecycle_stage.typical_duration_days or 90
            expected_departure = assignment.assignment_date + timedelta(days=duration_days)
            
            if assignment.departure_date:
                expected_departure = assignment.departure_date
            
            assignment_data.append({
                'batch_id': assignment.batch.id,
                'batch_number': assignment.batch.batch_number,
                'population_count': assignment.population_count,
                'lifecycle_stage': assignment.lifecycle_stage.name,
                'assignment_date': str(assignment.assignment_date),
                'expected_departure_date': str(expected_departure),
            })
            
            if latest_departure is None or expected_departure > latest_departure:
                latest_departure = expected_departure
        
        # Compare with delivery date
        days_until_available = (latest_departure - delivery_date).days
        
        if days_until_available < 0:
            # Container will be empty before delivery
            availability_status = 'AVAILABLE'
            message = f"Available from {latest_departure} ({abs(days_until_available)} days before your delivery)"
            sort_priority = 2
            disabled = False
        elif days_until_available == 0:
            availability_status = 'OCCUPIED_BUT_OK'
            message = f"Available from {latest_departure} (same day as your delivery)"
            sort_priority = 2
            disabled = False
        else:
            # Container won't be empty in time - CONFLICT
            availability_status = 'CONFLICT'
            message = f"⚠️ Conflict: Occupied until {latest_departure} ({days_until_available} days after your delivery)"
            sort_priority = 3
            disabled = True
        
        return {
            'id': container.id,
            'name': container.name,
            'container_type': container.container_type.name,
            'current_status': 'OCCUPIED',
            'current_assignments': assignment_data,
            'availability_status': availability_status,
            'days_until_available': days_until_available if days_until_available > 0 else None,
            'availability_message': message,
            'sort_priority': sort_priority,
            'disabled': disabled,
        }
```

---

### Frontend: Enhanced Container Dropdown

**Component**: `AddActionsDialog.tsx` (existing) and `AddCreationActionsDialog.tsx` (new)

**Destination Container Select - Rich Labels**:

```tsx
<FormField
  control={form.control}
  name="dest_container"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Destination Container *</FormLabel>
      <Select
        onValueChange={(value) => field.onChange(parseInt(value))}
        value={field.value?.toString() ?? ""}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select destination container" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {enrichedContainers?.map((container) => (
            <SelectItem
              key={container.id}
              value={container.id.toString()}
              disabled={container.disabled}
              className={cn(
                container.availability_status === 'EMPTY' && 'text-green-700',
                container.availability_status === 'AVAILABLE' && 'text-blue-700',
                container.availability_status === 'OCCUPIED_BUT_OK' && 'text-amber-600',
                container.availability_status === 'CONFLICT' && 'text-red-600'
              )}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  {container.availability_status === 'EMPTY' && <span>✅</span>}
                  {container.availability_status === 'AVAILABLE' && <span>⏰</span>}
                  {container.availability_status === 'CONFLICT' && <span>⚠️</span>}
                  <span className="font-medium">{container.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {container.container_type}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {container.availability_message}
                </span>
                {container.current_assignments?.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    Currently: {container.current_assignments[0].batch_number} 
                    ({formatCount(container.current_assignments[0].population_count)})
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormDescription>
        {selectedDeliveryDate 
          ? `Showing availability for ${format(selectedDeliveryDate, 'MMM d, yyyy')}`
          : 'Select delivery date to see container availability'}
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

**Container Availability Hook**:

```typescript
// hooks/useContainerAvailability.ts
export function useContainerAvailability(
  geography: number | undefined,
  deliveryDate: Date | undefined,
  containerType?: string
) {
  return useQuery({
    queryKey: ['container-availability', geography, deliveryDate?.toISOString(), containerType],
    queryFn: async () => {
      if (!geography || !deliveryDate) return null;
      
      const params = new URLSearchParams({
        geography: geography.toString(),
        delivery_date: format(deliveryDate, 'yyyy-MM-dd'),
      });
      
      if (containerType) {
        params.append('container_type', containerType);
      }
      
      const response = await fetch(
        `/api/v1/batch/containers/availability/?${params}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch container availability');
      }
      
      return response.json();
    },
    enabled: !!geography && !!deliveryDate,
  });
}
```

---

### Visual Timeline Component (Optional Enhancement)

**Component**: `ContainerTimelinePreview.tsx`

**Purpose**: Show graphical timeline when hovering over container option

```tsx
export function ContainerTimelinePreview({ 
  container, 
  deliveryDate 
}: { 
  container: EnrichedContainer; 
  deliveryDate: Date;
}) {
  if (container.availability_status === 'EMPTY') {
    return (
      <div className="p-2 text-sm">
        <p className="font-medium text-green-700">✅ Empty Container</p>
        <p className="text-muted-foreground">Ready for immediate use</p>
      </div>
    );
  }
  
  const assignment = container.current_assignments[0];
  const assignmentStart = new Date(assignment.assignment_date);
  const expectedDeparture = new Date(assignment.expected_departure_date);
  const deliveryDay = deliveryDate;
  
  return (
    <div className="p-3 space-y-2 min-w-[300px]">
      <p className="font-medium text-sm">Occupancy Timeline</p>
      
      {/* Timeline bars */}
      <div className="relative h-16 bg-muted rounded">
        {/* Current occupancy bar */}
        <div 
          className="absolute top-0 h-8 bg-blue-500 rounded-t"
          style={{
            left: '0%',
            width: calculateTimelineWidth(assignmentStart, expectedDeparture, deliveryDay)
          }}
        >
          <span className="text-xs text-white px-2">
            {assignment.batch_number}
          </span>
        </div>
        
        {/* Delivery marker */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-green-600"
          style={{ left: '80%' }}
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap">
            Your Delivery
          </div>
        </div>
      </div>
      
      {/* Timeline labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{format(assignmentStart, 'MMM d')}</span>
        <span>{format(expectedDeparture, 'MMM d')}</span>
        <span>{format(deliveryDay, 'MMM d')}</span>
      </div>
      
      {/* Status message */}
      <p className={cn(
        "text-sm font-medium",
        container.availability_status === 'AVAILABLE' && "text-green-700",
        container.availability_status === 'CONFLICT' && "text-red-700"
      )}>
        {container.availability_message}
      </p>
    </div>
  );
}
```

---

## Finance Integration

### Internal Eggs (Broodstock → Freshwater)

**Use Existing `IntercompanyPolicy` and `IntercompanyTransaction`**:

1. **Add Pricing Basis** (Backend):
```python
# apps/finance/models.py - IntercompanyPolicy.PricingBasis
class PricingBasis(models.TextChoices):
    GRADE = "grade", "Product Grade (Harvest)"
    LIFECYCLE = "lifecycle", "Lifecycle Stage (Transfer)"
    EGG_DELIVERY = "egg_delivery", "Egg Delivery (Creation)"  # NEW
```

2. **Add Price Per Thousand Eggs Field**:
```python
# apps/finance/models.py - IntercompanyPolicy
price_per_thousand_eggs = models.DecimalField(
    max_digits=10,
    decimal_places=2,
    null=True,
    blank=True,
    help_text="Price per 1000 eggs for EGG_DELIVERY basis"
)
```

3. **Update Validation**:
```python
def _validate_pricing_basis(self):
    """Validate pricing_basis field consistency."""
    if self.pricing_basis == self.PricingBasis.EGG_DELIVERY:
        if not self.price_per_thousand_eggs:
            raise ValidationError({
                'price_per_thousand_eggs': 
                'Required for EGG_DELIVERY pricing basis'
            })
```

4. **Transaction Creation** (in `TransferFinanceService`):
```python
@staticmethod
def create_egg_delivery_transaction(creation_workflow):
    """
    Create intercompany transaction for internal egg delivery.
    
    Called when BatchCreationWorkflow completes.
    """
    # Get policy
    policy = IntercompanyPolicy.objects.get(
        from_company=broodstock_company,
        to_company=freshwater_company,
        pricing_basis='EGG_DELIVERY'
    )
    
    # Calculate amount
    total_eggs = creation_workflow.total_eggs_received
    price_per_thousand = policy.price_per_thousand_eggs
    amount = (total_eggs / 1000) * price_per_thousand
    
    # Create transaction
    IntercompanyTransaction.objects.create(
        content_type=ContentType.objects.get_for_model(creation_workflow),
        object_id=creation_workflow.id,
        policy=policy,
        amount=amount,
        currency=policy.from_company.currency,
        posting_date=creation_workflow.actual_completion_date,
        state='PENDING'  # Awaits manager approval
    )
```

---

### External Eggs (Supplier → Freshwater)

**Simple Expense Tracking** (No IntercompanyTransaction):

```python
# On BatchCreationWorkflow model:
external_cost_per_thousand = DecimalField(...)  # €150.00 per 1000 eggs
external_currency = CharField(...)  # EUR, NOK, etc.

# Finance reporting:
total_cost = (workflow.total_eggs_received / 1000) * workflow.external_cost_per_thousand

# Exported to NAV as expense (manual process until finance_core ready)
```

**Interim Reporting**:
- Finance Manager exports workflow data: `GET /api/v1/batch/creation-workflows/?egg_source_type=EXTERNAL`
- Calculates total costs in Excel
- When `finance_core` ready: Auto-allocate to Cost Centers

---

## UI Flows

### Workflow 1: Create Batch Creation Workflow (Freshwater Manager)

**Entry Point**: `/batch-setup` page → "Create Batch with Workflow" button

**Wizard Steps**:

#### Step 1: Basic Information
```
Create Batch Creation Workflow

Step 1 of 3: Basic Information
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[1] ━━━━ [2]      [3]

Batch Number: *
[FT-FI-2026-042___]
Auto-suggest format based on geography

Species: *
[Atlantic Salmon ▼]

Expected Total Eggs: *
[3,200,000______]

Planned Start Date: *
[📅 January 15, 2026]

Planned Completion Date:
[📅 February 5, 2026____] (Optional)

                 [Cancel]  [Next →]
```

#### Step 2: Egg Source
```
Step 2 of 3: Egg Source
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[1] ━━━━ [2] ━━━━ [3]

Egg Source Type: *
( ) Internal Broodstock
(●) External Supplier

─────────────────────────────────────
External Supplier Section:

Supplier: *
[AquaGen Norway_______________▼]

Supplier Batch Number:
[AG-2026-024_________________]

Cost per 1000 Eggs: *
[150.00____] Currency: [NOK ▼]

Provenance Data:
[Source: AquaGen Hatchery, Norway
Transport: Refrigerated truck
Certifications: ASC, GlobalGAP___]

─────────────────────────────────────

              [← Previous]  [Next →]
```

**If Internal Broodstock Selected**:
```
─────────────────────────────────────
Internal Broodstock Section:

Egg Production Batch: *
[EB-2025-089 (500K eggs, Pair P456, Dec 15) ▼]

Estimated Value: 25,000 NOK
(Auto-calculated from intercompany policy)

ℹ️ Intercompany Transaction
This will create a finance transaction from 
Broodstock → Freshwater when workflow completes.

─────────────────────────────────────
```

#### Step 3: Review & Create
```
Step 3 of 3: Review & Create
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[1] ━━━━ [2] ━━━━ [3]

Workflow Summary
─────────────────────────────────────
Batch: FT-FI-2026-042 (Atlantic Salmon)
Expected Eggs: 3,200,000
Source: External - AquaGen Norway
Cost: 480,000 NOK (150.00 NOK per 1000)
Timeline: Jan 15 - Feb 5, 2026 (21 days)

Next Steps After Creation:
1. Add delivery actions (containers + dates)
2. Plan workflow (validate capacity)
3. Execute actions as deliveries arrive

─────────────────────────────────────

              [← Previous]  [Create Workflow →]
```

---

### Workflow 2: Add Delivery Actions (Freshwater Manager)

**Entry Point**: Workflow detail page → "Add Actions" button

**Dialog**: `AddCreationActionsDialog`

```
Add Delivery Actions to CRT-2026-042
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Delivery Date: *
[📅 January 15, 2026_____]

Destination Container: *
┌─────────────────────────────────────────────────────────┐
│ ✅ S-FW-24-INC-T01 (Tray)                               │
│    Empty and ready                                      │
│                                                          │
│ ⏰ S-FW-24-INC-T02 (Tray)                              │
│    Available from 2026-01-13 (2 days before delivery)   │
│    Currently: Batch FT-FI-2024-089 (132K eggs)         │
│                                                          │
│ ⏰ S-FW-24-INC-T03 (Tray)                              │
│    Available from 2026-01-10 (5 days before delivery)   │
│    Currently: Batch FT-FI-2024-090 (145K eggs)         │
│                                                          │
│ ⚠️ S-FW-24-INC-T04 (Tray) - OCCUPIED                   │
│    Conflict: Occupied until Jan 30 (15 days AFTER)     │
│    (Cannot select - still occupied at delivery time)    │
└─────────────────────────────────────────────────────────┘

Egg Count: *
[150,000_____]

Notes (Optional):
[First delivery - main hatchery shipment__]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Actions to Add: 1
Total Eggs: 150,000

                        [Cancel]  [Add Action ✓]
                             [Add Another & Continue →]
```

**After Adding 5 Actions**:
```
Current Actions: 5 added

#  | Date       | Container  | Eggs    | Status
1  | Jan 15     | T01       | 150K    | ✓ Added
2  | Jan 15     | T02       | 152K    | ✓ Added
3  | Jan 16     | T03       | 148K    | ✓ Added
4  | Jan 16     | T04       | 151K    | ✓ Added
5  | Jan 17     | T05       | 149K    | ✓ Added

Total: 750,000 eggs (23% of planned 3.2M)

                    [Done]  [Add More Actions →]
```

---

### Workflow 3: Execute Delivery Action (Freshwater Operator - Mobile)

**Entry Point**: Workflow detail page → Action list → "Execute" button

**Dialog**: `ExecuteCreationActionDialog`

```
Execute Delivery Action #1
Workflow: CRT-2026-042
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌──────────────────────────────────────┐
│ DELIVERY DETAILS                     │
│                                      │
│ Destination: S-FW-24-INC-T01 (Tray) │
│ Planned: 150,000 eggs               │
│ Expected: January 15, 2026          │
└──────────────────────────────────────┘

Actual Egg Count (if different):
[150,000_____] (Auto-filled with planned count)

Mortality on Arrival (DOA):
[500_________] eggs

Delivery Method: *
[Ground Transport ▼]
Options: Transport, Helicopter, Boat, Internal

Water Temperature on Arrival:
[8.5°C_______]

Egg Quality Score (1-5): *
[4___] ⭐⭐⭐⭐☆
1=Poor, 3=Average, 5=Excellent

Duration:
[45__] minutes

Notes (Optional):
[Good transport conditions, minimal 
temperature fluctuation_____________]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Actual eggs received: 149,500
(150,000 planned - 500 DOA)

                [Cancel]  [Execute Delivery ✓]
```

---

## Batch Creation Workflow API Specification

### Endpoints

**Workflows**:
```
POST   /api/v1/batch/creation-workflows/              Create workflow
GET    /api/v1/batch/creation-workflows/              List workflows
GET    /api/v1/batch/creation-workflows/{id}/         Get workflow detail
PATCH  /api/v1/batch/creation-workflows/{id}/         Update workflow
DELETE /api/v1/batch/creation-workflows/{id}/         Delete workflow (DRAFT only)

POST   /api/v1/batch/creation-workflows/{id}/plan/    Plan workflow (DRAFT → PLANNED)
POST   /api/v1/batch/creation-workflows/{id}/cancel/  Cancel workflow (if no actions executed)
```

**Actions**:
```
POST   /api/v1/batch/creation-actions/                Create action
GET    /api/v1/batch/creation-actions/                List actions
GET    /api/v1/batch/creation-actions/{id}/           Get action detail
PATCH  /api/v1/batch/creation-actions/{id}/           Update action (PENDING only)
DELETE /api/v1/batch/creation-actions/{id}/           Delete action (PENDING only)

POST   /api/v1/batch/creation-actions/{id}/execute/   Execute delivery
POST   /api/v1/batch/creation-actions/{id}/skip/      Skip action
```

**Container Availability** (Enhanced):
```
GET    /api/v1/batch/containers/availability/         Get containers with timeline forecast
```

### Workflow Creation Request

```json
{
  "batch_number": "FT-FI-2026-042",
  "species": 1,
  "egg_source_type": "EXTERNAL",
  "external_supplier": 5,
  "external_batch_number": "AG-2026-024",
  "external_provenance_data": "Source: AquaGen Hatchery, Norway\nTransport: Refrigerated",
  "external_cost_per_thousand": "150.00",
  "external_currency": "NOK",
  "total_eggs_planned": 3200000,
  "planned_start_date": "2026-01-15",
  "planned_completion_date": "2026-02-05",
  "notes": "Main batch for Q1 2026 production"
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "workflow_number": "CRT-2026-042",
  "batch": {
    "id": 301,
    "batch_number": "FT-FI-2026-042",
    "species_name": "Atlantic Salmon",
    "status": "PLANNED"
  },
  "egg_source_type": "EXTERNAL",
  "external_supplier_name": "AquaGen Norway",
  "total_eggs_planned": 3200000,
  "estimated_cost": "480000.00",
  "status": "DRAFT",
  "actions_count": 0,
  "completion_percentage": "0.00"
}
```

### Action Creation Request

```json
{
  "workflow": 1,
  "dest_container": 501,
  "egg_count_planned": 150000,
  "expected_delivery_date": "2026-01-15",
  "notes": "First delivery - Tray T01"
}
```

**Backend Logic** (in serializer):
```python
def create(self, validated_data):
    workflow = validated_data['workflow']
    container = validated_data['dest_container']
    
    # Get or create destination assignment
    dest_assignment, created = BatchContainerAssignment.objects.get_or_create(
        batch=workflow.batch,
        container=container,
        lifecycle_stage=workflow.batch.lifecycle_stage,  # Egg/Alevin
        defaults={
            'population_count': 0,
            'biomass_kg': Decimal('0.00'),
            'assignment_date': workflow.planned_start_date,
            'is_active': False,  # Activated on first execution
        }
    )
    
    # Validate: Prevent mixed batches
    other_assignments = BatchContainerAssignment.objects.filter(
        container=container,
        is_active=True
    ).exclude(batch=workflow.batch)
    
    if other_assignments.exists():
        # Check timing
        for other in other_assignments:
            expected_departure = self._calculate_expected_departure(other)
            delivery_date = validated_data['expected_delivery_date']
            
            if delivery_date <= expected_departure:
                raise ValidationError({
                    'dest_container': 
                    f"Container {container.name} will still contain "
                    f"{other.batch.batch_number} on {delivery_date}. "
                    f"Expected empty: {expected_departure}. "
                    f"This would create an unintended mixed batch."
                })
    
    # Calculate next action number
    max_action = workflow.actions.aggregate(Max('action_number'))['action_number__max']
    next_action_number = (max_action or 0) + 1
    
    # Create action
    action = CreationAction.objects.create(
        workflow=workflow,
        action_number=next_action_number,
        dest_assignment=dest_assignment,
        **validated_data
    )
    
    # Update workflow totals
    workflow.total_actions_planned += 1
    workflow.total_eggs_planned += validated_data['egg_count_planned']
    workflow.save(update_fields=['total_actions_planned', 'total_eggs_planned'])
    
    return action
```

---

## Changes to Existing Transfer Workflow Components

### AddActionsDialog.tsx Enhancement

**Current State**: Only shows empty containers in destination dropdown

**Enhancement**: Use timeline-aware availability endpoint

**Changes Needed**:

1. **Replace container fetch**:
```typescript
// OLD:
const { data: containersData } = useQuery({
  queryKey: ['containers', geography],
  queryFn: () => ApiService.apiV1InfrastructureContainersList({ 
    geography,
    is_active: true 
  }),
});

// NEW:
const { data: containersData } = useContainerAvailability(
  geography,
  selectedDeliveryDate,  // From form
  'TANK'  // Or 'PEN' for sea transfers
);

// Filter to show only destination-compatible containers
const destContainers = containersData?.results?.filter(
  c => c.availability_status !== 'CONFLICT'  // Allow EMPTY, AVAILABLE, OCCUPIED_BUT_OK
);
```

2. **Update dropdown rendering** (same rich labels as creation dialog)

3. **Add delivery date field** (if not already present):
```typescript
<FormField
  control={form.control}
  name="expected_execution_date"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Expected Execution Date *</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button variant="outline" className="w-full">
              {field.value ? format(field.value, 'PPP') : 'Pick date'}
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
            disabled={(date) => date < workflow.planned_start_date}
          />
        </PopoverContent>
      </Popover>
      <FormDescription>
        When will this transfer be executed?
      </FormDescription>
    </FormItem>
  )}
/>
```

**Files to Modify**:
- `client/src/features/batch-management/workflows/components/AddActionsDialog.tsx`
- Add hook: `client/src/features/batch-management/workflows/hooks/useContainerAvailability.ts`

---

## Implementation Timeline

### Phase 1: Immediate Fixes (Part A) - 2 Hours

**Tasks**:
1. ✅ Make cancellation reason mandatory (frontend validation)
2. ✅ Remove PARTIAL_HARVEST from backend choices
3. ✅ Remove PARTIAL_HARVEST from frontend dropdown
4. ✅ Create backend migration (check for existing PARTIAL_HARVEST workflows)
5. ✅ Update documentation
6. ✅ Test workflow creation and cancellation

**Files**:
- Backend: `apps/batch/models/workflow.py`, migration
- Frontend: `CreateWorkflowWizard.tsx`, `WorkflowDetailPage.tsx`

---

### Phase 2: Container Availability Backend - 1 Day

**Tasks**:
1. Add `typical_duration_days` to `LifeCycleStage` model
2. Create migration, seed with durations
3. Add `expected_departure_date` property to `BatchContainerAssignment`
4. Create `ContainerAvailabilityViewSet` with `/availability/` endpoint
5. Write tests for availability calculation logic
6. Update OpenAPI spec

**Files**:
- Backend: `apps/batch/models/species.py`, `apps/batch/models/assignment.py`
- Backend: `apps/batch/api/viewsets/containers.py` (new)
- Tests: `apps/batch/tests/test_container_availability.py`

---

### Phase 3: Transfer Workflow Enhancement - 1 Day

**Tasks**:
1. Create `useContainerAvailability` hook
2. Update `AddActionsDialog` to use availability endpoint
3. Add delivery date field to action form
4. Implement rich container labels with availability
5. Add visual indicators (✅ ⏰ ⚠️)
6. Test with occupied containers

**Files**:
- Frontend: `hooks/useContainerAvailability.ts`
- Frontend: `AddActionsDialog.tsx`
- Frontend: `utils/container-availability.ts` (formatting helpers)

---

### Phase 4: Batch Creation Backend - 3 Days

**Tasks**:
1. Create `BatchCreationWorkflow` model
2. Create `CreationAction` model
3. Create migrations
4. Implement serializers
5. Implement ViewSets with custom actions
6. Add workflow number generation (CRT-2026-XXX)
7. Create batch on workflow creation (with proper status)
8. Implement cancellation logic (prevent if actions executed)
9. Link broodstock_batchparentage
10. Write comprehensive tests

**Files**:
- Backend: `apps/batch/models/workflow_creation.py`
- Backend: `apps/batch/models/workflow_creation_action.py`
- Backend: `apps/batch/api/serializers/workflow_creation.py`
- Backend: `apps/batch/api/viewsets/workflow_creation.py`
- Tests: `apps/batch/tests/test_creation_workflow.py`

---

### Phase 5: Finance Integration - 1 Day

**Tasks**:
1. Add `EGG_DELIVERY` pricing basis to `IntercompanyPolicy`
2. Add `price_per_thousand_eggs` field
3. Update policy validation
4. Extend `TransferFinanceService` with egg delivery transaction creation
5. Test internal egg delivery finance flow
6. Update admin interface

**Files**:
- Backend: `apps/finance/models.py`
- Backend: `apps/finance/services/transfer_finance.py`
- Migration: `apps/finance/migrations/0006_egg_delivery_pricing.py`

---

### Phase 6: Batch Creation Frontend - 4 Days

**Tasks**:
1. Create `CreateBatchCreationWizard` component (3-step)
2. Create `AddCreationActionsDialog` component (with availability)
3. Create `ExecuteCreationActionDialog` component
4. Create `CreationWorkflowDetailPage` component
5. Create `CreationWorkflowListPage` component
6. Add routes for creation workflows
7. Replace `/batch-setup` simple form with workflow wizard
8. Implement egg source selector (internal vs external)
9. Add supplier and broodstock dropdowns
10. Test complete flow end-to-end

**Files**:
- Frontend: `features/batch-management/batch-creation/` (new directory)
  - `components/CreateBatchCreationWizard.tsx`
  - `components/AddCreationActionsDialog.tsx`
  - `components/ExecuteCreationActionDialog.tsx`
  - `pages/CreationWorkflowDetailPage.tsx`
  - `pages/CreationWorkflowListPage.tsx`
  - `api.ts` (TanStack Query hooks)
  - `utils.ts` (formatting helpers)

---

### Phase 7: Integration & Testing - 2 Days

**Tasks**:
1. Integration testing (create workflow → add actions → plan → execute → complete)
2. Test finance transaction creation (internal eggs)
3. Test broodstock linkage (batchparentage)
4. Test cancellation logic (before/after execution)
5. Test mixed batch prevention
6. Test container availability across timezones
7. User acceptance testing with freshwater manager persona
8. Performance testing (3M eggs across 42 actions)

---

### Total Timeline: **12 Days** (~2.5 Weeks)

| Phase | Duration | Effort | Dependencies |
|-------|----------|--------|--------------|
| Phase 1: Immediate Fixes | 2 hours | 0.25 days | None |
| Phase 2: Availability Backend | 1 day | 1 day | Phase 1 |
| Phase 3: Transfer Enhancement | 1 day | 1 day | Phase 2 |
| Phase 4: Creation Backend | 3 days | 3 days | Phase 2 |
| Phase 5: Finance Integration | 1 day | 1 day | Phase 4 |
| Phase 6: Creation Frontend | 4 days | 4 days | Phase 4, 5 |
| Phase 7: Testing | 2 days | 2 days | All above |

**Parallel Work Opportunities**:
- Phases 2 & 4 can partially overlap (both backend)
- Phases 3 & 6 can partially overlap (both frontend, different features)

**Realistic Timeline**: 10-12 business days (2-2.5 weeks)

---

## Testing Strategy

### Unit Tests

**Backend**:
- `test_workflow_creation_model.py`: Batch creation on workflow creation, status transitions, cancellation logic
- `test_creation_action_model.py`: Action execution, population updates, DOA tracking
- `test_creation_workflow_api.py`: CRUD endpoints, custom actions, filtering
- `test_container_availability.py`: Availability calculation, timeline logic, conflict detection

**Frontend**:
- `CreateBatchCreationWizard.test.tsx`: Wizard navigation, form validation, submission
- `AddCreationActionsDialog.test.tsx`: Action creation, container selection, validation
- `ExecuteCreationActionDialog.test.tsx`: Execution, mortality tracking, quality scores
- `useContainerAvailability.test.ts`: Hook logic, date calculations, error handling

---

### Integration Tests

**End-to-End Scenarios**:

1. **Complete Creation Workflow**:
   - Create workflow (external eggs)
   - Add 10 actions across 5 days
   - Plan workflow
   - Execute all actions
   - Verify batch status: PLANNED → RECEIVING → ACTIVE
   - Verify final population count matches (planned - DOA)

2. **Internal Egg Delivery**:
   - Create workflow (internal broodstock)
   - Link to egg_production
   - Complete workflow
   - Verify intercompany transaction created (PENDING)
   - Verify broodstock_batchparentage link

3. **Cancellation Scenarios**:
   - Cancel before any actions → Batch status: CANCELLED ✅
   - Attempt cancel after 1 action → Validation error ❌

4. **Container Availability**:
   - Request availability for future date
   - Verify occupied containers show expected departure
   - Verify conflicts are disabled
   - Verify multiple actions to same container allowed (same batch)

---

## Migration Strategy

### Backend Migrations (Sequence)

1. **0024_add_lifecycle_stage_duration**
   - Add `typical_duration_days` to `LifeCycleStage`
   - Seed with Bakkafrost durations (Egg/Alevin: 90, Fry: 90, etc.)

2. **0025_remove_partial_harvest**
   - Check for existing PARTIAL_HARVEST workflows
   - If found: Fail with instructions to migrate manually
   - If none: Remove from WORKFLOW_TYPE_CHOICES

3. **0026_batch_creation_workflow**
   - Create `batch_batchcreationworkflow` table
   - Create `batch_creationaction` table
   - Add new batch statuses (PLANNED, RECEIVING, CANCELLED)

4. **0027_batch_status_data_migration**
   - Backfill existing batches: null → 'ACTIVE' (safe default)

**Finance App Migration**:

5. **finance/0006_egg_delivery_pricing**
   - Add `EGG_DELIVERY` to `IntercompanyPolicy.PricingBasis`
   - Add `price_per_thousand_eggs` field

---

### Frontend Updates

1. **API Client Regeneration**:
```bash
# After backend migrations deployed
cd client
npm run generate:api
# Verify new services: BatchCreationWorkflowService, CreationActionService
```

2. **Route Updates** (`client/src/router/index.tsx`):
```typescript
// Add routes:
<Route path="/batch-creation-workflows" component={CreationWorkflowListPage} />
<Route path="/batch-creation-workflows/:id" component={CreationWorkflowDetailPage} />

// Replace batch setup:
<Route path="/batch-setup" component={CreateBatchCreationWizard} />
```

---

## Key Design Patterns

### Pattern 1: Get-or-Create Assignment Strategy

**Problem**: Multiple actions can target the same container (spread deliveries over days)

**Solution**: When adding action, get-or-create assignment:
```python
dest_assignment, created = BatchContainerAssignment.objects.get_or_create(
    batch=workflow.batch,
    container=selected_container,
    lifecycle_stage=egg_alevin_stage,
    defaults={
        'population_count': 0,
        'assignment_date': workflow.planned_start_date,
        'is_active': False,
    }
)

# Multiple actions can reference same assignment
# Population incremented on each execution
```

**Benefits**:
- ✅ Supports multi-delivery to same tray (your Action 8 & 13 example)
- ✅ No duplicate assignments
- ✅ Clean data model (one assignment per batch+container pair)

---

### Pattern 2: Timeline-Based Validation

**Problem**: Need to plan months ahead, but containers are occupied today

**Solution**: Calculate `expected_departure_date` and compare with `expected_delivery_date`:

```python
def validate_container_availability(container, delivery_date, batch):
    """
    Validate container will be available for delivery.
    Prevents accidental mixed batches but allows future planning.
    """
    active_assignments = container.container_assignments.filter(
        is_active=True
    ).exclude(batch=batch)  # Same batch is OK
    
    for assignment in active_assignments:
        expected_departure = calculate_expected_departure(assignment)
        
        # Check for conflict
        if delivery_date < expected_departure:
            days_conflict = (expected_departure - delivery_date).days
            raise ValidationError(
                f"Container timing conflict: {container.name} occupied by "
                f"{assignment.batch.batch_number} until {expected_departure}. "
                f"Your delivery ({delivery_date}) is {days_conflict} days too early. "
                f"Options: 1) Choose different container, 2) Delay delivery date"
            )
    
    return True  # Available or will be available
```

---

### Pattern 3: Mixed Batch Prevention

**Current Gap**: No validation prevents accidentally mixing batches

**Solution**: Validate on action creation (both transfer and creation):

```python
def validate_no_mixed_batch(dest_container, dest_batch):
    """Prevent accidental mixed batches."""
    other_batches = BatchContainerAssignment.objects.filter(
        container=dest_container,
        is_active=True
    ).exclude(batch=dest_batch).exists()
    
    if other_batches:
        raise ValidationError(
            f"Container {dest_container.name} already contains a different batch. "
            f"Mixed batches should be created explicitly via Batch Composition, "
            f"not accidentally through transfers."
        )
```

**When to Apply**:
- ✅ Transfer workflows: Check destination container
- ✅ Creation workflows: Check destination container (with timeline)
- ❌ Batch composition feature: Explicitly allowed (different API)

---

## UX Improvements Summary

### Before (Current State)

**Transfer Action Creation**:
```
Destination Container:
[Empty containers only_________▼]

- If container is occupied: Not shown
- Planner doesn't know WHY it's missing
- Can't plan ahead (must wait for containers to empty)
- No visibility into future availability
```

**Batch Creation**:
```
Simple Form:
- Fill fields
- Click Create
- Batch appears immediately

No multi-day planning
No delivery tracking
No finance integration
```

---

### After (Enhanced State)

**Transfer Action Creation**:
```
Execution Date: [📅 January 31, 2026__]

Destination Container:
┌─────────────────────────────────────────────────────────┐
│ ✅ Tank A-15 - Empty now                                │
│                                                          │
│ ⏰ Tank A-16 - Available from Jan 13                   │
│    Currently: Batch X (500K fish), 18 days buffer       │
│                                                          │
│ ⚠️ Tank A-17 - Occupied until Feb 10                   │
│    Conflict: Still occupied 10 days after execution!    │
│    (DISABLED)                                            │
└─────────────────────────────────────────────────────────┘

- All containers shown (not just empty)
- Clear availability status with timeline context
- Conflicts automatically disabled
- Planner can confidently select "occupied" containers
```

**Batch Creation**:
```
Workflow-Based Creation:
1. Create workflow (3-step wizard)
   - Batch created (status: PLANNED)
   - Link to broodstock or supplier
   - Finance tracking configured

2. Add 42 delivery actions
   - Timeline-aware container selection
   - Spread across 3 weeks
   - Multiple deliveries to same trays OK

3. Execute actions over time
   - Mobile-friendly execution dialogs
   - Track DOA, quality scores
   - Progress tracking: 15/42 actions (36%)

4. Auto-complete on last action
   - Batch status: RECEIVING → ACTIVE
   - Finance transaction created (if internal)
   - Compliance audit trail complete
```

---

## Risk Assessment

### Risk 1: Container Availability Calculation Accuracy

**Risk**: Expected departure calculation may be inaccurate if lifecycle durations vary

**Mitigation**:
- Use conservative estimates (typical duration + buffer)
- Allow planners to override (manual review)
- Show as "estimate" in UI (not guaranteed)
- Operators can still manually manage conflicts

**Severity**: Low (informational tool, not strict enforcement)

---

### Risk 2: Mixed Batch Validation Too Strict

**Risk**: Hard validation might block legitimate operations

**Mitigation**:
- Document "how to create mixed batches" (use Batch Composition API)
- Provide clear error messages with guidance
- Admin override capability (if needed)

**Severity**: Low (rare operation, documented workaround)

---

### Risk 3: Finance Integration Complexity

**Risk**: Egg delivery pricing might not match existing patterns

**Mitigation**:
- Reuse proven IntercompanyPolicy architecture
- Add specialized pricing basis (EGG_DELIVERY)
- External eggs: Simple expense tracking (no complex finance)
- Finance Manager can adjust costs via workflow edit

**Severity**: Medium (needs careful testing)

---

### Risk 4: Migration Coordination

**Risk**: Backend and frontend must deploy together (breaking changes)

**Mitigation**:
- Deploy backend first (new endpoints, no breaking changes)
- Deploy frontend second (uses new endpoints)
- Feature flag: Enable batch creation workflow in phases
- Rollback plan: Revert frontend, backend remains (no data corruption)

**Severity**: Low (standard deployment process)

---

## Success Criteria

### Part A (Immediate Fixes)
- ✅ Cancellation requires reason (validation works)
- ✅ PARTIAL_HARVEST removed from all dropdowns
- ✅ No PARTIAL_HARVEST workflows exist in database
- ✅ Documentation updated
- ✅ Tests pass

### Part B (Batch Creation)
- ✅ Freshwater Manager can create batch creation workflow
- ✅ Can add 42+ delivery actions with timeline-aware selection
- ✅ Occupied containers show availability forecast
- ✅ Conflicts are disabled automatically
- ✅ Actions execute on mobile devices
- ✅ Progress tracking works (15/42, 36%)
- ✅ Finance transaction created for internal eggs
- ✅ Broodstock linkage preserved
- ✅ Cancellation prevents after execution starts
- ✅ All tests pass (>85% coverage)

### Container Enhancement
- ✅ AddActionsDialog shows occupied containers with availability
- ✅ Timeline calculations accurate (tested with various dates)
- ✅ UX clear and intuitive (validated with user persona)
- ✅ Performance acceptable (<2s for 100+ containers)

---

## Appendix A: API Request Examples

### Create External Egg Workflow

```bash
POST /api/v1/batch/creation-workflows/
Content-Type: application/json

{
  "batch_number": "FT-FI-2026-042",
  "species": 1,
  "egg_source_type": "EXTERNAL",
  "external_supplier": 5,
  "external_batch_number": "AG-2026-024",
  "external_cost_per_thousand": "150.00",
  "external_currency": "NOK",
  "total_eggs_planned": 3200000,
  "planned_start_date": "2026-01-15",
  "notes": "Main Q1 2026 batch"
}
```

### Add Creation Action

```bash
POST /api/v1/batch/creation-actions/
Content-Type: application/json

{
  "workflow": 1,
  "dest_container": 501,
  "egg_count_planned": 150000,
  "expected_delivery_date": "2026-01-15",
  "notes": "First delivery - Tray T01"
}
```

### Execute Creation Action

```bash
POST /api/v1/batch/creation-actions/42/execute/
Content-Type: application/json

{
  "mortality_on_arrival": 500,
  "delivery_method": "TRANSPORT",
  "water_temp_on_arrival": "8.5",
  "egg_quality_score": 4,
  "execution_duration_minutes": 45,
  "notes": "Good conditions, minimal temperature fluctuation"
}
```

---

## Appendix B: User Persona Alignment

### Oversight Manager of All Freshwater Stations

**Needs** (from personas.md):
- ✅ Efficient container utilization planning
- ✅ Minimize mortality through quality tracking
- ✅ Real-time visibility into receiving operations
- ✅ Integration with broodstock data

**Workflow System Addresses**:
- ✅ Timeline-aware planning (see future availability)
- ✅ Quality scoring (egg_quality_score tracking)
- ✅ Progress dashboards (42 deliveries, 36% complete)
- ✅ Broodstock linkage (egg_production FK)

---

### Freshwater Station Operator

**Needs** (from personas.md):
- ✅ Mobile-friendly data entry
- ✅ Minimal interaction (automated where possible)
- ✅ Clear task list (pending delivery actions)

**Workflow System Addresses**:
- ✅ Mobile execution dialogs (tablet/phone friendly)
- ✅ Simple forms (mortality, quality score, done)
- ✅ Push notifications for pending deliveries
- ✅ Offline capability (sync when online)

---

## Conclusion

This refinement plan transforms the workflow system from transfer-only to a comprehensive operational planning tool. The timeline-aware container selection eliminates planning friction, and the parallel architecture (separate creation workflow) maintains semantic clarity.

**Key Innovations**:
1. **Timeline Forecasting**: Plan weeks/months ahead with confidence
2. **Rich Container Context**: See occupancy + availability in one view
3. **Finance Automation**: Internal eggs auto-create intercompany transactions
4. **Compliance Built-In**: Complete audit trail from egg source to active batch

**Implementation Ready**: All decisions finalized, ready for agent execution.

---

**Document Version**: 1.0 - DRAFT APPROVED  
**Next Action**: Implement Part A (Immediate Fixes)  
**Author**: Claude & User Collaborative Design  
**Review Date**: November 11, 2025

