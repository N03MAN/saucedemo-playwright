import { Page, Locator, expect } from '@playwright/test';

export class Header {
  readonly page: Page;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly burgerButton: Locator;
  
  // Header structure elements
  readonly headerContainer: Locator;
  readonly primaryHeader: Locator;
  readonly appLogo: Locator;
  readonly menuButtonContainer: Locator;
  readonly shoppingCartContainer: Locator;
  
  // Burger menu elements
  readonly burgerMenu: Locator;
  readonly menuItemList: Locator;
  readonly inventorySidebarLink: Locator;
  readonly aboutSidebarLink: Locator;
  readonly logoutSidebarLink: Locator;
  readonly resetSidebarLink: Locator;
  readonly closeMenuButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Main header elements
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.burgerButton = page.locator('#react-burger-menu-btn');
    
    // Header structure elements
    this.headerContainer = page.getByTestId('header-container');
    this.primaryHeader = page.getByTestId('primary-header');
    this.appLogo = page.locator('.app_logo');
    this.menuButtonContainer = page.locator('#menu_button_container');
    this.shoppingCartContainer = page.locator('#shopping_cart_container');
    
    // Burger menu elements
    this.burgerMenu = page.locator('.bm-menu');
    this.menuItemList = page.locator('.bm-item-list');
    this.inventorySidebarLink = page.getByTestId('inventory-sidebar-link');
    this.aboutSidebarLink = page.getByTestId('about-sidebar-link');
    this.logoutSidebarLink = page.getByTestId('logout-sidebar-link');
    this.resetSidebarLink = page.getByTestId('reset-sidebar-link');
    this.closeMenuButton = page.locator('#react-burger-cross-btn');
  }

  async clickCart() {
    await this.cartLink.click();
  }

  async openBurgerMenu() {
    await this.burgerButton.click();
  }

  async closeBurgerMenu() {
    await this.closeMenuButton.click();
  }

  async clickInventoryLink() {
    await this.inventorySidebarLink.click();
  }

  async clickAboutLink() {
    await this.aboutSidebarLink.click();
  }

  async clickLogoutLink() {
    await this.logoutSidebarLink.click();
  }

  async clickResetLink() {
    await this.resetSidebarLink.click();
  }

  // Comprehensive header assertions
  async assertHeaderElements() {
    console.log('Validating header elements');
    
    // Assert main header structure
    await expect(this.headerContainer).toBeVisible();
    await expect(this.primaryHeader).toBeVisible();
    
    // Assert branding
    await expect(this.appLogo).toBeVisible();
    await expect(this.appLogo).toContainText('Swag Labs');
    
    // Assert menu button
    await expect(this.menuButtonContainer).toBeVisible();
    await expect(this.burgerButton).toBeVisible();
    await expect(this.burgerButton).toBeEnabled();
    
    // Assert shopping cart
    await expect(this.shoppingCartContainer).toBeVisible();
    await expect(this.cartLink).toBeVisible();
    await expect(this.cartLink).toBeEnabled();
    
    console.log('Header elements validated successfully');
  }

  async assertCartBadge(expectedCount: number) {
    if (expectedCount > 0) {
      await expect(this.cartBadge).toBeVisible();
      await expect(this.cartBadge).toContainText(expectedCount.toString());
    } else {
      await expect(this.cartBadge).not.toBeVisible();
    }
  }

  async assertEmptyCart() {
    await this.assertCartBadge(0);
  }

  async assertBurgerMenuClosed() {
    // Menu should be hidden by default
    await expect(this.burgerMenu).toHaveAttribute('aria-hidden', 'true');
  }

  async assertBurgerMenuOpen() {
    // Menu should be visible when opened
    await expect(this.burgerMenu).toHaveAttribute('aria-hidden', 'false');
    await expect(this.menuItemList).toBeVisible();
    
    // Assert all menu items are visible
    await expect(this.inventorySidebarLink).toBeVisible();
    await expect(this.inventorySidebarLink).toContainText('All Items');
    
    await expect(this.aboutSidebarLink).toBeVisible();
    await expect(this.aboutSidebarLink).toContainText('About');
    
    await expect(this.logoutSidebarLink).toBeVisible();
    await expect(this.logoutSidebarLink).toContainText('Logout');
    
    await expect(this.resetSidebarLink).toBeVisible();
    await expect(this.resetSidebarLink).toContainText('Reset App State');
    
    // Assert close button is visible
    await expect(this.closeMenuButton).toBeVisible();
    await expect(this.closeMenuButton).toBeEnabled();
  }

  async assertBurgerMenuFunctionality() {
    console.log('Testing burger menu functionality');
    
    // Initially menu should be closed
    await this.assertBurgerMenuClosed();
    
    // Open menu
    await this.openBurgerMenu();
    await this.assertBurgerMenuOpen();
    
    // Close menu
    await this.closeBurgerMenu();
    await this.assertBurgerMenuClosed();
    
    console.log('Burger menu functionality validated successfully');
  }

  async assertMenuLinks() {
    console.log('Validating menu links');
    
    // Open menu first
    await this.openBurgerMenu();
    
    // Assert all links are properly configured
    await expect(this.inventorySidebarLink).toHaveAttribute('href', '#');
    await expect(this.aboutSidebarLink).toHaveAttribute('href', 'https://saucelabs.com/');
    await expect(this.logoutSidebarLink).toHaveAttribute('href', '#');
    await expect(this.resetSidebarLink).toHaveAttribute('href', '#');
    
    // Close menu
    await this.closeBurgerMenu();
    
    console.log('Menu links validated successfully');
  }
} 