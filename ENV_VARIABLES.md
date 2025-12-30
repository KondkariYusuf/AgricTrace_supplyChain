# Environment Variables Required for AgriTrace

This document lists all hardcoded values that need to be moved to environment variables for security.

## 🔐 Required Environment Variables

Add these to your `.env` file in the root directory:

```env
# ============================================
# Supabase Configuration
# ============================================
VITE_SUPABASE_URL=https://klkrexlivtmluosdztxt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsa3JleGxpdnRtbHVvc2R6dHh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NTIwNTMsImV4cCI6MjA3NDIyODA1M30.ZxlNSmVBX7ompk6HyisYmmZJz9GPpHKlaSy5eJKTrew

# ============================================
# Pinata IPFS Configuration
# ============================================
VITE_PINATA_API_KEY=f36361a622f0539503dd
VITE_PINATA_SECRET_KEY=631e58f9a4e711ccfaa04fd2ffaac78c2a7d0eef2732553a41877265b8d67921
VITE_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkNGE3ODVmNS04ZGZiLTQwZDgtODM3Yy1hNDk0MTZmMTExZGYiLCJlbWFpbCI6ImtqYXJpcjIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJmMzYzNjFhNjIyZjA1Mzk1MDNkZCIsInNjb3BlZEtleVNlY3JldCI6IjYzMWU1OGY5YTRlNzExY2NmYWEwNGZkMmZmYWFjNzhjMmE3ZDBlZWYyNzMyNTUzYTQxODc3MjY1YjhkNjc5MjEiLCJleHAiOjE3OTAxOTQ3NTF9.fND1AtRjFCAx7KspftaxcWjr4b40mSGQA5qpf5fRHYw

# ============================================
# Blockchain Configuration
# ============================================
# Smart Contract Address (Ethereum)
VITE_CONTRACT_ADDRESS=0xf8e81D47203A594245E36C48e151709F0C19fBe8

# Infura API Key for Ethereum RPC
VITE_INFURA_API_KEY=9aa3d95b3bc440fa88ea12eaa4456161

# Network Configuration
VITE_DEFAULT_NETWORK=sepolia
VITE_SEPOLIA_CHAIN_ID=11155111
VITE_SEPOLIA_BLOCK_EXPLORER=https://sepolia.etherscan.io/

# Monad Network (Optional)
VITE_MONAD_CHAIN_ID=10135
VITE_MONAD_RPC_URL=https://testnet-rpc.monad.xyz/
VITE_MONAD_BLOCK_EXPLORER=https://testnet.monadexplorer.com/

# ============================================
# Market Price API Configuration
# ============================================
# Government of India Data.gov.in API Key
VITE_MARKET_PRICE_API_KEY=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b
VITE_MARKET_PRICE_BASE_URL=https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070
```

## 📍 Files That Need Updates

### 1. `src/contracts/config.ts`
**Current Hardcoded Values:**
- `CONTRACT_ADDRESS`: `"0xf8e81D47203A594245E36C48e151709F0C19fBe8"`
- `PINATA_CONFIG.apiKey`: `"f36361a622f0539503dd"`
- `PINATA_CONFIG.apiSecret`: `"631e58f9a4e711ccfaa04fd2ffaac78c2a7d0eef2732553a41877265b8d67921"`
- `PINATA_CONFIG.jwt`: Long JWT token
- `NETWORK_CONFIG.sepolia.rpcUrl`: Contains Infura API key `"https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"`

### 2. `src/integrations/supabase/client.ts`
**Current Hardcoded Values:**
- `SUPABASE_URL`: `"https://klkrexlivtmluosdztxt.supabase.co"`
- `SUPABASE_PUBLISHABLE_KEY`: Long JWT token

### 3. `src/utils/marketPriceAPI.ts`
**Current Hardcoded Values:**
- `API_KEY`: `'579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b'`
- `BASE_URL`: `'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070'`

### 4. `src/contexts/Web3Context.tsx`
**Current Hardcoded Values:**
- Infura RPC URL with API key: `'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'`

## 🔒 Security Notes

1. **Never commit `.env` file** to version control
2. **Use `.env.example`** to document required variables
3. **Rotate API keys** regularly
4. **Use different keys** for development and production
5. **Restrict API key permissions** when possible

## 📝 Next Steps

1. Create `.env` file in root directory
2. Add all variables listed above
3. Update code files to use `import.meta.env.VITE_*` instead of hardcoded values
4. Test the application to ensure all environment variables are loaded correctly

