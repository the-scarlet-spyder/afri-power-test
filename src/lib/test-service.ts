
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
    // First, get the active access code used by this user
    const { data: accessCode, error: accessCodeError } = await supabase
      .from('access_codes')
      .select('id')
      .eq('assigned_to', userId)
      .eq('used', true)
      .single();

    if (accessCodeError && accessCodeError.code !== 'PGRST116') {
      console.error('Error fetching access code:', accessCodeError);
      throw accessCodeError;
    }

    // If no access code found, still allow test submission but log the issue
    if (!accessCode) {
      console.warn('No active access code found for user when saving test');
    }

    const { data, error } = await supabase
      .from('test_results')
      .insert({
        user_id: userId,
        test_date: new Date().toISOString(),
        responses: JSON.stringify(responses),
        results: JSON.stringify({
          results,
          categoryResults
        }),
        access_code_id: accessCode?.id || null
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
    localStorage.setItem('inuka_responses', JSON.stringify(responses));
    localStorage.setItem('inuka_results', JSON.stringify(results));
    localStorage.setItem('inuka_category_results', JSON.stringify(categoryResults));
    throw error;
  }
};

// Check if user can take a test with their current access code
export const canTakeTest = async (userId: string) => {
  console.log("Checking if user can take a test:", userId);
  try {
    // Check if user has a valid access code
    const { data: hasCode, error: codeError } = await supabase.rpc('has_valid_access_code', {
      _user_id: userId
    });

    if (codeError) {
      console.error('Error checking access code:', codeError);
      throw codeError;
    }

    if (!hasCode) {
      return { 
        canTake: false, 
        message: "You don't have a valid access code. Please enter a valid code to take the test." 
      };
    }

    // Check if the user has already taken a test with this access code
    const { data: accessCode, error: accessCodeError } = await supabase
      .from('access_codes')
      .select('id')
      .eq('assigned_to', userId)
      .eq('used', true)
      .single();

    if (accessCodeError && accessCodeError.code !== 'PGRST116') {
      console.error('Error fetching access code details:', accessCodeError);
      throw accessCodeError;
    }

    // If no access code found (should never happen if has_valid_access_code returned true)
    if (!accessCode) {
      console.error('Inconsistent state: has_valid_access_code true but no access code found');
      return { 
        canTake: false, 
        message: "There was an error verifying your access code. Please try again." 
      };
    }

    // Check if a test has already been taken with this access code
    const { count, error: testCountError } = await supabase
      .from('test_results')
      .select('id', { count: 'exact' })
      .eq('access_code_id', accessCode.id);

    if (testCountError) {
      console.error('Error checking test count:', testCountError);
      throw testCountError;
    }

    if (count && count > 0) {
      return { 
        canTake: false, 
        message: "You've already taken a test with this access code. Please obtain a new code to take another test." 
      };
    }

    // User has a valid code and hasn't taken a test with it yet
    return { canTake: true, message: "You can take the test." };
  } catch (error) {
    console.error('Error checking test eligibility:', error);
    // Fall back to allowing the test in case of errors
    return { canTake: true, message: "Error checking eligibility, proceeding with test." };
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
      .single();

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
    const storedResults = localStorage.getItem('inuka_results');
    const storedCategoryResults = localStorage.getItem('inuka_category_results');
    const storedResponses = localStorage.getItem('inuka_responses');
    
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
    return data.map(item => ({
      id: item.id,
      responses: JSON.parse(item.responses),
      results: JSON.parse(item.results).results,
      categoryResults: JSON.parse(item.results).categoryResults,
      testDate: item.test_date
    }));
  } catch (error) {
    console.error('Error fetching all test results:', error);
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
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for existing certificate:', checkError);
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
      .single();

    if (error) {
      console.error('Error verifying certificate:', error);
      throw error;
    }

    console.log("Certificate verification result:", !!data);
    return data;
  } catch (error) {
    console.error('Error verifying certificate:', error);
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
      .single();

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
    throw error;
  }
};
