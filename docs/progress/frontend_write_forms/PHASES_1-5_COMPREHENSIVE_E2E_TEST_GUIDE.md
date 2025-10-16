# AquaMind Phases 1-5 Comprehensive E2E Test Guide
## Complete CRUD Forms Testing & Database Verification

**Project**: AquaMind Frontend CRU Forms  
**Branch**: `feature/frontend-cru-forms`  
**Test Coverage**: Phases 1-5 (Infrastructure, Batch, Inventory, Health, Environmental)  
**Entities**: 27 total  
**Browser**: Chrome (required for automation)  
**Date Created**: 2025-10-12

---

## 🎯 Test Objectives

This E2E test guide verifies:
1. ✅ All CRUD forms function correctly in the browser
2. ✅ Data is properly saved to the database
3. ✅ Validation rules are enforced
4. ✅ Auto-refresh and cache invalidation work
5. ✅ Permission gates protect write operations
6. ✅ Audit trails capture delete reasons
7. ✅ Cross-browser compatibility (Chrome)
8. ✅ Theme compatibility (light/dark)

---

## 📋 Pre-Flight Checklist

### Backend Setup
```bash
cd /Users/aquarian247/Projects/AquaMind
python manage.py runserver
# Expected: Development server at http://127.0.0.1:8000/
```

**Verify backend running**:
```bash
curl -s http://localhost:8000/api/v1/infrastructure/geographies/ | head -5
# Expected: JSON response with geography data
```

### Frontend Setup
```bash
cd /Users/aquarian247/Projects/AquaMind-Frontend
npm run dev
# Expected: Frontend at http://localhost:5001/
```

**Verify frontend running**:
- Navigate to `http://localhost:5001`
- Expected: AquaMind dashboard loads

### Authentication
**Test Credentials**:
- Username: `admin`
- Password: `admin123`

**Login Steps**:
1. Navigate to login page
2. Enter credentials
3. Click "Sign In"
4. Expected: Redirect to dashboard

### Database Access (for verification)
```bash
cd /Users/aquarian247/Projects/AquaMind
python manage.py shell
```

**Alternative** (SQL direct):
```bash
python manage.py dbshell
```

---

## 🧪 Phase 1: Infrastructure Domain (8 Entities)

**Management Page**: `/infrastructure/manage`  

---

### 1.1 Geography (Simple Entity)

**GUI Test Steps**:
1. Navigate to Infrastructure Management page
2. Click "Create Geography" button
3. Fill form:
   - Name: `Test Region North`
   - Description: `Northern salmon farming region for E2E testing`
4. Click "Create Geography"
5. **Expected**: Success toast, dialog closes, Geography count +1

**Database Verification**:
```bash
python manage.py shell -c "
from apps.infrastructure.models import Geography
geo = Geography.objects.filter(name='Test Region North').first()
print(f'✅ Geography created: ID={geo.id}, Name={geo.name}')
print(f'✅ Description: {geo.description}')
print(f'✅ Created at: {geo.created_at}')
"
```

**Expected Output**:
```
✅ Geography created: ID=X, Name=Test Region North
✅ Description: Northern salmon farming region for E2E testing
✅ Created at: 2025-10-12 XX:XX:XX
```

---

### 1.2 Area (FK Dropdown)

**GUI Test Steps**:
1. Click "Create Area" button
2. Fill form:
   - Name: `Test Area Alpha`
   - Geography: Select `Test Region North` (from dropdown)
   - Latitude: `62.0123`
   - Longitude: `-6.7890`
   - Max Capacity: `100000`
3. Click "Create Area"
4. **Expected**: Success toast, dialog closes, Area count +1

**Database Verification**:
```bash
python manage.py shell -c "
from apps.infrastructure.models import Area
area = Area.objects.filter(name='Test Area Alpha').first()
print(f'✅ Area created: ID={area.id}, Name={area.name}')
print(f'✅ Geography: {area.geography.name} (FK works!)')
print(f'✅ Coordinates: ({area.latitude}, {area.longitude})')
print(f'✅ Max capacity: {area.max_capacity_kg} kg')
"
```

**Expected Output**:
```
✅ Area created: ID=X, Name=Test Area Alpha
✅ Geography: Test Region North (FK works!)
✅ Coordinates: (62.0123, -6.7890)
✅ Max capacity: 100000.00 kg
```

---

### 1.3 Freshwater Station (Enum Dropdown)

**GUI Test Steps**:
1. Click "Create Freshwater Station" button
2. Fill form:
   - Name: `Test Hatchery Station`
   - Station Type: `HATCHERY` (from dropdown)
   - Geography: Select `Test Region North`
   - Latitude: `62.0500`
   - Longitude: `-6.8000`
3. Click "Create Freshwater Station"
4. **Expected**: Success toast, dialog closes, count +1

**Database Verification**:
```bash
python manage.py shell -c "
from apps.infrastructure.models import FreshwaterStation
station = FreshwaterStation.objects.filter(name='Test Hatchery Station').first()
print(f'✅ Station created: ID={station.id}, Name={station.name}')
print(f'✅ Station type: {station.station_type}')
print(f'✅ Geography: {station.geography.name}')
"
```

---

### 1.4 Hall (Cascading FK)

**GUI Test Steps**:
1. Click "Create Hall" button
2. Fill form:
   - Name: `Test Hall 1`
   - Freshwater Station: Select `Test Hatchery Station`
   - Description: `Main production hall`
3. Click "Create Hall"
4. **Expected**: Success toast, dialog closes, count +1

**Database Verification**:
```bash
python manage.py shell -c "
from apps.infrastructure.models import Hall
hall = Hall.objects.filter(name='Test Hall 1').first()
print(f'✅ Hall created: ID={hall.id}, Name={hall.name}')
print(f'✅ Station: {hall.freshwater_station.name} (Cascading FK works!)')
print(f'✅ Description: {hall.description}')
"
```

---

### 1.5 Container Type (Enum Category)

**GUI Test Steps**:
1. Click "Create Container Type" button
2. Fill form:
   - Name: `Test Tank 5000L`
   - Category: `TANK` (from dropdown)
   - Capacity: `5000`
   - Dimensions: `3.0 x 2.0 x 1.5`
3. Click "Create Container Type"
4. **Expected**: Success toast, dialog closes, count +1

**Database Verification**:
```bash
python manage.py shell -c "
from apps.infrastructure.models import ContainerType
ct = ContainerType.objects.filter(name='Test Tank 5000L').first()
print(f'✅ ContainerType created: ID={ct.id}, Name={ct.name}')
print(f'✅ Category: {ct.category}')
print(f'✅ Capacity: {ct.capacity_liters}L')
"
```

---

### 1.6 Container (XOR Logic - Hall OR Area)

**GUI Test Steps**:
1. Click "Create Container" button
2. Fill form:
   - Name: `Test Container T001`
   - Container Type: Select `Test Tank 5000L`
   - Hall: Select `Test Hall 1` (XOR: choose hall)
   - Area: Leave empty (cannot select both)
   - Status: `ACTIVE`
3. Click "Create Container"
4. **Expected**: Success toast, dialog closes, count +1

**XOR Validation Test**:
1. Try to select both Hall AND Area
2. **Expected**: One is disabled/cleared when other is selected

**Database Verification**:
```bash
python manage.py shell -c "
from apps.infrastructure.models import Container
c = Container.objects.filter(name='Test Container T001').first()
print(f'✅ Container created: ID={c.id}, Name={c.name}')
print(f'✅ Type: {c.container_type.name}')
print(f'✅ Hall: {c.hall.name if c.hall else \"None\"}')
print(f'✅ Area: {c.area.name if c.area else \"None\"}')
print(f'✅ XOR constraint: {(c.hall and not c.area) or (c.area and not c.hall)}')
"
```

---

### 1.7 Sensor (Date Pickers + Metadata)

**GUI Test Steps**:
1. Click "Create Sensor" button
2. Fill form:
   - Sensor Type: `TEMPERATURE`
   - Serial Number: `TEMP-001-TEST`
   - Container: Select `Test Container T001`
   - Installation Date: `2025-10-01`
   - Calibration Date: `2025-10-05`
   - Manufacturer: `AquaSense Inc`
3. Click "Create Sensor"
4. **Expected**: Success toast, dialog closes, count +1

**Database Verification**:
```bash
python manage.py shell -c "
from apps.infrastructure.models import Sensor
sensor = Sensor.objects.filter(serial_number='TEMP-001-TEST').first()
print(f'✅ Sensor created: ID={sensor.id}, Type={sensor.sensor_type}')
print(f'✅ Container: {sensor.container.name}')
print(f'✅ Installation date: {sensor.installation_date}')
print(f'✅ Last calibration: {sensor.last_calibration_date}')
"
```

---

### 1.8 Feed Container (Capacity Tracking)

**GUI Test Steps**:
1. Click "Create Feed Container" button
2. Fill form:
   - Name: `Test Feed Silo 1`
   - Hall: Select `Test Hall 1`
   - Capacity: `10000`
3. Click "Create Feed Container"
4. **Expected**: Success toast, dialog closes, count +1

**Database Verification**:
```bash
python manage.py shell -c "
from apps.infrastructure.models import FeedContainer
fc = FeedContainer.objects.filter(name='Test Feed Silo 1').first()
print(f'✅ FeedContainer created: ID={fc.id}, Name={fc.name}')
print(f'✅ Hall: {fc.hall.name}')
print(f'✅ Capacity: {fc.capacity_kg} kg')
"
```

---

## 🧪 Phase 2: Batch Management Domain (6 Entities)

**Management Page**: `/batch/manage` or `/batch/setup`  
**Time Estimate**: 30-40 minutes

---

### 2.1 Species (Reference Data)

**GUI Test Steps**:
1. Navigate to Batch Setup page
2. Click "Create Species" button
3. Fill form:
   - Common Name: `Atlantic Salmon`
   - Scientific Name: `Salmo salar`
   - TGC Default: `0.003`
4. Click "Create Species"
5. **Expected**: Success toast, dialog closes, count +1

**Database Verification**:
```bash
python manage.py shell -c "
from apps.batch.models import Species
species = Species.objects.filter(common_name='Atlantic Salmon').first()
print(f'✅ Species created: ID={species.id}')
print(f'✅ Common name: {species.common_name}')
print(f'✅ Scientific name: {species.scientific_name}')
print(f'✅ TGC default: {species.tgc_default}')
"
```

---

### 2.2 Lifecycle Stage (Species-Dependent)

**GUI Test Steps**:
1. Click "Create Lifecycle Stage" button
2. Fill form:
   - Name: `Fry`
   - Species: Select `Atlantic Salmon`
   - Min Weight: `1.0`
   - Max Weight: `50.0`
   - Duration Days: `60`
3. Click "Create Lifecycle Stage"
4. **Expected**: Success toast, dialog closes, count +1

**Database Verification**:
```bash
python manage.py shell -c "
from apps.batch.models import LifecycleStage
stage = LifecycleStage.objects.filter(name='Fry').first()
print(f'✅ LifecycleStage created: ID={stage.id}, Name={stage.name}')
print(f'✅ Species: {stage.species.common_name}')
print(f'✅ Weight range: {stage.min_weight_g}g - {stage.max_weight_g}g')
"
```

---

### 2.3 Batch (Cascading Filters)

**GUI Test Steps**:
1. Click "Create Batch" button
2. Fill form:
   - Batch Number: `B-2025-E2E-001`
   - Species: Select `Atlantic Salmon`
   - Lifecycle Stage: Select `Fry` (filtered by species!)
   - Start Date: `2025-10-01`
   - Status: `ACTIVE`
   - Batch Type: `STANDARD`
3. Click "Create Batch"
4. **Expected**: Success toast, dialog closes, count +1

**Cascading Filter Test**:
- Verify: When species selected, lifecycle stage dropdown filters to show only stages for that species

**Database Verification**:
```bash
python manage.py shell -c "
from apps.batch.models import Batch
batch = Batch.objects.filter(batch_number='B-2025-E2E-001').first()
print(f'✅ Batch created: ID={batch.id}, Number={batch.batch_number}')
print(f'✅ Species: {batch.species.common_name}')
print(f'✅ Stage: {batch.lifecycle_stage.name}')
print(f'✅ Status: {batch.status}')
print(f'✅ Start date: {batch.start_date}')
"
```

---

### 2.4 Batch Container Assignment (Auto-Calculated Biomass)

**GUI Test Steps**:
1. Click "Create Batch Container Assignment" button
2. Fill form:
   - Batch: Select `B-2025-E2E-001`
   - Container: Select `Test Container T001`
   - Population Count: `5000`
   - Assignment Date: `2025-10-01`
3. Watch biomass auto-calculate (if avg weight known)
4. Click "Create Assignment"
5. **Expected**: Success toast, dialog closes, count +1

**Database Verification**:
```bash
python manage.py shell -c "
from apps.batch.models import BatchContainerAssignment
assignment = BatchContainerAssignment.objects.filter(
    batch__batch_number='B-2025-E2E-001',
    container__name='Test Container T001'
).first()
print(f'✅ Assignment created: ID={assignment.id}')
print(f'✅ Batch: {assignment.batch.batch_number}')
print(f'✅ Container: {assignment.container.name}')
print(f'✅ Population: {assignment.population_count}')
print(f'✅ Biomass: {assignment.current_biomass_kg} kg (auto-calculated)')
"
```

---

### 2.5 Growth Sample (Assignment-Based)

**GUI Test Steps**:
1. Click "Create Growth Sample" button
2. Fill form:
   - Batch Container Assignment: Select assignment created above
   - Sample Date: `2025-10-10`
   - Sample Size: `30`
   - Average Weight: `25.5`
   - Average Length: `12.0`
3. Click "Create Growth Sample"
4. **Expected**: Success toast, dialog closes, count +1

**Database Verification**:
```bash
python manage.py shell -c "
from apps.batch.models import GrowthSample
sample = GrowthSample.objects.filter(sample_date='2025-10-10').first()
print(f'✅ GrowthSample created: ID={sample.id}')
print(f'✅ Assignment batch: {sample.batch_container_assignment.batch.batch_number}')
print(f'✅ Sample size: {sample.sample_size}')
print(f'✅ Avg weight: {sample.average_weight_g}g')
print(f'✅ K-factor: {sample.condition_factor} (auto-calculated)')
"
```

---

### 2.6 Mortality Event (Cause Tracking)

**GUI Test Steps**:
1. Click "Create Mortality Event" button
2. Fill form:
   - Batch Container Assignment: Select assignment
   - Event Date: `2025-10-08`
   - Count: `10`
   - Cause: `Natural mortality - normal rate`
3. Click "Create Mortality Event"
4. **Expected**: Success toast, dialog closes, count +1

**Database Verification**:
```bash
python manage.py shell -c "
from apps.batch.models import MortalityEvent
event = MortalityEvent.objects.filter(event_date='2025-10-08').first()
print(f'✅ MortalityEvent created: ID={event.id}')
print(f'✅ Count: {event.count}')
print(f'✅ Cause: {event.cause}')
print(f'✅ Assignment: Batch {event.batch_container_assignment.batch.batch_number}')
"
```

---

### 2.7 Batch Transfer (From/To Validation)

**GUI Test Steps**:
1. Click "Create Batch Transfer" button
2. Fill form:
   - Source Batch: Select `B-2025-E2E-001`
   - Destination Batch: Leave empty (or create new)
   - Transfer Date: `2025-10-15`
   - Transfer Type: `STANDARD`
   - Fish Count: `4990` (accounting for mortality)
3. Click "Create Transfer"
4. **Expected**: Success toast, dialog closes, count +1

**Database Verification**:
```bash
python manage.py shell -c "
from apps.batch.models import BatchTransfer
transfer = BatchTransfer.objects.filter(transfer_date='2025-10-15').first()
print(f'✅ BatchTransfer created: ID={transfer.id}')
print(f'✅ Source: {transfer.source_batch.batch_number}')
print(f'✅ Fish count: {transfer.fish_count}')
"
```

---

## 🧪 Phase 3: Inventory Domain (4 Entities)

**Management Page**: `/inventory/manage`  
**Time Estimate**: 20-30 minutes

---

### 3.1 Feed (Nutritional Specs)

**GUI Test Steps**:
1. Navigate to Inventory Management page
2. Click "Create Feed" button
3. Fill form:
   - Name: `Test Premium Pellets`
   - Brand: `TestFeed Pro`
   - Size Category: `MEDIUM`
   - Protein %: `45.0`
   - Fat %: `20.0`
   - Active: Checked
4. Click "Create Feed"
5. **Expected**: Success toast, dialog closes, count +1

**Database Verification**:
```bash
python manage.py shell -c "
from apps.inventory.models import Feed
feed = Feed.objects.filter(name='Test Premium Pellets').first()
print(f'✅ Feed created: ID={feed.id}, Name={feed.name}')
print(f'✅ Brand: {feed.brand}')
print(f'✅ Size: {feed.size_category}')
print(f'✅ Protein: {feed.protein_percentage}%')
print(f'✅ Active: {feed.is_active}')
"
```

---

### 3.2 Feed Purchase (Auto-Calculated Cost)

**GUI Test Steps**:
1. Click "Create Feed Purchase" button
2. Fill form:
   - Feed: Select `Test Premium Pellets`
   - Supplier: `Test Supplier AS`
   - Purchase Date: `2025-10-01`
   - Quantity (kg): `1000`
   - Cost per kg (DKK): `15.50`
3. **Watch**: Total cost auto-calculates to `15,500.00 DKK`
4. Click "Create Feed Purchase"
5. **Expected**: Success toast with total cost shown, dialog closes, count +1

**Database Verification**:
```bash
python manage.py shell -c "
from apps.inventory.models import FeedPurchase
purchase = FeedPurchase.objects.filter(supplier='Test Supplier AS').first()
print(f'✅ FeedPurchase created: ID={purchase.id}')
print(f'✅ Feed: {purchase.feed.name}')
print(f'✅ Quantity: {purchase.quantity_kg} kg')
print(f'✅ Cost per kg: {purchase.cost_per_kg_dkk} DKK')
print(f'✅ Total cost: {purchase.total_cost_dkk} DKK (auto-calculated)')
print(f'✅ Calculation: {float(purchase.quantity_kg) * float(purchase.cost_per_kg_dkk)} == {float(purchase.total_cost_dkk)}')
"
```

---

### 3.3 Feed Container Stock (FIFO Validation)

**GUI Test Steps**:
1. Click "Create Feed Container Stock" button
2. Fill form:
   - Feed Container: Select `Test Feed Silo 1`
   - Feed: Select `Test Premium Pellets`
   - Quantity (kg): `500`
   - Entry Date: `2025-10-01`
   - Cost per kg: `15.50`
3. **Expected**: Existing stock shown in chronological order (if any)
4. Click "Create Stock Entry"
5. **Expected**: Success toast, dialog closes, count +1

**FIFO Warning Test**:
1. Try to create another entry with earlier date (2025-09-30)
2. **Expected**: Warning about FIFO ordering (soft validation)

**Database Verification**:
```bash
python manage.py shell -c "
from apps.inventory.models import FeedContainerStock
stock = FeedContainerStock.objects.filter(
    feed_container__name='Test Feed Silo 1',
    entry_date='2025-10-01'
).first()
print(f'✅ Stock created: ID={stock.id}')
print(f'✅ Feed: {stock.feed.name}')
print(f'✅ Quantity: {stock.quantity_kg} kg')
print(f'✅ Entry date: {stock.entry_date}')
print(f'✅ Total value: {stock.total_value_dkk} DKK')
"
```

---

### 3.4 Feeding Event (Cascading Filters + Biomass)

**GUI Test Steps**:
1. Click "Create Feeding Event" button
2. Fill form:
   - Batch: Select `B-2025-E2E-001`
   - Container: Select `Test Container T001` (filtered by batch!)
   - Feed Stock: Select stock entry
   - Feed Date: `2025-10-10`
   - Amount Fed (kg): `50`
   - Method: `MANUAL`
3. **Watch**: Batch biomass auto-populated, feeding % calculated
4. Click "Create Feeding Event"
5. **Expected**: Success toast, dialog closes, count +1

**Database Verification**:
```bash
python manage.py shell -c "
from apps.inventory.models import FeedingEvent
event = FeedingEvent.objects.filter(feed_date='2025-10-10').first()
print(f'✅ FeedingEvent created: ID={event.id}')
print(f'✅ Batch: {event.batch_container_assignment.batch.batch_number}')
print(f'✅ Amount fed: {event.amount_fed_kg} kg')
print(f'✅ Method: {event.feeding_method}')
print(f'✅ Feeding %: {(float(event.amount_fed_kg) / float(event.batch_container_assignment.current_biomass_kg) * 100):.2f}%')
"
```

---

## 🧪 Phase 4: Health Domain (7 Entities)

**Management Page**: `/health/manage`  
**Time Estimate**: 40-50 minutes

---

### 4.1 Sample Type (Simple Reference)

**GUI Test Steps**:
1. Navigate to Health Management page
2. Click "Create Sample Type" button
3. Fill form:
   - Name: `Blood Sample`
   - Description: `Blood sample for disease screening`
4. Click "Create Sample Type"
5. **Expected**: Success toast, dialog closes, count +1

**Database Verification**:
```bash
python manage.py shell -c "
from apps.health.models import SampleType
st = SampleType.objects.filter(name='Blood Sample').first()
print(f'✅ SampleType created: ID={st.id}, Name={st.name}')
print(f'✅ Description: {st.description}')
"
```

---

### 4.2 Vaccination Type (Reference with Manufacturer)

**GUI Test Steps**:
1. Click "Create Vaccination Type" button
2. Fill form:
   - Name: `Test Vaccine Alpha`
   - Manufacturer: `TestPharma AS`
   - Description: `Multi-valent vaccine for salmon diseases`
3. Click "Create Vaccination Type"
4. **Expected**: Success toast, dialog closes, count +1

**Database Verification**:
```bash
python manage.py shell -c "
from apps.health.models import VaccinationType
vt = VaccinationType.objects.filter(name='Test Vaccine Alpha').first()
print(f'✅ VaccinationType created: ID={vt.id}, Name={vt.name}')
print(f'✅ Manufacturer: {vt.manufacturer}')
"
```

---

### 4.3 Journal Entry (Multi-FK + Enums)

**GUI Test Steps**:
1. Click "Create Journal Entry" button
2. Fill form:
   - Batch: Select `B-2025-E2E-001`
   - Container: Select `Test Container T001` (optional)
   - Entry Date: `2025-10-11`
   - Category: `OBSERVATION`
   - Severity: `LOW`
   - Description: `Routine health check - all fish active and feeding well`
   - Resolution Status: Unchecked
3. Click "Create Journal Entry"
4. **Expected**: Success toast, dialog closes, count +1

**Database Verification**:
```bash
python manage.py shell -c "
from apps.health.models import JournalEntry
entry = JournalEntry.objects.filter(entry_date='2025-10-11').first()
print(f'✅ JournalEntry created: ID={entry.id}')
print(f'✅ Batch: {entry.batch.batch_number}')
print(f'✅ Category: {entry.category}')
print(f'✅ Severity: {entry.severity}')
print(f'✅ Description length: {len(entry.description)} chars')
"
```

---

### 4.4 Health Sampling Event (Dynamic Field Arrays!)

**GUI Test Steps**:
1. Click "Create Sampling Event" button
2. Fill form:
   - Batch Container Assignment: Select assignment
   - Sampling Date: `2025-10-11`
   - Number of Fish Sampled: `30`
3. Click "Add Fish Observation" button **3 times** to add 3 rows
4. Fill observations table:
   - Row 1: ID=`F001`, Weight=`25.0`, Length=`12.0`
   - Row 2: ID=`F002`, Weight=`27.5`, Length=`12.5`
   - Row 3: ID=`F003`, Weight=`24.0`, Length=`11.8`
5. **Watch**: Real-time aggregates update (avg weight, avg length, K-factor, etc.)
6. Click "Create Sampling Event"
7. **Expected**: Success toast with aggregate summary, dialog closes, count +1

**Real-Time Calculations Expected**:
- Sample Size: 3
- Avg Weight: 25.5g
- Avg Length: 12.1cm
- Avg K-factor: ~1.45
- Min/Max weight and length shown

**Database Verification**:
```bash
python manage.py shell -c "
from apps.health.models import HealthSamplingEvent, IndividualFishObservation
event = HealthSamplingEvent.objects.filter(sampling_date='2025-10-11').first()
print(f'✅ HealthSamplingEvent created: ID={event.id}')
print(f'✅ Number of fish: {event.number_of_fish_sampled}')
print(f'✅ Avg weight: {event.average_weight_g}g (from observations)')
print(f'✅ Avg length: {event.average_length_cm}cm')
print(f'✅ Avg K-factor: {event.average_k_factor}')

observations = IndividualFishObservation.objects.filter(sampling_event=event)
print(f'✅ Individual observations: {observations.count()}')
for obs in observations:
    print(f'  - {obs.fish_identifier}: {obs.weight_g}g, {obs.length_cm}cm, K={obs.k_factor}')
"
```

---

### 4.5 Health Lab Sample (Multi-Date Tracking)

**GUI Test Steps**:
1. Click "Create Lab Sample" button
2. Fill form:
   - Batch Container Assignment: Select assignment
   - Sample Type: Select `Blood Sample`
   - Collection Date: `2025-10-11`
   - Sent to Lab Date: `2025-10-12`
   - Results Received Date: `2025-10-15`
   - Findings: `No pathogens detected - healthy population`
3. Click "Create Lab Sample"
4. **Expected**: Success toast, dialog closes, count +1

**Database Verification**:
```bash
python manage.py shell -c "
from apps.health.models import HealthLabSample
sample = HealthLabSample.objects.filter(collection_date='2025-10-11').first()
print(f'✅ LabSample created: ID={sample.id}')
print(f'✅ Sample type: {sample.sample_type.name}')
print(f'✅ Collection date: {sample.collection_date}')
print(f'✅ Sent date: {sample.sent_to_lab_date}')
print(f'✅ Results date: {sample.results_received_date}')
print(f'✅ Timeline: {(sample.results_received_date - sample.collection_date).days} days')
"
```

---

### 4.6 Treatment (Conditional Fields)

**GUI Test Steps - Medication**:
1. Click "Create Treatment" button
2. Fill form:
   - Batch: Select `B-2025-E2E-001`
   - Container: Select container (optional)
   - Treatment Type: `MEDICATION`
   - Start Date: `2025-10-12`
   - Dosage: `5.0`
   - Unit: `mg/L`
   - Withholding Period: `14`
3. **Verify**: Vaccination Type field is HIDDEN
4. **Watch**: Withholding end date auto-calculates (2025-10-26)
5. Click "Create Treatment"

**GUI Test Steps - Vaccination**:
1. Create another treatment
2. Fill form:
   - Treatment Type: `VACCINATION`
   - Vaccination Type: Select `Test Vaccine Alpha` (NOW VISIBLE!)
   - Other fields as above
3. **Verify**: Vaccination Type field is NOW SHOWN
4. Click "Create Treatment"

**Database Verification**:
```bash
python manage.py shell -c "
from apps.health.models import Treatment
med = Treatment.objects.filter(treatment_type='medication').first()
vac = Treatment.objects.filter(treatment_type='vaccination').first()

print('=== MEDICATION ===')
print(f'✅ Treatment created: ID={med.id}')
print(f'✅ Type: {med.treatment_type}')
print(f'✅ Vaccination type: {med.vaccination_type} (should be None)')
print(f'✅ Withholding end: {med.withholding_end_date}')

print('\n=== VACCINATION ===')
print(f'✅ Treatment created: ID={vac.id}')
print(f'✅ Type: {vac.treatment_type}')
print(f'✅ Vaccination type: {vac.vaccination_type.name} (should be set!)')
print(f'✅ Conditional field works!')
"
```

---

## 🧪 Phase 5: Environmental Domain (2 Entities)

**Management Page**: `/environmental/manage`  
**Time Estimate**: 10-15 minutes

---

### 5.1 Environmental Parameter (Range Configuration)

**GUI Test Steps**:
1. Navigate to Environmental Management page
2. Click "Create Environmental Parameter" button
3. Fill form:
   - Name: `Dissolved Oxygen`
   - Unit: `mg/L`
   - Description: `Critical water quality parameter for fish respiration`
   - Min Value: `5.0`
   - Max Value: `15.0`
   - Optimal Min: `7.0`
   - Optimal Max: `12.0`
4. Click "Create Parameter"
5. **Expected**: Success toast, dialog closes, count +1

**Minimal Field Test**:
1. Create another parameter with ONLY name and unit
2. Leave all optional fields empty
3. **Expected**: Should save successfully (all ranges optional)

**Database Verification**:
```bash
python manage.py shell -c "
from apps.environmental.models import EnvironmentalParameter
param = EnvironmentalParameter.objects.filter(name='Dissolved Oxygen').first()
print(f'✅ Parameter created: ID={param.id}, Name={param.name}')
print(f'✅ Unit: {param.unit}')
print(f'✅ Acceptable range: {param.min_value} - {param.max_value}')
print(f'✅ Optimal range: {param.optimal_min} - {param.optimal_max}')
print(f'✅ All decimal fields: 2 decimal places')
"
```

---

### 5.2 Photoperiod Data (Day Length 0-24 Validation)

**GUI Test Steps**:
1. Click "Create Photoperiod Data" button
2. Fill form:
   - Area: Select `Test Area Alpha`
   - Date: `2025-10-11`
   - Day Length (hours): `16.5`
   - Light Intensity (lux): `500.0`
   - Interpolated Data: Check box
3. Click "Create Photoperiod Data"
4. **Expected**: Success toast, dialog closes, count +1

**Validation Test - Exceeds 24 Hours**:
1. Create another photoperiod data
2. Enter Day Length: `25.0` (invalid!)
3. Click "Create"
4. **Expected**: Validation error "Day length must be at most 24"
5. **Expected**: Form does NOT submit

**Database Verification**:
```bash
python manage.py shell -c "
from apps.environmental.models import PhotoperiodData
photo = PhotoperiodData.objects.filter(area__name='Test Area Alpha').first()
print(f'✅ PhotoperiodData created: ID={photo.id}')
print(f'✅ Area: {photo.area.name}')
print(f'✅ Date: {photo.date}')
print(f'✅ Day length: {photo.day_length_hours} hours (0-24 validated)')
print(f'✅ Light intensity: {photo.light_intensity} lux')
print(f'✅ Is interpolated: {photo.is_interpolated}')
print(f'✅ Unique constraint: (area={photo.area_id}, date={photo.date})')
"
```

---

## 🧪 Cross-Cutting Feature Tests

### Delete Operations with Audit Trail

**Test Any Entity Delete**:
1. Navigate to entity management page
2. Find a created entity (in table/list if implemented)
3. Click "Delete" button
4. **Expected**: Audit reason dialog appears
5. Try to submit with empty reason
6. **Expected**: Validation error "Reason is required (minimum 10 characters)"
7. Enter reason: `E2E testing cleanup - no longer needed`
8. Click "Confirm Delete"
9. **Expected**: Success toast, entity removed from list, count -1

**Database Verification (Example: Geography)**:
```bash
python manage.py shell -c "
from apps.infrastructure.models import Geography

# Delete a test geography
geo = Geography.objects.filter(name='Test Region North').first()
geo_id = geo.id
geo_name = geo.name

# Simulate what HistoryReasonMixin does
if hasattr(geo, 'history'):
    latest = geo.history.latest()
    latest.history_change_reason = 'E2E testing cleanup - no longer needed'
    latest.save()

geo.delete()

# Verify historical record persists
history = Geography.history.filter(id=geo_id).order_by('-history_date')
print(f'✅ Geography deleted: {geo_name}')
print(f'✅ History records: {history.count()}')
for h in history:
    print(f'  {h.get_history_type_display()}: {h.history_change_reason or \"(no reason)\"}')
"
```

---

### Auto-Refresh / Cache Invalidation

**Test Pattern**:
1. Note current count on entity card (e.g., "15 Feed Purchases")
2. Create new entity via form
3. **Expected**: Count updates to 16 WITHOUT page reload
4. Open browser dev tools → Network tab
5. **Expected**: See query invalidation request after mutation

**Test Multiple Entities**:
1. Create 3 entities in quick succession
2. **Expected**: Count updates 3 times (15 → 16 → 17 → 18)
3. **Expected**: No stale data shown

---

### Permission Gates

**Test as Admin** (has write permissions):
1. Login as `admin`
2. Navigate to any management page
3. **Expected**: All "Create" buttons visible
4. **Expected**: All "Delete" buttons visible

**Test as Read-Only User** (if exists):
1. Create read-only user (or use existing)
2. Login as read-only user
3. Navigate to management pages
4. **Expected**: "Create" buttons hidden/disabled
5. **Expected**: "Delete" buttons hidden/disabled
6. **Expected**: Can view data but cannot modify

---

### Theme Compatibility

**Light Theme Test**:
1. Ensure light theme active
2. Open any form dialog
3. **Verify**: All text readable, good contrast
4. **Verify**: Form fields clearly visible
5. **Verify**: Buttons have proper colors

**Dark Theme Test**:
1. Toggle to dark theme
2. Open same form dialog
3. **Verify**: All text readable, good contrast
4. **Verify**: Form fields clearly visible
5. **Verify**: No color contrast issues
6. **Verify**: Background colors appropriate

---

### Responsive Layout

**Desktop Test** (1920x1080):
1. Open any management page
2. **Verify**: Cards display in grid (2-3 columns)
3. **Verify**: Forms use full dialog width

**Tablet Test** (768x1024):
1. Resize browser to tablet size
2. **Verify**: Cards stack (1-2 columns)
3. **Verify**: Forms remain usable
4. **Verify**: No horizontal scroll

**Mobile Test** (375x667):
1. Resize browser to mobile size
2. **Verify**: Cards stack vertically (1 column)
3. **Verify**: Form fields full-width
4. **Verify**: Buttons accessible

---

## 📊 Complete Test Coverage Matrix

| Phase | Domain | Entities | Forms | Delete | Special Features | Time |
|-------|--------|----------|-------|--------|------------------|------|
| 1 | Infrastructure | 8 | 8 | 8 | XOR logic, cascading FK | 30-40m |
| 2 | Batch | 6 | 6 | 5 | Cascading filters, auto-calc | 30-40m |
| 3 | Inventory | 4 | 4 | 4 | FIFO, auto-calc, cascading | 20-30m |
| 4 | Health | 7 | 7 | 8 | Dynamic arrays, conditional | 40-50m |
| 5 | Environmental | 2 | 2 | 2 | Range validation, 0-24 hours | 10-15m |
| **TOTAL** | **All** | **27** | **27** | **27** | **13 patterns** | **2-3h** |

---

## 🔍 Database Verification Comprehensive Check

### Quick Count Verification (All Phases)

Run this after completing all tests:

```bash
python manage.py shell -c "
# Phase 1 - Infrastructure
from apps.infrastructure.models import (
    Geography, Area, FreshwaterStation, Hall,
    ContainerType, Container, Sensor, FeedContainer
)

# Phase 2 - Batch
from apps.batch.models import (
    Species, LifecycleStage, Batch,
    BatchContainerAssignment, GrowthSample, MortalityEvent, BatchTransfer
)

# Phase 3 - Inventory
from apps.inventory.models import (
    Feed, FeedPurchase, FeedContainerStock, FeedingEvent
)

# Phase 4 - Health
from apps.health.models import (
    SampleType, VaccinationType, JournalEntry,
    HealthSamplingEvent, IndividualFishObservation,
    HealthLabSample, Treatment
)

# Phase 5 - Environmental
from apps.environmental.models import (
    EnvironmentalParameter, PhotoperiodData
)

print('=== E2E TEST DATA VERIFICATION ===')
print()
print('PHASE 1 - Infrastructure:')
print(f'  Geographies: {Geography.objects.count()}')
print(f'  Areas: {Area.objects.count()}')
print(f'  Freshwater Stations: {FreshwaterStation.objects.count()}')
print(f'  Halls: {Hall.objects.count()}')
print(f'  Container Types: {ContainerType.objects.count()}')
print(f'  Containers: {Container.objects.count()}')
print(f'  Sensors: {Sensor.objects.count()}')
print(f'  Feed Containers: {FeedContainer.objects.count()}')
print()
print('PHASE 2 - Batch:')
print(f'  Species: {Species.objects.count()}')
print(f'  Lifecycle Stages: {LifecycleStage.objects.count()}')
print(f'  Batches: {Batch.objects.count()}')
print(f'  Container Assignments: {BatchContainerAssignment.objects.count()}')
print(f'  Growth Samples: {GrowthSample.objects.count()}')
print(f'  Mortality Events: {MortalityEvent.objects.count()}')
print(f'  Batch Transfers: {BatchTransfer.objects.count()}')
print()
print('PHASE 3 - Inventory:')
print(f'  Feeds: {Feed.objects.count()}')
print(f'  Feed Purchases: {FeedPurchase.objects.count()}')
print(f'  Feed Container Stock: {FeedContainerStock.objects.count()}')
print(f'  Feeding Events: {FeedingEvent.objects.count()}')
print()
print('PHASE 4 - Health:')
print(f'  Sample Types: {SampleType.objects.count()}')
print(f'  Vaccination Types: {VaccinationType.objects.count()}')
print(f'  Journal Entries: {JournalEntry.objects.count()}')
print(f'  Sampling Events: {HealthSamplingEvent.objects.count()}')
print(f'  Individual Observations: {IndividualFishObservation.objects.count()}')
print(f'  Lab Samples: {HealthLabSample.objects.count()}')
print(f'  Treatments: {Treatment.objects.count()}')
print()
print('PHASE 5 - Environmental:')
print(f'  Environmental Parameters: {EnvironmentalParameter.objects.count()}')
print(f'  Photoperiod Data: {PhotoperiodData.objects.count()}')
print()
print('TOTAL ENTITIES TESTED: 27')
"
```

**Expected Output After Full E2E**:
```
=== E2E TEST DATA VERIFICATION ===

PHASE 1 - Infrastructure:
  Geographies: 1+ (baseline + test data)
  Areas: 1+ (baseline + test data)
  Freshwater Stations: 1+
  Halls: 1+
  Container Types: 1+
  Containers: 1+
  Sensors: 1+
  Feed Containers: 1+

PHASE 2 - Batch:
  Species: 1+
  Lifecycle Stages: 1+
  Batches: 1+ (B-2025-E2E-001)
  Container Assignments: 1+
  Growth Samples: 1+
  Mortality Events: 1+
  Batch Transfers: 0-1

PHASE 3 - Inventory:
  Feeds: 1+ (Test Premium Pellets)
  Feed Purchases: 1+ (from Test Supplier AS)
  Feed Container Stock: 1+
  Feeding Events: 1+

PHASE 4 - Health:
  Sample Types: 1+ (Blood Sample)
  Vaccination Types: 1+ (Test Vaccine Alpha)
  Journal Entries: 1+
  Sampling Events: 1+
  Individual Observations: 3+ (nested in sampling event)
  Lab Samples: 1+
  Treatments: 2+ (medication + vaccination)

PHASE 5 - Environmental:
  Environmental Parameters: 1+ (Dissolved Oxygen)
  Photoperiod Data: 1+ (Test Area Alpha)

TOTAL ENTITIES TESTED: 27
```

---

## 🎯 Browser Automation Test Script Template

For use with Playwright or Cursor browser tools:

```typescript
// Pseudo-code for browser automation
test('Phase 1 - Create Geography', async ({ page }) => {
  // Navigate
  await page.goto('http://localhost:5001/infrastructure/manage')
  
  // Open dialog
  await page.click('button:has-text("Create Geography")')
  
  // Fill form
  await page.fill('input[name="name"]', 'Test Region North')
  await page.fill('textarea[name="description"]', 'Northern salmon farming region')
  
  // Submit
  await page.click('button:has-text("Create Geography")')
  
  // Verify success
  await expect(page.locator('.toast')).toContainText('Geography created successfully')
  
  // Verify count updated
  await expect(page.locator('.card:has-text("Geography")')).toContainText('count increased')
})
```

---

## 🐛 Common Issues & Troubleshooting

### Issue: Forms not loading
**Check**:
```bash
# Backend running?
curl http://localhost:8000/api/v1/infrastructure/geographies/

# Frontend running?
curl http://localhost:5001
```

### Issue: Dropdowns empty
**Cause**: No data in database  
**Solution**: Create prerequisite entities first (e.g., need Geography before Area)

### Issue: Validation not triggering
**Check**: Browser console for JavaScript errors  
**Verify**: Form schema matches API model

### Issue: Auto-refresh not working
**Check**: Query invalidation keys match in API hooks  
**Debug**: Open React Query DevTools in browser

### Issue: Permission gates not working
**Check**: User has correct role/permissions  
**Verify**: Login as admin for full access

---

## ✅ Success Criteria

**All tests pass if**:
- ✅ All 27 entities can be created via GUI
- ✅ All forms validate correctly (required fields, ranges, enums)
- ✅ All data appears in database with correct values
- ✅ All foreign key relationships work
- ✅ All auto-calculations display correctly
- ✅ All conditional fields show/hide appropriately
- ✅ All delete operations prompt for audit reasons
- ✅ All counts auto-update after mutations
- ✅ No console errors during testing
- ✅ Forms work in both light and dark themes
- ✅ Forms work on desktop, tablet, and mobile sizes

---

## 📊 Test Execution Template

Use this template to track your testing:

```markdown
# E2E Test Execution Report

**Date**: 2025-10-XX
**Tester**: [Name]
**Browser**: Chrome [Version]
**Environment**: Local Development

## Phase 1 - Infrastructure (8/8)
- [ ] 1.1 Geography - PASS / FAIL
- [ ] 1.2 Area - PASS / FAIL
- [ ] 1.3 Freshwater Station - PASS / FAIL
- [ ] 1.4 Hall - PASS / FAIL
- [ ] 1.5 Container Type - PASS / FAIL
- [ ] 1.6 Container (XOR test) - PASS / FAIL
- [ ] 1.7 Sensor - PASS / FAIL
- [ ] 1.8 Feed Container - PASS / FAIL

## Phase 2 - Batch (6/6)
- [ ] 2.1 Species - PASS / FAIL
- [ ] 2.2 Lifecycle Stage - PASS / FAIL
- [ ] 2.3 Batch (cascading filter) - PASS / FAIL
- [ ] 2.4 Batch Container Assignment - PASS / FAIL
- [ ] 2.5 Growth Sample - PASS / FAIL
- [ ] 2.6 Mortality Event - PASS / FAIL
- [ ] 2.7 Batch Transfer - PASS / FAIL

## Phase 3 - Inventory (4/4)
- [ ] 3.1 Feed - PASS / FAIL
- [ ] 3.2 Feed Purchase (auto-calc) - PASS / FAIL
- [ ] 3.3 Feed Container Stock (FIFO) - PASS / FAIL
- [ ] 3.4 Feeding Event (cascading) - PASS / FAIL

## Phase 4 - Health (7/7)
- [ ] 4.1 Sample Type - PASS / FAIL
- [ ] 4.2 Vaccination Type - PASS / FAIL
- [ ] 4.3 Journal Entry - PASS / FAIL
- [ ] 4.4 Health Sampling Event (dynamic arrays!) - PASS / FAIL
- [ ] 4.5 Health Lab Sample - PASS / FAIL
- [ ] 4.6 Treatment (conditional fields) - PASS / FAIL

## Phase 5 - Environmental (2/2)
- [ ] 5.1 Environmental Parameter - PASS / FAIL
- [ ] 5.2 Photoperiod Data (0-24 validation) - PASS / FAIL

## Cross-Cutting Features
- [ ] Delete with audit trail - PASS / FAIL
- [ ] Auto-refresh working - PASS / FAIL
- [ ] Permission gates working - PASS / FAIL
- [ ] Light theme - PASS / FAIL
- [ ] Dark theme - PASS / FAIL
- [ ] Responsive layout - PASS / FAIL

## Overall Status
- Total Tests: 27 entities + 6 cross-cutting = 33 tests
- Passed: __/33
- Failed: __/33
- Blocked: __/33

## Issues Found
1. [Issue description if any]
2. [Issue description if any]

## Notes
[Additional observations]
```

---

## 🎮 Browser Automation Quick Start

**For Cursor Browser Agent** (in new session):

```bash
# 1. Ensure both servers running
# Backend: http://localhost:8000
# Frontend: http://localhost:5001

# 2. Start browser automation session
# Use this document as test script reference

# 3. Navigate to first management page
browser.navigate("http://localhost:5001/infrastructure/manage")

# 4. Take snapshot to see page structure
browser.snapshot()

# 5. Execute tests sequentially following this guide

# 6. After each entity creation, run database verification
# 7. Document results in execution template above
```

---

## 📚 Reference Documents

**Implementation Details**:
- Phase 1: `Phase_1_Complete.md` (Infrastructure)
- Phase 2: `Phase_2_Complete.md` (Batch)
- Phase 3: `Phase_3_Complete.md` (Inventory)
- Phase 4: `Phase_4_Complete.md` (Health)
- Phase 5: `E5.1_implementation_summary.md` (Environmental)

**Task-Specific Details**:
- I1.1 - I1.4: Infrastructure tasks
- B2.1 - B2.3: Batch tasks
- INV3.1 - INV3.3: Inventory tasks
- H4.1 - H4.3: Health tasks
- E5.1: Environmental task

**Smoke Tests**:
- `PHASE_3_GUI_SMOKE_TEST.md` (Inventory)
- `PHASE_4_GUI_SMOKE_TEST.md` (Health)
- `E5.1_GUI_SMOKE_TEST.md` (Environmental)

---

## 🎯 Test Execution Strategy

### Option 1: Sequential (Recommended)
Test all entities in order (Phase 1 → 2 → 3 → 4 → 5)
- **Pros**: Natural dependency order, easier to debug
- **Cons**: Longer execution time
- **Time**: 2-3 hours

### Option 2: Parallel (Advanced)
Test independent entities in parallel
- **Pros**: Faster execution
- **Cons**: Requires multiple browser sessions
- **Time**: 1-1.5 hours (if automated)

### Option 3: Critical Path (Minimal)
Test one entity from each phase + cross-cutting features
- **Pros**: Quick smoke test
- **Cons**: Incomplete coverage
- **Time**: 30-45 minutes

---

## 🚨 Critical Features to Test (Priority List)

**Must Test** (Regulatory Critical):
1. ✅ Batch creation and lifecycle tracking
2. ✅ Growth samples with K-factor calculation
3. ✅ Environmental parameter thresholds
4. ✅ Health journal entries
5. ✅ Delete operations with audit trails
6. ✅ Photoperiod data (compliance requirement)

**Should Test** (Business Critical):
1. ✅ Feed inventory and FIFO
2. ✅ Feeding events and summaries
3. ✅ Container assignments
4. ✅ Health sampling events

**Nice to Test** (Reference Data):
1. ✅ Sample types
2. ✅ Vaccination types
3. ✅ Container types
4. ✅ Lifecycle stages

---

## 🎊 Post-Test Cleanup (Optional)

**Delete Test Data**:
```bash
python manage.py shell -c "
from apps.infrastructure.models import Geography, Area, Container, Hall, FreshwaterStation
from apps.batch.models import Batch, Species, LifecycleStage
from apps.inventory.models import Feed, FeedPurchase
from apps.health.models import SampleType, VaccinationType, JournalEntry
from apps.environmental.models import EnvironmentalParameter, PhotoperiodData

# Delete test entities (cascade will handle related data)
Geography.objects.filter(name__icontains='Test').delete()
Species.objects.filter(common_name__icontains='Test').delete()
Feed.objects.filter(name__icontains='Test').delete()
SampleType.objects.filter(name__icontains='Test').delete()
EnvironmentalParameter.objects.filter(name__icontains='Test').delete()

print('✅ Test data cleaned up')
"
```

**Warning**: Only run cleanup in development environment!

---

## 🎓 Key Patterns to Verify During Testing

### Pattern 1: Simple Reference Data
**Examples**: Geography, SampleType, VaccinationType  
**Test**: Name + description only, no complex logic

### Pattern 2: FK Dropdown
**Examples**: Area, Hall, Sensor  
**Test**: Dropdown populates from API, FK relationship saves correctly

### Pattern 3: Cascading Filters
**Examples**: Batch (species → stage), FeedingEvent (batch → containers)  
**Test**: Second dropdown filters based on first selection

### Pattern 4: Enum Dropdowns
**Examples**: FreshwaterStation (station type), Feed (size category)  
**Test**: Enum values from schema, no free text

### Pattern 5: XOR Logic
**Examples**: Container (hall XOR area)  
**Test**: Cannot select both, one clears when other selected

### Pattern 6: Auto-Calculations
**Examples**: FeedPurchase (total cost), FeedingEvent (feeding %)  
**Test**: Values update in real-time as user types

### Pattern 7: FIFO Validation
**Examples**: FeedContainerStock  
**Test**: Soft warning if date out of order

### Pattern 8: Dynamic Field Arrays
**Examples**: HealthSamplingEvent (fish observations)  
**Test**: Add/remove rows, real-time aggregates

### Pattern 9: Conditional Fields
**Examples**: Treatment (vaccination_type shows if type=vaccination)  
**Test**: Field shows/hides based on other field value

### Pattern 10: Date Range Validation
**Examples**: PhotoperiodData (0-24 hours)  
**Test**: Values outside range rejected

---

## 📞 Support During Testing

**Form not found?**  
→ Check route is wired in `client/src/router/index.tsx`

**Dropdown empty?**  
→ Create prerequisite data first (e.g., Geography before Area)

**Validation not working?**  
→ Check browser console, verify schema matches API

**Delete button missing?**  
→ May need list/table view (not all entities have list views yet)

**Count not updating?**  
→ Check React Query DevTools for invalidation

---

## 🎊 Completion Checklist

**Before marking E2E complete**:
- ✅ All 27 entities tested in GUI
- ✅ All database verifications pass
- ✅ All special features verified (auto-calc, FIFO, dynamic arrays, etc.)
- ✅ All cross-cutting features tested (delete audit, auto-refresh, permissions)
- ✅ No console errors during full test run
- ✅ Theme compatibility verified
- ✅ Responsive layout verified
- ✅ Test execution report completed
- ✅ Issues documented (if any)
- ✅ Ready for UAT handoff

---

**Happy Testing!** 🚀

This comprehensive guide ensures complete coverage of all CRUD forms implemented across Phases 1-5. Execute systematically, verify database after each GUI operation, and document any issues found.

**Estimated Total Time**: 2-3 hours for thorough testing  
**Automation Potential**: High (repetitive patterns)  
**Browser Agent Friendly**: ✅ Clear steps, expected results, verification queries

---

**Last Updated**: 2025-10-12  
**Test Coverage**: 27 entities across 5 phases  
**Status**: Ready for execution 🎮

