import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { PRODUCTS, ProductId } from '../data/products';
import { Header } from '../components/Header';

export class InventoryPage extends BasePage {
  path = '/inventory.html';

  readonly header: Header;
  readonly sortSelect: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    // sort has no data-test; use id
    this.sortSelect = page.locator('[data-test="product-sort-container"], #product_sort_container'); // resilient
  }

  /** Return the 'Add' button locator for a product ID. */
  addButton(productId: ProductId): Locator {
    return this.page.getByTestId(`add-to-cart-${productId}`);
  }

  /** Return the 'Remove' button locator for a product ID (post add). */
  removeButton(productId: ProductId): Locator {
    return this.page.getByTestId(`remove-${productId}`);
  }

  async addProduct(productId: ProductId) {
    await this.addButton(productId).click();
  }

  async removeProduct(productId: ProductId) {
    await this.removeButton(productId).click();
  }

  async assertOnPage() {
    await this.assertUrlContains('inventory.html');
  }
} 