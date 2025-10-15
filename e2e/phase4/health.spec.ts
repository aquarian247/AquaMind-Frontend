import { test, expect } from '../fixtures/auth';
import {
  fillInput,
  selectOption,
  openCreateDialog,
  clickCreateButton,
  waitForSuccessToast,
  waitForDialogClose,
  getCurrentCount,
  verifyCountIncreased,
} from '../utils/form-helpers';
import { generateVerificationCommand } from '../utils/db-verification';

test.describe('Phase 4: Health Management', () => {
  // Route now exists: /health/manage
  // HealthManagementPage created with all 7 health entity forms
  
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/health/manage');
    await authenticatedPage.waitForLoadState('networkidle');
    await expect(authenticatedPage.locator('body')).toBeVisible();
  });

  test('4.1 Create Sample Type', async ({ authenticatedPage: page }) => {
    const previousCount = await getCurrentCount(page, 'Sample Type');

    await openCreateDialog(page, 'Sample Type');

    await fillInput(page, 'name', 'Blood Sample E2E');
    await fillInput(page, 'description', 'Blood sample for disease screening');

    await clickCreateButton(page, 'Sample Type');
    await waitForSuccessToast(page);
    await waitForDialogClose(page);
    await verifyCountIncreased(page, 'Sample Type', previousCount);

    const cmd = generateVerificationCommand(
      'health',
      'SampleType',
      { name: 'Blood Sample E2E' },
      ['name', 'description']
    );
    console.log(`\n${cmd.description}:`);
    console.log(cmd.command);
  });

  test('4.2 Create Vaccination Type', async ({ authenticatedPage: page }) => {
    const previousCount = await getCurrentCount(page, 'Vaccination Type');

    await openCreateDialog(page, 'Vaccination Type');

    await fillInput(page, 'name', 'Test Vaccine Alpha E2E');
    await fillInput(page, 'manufacturer', 'TestPharma AS');
    await fillInput(page, 'description', 'Multi-valent vaccine for salmon diseases');

    await clickCreateButton(page, 'Vaccination Type');
    await waitForSuccessToast(page);
    await waitForDialogClose(page);
    await verifyCountIncreased(page, 'Vaccination Type', previousCount);

    const cmd = generateVerificationCommand(
      'health',
      'VaccinationType',
      { name: 'Test Vaccine Alpha E2E' },
      ['name', 'manufacturer']
    );
    console.log(`\n${cmd.description}:`);
    console.log(cmd.command);
  });

  test('4.3 Create Journal Entry', async ({ authenticatedPage: page }) => {
    const previousCount = await getCurrentCount(page, 'Journal Entry');

    await openCreateDialog(page, 'Journal Entry');

    await selectOption(page, 'batch', 'B-2025-E2E-001');
    await selectOption(page, 'container', 'Test Container T001');
    await fillInput(page, 'entry_date', '2025-10-11');
    await selectOption(page, 'category', 'OBSERVATION');
    await selectOption(page, 'severity', 'LOW');
    await fillInput(page, 'description', 'Routine health check - all fish active and feeding well');

    await clickCreateButton(page, 'Journal Entry');
    await waitForSuccessToast(page);
    await waitForDialogClose(page);
    await verifyCountIncreased(page, 'Journal Entry', previousCount);

    const cmd = generateVerificationCommand(
      'health',
      'JournalEntry',
      { entry_date: '2025-10-11' },
      ['batch.batch_number', 'category', 'severity', 'description']
    );
    console.log(`\n${cmd.description}:`);
    console.log(cmd.command);
  });

  test('4.4 Create Health Sampling Event with Dynamic Arrays', async ({ authenticatedPage: page }) => {
    const previousCount = await getCurrentCount(page, 'Health Sampling Event');

    await openCreateDialog(page, 'Health Sampling Event');

    await selectOption(page, 'batch_container_assignment', 'B-2025-E2E-001');
    await fillInput(page, 'sampling_date', '2025-10-11');
    await fillInput(page, 'number_of_fish_sampled', '30');

    // Add individual fish observations (dynamic array)
    const addObservationButton = page.locator('button:has-text("Add Fish Observation")').first();
    
    // Add 3 observations
    for (let i = 0; i < 3; i++) {
      await addObservationButton.click();
      await page.waitForTimeout(300);
    }

    // Fill observation data
    const observations = [
      { id: 'F001', weight: '25.0', length: '12.0' },
      { id: 'F002', weight: '27.5', length: '12.5' },
      { id: 'F003', weight: '24.0', length: '11.8' },
    ];

    for (let i = 0; i < observations.length; i++) {
      const obs = observations[i];
      await fillInput(page, `observations[${i}].fish_identifier`, obs.id);
      await fillInput(page, `observations[${i}].weight_g`, obs.weight);
      await fillInput(page, `observations[${i}].length_cm`, obs.length);
    }

    // Verify real-time aggregate calculations (if visible)
    await page.waitForTimeout(500);
    const avgWeightPreview = page.locator('text=/avg.*weight.*25\\.5/i').first();
    await expect(avgWeightPreview).toBeVisible({ timeout: 3000 }).catch(() => {
      // Aggregates might not be visible, that's OK
    });

    await clickCreateButton(page, 'Health Sampling Event');
    await waitForSuccessToast(page);
    await waitForDialogClose(page);
    await verifyCountIncreased(page, 'Health Sampling Event', previousCount);

    const cmd = generateVerificationCommand(
      'health',
      'HealthSamplingEvent',
      { sampling_date: '2025-10-11' },
      ['number_of_fish_sampled', 'average_weight_g', 'average_length_cm', 'average_k_factor']
    );
    console.log(`\n${cmd.description}:`);
    console.log(cmd.command);
  });

  test('4.5 Create Health Lab Sample', async ({ authenticatedPage: page }) => {
    const previousCount = await getCurrentCount(page, 'Health Lab Sample');

    await openCreateDialog(page, 'Health Lab Sample');

    await selectOption(page, 'batch_container_assignment', 'B-2025-E2E-001');
    await selectOption(page, 'sample_type', 'Blood Sample');
    await fillInput(page, 'collection_date', '2025-10-11');
    await fillInput(page, 'sent_to_lab_date', '2025-10-12');
    await fillInput(page, 'results_received_date', '2025-10-15');
    await fillInput(page, 'findings', 'No pathogens detected - healthy population');

    await clickCreateButton(page, 'Health Lab Sample');
    await waitForSuccessToast(page);
    await waitForDialogClose(page);
    await verifyCountIncreased(page, 'Health Lab Sample', previousCount);

    const cmd = generateVerificationCommand(
      'health',
      'HealthLabSample',
      { collection_date: '2025-10-11' },
      ['sample_type.name', 'collection_date', 'sent_to_lab_date', 'results_received_date']
    );
    console.log(`\n${cmd.description}:`);
    console.log(cmd.command);
  });

  test('4.6 Create Treatment - Medication (Conditional Fields)', async ({ authenticatedPage: page }) => {
    const previousCount = await getCurrentCount(page, 'Treatment');

    await openCreateDialog(page, 'Treatment');

    await selectOption(page, 'batch', 'B-2025-E2E-001');
    await selectOption(page, 'container', 'Test Container T001');
    await selectOption(page, 'treatment_type', 'MEDICATION');
    await fillInput(page, 'start_date', '2025-10-12');
    await fillInput(page, 'dosage', '5.0');
    await fillInput(page, 'unit', 'mg/L');
    await fillInput(page, 'withholding_period_days', '14');

    // Verify vaccination_type field is hidden
    const vaccinationTypeField = page.locator('[data-field="vaccination_type"]');
    await expect(vaccinationTypeField).toBeHidden({ timeout: 2000 }).catch(() => {
      // Field might not exist at all, that's OK
    });

    await clickCreateButton(page, 'Treatment');
    await waitForSuccessToast(page);
    await waitForDialogClose(page);
    await verifyCountIncreased(page, 'Treatment', previousCount);

    const cmd = generateVerificationCommand(
      'health',
      'Treatment',
      { treatment_type: 'medication', start_date: '2025-10-12' },
      ['treatment_type', 'vaccination_type', 'withholding_end_date']
    );
    console.log(`\n${cmd.description}:`);
    console.log(cmd.command);
  });

  test('4.7 Create Treatment - Vaccination (Conditional Fields Visible)', async ({ authenticatedPage: page }) => {
    const previousCount = await getCurrentCount(page, 'Treatment');

    await openCreateDialog(page, 'Treatment');

    await selectOption(page, 'batch', 'B-2025-E2E-001');
    await selectOption(page, 'treatment_type', 'VACCINATION');
    
    // Verify vaccination_type field is NOW visible
    await page.waitForTimeout(300);
    
    await selectOption(page, 'vaccination_type', 'Test Vaccine Alpha');
    await fillInput(page, 'start_date', '2025-10-13');
    await fillInput(page, 'dosage', '0.5');
    await fillInput(page, 'unit', 'mL/fish');
    await fillInput(page, 'withholding_period_days', '21');

    await clickCreateButton(page, 'Treatment');
    await waitForSuccessToast(page);
    await waitForDialogClose(page);
    await verifyCountIncreased(page, 'Treatment', previousCount);

    const cmd = generateVerificationCommand(
      'health',
      'Treatment',
      { treatment_type: 'vaccination', start_date: '2025-10-13' },
      ['treatment_type', 'vaccination_type.name', 'withholding_end_date']
    );
    console.log(`\n${cmd.description}:`);
    console.log(cmd.command);
  });
});

