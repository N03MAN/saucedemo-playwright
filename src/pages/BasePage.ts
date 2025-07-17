import { Page, expect, Locator } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;
  protected constructor(page: Page) { 
    this.page = page; 
  }
  
  abstract path: string;

  async goto(params: string = '') {
    await this.page.goto(`${this.path}${params}`);
  }

  async assertUrlContains(fragment: string = this.path) {
    await expect(this.page).toHaveURL(new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  protected async clickWhenVisible(locator: Locator) {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }
} 