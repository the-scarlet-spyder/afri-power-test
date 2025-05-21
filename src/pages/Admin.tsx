import React, { useState, useEffect, useRef } from 'react';
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
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import AdminCertificate from '@/components/admin/AdminCertificate';
import CertificateGenerator from '@/components/admin/CertificateGenerator';
import { generateCertificatePDFData } from '@/lib/test-service';

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
  const [generatingPdf, setGeneratingPdf] = useState<{[key: string]: boolean}>({});
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Create an invisible div to render certificates for PDF generation
  const certificateRef = useRef<HTMLDivElement>(null);
  const [currentCertData, setCurrentCertData] = useState<any>(null);
  const [certRenderError, setCertRenderError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is loaded yet
    if (user === undefined) {
      return; // Wait for user to be loaded
    }
    
    const checkAdminAccess = async () => {
      if (!user) {
        console.log("No user found, redirecting to login");
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
    try {
      setIsLoading(true);
      console.log("Fetching test results...");
      
      // Fetch all test results
      const { data: results, error } = await supabase
        .from('test_results')
        .select('*')
        .order('test_date', { ascending: false });

      if (error) {
        console.error("Error fetching test results:", error);
        throw error;
      }

      console.log("Test results fetched:", results?.length || 0);

      // Get user emails for each result
      if (results && results.length > 0) {
        const resultsWithUserInfo = await Promise.all(
          results.map(async (result) => {
            try {
              const { data: userData, error: userError } = await supabase
                .from('profiles')
                .select('email, name')
                .eq('user_id', result.user_id)
                .single();

              if (userError) {
                console.error("Error fetching user data:", userError);
                return {
                  ...result,
                  user_email: 'Unknown',
                  user_name: 'Unknown'
                };
              }

              return {
                ...result,
                user_email: userData?.email || 'Unknown',
                user_name: userData?.name || 'Unknown'
              };
            } catch (err) {
              console.error("Error processing user data for result:", err);
              return {
                ...result,
                user_email: 'Error',
                user_name: 'Error'
              };
            }
          })
        );

        console.log("Results with user info:", resultsWithUserInfo.length);
        setTestResults(resultsWithUserInfo);
      } else {
        setTestResults([]);
      }
    } catch (error) {
      console.error('Error in fetchTestResults:', error);
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
    try {
      setIsLoading(true);
      console.log("Fetching certificates...");
      
      // Fetch all certificates
      const { data: certs, error } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching certificates:", error);
        throw error;
      }

      console.log("Certificates fetched:", certs?.length || 0);

      // Get user emails for each certificate
      if (certs && certs.length > 0) {
        const certsWithUserInfo = await Promise.all(
          certs.map(async (cert) => {
            try {
              const { data: userData, error: userError } = await supabase
                .from('profiles')
                .select('email, name')
                .eq('user_id', cert.user_id)
                .single();

              if (userError) {
                console.error("Error fetching user data for cert:", userError);
                return {
                  ...cert,
                  user_email: 'Unknown',
                  user_name: 'Unknown'
                };
              }

              return {
                ...cert,
                user_email: userData?.email || 'Unknown',
                user_name: userData?.name || 'Unknown'
              };
            } catch (err) {
              console.error("Error processing user data for certificate:", err);
              return {
                ...cert,
                user_email: 'Error',
                user_name: 'Error'
              };
            }
          })
        );

        console.log("Certificates with user info:", certsWithUserInfo.length);
        setCertificates(certsWithUserInfo);
      } else {
        setCertificates([]);
      }
    } catch (error) {
      console.error('Error in fetchCertificates:', error);
      toast({
        title: "Error",
        description: "Failed to load certificates.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCertificateAsPDF = async (certificateId: string) => {
    setGeneratingPdf(prev => ({ ...prev, [certificateId]: true }));
    setCertRenderError(null);
    
    try {
      console.log("Generating PDF for certificate:", certificateId);
      const certData = await generateCertificatePDFData(certificateId);
      if (!certData) {
        throw new Error('Failed to get certificate data');
      }
      
      console.log("Certificate data received:", certData);
      
      // Verify the test results data structure
      if (!certData.results || !certData.results.topStrengths) {
        throw new Error('Invalid test results structure in certificate data');
      }
      
      // Set current certificate data to render in the hidden div
      setCurrentCertData({
        userName: certData.certificate.name_on_certificate,
        results: certData.results,
        date: format(new Date(certData.certificate.created_at), 'MMMM d, yyyy'),
        certificateId: certData.certificate.certificate_id
      });
      
      // Wait for the certificate to render
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (!certificateRef.current) {
        throw new Error('Certificate element not found in the DOM');
      }

      // Verify the certificate content is rendered
      const certElement = certificateRef.current;
      if (!certElement || !certElement.innerHTML) {
        throw new Error('Certificate content element not found or empty');
      }

      console.log("Certificate DOM element found, generating canvas");
      
      // Generate canvas from the rendered certificate
      const canvas = await html2canvas(certElement, {
        scale: 2, // Higher resolution
        logging: true, // Enable logging for debugging
        useCORS: true,
        allowTaint: true,
        ignoreElements: (element) => element.tagName === 'IFRAME',
        onclone: (clonedDoc) => {
          // Verify the certificate content was properly cloned
          const clonedElement = clonedDoc.querySelector('[data-certificate]');
          if (!clonedElement || !clonedElement.innerHTML) {
            throw new Error('Certificate content not found in cloned document');
          }
        }
      });
      
      console.log("Canvas generated successfully");
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      
      // Download the PDF
      pdf.save(`Strength-Certificate-${certificateId}.pdf`);
      
      toast({
        title: "Certificate Downloaded",
        description: "Certificate PDF has been generated successfully.",
      });
    } catch (error) {
      console.error('Error downloading certificate:', error);
      setCertRenderError(`${error.message}`);
      toast({
        title: "Download Failed",
        description: `There was an issue generating the certificate PDF: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setGeneratingPdf(prev => ({ ...prev, [certificateId]: false }));
      }, 1500);
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

  if (user === undefined) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow container mx-auto py-8 px-4 flex items-center justify-center">
          <div className="space-y-4 w-full max-w-md">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="test-results">Test Results</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
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
                        <TableHead>Actions</TableHead>
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
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1"
                              onClick={() => downloadCertificateAsPDF(cert.certificate_id)}
                              disabled={generatingPdf[cert.certificate_id]}
                            >
                              {generatingPdf[cert.certificate_id] ? 
                                'Generating...' : 
                                <>
                                  <Download size={16} />
                                  PDF
                                </>
                              }
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tools">
            <CertificateGenerator />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Hidden certificate for PDF generation */}
      <div style={{ 
        position: 'fixed', 
        left: '-9999px', 
        top: 0, 
        width: '210mm', // A4 width
        height: '297mm', // A4 height
        backgroundColor: 'white',
        overflow: 'hidden',
        zIndex: -1
      }}>
        {currentCertData && (
          <div ref={certificateRef} className="certificate-content" style={{ display: 'block' }}>
            <AdminCertificate 
              userName={currentCertData.userName}
              results={currentCertData.results}
              date={currentCertData.date}
              certificateId={currentCertData.certificateId}
            />
          </div>
        )}
      </div>
      
      {certRenderError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="text-sm">Rendering error: {certRenderError}</p>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Admin;
