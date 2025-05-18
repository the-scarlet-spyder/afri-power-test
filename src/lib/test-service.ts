
import { supabase } from './supabase';
import { UserResponse, UserResult, CategoryResult } from '@/models/strength';
import { toast } from '@/components/ui/use-toast';

// Save test results to Supabase
export const saveTestResults = async (
  userId: string, 
  responses: UserResponse[], 
  results: UserResult,
  categoryResults: CategoryResult[]
) => {
  console.log("Saving test results for user:", userId);
  try {
    const { data, error } = await supabase
      .from('test_results')
      .insert({
        user_id: userId,
        test_date: new Date().toISOString(),
        responses: JSON.stringify(responses),
        results: JSON.stringify({
          results,
          categoryResults
        })
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error saving test results:', error);
      throw error;
    }

    console.log("Test results saved successfully, ID:", data?.id);
    return data;
  } catch (error) {
    console.error('Error saving test results:', error);
    // Fall back to localStorage if Supabase fails
    localStorage.setItem('strengths_responses', JSON.stringify(responses));
    localStorage.setItem('strengths_results', JSON.stringify(results));
    localStorage.setItem('strengths_category_results', JSON.stringify(categoryResults));
    throw error;
  }
};

// Get latest test result for a user
export const getLatestTestResult = async (userId: string) => {
  console.log("Fetching latest test result for user:", userId);
  try {
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching test results:', error);
      throw error;
    }

    console.log("Latest test result found:", !!data);
    return data ? {
      responses: JSON.parse(data.responses),
      results: JSON.parse(data.results).results,
      categoryResults: JSON.parse(data.results).categoryResults,
      testDate: data.test_date
    } : null;
  } catch (error) {
    console.error('Error fetching test results:', error);
    // Fall back to localStorage if Supabase fails
    const storedResults = localStorage.getItem('strengths_results');
    const storedCategoryResults = localStorage.getItem('strengths_category_results');
    const storedResponses = localStorage.getItem('strengths_responses');
    
    if (storedResults && storedCategoryResults) {
      return {
        responses: storedResponses ? JSON.parse(storedResponses) : [],
        results: JSON.parse(storedResults),
        categoryResults: JSON.parse(storedCategoryResults),
        testDate: new Date().toISOString()
      };
    }
    
    return null;
  }
};

// Get all test results for a user
export const getAllTestResults = async (userId: string) => {
  console.log("Fetching all test results for user:", userId);
  try {
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all test results:', error);
      throw error;
    }

    console.log(`Found ${data?.length || 0} test results for user: ${userId}`);
    
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.map(item => {
      try {
        const parsedResults = JSON.parse(item.results);
        return {
          id: item.id,
          responses: JSON.parse(item.responses),
          results: parsedResults.results,
          categoryResults: parsedResults.categoryResults,
          testDate: item.test_date
        };
      } catch (parseError) {
        console.error('Error parsing test result:', parseError);
        throw new Error(`Failed to parse test result with ID ${item.id}`);
      }
    });
  } catch (error) {
    console.error('Error fetching all test results:', error);
    toast({
      title: "Error",
      description: "Failed to fetch test history. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

// Save certificate
export const saveCertificate = async (
  userId: string,
  testResultId: string,
  nameOnCertificate: string,
  certificateId: string
) => {
  console.log("Saving certificate:", {
    userId,
    testResultId,
    nameOnCertificate,
    certificateId
  });
  
  try {
    // Check if this certificate already exists to avoid duplicates
    const { data: existingCert, error: checkError } = await supabase
      .from('certificates')
      .select('id')
      .eq('user_id', userId)
      .eq('test_result_id', testResultId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking for existing certificate:', checkError);
      throw checkError;
    }

    if (existingCert) {
      console.log("Certificate already exists for this test result:", existingCert.id);
      return existingCert;
    }

    // Insert the new certificate
    const { data, error } = await supabase
      .from('certificates')
      .insert({
        user_id: userId,
        test_result_id: testResultId,
        name_on_certificate: nameOnCertificate,
        certificate_id: certificateId,
        verified: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving certificate:', error);
      throw error;
    }

    console.log("Certificate saved successfully:", data);
    return data;
  } catch (error) {
    console.error('Error saving certificate:', error);
    toast({
      title: "Error",
      description: "Failed to save your certificate. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

// Get all certificates for a user
export const getUserCertificates = async (userId: string) => {
  console.log("Fetching certificates for user ID:", userId);
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error in getUserCertificates:", error);
      throw error;
    }

    console.log("Certificates found:", data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error fetching certificates:', error);
    toast({
      title: "Error",
      description: "Failed to fetch your certificates. Please try again.",
      variant: "destructive",
    });
    return [];
  }
};

// Verify a certificate by ID
export const verifyCertificate = async (certificateId: string) => {
  console.log("Verifying certificate:", certificateId);
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*, test_results(*)')
      .eq('certificate_id', certificateId)
      .maybeSingle();

    if (error) {
      console.error('Error verifying certificate:', error);
      throw error;
    }

    console.log("Certificate verification result:", !!data);
    return data;
  } catch (error) {
    console.error('Error verifying certificate:', error);
    toast({
      title: "Error",
      description: "Failed to verify the certificate. Please check the ID and try again.",
      variant: "destructive",
    });
    return null;
  }
};

// Generate certificate PDF data
export const generateCertificatePDFData = async (certificateId: string) => {
  console.log("Generating PDF data for certificate:", certificateId);
  try {
    // Get the certificate and associated test result data
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        test_results(*)
      `)
      .eq('certificate_id', certificateId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching certificate data for PDF:', error);
      throw new Error(`Error fetching certificate: ${error.message}`);
    }

    if (!data) {
      console.error('Certificate not found:', certificateId);
      throw new Error('Certificate not found');
    }
    
    if (!data.test_results || !data.test_results.results) {
      console.error('Test results missing for certificate:', certificateId);
      throw new Error('Test results missing for this certificate');
    }
    
    try {
      const parsedResults = JSON.parse(data.test_results.results);
      
      if (!parsedResults.results || !parsedResults.results.topStrengths) {
        console.error('Invalid results structure in certificate data:', parsedResults);
        throw new Error('Invalid strength data structure');
      }
      
      console.log("PDF data generated successfully");
      return {
        certificate: data,
        testResult: data.test_results,
        results: parsedResults.results,
      };
    } catch (parseError) {
      console.error('Error parsing results JSON:', parseError, data.test_results.results);
      throw new Error('Error parsing certificate data');
    }
  } catch (error) {
    console.error('Error generating certificate PDF data:', error);
    toast({
      title: "Error",
      description: "Failed to generate the certificate PDF. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};
