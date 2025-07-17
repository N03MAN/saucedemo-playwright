import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { CartPage } from '../../src/pages/CartPage';
import { CheckoutStepOnePage } from '../../src/pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../../src/pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../../src/pages/CheckoutCompletePage';
import { getRandomProducts, PRODUCT_NAMES } from '../../src/data/products';

test.describe('Sauce Demo - Happy Path Checkout', () => {
  test('standard user can purchase 3 random items', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const step1 = new CheckoutStepOnePage(page);
    const step2 = new CheckoutStepTwoPage(page);
    const complete = new CheckoutCompletePage(page);

    // Step 1: Login
    console.log('Step 1: Logging in...');
    await login.login('standard_user', 'secret_sauce');
    await inventory.assertOnPage();

    // Step 2: Add 3 random products to cart
    console.log('Step 2: Adding 3 random products to cart...');
    const selectedProducts = getRandomProducts(3);
    
    console.log('Selected products:');
    for (const [index, productId] of selectedProducts.entries()) {
      console.log(`  ${index + 1}. ${PRODUCT_NAMES[productId]}`);
      await inventory.addProduct(productId);
    }

    // Step 3: Go to cart and proceed to checkout
    console.log('Step 3: Proceeding to checkout...');
    await inventory.header.cartLink.click();
    await cart.proceedToCheckout();

    // Step 4: Fill checkout information
    console.log('Step 4: Filling checkout information...');
    await step1.submitInfo('John', 'Doe', '12345');

    // Step 5: Review order and finish
    console.log('Step 5: Reviewing order and finishing...');
    await step2.assertTotalContains('$'); // light smoke assert
    await step2.finish();

    // Step 6: Verify order completion
    console.log('Step 6: Verifying order completion...');
    await complete.assertThankYou();
    await complete.backHome();
    await inventory.assertOnPage();
    
    console.log('✅ Test completed successfully!');
  });
}); 