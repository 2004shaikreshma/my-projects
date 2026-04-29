/**
 * Test Data for API Tests
 * Contains constants, test data, and data factories for API testing
 */

export const TEST_USER_IDS = {
  VALID: 2,
  INVALID: 23,
  NONEXISTENT: 999999,
};

export const TEST_RESOURCE_IDS = {
  VALID: 2,
  INVALID: 999,
};

export const TEST_CREDENTIALS = {
  VALID_EMAIL: 'eve.holt@reqres.in',
  VALID_PASSWORDS: {
    REGISTER: 'pistol',
    LOGIN: 'cityslicka',
  },
  INVALID_EMAIL: 'invalid@example.com',
  INVALID_PASSWORD: 'wrongpassword',
};

export const TEST_PAGINATION = {
  VALID_PAGE: 2,
  INVALID_PAGE: 999,
  NEGATIVE_PAGE: -1,
  VALID_PER_PAGE: 5,
};

export const TEST_TIMEOUTS = {
  RESPONSE_TIME: 5000,
  POST_TIME: 3000,
};

/**
 * Factory: Create a test user object
 */
export const createTestUser = (overrides?: Partial<any>) => ({
  name: 'morpheus',
  job: 'leader',
  ...overrides,
});

/**
 * Factory: Create login credentials
 */
export const createLoginCredentials = (overrides?: Partial<any>) => ({
  email: TEST_CREDENTIALS.VALID_EMAIL,
  password: TEST_CREDENTIALS.VALID_PASSWORDS.LOGIN,
  ...overrides,
});

/**
 * Factory: Create registration credentials
 */
export const createRegisterCredentials = (overrides?: Partial<any>) => ({
  email: TEST_CREDENTIALS.VALID_EMAIL,
  password: TEST_CREDENTIALS.VALID_PASSWORDS.REGISTER,
  ...overrides,
});

/**
 * Factory: Create user with special characters
 */
export const createSpecialCharacterUser = () => ({
  name: 'Test@User#123',
  job: 'developer & tester',
});

/**
 * Factory: Create user with very long data
 */
export const createLongDataUser = () => ({
  name: 'A'.repeat(1000),
  job: 'B'.repeat(500),
});

/**
 * Factory: Create updated user data
 */
export const createUpdatedUser = (overrides?: Partial<any>) => ({
  name: 'morpheus',
  job: 'zion resident',
  ...overrides,
});

/**
 * Factory: Create partial update data
 */
export const createPartialUpdateData = () => ({
  name: 'Updated Name',
});