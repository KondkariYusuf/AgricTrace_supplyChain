/**
 * Blockchain Transaction Manager
 * Handles all blockchain operations for AgriTrace
 */

import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '@/contracts/config';
import AgriTraceABI from '@/contracts/AgriTrace.json';

export interface BlockchainTransaction {
  batchId: string;
  from: string;
  to: string;
  transactionType: 'HARVEST' | 'PURCHASE' | 'TRANSFER';
  quantity: number;
  price: number;
  timestamp: string;
  transactionHash: string;
  blockNumber: number;
  ipfsHash?: string;
}

export class BlockchainTransactionManager {
  private contract: ethers.Contract;
  private provider: ethers.Provider;
  public signer: ethers.Signer | null = null;

  constructor(provider: ethers.Provider, signer?: ethers.Signer) {
    this.provider = provider;
    this.signer = signer || null;
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, AgriTraceABI.abi, signer || provider);
  }

  /**
   * Update the signer and reinitialize contract
   */
  updateSigner(signer: ethers.Signer) {
    this.signer = signer;
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, AgriTraceABI.abi, signer);
  }

  /**
   * Record a harvest transaction on blockchain
   */
  async recordHarvestTransaction(
    batchId: string,
    farmerAddress: string,
    cropType: string,
    variety: string,
    quantity: number,
    price: number,
    ipfsHash: string
  ): Promise<BlockchainTransaction> {
    if (!this.signer) {
      throw new Error('Signer required for blockchain transactions');
    }

    try {
      const tx = await this.contract.recordHarvest(
        batchId,
        farmerAddress,
        cropType,
        variety,
        quantity,
        price,
        ipfsHash
      );

      const receipt = await tx.wait();
      const block = await this.provider.getBlock(receipt.blockNumber);

      return {
        batchId,
        from: farmerAddress,
        to: farmerAddress,
        transactionType: 'HARVEST',
        quantity,
        price,
        timestamp: new Date().toISOString(),
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        ipfsHash
      };
    } catch (error) {
      console.error('Error recording harvest transaction:', error);
      throw error;
    }
  }

  /**
   * Record a purchase transaction on blockchain
   */
  async recordPurchaseTransaction(
    batchId: string,
    fromAddress: string,
    toAddress: string,
    quantity: number,
    price: number,
    transactionType: 'PURCHASE' | 'TRANSFER' = 'PURCHASE'
  ): Promise<BlockchainTransaction> {
    if (!this.signer) {
      throw new Error('Signer required for blockchain transactions');
    }

    try {
      const numericBatchId = Date.now();
      
      const tx = await this.contract.transferBatch(
        numericBatchId,
        toAddress
      );

      const receipt = await tx.wait();
      const block = await this.provider.getBlock(receipt.blockNumber);

      return {
        batchId,
        from: fromAddress,
        to: toAddress,
        transactionType,
        quantity,
        price,
        timestamp: new Date().toISOString(),
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('Error recording purchase transaction:', error);
      throw error;
    }
  }

  /**
   * Get transaction history for a batch from blockchain
   */
  async getBatchTransactionHistory(batchId: string): Promise<BlockchainTransaction[]> {
    try {
      const harvestFilter = this.contract.filters.BatchRegistered(batchId);
      const harvestEvents = await this.contract.queryFilter(harvestFilter);

      const purchaseFilter = this.contract.filters.PurchaseRecorded(batchId);
      const purchaseEvents = await this.contract.queryFilter(purchaseFilter);

      const transactions: BlockchainTransaction[] = [];

      for (const event of harvestEvents) {
        if (event.args) {
          transactions.push({
            batchId: event.args.batchId.toString(),
            from: event.args.farmer,
            to: event.args.farmer,
            transactionType: 'HARVEST',
            quantity: Number(event.args.harvestQuantity),
            price: Number(event.args.price),
            timestamp: new Date().toISOString(),
            transactionHash: event.transactionHash,
            blockNumber: event.blockNumber,
            ipfsHash: event.args.ipfsHash
          });
        }
      }

      for (const event of purchaseEvents) {
        if (event.args) {
          transactions.push({
            batchId: event.args.batchId.toString(),
            from: event.args.from,
            to: event.args.to,
            transactionType: 'PURCHASE',
            quantity: Number(event.args.quantity),
            price: Number(event.args.price),
            timestamp: new Date().toISOString(),
            transactionHash: event.transactionHash,
            blockNumber: event.blockNumber
          });
        }
      }

      transactions.sort((a, b) => a.blockNumber - b.blockNumber);
      return transactions;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return [];
    }
  }

  /**
   * Get current owner of a batch from blockchain
   */
  async getBatchCurrentOwner(batchId: string): Promise<string | null> {
    try {
      const owner = await this.contract.getBatchOwner(batchId);
      return owner;
    } catch (error) {
      console.error('Error getting batch owner:', error);
      return null;
    }
  }

  /**
   * Verify transaction on blockchain
   */
  async verifyTransaction(transactionHash: string): Promise<boolean> {
    try {
      const tx = await this.provider.getTransaction(transactionHash);
      return tx !== null;
    } catch (error) {
      console.error('Error verifying transaction:', error);
      return false;
    }
  }

  /**
   * Get transaction details from blockchain
   */
  async getTransactionDetails(transactionHash: string): Promise<any> {
    try {
      const tx = await this.provider.getTransaction(transactionHash);
      const receipt = await this.provider.getTransactionReceipt(transactionHash);
      
      return {
        transaction: tx,
        receipt: receipt
      };
    } catch (error) {
      console.error('Error getting transaction details:', error);
      return null;
    }
  }
}

// Export singleton instance - will be initialized with MetaMask provider
export let blockchainTransactionManager: BlockchainTransactionManager | null = null;

// Initialize with MetaMask provider when available
export const initializeBlockchainManager = (provider: ethers.Provider, signer?: ethers.Signer) => {
  blockchainTransactionManager = new BlockchainTransactionManager(provider, signer);
};

// Clear blockchain manager
export const clearBlockchainManager = () => {
  blockchainTransactionManager = null;
};

