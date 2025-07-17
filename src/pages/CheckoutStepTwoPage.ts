import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ProductId, PRODUCT_NAMES } from '../data/products';
import { Header } from '../components/Header';

export class CheckoutStepTwoPage extends BasePage {
  path = '/checkout-step-two.html';

  readonly header: Header;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly totalLabel: Locator;
  
  // Page structure elements
  readonly checkoutSummaryContainer: Locator;
  readonly cartList: Locator;
  readonly cartQuantityLabel: Locator;
  readonly cartDescLabel: Locator;
  readonly summaryInfo: Locator;
  readonly secondaryHeader: Locator;
  readonly title: Locator;
  readonly footer: Locator;
  
  // Summary information elements
  readonly paymentInfoLabel: Locator;
  readonly paymentInfoValue: Locator;
  readonly shippingInfoLabel: Locator;
  readonly shippingInfoValue: Locator;
  readonly totalInfoLabel: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    
    // Action buttons
    this.finishButton = page.getByTestId('finish');
    this.cancelButton = page.getByTestId('cancel');
    this.totalLabel = page.getByTestId('total-label');
    
    // Page structure elements
    this.checkoutSummaryContainer = page.getByTestId('checkout-summary-container');
    this.cartList = page.getByTestId('cart-list');
    this.cartQuantityLabel = page.getByTestId('cart-quantity-label');
    this.cartDescLabel = page.getByTestId('cart-desc-label');
    this.summaryInfo = page.locator('.summary_info');
    this.secondaryHeader = page.getByTestId('secondary-header');
    this.title = page.getByTestId('title');
    this.footer = page.getByTestId('footer');
    
    // Summary information elements
    this.paymentInfoLabel = page.getByTestId('payment-info-label');
    this.paymentInfoValue = page.getByTestId('payment-info-value');
    this.shippingInfoLabel = page.getByTestId('shipping-info-label');
    this.shippingInfoValue = page.getByTestId('shipping-info-value');
    this.totalInfoLabel = page.getByTestId('total-info-label');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
  }

  /** Return the cart item container for a product ID in checkout overview. */
  cartItem(productId: ProductId): Locator {
    return this.page.locator(`[data-test="inventory-item"]:has([data-test="inventory-item-name"]:has-text("${PRODUCT_NAMES[productId]}"))`);
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

  async finish() {
    await this.finishButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async assertTotalContains(text: string) {
    await expect(this.totalLabel).toContainText(text);
  }

  // Comprehensive page assertions
  async assertPageElements() {
    console.log('Validating checkout overview page elements');
    
    // Assert main page structure
    await expect(this.checkoutSummaryContainer).toBeVisible();
    await expect(this.cartList).toBeVisible();
    await expect(this.secondaryHeader).toBeVisible();
    
    // Assert page title
    await expect(this.title).toBeVisible();
    await expect(this.title).toContainText('Checkout: Overview');
    
    // Assert cart headers
    await expect(this.cartQuantityLabel).toBeVisible();
    await expect(this.cartQuantityLabel).toContainText('QTY');
    await expect(this.cartDescLabel).toBeVisible();
    await expect(this.cartDescLabel).toContainText('Description');
    
    // Assert summary information section
    await expect(this.summaryInfo).toBeVisible();
    
    // Assert payment information
    await expect(this.paymentInfoLabel).toBeVisible();
    await expect(this.paymentInfoLabel).toContainText('Payment Information:');
    await expect(this.paymentInfoValue).toBeVisible();
    await expect(this.paymentInfoValue).toContainText('SauceCard #31337');
    
    // Assert shipping information
    await expect(this.shippingInfoLabel).toBeVisible();
    await expect(this.shippingInfoLabel).toContainText('Shipping Information:');
    await expect(this.shippingInfoValue).toBeVisible();
    await expect(this.shippingInfoValue).toContainText('Free Pony Express Delivery!');
    
    // Assert price total section
    await expect(this.totalInfoLabel).toBeVisible();
    await expect(this.totalInfoLabel).toContainText('Price Total');
    
    // Assert price breakdown
    await expect(this.subtotalLabel).toBeVisible();
    await expect(this.subtotalLabel).toContainText('Item total:');
    await expect(this.subtotalLabel).toContainText('$');
    
    await expect(this.taxLabel).toBeVisible();
    await expect(this.taxLabel).toContainText('Tax:');
    await expect(this.taxLabel).toContainText('$');
    
    await expect(this.totalLabel).toBeVisible();
    await expect(this.totalLabel).toContainText('Total:');
    await expect(this.totalLabel).toContainText('$');
    
    // Assert action buttons
    await expect(this.cancelButton).toBeVisible();
    await expect(this.cancelButton).toBeEnabled();
    await expect(this.cancelButton).toContainText('Cancel');
    
    await expect(this.finishButton).toBeVisible();
    await expect(this.finishButton).toBeEnabled();
    await expect(this.finishButton).toContainText('Finish');
    
    // Assert footer
    await expect(this.footer).toBeVisible();
    
    console.log('All checkout overview page elements validated successfully');
  }

  async assertOrderSummary(productIds: ProductId[]) {
    console.log('Validating order summary items');
    
    // Assert correct number of items in summary
    await expect(this.cartList.locator('[data-test="inventory-item"]')).toHaveCount(productIds.length);
    
    // Assert each product in the summary
    for (const productId of productIds) {
      await this.assertSummaryItem(productId);
    }
    
    console.log('Order summary validated successfully');
  }

  async assertSummaryItem(productId: ProductId, quantity: number = 1) {
    console.log(`Validating summary item: ${PRODUCT_NAMES[productId]}`);
    
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
    
    // Note: Remove buttons should NOT be present in checkout overview
    await expect(this.page.getByTestId(`remove-${productId}`)).not.toBeVisible();
    
    console.log(`Summary item validated successfully: ${productName}`);
  }

  async assertPricingCalculation() {
    console.log('Validating pricing calculation');
    
    // Get the text content of pricing elements
    const subtotalText = await this.subtotalLabel.textContent();
    const taxText = await this.taxLabel.textContent();
    const totalText = await this.totalLabel.textContent();
    
    // Extract numerical values (basic validation)
    const subtotalMatch = subtotalText?.match(/\$(\d+\.\d{2})/);
    const taxMatch = taxText?.match(/\$(\d+\.\d{2})/);
    const totalMatch = totalText?.match(/\$(\d+\.\d{2})/);
    
    expect(subtotalMatch).toBeTruthy();
    expect(taxMatch).toBeTruthy();
    expect(totalMatch).toBeTruthy();
    
    if (subtotalMatch && taxMatch && totalMatch) {
      const subtotal = parseFloat(subtotalMatch[1]);
      const tax = parseFloat(taxMatch[1]);
      const total = parseFloat(totalMatch[1]);
      
      // Verify total = subtotal + tax (with small tolerance for floating point)
      const calculatedTotal = subtotal + tax;
      expect(Math.abs(total - calculatedTotal)).toBeLessThan(0.01);
      
      console.log(`Pricing validated: Subtotal $${subtotal} + Tax $${tax} = Total $${total}`);
    }
    
    console.log('Pricing calculation validated successfully');
  }

  async assertOnPage() {
    await this.assertUrlContains('checkout-step-two.html');
  }
} 