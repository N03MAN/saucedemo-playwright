import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  path = '/';

  // Form elements
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly error: Locator;

  // Page structure elements
  readonly loginContainer: Locator;
  readonly loginLogo: Locator;
  readonly loginWrapper: Locator;
  readonly loginCredentialsContainer: Locator;
  readonly loginCredentials: Locator;
  readonly loginPassword: Locator;

  constructor(page: Page) {
    super(page);
    
    // Form elements
    this.username = page.getByTestId('username');
    this.password = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.error = page.locator('.error-message-container');

    // Page structure elements
    this.loginContainer = page.getByTestId('login-container');
    this.loginLogo = page.locator('.login_logo');
    this.loginWrapper = page.locator('.login_wrapper');
    this.loginCredentialsContainer = page.getByTestId('login-credentials-container');
    this.loginCredentials = page.getByTestId('login-credentials');
    this.loginPassword = page.getByTestId('login-password');
  }

  async login(user: string, pass: string) {
    await this.goto();
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.loginButton.click();
  }

  async assertLoginErrorContains(text: string) {
    await expect(this.error).toContainText(text);
  }

  // Comprehensive page assertions
  async assertPageElements() {
    console.log('Validating login page elements');
    
    // Assert main containers are visible
    await expect(this.loginContainer).toBeVisible();
    await expect(this.loginWrapper).toBeVisible();
    await expect(this.loginCredentialsContainer).toBeVisible();
    
    // Assert logo and branding
    await expect(this.loginLogo).toBeVisible();
    await expect(this.loginLogo).toContainText('Swag Labs');
    
    // Assert form elements are visible and enabled
    await expect(this.username).toBeVisible();
    await expect(this.username).toBeEnabled();
    await expect(this.username).toHaveAttribute('placeholder', 'Username');
    await expect(this.username).toHaveAttribute('type', 'text');
    
    await expect(this.password).toBeVisible();
    await expect(this.password).toBeEnabled();
    await expect(this.password).toHaveAttribute('placeholder', 'Password');
    await expect(this.password).toHaveAttribute('type', 'password');
    
    await expect(this.loginButton).toBeVisible();
    await expect(this.loginButton).toBeEnabled();
    await expect(this.loginButton).toHaveValue('Login');
    
    // Assert credentials information is displayed
    await expect(this.loginCredentials).toBeVisible();
    await expect(this.loginCredentials).toContainText('Accepted usernames are:');
    await expect(this.loginCredentials).toContainText('standard_user');
    await expect(this.loginCredentials).toContainText('locked_out_user');
    await expect(this.loginCredentials).toContainText('problem_user');
    await expect(this.loginCredentials).toContainText('performance_glitch_user');
    await expect(this.loginCredentials).toContainText('error_user');
    await expect(this.loginCredentials).toContainText('visual_user');
    
    await expect(this.loginPassword).toBeVisible();
    await expect(this.loginPassword).toContainText('Password for all users:');
    await expect(this.loginPassword).toContainText('secret_sauce');
    
    console.log('All login page elements validated successfully');
  }

  async assertEmptyForm() {
    await expect(this.username).toHaveValue('');
    await expect(this.password).toHaveValue('');
  }

  async assertErrorMessageVisible() {
    await expect(this.error).toBeVisible();
  }

  async assertErrorMessageHidden() {
    // Check if error container is empty (no error message)
    const errorText = await this.error.textContent();
    expect(errorText?.trim()).toBe('');
  }
} 