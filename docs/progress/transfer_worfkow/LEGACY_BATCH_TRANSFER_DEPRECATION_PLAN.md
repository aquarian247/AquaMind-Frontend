# Legacy Batch Transfer Deprecation Plan

**Date**: October 20, 2024  
**Purpose**: Complete removal of old BatchTransfer system in favor of BatchTransferWorkflow  
**Status**: ⚠️ Not Started - Ready to Execute  
**Estimated Effort**: 12-16 hours total

---

## 📋 Executive Summary

The legacy `BatchTransfer` system is being replaced by the new `BatchTransferWorkflow` system which provides:
- Multi-day workflow orchestration
- Progress tracking
- Finance integration
- Intercompany transaction automation
- Complete audit trail

**This document provides a step-by-step plan to safely deprecate and remove the old system.**

---

## 🎯 Objectives

1. ✅ Prevent new data from being created in old system
2. ✅ Migrate existing data to new system
3. ✅ Remove UI components pointing to old system
4. ✅ Deprecate API endpoints gracefully
5. ✅ Clean up database tables and models
6. ✅ Update documentation

---

## 📊 Current State Analysis

### **Old System (BatchTransfer)**

**Database**:
- Table: `batch_batchtransfer`
- History: `batch_historicalbatchtransfer`
- Records: TBD (check in database)

**Backend** (22 files):
```
apps/batch/models/transfer.py                    # Model
apps/batch/api/serializers/transfer.py           # Serializer
apps/batch/api/viewsets/transfers.py             # ViewSet
apps/batch/api/filters/transfers.py              # Filter
apps/batch/api/routers.py                        # Router registration
apps/batch/admin.py                               # Admin interface
apps/batch/migrations/*.py                        # Migrations
apps/batch/tests/models/test_batch_transfer_model.py  # Tests
apps/batch/tests/api/test_*.py                   # API tests
```

**API Endpoints**:
```
GET    /api/v1/batch/transfers/
POST   /api/v1/batch/transfers/
GET    /api/v1/batch/transfers/{id}/
PATCH  /api/v1/batch/transfers/{id}/
DELETE /api/v1/batch/transfers/{id}/
```

**Frontend** (3 files):
```
client/src/features/batch-management/pages/BatchSetupPage.tsx
client/src/features/batch-management/components/BatchTransferForm.tsx
client/src/features/batch-management/api.ts  (useBatchTransfers, useCreateBatchTransfer, etc.)
```

---

### **New System (BatchTransferWorkflow)**

**Database**:
- Tables: `batch_batchtransferworkflow`, `batch_transferaction`
- History: `batch_historicalbatchtransferworkflow`, `batch_historicaltransferaction`
- Records: 240 workflows, 2,400 actions (backfilled)

**Backend**: Fully implemented ✅

**Frontend**: 70% implemented ✅

**Finance Integration**: Working ✅

---

## 🚀 Phase-by-Phase Deprecation Plan

### **PHASE 1: Freeze Old System** (2-3 hours)

**Goal**: Prevent new records in old system while preserving read access

#### **Step 1.1: Frontend - Hide Create Form**

**File**: `client/src/features/batch-management/pages/BatchSetupPage.tsx`

**Option A: Remove Completely** (Recommended)
```tsx
// Remove 'transfer' from entities array
const entities = [
  { id: 'batch', name: 'Batch', ... },
  { id: 'lifecycleStage', name: 'Lifecycle Stage', ... },
  // REMOVE THIS:
  // { id: 'transfer', name: 'Batch Transfer', ... },
  { id: 'growthSample', name: 'Growth Sample', ... },
  { id: 'mortalityEvent', name: 'Mortality Event', ... },
]

// Remove BatchTransferForm import and dialog
// Remove useBatchTransfers import
```

**Option B: Redirect to Workflows** (Alternative)
```tsx
// Change transfer card to navigate instead of dialog
{
  id: 'transfer' as const,
  name: 'Transfer Workflows',
  description: 'Plan and execute multi-step batch transfers',
  icon: ArrowRightLeft,
  count: workflowsData?.count || 0,
  color: 'orange',
  // On click: Navigate to new system
  onClick: () => navigate('/transfer-workflows'),
}
```

**Effort**: 30 minutes  
**Impact**: Users can no longer create old-style transfers via UI  
**Risk**: LOW (new system is fully functional)

---

#### **Step 1.2: Backend - Make API Read-Only**

**File**: `apps/batch/api/viewsets/transfers.py`

**Change**:
```python
from rest_framework.viewsets import ReadOnlyModelViewSet  # ← Change this

class BatchTransferViewSet(ReadOnlyModelViewSet):  # ← Was ModelViewSet
    """
    DEPRECATED: Use BatchTransferWorkflowViewSet instead.
    
    This endpoint is read-only for viewing legacy transfers.
    New transfers should use /api/v1/batch/transfer-workflows/
    """
    
    serializer_class = BatchTransferSerializer
    # ... rest unchanged
```

**Effort**: 15 minutes  
**Impact**: API returns 405 Method Not Allowed for POST/PATCH/DELETE  
**Risk**: LOW (frontend already removed create form)

---

#### **Step 1.3: Add Deprecation Warnings**

**File**: `apps/batch/api/viewsets/transfers.py`

```python
from drf_spectacular.utils import extend_schema_view, extend_schema

@extend_schema_view(
    list=extend_schema(
        deprecated=True,
        description=(
            "⚠️ DEPRECATED: This endpoint is read-only for legacy data. "
            "Use /api/v1/batch/transfer-workflows/ for new transfers. "
            "Legacy transfers will be migrated to workflows in future release."
        )
    ),
    retrieve=extend_schema(deprecated=True),
)
class BatchTransferViewSet(ReadOnlyModelViewSet):
    # ...
```

**Effort**: 15 minutes  
**Impact**: OpenAPI spec shows deprecation warnings  
**Risk**: NONE (informational only)

---

#### **Step 1.4: Update User Documentation**

**File**: `aquamind/docs/user_guides/TRANSFER_WORKFLOW_FINANCE_GUIDE.md`

Add section:
```markdown
## ⚠️ Legacy Batch Transfer System

If you see a "Batch Transfer" option on the Batch Setup page, 
**do not use it**. This is the legacy system that:

- ❌ Does not create finance transactions
- ❌ Does not support multi-day operations
- ❌ Does not appear in Transfer Workflows UI

**Always use**: Transfer Workflows (sidebar menu or batch detail page)
```

**Effort**: 15 minutes

---

### **PHASE 2: Data Migration** (6-8 hours)

**Goal**: Convert all legacy `BatchTransfer` records to `BatchTransferWorkflow`

#### **Step 2.1: Analyze Existing Data**

**Query to check what exists**:
```sql
-- Count legacy transfers
SELECT COUNT(*) FROM batch_batchtransfer;

-- Check date range
SELECT 
    MIN(transfer_date) as earliest,
    MAX(transfer_date) as latest,
    COUNT(*) as total_transfers
FROM batch_batchtransfer;

-- Check transfer types
SELECT transfer_type, COUNT(*) 
FROM batch_batchtransfer 
GROUP BY transfer_type;

-- Check if any transfers are missing assignments
SELECT COUNT(*) 
FROM batch_batchtransfer 
WHERE source_assignment_id IS NULL 
   OR destination_assignment_id IS NULL;
```

**Document findings**:
- How many legacy transfers exist
- Date range (are they all historical or recent too?)
- Transfer types (CONTAINER, LIFECYCLE, SPLIT, MERGE?)
- Data quality (missing assignments?)

---

#### **Step 2.2: Create Migration Script**

**File**: `scripts/data_generation/migrate_legacy_transfers.py`

```python
#!/usr/bin/env python3
"""
Migrate legacy BatchTransfer records to BatchTransferWorkflow.

Each legacy transfer becomes a workflow with 1 action.
Marked as workflow_type='LEGACY_CONVERSION' for traceability.

Usage:
    python scripts/data_generation/migrate_legacy_transfers.py
    python scripts/data_generation/migrate_legacy_transfers.py --dry-run
    python scripts/data_generation/migrate_legacy_transfers.py --batch 205
"""

import os
import sys
import django
import argparse
from datetime import date
from decimal import Decimal

project_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
sys.path.insert(0, project_root)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aquamind.settings')
django.setup()

from django.db import transaction
from django.contrib.auth import get_user_model
from apps.batch.models import (
    BatchTransfer,
    BatchTransferWorkflow,
    TransferAction,
)

User = get_user_model()


class LegacyTransferMigrator:
    """Migrates legacy BatchTransfer to BatchTransferWorkflow."""

    def __init__(self, dry_run=False, batch_id=None):
        self.dry_run = dry_run
        self.batch_id = batch_id
        self.stats = {
            'transfers_processed': 0,
            'workflows_created': 0,
            'actions_created': 0,
            'errors': 0,
        }
        self.user = self._get_system_user()

    def _get_system_user(self):
        """Get system user for initiated_by."""
        user, _ = User.objects.get_or_create(
            username='system_admin',
            defaults={'email': 'system@aquamind.com', 'is_staff': True}
        )
        return user

    def run(self):
        """Main execution method."""
        print("\n" + "=" * 80)
        print("Legacy BatchTransfer Migration Script")
        print("=" * 80)
        
        if self.dry_run:
            print("🔍 DRY RUN MODE - No changes will be saved\n")

        # Get transfers to migrate
        transfers = self._get_legacy_transfers()
        print(f"Found {transfers.count()} legacy transfers to migrate\n")

        for legacy_transfer in transfers:
            self._migrate_transfer(legacy_transfer)

        # Print summary
        print("\n" + "=" * 80)
        print("Summary")
        print("=" * 80)
        print(f"Transfers Processed: {self.stats['transfers_processed']}")
        print(f"Workflows Created: {self.stats['workflows_created']}")
        print(f"Actions Created: {self.stats['actions_created']}")
        print(f"Errors: {self.stats['errors']}")
        
        if self.dry_run:
            print("\n⚠️  DRY RUN - No changes were saved")
        else:
            print("\n✅ Migration complete!")

    def _get_legacy_transfers(self):
        """Get legacy transfers to migrate."""
        queryset = BatchTransfer.objects.select_related(
            'source_batch',
            'source_assignment',
            'destination_assignment',
            'source_lifecycle_stage',
            'destination_lifecycle_stage',
        ).order_by('transfer_date', 'id')

        if self.batch_id:
            queryset = queryset.filter(source_batch_id=self.batch_id)

        return queryset

    def _migrate_transfer(self, legacy_transfer):
        """Migrate a single legacy transfer to workflow."""
        try:
            print(f"Migrating: {legacy_transfer.source_batch.batch_number} "
                  f"({legacy_transfer.transfer_date})")

            # Check if workflow already exists
            existing = BatchTransferWorkflow.objects.filter(
                batch=legacy_transfer.source_batch,
                planned_start_date=legacy_transfer.transfer_date,
                actual_start_date=legacy_transfer.transfer_date,
                notes__contains='Legacy migration',
            ).first()

            if existing:
                print(f"  ⊘ Workflow already exists: {existing.workflow_number}")
                return

            if self.dry_run:
                print(f"  DRY RUN: Would create workflow + 1 action")
                return

            with transaction.atomic():
                # Create workflow
                workflow = self._create_workflow(legacy_transfer)

                # Create single action
                self._create_action(workflow, legacy_transfer)

                # Detect intercompany
                workflow.detect_intercompany()
                workflow.refresh_from_db()

                print(f"  ✓ Created: {workflow.workflow_number} "
                      f"(Intercompany: {workflow.is_intercompany})")

                self.stats['transfers_processed'] += 1
                self.stats['workflows_created'] += 1
                self.stats['actions_created'] += 1

        except Exception as e:
            print(f"  ❌ Error: {e}")
            self.stats['errors'] += 1

    def _create_workflow(self, legacy_transfer):
        """Create workflow from legacy transfer."""
        # Generate workflow number
        year = legacy_transfer.transfer_date.year
        last_workflow = BatchTransferWorkflow.objects.filter(
            workflow_number__startswith=f'TRF-{year}-'
        ).order_by('-workflow_number').first()

        if last_workflow:
            last_num = int(last_workflow.workflow_number.split('-')[-1])
            next_num = last_num + 1
        else:
            next_num = 1

        workflow_number = f'TRF-{year}-{next_num:03d}'

        # Determine workflow type
        if legacy_transfer.transfer_type == 'LIFECYCLE':
            workflow_type = 'LIFECYCLE_TRANSITION'
        elif legacy_transfer.transfer_type == 'SPLIT':
            workflow_type = 'CONTAINER_REDISTRIBUTION'
        elif legacy_transfer.transfer_type == 'MERGE':
            workflow_type = 'CONTAINER_REDISTRIBUTION'
        else:  # CONTAINER, MIXED_TRANSFER
            workflow_type = 'CONTAINER_REDISTRIBUTION'

        workflow = BatchTransferWorkflow.objects.create(
            workflow_number=workflow_number,
            batch=legacy_transfer.source_batch,
            workflow_type=workflow_type,
            source_lifecycle_stage=legacy_transfer.source_lifecycle_stage,
            dest_lifecycle_stage=legacy_transfer.destination_lifecycle_stage,
            status='COMPLETED',
            planned_start_date=legacy_transfer.transfer_date,
            planned_completion_date=legacy_transfer.transfer_date,
            actual_start_date=legacy_transfer.transfer_date,
            actual_completion_date=legacy_transfer.transfer_date,
            total_actions_planned=1,
            actions_completed=1,
            completion_percentage=Decimal('100.00'),
            initiated_by=self.user,
            completed_by=self.user,
            notes=f'Legacy migration from BatchTransfer #{legacy_transfer.id}',
        )

        return workflow

    def _create_action(self, workflow, legacy_transfer):
        """Create single action from legacy transfer."""
        TransferAction.objects.create(
            workflow=workflow,
            action_number=1,
            source_assignment=legacy_transfer.source_assignment,
            dest_assignment=legacy_transfer.destination_assignment,
            source_population_before=legacy_transfer.source_count,
            transferred_count=legacy_transfer.transferred_count,
            mortality_during_transfer=legacy_transfer.mortality_count,
            transferred_biomass_kg=legacy_transfer.transferred_biomass_kg,
            status='COMPLETED',
            planned_date=legacy_transfer.transfer_date,
            actual_execution_date=legacy_transfer.transfer_date,
            executed_by=self.user,
            notes=f'Migrated from legacy BatchTransfer #{legacy_transfer.id}',
        )

        # Update workflow totals
        workflow.total_transferred_count = legacy_transfer.transferred_count
        workflow.total_mortality_count = legacy_transfer.mortality_count
        workflow.total_biomass_kg = legacy_transfer.transferred_biomass_kg
        workflow.save()


def main():
    parser = argparse.ArgumentParser(
        description='Migrate legacy BatchTransfer to BatchTransferWorkflow'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Show what would be migrated without actually migrating'
    )
    parser.add_argument(
        '--batch',
        type=int,
        help='Migrate only specific batch ID'
    )

    args = parser.parse_args()

    migrator = LegacyTransferMigrator(
        dry_run=args.dry_run,
        batch_id=args.batch,
    )

    try:
        migrator.run()
    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
```

**Testing**:
```bash
# Check what would be migrated
python scripts/data_generation/migrate_legacy_transfers.py --dry-run

# Migrate one batch
python scripts/data_generation/migrate_legacy_transfers.py --batch 205 --dry-run
python scripts/data_generation/migrate_legacy_transfers.py --batch 205

# Migrate all
python scripts/data_generation/migrate_legacy_transfers.py
```

**Effort**: 4-5 hours (write, test, run)

---

#### **Step 1.3: Verification**

**Queries to verify migration**:
```sql
-- Check all legacy transfers have corresponding workflows
SELECT 
    bt.id as legacy_id,
    bt.transfer_date,
    bt.source_batch_id,
    wf.workflow_number,
    wf.id as workflow_id
FROM batch_batchtransfer bt
LEFT JOIN batch_batchtransferworkflow wf ON (
    wf.batch_id = bt.source_batch_id 
    AND wf.actual_start_date = bt.transfer_date
    AND wf.notes LIKE '%Legacy migration from BatchTransfer #' || bt.id || '%'
)
ORDER BY bt.transfer_date;

-- Count mismatches
SELECT 
    COUNT(*) as legacy_without_workflow
FROM batch_batchtransfer bt
WHERE NOT EXISTS (
    SELECT 1 FROM batch_batchtransferworkflow wf
    WHERE wf.batch_id = bt.source_batch_id
    AND wf.notes LIKE '%Legacy migration from BatchTransfer #' || bt.id || '%'
);
```

**Expected**: 0 mismatches ✅

**Effort**: 30 minutes

---

### **PHASE 2: Remove Frontend Components** (1-2 hours)

**Goal**: Clean up old UI code

#### **Step 2.1: Remove Components**

**Files to Delete**:
```bash
rm client/src/features/batch-management/components/BatchTransferForm.tsx
```

**Files to Update**:

**File**: `client/src/features/batch-management/api.ts`
```typescript
// Remove these functions:
// - useBatchTransfers()
// - useBatchTransfer()
// - useCreateBatchTransfer()
// - useDeleteBatchTransfer()

// Remove import:
// - BatchTransfer type
// - PaginatedBatchTransferList type
```

**File**: `client/src/features/batch-management/pages/BatchSetupPage.tsx`
```typescript
// Remove import:
import { BatchTransferForm } from '../components/BatchTransferForm'
import { useBatchTransfers } from '../api'

// Remove from entities array (already done in Phase 1)

// Remove dialog
```

**Effort**: 1 hour

---

#### **Step 2.2: Update Tests**

**Remove or update**:
```
client/src/features/batch-management/components/BatchTransferForm.test.tsx (if exists)
client/src/features/batch-management/api/batchTransfers.test.ts (if exists)
```

**Effort**: 30 minutes

---

### **PHASE 3: Deprecate Backend API** (2-3 hours)

**Goal**: Remove write endpoints, prepare for model deletion

#### **Step 3.1: Document Migration in Admin**

**File**: `apps/batch/admin.py`

```python
@admin.register(BatchTransfer)
class BatchTransferAdmin(admin.ModelAdmin):
    # Make read-only in admin
    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    list_display = (
        'id',
        'source_batch',
        'transfer_date',
        'migration_status',
    )

    def migration_status(self, obj):
        """Show if this has been migrated to workflow."""
        from django.utils.html import format_html
        
        workflow_exists = BatchTransferWorkflow.objects.filter(
            batch=obj.source_batch,
            actual_start_date=obj.transfer_date,
            notes__contains=f'Legacy migration from BatchTransfer #{obj.id}'
        ).exists()
        
        if workflow_exists:
            return format_html('<span style="color: green;">✓ Migrated</span>')
        return format_html('<span style="color: red;">⚠ Not Migrated</span>')
    
    migration_status.short_description = 'Migration Status'
```

**Effort**: 30 minutes

---

#### **Step 3.2: Add Migration Management Command**

**File**: `apps/batch/management/commands/verify_transfer_migration.py`

```python
from django.core.management.base import BaseCommand
from apps.batch.models import BatchTransfer, BatchTransferWorkflow


class Command(BaseCommand):
    help = 'Verify all legacy transfers have been migrated'

    def handle(self, *args, **options):
        total_legacy = BatchTransfer.objects.count()
        
        # Check how many have corresponding workflows
        migrated = 0
        for transfer in BatchTransfer.objects.all():
            if BatchTransferWorkflow.objects.filter(
                batch=transfer.source_batch,
                notes__contains=f'Legacy migration from BatchTransfer #{transfer.id}'
            ).exists():
                migrated += 1
        
        unmigrated = total_legacy - migrated
        
        self.stdout.write(f"\nLegacy Transfer Migration Status:")
        self.stdout.write(f"  Total Legacy Transfers: {total_legacy}")
        self.stdout.write(f"  Migrated: {migrated}")
        self.stdout.write(f"  Unmigrated: {unmigrated}\n")
        
        if unmigrated == 0:
            self.stdout.write(self.style.SUCCESS('✅ All transfers migrated!'))
        else:
            self.stdout.write(self.style.WARNING(
                f'⚠️  {unmigrated} transfers not yet migrated'
            ))
```

**Effort**: 30 minutes

---

### **PHASE 4: Remove Old Code** (2-3 hours)

**Goal**: Delete obsolete code after migration verified

#### **Step 4.1: Remove Model & Related Code**

**Safety Check First**:
```bash
# Verify all transferred
python manage.py verify_transfer_migration

# Should show: ✅ All transfers migrated!
```

**Files to Delete**:
```bash
# Model
apps/batch/models/transfer.py

# API
apps/batch/api/serializers/transfer.py
apps/batch/api/viewsets/transfers.py
apps/batch/api/filters/transfers.py

# Tests
apps/batch/tests/models/test_batch_transfer_model.py
apps/batch/tests/api/test_batch_transfer_*.py
```

**Files to Update**:

**File**: `apps/batch/models/__init__.py`
```python
# Remove:
from .transfer import BatchTransfer
```

**File**: `apps/batch/api/routers.py`
```python
# Remove:
from apps.batch.api.viewsets.transfers import BatchTransferViewSet

# Remove router registration:
router.register('transfers', BatchTransferViewSet, basename='batchtransfer')
```

**File**: `apps/batch/api/serializers/__init__.py`
```python
# Remove:
from .transfer import BatchTransferSerializer
```

**File**: `apps/batch/api/viewsets/__init__.py`
```python
# Remove:
from .transfers import BatchTransferViewSet
```

**File**: `apps/batch/admin.py`
```python
# Remove:
from apps.batch.models import BatchTransfer

@admin.register(BatchTransfer)
class BatchTransferAdmin(admin.ModelAdmin):
    # Delete entire class
```

**Effort**: 1 hour

---

#### **Step 4.2: Create Deprecation Migration**

**File**: `apps/batch/migrations/00XX_remove_batchtransfer.py`

```python
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('batch', '0023_batchtransferworkflow_...'),  # Latest migration
    ]

    operations = [
        # Archive old data to backup table (optional safety measure)
        migrations.RunSQL(
            sql="""
                CREATE TABLE IF NOT EXISTS batch_batchtransfer_archived AS 
                SELECT * FROM batch_batchtransfer;
                
                CREATE TABLE IF NOT EXISTS batch_historicalbatchtransfer_archived AS
                SELECT * FROM batch_historicalbatchtransfer;
            """,
            reverse_sql=migrations.RunSQL.noop,
        ),
        
        # Drop tables
        migrations.RunSQL(
            sql="""
                DROP TABLE IF EXISTS batch_batchtransfer CASCADE;
                DROP TABLE IF EXISTS batch_historicalbatchtransfer CASCADE;
            """,
            reverse_sql=migrations.RunSQL.noop,
        ),
    ]
```

**Note**: This is a **data destruction migration**. Only run after:
1. ✅ All transfers migrated
2. ✅ Verification complete
3. ✅ Backup created
4. ✅ Stakeholder approval

**Effort**: 30 minutes (write migration)  
**Testing**: 30 minutes (verify in staging first!)

---

#### **Step 4.3: Regenerate OpenAPI Spec**

```bash
cd /Users/aquarian247/Projects/AquaMind
bash scripts/regenerate_openapi.sh
```

This will remove `/api/v1/batch/transfers/` endpoints from spec.

**Effort**: 5 minutes

---

#### **Step 4.4: Update Frontend API Client**

```bash
cd /Users/aquarian247/Projects/AquaMind-Frontend
cp ../AquaMind/api/openapi.yaml api/openapi.yaml
npm run generate:api
```

**Verify**: BatchTransfer types should be gone from generated client.

**Effort**: 5 minutes

---

### **PHASE 5: Documentation & Communication** (1 hour)

#### **Step 5.1: Update User Guide**

**File**: `aquamind/docs/user_guides/TRANSFER_WORKFLOW_FINANCE_GUIDE.md`

Remove any mentions of old system, update with:
```markdown
## Migration from Legacy System

If you have old transfer records (pre-October 2024), they have been 
automatically migrated to the new workflow system. You can view them
in the Transfer Workflows page.

Legacy transfer IDs are preserved in the workflow notes field.
```

**Effort**: 15 minutes

---

#### **Step 5.2: Create Migration Announcement**

**File**: `docs/announcements/BATCH_TRANSFER_MIGRATION_2024.md`

```markdown
# Batch Transfer System Migration

**Date**: [Migration Date]  
**Impact**: All users creating or managing batch transfers

## What Changed

The batch transfer system has been upgraded from simple transfers 
to comprehensive workflow orchestration.

### Old System (Deprecated)
- ❌ Single-step transfers
- ❌ No progress tracking
- ❌ No finance integration

### New System (Now Active)
- ✅ Multi-day workflow planning
- ✅ Real-time progress tracking
- ✅ Automatic finance transactions
- ✅ Mobile-optimized execution

## What You Need to Do

**Nothing!** All your old transfers have been automatically migrated.

**Going Forward**: Use "Transfer Workflows" in the sidebar menu.

## Questions?

Contact: IT Support or refer to Transfer Workflow Finance Guide
```

**Effort**: 15 minutes

---

#### **Step 5.3: Update README/CHANGELOG**

**File**: `AquaMind/CHANGELOG.md` or `README.md`

```markdown
## [Version X.X.X] - 2024-10-XX

### Breaking Changes
- **Removed**: Legacy BatchTransfer API (`/api/v1/batch/transfers/`)
- **Replaced With**: BatchTransferWorkflow system

### Migration
- All legacy transfers automatically migrated to workflows
- Old data preserved in `batch_batchtransfer_archived` table (30-day retention)
```

**Effort**: 15 minutes

---

## ✅ Execution Checklist

### **Before Starting**

- [ ] Backup database
- [ ] Verify new workflow system is working
- [ ] Test migration script with --dry-run
- [ ] Get stakeholder approval

### **Phase 1: Freeze** (2-3 hours)

- [ ] Step 1.1: Remove/redirect frontend create form
- [ ] Step 1.2: Make API read-only
- [ ] Step 1.3: Add deprecation warnings
- [ ] Step 1.4: Update user documentation
- [ ] **Verify**: Can't create new legacy transfers
- [ ] **Verify**: Can still view old transfers
- [ ] **Commit & Deploy**

### **Phase 2: Migrate Data** (6-8 hours)

- [ ] Step 2.1: Analyze existing data (run queries)
- [ ] Step 2.2: Create migration script
- [ ] **Test**: Run with --dry-run
- [ ] **Test**: Migrate one batch
- [ ] **Verify**: Check workflow created correctly
- [ ] **Execute**: Run full migration
- [ ] **Verify**: Run verification queries
- [ ] **Document**: Record migration stats
- [ ] **Commit**: Commit migration script

### **Phase 3: Deprecate API** (2-3 hours)

- [ ] Step 3.1: Update admin to read-only
- [ ] Step 3.2: Add verification management command
- [ ] **Test**: Run verification command
- [ ] **Verify**: Shows 100% migrated
- [ ] **Commit**: Commit admin changes

### **Phase 4: Remove Code** (2-3 hours)

⚠️ **DANGER ZONE** - Only after all above steps complete

- [ ] **Verify Again**: Run verification command
- [ ] **Backup**: Database backup before proceeding
- [ ] Step 4.1: Delete model & API files
- [ ] Step 4.2: Create deprecation migration
- [ ] **Test**: Run migration in dev/staging first
- [ ] Step 4.3: Regenerate OpenAPI spec
- [ ] Step 4.4: Update frontend API client
- [ ] **Test**: Full system test
- [ ] **Commit**: Commit all removals

### **Phase 5: Documentation** (1 hour)

- [ ] Step 5.1: Update user guide
- [ ] Step 5.2: Create migration announcement
- [ ] Step 5.3: Update README/CHANGELOG
- [ ] **Commit**: Commit all docs

---

## 🧪 Testing Strategy

### **After Phase 1** (Freeze)

**Test**: Can't create new transfers
```bash
# Should fail with 405 Method Not Allowed
curl -X POST http://localhost:8000/api/v1/batch/transfers/ \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"source_batch": 205, ...}'
```

**Test**: Can still view old transfers
```bash
# Should work
curl http://localhost:8000/api/v1/batch/transfers/ \
  -H "Authorization: Bearer $TOKEN"
```

---

### **After Phase 2** (Migration)

**Test**: Legacy transfer has workflow
```python
legacy = BatchTransfer.objects.first()
workflow = BatchTransferWorkflow.objects.filter(
    notes__contains=f'Legacy migration from BatchTransfer #{legacy.id}'
).first()

assert workflow is not None
assert workflow.actions.count() == 1
assert workflow.status == 'COMPLETED'
```

**Test**: All transfers migrated
```bash
python manage.py verify_transfer_migration
# Should show: ✅ All transfers migrated!
```

---

### **After Phase 4** (Removal)

**Test**: Old API returns 404
```bash
# Should 404
curl http://localhost:8000/api/v1/batch/transfers/
```

**Test**: New API works
```bash
# Should work
curl http://localhost:8000/api/v1/batch/transfer-workflows/
```

**Test**: System check clean
```bash
python manage.py check
# Should show: 0 issues
```

**Test**: Full workflow creation and execution
```
1. Create workflow via UI
2. Add actions (when form exists)
3. Plan workflow
4. Execute actions
5. Verify completion
6. Check finance transaction created
```

---

## 📊 Risk Assessment

### **Low Risk**

✅ Phase 1 (Freeze): Safe, reversible  
✅ Phase 2 (Migration): Creates new data, doesn't delete old  
✅ Phase 3 (Deprecate): Read-only preservation

### **Medium Risk**

⚠️ Phase 4 (Removal): Deletes code and schema

**Mitigation**:
- Archive data before dropping tables
- Test in staging first
- Have rollback plan (keep migration files)
- Document what was removed

### **High Risk Scenarios**

❌ **Deleting before migration**: Data loss  
**Prevention**: Strict ordering, verification at each phase

❌ **External systems depending on old API**: Integration breakage  
**Prevention**: Check for API consumers, communicate deprecation timeline

❌ **Incomplete migration**: Some transfers lost  
**Prevention**: Verification queries, dry-run testing

---

## 🔄 Rollback Plan

### **If Issues Found After Phase 1**

```bash
# Revert frontend changes
git revert <commit-hash>

# Revert API to ModelViewSet
# Change ReadOnlyModelViewSet → ModelViewSet in viewsets/transfers.py
```

**Impact**: MINIMAL (only prevents creation temporarily)

---

### **If Issues Found After Phase 2**

```bash
# Legacy transfers still exist (not deleted)
# Workflows can be deleted if needed
BatchTransferWorkflow.objects.filter(
    notes__contains='Legacy migration'
).delete()

# Re-run migration script after fixes
```

**Impact**: LOW (can re-run migration)

---

### **If Issues Found After Phase 4**

```bash
# Restore from backup
# If you archived data:
CREATE TABLE batch_batchtransfer AS 
SELECT * FROM batch_batchtransfer_archived;

# Restore code from git
git revert <commit-hash>

# Re-run migrations
python manage.py migrate batch <previous-migration>
```

**Impact**: HIGH (requires database restore)  
**Prevention**: Don't reach Phase 4 without thorough testing

---

## 📅 Recommended Timeline

### **Week 1: Freeze & Migrate**
- **Day 1**: Phase 1 (Freeze) - 3 hours
- **Day 2**: Phase 2 (Migration script) - 5 hours
- **Day 3**: Phase 2 (Run migration) - 2 hours + verification
- **Day 4**: Phase 3 (Deprecate API) - 3 hours
- **Day 5**: Buffer / testing

### **Week 2: Remove & Document**
- **Day 1**: Phase 4 (Remove code) - 3 hours
- **Day 2**: Phase 5 (Documentation) - 1 hour
- **Day 3-5**: Testing & verification

**Total**: 2 weeks conservative, 1 week aggressive

---

## 🎯 Success Criteria

### **Phase 1 Complete** ✅
- [ ] Can't create new BatchTransfer via UI
- [ ] Can't create new BatchTransfer via API (405 error)
- [ ] Can still view old transfers
- [ ] Deprecation warnings visible

### **Phase 2 Complete** ✅
- [ ] Every legacy transfer has corresponding workflow
- [ ] Verification command shows 100% migrated
- [ ] No data loss
- [ ] Historical dates preserved

### **Phase 3 Complete** ✅
- [ ] Admin is read-only
- [ ] Migration status visible in admin
- [ ] API endpoints marked deprecated in OpenAPI

### **Phase 4 Complete** ✅
- [ ] Old model deleted
- [ ] Old API endpoints removed
- [ ] Tables dropped (with archive)
- [ ] OpenAPI spec regenerated
- [ ] Frontend client regenerated
- [ ] System check clean

### **Phase 5 Complete** ✅
- [ ] Documentation updated
- [ ] Migration announced
- [ ] CHANGELOG updated
- [ ] User guide reflects new system only

---

## 💡 Best Practices

### **Do's** ✅

1. **Test with --dry-run first** - Always preview changes
2. **Migrate incrementally** - One batch, then all
3. **Verify at each phase** - Run queries and commands
4. **Backup before destructive ops** - Phase 4 requires backup
5. **Communicate early** - Users need advance notice
6. **Keep rollback plan** - Be ready to revert

### **Don'ts** ❌

1. **Don't skip phases** - Each builds on previous
2. **Don't delete before migrating** - Data loss risk
3. **Don't rush Phase 4** - Most dangerous phase
4. **Don't ignore verification** - Catch issues early
5. **Don't surprise users** - Communicate changes
6. **Don't delete migrations** - Need for rollback

---

## 📞 Support Information

### **For Execution Questions**

**Migration Script**: `scripts/data_generation/migrate_legacy_transfers.py`  
**Verification**: `python manage.py verify_transfer_migration`  
**Queries**: See "Step 2.1: Analyze Existing Data"

### **For Technical Issues**

**Model Documentation**: `apps/batch/models/transfer.py` (read comments)  
**API Documentation**: OpenAPI spec at `/api/schema/`  
**Workflow Documentation**: `TRANSFER_WORKFLOW_FINANCE_GUIDE.md`

---

## 🎓 Lessons Learned (from similar migrations)

### **What Works Well**

✅ **Phased approach** - Gradual, reversible changes  
✅ **Dry-run mode** - Catch issues before committing  
✅ **Verification commands** - Automated checking  
✅ **Archive before delete** - Safety net  

### **Common Pitfalls**

❌ **Rushing to delete** - Skipping migration phase  
❌ **Missing edge cases** - SPLIT/MERGE transfer types  
❌ **No rollback plan** - Can't recover from errors  
❌ **Poor communication** - Users surprised by changes  

---

## 📝 Quick Reference

### **Key Commands**

```bash
# Check legacy transfer count
psql -d aquamind_db -c "SELECT COUNT(*) FROM batch_batchtransfer;"

# Dry run migration
python scripts/data_generation/migrate_legacy_transfers.py --dry-run

# Migrate all
python scripts/data_generation/migrate_legacy_transfers.py

# Verify migration
python manage.py verify_transfer_migration

# Regenerate API
bash scripts/regenerate_openapi.sh
cd ../AquaMind-Frontend && npm run generate:api
```

### **Key Files**

```
Backend Migration:
  scripts/data_generation/migrate_legacy_transfers.py (CREATE)
  apps/batch/management/commands/verify_transfer_migration.py (CREATE)
  apps/batch/migrations/00XX_remove_batchtransfer.py (CREATE)

Frontend Cleanup:
  client/src/features/batch-management/pages/BatchSetupPage.tsx (UPDATE)
  client/src/features/batch-management/components/BatchTransferForm.tsx (DELETE)
  client/src/features/batch-management/api.ts (UPDATE)
```

---

## 🎉 Conclusion

This deprecation plan provides a **safe, phased approach** to removing the legacy BatchTransfer system. By following the phases in order and verifying at each step, you can:

- ✅ Preserve all historical data
- ✅ Migrate to new system safely
- ✅ Remove technical debt
- ✅ Improve user experience
- ✅ Enable finance integration

**Estimated Total Effort**: 12-16 hours  
**Risk Level**: LOW to MEDIUM (with proper testing)  
**Timeline**: 1-2 weeks recommended

---

**Prepared by**: AI Assistant (Claude)  
**Review Required**: Technical Lead, Database Administrator  
**Execute After**: Transfer Workflow system proven stable in production

---

*For questions or issues during execution, refer to this document and the rollback plan.*

