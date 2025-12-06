import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../pages/DashboardPage';

test.describe('Dashboard - Slides & Projects', () => {
  
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
        'To fix: Delete storageState.json and run: npx playwright test tests/dashboard/dashboard-slides.spec.ts'
      );
    }

    // Ensure dashboard is fully loaded
    await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
    await expect(page.locator('main')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('main')).toBeVisible({ timeout: 10000 });
  });

  test('Slides tab renders columns and selection actions', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await expect(dashboard.slidesTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByText('Slide Name')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Image Type')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Date')).toBeVisible({ timeout: 5000 });

    await expect(dashboard.firstSlideCheckbox).toBeVisible({ timeout: 5000 });
    await expect(dashboard.createProjectBtn).toBeDisabled();
    await dashboard.selectFirstSlide();
    await expect(dashboard.firstSlideCheckbox).toBeChecked();
    await expect(dashboard.createProjectBtn).not.toBeDisabled();
  });

  test('Projects tab displays projects list with columns', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    
    await dashboard.switchToProjectsTab();
    await expect(dashboard.projectsTab).toHaveAttribute('aria-selected', 'true');
    
    await expect(page.getByText('Title')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Creation Date')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Tissue Type')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Stains')).toBeVisible({ timeout: 5000 });
  });

  test('Upload and Filter functionality on Slides tab', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    
    const uploadBtn = page.getByRole('button', { name: /Upload Slides/i }).first();
    await expect(uploadBtn).toBeVisible();
    const uploadWrapper = uploadBtn.locator('xpath=ancestor::div[@data-testid="permission-wrapper"][1]');
    await expect(uploadWrapper).toHaveAttribute('data-permission-disabled', 'true');
  
    await dashboard.openFilters();
    
    const filterMenu = page.locator('[role="menu"]');
    await expect(filterMenu).toBeVisible({ timeout: 5000 });
    
    const filterOptions = [
      'Tissue Type',
      'Species',
      'Image Type',
      'Stains'
    ];
    
    // Ensure menu items rendered
    await expect(filterMenu.locator('div')).toHaveCount(4, { timeout: 5000 });

    for (const option of filterOptions) {
      // Scope to the opened menu to avoid matching other page text
      const filterOption = filterMenu.getByText(option, { exact: true });
      await expect(filterOption).toBeVisible({ timeout: 5000 });
      console.log(`✓ ${option} filter option is visible`);
    }
    
    console.log('✓ All filter options are visible');
  });
});