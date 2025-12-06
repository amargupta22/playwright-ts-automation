import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly organizationActivityText;
  readonly slideOverviewText;
  readonly totalWSISlidesText;
  readonly totalVSISlidesText;
  readonly totalDownloadsText;
  readonly stainUsageOverviewText;
  readonly ihcText;
  readonly specialText;
  readonly heText;
  readonly processingText;
  readonly totalText;
  readonly scannedSlidesQualityText;
  readonly passText;
  readonly failText;
  readonly progressBar;
  readonly alertElement;
  readonly demoAccountWarning;
  readonly supportEmailText;
  readonly dateDropdown;
  readonly slidesTab;
  readonly projectsTab;
  readonly searchBox;
  readonly firstSlideCheckbox;
  readonly createProjectBtn;
  readonly addFiltersBtn;
  readonly tableRows;

  constructor(public override page: Page) {
    super(page);

    // Organization Activity section
    this.organizationActivityText = page.getByText('Organization Activity');
    this.slideOverviewText = page.getByText('Slide Overview');
    this.totalWSISlidesText = page.getByText('Total WSI Slides Scanned');
    this.totalVSISlidesText = page.getByText('Total VSI Slides Stained');
    this.totalDownloadsText = page.getByText('Total Downloads');

    // Stain Usage Overview section
    this.stainUsageOverviewText = page.getByText('Stain Usage Overview');
    this.ihcText = page.getByText('IHC');
    this.specialText = page.getByText('Special');
    this.heText = page.getByText('H&E');
    this.processingText = page.getByText('Processing');
    this.totalText = page.getByText('Total');

    // Quality metrics section
    this.scannedSlidesQualityText = page.getByText('Scanned Slides Quality');
    this.passText = page.getByText('Pass');
    this.failText = page.getByText('Fail', { exact: true });
    this.progressBar = page.getByRole('progressbar')
    
    // Alert and warnings
    this.alertElement = page.locator('role=alert');
    this.demoAccountWarning = page.locator('role=alert');
    this.supportEmailText = page.getByText('support@pictorlabs.ai');

    // Date range selector
    this.dateDropdown = page.locator('role=combobox');

    // Slides and Projects tabs
    this.slidesTab = page.getByRole('tab', { name: 'Slides' });
    this.projectsTab = page.getByRole('tab', { name: 'Projects' });

    // Search and filters
    this.searchBox = page.locator('input[placeholder="Search"]');
    this.firstSlideCheckbox = page.locator('input[type="checkbox"]').first();
    this.createProjectBtn = page.getByRole('button', { name: /Create.*Project/i });
    this.addFiltersBtn = page.getByRole('button', { name: 'Add Filters' });

    // Table elements
    this.tableRows = page.locator('table tbody tr');
  }

  async verifyOrganizationActivityVisible() {
    await expect(this.organizationActivityText).toBeVisible();
  }

  async verifySlideOverviewVisible() {
    await expect(this.slideOverviewText).toBeVisible();
  }

  async verifyMetricsVisible() {
    await expect(this.totalWSISlidesText).toBeVisible();
    await expect(this.totalVSISlidesText).toBeVisible();
    await expect(this.totalDownloadsText).toBeVisible();
  }

  async verifyStainUsageOverviewVisible() {
    await expect(this.stainUsageOverviewText).toBeVisible();
    await expect(this.ihcText).toBeVisible();
    await expect(this.specialText).toBeVisible();
    await expect(this.heText).toBeVisible();
  }

  async verifyQualityMetricsVisible() {
    await expect(this.scannedSlidesQualityText).toBeVisible();
    await expect(this.passText).toBeVisible();
    await expect(this.failText).toBeVisible();
    
    await expect(this.progressBar).toBeVisible();
  }

  async verifyDemoWarningVisible() {
    await expect(this.demoAccountWarning).toBeVisible();
    await expect(this.demoAccountWarning).toContainText('demo account');
    await expect(this.supportEmailText).toBeVisible();
  }

  async switchToSlidesTab() {
    await this.slidesTab.click();
    await this.page.waitForTimeout(1000);
  }

  async switchToProjectsTab() {
    await this.projectsTab.click();
    await this.page.waitForTimeout(2000);
  }

  async searchSlides(searchTerm: string) {
    await this.searchBox.fill(searchTerm);
    await this.page.waitForTimeout(2000);
  }

  async selectFirstSlide() {
    await this.firstSlideCheckbox.click();
    await this.page.waitForTimeout(500);
  }

  async getSlideCount() {
    return await this.tableRows.count();
  }

  async openFilters() {
    await this.addFiltersBtn.click();
    await this.page.waitForTimeout(1000);
  }
}
