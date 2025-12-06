import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../pages/DashboardPage';

test.describe('Dashboard - Overview', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard (user is already logged in via global-setup.ts and storageState)
    try {
      await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 });
    } catch (err) {
      // Fallback to domcontentloaded if networkidle times out
      await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    }
    
    // Check if session expired and redirected to login page
    if (page.url().includes('login') || page.url().includes('signin')) {
      throw new Error(
        'StorageState expired - Session not retained. ' +
        'To fix: Delete storageState.json and run: npx playwright test tests/dashboard/dashboard-overview.spec.ts'
      );
    }
    
    // Ensure dashboard is fully loaded
    await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
    await expect(page.locator('main')).toBeVisible({ timeout: 10000 });
  });

  test('Dashboard displays all overview sections', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    
    // Combine multiple verifications in one test
    await dashboard.verifyOrganizationActivityVisible();
    await dashboard.verifySlideOverviewVisible();
    await dashboard.verifyMetricsVisible();
    await dashboard.verifyStainUsageOverviewVisible();
    await dashboard.verifyQualityMetricsVisible();
  });

  test('Dashboard displays demo account warning and date selector', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    
    // Verify warning
    await dashboard.verifyDemoWarningVisible();
    
    // Verify date dropdown is functional
    await expect(dashboard.dateDropdown).toBeVisible({ timeout: 10000 });
    await dashboard.dateDropdown.click();
    
    const menu = page.locator('[role="listbox"]');
    await expect(menu).toBeVisible({ timeout: 5000 });
    
    // Click away to close dropdown
    await page.keyboard.press('Escape');
  });
});