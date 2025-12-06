import { test, expect } from '@playwright/test';
import { NavigationPage } from '../../pages/NavigationPage';
import { StainManagementPage } from '../../pages/StainManagementPage';

test.describe.configure({ mode: 'parallel' });

test.describe('Model - Stain Management', () => {
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
        'To fix: Delete storageState.json and run: npx playwright test tests/model/stain-management.spec.ts'
      );
    }

    // Ensure dashboard is fully loaded
    await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
    await expect(page.locator('main')).toBeVisible({ timeout: 10000 });

    // Navigate to Stain Management module
    const nav = new NavigationPage(page);
    await nav.navigateToModel();
  });

  test('Stain management overview renders key sections', async ({ page }) => {
    const stainMgmt = new StainManagementPage(page);
    await stainMgmt.verifyOrganizationModelsVisible();
    await stainMgmt.verifyOrganizationStainManagementVisible();
    await stainMgmt.verifyStainManagementTabVisible();
    await stainMgmt.verifyStainersDisplayed();
    await stainMgmt.verifyStainModelsDisplayed();
    await stainMgmt.verifyDisclaimerVisible();
    await stainMgmt.verifyTotalStainersCountVisible();
  });

  test('Stain models expose toggles and can be switched', async ({ page }) => {
    const stainMgmt = new StainManagementPage(page);
    await stainMgmt.verifyCheckboxesPresent();
    const count = await stainMgmt.getCheckboxCount();
    expect(count).toBeGreaterThan(0);
    const disabledWrapper = stainMgmt.firstCheckbox.locator('xpath=ancestor::div[@data-testid="permission-wrapper"][1]');
    await expect(disabledWrapper).toHaveAttribute('data-permission-disabled', 'true');
  });
});
