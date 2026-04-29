/**
 * API Test Helpers
 * Contains utility functions for URL building, validation, and assertions
 */

import { API } from './api.constants';

/**
 * Build a complete API URL with optional ID and query parameters
 * @param endpoint - API endpoint
 * @param id - Optional resource ID
 * @param queryParams - Optional query string
 * @param baseUrl - Optional custom base URL
 * @returns Complete API URL
 */
export const buildApiUrl = (
  endpoint: string,
  id?: string | number,
  queryParams?: string,
  baseUrl?: string
): string => {
  let url = `${baseUrl || API.BASE_URL}${endpoint}`;

  if (id !== undefined && id !== null) {
    url += `/${id}`;
  }

  if (queryParams) {
    url += queryParams.startsWith('?')
      ? queryParams
      : `?${queryParams}`;
  }

  return url;
};

/**
 * Validate user response structure
 * @param data - User object from response
 * @returns true if valid user structure
 */
export const validateUserStructure = (data: any): boolean => {
  return (
    typeof data.id === 'number' &&
    typeof data.email === 'string' &&
    typeof data.first_name === 'string' &&
    typeof data.last_name === 'string' &&
    typeof data.avatar === 'string'
  );
};

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns true if valid email format
 */
export const validateEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate resource response structure
 * @param data - Resource object from response
 * @returns true if valid resource structure
 */
export const validateResourceStructure = (data: any): boolean => {
  return (
    typeof data.id === 'number' &&
    typeof data.name === 'string' &&
    typeof data.year === 'number' &&
    typeof data.color === 'string' &&
    typeof data.pantone_value === 'string'
  );
};

/**
 * Validate created user response structure
 * @param data - User object from POST response
 * @returns true if valid created user structure
 */
export const validateCreatedUserStructure = (data: any): boolean => {
  return (
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    typeof data.job === 'string' &&
    typeof data.createdAt === 'string'
  );
};

/**
 * Validate ISO date string
 * @param dateString - Date string to validate
 * @returns true if valid ISO date format
 */
export const validateISODateFormat = (dateString: string): boolean => {
  const date = new Date(dateString);
  return (
    date instanceof Date &&
    !isNaN(date.getTime()) &&
    date.toISOString() === dateString
  );
};

/**
 * Validate authentication token response
 * @param data - Response object from login/register
 * @returns true if valid token structure
 */
export const validateAuthTokenResponse = (data: any): boolean => {
  return typeof data.token === 'string' && data.token.length > 0;
};

/**
 * Validate error response structure
 * @param data - Error response object
 * @returns true if valid error structure
 */
export const validateErrorResponse = (data: any): boolean => {
  return typeof data.error === 'string' && data.error.length > 0;
};

/**
 * Validate list response structure
 * @param data - Response object with data array
 * @returns true if valid list structure
 */
export const validateListResponse = (data: any): boolean => {
  return (
    Array.isArray(data.data) &&
    typeof data.page === 'number' &&
    typeof data.per_page === 'number' &&
    typeof data.total === 'number' &&
    typeof data.total_pages === 'number'
  );
};