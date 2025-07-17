import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ProductId, PRODUCT_NAMES } from '../data/products';
import { Header } from '../components/Header';

export class CartPage extends BasePage {
  path = '/cart.html';

  readonly header: Header;
  readonly continueShoppingButton: Locator;
  readonly checkout: Locator;
  
  // Page structure elements
  readonly cartContentsContainer: Locator;
  readonly cartList: Locator;
  readonly cartQuantityLabel: Locator;
  readonly cartDescLabel: Locator;
  readonly cartFooter: Locator;
  readonly secondaryHeader: Locator;
  readonly title: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    
    // Navigation buttons
    this.continueShoppingButton = page.getByTestId('continue-shopping');
    this.checkout = page.getByTestId('checkout');
    
    // Page structure elements
    this.cartContentsContainer = page.getByTestId('cart-contents-container');
    this.cartList = page.getByTestId('cart-list');
    this.cartQuantityLabel = page.getByTestId('cart-quantity-label');
    this.cartDescLabel = page.getByTestId('cart-desc-label');
    this.cartFooter = page.locator('.cart_footer');
    this.secondaryHeader = page.getByTestId('secondary-header');
    this.title = page.getByTestId('title');
    this.footer = page.getByTestId('footer');
  }

  /** Return the cart item container for a product ID. */
  cartItem(productId: ProductId): Locator {
    return this.page.locator(`[data-test="inventory-item"]:has([data-test="remove-${productId}"])`);
  }

  /** Return the item quantity locator for a cart item. */
  itemQuantity(productId: ProductId): Locator {
    return this.cartItem(productId).getByTestId('item-quantity');
  }

  /** Return the item name locator for a cart item. */
  itemName(productId: ProductId): Locator {
    return this.cartItem(productId).getByTestId('inventory-item-name');
  }

  /** Return the item description locator for a cart item. */
  itemDescription(productId: ProductId): Locator {
    return this.cartItem(productId).getByTestId('inventory-item-desc');
  }

  /** Return the item price locator for a cart item. */
  itemPrice(productId: ProductId): Locator {
    return this.cartItem(productId).getByTestId('inventory-item-price');
  }

  /** Return the remove button locator for a cart item. */
  removeButton(productId: ProductId): Locator {
    return this.page.getByTestId(`remove-${productId}`);
  }

  async proceedToCheckout() {
    await this.checkout.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async removeItem(productId: ProductId) {
    await this.removeButton(productId).click();
  }

  // Comprehensive page assertions
  async assertPageElements() {
    console.log('Validating cart page elements');
    
    // Assert main page structure
    await expect(this.cartContentsContainer).toBeVisible();
    await expect(this.cartList).toBeVisible();
    await expect(this.secondaryHeader).toBeVisible();
    
    // Assert page title
    await expect(this.title).toBeVisible();
    await expect(this.title).toContainText('Your Cart');
    
    // Assert cart headers
    await expect(this.cartQuantityLabel).toBeVisible();
    await expect(this.cartQuantityLabel).toContainText('QTY');
    await expect(this.cartDescLabel).toBeVisible();
    await expect(this.cartDescLabel).toContainText('Description');
    
    // Assert footer buttons
    await expect(this.cartFooter).toBeVisible();
    await expect(this.continueShoppingButton).toBeVisible();
    await expect(this.continueShoppingButton).toBeEnabled();
    await expect(this.continueShoppingButton).toContainText('Continue Shopping');
    
    await expect(this.checkout).toBeVisible();
    await expect(this.checkout).toBeEnabled();
    await expect(this.checkout).toContainText('Checkout');
    
    // Assert footer
    await expect(this.footer).toBeVisible();
    
    console.log('All cart page elements validated successfully');
  }

  async assertEmptyCart() {
    console.log('Validating empty cart state');
    
    // Assert no cart items are present
    await expect(this.cartList.locator('[data-test="inventory-item"]')).toHaveCount(0);
    
    // Cart badge should not be visible when empty
    await expect(this.header.cartBadge).not.toBeVisible();
    
    console.log('Empty cart state validated successfully');
  }

  async assertCartItemCount(expectedCount: number) {
    await expect(this.cartList.locator('[data-test="inventory-item"]')).toHaveCount(expectedCount);
    
    if (expectedCount > 0) {
      await expect(this.header.cartBadge).toBeVisible();
      await expect(this.header.cartBadge).toContainText(expectedCount.toString());
    } else {
      await expect(this.header.cartBadge).not.toBeVisible();
    }
  }

  async assertCartItem(productId: ProductId, quantity: number = 1) {
    console.log(`Validating cart item: ${PRODUCT_NAMES[productId]}`);
    
    const productName = PRODUCT_NAMES[productId];
    
    // Assert cart item is visible
    await expect(this.cartItem(productId)).toBeVisible();
    
    // Assert quantity
    await expect(this.itemQuantity(productId)).toBeVisible();
    await expect(this.itemQuantity(productId)).toContainText(quantity.toString());
    
    // Assert product name
    await expect(this.itemName(productId)).toBeVisible();
    await expect(this.itemName(productId)).toContainText(productName);
    
    // Assert product description exists
    await expect(this.itemDescription(productId)).toBeVisible();
    
    // Assert product price is formatted correctly
    await expect(this.itemPrice(productId)).toBeVisible();
    await expect(this.itemPrice(productId)).toContainText('$');
    
    // Assert remove button is visible and enabled
    await expect(this.removeButton(productId)).toBeVisible();
    await expect(this.removeButton(productId)).toBeEnabled();
    await expect(this.removeButton(productId)).toContainText('Remove');
    
    console.log(`Cart item validated successfully: ${productName}`);
  }

  async assertCartItems(productIds: ProductId[]) {
    console.log('Validating all cart items');
    
    await this.assertCartItemCount(productIds.length);
    
    for (const productId of productIds) {
      await this.assertCartItem(productId);
    }
    
    console.log('All cart items validated successfully');
  }

  async assertOnPage() {
    await this.assertUrlContains('cart.html');
  }
} 