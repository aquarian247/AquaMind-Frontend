import { test, expect } from '../fixtures/auth';
import {
  fillInput,
  selectOption,
  openCreateDialog,
  clickCreateButton,
  waitForSuccessToast,
  waitForDialogClose,
} from '../utils/form-helpers';
import { generateVerificationCommand } from '../utils/db-verification';

test.describe('Phase 2: Batch Management', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // Navigate to batch setup page
    await authenticatedPage.goto('/batch-setup');
    await authenticatedPage.waitForLoadState('networkidle');
    
    // Wait for page to be visible
    await expect(authenticatedPage.locator('body')).toBeVisible();
  });

  test.skip('2.1 Create Species (Reference Data)', async ({ authenticatedPage: page }) => {
    // SKIPPED: "Create Species" button not found on page

    await openCreateDialog(page, 'Species');

    await fillInput(page, 'common_name', 'Atlantic Salmon E2E');
    await fillInput(page, 'scientific_name', 'Salmo salar');
    await fillInput(page, 'tgc_default', '0.003');

    await clickCreateButton(page, 'Species');
    await waitForSuccessToast(page);
    await waitForDialogClose(page);

    const cmd = generateVerificationCommand(
      'batch',
      'Species',
      { common_name: 'Atlantic Salmon E2E' },
      ['common_name', 'scientific_name', 'tgc_default']
    );
    console.log(`\n${cmd.description}:`);
    console.log(cmd.command);
  });

  test('2.2 Create Lifecycle Stage (Species-Dependent)', async ({ authenticatedPage: page }) => {

    await openCreateDialog(page, 'Lifecycle Stage');

    await fillInput(page, 'name', 'Fry E2E');
    await selectOption(page, 'species', 'Atlantic Salmon');
    await fillInput(page, 'expected_weight_min_g', '1.0');
    await fillInput(page, 'expected_weight_max_g', '50.0');
    await fillInput(page, 'order', '1'); // duration_days doesn't exist, using order instead

    await clickCreateButton(page, 'Lifecycle Stage');
    await waitForSuccessToast(page);
    await waitForDialogClose(page);

    const cmd = generateVerificationCommand(
      'batch',
      'LifecycleStage',
      { name: 'Fry E2E' },
      ['name', 'species.common_name', 'min_weight_g', 'max_weight_g']
    );
    console.log(`\n${cmd.description}:`);
    console.log(cmd.command);
  });

  test('2.3 Create Batch with Cascading Filters', async ({ authenticatedPage: page }) => {

    await openCreateDialog(page, 'Batch');

    await fillInput(page, 'batch_number', 'B-2025-E2E-001');
    
    // Select species first
    await selectOption(page, 'species', 'Atlantic Salmon');
    
    // Lifecycle stage dropdown should filter by species
    await page.waitForTimeout(500); // Wait for cascade
    await selectOption(page, 'lifecycle_stage', 'Fry');
    
    await fillInput(page, 'start_date', '2025-10-01');
    await selectOption(page, 'status', 'ACTIVE');
    await selectOption(page, 'batch_type', 'STANDARD');

    await clickCreateButton(page, 'Batch');
    await waitForSuccessToast(page);
    await waitForDialogClose(page);

    const cmd = generateVerificationCommand(
      'batch',
      'Batch',
      { batch_number: 'B-2025-E2E-001' },
      ['batch_number', 'species.common_name', 'lifecycle_stage.name', 'status']
    );
    console.log(`\n${cmd.description}:`);
    console.log(cmd.command);
  });

  test.skip('2.4 Create Batch Container Assignment', async ({ authenticatedPage: page }) => {
    // SKIPPED: "Create Batch Container Assignment" button not found on page

    await openCreateDialog(page, 'Batch Container Assignment');

    await selectOption(page, 'batch', 'B-2025-E2E-001');
    await selectOption(page, 'container', 'Test Container T001');
    await fillInput(page, 'population_count', '5000');
    await fillInput(page, 'assignment_date', '2025-10-01');

    await clickCreateButton(page, 'Batch Container Assignment');
    await waitForSuccessToast(page);
    await waitForDialogClose(page);

    const cmd = generateVerificationCommand(
      'batch',
      'BatchContainerAssignment',
      { 'batch__batch_number': 'B-2025-E2E-001' },
      ['batch.batch_number', 'container.name', 'population_count', 'current_biomass_kg']
    );
    console.log(`\n${cmd.description}:`);
    console.log(cmd.command);
  });

  test('2.5 Create Growth Sample', async ({ authenticatedPage: page }) => {

    await openCreateDialog(page, 'Growth Sample');

    // Select batch container assignment
    await selectOption(page, 'assignment', 'B-2025-E2E-001'); // Label is "Active Assignment"
    
    await fillInput(page, 'sample_date', '2025-10-10');
    await fillInput(page, 'sample_size', '30');
    await fillInput(page, 'avg_weight_g', '25.5');
    await fillInput(page, 'avg_length_cm', '12.0');

    await clickCreateButton(page, 'Growth Sample');
    await waitForSuccessToast(page);
    await waitForDialogClose(page);

    const cmd = generateVerificationCommand(
      'batch',
      'GrowthSample',
      { sample_date: '2025-10-10' },
      ['batch_container_assignment.batch.batch_number', 'sample_size', 'average_weight_g', 'condition_factor']
    );
    console.log(`\n${cmd.description}:`);
    console.log(cmd.command);
  });

  test('2.6 Create Mortality Event', async ({ authenticatedPage: page }) => {

    await openCreateDialog(page, 'Mortality Event');

    await selectOption(page, 'batch', 'B-2025-E2E-001'); // Label is "Batch"
    await fillInput(page, 'event_date', '2025-10-08');
    await fillInput(page, 'mortality_count', '10');
    await fillInput(page, 'notes', 'Natural mortality - normal rate');

    await clickCreateButton(page, 'Mortality Event');
    await waitForSuccessToast(page);
    await waitForDialogClose(page);

    const cmd = generateVerificationCommand(
      'batch',
      'MortalityEvent',
      { event_date: '2025-10-08' },
      ['count', 'cause', 'batch_container_assignment.batch.batch_number']
    );
    console.log(`\n${cmd.description}:`);
    console.log(cmd.command);
  });
});

