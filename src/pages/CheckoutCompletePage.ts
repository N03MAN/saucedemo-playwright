import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Header } from '../components/Header';

export class CheckoutCompletePage extends BasePage {
  path = '/checkout-complete.html';

  readonly header: Header;
  readonly completeHeader: Locator;
  readonly backHomeButton: Locator;
  
  // Page structure elements
  readonly checkoutCompleteContainer: Locator;
  readonly ponyExpressImage: Locator;
  readonly completeText: Locator;
  readonly secondaryHeader: Locator;
  readonly title: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    
    // Main completion elements
    this.completeHeader = page.getByTestId('complete-header');
    this.backHomeButton = page.getByTestId('back-to-products');
    
    // Page structure elements
    this.checkoutCompleteContainer = page.getByTestId('checkout-complete-container');
    this.ponyExpressImage = page.locator('img[alt="Pony Express"]');
    this.completeText = page.getByTestId('complete-text');
    this.secondaryHeader = page.getByTestId('secondary-header');
    this.title = page.getByTestId('title');
    this.footer = page.getByTestId('footer');
  }

  async assertThankYou() {
    await expect(this.completeHeader).toContainText('Thank you for your order');
  }

  async backHome() {
    await this.backHomeButton.click();
  }

  // Comprehensive page assertions
  async assertPageElements() {
    console.log('Validating checkout complete page elements');
    
    // Assert main page structure
    await expect(this.checkoutCompleteContainer).toBeVisible();
    await expect(this.secondaryHeader).toBeVisible();
    
    // Assert page title
    await expect(this.title).toBeVisible();
    await expect(this.title).toContainText('Checkout: Complete!');
    
    // Assert pony express image
    await expect(this.ponyExpressImage).toBeVisible();
    await expect(this.ponyExpressImage).toHaveAttribute('alt', 'Pony Express');
    
    // Assert completion message
    await expect(this.completeHeader).toBeVisible();
    await expect(this.completeHeader).toContainText('Thank you for your order!');
    
    // Assert completion description
    await expect(this.completeText).toBeVisible();
    await expect(this.completeText).toContainText('Your order has been dispatched');
    await expect(this.completeText).toContainText('pony can get there');
    
    // Assert back home button
    await expect(this.backHomeButton).toBeVisible();
    await expect(this.backHomeButton).toBeEnabled();
    await expect(this.backHomeButton).toContainText('Back Home');
    
    // Assert footer
    await expect(this.footer).toBeVisible();
    
    console.log('All checkout complete page elements validated successfully');
  }

  async assertOrderCompletion() {
    console.log('Validating order completion state');
    
    // Assert that we're on the completion page
    await this.assertOnPage();
    
    // Assert success message is displayed
    await this.assertThankYou();
    
    // Assert completion text contains delivery information
    await expect(this.completeText).toContainText('dispatched');
    
    // Assert cart should be empty (no cart badge visible)
    await expect(this.header.cartBadge).not.toBeVisible();
    
    console.log('Order completion state validated successfully');
  }

  async assertSuccessfulCheckout() {
    console.log('Validating successful checkout completion');
    
    // Comprehensive validation of successful checkout state
    await this.assertPageElements();
    await this.assertOrderCompletion();
    
    // Verify all key success indicators
    await expect(this.completeHeader).toBeVisible();
    await expect(this.ponyExpressImage).toBeVisible();
    await expect(this.backHomeButton).toBeVisible();
    
    console.log('Successful checkout completion validated');
  }

  async assertOnPage() {
    await this.assertUrlContains('checkout-complete.html');
  }
} 