import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class NavigationPage extends BasePage {
  readonly dashboardButton;
  readonly modelButton;
  readonly reportsButton;
  readonly uploadsButton;
  readonly moreButton;
  readonly logo;

  constructor(public override page: Page) {
    super(page);

    // Navigation menu buttons
    this.dashboardButton = page.getByRole('button', { name: 'Dashboard' });
    this.modelButton = page.getByRole('button', { name: 'Model' });
    this.reportsButton = page.getByRole('button', { name: 'Reports' });
    this.uploadsButton = page.getByRole('button', { name: 'Uploads' });
    this.moreButton = page.getByRole('button', { name: 'more' });
    this.logo = page.locator('img').first();
  }

  async verifyAllMenuButtonsVisible() {
    await expect(this.dashboardButton).toBeVisible();
    await expect(this.modelButton).toBeVisible();
    await expect(this.reportsButton).toBeVisible();
    await expect(this.uploadsButton).toBeVisible();
  }

  async navigateToDashboard() {
    await this.dashboardButton.click();
    await this.page.waitForTimeout(2000);
  }

  async navigateToModel() {
    await this.modelButton.click();
    await this.page.waitForTimeout(2000);
  }

  async navigateToReports() {
    await this.reportsButton.click();
    await this.page.waitForTimeout(2000);
  }

  async navigateToUploads() {
    await this.uploadsButton.click();
    await this.page.waitForTimeout(2000);
  }

  async verifyActiveDashboard() {
    const dashboardClass = await this.dashboardButton.getAttribute('class');
    expect(dashboardClass).toContain('active');
  }

  async verifyActiveModel() {
    const modelClass = await this.modelButton.getAttribute('class');
    expect(modelClass).toContain('active');
  }

  async verifyActiveReports() {
    const reportsClass = await this.reportsButton.getAttribute('class');
    expect(reportsClass).toContain('active');
  }

  async verifyActiveUploads() {
    const uploadsClass = await this.uploadsButton.getAttribute('class');
    expect(uploadsClass).toContain('active');
  }

  async clickLogo() {
    await this.logo.click();
    await this.page.waitForTimeout(2000);
  }

  async openMoreMenu() {
    await expect(this.moreButton).toBeVisible();
    await this.moreButton.click();
    await this.page.waitForTimeout(1000);
  }

  async verifyURLContains(urlPart: string) {
    expect(this.page.url()).toContain(urlPart);
  }
}
