import { randomBytes } from 'crypto';

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

// Get random selection of products using Node.js crypto for better randomness
export function getRandomProducts(count: number): ProductId[] {
  const products = [...ALL_PRODUCTS];
  const selected: ProductId[] = [];
  
  // Use Node.js crypto.randomBytes for true randomness
  for (let i = 0; i < count && products.length > 0; i++) {
    const randomBuffer = randomBytes(4);
    const randomValue = randomBuffer.readUInt32BE(0);
    const randomIndex = Math.floor((randomValue / 0xFFFFFFFF) * products.length);
    selected.push(products.splice(randomIndex, 1)[0]);
  }
  
  return selected;
} 