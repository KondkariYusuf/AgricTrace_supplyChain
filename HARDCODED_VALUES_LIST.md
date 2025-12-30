# 🔐 Complete List of Hardcoded Values in AgriTrace

This document lists **ALL** hardcoded API keys, secrets, and sensitive configuration values found in the codebase.

## ✅ Status: All Values Identified and Code Updated

All hardcoded values have been migrated to use environment variables. The code now reads from `import.meta.env.VITE_*` with fallback values for backward compatibility.

---

## 📋 Complete List of Hardcoded Values

### 1. **Supabase Configuration**
**File:** `src/integrations/supabase/client.ts`

| Variable | Current Hardcoded Value | Environment Variable |
|----------|------------------------|---------------------|
| SUPABASE_URL | `"https://klkrexlivtmluosdztxt.supabase.co"` | `VITE_SUPABASE_URL` |
| SUPABASE_PUBLISHABLE_KEY | `"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."` (JWT token) | `VITE_SUPABASE_ANON_KEY` |

**Status:** ✅ Updated to use environment variables

---

### 2. **Pinata IPFS Configuration**
**File:** `src/contracts/config.ts`

| Variable | Current Hardcoded Value | Environment Variable |
|----------|------------------------|---------------------|
| PINATA_API_KEY | `"f36361a622f0539503dd"` | `VITE_PINATA_API_KEY` |
| PINATA_SECRET_KEY | `"631e58f9a4e711ccfaa04fd2ffaac78c2a7d0eef2732553a41877265b8d67921"` | `VITE_PINATA_SECRET_KEY` |
| PINATA_JWT | `"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."` (Long JWT) | `VITE_PINATA_JWT` |

**Status:** ✅ Updated to use environment variables

---

### 3. **Blockchain Configuration**
**File:** `src/contracts/config.ts`

| Variable | Current Hardcoded Value | Environment Variable |
|----------|------------------------|---------------------|
| CONTRACT_ADDRESS | `"0xf8e81D47203A594245E36C48e151709F0C19fBe8"` | `VITE_CONTRACT_ADDRESS` |
| INFURA_API_KEY | `"9aa3d95b3bc440fa88ea12eaa4456161"` (in RPC URL) | `VITE_INFURA_API_KEY` |
| SEPOLIA_RPC_URL | `"https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"` | `VITE_SEPOLIA_RPC_URL` |
| SEPOLIA_CHAIN_ID | `11155111` | `VITE_SEPOLIA_CHAIN_ID` |
| SEPOLIA_BLOCK_EXPLORER | `"https://sepolia.etherscan.io/"` | `VITE_SEPOLIA_BLOCK_EXPLORER` |
| MONAD_CHAIN_ID | `10135` | `VITE_MONAD_CHAIN_ID` |
| MONAD_RPC_URL | `"https://testnet-rpc.monad.xyz/"` | `VITE_MONAD_RPC_URL` |
| MONAD_BLOCK_EXPLORER | `"https://testnet.monadexplorer.com/"` | `VITE_MONAD_BLOCK_EXPLORER` |
| DEFAULT_NETWORK | `"sepolia"` | `VITE_DEFAULT_NETWORK` |

**Status:** ✅ Updated to use environment variables

---

### 4. **Market Price API Configuration**
**File:** `src/utils/marketPriceAPI.ts`

| Variable | Current Hardcoded Value | Environment Variable |
|----------|------------------------|---------------------|
| MARKET_PRICE_API_KEY | `'579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b'` | `VITE_MARKET_PRICE_API_KEY` |
| MARKET_PRICE_BASE_URL | `'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070'` | `VITE_MARKET_PRICE_BASE_URL` |

**Status:** ✅ Updated to use environment variables

---

### 5. **Web3Context Hardcoded Values**
**File:** `src/contexts/Web3Context.tsx`

| Variable | Current Hardcoded Value | Status |
|----------|------------------------|--------|
| Infura RPC URL in network config | `'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'` | ✅ Fixed - Now uses `NETWORK_CONFIG.sepolia.rpcUrl` |
| Infura RPC URL in alert message | Hardcoded in error message | ✅ Fixed - Now uses `NETWORK_CONFIG.sepolia.rpcUrl` |

**Status:** ✅ Updated to use config values

---

## 📝 Complete .env File Template

Add these to your `.env` file:

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
VITE_CONTRACT_ADDRESS=0xf8e81D47203A594245E36C48e151709F0C19fBe8
VITE_INFURA_API_KEY=9aa3d95b3bc440fa88ea12eaa4456161
VITE_DEFAULT_NETWORK=sepolia
VITE_SEPOLIA_CHAIN_ID=11155111
VITE_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
VITE_SEPOLIA_BLOCK_EXPLORER=https://sepolia.etherscan.io/
VITE_MONAD_CHAIN_ID=10135
VITE_MONAD_RPC_URL=https://testnet-rpc.monad.xyz/
VITE_MONAD_BLOCK_EXPLORER=https://testnet.monadexplorer.com/

# ============================================
# Market Price API Configuration
# ============================================
VITE_MARKET_PRICE_API_KEY=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b
VITE_MARKET_PRICE_BASE_URL=https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070
```

---

## 🔧 Files Modified

1. ✅ `src/contracts/config.ts` - All Pinata and blockchain configs now use env vars
2. ✅ `src/integrations/supabase/client.ts` - Supabase config now uses env vars
3. ✅ `src/utils/marketPriceAPI.ts` - Market price API now uses env vars
4. ✅ `src/contexts/Web3Context.tsx` - Network config now uses values from config
5. ✅ `.gitignore` - Added `.env` files to ignore list

---

## ⚠️ Security Recommendations

1. **Immediate Actions:**
   - ✅ Create `.env` file with all values above
   - ✅ Verify `.env` is in `.gitignore`
   - ✅ Never commit `.env` file

2. **Best Practices:**
   - Use different API keys for development and production
   - Rotate API keys regularly
   - Restrict API key permissions when possible
   - Use environment-specific `.env` files (`.env.development`, `.env.production`)

3. **Production Checklist:**
   - Remove fallback values from code
   - Use secure environment variable management (e.g., Vercel, Netlify env vars)
   - Enable API key restrictions
   - Monitor API usage for anomalies

---

## ✅ Verification

- ✅ All hardcoded values identified
- ✅ Code updated to use environment variables
- ✅ Fallback values included for backward compatibility
- ✅ Build successful
- ✅ No linting errors
- ✅ `.gitignore` updated

---

## 📚 Additional Resources

- See `ENV_VARIABLES.md` for detailed documentation
- See `SECURITY_FIX_SUMMARY.md` for implementation details
- See `ENV_TEMPLATE.txt` for copy-paste template

