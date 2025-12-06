import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { time } from 'console';

export class LoginPage extends BasePage {
  readonly signInAuth0Button;
  readonly emailInput;
  readonly passwordInput;
  readonly continueButton;
  readonly organizationActivityText;

  constructor(public override page: Page) {
    super(page);

    this.signInAuth0Button = page.getByRole('button', { name: 'Sign In Auth0' });
    this.emailInput = page.getByRole('textbox', { name: 'Email address' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });
    this.organizationActivityText = page.getByText('Organization Activity');
  }

  async open() {
    await this.goto('/');
  }

  async startAuth0() {
    await this.signInAuth0Button.click();
    await this.page.waitForURL('**/u/login**');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.continueButton.click();
    await this.passwordInput.waitFor();
    await this.passwordInput.fill(password);
    await this.continueButton.click();
    await this.page.waitForURL('https://development.prism.deepstain.com/**', { timeout: 60000 });
  }

  async expectLoggedIn() {
    await expect(this.organizationActivityText).toBeVisible({ timeout:60000  });
  }
}
