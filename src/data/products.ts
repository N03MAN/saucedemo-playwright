export const PRODUCTS = {
  backpack: 'sauce-labs-backpack',
  bikeLight: 'sauce-labs-bike-light',
  boltShirt: 'sauce-labs-bolt-t-shirt',
  fleeceJacket: 'sauce-labs-fleece-jacket',
  onesie: 'sauce-labs-onesie',
  redShirt: 'test.allthethings()-t-shirt-(red)',
} as const;

export type ProductKey = keyof typeof PRODUCTS;
export type ProductId = typeof PRODUCTS[ProductKey];

// Product names for display/logging
export const PRODUCT_NAMES = {
  [PRODUCTS.backpack]: 'Sauce Labs Backpack',
  [PRODUCTS.bikeLight]: 'Sauce Labs Bike Light',
  [PRODUCTS.boltShirt]: 'Sauce Labs Bolt T-Shirt',
  [PRODUCTS.fleeceJacket]: 'Sauce Labs Fleece Jacket',
  [PRODUCTS.onesie]: 'Sauce Labs Onesie',
  [PRODUCTS.redShirt]: 'Test.allTheThings() T-Shirt (Red)',
} as const;

// Get all product IDs as an array
export const ALL_PRODUCTS = Object.values(PRODUCTS);

// Get random selection of products using native crypto for better randomness
export function getRandomProducts(count: number): ProductId[] {
  const products = [...ALL_PRODUCTS];
  const selected: ProductId[] = [];
  
  // Use crypto.getRandomValues for true randomness
  for (let i = 0; i < count && products.length > 0; i++) {
    const randomIndex = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * products.length);
    selected.push(products.splice(randomIndex, 1)[0]);
  }
  
  return selected;
} 