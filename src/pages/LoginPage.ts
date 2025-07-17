import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  path = '/';

  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    super(page);
    this.username = page.getByTestId('username');
    this.password = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.error = page.getByTestId('error'); // appears only on error; safe to locate lazily
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
} 