
import { supabase } from './supabase';
import { UserResponse, UserResult, CategoryResult } from '@/models/strength';
import { useAuth } from '@/context/AuthContext';

// Save test results to Supabase
export const saveTestResults = async (
  userId: string, 
  responses: UserResponse[], 
  results: UserResult,
  categoryResults: CategoryResult[]
) => {
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
      throw error;
    }

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

// Get latest test results for a user
export const getLatestTestResult = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      throw error;
    }

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
  try {
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

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
  try {
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
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error saving certificate:', error);
    throw error;
  }
};

// Get all certificates for a user
export const getUserCertificates = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return [];
  }
};

// Verify a certificate by ID
export const verifyCertificate = async (certificateId: string) => {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*, test_results(*)')
      .eq('certificate_id', certificateId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return null;
  }
};
