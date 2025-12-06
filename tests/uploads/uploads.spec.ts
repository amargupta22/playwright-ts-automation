import { test, expect } from '@playwright/test';
import path from 'path';
import { NavigationPage } from '../../pages/NavigationPage';
import { UploadsPage } from '../../pages/UploadsPage';

test.describe('Uploads - Slide Upload Dashboard', () => {
  
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
        'To fix: Delete storageState.json and run: npx playwright test tests/uploads/uploads.spec.ts'
      );
    }

    // Ensure dashboard is fully loaded
    await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
    await expect(page.locator('main')).toBeVisible({ timeout: 10000 });

    // Navigate to Uploads module
    const nav = new NavigationPage(page);
    await nav.navigateToUploads();
  });


  test('Uploads overview renders core sections and guidance', async ({ page }) => {
    const uploads = new UploadsPage(page);
    await uploads.verifyUploadDashboardVisible();
    await uploads.verifyUploadTabSelected();
    await uploads.verifyUploadInterfaceVisible();
    await uploads.verifyGuidelinesVisible();
    await uploads.verifySupportedFormatsListed();
    await uploads.verifyMaximumFileSizeSpecified();
    await uploads.verifyDropZoneVisible();
    await uploads.verifyUploadButtonPresent();
  });

  test('Upload tabs and demo restrictions are enforced', async ({ page }) => {
    const uploads = new UploadsPage(page);

    const uploadTab = page.getByRole('tab', { name: 'Upload' });
    const inProgressTab = page.getByRole('tab', { name: 'In Progress' });
    const completedTab = page.getByRole('tab', { name: 'Completed' });

    await expect(uploadTab).toBeVisible();
    await expect(inProgressTab).toBeVisible();
    await expect(completedTab).toBeVisible();

    await uploads.switchToInProgressTab();
    await completedTab.click();
    await expect(completedTab).toHaveAttribute('aria-selected', 'true');

    const demoAlert = page.getByText(/demo account/i).first();
    await expect(demoAlert).toBeVisible();
  });
});