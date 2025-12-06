import { test, expect } from '@playwright/test';
import { NavigationPage } from '../../pages/NavigationPage';
import { ReportsPage } from '../../pages/ReportsPage';

test.describe('Reports - Stains & Users', () => {
  
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
        'To fix: Delete storageState.json and run: npx playwright test tests/reports/reports.spec.ts'
      );
    }

    // Ensure dashboard is fully loaded
    await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
    await expect(page.locator('main')).toBeVisible({ timeout: 10000 });

    // Navigate to Reports module
    const nav = new NavigationPage(page);
    await nav.navigateToReports();
  });

  test('Reports overview renders key sections and controls', async ({ page }) => {
    const reports = new ReportsPage(page);
    await reports.verifyOrganizationReportsVisible();
    await reports.verifyReportDescriptionVisible();
    await reports.verifySstainsTabVisible();
    await reports.verifyStainUsageReportVisible();
    await reports.verifyChartDisplayed();
    await reports.verifyStainTypesVisible();
    await reports.verifyYearSelectorPresent();
    await reports.verifyDownloadButtonPresent();
  });

  test('Reports interactions: stain filters and users tab', async ({ page }) => {
    const reports = new ReportsPage(page);
    await reports.clickStainTypeCard();
    await reports.switchToUsersTab();
    await reports.verifyUsersTabSelected();
  });
});