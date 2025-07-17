import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ProductId } from '../data/products';

export class CartPage extends BasePage {
  path = '/cart.html';

  readonly continueShopping: Locator;
  readonly checkout: Locator;

  constructor(page: Page) {
    super(page);
    this.continueShopping = page.getByTestId('continue-shopping');
    this.checkout = page.getByTestId('checkout');
  }

  async proceedToCheckout() {
    await this.checkout.click();
  }
} 