// Contract configuration
// Note: This contract address needs to be deployed on the network you're using
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0xf8e81D47203A594245E36C48e151709F0C19fBe8";

// Network configuration
const INFURA_API_KEY = import.meta.env.VITE_INFURA_API_KEY || "9aa3d95b3bc440fa88ea12eaa4456161";

export const NETWORK_CONFIG = {
  sepolia: {
    chainId: parseInt(import.meta.env.VITE_SEPOLIA_CHAIN_ID || "11155111"),
    name: "Sepolia Testnet",
    rpcUrl: import.meta.env.VITE_SEPOLIA_RPC_URL || `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
    blockExplorer: import.meta.env.VITE_SEPOLIA_BLOCK_EXPLORER || "https://sepolia.etherscan.io/"
  },
  monad: {
    chainId: parseInt(import.meta.env.VITE_MONAD_CHAIN_ID || "10135"),
    name: "Monad Testnet",
    rpcUrl: import.meta.env.VITE_MONAD_RPC_URL || "https://testnet-rpc.monad.xyz/",
    blockExplorer: import.meta.env.VITE_MONAD_BLOCK_EXPLORER || "https://testnet.monadexplorer.com/"
  }
};

// Default network - Sepolia (more reliable)
export const DEFAULT_NETWORK = import.meta.env.VITE_DEFAULT_NETWORK || "sepolia";

// Pinata configuration
export const PINATA_CONFIG = {
  apiKey: import.meta.env.VITE_PINATA_API_KEY || "",
  apiSecret: import.meta.env.VITE_PINATA_SECRET_KEY || "",
  jwt: import.meta.env.VITE_PINATA_JWT || "",
  gatewayUrl: "https://gateway.pinata.cloud/ipfs/"
};

// Contract types
export interface BatchInput {
  crop: string;
  variety: string;
  harvestQuantity: string;
  sowingDate: string;
  harvestDate: string;
  freshnessDuration: string;
  grading: string;
  certification: string;
  labTest: string;
  price: number;
  ipfsHash: string;
  languageDetected: string;
  summary: string;
  callStatus: string;
  offTopicCount: number;
}

export interface Batch {
  id: number;
  farmer: string;
  crop: string;
  variety: string;
  harvestQuantity: string;
  sowingDate: string;
  harvestDate: string;
  freshnessDuration: string;
  grading: string;
  certification: string;
  labTest: string;
  price: number;
  ipfsHash: string;
  languageDetected: string;
  summary: string;
  callStatus: string;
  offTopicCount: number;
  currentOwner: string;
}
