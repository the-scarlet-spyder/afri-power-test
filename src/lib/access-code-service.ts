
import { supabase } from './supabase';
import { toast } from '@/components/ui/use-toast';

// Check if user has a valid access code
export const checkUserHasValidCode = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('has_valid_access_code', {
      _user_id: userId
    });

    if (error) {
      console.error('Error checking access code validity:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking access code:', error);
    return false;
  }
};

// Verify an access code and assign it to the user
export const verifyAccessCode = async (code: string, userId: string) => {
  try {
    // Clean up the code (remove spaces, dashes, etc.)
    const cleanCode = code.replace(/\s+/g, '').trim();
    
    // Call the RPC function to verify and assign the code
    const { data, error } = await supabase.rpc('verify_access_code', {
      _code: cleanCode,
      _user_id: userId
    });

    if (error) {
      console.error('Error verifying access code:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    console.error('Error in access code verification:', error);
    throw new Error(error.message || 'Failed to verify access code');
  }
};

// Generate random access codes
export const generateAccessCodes = async (
  count: number, 
  batchName: string | null = null, 
  adminId: string
): Promise<string[]> => {
  try {
    const codes: string[] = [];
    const codeLength = 8;
    
    // Generate codes
    for (let i = 0; i < count; i++) {
      // Generate random 8-digit number
      const code = Math.floor(10000000 + Math.random() * 90000000).toString();
      codes.push(code);
      
      // Insert into database
      const { error } = await supabase
        .from('access_codes')
        .insert({
          code,
          batch_name: batchName,
          created_by: adminId
        });
        
      if (error) {
        console.error('Error creating access code:', error);
        throw error;
      }
    }
    
    return codes;
  } catch (error) {
    console.error('Error generating access codes:', error);
    throw error;
  }
};

// Get all access codes (admin only)
export const getAllAccessCodes = async () => {
  try {
    const { data, error } = await supabase
      .from('access_codes')
      .select('*, assigned_to:assigned_to(email)')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching access codes:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to fetch access codes:', error);
    throw error;
  }
};

// Check if user is admin
export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('has_role', {
      _user_id: userId,
      _role: 'admin'
    });

    if (error) {
      console.error('Error checking admin role:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};
