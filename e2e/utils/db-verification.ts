/**
 * Database verification helpers
 * These provide Python shell commands to verify data in the Django database
 */

export interface DbVerificationCommand {
  description: string;
  command: string;
}

/**
 * Generate Django shell command to verify entity creation
 */
export function generateVerificationCommand(
  app: string,
  model: string,
  filter: Record<string, string | number>,
  fields: string[]
): DbVerificationCommand {
  const filterStr = Object.entries(filter)
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key}='${value}'`;
      }
      return `${key}=${value}`;
    })
    .join(', ');

  const fieldPrints = fields.map((field) => `print(f'✅ ${field}: {obj.${field}}')`).join('\n');

  return {
    description: `Verify ${model} creation`,
    command: `python manage.py shell -c "
from apps.${app}.models import ${model}
obj = ${model}.objects.filter(${filterStr}).first()
if obj:
  print(f'✅ ${model} created: ID={obj.id}')
  ${fieldPrints}
else:
  print('❌ ${model} not found with filter: ${filterStr}')
"`,
  };
}

/**
 * Generate count verification command for all entities
 */
export function generateCountVerificationCommand(): DbVerificationCommand {
  return {
    description: 'Verify all entity counts',
    command: `python manage.py shell -c "
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
"`,
  };
}

/**
 * Example usage in tests:
 * 
 * const cmd = generateVerificationCommand(
 *   'infrastructure',
 *   'Geography',
 *   { name: 'Test Region North' },
 *   ['name', 'description', 'created_at']
 * );
 * 
 * console.log(`\n${cmd.description}:`);
 * console.log(cmd.command);
 */

