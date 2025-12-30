<div align="center">

# 🌾 AgriTrace

### **Blockchain-Powered Agricultural Supply Chain Management Platform**

*A Government of Odisha Digital Initiative*

[![License](https://img.shields.io/badge/license-Government-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb)](https://reactjs.org/)
[![Blockchain](https://img.shields.io/badge/Blockchain-Ethereum-627EEA)](https://ethereum.org/)
[![Status](https://img.shields.io/badge/status-production-success)]()

---

**Empowering Farmers Through Technology | Complete Transparency | Farm to Table Traceability**

</div>

---

## 📑 Table of Contents

1. [Overview](#-overview)
2. [System Architecture](#-system-architecture)
3. [System Design](#-system-design)
4. [User Manual](#-user-manual)
5. [Detailed Workflows](#-detailed-workflows)
6. [Current Implementation](#-current-implementation)
7. [Technology Stack](#-technology-stack)
8. [Roadmap - Phase 2](#-roadmap---phase-2)
9. [Getting Started](#-getting-started)
10. [Project Structure](#-project-structure)
11. [API Documentation](#-api-documentation)
12. [Contributing](#-contributing)

---

## 🌟 Overview

**AgriTrace** is a revolutionary decentralized application (dApp) that transforms agricultural supply chain management through blockchain technology. Built for the Government of Odisha, it ensures complete transparency, traceability, and trust in the agricultural ecosystem from farm to consumer.

### 🎯 Mission Statement

To empower farmers across Odisha with modern technology that:
- ✅ Ensures complete transparency in the agricultural supply chain
- ✅ Provides fair pricing mechanisms through marketplace integration
- ✅ Builds consumer trust through verifiable blockchain certificates
- ✅ Promotes food security through immutable traceability records
- ✅ Enables direct farmer-to-consumer connections

### 🏆 Key Benefits

| Stakeholder | Benefits |
|------------|----------|
| **Farmers** | Fair pricing, direct market access, digital certificates, reputation building |
| **Distributors** | Verified products, inventory management, transparent transactions |
| **Retailers** | Quality assurance, complete traceability, consumer trust |
| **Consumers** | Product authenticity, safety assurance, origin verification |
| **Government** | Supply chain monitoring, quality control, data analytics |

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Web App    │  │  Mobile App  │  │  Admin Panel │         │
│  │  (React)     │  │  (Future)    │  │  (React)     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Services   │  │   Contexts   │  │   Hooks      │         │
│  │  - IPFS      │  │  - Auth      │  │  - Contract  │         │
│  │  - Blockchain│  │  - Web3      │  │  - Custom    │         │
│  │  - Cert      │  │              │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Blockchain   │    │     IPFS     │    │   Database   │
│  (Ethereum)   │    │   (Pinata)   │    │  (Supabase)  │
│               │    │               │    │              │
│  - Smart      │    │  - Certificates│   │  - Users     │
│    Contracts  │    │  - Metadata   │   │  - Batches   │
│  - Events     │    │  - Files      │   │  - Transactions│
└──────────────┘    └──────────────┘    └──────────────┘
```

### Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
├─────────────────────────────────────────────────────────────┤
│  Pages                                                       │
│  ├── Landing, Login, Signup                                 │
│  ├── Dashboard (Farmer/Distributor/Retailer)               │
│  ├── Marketplace (Farmer/Distributor/Retailer)             │
│  ├── Inventory Management                                    │
│  ├── Batch Registration                                      │
│  └── Verification System                                     │
│                                                              │
│  Components                                                  │
│  ├── Layout (Header, Footer)                                 │
│  ├── UI Components (shadcn/ui)                              │
│  ├── Business Components                                     │
│  │   ├── BatchDetailsModal                                  │
│  │   ├── PurchaseModal                                      │
│  │   ├── QRCodeScanner                                      │
│  │   └── VerificationSystem                                 │
│  └── ProtectedRoute                                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     BUSINESS LOGIC LAYER                      │
├─────────────────────────────────────────────────────────────┤
│  Services                                                    │
│  ├── blockchain/                                             │
│  │   └── Transaction Management                             │
│  ├── ipfs/                                                   │
│  │   ├── File Storage                                       │
│  │   └── Group Management                                   │
│  ├── certificates/                                           │
│  │   └── PDF Generation                                     │
│  └── transactions/                                           │
│      └── Supply Chain Tracking                              │
│                                                              │
│  Contexts                                                    │
│  ├── AuthContext (Authentication)                           │
│  └── Web3Context (Blockchain Connection)                    │
│                                                              │
│  Hooks                                                       │
│  ├── useContract (Smart Contract Interactions)             │
│  └── useAuth (Authentication Helpers)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                               │
├─────────────────────────────────────────────────────────────┤
│  Blockchain (Ethereum)                                       │
│  ├── Smart Contracts                                         │
│  ├── Events & Logs                                           │
│  └── Transaction History                                     │
│                                                              │
│  IPFS (Pinata)                                               │
│  ├── Certificate Storage                                    │
│  ├── Metadata Storage                                        │
│  └── File Groups                                             │
│                                                              │
│  Database (Supabase/PostgreSQL)                              │
│  ├── User Profiles                                           │
│  ├── Batch Records                                           │
│  ├── Transaction Records                                     │
│  └── Inventory Data                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 System Design

### Data Flow Architecture

#### 1. Batch Registration Flow

```
┌──────────┐
│  Farmer  │
└────┬─────┘
     │
     │ 1. Fill Batch Form
     ▼
┌─────────────────┐
│  React Frontend │
└────┬────────────┘
     │
     │ 2. Generate Certificate PDF
     ▼
┌─────────────────┐
│ Certificate     │
│ Generator       │
└────┬────────────┘
     │
     │ 3. Upload to IPFS
     ▼
┌─────────────────┐
│  IPFS Service   │
│  (Pinata)       │
└────┬────────────┘
     │
     │ 4. Get IPFS Hash
     │ 5. Register on Blockchain
     ▼
┌─────────────────┐
│ Smart Contract  │
│ (Ethereum)      │
└────┬────────────┘
     │
     │ 6. Store in Database
     ▼
┌─────────────────┐
│  Supabase DB    │
└─────────────────┘
```

#### 2. Purchase Transaction Flow

```
┌──────────────┐         ┌──────────────┐
│  Distributor │         │    Farmer    │
└──────┬───────┘         └──────┬───────┘
       │                        │
       │ 1. Browse Marketplace  │
       │ 2. Select Batch        │
       │ 3. Initiate Purchase   │
       ▼                        │
┌───────────────────────────────┐
│   Purchase Modal Component    │
└──────┬────────────────────────┘
       │
       │ 4. Generate Purchase Certificate
       ▼
┌───────────────────────────────┐
│   Certificate Generator       │
└──────┬────────────────────────┘
       │
       │ 5. Upload Certificate to IPFS Group
       ▼
┌───────────────────────────────┐
│   IPFS Group Manager          │
└──────┬────────────────────────┘
       │
       │ 6. Record Transaction on Blockchain
       ▼
┌───────────────────────────────┐
│   Blockchain Transaction      │
│   Manager                     │
└──────┬────────────────────────┘
       │
       │ 7. Update Ownership
       │ 8. Store Transaction
       ▼
┌───────────────────────────────┐
│   Database Update             │
│   (Supabase)                  │
└───────────────────────────────┘
```

#### 3. Verification Flow

```
┌──────────┐
│  User    │
└────┬─────┘
     │
     │ 1. Scan QR Code
     ▼
┌─────────────────┐
│ QR Code Scanner │
└────┬────────────┘
     │
     │ 2. Extract Batch ID
     ▼
┌─────────────────┐
│ Verification    │
│ System          │
└────┬────────────┘
     │
     ├──► 3a. Query Database
     │    └──► Batch Info
     │
     ├──► 3b. Query Blockchain
     │    └──► Transaction History
     │
     └──► 3c. Query IPFS
          └──► Certificates
     │
     ▼
┌─────────────────┐
│ Display Complete │
│ Supply Chain     │
│ History          │
└─────────────────┘
```

### Database Schema Design

#### Core Tables

```sql
-- Users & Authentication
profiles
├── id (UUID, PK)
├── user_id (UUID, FK -> auth.users)
├── full_name (TEXT)
├── email (TEXT)
├── phone (TEXT)
├── user_type (ENUM: farmer, distributor, retailer, admin)
├── wallet_address (TEXT)
├── farm_location (TEXT)
└── created_at (TIMESTAMP)

-- Batches
batches
├── id (UUID, PK)
├── farmer_id (UUID, FK -> profiles)
├── crop_type (TEXT)
├── variety (TEXT)
├── harvest_quantity (NUMERIC)
├── harvest_date (DATE)
├── sowing_date (DATE)
├── grading (TEXT)
├── certification (TEXT)
├── price (NUMERIC)
├── ipfs_hash (TEXT)
├── group_id (TEXT) -- Pinata Group ID
├── blockchain_hash (TEXT)
├── current_owner (UUID, FK -> profiles)
└── created_at (TIMESTAMP)

-- Transactions
transactions
├── transaction_id (TEXT, PK)
├── batch_id (UUID, FK -> batches)
├── type (ENUM: HARVEST, PURCHASE, TRANSFER)
├── from_address (TEXT)
├── to_address (TEXT)
├── quantity (NUMERIC)
├── price (NUMERIC)
├── transaction_timestamp (TIMESTAMP)
├── ipfs_hash (TEXT)
├── blockchain_hash (TEXT)
└── metadata (JSONB)

-- Group Files (IPFS Certificates)
group_files
├── id (UUID, PK)
├── group_id (TEXT)
├── batch_id (UUID, FK -> batches)
├── file_name (TEXT)
├── ipfs_hash (TEXT)
├── transaction_type (TEXT)
├── file_size (INTEGER)
├── metadata (JSONB)
└── created_at (TIMESTAMP)

-- Marketplace
marketplace_availability
├── id (UUID, PK)
├── batch_id (UUID, FK -> batches)
├── seller_id (UUID, FK -> profiles)
├── available_quantity (NUMERIC)
├── price_per_kg (NUMERIC)
├── status (ENUM: available, sold, reserved)
└── updated_at (TIMESTAMP)
```

### Smart Contract Design

```solidity
contract AgriTrace {
    // Roles
    bytes32 FARMER_ROLE
    bytes32 DISTRIBUTOR_ROLE
    bytes32 RETAILER_ROLE
    
    // Core Structures
    struct Batch {
        uint256 id
        address farmer
        string crop
        string variety
        string harvestQuantity
        string harvestDate
        string grading
        string certification
        uint256 price
        string ipfsHash
        address currentOwner
    }
    
    // Mappings
    mapping(uint256 => Batch) batches
    mapping(address => uint256) reputation
    
    // Events
    event BatchRegistered(...)
    event PurchaseRecorded(...)
    event OwnershipTransferred(...)
    
    // Functions
    function registerBatch(BatchInput) external
    function recordHarvest(...) external
    function transferBatch(uint256, address) external
    function recordPurchase(...) external
}
```

---

## 📖 User Manual

### Getting Started

#### 1. Account Registration

**Step-by-Step Guide:**

1. **Navigate to Signup Page**
   - Click "Sign Up" button on landing page
   - Or visit `/signup` directly

2. **Choose User Type**
   - Select your role: Farmer, Distributor, or Retailer
   - Each role has different permissions and features

3. **Fill Registration Form**
   ```
   Required Fields:
   - Full Name
   - Email Address
   - Phone Number
   - Password (min 8 characters)
   - User Type Selection
   - Wallet Address (for blockchain transactions)
   ```

4. **Connect Wallet** (Optional but Recommended)
   - Install MetaMask browser extension
   - Click "Connect Wallet" button
   - Approve connection request
   - Your wallet address will be auto-filled

5. **Complete Registration**
   - Click "Create Account"
   - Verify email (if required)
   - You'll be redirected to dashboard

#### 2. Login Process

1. **Navigate to Login Page**
   - Click "Login" button
   - Or visit `/login`

2. **Enter Credentials**
   - Email/Phone and Password
   - Or use wallet connection

3. **Access Dashboard**
   - After successful login
   - Redirected to role-specific dashboard

### Role-Specific Guides

#### 👨‍🌾 For Farmers

##### Dashboard Overview

Your dashboard shows:
- **Total Batches**: Number of batches registered
- **Active Listings**: Batches currently in marketplace
- **Total Sales**: Revenue from sales
- **Pending Orders**: Purchase requests awaiting approval

##### Registering a New Batch

**Step 1: Navigate to Batch Registration**
- Click "Register Batch" in dashboard
- Or visit `/batch-registration`

**Step 2: Fill Batch Information**

```
Required Information:
├── Crop Type (e.g., Rice, Wheat, Vegetables)
├── Variety (specific variety name)
├── Harvest Quantity (in kg)
├── Sowing Date
├── Harvest Date
├── Price per Kg (₹)
├── Grading (Quality grade)
├── Certification (Organic, etc.)
└── Lab Test Results (if available)
```

**Step 3: Submit Registration**

1. Click "Register Batch"
2. System will:
   - Generate harvest certificate PDF
   - Upload certificate to IPFS
   - Create Pinata group for batch
   - Register batch on blockchain
   - Store in database
3. Wait for transaction confirmation
4. Batch will appear in your inventory

##### Managing Your Batches

**View Batches:**
- Go to Dashboard → "My Batches"
- See all registered batches with status

**Update Batch:**
- Click on batch card
- Edit price or details
- Changes reflected in marketplace

**View Certificates:**
- Click "View Certificate" on any batch
- Download PDF certificate
- Share certificate link

##### Selling to Distributors

1. **List in Marketplace**
   - Batches automatically appear in Farmer Marketplace
   - Distributors can browse and purchase

2. **Receive Purchase Requests**
   - Notification when distributor wants to buy
   - Review purchase details

3. **Approve Purchase**
   - Confirm quantity and price
   - Transaction recorded on blockchain
   - Certificate generated automatically

#### 🚚 For Distributors

##### Dashboard Overview

Your dashboard shows:
- **Total Purchases**: Batches bought from farmers
- **Active Inventory**: Batches available for sale
- **Total Sales**: Revenue from retailer sales
- **Pending Orders**: Retailer purchase requests

##### Buying from Farmers

**Step 1: Browse Farmer Marketplace**
- Navigate to `/marketplace`
- View all available farmer batches
- Filter by crop type, price, location

**Step 2: Select Batch**
- Click on batch card
- View complete details:
  - Crop information
  - Quality grading
  - Certificates
  - Supply chain history
  - Current price

**Step 3: Make Purchase**
- Click "Buy" button
- Enter purchase quantity
- Review total price
- Confirm purchase

**Step 4: Complete Transaction**
- Connect wallet (if not connected)
- Approve blockchain transaction
- Wait for confirmation
- Batch added to your inventory

##### Managing Inventory

**View Inventory:**
- Go to `/distributor-inventory`
- See all purchased batches
- Check available quantities

**Update Prices:**
- Click on batch
- Edit price per kg
- Update for retailer marketplace

**List for Retailers:**
- Batches automatically appear in Retailer Marketplace
- Retailers can browse and purchase

##### Selling to Retailers

1. **Retailer Marketplace**
   - Your batches appear automatically
   - Retailers can view and purchase

2. **Process Sales**
   - Similar to farmer purchase flow
   - Transaction recorded on blockchain
   - Certificate generated

#### 🏪 For Retailers

##### Dashboard Overview

Your dashboard shows:
- **Total Purchases**: Batches bought from distributors
- **Active Inventory**: Products in stock
- **Sales Analytics**: Revenue and trends

##### Buying from Distributors

**Step 1: Browse Retailer Marketplace**
- Navigate to `/retailer-marketplace`
- View distributor batches
- Filter and search options

**Step 2: Select Product**
- Click on batch card
- View:
  - Complete supply chain history
  - Original farmer information
  - All certificates
  - Quality information

**Step 3: Make Purchase**
- Click "Buy" button
- Enter quantity
- Review details
- Confirm purchase

**Step 4: Complete Transaction**
- Approve blockchain transaction
- Receive product in inventory
- Access all certificates

##### Product Verification

**QR Code Verification:**
1. Scan QR code on product
2. View complete supply chain:
   - Original farmer
   - All transactions
   - Quality certificates
   - Blockchain verification

**Manual Verification:**
1. Go to `/verification`
2. Enter batch ID or scan QR
3. View complete history

### Common Features

#### 🔍 Product Tracking

**Track Any Product:**
1. Navigate to `/track`
2. Enter batch ID or scan QR code
3. View complete supply chain:
   - Origin (farmer details)
   - All transactions
   - Current owner
   - Certificates
   - Blockchain verification

#### 📱 QR Code System

**Generate QR Codes:**
- Each batch gets unique QR code
- Accessible from batch details
- Download QR code image
- Print for physical products

**Scan QR Codes:**
- Use mobile camera
- Or QR scanner component
- Instant verification
- Complete product history

#### 📄 Certificate Management

**View Certificates:**
- All transactions generate certificates
- Accessible from batch details
- Download as PDF
- Share certificate links

**Certificate Types:**
- Harvest Certificate (initial registration)
- Purchase Certificate (each transaction)
- Transfer Certificate (ownership changes)

#### 👤 Profile Management

**Update Profile:**
1. Go to `/profile`
2. Edit information:
   - Personal details
   - Contact information
   - Farm location
   - Wallet address
3. Save changes

---

## 🔄 Detailed Workflows

### Workflow 1: Complete Supply Chain Journey

```
┌─────────────────────────────────────────────────────────────┐
│                    FARMER REGISTRATION                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ 1. Farmer       │
                    │    Registers    │
                    │    Batch        │
                    └────────┬────────┘
                             │
                             │ a. Fill Form
                             │ b. Generate Certificate
                             │ c. Upload to IPFS
                             │ d. Register on Blockchain
                             │ e. Store in Database
                             ▼
                    ┌─────────────────┐
                    │ 2. Batch        │
                    │    Available in │
                    │    Marketplace  │
                    └────────┬────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                  DISTRIBUTOR PURCHASE                        │
└─────────────────────────────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │ 3. Distributor  │
                    │    Browses      │
                    │    Marketplace  │
                    └────────┬────────┘
                             │
                             │ a. Select Batch
                             │ b. Review Details
                             │ c. Initiate Purchase
                             │ d. Generate Purchase Certificate
                             │ e. Record on Blockchain
                             │ f. Update Ownership
                             ▼
                    ┌─────────────────┐
                    │ 4. Batch in     │
                    │    Distributor  │
                    │    Inventory    │
                    └────────┬────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   RETAILER PURCHASE                         │
└─────────────────────────────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │ 5. Retailer    │
                    │    Browses     │
                    │    Marketplace │
                    └────────┬────────┘
                             │
                             │ a. Select Product
                             │ b. View Full History
                             │ c. Verify Certificates
                             │ d. Make Purchase
                             │ e. Record Transaction
                             │ f. Update Ownership
                             ▼
                    ┌─────────────────┐
                    │ 6. Product      │
                    │    Ready for    │
                    │    Consumer     │
                    └─────────────────┘
```

### Workflow 2: Certificate Generation Flow

```
User Action
    │
    ▼
┌──────────────────────┐
│ Transaction Trigger  │
│ (Harvest/Purchase)   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Collect Data         │
│ - Batch Info         │
│ - Transaction Details │
│ - Parties Involved    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Generate PDF         │
│ - Government Style   │
│ - All Details        │
│ - QR Code            │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Upload to IPFS       │
│ - Pinata Service      │
│ - Group Association   │
│ - Metadata Storage    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Get IPFS Hash         │
│ - Unique Identifier   │
│ - Permanent Link      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Store Reference      │
│ - Database Entry      │
│ - Group File Record   │
│ - Transaction Link    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Certificate Ready    │
│ - Downloadable        │
│ - Verifiable          │
│ - Shareable           │
└──────────────────────┘
```

### Workflow 3: Verification Process

```
User Scans QR Code
    │
    ▼
┌──────────────────────┐
│ Extract Batch ID     │
└──────────┬───────────┘
           │
           ├─────────────────┬─────────────────┐
           ▼                 ▼                 ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────┐
│ Query Database   │ │ Query        │ │ Query IPFS   │
│ - Batch Info     │ │ Blockchain   │ │ - Certificates│
│ - Owner Info     │ │ - Transactions│ │ - Metadata   │
│ - Transactions   │ │ - Events     │ │ - Files      │
└──────────┬───────┘ └──────┬───────┘ └──────┬───────┘
           │                 │                 │
           └─────────────────┼─────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Aggregate Data  │
                    │ - Complete      │
                    │   History       │
                    │ - All           │
                    │   Certificates  │
                    │ - Blockchain    │
                    │   Verification  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Display Results │
                    │ - Timeline View │
                    │ - Certificate   │
                    │   Gallery       │
                    │ - Verification  │
                    │   Status        │
                    └─────────────────┘
```

---

## ✅ Current Implementation

### Phase 1: Core Platform (✅ Completed)

#### 🔐 Blockchain Integration
- ✅ **Ethereum Smart Contracts**: Deployed on Sepolia Testnet
- ✅ **Smart Contract Features**:
  - Batch registration with complete metadata
  - Ownership transfer tracking
  - Purchase transaction recording
  - Reputation system for farmers
  - Role-based access control
- ✅ **Transaction Management**: Complete blockchain transaction tracking
- ✅ **Event Logging**: All events recorded and queryable

#### 📦 IPFS Certificate Storage
- ✅ **Decentralized Storage**: All certificates on IPFS via Pinata
- ✅ **Group Management**: Certificates organized by batch groups
- ✅ **Immutable Certificates**: PDF certificates for every transaction
- ✅ **Verification System**: Complete certificate verification
- ✅ **File Organization**: Efficient group-based file management

#### 👥 Role-Based System
- ✅ **Farmer Dashboard**: Complete batch management
- ✅ **Distributor Dashboard**: Purchase and inventory management
- ✅ **Retailer Dashboard**: Product tracking and verification
- ✅ **Admin Dashboard**: System monitoring and analytics

#### 🛒 Marketplace System
- ✅ **Farmer Marketplace**: Direct sales to distributors
- ✅ **Retailer Marketplace**: Distributor-to-retailer sales
- ✅ **Real-time Pricing**: Market price integration
- ✅ **Inventory Management**: Complete stock tracking
- ✅ **Purchase Flow**: Streamlined buying process

#### 📱 QR Code System
- ✅ **Batch QR Codes**: Unique codes for each batch
- ✅ **Certificate QR Codes**: Quick certificate access
- ✅ **Verification QR Codes**: Instant product verification
- ✅ **Mobile Support**: Scan and verify on any device

#### 📄 Certificate Generation
- ✅ **Automated PDF Generation**: Government-style certificates
- ✅ **Transaction Certificates**: For every purchase/transfer
- ✅ **Harvest Certificates**: Initial batch registration
- ✅ **Complete History**: Full supply chain documentation

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.3 | UI Framework |
| TypeScript | 5.8 | Type Safety |
| Vite | 5.4 | Build Tool |
| shadcn/ui | Latest | UI Components |
| Tailwind CSS | 3.4 | Styling |
| React Query | 5.83 | State Management |
| React Router | 6.30 | Routing |

### Blockchain
| Technology | Version | Purpose |
|-----------|---------|---------|
| Ethereum | Sepolia | Blockchain Network |
| Solidity | 0.8.20 | Smart Contracts |
| Ethers.js | 6.15 | Blockchain Interaction |
| OpenZeppelin | 4.9.3 | Security Libraries |

### Storage & Database
| Technology | Purpose |
|-----------|---------|
| IPFS (Pinata) | Decentralized Certificate Storage |
| Supabase | PostgreSQL Database |
| Supabase Auth | User Authentication |

### Development Tools
| Tool | Purpose |
|------|---------|
| ESLint | Code Linting |
| TypeScript | Type Checking |
| Git | Version Control |

---

## 🗺️ Roadmap - Phase 2

### 🎯 Upcoming Features (Q2 2024)

#### 🔗 Multi-Chain Support
- Multiple blockchain networks (Ethereum, Polygon, BSC)
- Cross-chain interoperability
- Chain selection for users
- Gas optimization on Layer 2
- Network-agnostic platform

#### 🚚 Truck Pooling System
- AI-powered route optimization
- Cost-sharing mechanism
- GPS-based tracking
- Scheduling system
- Marketplace integration

#### 🤖 AI Crop Health Detection
- Image recognition for crop analysis
- Disease detection
- Pest identification
- Growth monitoring
- Treatment recommendations

#### 📡 IoT-Based Farm Land Health
- Sensor integration (moisture, temperature, pH)
- Real-time monitoring
- Data analytics
- Automated alerts
- Smart irrigation

#### 💰 Escrow System
- Secure payment holding
- Smart contract automation
- Dispute resolution
- Multi-party escrow
- Refund protection

#### 📞 AI Calling Agent
- Voice interface for offline farmers
- Phone integration (feature phones)
- IVR system
- Multi-language support
- SMS notifications
- USSD support

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **MetaMask** browser extension
- **Supabase** account
- **Pinata** account (for IPFS)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AgriTrace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_PINATA_API_KEY=your_pinata_api_key
   VITE_PINATA_SECRET_KEY=your_pinata_secret_key
   VITE_PINATA_JWT=your_pinata_jwt
   ```

4. **Start development server**
   ```bash
npm run dev
```

5. **Build for production**
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── layout/         # Layout components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Feature components
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   └── Web3Context.tsx
├── contracts/          # Smart contract configs
│   ├── AgriTrace.json
│   └── config.ts
├── hooks/              # Custom hooks
│   ├── useContract.ts
│   └── use-toast.ts
├── integrations/       # Third-party integrations
│   └── supabase/
├── pages/              # Page components
│   ├── Auth/
│   ├── Dashboard/
│   └── ...
├── services/           # Business logic services
│   ├── blockchain/     # Blockchain operations
│   ├── ipfs/           # IPFS operations
│   └── ...
├── types/              # TypeScript types
├── utils/              # Utility functions
│   ├── helpers/
│   └── qr/
└── constants/          # App constants
```

---

## 📚 API Documentation

### Blockchain Service

```typescript
// Initialize blockchain manager
initializeBlockchainManager(provider, signer)

// Record harvest transaction
recordHarvestTransaction(
  batchId: string,
  farmerAddress: string,
  cropType: string,
  variety: string,
  quantity: number,
  price: number,
  ipfsHash: string
): Promise<BlockchainTransaction>

// Record purchase transaction
recordPurchaseTransaction(
  batchId: string,
  fromAddress: string,
  toAddress: string,
  quantity: number,
  price: number
): Promise<BlockchainTransaction>
```

### IPFS Service

```typescript
// Upload file to IPFS
uploadFile(
  file: File | Blob,
  fileName: string,
  metadata?: PinataMetadata
): Promise<PinataResponse>

// Upload certificate
uploadCertificate(
  pdfBlob: Blob,
  batchId: string,
  metadata?: any
): Promise<string>

// Get file URL
getFileUrl(ipfsHash: string): string
```

### Transaction Service

```typescript
// Create transaction
createTransaction(
  type: 'HARVEST' | 'PURCHASE' | 'TRANSFER',
  from: string,
  to: string,
  quantity: number,
  price: number,
  batchId: string
): Promise<SupplyChainTransaction>

// Get batch transactions
getBatchTransactions(batchId: string): Promise<SupplyChainTransaction[]>

// Get transaction chain
getTransactionChain(batchId: string): Promise<TransactionChain>
```

---

## 🤝 Contributing

This is a government project developed for the Government of Odisha. For contributions, please contact the project administrators.

---

## 📞 Support

For issues and questions, please contact the development team.

---

## 📝 License

This project is developed for the Government of Odisha.

---

<div align="center">

**Built with ❤️ for the Government of Odisha**

*Empowering Farmers Through Technology | Complete Transparency | Farm to Table Traceability*

[🌐 Website](#) | [📧 Email](#) | [📱 Support](#)

---

*Last Updated: 2024*

</div>
