import { test, expect } from '@playwright/test';
import { NavigationPage } from '../../pages/NavigationPage';

test.describe('Navigation - Main Menu', () => {
  
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
        'To fix: Delete storageState.json and run: npx playwright test tests/navigation/navigation.spec.ts'
      );
    }

    // Ensure dashboard is fully loaded
    await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
    await expect(page.locator('main')).toBeVisible({ timeout: 10000 });
  });

  test('Navigation header renders and menu items are visible', async ({ page }) => {
    const nav = new NavigationPage(page);
    await nav.verifyAllMenuButtonsVisible();
    await expect(page.locator('img[alt="Support"]')).toBeVisible();
    await expect(page.getByText('PictorLabs Hiring Org')).toBeVisible();

    await nav.openMoreMenu();
    const menu = page.locator('[role="menu"]');
    await expect(menu).toBeVisible({ timeout: 3000 });
    await expect(page.getByText('My Organization')).toBeVisible();
    await expect(page.getByText('Log out')).toBeVisible();
  });

  test('User can switch modules from navigation', async ({ page }) => {
    const nav = new NavigationPage(page);

    await nav.navigateToModel();
    nav.verifyURLContains('models');

    await nav.navigateToReports();
    nav.verifyURLContains('reports');

    await nav.navigateToUploads();
    nav.verifyURLContains('uploads');

    await nav.navigateToDashboard();
    nav.verifyURLContains('development.prism.deepstain.com/');
  });
});