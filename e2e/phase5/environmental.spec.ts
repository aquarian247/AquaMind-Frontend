import { test, expect } from '../fixtures/auth';
import {
  fillInput,
  selectOption,
  checkCheckbox,
  openCreateDialog,
  clickCreateButton,
  waitForSuccessToast,
  waitForDialogClose,
  getCurrentCount,
  verifyCountIncreased,
} from '../utils/form-helpers';
import { generateVerificationCommand } from '../utils/db-verification';

test.describe('Phase 5: Environmental Management', () => {
  // Route now exists: /environmental/manage
  // EnvironmentalManagementPage created with 2 environmental entity forms
  
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/environmental/manage');
    await authenticatedPage.waitForLoadState('networkidle');
    await expect(authenticatedPage.locator('body')).toBeVisible();
  });

  test('5.1 Create Environmental Parameter with Range Configuration', async ({ authenticatedPage: page }) => {
    const previousCount = await getCurrentCount(page, 'Environmental Parameter');

    await openCreateDialog(page, 'Environmental Parameter');

    await fillInput(page, 'name', 'Dissolved Oxygen E2E');
    await fillInput(page, 'unit', 'mg/L');
    await fillInput(page, 'description', 'Critical water quality parameter for fish respiration');
    await fillInput(page, 'min_value', '5.0');
    await fillInput(page, 'max_value', '15.0');
    await fillInput(page, 'optimal_min', '7.0');
    await fillInput(page, 'optimal_max', '12.0');

    await clickCreateButton(page, 'Environmental Parameter');
    await waitForSuccessToast(page);
    await waitForDialogClose(page);
    await verifyCountIncreased(page, 'Environmental Parameter', previousCount);

    const cmd = generateVerificationCommand(
      'environmental',
      'EnvironmentalParameter',
      { name: 'Dissolved Oxygen E2E' },
      ['name', 'unit', 'min_value', 'max_value', 'optimal_min', 'optimal_max']
    );
    console.log(`\n${cmd.description}:`);
    console.log(cmd.command);
  });

  test('5.1b Create Environmental Parameter with Minimal Fields', async ({ authenticatedPage: page }) => {
    const previousCount = await getCurrentCount(page, 'Environmental Parameter');

    await openCreateDialog(page, 'Environmental Parameter');

    // Only required fields
    await fillInput(page, 'name', 'pH E2E');
    await fillInput(page, 'unit', 'pH');
    
    // Leave all optional range fields empty

    await clickCreateButton(page, 'Environmental Parameter');
    await waitForSuccessToast(page);
    await waitForDialogClose(page);
    await verifyCountIncreased(page, 'Environmental Parameter', previousCount);

    const cmd = generateVerificationCommand(
      'environmental',
      'EnvironmentalParameter',
      { name: 'pH E2E' },
      ['name', 'unit']
    );
    console.log(`\n${cmd.description}:`);
    console.log(cmd.command);
  });

  test('5.2 Create Photoperiod Data with Valid Day Length', async ({ authenticatedPage: page }) => {
    const previousCount = await getCurrentCount(page, 'Photoperiod Data');

    await openCreateDialog(page, 'Photoperiod Data');

    await selectOption(page, 'area', 'Test Area Alpha');
    await fillInput(page, 'date', '2025-10-11');
    await fillInput(page, 'day_length_hours', '16.5');
    await fillInput(page, 'light_intensity', '500.0');
    await checkCheckbox(page, 'is_interpolated', true);

    await clickCreateButton(page, 'Photoperiod Data');
    await waitForSuccessToast(page);
    await waitForDialogClose(page);
    await verifyCountIncreased(page, 'Photoperiod Data', previousCount);

    const cmd = generateVerificationCommand(
      'environmental',
      'PhotoperiodData',
      { 'area__name__icontains': 'Alpha', date: '2025-10-11' },
      ['area.name', 'date', 'day_length_hours', 'light_intensity', 'is_interpolated']
    );
    console.log(`\n${cmd.description}:`);
    console.log(cmd.command);
  });

  test('5.2b Photoperiod Data - Validation Error for Day Length > 24', async ({ authenticatedPage: page }) => {
    await openCreateDialog(page, 'Photoperiod Data');

    await selectOption(page, 'area', 'Test Area Alpha');
    await fillInput(page, 'date', '2025-10-12');
    await fillInput(page, 'day_length_hours', '25.0'); // INVALID!
    await fillInput(page, 'light_intensity', '500.0');

    // Try to submit
    await clickCreateButton(page, 'Photoperiod Data');

    // Should see validation error
    const errorMessage = page.locator('text=/day length.*24|maximum.*24/i').first();
    await expect(errorMessage).toBeVisible({ timeout: 5000 });

    // Dialog should NOT close
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    console.log('✅ Validation correctly rejected day_length > 24');
  });
});

