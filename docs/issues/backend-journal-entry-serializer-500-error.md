# Backend Issue: JournalEntry Serializer 500 Error - DateField/DateTimeField Mismatch

**Repository**: AquaMind (Backend)  
**Title**: Fix: JournalEntry serializer DateField/DateTimeField type mismatch causing 500 errors  
**Labels**: bug, backend, health, serializer, UAT-blocker  
**Priority**: High

---

## Problem

The `/api/v1/health/journal-entries/` endpoint returns **500 Internal Server Error** due to a type mismatch between the model field and serializer field.

## Error Details

```python
GET /api/v1/health/journal-entries/?batch__id=258 HTTP/1.1" 500

File "/rest_framework/fields.py", line 1272, in to_representation
    assert not isinstance(value, datetime.datetime), (
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: Expected a `date`, but got a `datetime`. 
Refusing to coerce, as this may mean losing timezone information. 
Use a custom read-only field and deal with timezone issues explicitly.
```

## Root Cause

**Model Definition** (`apps/health/models.py`):
```python
class JournalEntry(models.Model):
    entry_date = models.DateTimeField(default=timezone.now)  # ← Stores DATETIME
    ...
```

**Serializer** (likely auto-generated from Meta):
```python
class JournalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = ['entry_date', ...]  # ← DRF auto-generates DateField (not DateTimeField)
```

**Mismatch**:
- Model stores: `datetime` object with timezone
- Serializer expects: `date` object (date only)
- DRF refuses to coerce: Throws AssertionError to prevent data loss

## Impact

**Frontend**:
- Medical tab shows 500 error when accessing journal entries
- Users cannot view health records
- Breaks batch health tracking workflow

**UAT Impact**:
- Critical health monitoring feature non-functional
- Users cannot access medical journal data

## Verification

### Check Current State:
```bash
cd /path/to/AquaMind

# Check model definition
grep -A 5 "entry_date" apps/health/models.py

# Check serializer
grep -A 10 "JournalEntrySerializer" apps/health/api/serializers/
```

### Test the Error:
```bash
# Start server
python manage.py runserver 8000

# Test endpoint
curl "http://localhost:8000/api/v1/health/journal-entries/?batch__id=258" \
  -H "Authorization: Bearer $JWT_TOKEN"

# Should return 500 with the datetime assertion error
```

## Solution

### Option 1: Fix Serializer (Recommended if datetime is needed)

```python
# apps/health/api/serializers/journal.py (or wherever JournalEntrySerializer is defined)

class JournalEntrySerializer(serializers.ModelSerializer):
    entry_date = serializers.DateTimeField()  # ← Explicitly declare as DateTimeField
    
    class Meta:
        model = JournalEntry
        fields = [
            'id', 'batch', 'container', 'user', 
            'entry_date',  # Now properly handled
            'category', 'severity', 'description',
            'resolution_status', 'resolution_notes',
            'created_at', 'updated_at'
        ]
```

### Option 2: Change Model (If only date is needed)

```python
# apps/health/models.py

class JournalEntry(models.Model):
    entry_date = models.DateField(default=timezone.now().date)  # ← Change to DateField
    # ... rest of model
```

**Migration Required**: If changing model, create migration:
```bash
python manage.py makemigrations health
python manage.py migrate
```

### Option 3: Custom Serializer Method (For Conversion)

```python
class JournalEntrySerializer(serializers.ModelSerializer):
    entry_date = serializers.SerializerMethodField()
    
    def get_entry_date(self, obj):
        # Convert datetime to date for serialization
        if obj.entry_date:
            return obj.entry_date.date() if hasattr(obj.entry_date, 'date') else obj.entry_date
        return None
    
    class Meta:
        model = JournalEntry
        fields = ['id', 'entry_date', ...]
```

## Recommended Fix: Option 1

**Use DateTimeField in serializer** because:
1. ✅ Model already stores datetime (no migration needed)
2. ✅ Preserves timezone information (important for global operations)
3. ✅ Frontend can handle datetime (already expects it)
4. ✅ Minimal code change
5. ✅ No data migration required

## Testing After Fix

```bash
# Test endpoint returns 200
curl "http://localhost:8000/api/v1/health/journal-entries/?batch__id=258" \
  -H "Authorization: Bearer $JWT_TOKEN"

# Should return 200 with JSON array:
{
  "count": 0,
  "next": null,
  "previous": null,
  "results": []
}
```

## Acceptance Criteria

- [ ] Endpoint returns 200 OK (not 500)
- [ ] entry_date serialized as ISO datetime string
- [ ] All existing tests pass
- [ ] Frontend Medical tab loads without 500 error
- [ ] No AssertionError in logs
- [ ] OpenAPI spec updated if field type changed

## Related Files

**Backend**:
- Model: `apps/health/models.py` (JournalEntry class)
- Serializer: `apps/health/api/serializers/` (find JournalEntrySerializer)
- Tests: `apps/health/tests/`

**Frontend** (Workaround Already Applied):
- Component: `client/src/components/batch-management/BatchHealthView.tsx:103`
- Graceful error handling: Returns empty array instead of crashing

## Additional Context

**DRF Behavior**:
Django REST Framework explicitly refuses to coerce datetime to date to prevent:
- Loss of timezone information
- Ambiguous date conversion
- Silent data corruption

This is a **protective feature** that caught the type mismatch!

---

**To Create Issue**:
```bash
cd /path/to/AquaMind
gh issue create \
  --title "Fix: JournalEntry serializer DateField/DateTimeField mismatch causing 500 errors" \
  --label "bug,backend,health,serializer,UAT-blocker" \
  --body-file /path/to/this/file.md
```

