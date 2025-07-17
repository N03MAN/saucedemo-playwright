import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutStepTwoPage extends BasePage {
  path = '/checkout-step-two.html';

  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly totalLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.finishButton = page.getByTestId('finish');
    this.cancelButton = page.getByTestId('cancel');
    this.totalLabel = page.getByTestId('total-label');
  }

  async finish() {
    await this.finishButton.click();
  }

  async assertTotalContains(text: string) {
    await expect(this.totalLabel).toContainText(text);
  }
} 