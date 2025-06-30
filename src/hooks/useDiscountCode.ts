
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useDiscountCode = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateDiscountCode = async (code: string) => {
    if (!code.trim()) return null;

    setIsLoading(true);
    
    try {
      const { data: discountData, error } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !discountData) {
        return null;
      }

      // Check usage limit
      if (discountData.usage_limit && discountData.times_used >= discountData.usage_limit) {
        return null;
      }

      // Check validity dates
      const now = new Date();
      if (discountData.valid_from && new Date(discountData.valid_from) > now) {
        return null;
      }

      if (discountData.valid_until && new Date(discountData.valid_until) < now) {
        return null;
      }

      return discountData;
    } catch (error) {
      console.error('Error validating discount code:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateDiscountUsage = async (discountId: string, currentUsage: number) => {
    try {
      const { error } = await supabase
        .from('discount_codes')
        .update({ 
          times_used: currentUsage + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', discountId);

      if (error) {
        console.error('Error updating discount usage:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error updating discount usage:', error);
      return false;
    }
  };

  return {
    validateDiscountCode,
    updateDiscountUsage,
    isLoading
  };
};
