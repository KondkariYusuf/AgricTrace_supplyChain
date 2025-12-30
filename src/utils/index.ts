/**
 * Utils Index - Backward Compatibility Exports
 * This file provides backward compatibility while migrating to the new services structure
 */

// IPFS Service
export { ipfsService, uploadBatchMetadataToIPFS, getIPFSFileUrl } from '@/services/ipfs';
export { pinataGroupManager } from '@/services/ipfs/groupManager';

// Blockchain Service
export { blockchainTransactionManager, initializeBlockchainManager, type BlockchainTransaction } from '@/services/blockchain';

// QR Code Utilities
export * from '@/utils/qr';

// Helper Utilities
export { nameResolver } from '@/utils/helpers';

// Re-export commonly used utilities
export { transactionManager } from './transactionManager';
export { singleStepGroupManager } from './singleStepGroupManager';

