/**
 * Formatting Utilities
 * Centralized formatting functions
 */

import { format, parseISO } from 'date-fns';
import { DATE_FORMATS } from '@/constants';

/**
 * Format date for display
 */
export const formatDate = (
  date: string | Date,
  formatStr: string = DATE_FORMATS.DISPLAY
): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Format currency (Indian Rupees)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format number with Indian number system
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};

/**
 * Format quantity (kg)
 */
export const formatQuantity = (quantity: number, unit: string = 'kg'): string => {
  return `${formatNumber(quantity)} ${unit}`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format wallet address (show first 6 and last 4 characters)
 */
export const formatWalletAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Format transaction hash
 */
export const formatTransactionHash = (hash: string): string => {
  if (!hash || hash.length < 10) return hash;
  return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
};

