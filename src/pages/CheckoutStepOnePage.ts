import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Header } from '../components/Header';

export class CheckoutStepOnePage extends BasePage {
  path = '/checkout-step-one.html';

  readonly header: Header;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  
  // Page structure elements
  readonly checkoutInfoContainer: Locator;
  readonly checkoutInfoWrapper: Locator;
  readonly checkoutInfo: Locator;
  readonly checkoutButtons: Locator;
  readonly errorMessageContainer: Locator;
  readonly secondaryHeader: Locator;
  readonly title: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    
    // Form elements
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.cancelButton = page.getByTestId('cancel');
    
    // Page structure elements
    this.checkoutInfoContainer = page.getByTestId('checkout-info-container');
    this.checkoutInfoWrapper = page.locator('.checkout_info_wrapper');
    this.checkoutInfo = page.locator('.checkout_info');
    this.checkoutButtons = page.locator('.checkout_buttons');
    this.errorMessageContainer = page.locator('.error-message-container');
    this.secondaryHeader = page.getByTestId('secondary-header');
    this.title = page.getByTestId('title');
    this.footer = page.getByTestId('footer');
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

  // Comprehensive page assertions
  async assertPageElements() {
    console.log('Validating checkout information page elements');
    
    // Assert main page structure
    await expect(this.checkoutInfoContainer).toBeVisible();
    await expect(this.checkoutInfoWrapper).toBeVisible();
    await expect(this.checkoutInfo).toBeVisible();
    await expect(this.secondaryHeader).toBeVisible();
    
    // Assert page title
    await expect(this.title).toBeVisible();
    await expect(this.title).toContainText('Checkout: Your Information');
    
    // Assert form elements are visible and properly configured
    await expect(this.firstName).toBeVisible();
    await expect(this.firstName).toBeEnabled();
    await expect(this.firstName).toHaveAttribute('placeholder', 'First Name');
    await expect(this.firstName).toHaveAttribute('type', 'text');
    
    await expect(this.lastName).toBeVisible();
    await expect(this.lastName).toBeEnabled();
    await expect(this.lastName).toHaveAttribute('placeholder', 'Last Name');
    await expect(this.lastName).toHaveAttribute('type', 'text');
    
    await expect(this.postalCode).toBeVisible();
    await expect(this.postalCode).toBeEnabled();
    await expect(this.postalCode).toHaveAttribute('placeholder', 'Zip/Postal Code');
    await expect(this.postalCode).toHaveAttribute('type', 'text');
    
    // Assert buttons
    await expect(this.checkoutButtons).toBeVisible();
    
    await expect(this.cancelButton).toBeVisible();
    await expect(this.cancelButton).toBeEnabled();
    await expect(this.cancelButton).toContainText('Cancel');
    
    await expect(this.continueButton).toBeVisible();
    await expect(this.continueButton).toBeEnabled();
    await expect(this.continueButton).toHaveValue('Continue');
    
    // Assert footer
    await expect(this.footer).toBeVisible();
    
    console.log('All checkout information page elements validated successfully');
  }

  async assertEmptyForm() {
    console.log('Validating empty form state');
    
    await expect(this.firstName).toHaveValue('');
    await expect(this.lastName).toHaveValue('');
    await expect(this.postalCode).toHaveValue('');
    
    // Check if error container is empty (no error message)
    const errorText = await this.errorMessageContainer.textContent();
    expect(errorText?.trim()).toBe('');
    
    console.log('Empty form state validated successfully');
  }

  async assertFormValues(first: string, last: string, zip: string) {
    console.log(`Validating form values: ${first} ${last}, ${zip}`);
    
    await expect(this.firstName).toHaveValue(first);
    await expect(this.lastName).toHaveValue(last);
    await expect(this.postalCode).toHaveValue(zip);
    
    console.log('Form values validated successfully');
  }

  async assertErrorMessage(expectedMessage?: string) {
    console.log('Validating error message display');
    
    await expect(this.errorMessageContainer).toBeVisible();
    
    if (expectedMessage) {
      await expect(this.errorMessageContainer).toContainText(expectedMessage);
    }
    
    console.log('Error message validated successfully');
  }

  async assertNoErrorMessage() {
    await expect(this.errorMessageContainer).not.toBeVisible();
  }

  async assertRequiredFieldValidation() {
    console.log('Testing required field validation');
    
    // Try to submit with empty form
    await this.continueButton.click();
    
    // Should show error for required fields
    await this.assertErrorMessage();
    
    console.log('Required field validation tested successfully');
  }

  async assertFormInteractivity() {
    console.log('Testing form interactivity');
    
    // Test that fields accept input
    await this.firstName.fill('Test');
    await expect(this.firstName).toHaveValue('Test');
    
    await this.lastName.fill('User');
    await expect(this.lastName).toHaveValue('User');
    
    await this.postalCode.fill('12345');
    await expect(this.postalCode).toHaveValue('12345');
    
    // Clear fields
    await this.firstName.clear();
    await this.lastName.clear();
    await this.postalCode.clear();
    
    await this.assertEmptyForm();
    
    console.log('Form interactivity tested successfully');
  }

  async assertOnPage() {
    await this.assertUrlContains('checkout-step-one.html');
  }
} 