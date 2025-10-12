# Form Field Mappings - Test vs Actual
**Generated**: 2025-10-12  
**Source**: Automated form inspection

This document maps test field names to actual form field names.

---

## Phase 1: Infrastructure

### Geography ✅
**Status**: No changes needed  
- `name` ✅
- `description` ✅

### Area ✅  
**Changes needed**:
- `max_capacity_kg` → `max_biomass` ✅ FIXED
- `geography` (dropdown) ✅
- `latitude` ✅
- `longitude` ✅

### Freshwater Station
**Changes needed**:
- `name` ✅
- `station_type` (dropdown) → Use label "Station Type" ✅
- `geography` (dropdown) → Use label "Geography" ✅
- `latitude` ✅
- `longitude` ✅
- `description` ✅

### Hall
**Changes needed**:
- `name` ✅
- `freshwater_station` (dropdown) → Use label "Freshwater Station" ✅
- `description` ✅
- ADD: `area_sqm` (optional field)

### Container Type
**Changes needed**:
- `name` ✅
- `category` (dropdown) → Use label "Category" ✅
- `capacity_liters` → `max_volume_m3` ❌
- `dimensions` → `description` ❌

### Container
**Note**: Form inspection showed Container Type fields (duplicate)
Need to re-inspect actual Container form
**Status**: NEEDS INSPECTION

### Sensor
**Changes needed**:
- `sensor_type` (dropdown) → Use label "Sensor Type" ✅
- `serial_number` ✅
- `container` (dropdown) → Use label "Container" ✅
- `installation_date` ✅
- `last_calibration_date` ✅
- `manufacturer` ✅

### Feed Container
**Changes needed**:
- `name` ✅
- `hall` (dropdown) → Use label "Hall" ✅
- `capacity_kg` ✅

---

## Phase 2: Batch

### Species
**Status**: ❌ CREATE BUTTON NOT FOUND
Need to check if button exists or has different name

### Lifecycle Stage
**Changes needed**:
- `name` ✅
- `species` (dropdown) ✅
- `min_weight_g` → `expected_weight_min_g` ❌
- `max_weight_g` → `expected_weight_max_g` ❌
- `duration_days` → NOT FOUND (may be `order`?) ❌

### Batch
**Changes needed**:
- `batch_number` ✅
- `species` (dropdown) ✅
- `lifecycle_stage` (dropdown) ✅
- `start_date` ✅
- `status` (dropdown) ✅
- `batch_type` (dropdown) ✅

### Batch Container Assignment
**Status**: ❌ CREATE BUTTON NOT FOUND

### Growth Sample
**Changes needed**:
- `batch_container_assignment` (dropdown) → Use label "Active Assignment" ✅
- `sample_date` ✅
- `sample_size` ✅
- `average_weight_g` → `avg_weight_g` ❌
- `average_length_cm` → `avg_length_cm` ❌

### Mortality Event
**Changes needed**:
- `batch_container_assignment` (dropdown) → Use label "Batch" ✅
- `event_date` ✅
- `count` → `mortality_count` ❌
- `cause` → `notes` ❌

---

## Phase 3: Inventory

### Feed
**Changes needed**:
- `name` ✅
- `brand` ✅
- `size_category` (dropdown) → Use label "Size Category" ✅
- `protein_percentage` ✅
- `fat_percentage` ✅
- ADD: `carbohydrate_percentage` (new field)
- `is_active` → checkbox (no name attribute)

### Feed Purchase
**Changes needed**:
- `feed` (dropdown) ✅
- `supplier` ✅
- `purchase_date` ✅
- `quantity_kg` ✅
- `cost_per_kg_dkk` → `cost_per_kg` ❌
- ADD: `batch_number`, `expiry_date` (new fields)

### Feed Container Stock
**Status**: ❌ CREATE BUTTON NOT FOUND

### Feeding Event
**Changes needed**:
- `batch` (dropdown) ✅
- `container` (dropdown) ✅
- `feed_stock` (dropdown) → Use label "Feed" ✅
- `feed_date` → `feeding_date` ❌
- `amount_fed_kg` → `amount_kg` ❌
- `feeding_method` (dropdown) ✅
- ADD: `feeding_time`, `batch_biomass_kg` (new fields)

---

## Summary of Changes Needed

### Quick Wins (Just Rename)
- Area: `max_capacity_kg` → `max_biomass` ✅ DONE
- Growth Sample: `average_weight_g` → `avg_weight_g`
- Growth Sample: `average_length_cm` → `avg_length_cm`
- Mortality: `count` → `mortality_count`
- Mortality: `cause` → `notes`
- Feed Purchase: `cost_per_kg_dkk` → `cost_per_kg`
- Feeding Event: `feed_date` → `feeding_date`
- Feeding Event: `amount_fed_kg` → `amount_kg`

### Moderate (Field Logic Changes)
- Container Type: `capacity_liters` → `max_volume_m3` (different units!)
- Container Type: `dimensions` → doesn't exist (use `description`?)
- Lifecycle Stage: `duration_days` → not found

### Blockers (Missing Buttons)
- Species - No create button found
- Batch Container Assignment - No create button found
- Feed Container Stock - No create button found

---

## Next Actions

1. ✅ Update field names in all tests
2. ✅ Investigate missing create buttons
3. ✅ Re-run full suite
4. ✅ Verify database with provided commands


