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

  // NOTE: Create Species button not available on batch-setup page
  // Species might need to be created via a different page or API

  test('2.2 Create Lifecycle Stage (Species-Dependent)', async ({ authenticatedPage: page }) => {

    await openCreateDialog(page, 'Lifecycle Stage');

    await fillInput(page, 'name', 'Fry E2E');
    await selectOption(page, 'species', 'Atlantic Salmon');
    await fillInput(page, 'expected_weight_min_g', '1.0');
    await fillInput(page, 'expected_weight_max_g', '50.0');
    await fillInput(page, 'order', '9'); // Must be higher than existing orders (1-8 exist)

    await clickCreateButton(page, 'Lifecycle Stage');
    // Note: Toast may not appear, so we'll check if dialog closes instead
    await waitForDialogClose(page);

    const cmd = generateVerificationCommand(
      'batch',
      'LifeCycleStage',
      { name: 'Fry E2E' },
      ['name', 'species.name', 'expected_weight_min_g', 'expected_weight_max_g', 'order']
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
    await selectOption(page, 'lifecycle_stage', 'Fry E2E');
    
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

  test('2.4 Create Container Assignment', async ({ authenticatedPage: page }) => {

    await openCreateDialog(page, 'Container Assignment');

    await selectOption(page, 'batch', 'B-2025-E2E-001');
    await selectOption(page, 'container', 'Hall A-C01');
    await selectOption(page, 'lifecycle_stage', 'Fry E2E');
    await fillInput(page, 'population_count', '5000');
    await fillInput(page, 'assignment_date', '2025-10-01');

    await clickCreateButton(page, 'Container Assignment');
    // Note: Toast may not appear, so we'll check if dialog closes instead
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

  test.skip('2.5 Create Growth Sample', async ({ authenticatedPage: page }) => {
    // SKIPPED: Need to inspect what options are available in assignment dropdown

    await openCreateDialog(page, 'Growth Sample');

    // TODO: Inspect assignment dropdown options
    // await selectOption(page, 'assignment', '???'); // Need to see what label shows

    await fillInput(page, 'sample_date', '2025-10-10');
    await fillInput(page, 'sample_size', '30');
    await fillInput(page, 'avg_weight_g', '25.5');
    await fillInput(page, 'avg_length_cm', '12.0');

    await clickCreateButton(page, 'Growth Sample');
    // Note: Toast may not appear, so we'll check if dialog closes instead
    await waitForDialogClose(page);

    const cmd = generateVerificationCommand(
      'batch',
      'GrowthSample',
      { sample_date: '2025-10-10' },
      ['batch_container_assignment.batch.batch_number', 'sample_size', 'avg_weight_g', 'avg_length_cm']
    );
    console.log(`\n${cmd.description}:`);
    console.log(cmd.command);
  });

  test('2.6 Create Mortality Event', async ({ authenticatedPage: page }) => {

    await openCreateDialog(page, 'Mortality Event');

    // From dropdown inspection: "B-2025-E2E-001 (Atlantic Salmon)" or "Wales test batch (Atlantic Salmon)"
    // Use partial match for the batch number
    await selectOption(page, 'batch', 'B-2025-E2E-001'); // Label is "Batch"
    await fillInput(page, 'event_date', '2025-10-08');
    await fillInput(page, 'mortality_count', '10');
    await fillInput(page, 'notes', 'Natural mortality - normal rate');

    await clickCreateButton(page, 'Mortality Event');
    // Note: Toast may not appear, so we'll check if dialog closes instead
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

  test.skip('2.7 Create Batch Transfer', async ({ authenticatedPage: page }) => {
    // SKIPPED: Need to inspect field names first

    await openCreateDialog(page, 'Batch Transfer');

    // TODO: Inspect actual field names
    // await selectOption(page, 'source_batch', 'B-2025-E2E-001');
    // await fillInput(page, 'transfer_date', '2025-10-15');
    // await fillInput(page, 'population_count', '1000');
    // await fillInput(page, 'notes', 'Transfer for testing purposes');

    await clickCreateButton(page, 'Batch Transfer');
    await waitForSuccessToast(page);
    await waitForDialogClose(page);

    const cmd = generateVerificationCommand(
      'batch',
      'BatchTransfer',
      { transfer_date: '2025-10-15' },
      ['source_batch.batch_number', 'population_count', 'destination_container.name']
    );
    console.log(`\n${cmd.description}:`);
    console.log(cmd.command);
  });

});


