import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { CartPage } from '../../src/pages/CartPage';
import { CheckoutStepOnePage } from '../../src/pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../../src/pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../../src/pages/CheckoutCompletePage';
import { getRandomProducts, PRODUCT_NAMES } from '../../src/data/products';
import { generateSeededCheckoutData, generateCheckoutData } from '../../src/data/testData';

test.describe('Sauce Demo - Happy Path Checkout', () => {
  test('standard user can purchase 3 random items', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const step1 = new CheckoutStepOnePage(page);
    const step2 = new CheckoutStepTwoPage(page);
    const complete = new CheckoutCompletePage(page);

    // Generate realistic test data
    const testData = generateSeededCheckoutData();
    console.log(`🧪 Test Data Generated:`);
    console.log(`   Customer: ${testData.fullName}`);
    console.log(`   Address: ${testData.address}`);
    console.log(`   Postal Code: ${testData.postalCode}`);
    console.log('');

    // Step 1: Login
    console.log('📝 Step 1: User Authentication');
    console.log('   → Navigating to login page...');
    await login.login('standard_user', 'secret_sauce');
    await inventory.assertOnPage();
    console.log('   ✅ Successfully logged in as standard_user');
    console.log('');

    // Step 2: Add 3 random products to cart
    console.log('🛒 Step 2: Product Selection');
    const selectedProducts = getRandomProducts(3);
    
    console.log('   → Adding random products to cart:');
    for (const [index, productId] of selectedProducts.entries()) {
      const productName = PRODUCT_NAMES[productId];
      console.log(`      ${index + 1}. ${productName}`);
      await inventory.addProduct(productId);
      console.log(`         ✅ Added to cart`);
    }
    console.log(`   ✅ Successfully added ${selectedProducts.length} products to cart`);
    console.log('');

    // Step 3: Go to cart and proceed to checkout
    console.log('🛍️ Step 3: Cart Review & Checkout Initiation');
    console.log('   → Navigating to shopping cart...');
    await inventory.header.cartLink.click();
    console.log('   → Proceeding to checkout...');
    await cart.proceedToCheckout();
    console.log('   ✅ Successfully initiated checkout process');
    console.log('');

    // Step 4: Fill checkout information
    console.log('📋 Step 4: Shipping Information');
    console.log(`   → Filling customer information for ${testData.fullName}...`);
    console.log(`      First Name: ${testData.firstName}`);
    console.log(`      Last Name: ${testData.lastName}`);
    console.log(`      Postal Code: ${testData.postalCode}`);
    await step1.submitInfo(testData.firstName, testData.lastName, testData.postalCode);
    console.log('   ✅ Customer information submitted successfully');
    console.log('');

    // Step 5: Review order and finish
    console.log('💳 Step 5: Order Review & Payment');
    console.log('   → Reviewing order details...');
    await step2.assertTotalContains('$'); // light smoke assert
    console.log('   ✅ Order total validated');
    console.log('   → Processing payment...');
    await step2.finish();
    console.log('   ✅ Payment processed successfully');
    console.log('');

    // Step 6: Verify order completion
    console.log('🎉 Step 6: Order Confirmation');
    console.log('   → Verifying order completion...');
    await complete.assertThankYou();
    console.log('   ✅ Order confirmation received');
    console.log('   → Returning to product catalog...');
    await complete.backHome();
    await inventory.assertOnPage();
    console.log('   ✅ Successfully returned to inventory page');
    console.log('');
    
    console.log('🎯 TEST SUMMARY:');
    console.log(`   Customer: ${testData.fullName}`);
    console.log(`   Products Purchased: ${selectedProducts.length}`);
    console.log(`   Products: ${selectedProducts.map(id => PRODUCT_NAMES[id]).join(', ')}`);
    console.log('   Status: ✅ PASSED - Complete checkout flow successful!');
  });

  test('different customer can also complete checkout with random data', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const step1 = new CheckoutStepOnePage(page);
    const step2 = new CheckoutStepTwoPage(page);
    const complete = new CheckoutCompletePage(page);

    // Generate different test data using random seed
    const testData = generateCheckoutData(Date.now());
    console.log(`🧪 Random Test Data Generated:`);
    console.log(`   Customer: ${testData.fullName}`);
    console.log(`   Address: ${testData.address}`);
    console.log(`   Postal Code: ${testData.postalCode}`);
    console.log('');

    // Abbreviated test flow with different customer
    console.log('📝 Step 1: User Authentication');
    await login.login('standard_user', 'secret_sauce');
    await inventory.assertOnPage();
    console.log('   ✅ Successfully logged in as standard_user');

    console.log('🛒 Step 2: Product Selection (2 items)');
    const selectedProducts = getRandomProducts(2);
    for (const productId of selectedProducts) {
      await inventory.addProduct(productId);
    }
    console.log(`   ✅ Added ${selectedProducts.length} products to cart`);

    console.log('🛍️ Step 3: Cart Review & Checkout');
    await inventory.header.cartLink.click();
    await cart.proceedToCheckout();

    console.log('📋 Step 4: Customer Information');
    console.log(`   → Processing order for ${testData.fullName}`);
    await step1.submitInfo(testData.firstName, testData.lastName, testData.postalCode);

    console.log('💳 Step 5: Payment & Completion');
    await step2.assertTotalContains('$');
    await step2.finish();
    await complete.assertThankYou();
    await complete.backHome();
    await inventory.assertOnPage();
    
    console.log('🎯 TEST SUMMARY:');
    console.log(`   Customer: ${testData.fullName}`);
    console.log(`   Products: ${selectedProducts.map(id => PRODUCT_NAMES[id]).join(', ')}`);
    console.log('   Status: ✅ PASSED - Different customer checkout successful!');
  });
}); 