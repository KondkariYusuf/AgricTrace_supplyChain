/**
 * Pinata Group Manager Service
 * Manages PDF certificates using Pinata's grouping feature
 */

import { PINATA_CONFIG } from '@/contracts/config';
import { ipfsService } from './index';

export class PinataGroupManager {
  private static instance: PinataGroupManager;

  private constructor() {}

  public static getInstance(): PinataGroupManager {
    if (!PinataGroupManager.instance) {
      PinataGroupManager.instance = new PinataGroupManager();
    }
    return PinataGroupManager.instance;
  }

  /**
   * Generate a unique group name
   */
  private generateGroupName(farmerName: string, cropType: string, variety: string): string {
    const safeFarmerName = farmerName || 'unknown_farmer';
    const safeCropType = cropType || 'unknown_crop';
    const safeVariety = variety || 'unknown_variety';
    
    let cleanFarmerName = safeFarmerName;
    if (safeFarmerName.startsWith('0x')) {
      cleanFarmerName = `addr_${safeFarmerName.slice(-8).toLowerCase()}`;
    } else {
      cleanFarmerName = safeFarmerName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    }
    
    const cleanCropType = safeCropType.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const cleanVariety = safeVariety.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    
    const timestamp = Date.now();
    const groupName = `${cleanFarmerName}_${cleanCropType}_${cleanVariety}_${timestamp}`;
    
    return groupName.length > 80 ? groupName.substring(0, 80) : groupName;
  }

  /**
   * Create a Pinata group
   */
  public async createGroup(groupName: string): Promise<string> {
    try {
      if (!groupName || groupName.trim().length === 0) {
        throw new Error('Group name cannot be empty');
      }
      
      if (groupName.length > 100) {
        throw new Error('Group name too long (max 100 characters)');
      }
      
      const response = await fetch("https://api.pinata.cloud/v3/groups/public", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PINATA_CONFIG.jwt}`,
        },
        body: JSON.stringify({ name: groupName }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create group: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      
      if (data.data && data.data.id) {
        return data.data.id;
      } else {
        throw new Error('No group ID in response');
      }
    } catch (error: any) {
      console.error('Error creating Pinata group:', error);
      throw new Error(`Failed to create Pinata group: ${error.message}`);
    }
  }

  /**
   * Upload file directly to a Pinata group in single step
   */
  public async uploadFileToGroup(
    groupId: string,
    fileBlob: Blob,
    fileName: string,
    metadata: any
  ): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("file", fileBlob, fileName);
      formData.append("network", "public");
      formData.append("group_id", groupId);

      if (metadata) {
        const pinataMetadata = {
          name: fileName,
          keyvalues: {
            ...metadata.keyvalues,
            groupId: groupId,
            groupName: metadata.keyvalues?.groupName || 'unknown'
          }
        };
        formData.append("metadata", JSON.stringify(pinataMetadata));
      }

      const response = await fetch("https://uploads.pinata.cloud/v3/files", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${PINATA_CONFIG.jwt}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload file: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      const ipfsHash = data.data.cid;
      
      if (!ipfsHash) {
        throw new Error('No IPFS hash returned from upload');
      }

      // Store file reference in database
      await this.storeFileReference(groupId, fileName, ipfsHash, fileBlob.size, metadata);
      
      return ipfsHash;
    } catch (error: any) {
      console.error('Error uploading file to group:', error);
      throw new Error(`Failed to upload file to group: ${error.message}`);
    }
  }

  /**
   * Upload harvest certificate to a new group
   */
  public async uploadHarvestCertificate(
    batchData: {
      batchId: string;
      farmerName: string;
      cropType: string;
      variety: string;
      harvestQuantity: number;
      harvestDate: string;
      grading: string;
      certification: string;
      pricePerKg: number;
    }
  ): Promise<{ pdfBlob: Blob; groupId: string; ipfsHash: string }> {
    try {
      const groupName = this.generateGroupName(
        batchData.farmerName,
        batchData.cropType,
        batchData.variety
      );
      
      const groupId = await this.createGroup(groupName);
      const pdfBlob = await this.createHarvestPDF(batchData, groupId, groupName);

      const fileName = `harvest_certificate_${batchData.batchId}_${Date.now()}.pdf`;
      const metadata = {
        keyvalues: {
          batchId: batchData.batchId,
          transactionType: 'HARVEST',
          from: 'Farm',
          to: batchData.farmerName,
          quantity: batchData.harvestQuantity.toString(),
          price: (batchData.harvestQuantity * batchData.pricePerKg).toString(),
          timestamp: new Date().toISOString(),
          cropType: batchData.cropType,
          variety: batchData.variety,
          type: 'certificate',
          groupId: groupId,
          groupName: groupName,
          farmerName: batchData.farmerName
        }
      };

      const ipfsHash = await this.uploadFileToGroup(groupId, pdfBlob, fileName, metadata);
      
      return { pdfBlob, groupId, ipfsHash };
    } catch (error) {
      console.error('Error uploading harvest certificate:', error);
      throw new Error('Failed to upload harvest certificate');
    }
  }

  /**
   * Upload purchase certificate to existing group
   */
  public async uploadPurchaseCertificate(
    groupId: string,
    purchaseData: {
      batchId: string;
      from: string;
      to: string;
      quantity: number;
      pricePerKg: number;
      timestamp: string;
    }
  ): Promise<{ pdfBlob: Blob; ipfsHash: string }> {
    try {
      const pdfBlob = await this.createPurchasePDF(purchaseData, groupId);

      const fileName = `purchase_certificate_${purchaseData.batchId}_${Date.now()}.pdf`;
      const metadata = {
        keyvalues: {
          batchId: purchaseData.batchId,
          transactionType: 'PURCHASE',
          from: purchaseData.from,
          to: purchaseData.to,
          quantity: purchaseData.quantity.toString(),
          price: (purchaseData.quantity * purchaseData.pricePerKg).toString(),
          timestamp: purchaseData.timestamp,
          type: 'certificate',
          groupId: groupId,
          farmerName: purchaseData.from,
          buyerName: purchaseData.to
        }
      };

      const ipfsHash = await this.uploadFileToGroup(groupId, pdfBlob, fileName, metadata);
      
      return { pdfBlob, ipfsHash };
    } catch (error) {
      console.error('Error uploading purchase certificate:', error);
      throw new Error('Failed to upload purchase certificate');
    }
  }

  /**
   * Get group information
   */
  public async getGroupInfo(groupId: string): Promise<any> {
    try {
      const response = await fetch(`https://api.pinata.cloud/v3/groups/public/${groupId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PINATA_CONFIG.jwt}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.data || data;
      } else {
        throw new Error(`Failed to get group info: ${response.status}`);
      }
    } catch (error) {
      console.error('Error getting group info:', error);
      throw error;
    }
  }

  /**
   * Get group certificates from database with Pinata fallback
   */
  public async getGroupCertificates(groupId: string): Promise<any[]> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data: certificates, error } = await supabase
        .from('group_files')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });

      if (!error && certificates && certificates.length > 0) {
        return certificates.map(cert => ({
          ipfs_pin_hash: cert.ipfs_hash,
          metadata: {
            name: cert.file_name,
            keyvalues: {
              transactionType: cert.transaction_type,
              batchId: cert.batch_id,
              groupId: cert.group_id,
              ...(cert.metadata ? JSON.parse(cert.metadata) : {})
            }
          },
          date_pinned: cert.created_at,
          size: cert.file_size
        }));
      }

      return await this.getGroupCertificatesFromPinata(groupId);
    } catch (error) {
      console.error('Error getting group certificates:', error);
      return await this.getGroupCertificatesFromPinata(groupId);
    }
  }

  /**
   * Get group certificates from Pinata API
   */
  private async getGroupCertificatesFromPinata(groupId: string): Promise<any[]> {
    try {
      const groupResponse = await fetch(`https://api.pinata.cloud/v3/groups/public/${groupId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PINATA_CONFIG.jwt}`
        }
      });

      if (groupResponse.ok) {
        const groupData = await groupResponse.json();
        
        if (groupData.data?.files?.length > 0) {
          return groupData.data.files.map((file: any) => ({
            ipfs_pin_hash: file.cid || file.ipfs_pin_hash,
            metadata: {
              name: file.name || file.file_name,
              keyvalues: {
                transactionType: 'HARVEST',
                groupId: groupId
              }
            },
            date_pinned: file.created_at || file.date_pinned,
            size: file.size || 0
          }));
        }
      }

      return [];
    } catch (error) {
      console.error('Error fetching certificates from Pinata:', error);
      return [];
    }
  }

  /**
   * Create harvest PDF
   */
  private async createHarvestPDF(
    batchData: any,
    groupId: string,
    groupName: string
  ): Promise<Blob> {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF();
    
    pdf.setFontSize(20);
    pdf.text('AGRITRACE HARVEST CERTIFICATE', 20, 30);
    
    pdf.setFontSize(12);
    pdf.text(`Batch ID: ${batchData.batchId}`, 20, 50);
    pdf.text(`Farmer: ${batchData.farmerName}`, 20, 60);
    pdf.text(`Crop: ${batchData.cropType} - ${batchData.variety}`, 20, 70);
    pdf.text(`Quantity: ${batchData.harvestQuantity} kg`, 20, 80);
    pdf.text(`Harvest Date: ${batchData.harvestDate}`, 20, 90);
    pdf.text(`Grading: ${batchData.grading}`, 20, 100);
    pdf.text(`Group ID: ${groupId}`, 20, 110);
    pdf.text(`Generated: ${new Date().toISOString()}`, 20, 120);
    
    return pdf.output('blob');
  }

  /**
   * Create purchase PDF
   */
  private async createPurchasePDF(
    purchaseData: any,
    groupId: string
  ): Promise<Blob> {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF();
    
    pdf.setFontSize(20);
    pdf.text('AGRITRACE PURCHASE CERTIFICATE', 20, 30);
    
    pdf.setFontSize(12);
    pdf.text(`Batch ID: ${purchaseData.batchId}`, 20, 50);
    pdf.text(`From: ${purchaseData.from}`, 20, 60);
    pdf.text(`To: ${purchaseData.to}`, 20, 70);
    pdf.text(`Quantity: ${purchaseData.quantity} kg`, 20, 80);
    pdf.text(`Price: ₹${purchaseData.pricePerKg}/kg`, 20, 90);
    pdf.text(`Total: ₹${purchaseData.quantity * purchaseData.pricePerKg}`, 20, 100);
    pdf.text(`Group ID: ${groupId}`, 20, 110);
    pdf.text(`Generated: ${new Date().toISOString()}`, 20, 120);
    
    return pdf.output('blob');
  }

  /**
   * Store file reference in database
   */
  private async storeFileReference(
    groupId: string, 
    fileName: string, 
    ipfsHash: string, 
    fileSize: number, 
    metadata: any
  ): Promise<void> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const fileData = {
        group_id: groupId,
        file_name: fileName,
        ipfs_hash: ipfsHash,
        file_size: fileSize,
        transaction_type: metadata?.keyvalues?.transactionType || 'UNKNOWN',
        batch_id: metadata?.keyvalues?.batchId || null,
        metadata: JSON.stringify(metadata),
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('group_files')
        .insert(fileData);

      if (error) {
        console.warn('Failed to store file reference in database:', error);
      }
    } catch (error) {
      console.warn('Error storing file reference:', error);
    }
  }

  /**
   * Get certificate URL
   */
  public getCertificateUrl(ipfsHash: string): string {
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  }

  /**
   * Get group verification URL
   */
  public getGroupVerificationUrl(groupId: string): string {
    return `https://gateway.pinata.cloud/ipfs/${groupId}`;
  }
}

// Export singleton instance
export const pinataGroupManager = PinataGroupManager.getInstance();

