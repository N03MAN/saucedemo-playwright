import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { PRODUCTS, ProductId, PRODUCT_NAMES } from '../data/products';
import { Header } from '../components/Header';

export class InventoryPage extends BasePage {
  path = '/inventory.html';

  readonly header: Header;
  readonly sortSelect: Locator;
  
  // Page structure elements
  readonly inventoryContainer: Locator;
  readonly inventoryList: Locator;
  readonly secondaryHeader: Locator;
  readonly title: Locator;
  readonly activeOption: Locator;
  readonly footer: Locator;
  readonly socialLinks: Locator;
  readonly footerCopy: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    
    // Sort and filtering
    this.sortSelect = page.getByTestId('product-sort-container');
    this.activeOption = page.getByTestId('active-option');
    
    // Page structure elements
    this.inventoryContainer = page.getByTestId('inventory-container');
    this.inventoryList = page.getByTestId('inventory-list');
    this.secondaryHeader = page.getByTestId('secondary-header');
    this.title = page.getByTestId('title');
    
    // Footer elements
    this.footer = page.getByTestId('footer');
    this.socialLinks = page.locator('.social');
    this.footerCopy = page.getByTestId('footer-copy');
  }

  /** Return the 'Add' button locator for a product ID. */
  addButton(productId: ProductId): Locator {
    return this.page.getByTestId(`add-to-cart-${productId}`);
  }

  /** Return the 'Remove' button locator for a product ID (post add). */
  removeButton(productId: ProductId): Locator {
    return this.page.getByTestId(`remove-${productId}`);
  }

  /** Return the product item container for a product ID. */
  productItem(productId: ProductId): Locator {
    return this.page.locator(`[data-test="inventory-item"]:has([data-test="add-to-cart-${productId}"])`);
  }

  /** Return the product name locator for a product ID. */
  productName(productId: ProductId): Locator {
    return this.productItem(productId).getByTestId('inventory-item-name');
  }

  /** Return the product description locator for a product ID. */
  productDescription(productId: ProductId): Locator {
    return this.productItem(productId).getByTestId('inventory-item-desc');
  }

  /** Return the product price locator for a product ID. */
  productPrice(productId: ProductId): Locator {
    return this.productItem(productId).getByTestId('inventory-item-price');
  }

  /** Return the product image locator for a product ID. */
  productImage(productId: ProductId): Locator {
    return this.productItem(productId).locator('img');
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

  // Comprehensive page assertions
  async assertPageElements() {
    console.log('Validating inventory page elements');
    
    // Assert main page structure
    await expect(this.inventoryContainer).toBeVisible();
    await expect(this.inventoryList).toBeVisible();
    await expect(this.secondaryHeader).toBeVisible();
    
    // Assert page title
    await expect(this.title).toBeVisible();
    await expect(this.title).toContainText('Products');
    
    // Assert sorting functionality
    await expect(this.sortSelect).toBeVisible();
    await expect(this.activeOption).toBeVisible();
    await expect(this.activeOption).toContainText('Name (A to Z)');
    
    // Assert all products are displayed
    const allProducts = Object.values(PRODUCTS);
    await expect(this.inventoryList.locator('[data-test="inventory-item"]')).toHaveCount(allProducts.length);
    
    // Assert footer elements
    await expect(this.footer).toBeVisible();
    await expect(this.socialLinks).toBeVisible();
    await expect(this.footerCopy).toBeVisible();
    await expect(this.footerCopy).toContainText('© 2025 Sauce Labs. All Rights Reserved');
    
    // Assert social media links
    await expect(this.footer.getByTestId('social-twitter')).toBeVisible();
    await expect(this.footer.getByTestId('social-facebook')).toBeVisible();
    await expect(this.footer.getByTestId('social-linkedin')).toBeVisible();
    
    console.log('All inventory page elements validated successfully');
  }

  async assertAllProductsVisible() {
    console.log('Validating all products are visible and properly formatted');
    
    const allProducts = Object.values(PRODUCTS);
    for (const productId of allProducts) {
      const productName = PRODUCT_NAMES[productId];
      
      // Assert product container is visible
      await expect(this.productItem(productId)).toBeVisible();
      
      // Assert product name
      await expect(this.productName(productId)).toBeVisible();
      await expect(this.productName(productId)).toContainText(productName);
      
      // Assert product description exists
      await expect(this.productDescription(productId)).toBeVisible();
      
      // Assert product price is formatted correctly
      await expect(this.productPrice(productId)).toBeVisible();
      await expect(this.productPrice(productId)).toContainText('$');
      
      // Assert product image is visible
      await expect(this.productImage(productId)).toBeVisible();
      
      // Assert add to cart button is visible and enabled
      await expect(this.addButton(productId)).toBeVisible();
      await expect(this.addButton(productId)).toBeEnabled();
      await expect(this.addButton(productId)).toContainText('Add to cart');
    }
    
    console.log('All products validated successfully');
  }

  async assertProductAdded(productId: ProductId) {
    // After adding, the button should change to "Remove"
    await expect(this.removeButton(productId)).toBeVisible();
    await expect(this.removeButton(productId)).toContainText('Remove');
    await expect(this.addButton(productId)).not.toBeVisible();
  }

  async assertProductRemoved(productId: ProductId) {
    // After removing, the button should change back to "Add to cart"
    await expect(this.addButton(productId)).toBeVisible();
    await expect(this.addButton(productId)).toContainText('Add to cart');
    await expect(this.removeButton(productId)).not.toBeVisible();
  }

  async assertSortingOptions() {
    await expect(this.sortSelect).toBeVisible();
    
    // Check that all sorting options are available
    const sortOptions = [
      'Name (A to Z)',
      'Name (Z to A)',
      'Price (low to high)',
      'Price (high to low)'
    ];
    
    for (const option of sortOptions) {
      await expect(this.sortSelect.locator(`option:has-text("${option}")`)).toBeAttached();
    }
  }

  async selectSortOption(option: string) {
    await this.sortSelect.selectOption({ label: option });
    await expect(this.activeOption).toContainText(option);
  }
} 