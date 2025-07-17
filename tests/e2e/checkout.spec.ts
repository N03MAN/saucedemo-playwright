import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { CartPage } from '../../src/pages/CartPage';
import { CheckoutStepOnePage } from '../../src/pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../../src/pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../../src/pages/CheckoutCompletePage';
import { getRandomProducts, PRODUCT_NAMES, ProductId } from '../../src/data/products';
import { generateSeededCheckoutData } from '../../src/data/testData';

test.describe('Sauce Demo - Happy Path Checkout', () => {
  test('standard user can purchase 3 random items with realistic customer data', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const step1 = new CheckoutStepOnePage(page);
    const step2 = new CheckoutStepTwoPage(page);
    const complete = new CheckoutCompletePage(page);

    // Generate test customer data
    const testData = generateSeededCheckoutData();
    let selectedProducts: ProductId[] = [];

    console.log('Test Data:');
    console.log(`Customer: ${testData.fullName}`);
    console.log(`Address: ${testData.address}`);
    console.log(`Postal Code: ${testData.postalCode}`);
    console.log('');

    await test.step('User Authentication', async () => {
      console.log('Step 1: Authenticating user');
      await login.login('standard_user', 'secret_sauce');
      await inventory.assertOnPage();
      console.log('Login successful');
    });

    await test.step('Product Selection', async () => {
      console.log('Step 2: Selecting products');
      selectedProducts = getRandomProducts(3);
      
      console.log('Adding products to cart:');
      for (const [index, productId] of selectedProducts.entries()) {
        const productName = PRODUCT_NAMES[productId];
        console.log(`  ${index + 1}. ${productName}`);
        await inventory.addProduct(productId);
      }
      console.log(`Added ${selectedProducts.length} products to cart`);
    });

    await test.step('Cart Review & Checkout Initiation', async () => {
      console.log('Step 3: Proceeding to checkout');
      await inventory.header.cartLink.click();
      await cart.proceedToCheckout();
      console.log('Checkout initiated');
    });

    await test.step('Shipping Information Entry', async () => {
      console.log('Step 4: Entering shipping information');
      console.log(`Customer: ${testData.firstName} ${testData.lastName}`);
      console.log(`Postal Code: ${testData.postalCode}`);
      await step1.submitInfo(testData.firstName, testData.lastName, testData.postalCode);
      console.log('Shipping information submitted');
    });

    await test.step('Order Review & Payment Processing', async () => {
      console.log('Step 5: Reviewing order and processing payment');
      await step2.assertTotalContains('$');
      console.log('Order total validated');
      await step2.finish();
      console.log('Payment processed');
    });

    await test.step('Order Confirmation & Completion', async () => {
      console.log('Step 6: Confirming order completion');
      await complete.assertThankYou();
      console.log('Order confirmed');
      await complete.backHome();
      await inventory.assertOnPage();
      console.log('Returned to inventory page');
      
      console.log('');
      console.log('Test Summary:');
      console.log(`Customer: ${testData.fullName}`);
      console.log(`Products: ${selectedProducts.map(id => PRODUCT_NAMES[id]).join(', ')}`);
      console.log(`Total items: ${selectedProducts.length}`);
      console.log('Test completed successfully');
    });
  });
}); 