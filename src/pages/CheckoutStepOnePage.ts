import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutStepOnePage extends BasePage {
  path = '/checkout-step-one.html';

  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.cancelButton = page.getByTestId('cancel');
  }

  /**
   * Submit customer information for checkout
   * @param first Customer's first name
   * @param last Customer's last name  
   * @param zip Customer's postal/zip code
   */
  async submitInfo(first: string, last: string, zip: string) {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.postalCode.fill(zip);
    await this.continueButton.click();
  }

  /**
   * Fill customer information without submitting
   * @param first Customer's first name
   * @param last Customer's last name
   * @param zip Customer's postal/zip code
   */
  async fillInfo(first: string, last: string, zip: string) {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.postalCode.fill(zip);
  }

  /**
   * Continue to next step after filling information
   */
  async continue() {
    await this.continueButton.click();
  }

  /**
   * Cancel checkout and return to cart
   */
  async cancel() {
    await this.cancelButton.click();
  }
} 