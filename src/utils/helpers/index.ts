/**
 * Helper Utilities
 * Common helper functions used across the application
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Name Resolution Utility
 * Resolves wallet addresses and emails to proper user names
 */
export class NameResolver {
  private static instance: NameResolver;
  private nameCache: Map<string, string> = new Map();

  private constructor() {}

  public static getInstance(): NameResolver {
    if (!NameResolver.instance) {
      NameResolver.instance = new NameResolver();
    }
    return NameResolver.instance;
  }

  /**
   * Resolve a wallet address or email to a proper name
   */
  public async resolveName(identifier: string): Promise<string> {
    if (this.nameCache.has(identifier)) {
      return this.nameCache.get(identifier)!;
    }

    try {
      if (identifier.startsWith('0x')) {
        const name = await this.resolveWalletAddress(identifier);
        this.nameCache.set(identifier, name);
        return name;
      }

      if (identifier.includes('@')) {
        const name = await this.resolveEmail(identifier);
        this.nameCache.set(identifier, name);
        return name;
      }

      if (identifier.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        const name = await this.resolveProfileId(identifier);
        this.nameCache.set(identifier, name);
        return name;
      }

      if (identifier && !identifier.includes('@') && !identifier.startsWith('0x')) {
        this.nameCache.set(identifier, identifier);
        return identifier;
      }

      const fallbackName = this.getFallbackName(identifier);
      this.nameCache.set(identifier, fallbackName);
      return fallbackName;
    } catch (error) {
      console.error('Error resolving name:', error);
      const fallbackName = this.getFallbackName(identifier);
      this.nameCache.set(identifier, fallbackName);
      return fallbackName;
    }
  }

  private async resolveWalletAddress(walletAddress: string): Promise<string> {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, user_id')
        .eq('wallet_address', walletAddress)
        .single();

      if (profile?.full_name) {
        return profile.full_name;
      }

      return this.getFallbackName(walletAddress);
    } catch (error) {
      console.error('Error resolving wallet address:', error);
      return this.getFallbackName(walletAddress);
    }
  }

  private async resolveEmail(email: string): Promise<string> {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('email', email)
        .single();

      if (profile?.full_name) {
        return profile.full_name;
      }

      const emailName = email.split('@')[0];
      if (emailName && emailName.length > 2) {
        return emailName.charAt(0).toUpperCase() + emailName.slice(1);
      }

      return this.getFallbackName(email);
    } catch (error) {
      console.error('Error resolving email:', error);
      return this.getFallbackName(email);
    }
  }

  private async resolveProfileId(profileId: string): Promise<string> {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', profileId)
        .single();

      if (profile?.full_name) {
        return profile.full_name;
      }

      return this.getFallbackName(profileId);
    } catch (error) {
      console.error('Error resolving profile ID:', error);
      return this.getFallbackName(profileId);
    }
  }

  private getFallbackName(identifier: string): string {
    if (identifier.startsWith('0x')) {
      return `User ${identifier.slice(-4)}`;
    }
    
    if (identifier.includes('@')) {
      const emailName = identifier.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }

    if (identifier === 'Farm' || identifier === 'Farm Location') {
      return 'Farm Location';
    }

    if (identifier === 'Unknown Farmer' || identifier === 'Unknown Buyer' || identifier === 'Unknown Seller') {
      return 'Unknown User';
    }

    return identifier || 'Unknown User';
  }

  public clearCache(): void {
    this.nameCache.clear();
  }

  public getCachedName(identifier: string): string | undefined {
    return this.nameCache.get(identifier);
  }
}

// Export singleton instance
export const nameResolver = NameResolver.getInstance();

