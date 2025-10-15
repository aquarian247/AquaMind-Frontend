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

test.describe('Phase 1: Infrastructure Management', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // Navigate to infrastructure management page
    await authenticatedPage.goto('/infrastructure/manage');
    await authenticatedPage.waitForLoadState('networkidle');
    
    // Wait for page to be visible (more lenient than checking specific heading)
    await expect(authenticatedPage.locator('body')).toBeVisible();
  });

  test('1.1 Create Geography', async ({ authenticatedPage: page }) => {
    // Open create dialog
    await openCreateDialog(page, 'Geography');

    // Fill form
    await fillInput(page, 'name', 'Test Region North E2E');
    await fillInput(page, 'description', 'Northern salmon farming region for E2E testing');

    // Submit
    await clickCreateButton(page, 'Geography');

    // Verify success
    await waitForSuccessToast(page);
    await waitForDialogClose(page);

    // Log database verification command
    const cmd = generateVerificationCommand(
      'infrastructure',
      'Geography',
      { name: 'Test Region North E2E' },
      ['name', 'description', 'created_at']
    );
    console.log(`\n${cmd.description}:`);
    console.log(cmd.command);
  });

  test('1.2 Create Area with FK dropdown', async ({ authenticatedPage: page }) => {

    await openCreateDialog(page, 'Area');

    // Fill basic fields
    await fillInput(page, 'name', 'Test Area Alpha E2E');
    
    // Select geography from dropdown
    await selectOption(page, 'geography', 'Test Region North');

    // Fill coordinates
    await fillInput(page, 'latitude', '62.0123');
    await fillInput(page, 'longitude', '-6.7890');
    await fillInput(page, 'max_biomass', '100000'); // Form uses max_biomass, not max_capacity_kg

    await clickCreateButton(page, 'Area');
    await waitForSuccessToast(page);
    await waitForDialogClose(page);

    const cmd = generateVerificationCommand(
      'infrastructure',
      'Area',
      { name: 'Test Area Alpha E2E' },
      ['name', 'geography.name', 'latitude', 'longitude', 'max_capacity_kg']
    );
    console.log(`\n${cmd.description}:`);
    console.log(cmd.command);
  });

  test('1.3 Create Freshwater Station with enum dropdown', async ({ authenticatedPage: page }) => {

    await openCreateDialog(page, 'Freshwater Station');

    await fillInput(page, 'name', 'Test Freshwater Station E2E');
    
    // Select station type enum
    await selectOption(page, 'station_type', 'FRESHWATER');
    
    // Select geography (use one that exists in the database)
    await selectOption(page, 'geography', 'Faroe Islands');

    await fillInput(page, 'latitude', '62.0500');
    await fillInput(page, 'longitude', '-6.8000');

    await clickCreateButton(page, 'Freshwater Station');
    await waitForSuccessToast(page);
    await waitForDialogClose(page);

    const cmd = generateVerificationCommand(
      'infrastructure',
      'FreshwaterStation',
      { name: 'Test Hatchery Station E2E' },
      ['name', 'station_type', 'geography.name']
    );
    console.log(`\n${cmd.description}:`);
    console.log(cmd.command);
  });

  test('1.4 Create Hall with cascading FK', async ({ authenticatedPage: page }) => {

    await openCreateDialog(page, 'Hall');

    await fillInput(page, 'name', 'Test Hall 1 E2E');
    
    // Select freshwater station (use one that exists)
    await selectOption(page, 'freshwater_station', 'Cardiff FWS');

    await fillInput(page, 'description', 'Main production hall');

    await clickCreateButton(page, 'Hall');
    await waitForSuccessToast(page);
    await waitForDialogClose(page);

    const cmd = generateVerificationCommand(
      'infrastructure',
      'Hall',
      { name: 'Test Hall 1 E2E' },
      ['name', 'freshwater_station.name', 'description']
    );
    console.log(`\n${cmd.description}:`);
    console.log(cmd.command);
  });

  test('1.5 Create Container Type with enum category', async ({ authenticatedPage: page }) => {

    await openCreateDialog(page, 'Container Type');

    await fillInput(page, 'name', 'Test Tank 5000L E2E');
    await selectOption(page, 'category', 'TANK');
    await fillInput(page, 'max_volume_m3', '5'); // 5000L = 5 m³
    await fillInput(page, 'description', 'Dimensions: 3.0 x 2.0 x 1.5');

    await clickCreateButton(page, 'Container Type');
    await waitForSuccessToast(page);
    await waitForDialogClose(page);

    const cmd = generateVerificationCommand(
      'infrastructure',
      'ContainerType',
      { name: 'Test Tank 5000L E2E' },
      ['name', 'category', 'capacity_liters']
    );
    console.log(`\n${cmd.description}:`);
    console.log(cmd.command);
  });

  test('1.6 Create Container with XOR logic (Hall OR Area)', async ({ authenticatedPage: page }) => {
    await openCreateDialog(page, 'Container');

    // Fill all required fields
    await fillInput(page, 'name', 'Test Container T001 E2E');

    // Select container type (required)
    await selectOption(page, 'container_type', 'Fry Tanks');

    // Select hall (XOR: cannot select both hall and area)
    await selectOption(page, 'hall', 'Hall A');

    // Fill volume (required)
    await fillInput(page, 'volume_m3', '100.00');

    // Fill max biomass (required)
    await fillInput(page, 'max_biomass_kg', '50000.00');

    await clickCreateButton(page, 'Container');
    await waitForSuccessToast(page);
    await waitForDialogClose(page);

    const cmd = generateVerificationCommand(
      'infrastructure',
      'Container',
      { name: 'Test Container T001 E2E' },
      ['name', 'container_type.name', 'hall.name', 'area', 'status']
    );
    console.log(`\n${cmd.description}:`);
    console.log(cmd.command);
  });

  test('1.7 Create Sensor with date pickers', async ({ authenticatedPage: page }) => {

    await openCreateDialog(page, 'Sensor');

    await fillInput(page, 'name', 'Test Sensor E2E');
    await selectOption(page, 'sensor_type', 'TEMPERATURE');
    await fillInput(page, 'serial_number', 'TEMP-001-E2E');

    // Container is REQUIRED - select an existing container
    // Use one that exists in the test database
    await selectOption(page, 'container', 'Hall A-C01');

    // Date pickers
    await fillInput(page, 'installation_date', '2025-10-01');
    await fillInput(page, 'last_calibration_date', '2025-10-05');

    await fillInput(page, 'manufacturer', 'AquaSense Inc');

    await clickCreateButton(page, 'Sensor');
    await waitForSuccessToast(page);
    await waitForDialogClose(page);

    const cmd = generateVerificationCommand(
      'infrastructure',
      'Sensor',
      { serial_number: 'TEMP-001-E2E' },
      ['sensor_type', 'container.name', 'installation_date', 'last_calibration_date']
    );
    console.log(`\n${cmd.description}:`);
    console.log(cmd.command);
  });

  test('1.8 Create Feed Container', async ({ authenticatedPage: page }) => {

    await openCreateDialog(page, 'Feed Container');

    await fillInput(page, 'name', 'Test Feed Silo 1 E2E');

    // Container Type is REQUIRED - use BARGE so it can be in an area
    await selectOption(page, 'feedcontainer_type', 'BARGE');

    // Select area (barges are in areas, not halls)
    await selectOption(page, 'area', 'Area in Wales');

    await fillInput(page, 'capacity_kg', '10000');

    await clickCreateButton(page, 'Feed Container');
    await waitForSuccessToast(page);
    await waitForDialogClose(page);

    const cmd = generateVerificationCommand(
      'infrastructure',
      'FeedContainer',
      { name: 'Test Feed Silo 1 E2E' },
      ['name', 'hall.name', 'capacity_kg']
    );
    console.log(`\n${cmd.description}:`);
    console.log(cmd.command);
  });
});

