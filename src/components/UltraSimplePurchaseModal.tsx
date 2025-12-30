import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { purchaseTransactionCreator } from '@/utils/purchaseTransactionCreator';
import { singleStepGroupManager } from '@/utils/singleStepGroupManager';
import { blockchainTransactionManager } from '@/services/blockchain';
import { useWeb3 } from '@/contexts/Web3Context';
import { 
  ShoppingCart, 
  Package, 
  MapPin, 
  DollarSign,
  CheckCircle
} from 'lucide-react';

interface UltraSimplePurchaseModalProps {
  batch: any;
  isOpen: boolean;
  onClose: () => void;
  onPurchaseComplete: () => void;
}

export const UltraSimplePurchaseModal: React.FC<UltraSimplePurchaseModalProps> = ({ 
  batch, 
  isOpen, 
  onClose, 
  onPurchaseComplete 
}) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { signer, account } = useWeb3();

  if (!batch || !isOpen) return null;

  const handlePurchase = async (quantity: number, address: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to make a purchase.",
      });
      return;
    }

    console.log('🔍 DEBUG: Starting purchase with profile:', profile);
    console.log('🔍 DEBUG: Profile user_type:', profile?.user_type);
    console.log('🔍 DEBUG: Profile full_name:', profile?.full_name);
    console.log('🔍 DEBUG: All profile fields:', Object.keys(profile || {}));
    console.log('🔍 DEBUG: Batch object:', batch);
    console.log('🔍 DEBUG: Batch keys:', Object.keys(batch || {}));
    console.log('🔍 DEBUG: Batch batch_id:', batch?.batch_id);
    console.log('🔍 DEBUG: Batch id:', batch?.id);

    if (!address.trim()) {
      toast({
        variant: "destructive",
        title: "Delivery Address Required",
        description: "Please enter a delivery address.",
      });
      return;
    }

    try {
      console.log('🔍 DEBUG: Price calculation inputs:', {
        batchPrice: batch.price,
        batchQuantity: batch.quantity,
        requestedQuantity: quantity,
        batchObject: batch
      });
      
      console.log('🔍 DEBUG: Complete batch object structure:', JSON.stringify(batch, null, 2));
      console.log('🔍 DEBUG: Batch object keys:', Object.keys(batch));
      console.log('🔍 DEBUG: Batch object values:', Object.values(batch));
      
      // Try to get price and quantity from different possible sources
      // Based on the actual batch object structure, use price_per_kg and harvest_quantity
      const batchPrice = batch.price_per_kg || batch.price || batch.batches?.price_per_kg || batch.batches?.price || batch.batches?.total_price;
      const batchQuantity = batch.harvest_quantity || batch.quantity || batch.batches?.harvest_quantity || batch.batches?.quantity;
      
      console.log('🔍 DEBUG: Price and quantity fallback:', {
        batchPrice,
        batchQuantity,
        batchPriceSource: batch.price ? 'batch.price' : batch.batches?.price ? 'batch.batches.price' : batch.batches?.price_per_kg ? 'batch.batches.price_per_kg' : batch.batches?.total_price ? 'batch.batches.total_price' : 'none',
        batchQuantitySource: batch.quantity ? 'batch.quantity' : batch.batches?.quantity ? 'batch.batches.quantity' : batch.batches?.harvest_quantity ? 'batch.batches.harvest_quantity' : 'none'
      });
      
      // Use marketplace price and quantity directly
      const unitPrice = Math.round(batchPrice / batchQuantity);
      const totalPrice = quantity * unitPrice;
      const deliveryFee = totalPrice > 1000 ? 0 : 50;
      const finalTotal = totalPrice + deliveryFee;

      // Validate that we have valid price and quantity
      if (isNaN(batchPrice) || isNaN(batchQuantity) || batchPrice <= 0 || batchQuantity <= 0) {
        throw new Error(`Invalid price or quantity: price=${batchPrice}, quantity=${batchQuantity}`);
      }
      
      console.log('🔍 DEBUG: Price calculation results:', {
        unitPrice,
        totalPrice,
        deliveryFee,
        finalTotal
      });

      // Check if enough quantity is available
      if (quantity > batch.quantity) {
        throw new Error(`Only ${batch.quantity} kg available, but you requested ${quantity} kg`);
      }

      // Use the new purchase function
      console.log('🔍 DEBUG: Purchasing from marketplace...');
      
      // Get the correct batch ID for database updates (this should be the batch UUID)
      const batchId = batch.batch_id || batch.id || batch.batches?.id;
      console.log('🔍 DEBUG: Using batch ID for update:', batchId);
      
      // Get the marketplace ID for inventory
      // Since this batch object is from the batches table, we need to find the corresponding marketplace record
      let marketplaceId = null;
      
      try {
        const { data: marketplaceRecord } = await supabase
          .from('marketplace')
          .select('id')
          .eq('batch_id', batchId)
          .single();
        
        marketplaceId = marketplaceRecord?.id;
        console.log('🔍 DEBUG: Found marketplace record:', marketplaceRecord);
        console.log('🔍 DEBUG: Using marketplace ID for inventory:', marketplaceId);
      } catch (error) {
        console.warn('🔍 DEBUG: Could not find marketplace record for batch:', batchId, error);
      }
      
      if (!batchId) {
        throw new Error('No valid batch ID found for update');
      }
      
      if (!marketplaceId) {
        console.warn('🔍 DEBUG: No marketplace ID found, skipping inventory creation');
      }

      // Update the batch ownership directly
      const { error: updateError } = await supabase
        .from('batches')
        .update({ 
          current_owner: profile?.id,
          status: 'available'
        })
        .eq('id', batchId);

      if (updateError) {
        throw new Error(`Purchase failed: ${updateError.message}`);
      }

      // Update marketplace to show new owner (not sold, but transferred)
      const { error: marketplaceError } = await supabase
        .from('marketplace')
        .update({ 
          status: 'available', // Keep as available for the new owner
          current_seller_id: profile?.id,
          current_seller_type: profile?.full_name?.toLowerCase() === 'distributor' ? 'distributor' : 'retailer'
        })
        .eq('id', batch.id);

      if (marketplaceError) {
        console.warn('Failed to update marketplace:', marketplaceError);
        // Don't fail the purchase for this
      }

      console.log('🔍 DEBUG: Purchase successful!');
      console.log('🔍 DEBUG: Profile data:', profile);
      console.log('🔍 DEBUG: User type:', profile?.user_type);

      // Create inventory entry for distributor/retailer
      // Check if user is distributor based on full_name or user_type (case-insensitive)
      const isDistributor = profile?.user_type === 'distributor' || 
                           profile?.full_name?.toLowerCase() === 'distributor';
      const isRetailer = profile?.user_type === 'retailer' || 
                        profile?.full_name?.toLowerCase() === 'retailer';
      
      console.log('🔍 DEBUG: User type check:', {
        user_type: profile?.user_type,
        full_name: profile?.full_name,
        isDistributor,
        isRetailer
      });
      
      if (isDistributor && marketplaceId) {
        const inventoryData = {
          distributor_id: profile.id,
          marketplace_id: marketplaceId, // Use the marketplace table's integer ID
          quantity_purchased: quantity,
          purchase_price: finalTotal,
          created_at: new Date().toISOString()
        };
        
        console.log('🔍 DEBUG: Distributor inventory data before insert:', inventoryData);
        console.log('🔍 DEBUG: Batch object keys:', Object.keys(batch));
        console.log('🔍 DEBUG: Batch.id type:', typeof batch.id, 'value:', batch.id);
        console.log('🔍 DEBUG: Full batch object structure:', JSON.stringify(batch, null, 2));

        console.log('🔍 DEBUG: Creating distributor inventory entry:', inventoryData);

        const { data: inventoryResult, error: inventoryError } = await supabase
          .from('distributor_inventory')
          .insert(inventoryData)
          .select()
          .single();

        if (inventoryError) {
          console.error('❌ Distributor inventory creation error:', inventoryError);
          console.error('❌ Inventory data that failed:', inventoryData);
        } else {
          console.log('✅ Distributor inventory entry created successfully:', inventoryResult);
        }
      } else if (isDistributor && !marketplaceId) {
        console.log('⚠️ Skipping distributor inventory creation - no marketplace ID found');
      } else if (isRetailer && marketplaceId) {
        const inventoryData = {
          retailer_id: profile.id,
          marketplace_id: marketplaceId, // Use the marketplace table's integer ID
          quantity_purchased: quantity,
          purchase_price: finalTotal,
          created_at: new Date().toISOString()
        };
        
        console.log('🔍 DEBUG: Inventory data before insert:', inventoryData);
        console.log('🔍 DEBUG: Batch object keys:', Object.keys(batch));
        console.log('🔍 DEBUG: Batch.id type:', typeof batch.id, 'value:', batch.id);
        console.log('🔍 DEBUG: Full batch object structure:', JSON.stringify(batch, null, 2));

        console.log('🔍 DEBUG: Creating retailer inventory entry:', inventoryData);

        const { data: inventoryResult, error: inventoryError } = await supabase
          .from('retailer_inventory')
          .insert(inventoryData)
          .select()
          .single();

        if (inventoryError) {
          console.error('❌ Retailer inventory creation error:', inventoryError);
          console.error('❌ Inventory data that failed:', inventoryData);
        } else {
          console.log('✅ Retailer inventory entry created successfully:', inventoryResult);
        }
      } else if (isRetailer && !marketplaceId) {
        console.log('⚠️ Skipping retailer inventory creation - no marketplace ID found');
      } else {
        console.log('🔍 DEBUG: No inventory creation - user type check failed');
        console.log('🔍 DEBUG: User type:', profile?.user_type);
        console.log('🔍 DEBUG: Full name:', profile?.full_name);
        console.log('🔍 DEBUG: Is distributor:', isDistributor);
        console.log('🔍 DEBUG: Is retailer:', isRetailer);
        console.log('🔍 DEBUG: Profile object:', profile);
      }

      // Record transaction on blockchain (optional)
      if (signer && blockchainTransactionManager && account) {
        try {
          blockchainTransactionManager.updateSigner(signer);
          // Get seller's wallet address from the batch data
          let sellerWalletAddress = batch.profiles?.wallet_address;
          
          // If wallet address is not available, try to fetch it from the seller's profile
          if (!sellerWalletAddress) {
            console.log('🔍 DEBUG: Seller wallet address not found in batch, fetching from profile...');
            
            // Try to get seller ID from different sources
            const sellerId = batch.current_owner || batch.current_seller_id || batch.farmer_id;
            console.log('🔍 DEBUG: Seller ID for wallet lookup:', sellerId);
            
            if (sellerId) {
              try {
                const { data: sellerProfile } = await supabase
                  .from('profiles')
                  .select('wallet_address, full_name, email')
                  .eq('id', sellerId)
                  .single();
                
                sellerWalletAddress = sellerProfile?.wallet_address;
                console.log('🔍 DEBUG: Fetched seller profile:', sellerProfile);
                console.log('🔍 DEBUG: Seller wallet address from profile:', sellerWalletAddress);
                
                // If still no wallet address, try to use a default or generate one
                if (!sellerWalletAddress) {
                  console.warn('🔍 DEBUG: Seller has no wallet address in profile, using fallback...');
                  // Generate a placeholder wallet address for demo purposes
                  // In production, you would want to prompt the seller to connect their wallet
                  sellerWalletAddress = `0x${sellerId.replace(/-/g, '').substring(0, 40)}`;
                  console.log('🔍 DEBUG: Generated placeholder wallet address:', sellerWalletAddress);
                }
              } catch (error) {
                console.warn('🔍 DEBUG: Could not fetch seller profile:', error);
                // Use a default wallet address for demo purposes
                sellerWalletAddress = '0x0000000000000000000000000000000000000000';
                console.log('🔍 DEBUG: Using default wallet address due to error:', sellerWalletAddress);
              }
            } else {
              console.warn('🔍 DEBUG: No seller ID found for wallet lookup');
              // Use a default wallet address for demo purposes
              sellerWalletAddress = '0x0000000000000000000000000000000000000000';
              console.log('🔍 DEBUG: Using default wallet address:', sellerWalletAddress);
            }
          }
          
          console.log('🔍 DEBUG: Seller wallet address sources:', {
            batchProfilesWalletAddress: batch.profiles?.wallet_address,
            batchBatchesProfilesWalletAddress: batch.batches?.profiles?.wallet_address,
            batchCurrentSellerId: batch.current_seller_id,
            batchCurrentOwner: batch.current_owner,
            batchFarmerId: batch.farmer_id,
            finalSellerWalletAddress: sellerWalletAddress
          });
          
          console.log('🔍 DEBUG: Wallet address check:', {
            batchProfiles: batch.profiles,
            sellerWalletAddress,
            account,
            batchCurrentSellerId: batch.current_seller_id
          });
          
          // Validate that we have valid Ethereum addresses
          if (!sellerWalletAddress || !account) {
            console.warn('🔍 DEBUG: Missing wallet addresses for blockchain transaction');
            console.warn('🔍 DEBUG: sellerWalletAddress:', sellerWalletAddress);
            console.warn('🔍 DEBUG: account:', account);
            console.warn('🔍 DEBUG: Skipping blockchain transaction, continuing with database transaction');
            // Don't return - continue with the purchase without blockchain transaction
          } else {
            console.log('🔍 DEBUG: Blockchain transaction addresses:', {
              seller: sellerWalletAddress,
              buyer: account,
              batchId: batchId
            });
            
            const blockchainTransaction = await blockchainTransactionManager.recordPurchaseTransaction(
              batchId, // Use the validated batch ID
              sellerWalletAddress, // From current seller (Ethereum address)
              account, // To buyer (current wallet address)
              quantity,
              finalTotal,
              'PURCHASE'
            );
            console.log('🔍 DEBUG: Blockchain transaction recorded:', blockchainTransaction);
            
            // Generate and upload purchase certificate to the same group
            try {
              console.log('🔍 DEBUG: Generating purchase certificate...');
              
              // Get the group ID from the batch data
              // The group_id is directly on the batch object, not nested in batch.batches
              const groupId = batch.group_id || batch.batches?.group_id;
              console.log('🔍 DEBUG: Group ID lookup:', {
                batchGroupId: batch.group_id,
                batchBatchesGroupId: batch.batches?.group_id,
                finalGroupId: groupId
              });
              
              if (!groupId) {
                console.warn('⚠️ No group ID found for batch, skipping certificate generation');
                console.warn('🔍 DEBUG: Batch object keys:', Object.keys(batch));
                console.warn('🔍 DEBUG: Batch object:', batch);
                return;
              }
              
              const purchaseData = {
                batchId: batchId, // Use the validated batch ID
                from: batch.profiles?.full_name || 'Unknown Seller',
                to: profile?.full_name || 'Unknown Buyer',
                quantity: quantity,
                pricePerKg: Math.round(finalTotal / quantity),
                timestamp: new Date().toISOString()
              };
              
              console.log('🔍 DEBUG: Purchase data:', purchaseData);
              console.log('🔍 DEBUG: Group ID:', groupId);
              
              const purchaseCertificateResult = await singleStepGroupManager.uploadPurchaseCertificate(
                groupId,
                purchaseData
              );
              console.log('✅ Purchase certificate generated:', purchaseCertificateResult);
              
              // Generate QR code for the purchase transaction
              try {
                const { generateTransactionReceiptQR } = await import('@/utils/qrCodeGenerator');
                const qrCodeDataURL = await generateTransactionReceiptQR({
                  transactionId: transactionResult.id,
                  batchId: batchId,
                  from: batch.profiles?.full_name || 'Unknown Seller',
                  to: profile?.full_name || 'Unknown Buyer',
                  quantity: quantity,
                  price: finalTotal,
                  timestamp: new Date().toISOString(),
                  ipfsHash: purchaseCertificateResult?.ipfsHash,
                  blockchainHash: blockchainTransaction?.transactionHash
                });
                
                console.log('✅ QR code generated for purchase transaction');
                
                // Store QR code in localStorage for later access
                localStorage.setItem(`purchase_qr_${transactionResult.id}`, qrCodeDataURL);
              } catch (qrError) {
                console.error('❌ QR code generation failed:', qrError);
                // Continue even if QR code generation fails
              }
            } catch (certError) {
              console.error('❌ Purchase certificate generation failed:', certError);
              // Continue even if certificate generation fails
            }
          }
        } catch (blockchainError) {
          console.error('🔍 DEBUG: Blockchain transaction failed:', blockchainError);
          // Continue even if blockchain fails
        }
      }

      onPurchaseComplete();
      onClose();
      toast({
        title: "Purchase Successful!",
        description: `Your order for ${quantity}kg of ${batch.batches?.crop_type || 'crop'} has been placed. The item is now in your inventory.`,
      });
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        variant: "destructive",
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred during purchase.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Purchase {batch.batches?.crop_type || 'Crop'}
          </DialogTitle>
          <DialogDescription>
            Complete your purchase of {batch.batches?.crop_type || 'Crop'} - {batch.batches?.variety || 'Variety'}
          </DialogDescription>
        </DialogHeader>

        <PurchaseForm 
          batch={batch} 
          onPurchase={handlePurchase} 
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

// Separate component for the form to avoid hooks issues
const PurchaseForm: React.FC<{
  batch: any;
  onPurchase: (quantity: number, address: string) => void;
  onClose: () => void;
}> = ({ batch, onPurchase, onClose }) => {
  const [quantity, setQuantity] = React.useState(1);
  const [address, setAddress] = React.useState('');

  const unitPrice = batch.price_per_kg;
  const totalPrice = quantity * unitPrice;
  const deliveryFee = totalPrice > 1000 ? 0 : 50;
  const finalTotal = totalPrice + deliveryFee;

  return (
    <div className="space-y-6">
      {/* Product Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Product Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Crop Type</Label>
              <p className="font-medium">{batch.crop_type}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Variety</Label>
              <p className="font-medium">{batch.variety}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Available Quantity</Label>
              <p className="font-medium">{batch.quantity} kg</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Price per kg</Label>
              <p className="font-medium text-green-600">₹{batch.price_per_kg}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quantity & Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Quantity & Pricing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="quantity">Quantity (kg)</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={batch.quantity}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Available: {batch.quantity} kg
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal ({quantity}kg × ₹{unitPrice}):</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span className="text-green-600">₹{finalTotal}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Delivery Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="address">Full Address</Label>
            <Input
              id="address"
              placeholder="Enter your complete delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button 
          onClick={() => onPurchase(quantity, address)}
          disabled={!address.trim()}
          className="flex-1"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Purchase Now
        </Button>
      </div>
    </div>
  );
};
