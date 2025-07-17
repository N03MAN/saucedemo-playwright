# Sauce Demo Automation Framework

A simplified test automation framework for [Sauce Demo](https://www.saucedemo.com/) built with **Playwright**, **TypeScript**, and **Page Object Model (POM)** pattern using DOM-driven locators.

## 🎯 Overview

This framework automates the happy path e-commerce checkout flow on Sauce Demo:
- User authentication with standard_user
- Random selection of 3 products
- Complete checkout process
- Order confirmation

## 🛠️ Tech Stack

- **[Playwright](https://playwright.dev/)** - Modern web testing framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **Page Object Model** - Maintainable test structure with DOM-driven locators
- **Multi-browser Support** - Chrome, Firefox, Safari, Mobile
- **Rich Reporting** - HTML, JSON, JUnit formats

## 📁 Project Structure

```
saucedemo-playwright/
├── src/
│   ├── components/
│   │   └── Header.ts             # Header component with cart and menu
│   ├── data/
│   │   ├── products.ts           # Product IDs and utilities
│   │   └── users.ts              # Test user credentials
│   └── pages/                    # Page Object Model classes
│       ├── BasePage.ts           # Base page with common functionality
│       ├── LoginPage.ts          # Login page interactions
│       ├── InventoryPage.ts      # Product catalog and selection
│       ├── CartPage.ts           # Shopping cart management
│       ├── CheckoutStepOnePage.ts # Customer information form
│       ├── CheckoutStepTwoPage.ts # Order review and completion
│       └── CheckoutCompletePage.ts # Order confirmation
├── tests/
│   └── e2e/
│       └── checkout.spec.ts      # Main happy path test
├── reports/                      # Generated test reports
├── playwright.config.ts          # Playwright configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd saucedemo-playwright

# Install dependencies
npm install

# Install Playwright browsers
npm run install:browsers
```

### Running Tests

```bash
# Run all tests (headless)
npm test

# Run tests with browser UI
npm run test:headed

# Run tests in interactive mode
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Run specific browser tests
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### View Reports

```bash
# Open HTML report
npm run report
```

## 🔧 Configuration

### Playwright Configuration

The framework uses `data-test` attributes as the primary test ID selector:

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    baseURL: 'https://www.saucedemo.com',
    testIdAttribute: 'data-test',  // Maps getByTestId() to data-test attributes
    // ... other config
  },
});
```

### Browser Configuration

The framework supports multiple browsers and viewports:

- **Desktop**: Chrome, Firefox, Safari (1280x720)
- **Mobile**: Pixel 5, iPhone 12
- **Configurable**: Add more devices in `playwright.config.ts`

## 📝 Test Case

### Main Test: Happy Path Checkout

**Test:** `standard user can purchase 3 random items`

**Steps:**
1. Login with standard_user credentials
2. Select 3 random products from inventory
3. Add items to cart
4. Proceed to checkout
5. Fill customer information
6. Review and complete order
7. Verify order completion
8. Return to inventory page

**Features:**
- ✅ **Random Product Selection** - Different products each run
- ✅ **Cross-browser Testing** - Runs on all major browsers
- ✅ **DOM-driven Locators** - Uses stable data-test attributes
- ✅ **Comprehensive Assertions** - Verifies each step
- ✅ **Detailed Logging** - Step-by-step execution tracking

## 🏗️ Page Object Model

### DOM-Driven Locators

All page objects use `getByTestId()` with Sauce Demo's `data-test` attributes:

```typescript
// Example: LoginPage
export class LoginPage extends BasePage {
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.username = page.getByTestId('username');
    this.password = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
  }
}
```

### Product Management

Products are managed through centralized product IDs:

```typescript
// src/data/products.ts
export const PRODUCTS = {
  backpack: 'sauce-labs-backpack',
  bikeLight: 'sauce-labs-bike-light',
  boltShirt: 'sauce-labs-bolt-t-shirt',
  // ... more products
} as const;

// Usage in InventoryPage
addButton(productId: ProductId): Locator {
  return this.page.getByTestId(`add-to-cart-${productId}`);
}
```

## 📊 Reporting

### Built-in Reports

- **HTML Report** - Interactive report with traces and screenshots
- **JSON Report** - Structured data for CI/CD integration
- **JUnit Report** - XML format for test runners

### Sample Test Output

```
Step 1: Logging in...
Step 2: Adding 3 random products to cart...
Selected products:
  1. Sauce Labs Fleece Jacket
  2. Sauce Labs Bolt T-Shirt
  3. Sauce Labs Bike Light
Step 3: Proceeding to checkout...
Step 4: Filling checkout information...
Step 5: Reviewing order and finishing...
Step 6: Verifying order completion...
✅ Test completed successfully!
```

## 🔄 CI/CD Integration

### GitHub Actions

The framework includes a GitHub Actions workflow for automated testing:

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test --project=${{ matrix.browser }}
```

## 🧪 Test Data Management

### User Credentials

```typescript
export const STANDARD_USER: Creds = {
  username: 'standard_user',
  password: 'secret_sauce',
};
```

### Product Selection

```typescript
// Get 3 random products
const selectedProducts = getRandomProducts(3);
```

## 🔍 Debugging

### Debug Mode

```bash
# Run in debug mode with browser UI
npm run test:debug

# Run specific test in debug mode
npx playwright test --debug checkout.spec.ts
```

### Trace Viewer

```bash
# View test traces
npx playwright show-trace test-results/trace.zip
```

## 🛡️ Best Practices

### DOM-Driven Approach

- **Stable Selectors** - Uses `data-test` attributes over CSS classes
- **Centralized Product Data** - Single source of truth for product IDs
- **Resilient Locators** - Fallback strategies for elements without data-test

### Test Design

- **Page Object Model** - Encapsulated page interactions
- **Component Pattern** - Reusable components like Header
- **Happy Path Focus** - Single comprehensive test case
- **Random Selection** - Different products each run for variety

### Code Quality

- **TypeScript** - Strong typing for reliability
- **Consistent Naming** - Clear, descriptive names
- **Minimal Dependencies** - Only essential utilities
- **Clean Structure** - Logical file organization

## 🐛 Troubleshooting

### Common Issues

1. **Browser Installation**
   ```bash
   npx playwright install --with-deps
   ```

2. **Locator Issues**
   - Verify `data-test` attributes exist
   - Check for timing issues with `waitFor()`
   - Use Playwright Inspector for debugging

3. **Test Failures**
   - Check console logs for step-by-step execution
   - Review screenshots and traces in reports
   - Verify Sauce Demo site is accessible

### Debug Commands

```bash
# List available tests
npx playwright test --list

# Run with verbose output
npx playwright test --verbose

# Generate test code
npx playwright codegen https://www.saucedemo.com
```

## 📈 Test Results

```
✅ 5 tests passed across all browsers:
- Chromium: 1/1 test passed
- Firefox: 1/1 test passed  
- WebKit: 1/1 test passed
- Mobile Chrome: 1/1 test passed
- Mobile Safari: 1/1 test passed

Total execution time: ~4 seconds
```

## 🔗 Data-Test Attributes Reference

### Login Page
- `username` - Username input field
- `password` - Password input field  
- `login-button` - Login submit button
- `error` - Error message container

### Inventory Page
- `shopping-cart-link` - Cart icon link
- `shopping-cart-badge` - Cart item count
- `add-to-cart-{product-id}` - Add product buttons
- `remove-{product-id}` - Remove product buttons

### Cart Page
- `continue-shopping` - Continue shopping button
- `checkout` - Proceed to checkout button
- `remove-{product-id}` - Remove item buttons

### Checkout Pages
- `firstName`, `lastName`, `postalCode` - Customer info fields
- `continue` - Continue to next step
- `cancel` - Cancel checkout
- `finish` - Complete order
- `total-label` - Order total display
- `complete-header` - Order completion message
- `back-to-products` - Return to inventory

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Follow existing patterns and naming conventions
4. Ensure tests pass across all browsers
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with DOM-driven locators and Playwright best practices** 