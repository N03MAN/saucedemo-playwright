import { faker } from '@faker-js/faker';

export interface CheckoutData {
  firstName: string;
  lastName: string;
  postalCode: string;
  fullName: string;
  address: string;
}

/**
 * Generate realistic checkout data using faker.js
 * @param seed Optional seed for reproducible data generation
 * @returns CheckoutData object with realistic test data
 */
export function generateCheckoutData(seed?: number): CheckoutData {
  if (seed) {
    faker.seed(seed);
  }

  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const postalCode = faker.location.zipCode();
  const fullName = `${firstName} ${lastName}`;
  const address = faker.location.streetAddress();

  return {
    firstName,
    lastName,
    postalCode,
    fullName,
    address
  };
}

/**
 * Generate seeded test data for consistent testing
 * Uses a fixed seed to ensure reproducible results in CI
 */
export function generateSeededCheckoutData(): CheckoutData {
  const seed = process.env.SEED ? parseInt(process.env.SEED) : 12345;
  return generateCheckoutData(seed);
} 