import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { testCredentials } from '../../fixtures/testCredentials';

test.describe('Authentication - Login (POM)', () => {
  // Use a fresh context without storageState for login test
  test.use({ storageState: { cookies: [], origins: [] } });

  test('User can successfully login with valid credentials', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.startAuth0();
    await login.login(testCredentials.email, testCredentials.password);

    // Verify user is on dashboard
    await expect(page).toHaveURL(/development.prism.deepstain.com/);
    // Allow more time for the organization text to appear on slower environments
    await expect(page.getByText('PictorLabs Hiring Org')).toBeVisible({ timeout: 15000 });
    await login.expectLoggedIn();
  });

});