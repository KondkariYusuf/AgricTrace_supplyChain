/**
 * Application Constants
 * Centralized constants for the AgriTrace application
 */

// User Roles
export const USER_ROLES = {
  FARMER: 'farmer',
  DISTRIBUTOR: 'distributor',
  RETAILER: 'retailer',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Transaction Types
export const TRANSACTION_TYPES = {
  HARVEST: 'HARVEST',
  PURCHASE: 'PURCHASE',
  TRANSFER: 'TRANSFER',
} as const;

export type TransactionType = typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES];

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  MARKETPLACE: '/marketplace',
  RETAILER_MARKETPLACE: '/retailer-marketplace',
  DISTRIBUTOR_INVENTORY: '/distributor-inventory',
  RETAILER_INVENTORY: '/retailer-inventory',
  BATCH_REGISTRATION: '/batch-registration',
  TRACK: '/track',
  PROFILE: '/profile',
  VERIFICATION: '/verification',
  ADMIN: '/admin',
  UNAUTHORIZED: '/unauthorized',
  ABOUT: '/about',
  NOT_FOUND: '*',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  PINATA_UPLOAD: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
  PINATA_GROUPS: 'https://api.pinata.cloud/v3/groups/public',
  PINATA_FILES: 'https://uploads.pinata.cloud/v3/files',
  PINATA_GATEWAY: 'https://gateway.pinata.cloud/ipfs/',
} as const;

// Query Keys (for React Query)
export const QUERY_KEYS = {
  BATCHES: 'batches',
  BATCH: (id: string) => `batch-${id}`,
  TRANSACTIONS: (batchId: string) => `transactions-${batchId}`,
  USER_PROFILE: 'user-profile',
  MARKETPLACE: 'marketplace',
  INVENTORY: 'inventory',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'agritrace-auth-token',
  WALLET_ADDRESS: 'agritrace-wallet-address',
  USER_PREFERENCES: 'agritrace-user-preferences',
} as const;

// Validation Constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  BATCH_QUANTITY_MIN: 1,
  PRICE_MIN: 0.01,
  PHONE_REGEX: /^[6-9]\d{9}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
  WALLET_NOT_CONNECTED: 'Please connect your wallet',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  BATCH_REGISTERED: 'Batch registered successfully',
  PURCHASE_COMPLETE: 'Purchase completed successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  TRANSACTION_CONFIRMED: 'Transaction confirmed on blockchain',
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD MMM YYYY',
  DISPLAY_WITH_TIME: 'DD MMM YYYY, HH:mm',
  INPUT: 'YYYY-MM-DD',
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
} as const;

// File Sizes
export const FILE_SIZES = {
  MAX_CERTIFICATE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

