import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
  path = '/checkout-complete.html';

  readonly completeHeader: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.completeHeader = page.getByTestId('complete-header');
    this.backHomeButton = page.getByTestId('back-to-products');
  }

  async assertThankYou() {
    await expect(this.completeHeader).toContainText('Thank you for your order');
  }

  async backHome() {
    await this.backHomeButton.click();
  }
} 