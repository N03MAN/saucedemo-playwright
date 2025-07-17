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
    const checkoutStepOne = new CheckoutStepOnePage(page);
    const checkoutStepTwo = new CheckoutStepTwoPage(page);
    const checkoutComplete = new CheckoutCompletePage(page);

    // Generate consistent test data using seed
    const testData = generateSeededCheckoutData();
    const selectedProducts: ProductId[] = getRandomProducts(3);

    console.log('Test Data:');
    console.log(`Customer: ${testData.fullName}`);
    console.log(`Address: ${testData.address}`);
    console.log(`Postal Code: ${testData.postalCode}`);

    await test.step('User Authentication', async () => {
      console.log('Step 1: Authenticating user');
      
      await login.goto();
      
      // Core login page validation
      await expect(login.loginContainer).toBeVisible();
      await expect(login.loginLogo).toContainText('Swag Labs');
      await expect(login.username).toBeVisible();
      await expect(login.password).toBeVisible();
      await expect(login.loginButton).toBeVisible();
      
      // Validate form fields have empty values
      await expect(login.username).toHaveValue('');
      await expect(login.password).toHaveValue('');
      
      await login.login('standard_user', 'secret_sauce');
      console.log('Login successful');
    });

    await test.step('Product Selection', async () => {
      console.log('Step 2: Selecting products');
      
      await inventory.assertOnPage();
      
      // Core inventory page validation
      await expect(inventory.inventoryContainer).toBeVisible();
      await expect(inventory.title).toContainText('Products');
      await expect(inventory.inventoryList).toBeVisible();
      
      // Validate products are displayed
      await expect(inventory.inventoryList.locator('[data-test="inventory-item"]')).toHaveCount(6);
      
      console.log('Adding products to cart:');
      for (let i = 0; i < selectedProducts.length; i++) {
        const productId = selectedProducts[i];
        const productName = PRODUCT_NAMES[productId];
        console.log(`  ${i + 1}. ${productName}`);
        
        await inventory.addProduct(productId);
        await inventory.assertProductAdded(productId);
      }
      
      console.log('Added 3 products to cart');
    });

    await test.step('Cart Review & Checkout Initiation', async () => {
      console.log('Step 3: Proceeding to checkout');
      
      await inventory.header.clickCart();
      await cart.assertOnPage();
      
      // Core cart page validation
      await expect(cart.cartContentsContainer).toBeVisible();
      await expect(cart.title).toContainText('Your Cart');
      await expect(cart.cartList).toBeVisible();
      await cart.assertCartItemCount(3);
      
      // Validate cart items
      for (const productId of selectedProducts) {
        await cart.assertCartItem(productId);
      }
      
      await cart.proceedToCheckout();
      console.log('Checkout initiated');
    });

    await test.step('Shipping Information Entry', async () => {
      console.log('Step 4: Entering shipping information');
      
      await checkoutStepOne.assertOnPage();
      
      // Core checkout step one validation
      await expect(checkoutStepOne.checkoutInfoContainer).toBeVisible();
      await expect(checkoutStepOne.title).toContainText('Checkout: Your Information');
      await expect(checkoutStepOne.firstName).toBeVisible();
      await expect(checkoutStepOne.lastName).toBeVisible();
      await expect(checkoutStepOne.postalCode).toBeVisible();
      
      // Validate form fields have empty values
      await expect(checkoutStepOne.firstName).toHaveValue('');
      await expect(checkoutStepOne.lastName).toHaveValue('');
      await expect(checkoutStepOne.postalCode).toHaveValue('');
      
      console.log(`Customer: ${testData.fullName}`);
      console.log(`Postal Code: ${testData.postalCode}`);
      
      await checkoutStepOne.submitInfo(testData.firstName, testData.lastName, testData.postalCode);
      console.log('Shipping information submitted');
    });

    await test.step('Order Review & Payment Processing', async () => {
      console.log('Step 5: Reviewing order and processing payment');
      
      await checkoutStepTwo.assertOnPage();
      
      // Core checkout step two validation
      await expect(checkoutStepTwo.checkoutSummaryContainer).toBeVisible();
      await expect(checkoutStepTwo.title).toContainText('Checkout: Overview');
      await expect(checkoutStepTwo.cartList).toBeVisible();
      
      // Validate order summary
      await expect(checkoutStepTwo.cartList.locator('[data-test="inventory-item"]')).toHaveCount(3);
      await expect(checkoutStepTwo.paymentInfoValue).toContainText('SauceCard #31337');
      await expect(checkoutStepTwo.shippingInfoValue).toContainText('Free Pony Express Delivery!');
      await expect(checkoutStepTwo.totalLabel).toContainText('Total: $');
      
      console.log('Order total validated');
      
      await checkoutStepTwo.finish();
      console.log('Payment processed');
    });

    await test.step('Order Confirmation & Completion', async () => {
      console.log('Step 6: Confirming order completion');
      
      await checkoutComplete.assertOnPage();
      
      // Core checkout complete validation
      await expect(checkoutComplete.checkoutCompleteContainer).toBeVisible();
      await expect(checkoutComplete.title).toContainText('Checkout: Complete!');
      await expect(checkoutComplete.completeHeader).toContainText('Thank you for your order!');
      await expect(checkoutComplete.completeText).toContainText('dispatched');
      await expect(checkoutComplete.backHomeButton).toBeVisible();
      
      console.log('Order confirmed');
      
      await checkoutComplete.backHome();
      await inventory.assertOnPage();
      console.log('Returned to inventory page');
    });

    // Final validation
    await test.step('Final State Validation', async () => {
      console.log('Step 7: Validating final state');
      
      // Validate we're back on inventory page
      await inventory.assertOnPage();
      await expect(inventory.title).toContainText('Products');
      
      // Validate all products are back to "Add to cart" state
      for (const productId of selectedProducts) {
        await inventory.assertProductRemoved(productId);
      }
      
      console.log('Final state validated successfully');
    });

    console.log('\nTest Summary:');
    console.log(`Customer: ${testData.fullName}`);
    console.log(`Products: ${selectedProducts.map(id => PRODUCT_NAMES[id]).join(', ')}`);
    console.log(`Total items: ${selectedProducts.length}`);
    console.log('Test completed successfully');
  });
}); 