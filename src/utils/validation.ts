/**
 * Validation Utilities
 * Centralized validation functions
 */

import { VALIDATION } from '@/constants';

export const validators = {
  /**
   * Validate email address
   */
  email: (email: string): boolean => {
    return VALIDATION.EMAIL_REGEX.test(email);
  },

  /**
   * Validate phone number (Indian format)
   */
  phone: (phone: string): boolean => {
    return VALIDATION.PHONE_REGEX.test(phone);
  },

  /**
   * Validate password strength
   */
  password: (password: string): boolean => {
    return password.length >= VALIDATION.PASSWORD_MIN_LENGTH;
  },

  /**
   * Validate required field
   */
  required: (value: string | number | null | undefined): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  },

  /**
   * Validate positive number
   */
  positiveNumber: (value: number): boolean => {
    return value > 0;
  },

  /**
   * Validate wallet address
   */
  walletAddress: (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  },

  /**
   * Validate batch quantity
   */
  batchQuantity: (quantity: number): boolean => {
    return quantity >= VALIDATION.BATCH_QUANTITY_MIN;
  },

  /**
   * Validate price
   */
  price: (price: number): boolean => {
    return price >= VALIDATION.PRICE_MIN;
  },
};

/**
 * Validate form field
 */
export const validateField = (
  value: any,
  rules: Array<(value: any) => boolean>
): { isValid: boolean; error?: string } => {
  for (const rule of rules) {
    if (!rule(value)) {
      return { isValid: false };
    }
  }
  return { isValid: true };
};

