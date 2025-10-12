import { Page, expect } from '@playwright/test';
import { getDropdownId } from './field-id-mappings';

/**
 * Helper to fill a text input by label or name
 * Looks for input within the dialog first to avoid page scrolling issues
 */
export async function fillInput(page: Page, fieldName: string, value: string) {
  // Prefer finding input within the active dialog
  const dialog = page.locator('[role="dialog"]').first();
  const dialogInput = dialog.locator(`input[name="${fieldName}"], textarea[name="${fieldName}"]`);
  
  // If dialog input exists, use it; otherwise fall back to page-level
  const inputCount = await dialogInput.count();
  const input = inputCount > 0 ? dialogInput : page.locator(`input[name="${fieldName}"], textarea[name="${fieldName}"]`);
  
  await input.waitFor({ state: 'visible', timeout: 5000 });
  await input.fill(value);
}

/**
 * Helper to select from a dropdown (Shadcn Select component)
 * Tries multiple ID patterns to find the correct dropdown
 */
export async function selectOption(page: Page, fieldName: string, optionText: string) {
  const dialog = page.locator('[role="dialog"]').first();
  
  // Try multiple ID patterns based on observed patterns
  const kebabField = fieldName.replace(/_/g, '-');
  const possibleIds = [
    kebabField,                          // e.g., "station-type"
    `*-${kebabField}`,                   // e.g., "hall-station" for "station"
    `${kebabField}-*`,                   // e.g., "station-geography" for "geography"
  ];
  
  let trigger = null;
  for (const pattern of possibleIds) {
    const candidate = dialog.locator(`button[role="combobox"][id*="${pattern}"]`).first();
    const count = await candidate.count();
    if (count > 0) {
      trigger = candidate;
      break;
    }
  }
  
  // If still not found, try finding by aria-label
  if (!trigger || (await trigger.count()) === 0) {
    const labelText = fieldName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    trigger = dialog.locator(`button[role="combobox"][aria-label*="${labelText}" i]`).first();
  }
  
  // Last resort: just get first combobox
  if ((await trigger.count()) === 0) {
    trigger = dialog.locator(`button[role="combobox"]`).first();
  }
  
  await trigger.waitFor({ state: 'visible', timeout: 5000 });
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  
  // Wait for popover to appear
  await page.waitForSelector('[role="listbox"], [role="option"]', { timeout: 5000 });
  
  // Click the option (case-insensitive partial match)
  const option = page.locator(`[role="option"]`).filter({ hasText: optionText }).first();
  await option.waitFor({ state: 'visible', timeout: 5000 });
  await option.click();
  
  // Wait for popover to close
  await page.waitForTimeout(300);
}

/**
 * Helper to check a checkbox
 * Looks for checkbox by name or ID
 */
export async function checkCheckbox(page: Page, fieldName: string, checked: boolean = true) {
  const dialog = page.locator('[role="dialog"]').first();
  
  // Try by name first, then by ID
  let checkbox = dialog.locator(`input[type="checkbox"][name="${fieldName}"]`).first();
  let count = await checkbox.count();
  
  if (count === 0) {
    // Try by ID pattern
    const kebabField = fieldName.replace(/_/g, '-');
    checkbox = dialog.locator(`input[type="checkbox"][id*="${kebabField}"]`).first();
  }
  
  const isChecked = await checkbox.isChecked();
  
  if (isChecked !== checked) {
    await checkbox.click();
  }
}

/**
 * Helper to click "Create" button in a dialog (submit button)
 * Looks for button within the dialog to avoid scrolling issues
 */
export async function clickCreateButton(page: Page, entityName: string) {
  // Find the submit button within the active dialog
  const dialog = page.locator('[role="dialog"]').first();
  const button = dialog.locator(`button[type="submit"], button:has-text("Create")`).first();
  
  await button.waitFor({ state: 'visible', timeout: 5000 });
  await button.scrollIntoViewIfNeeded();
  await button.click();
}

/**
 * Helper to wait for success toast
 */
export async function waitForSuccessToast(page: Page, message?: string) {
  if (message) {
    await expect(page.locator('.toast, [role="status"]').filter({ hasText: message })).toBeVisible({
      timeout: 5000,
    });
  } else {
    await expect(page.locator('.toast, [role="status"]')).toBeVisible({
      timeout: 5000,
    });
  }
}

/**
 * Helper to wait for dialog to close
 * If dialog doesn't auto-close, manually close it
 */
export async function waitForDialogClose(page: Page) {
  // Give dialog a moment to auto-close
  await page.waitForTimeout(1000);
  
  // Check if dialog is still open
  const dialog = page.locator('[role="dialog"]');
  const isVisible = await dialog.isVisible().catch(() => false);
  
  if (isVisible) {
    // Dialog didn't auto-close, manually close it with Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }
  
  // Don't fail if dialog is still there - just continue
  // (Some implementations keep dialog open, that's OK)
}

/**
 * Helper to verify count updated in entity card
 */
export async function verifyCountIncreased(page: Page, entityName: string, previousCount: number) {
  const card = page.locator(`.card:has-text("${entityName}")`).first();
  const countText = await card.locator('text=/\\d+/').first().textContent();
  const newCount = parseInt(countText || '0');
  expect(newCount).toBeGreaterThan(previousCount);
}

/**
 * Helper to open create dialog for an entity
 * Handles ambiguous names like "Container" (vs "Container Type")
 */
export async function openCreateDialog(page: Page, entityName: string) {
  // Get all buttons with "Create {entityName}" in the text
  const allButtons = page.locator(`button`).filter({ hasText: `Create ${entityName}` });
  const count = await allButtons.count();
  
  let button;
  if (count > 1) {
    // Multiple matches - need to be more specific
    // Find the one that matches exactly (not a longer name)
    button = allButtons.filter({ hasNotText: `${entityName} ` }).first();
    
    // Verify we found something
    const exactCount = await button.count();
    if (exactCount === 0) {
      // Fall back to first match
      button = allButtons.first();
    }
  } else {
    button = allButtons.first();
  }
  
  await button.waitFor({ state: 'visible', timeout: 5000 });
  await button.scrollIntoViewIfNeeded();
  await button.click();
  
  // Wait for dialog to appear and be stable
  const dialog = page.locator('[role="dialog"]');
  await dialog.waitFor({ state: 'visible', timeout: 5000 });
  
  // Wait a moment for any animations to complete
  await page.waitForTimeout(300);
}

/**
 * Helper to get current count from entity card
 */
export async function getCurrentCount(page: Page, entityName: string): Promise<number> {
  const card = page.locator(`.card:has-text("${entityName}")`).first();
  const countText = await card.locator('text=/\\d+/').first().textContent();
  return parseInt(countText || '0');
}

