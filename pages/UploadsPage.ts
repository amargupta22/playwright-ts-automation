import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class UploadsPage extends BasePage {
  readonly slideUploadDashboardText;
  readonly slideManagementDashboardText;
  readonly uploadTab;
  readonly uploadSlidesText;
  readonly uploadDescriptionText;
  readonly uploadGuidelinesText;
  readonly properlyLabeledText;
  readonly autoProcessedText;
  readonly fewMinutesText;
  readonly supportedFormatsText;
  readonly maximumFileSizeText;
  readonly dragDropText;
  readonly uploadButton;
  readonly inProgressTab;
  readonly fileUploadInput;

  constructor(public override page: Page) {
  super(page);

  // Page title and subtitle
  this.slideUploadDashboardText = page.getByText('Slide Upload Dashboard');
  this.slideManagementDashboardText = page.getByText('Slide Management Dashboard');

  // Upload tab
  this.uploadTab = page.getByRole('tab', { name: 'Upload' });

  // Upload section text
  this.uploadSlidesText = page.getByText('Upload Slides');
  this.uploadDescriptionText = page.getByText(/Select and upload slide files/i);

  // Guidelines section
  this.uploadGuidelinesText = page.getByText('Upload Guidelines:');
  this.properlyLabeledText = page.getByText(/properly labeled/i);
  this.autoProcessedText = page.getByText(/auto-processed/i);
  this.fewMinutesText = page.getByText(/few minutes/i);

    // File format and size info
    this.supportedFormatsText = page.getByText(/Supported formats:/i);
    this.maximumFileSizeText = page.getByText(/Maximum file size:/i);

    // Upload zone
    this.dragDropText = page.getByText(/Choose files or drag and drop/i);

    // Buttons
    this.uploadButton = page.locator('main').getByRole('button', { name: 'Upload' });

    // Tabs
    this.inProgressTab = page.getByRole('tab', { name: 'In Progress' });

    // File input
    this.fileUploadInput = page.locator('input[type="file"]');
  }

  async verifyUploadDashboardVisible() {
    await expect(this.slideUploadDashboardText).toBeVisible();
    await expect(this.slideManagementDashboardText).toBeVisible();
  }

  async verifyUploadTabSelected() {
    await expect(this.uploadTab).toHaveAttribute('aria-selected', 'true');
  }

  async verifyUploadInterfaceVisible() {
    await expect(this.uploadSlidesText).toBeVisible();
    await expect(this.uploadDescriptionText).toBeVisible();
  }

  async verifyGuidelinesVisible() {
    await expect(this.uploadGuidelinesText).toBeVisible();
    await expect(this.properlyLabeledText).toBeVisible();
    await expect(this.autoProcessedText).toBeVisible();
    await expect(this.fewMinutesText).toBeVisible();
  }

  async verifySupportedFormatsListed() {
    await expect(this.supportedFormatsText).toBeVisible();
    const formatText = await this.supportedFormatsText.locator('..').textContent();
    expect(formatText).toContain('czi');
    expect(formatText).toContain('tif');
    expect(formatText).toContain('svs');
  }

  async verifyMaximumFileSizeSpecified() {
    await expect(this.maximumFileSizeText).toBeVisible();
    const sizeText = await this.maximumFileSizeText.textContent();
    expect(sizeText).toContain('40');
    expect(sizeText).toContain('GB');
  }

  async verifyDropZoneVisible() {
    await expect(this.dragDropText).toBeVisible();
  }

  async verifyUploadButtonPresent() {
    await expect(this.uploadButton).toBeVisible();
  }

  async switchToInProgressTab() {
    await this.inProgressTab.click();
    await this.page.waitForTimeout(2000);
  }

  async uploadFile(filePath: string) {
    await this.fileUploadInput.setInputFiles(filePath);
    await this.page.waitForTimeout(1000);
  }

  async clickUploadButton() {
    await this.uploadButton.click();
    await this.page.waitForTimeout(2000);
  }
}
