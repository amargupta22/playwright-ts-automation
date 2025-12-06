import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ReportsPage extends BasePage {
  readonly organizationReportsText;
  readonly detailedDocumentsText;
  readonly stainsTab;
  readonly usersTab;
  readonly stainCompletedText;
  readonly chartElements;
  readonly immunohistochemistryText;
  readonly hematoxylinEosinText;
  readonly specialStainText;
  readonly yearDropdown;
  readonly downloadButton;
  readonly immunohistochemistryButton;

  constructor(public override page: Page) {
    super(page);

    // Report section elements
    this.organizationReportsText = page.getByText('Organization Reports');
    this.detailedDocumentsText = page.getByText(/Detailed Documents/i);

    // Tab elements
    this.stainsTab = page.getByRole('tab', { name: 'STAINS' });
    this.usersTab = page.getByRole('tab', { name: 'USERS' });

    // Report description
    this.stainCompletedText = page.getByText(/stains.*completed/i);

    // Chart
    this.chartElements = page.locator('svg');

    // Stain type details
    this.immunohistochemistryText = page.getByText('Immunohistochemistry');
    this.hematoxylinEosinText = page.getByText('Hematoxylin and Eosin');
    this.specialStainText = page.getByText('Special Stain');

    // Controls
    this.yearDropdown = page.locator('role=combobox').first();
    this.downloadButton = page.getByRole('button', { name: /Download/i });
    this.immunohistochemistryButton = page.getByRole('button', { name: /Immunohistochemistry/i });
  }

  async verifyOrganizationReportsVisible() {
    await expect(this.organizationReportsText).toBeVisible();
  }

  async verifyReportDescriptionVisible() {
    await expect(this.detailedDocumentsText).toBeVisible();
  }

  async verifySstainsTabVisible() {
    await expect(this.stainsTab).toBeVisible();
  }

  async verifyStainUsageReportVisible() {
    await expect(this.stainCompletedText).toBeVisible();
  }

  async verifyChartDisplayed() {
    const chartCount = await this.chartElements.count();
    expect(chartCount).toBeGreaterThan(0);
  }

  async verifyStainTypesVisible() {
    await expect(this.immunohistochemistryText).toBeVisible();
    await expect(this.hematoxylinEosinText).toBeVisible();
    await expect(this.specialStainText).toBeVisible();
  }

  async verifyYearSelectorPresent() {
    await expect(this.yearDropdown).toBeVisible();
    const value = await this.yearDropdown.inputValue();
    expect(value).toMatch(/\d{4}/);
  }

  async verifyDownloadButtonPresent() {
    await expect(this.downloadButton).toBeVisible();
  }

  async switchToUsersTab() {
    await this.usersTab.click();
    await this.page.waitForTimeout(2000);
  }

  async verifyUsersTabSelected() {
    await expect(this.usersTab).toHaveAttribute('aria-selected', 'true');
  }

  async clickStainTypeCard() {
    if (await this.immunohistochemistryButton.isVisible()) {
      await this.immunohistochemistryButton.click();
      await this.page.waitForTimeout(1000);
    }
  }

  async selectYear(year: string) {
    await this.yearDropdown.click();
    await this.page.getByRole('option', { name: year }).click();
    await this.page.waitForTimeout(1000);
  }

  async downloadReport() {
    await this.downloadButton.click();
    await this.page.waitForTimeout(2000);
  }
}
