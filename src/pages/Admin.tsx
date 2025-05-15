
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// Admin emails that are allowed to access this page
const ADMIN_EMAILS = ['adrian.m.adepoju@gmail.com']; // Make sure your email is correctly listed here

interface TestResult {
  id: string;
  user_id: string;
  test_date: string;
  responses: string;
  results: string;
  user_email?: string;
  user_name?: string;
}

interface Certificate {
  id: string;
  user_id: string;
  test_result_id: string;
  created_at: string;
  name_on_certificate: string;
  certificate_id: string;
  verified: boolean;
  user_email?: string;
  user_name?: string;
}

const Admin = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('test-results');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) {
        toast({
          title: "Access denied",
          description: "You need to be logged in to access this page.",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      console.log("Checking admin access for user:", user.email);
      console.log("Admin emails:", ADMIN_EMAILS);
      console.log("Is admin?", ADMIN_EMAILS.includes(user.email));

      if (!ADMIN_EMAILS.includes(user.email)) {
        toast({
          title: "Access denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      // If user is admin, fetch data
      fetchTestResults();
      fetchCertificates();
    };

    checkAdminAccess();
  }, [user, navigate, toast]);

  const fetchTestResults = async () => {
    setIsLoading(true);
    try {
      // Fetch all test results
      const { data: results, error } = await supabase
        .from('test_results')
        .select('*')
        .order('test_date', { ascending: false });

      if (error) throw error;

      // Get user emails for each result
      if (results && results.length > 0) {
        const resultsWithUserInfo = await Promise.all(
          results.map(async (result) => {
            const { data: userData } = await supabase
              .from('profiles')
              .select('email, name')
              .eq('user_id', result.user_id)
              .single();

            return {
              ...result,
              user_email: userData?.email || 'Unknown',
              user_name: userData?.name || 'Unknown'
            };
          })
        );

        setTestResults(resultsWithUserInfo);
      } else {
        setTestResults([]);
      }
    } catch (error) {
      console.error('Error fetching test results:', error);
      toast({
        title: "Error",
        description: "Failed to load test results.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCertificates = async () => {
    setIsLoading(true);
    try {
      // Fetch all certificates
      const { data: certs, error } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user emails for each certificate
      if (certs && certs.length > 0) {
        const certsWithUserInfo = await Promise.all(
          certs.map(async (cert) => {
            const { data: userData } = await supabase
              .from('profiles')
              .select('email, name')
              .eq('user_id', cert.user_id)
              .single();

            return {
              ...cert,
              user_email: userData?.email || 'Unknown',
              user_name: userData?.name || 'Unknown'
            };
          })
        );

        setCertificates(certsWithUserInfo);
      } else {
        setCertificates([]);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast({
        title: "Error",
        description: "Failed to load certificates.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const parseJson = (jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      return { error: 'Invalid JSON' };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 text-center mb-8">
          View and manage test results and certificates
        </p>
        
        <Tabs 
          defaultValue="test-results" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="test-results">Test Results</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="test-results">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">All Test Results</h2>
              <Separator className="mb-4" />
              
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading test results...</p>
                </div>
              ) : testResults.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No test results found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>A list of all test results.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Test Date</TableHead>
                        <TableHead>Top Strengths</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testResults.map((result) => {
                        const parsedResults = parseJson(result.results);
                        const topStrengths = parsedResults?.results?.topStrengths || [];
                        
                        return (
                          <TableRow key={result.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{result.user_name}</p>
                                <p className="text-sm text-gray-500">{result.user_email}</p>
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(result.test_date)}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {topStrengths.slice(0, 3).map((strength: any, i: number) => (
                                  <Badge key={i} variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                                    {strength.strength.name}
                                  </Badge>
                                ))}
                                {topStrengths.length > 3 && (
                                  <Badge variant="outline" className="bg-gray-100">
                                    +{topStrengths.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="certificates">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">All Certificates</h2>
              <Separator className="mb-4" />
              
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading certificates...</p>
                </div>
              ) : certificates.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No certificates found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>A list of all certificates.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Name on Certificate</TableHead>
                        <TableHead>Certificate ID</TableHead>
                        <TableHead>Created Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {certificates.map((cert) => (
                        <TableRow key={cert.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{cert.user_name}</p>
                              <p className="text-sm text-gray-500">{cert.user_email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{cert.name_on_certificate}</TableCell>
                          <TableCell>
                            <code className="px-2 py-1 bg-gray-100 rounded text-sm">
                              {cert.certificate_id}
                            </code>
                          </TableCell>
                          <TableCell>{formatDate(cert.created_at)}</TableCell>
                          <TableCell>
                            {cert.verified ? (
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                Verified
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
