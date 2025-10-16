import { test as base, expect, Page } from '@playwright/test';

/**
 * Extended test fixture with authentication
 * Automatically logs in before each test
 */
export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    // Navigate to login page
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if already on dashboard (cached session)
    const currentUrl = page.url();
    if (currentUrl.includes('/dashboard')) {
      // Already authenticated
      await use(page);
      return;
    }

    // Wait for login page to render
    await expect(page.locator('h1:has-text("AquaMind")')).toBeVisible({ timeout: 10000 });

    // Fill login form (React Hook Form fields)
    // Use the input inside the form control
    const usernameInput = page.locator('input[name="username"]');
    const passwordInput = page.locator('input[type="password"][name="password"]');
    
    await usernameInput.fill('admin');
    await passwordInput.fill('admin123');
    
    // Submit and wait for navigation
    const submitButton = page.locator('button[type="submit"]:has-text("Sign In")');
    await submitButton.click();
    
    // Wait for authentication to complete (redirect to dashboard)
    await page.waitForURL('**/dashboard', {
      timeout: 10000,
    });

    // Wait for dashboard to load
    await page.waitForLoadState('networkidle');

    // Verify we're authenticated (check for dashboard content or header)
    await expect(page.locator('body')).toBeVisible();

    await use(page);
  },
});

export { expect };

