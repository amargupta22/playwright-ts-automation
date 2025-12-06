import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class StainManagementPage extends BasePage {
  readonly organizationModelsText;
  readonly organizationStainManagementText;
  readonly stainManagementTab;
  readonly autoDeepStainerText;
  readonly autoRestainterText;
  readonly heText;
  readonly cd45Text;
  readonly trichromeText;
  readonly versionText;
  readonly checkboxes;
  readonly firstCheckbox;
  readonly forResearchUseOnlyText;
  readonly totalStainersAvailableText;

  constructor(public override page: Page) {
  super(page);

  // Page title and subtitle
  this.organizationModelsText = page.getByText('Organization Models');
  this.organizationStainManagementText = page.getByText('Organization Stain Management');

  // Tab
  this.stainManagementTab = page.getByRole('tab', { name: 'Stain Management' });

  // Stainers
  this.autoDeepStainerText = page.getByText('Auto Deep Stainer');
  this.autoRestainterText = page.getByText('Auto Restainer');

  // Stain models - using .first() to avoid strict mode violations
  this.heText = page.getByText('H&E').first();
  this.cd45Text = page.getByText('CD45').first();
  this.trichromeText = page.getByText('Trichrome').first();

  // Version info
  this.versionText = page.locator('text="Version:"');

    // Checkboxes
    this.checkboxes = page.locator('input[type="checkbox"]');
    this.firstCheckbox = page.locator('input[type="checkbox"]').first();

    // Disclaimer
    this.forResearchUseOnlyText = page.getByText(/For Research Use Only/i);

    // Total stainers count
    this.totalStainersAvailableText = page.locator('text="Total Stainers Available"');
  }

  async verifyOrganizationModelsVisible() {
    await expect(this.organizationModelsText).toBeVisible();
  }

  async verifyOrganizationStainManagementVisible() {
    await expect(this.organizationStainManagementText).toBeVisible();
  }

  async verifyStainManagementTabVisible() {
    await expect(this.stainManagementTab).toBeVisible();
  }

  async verifyStainersDisplayed() {
    await expect(this.autoDeepStainerText).toBeVisible();
    await expect(this.autoRestainterText).toBeVisible();
  }

  async verifyStainModelsDisplayed() {
    await expect(this.heText).toBeVisible();
    await expect(this.cd45Text).toBeVisible();
    await expect(this.trichromeText).toBeVisible();
  }
 
  async verifyCheckboxesPresent() {
    const checkboxCount = await this.checkboxes.count();
    expect(checkboxCount).toBeGreaterThan(0);
  }

  async toggleFirstCheckbox() {
    const initialChecked = await this.firstCheckbox.isChecked();
    await this.firstCheckbox.click();
    await this.page.waitForTimeout(500);
    const newChecked = await this.firstCheckbox.isChecked();
    expect(newChecked).toBe(!initialChecked);
  }

  async verifyDisclaimerVisible() {
    await expect(this.forResearchUseOnlyText.first()).toBeVisible();
  }

  async verifyTotalStainersCountVisible() {
    await expect(this.totalStainersAvailableText).toBeVisible();
    const countNumber = this.totalStainersAvailableText.locator('..').locator('text=/\\d+/');
    const count = await countNumber.count();
    expect(count).toBeGreaterThan(0);
  }

  async getCheckboxCount() {
    return await this.checkboxes.count();
  }
}
