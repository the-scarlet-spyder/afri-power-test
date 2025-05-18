
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { verifyCertificate } from '@/lib/test-service';
import { format } from 'date-fns';
import { Certificate as CertificateType } from '@/lib/database.types';

type VerifiedCertificate = CertificateType & {
  test_results: {
    results: string;
    test_date: string;
  }
}

const VerifyCertificate = () => {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState<VerifiedCertificate | null>(null);
  const [searchId, setSearchId] = useState(certificateId || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  React.useEffect(() => {
    if (certificateId) {
      handleVerify(certificateId);
    }
  }, [certificateId]);
  
  const handleVerify = async (id: string) => {
    setIsVerifying(true);
    try {
      const certData = await verifyCertificate(id);
      if (!certData) {
        toast({
          title: "Certificate not found",
          description: "The certificate ID you provided could not be verified.",
          variant: "destructive",
        });
        setCertificate(null);
        return;
      }
      
      setCertificate(certData as VerifiedCertificate);
      
      // Parse test results
      if (certData.test_results?.results) {
        try {
          const parsedResults = JSON.parse(certData.test_results.results);
          setResults(parsedResults.results);
        } catch (e) {
          console.error("Error parsing results:", e);
        }
      }
      
      toast({
        title: "Certificate verified",
        description: "This certificate is authentic and has been verified.",
      });
    } catch (error) {
      console.error("Error verifying certificate:", error);
      toast({
        title: "Verification failed",
        description: "Could not verify this certificate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return 'Date unavailable';
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9] font-inter">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="inuka-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-inuka-crimson mb-6 font-poppins text-center">
              Certificate Verification
            </h1>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Verify a Strength Africa Certificate</CardTitle>
                <CardDescription>Enter the certificate ID to verify its authenticity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input 
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="Certificate ID (e.g., SA-123456)"
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => handleVerify(searchId)}
                    disabled={isVerifying || !searchId.trim()}
                    className="bg-inuka-crimson hover:bg-opacity-90 whitespace-nowrap"
                  >
                    {isVerifying ? "Verifying..." : "Verify Certificate"}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {certificate && (
              <Card className="mb-8 border-2 border-green-500">
                <CardHeader className="bg-green-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-green-800">✓ Certificate Verified</CardTitle>
                      <CardDescription>This is an authentic Strength Africa certificate</CardDescription>
                    </div>
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                      Valid
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Certificate Details</h3>
                      <ul className="space-y-2 text-sm">
                        <li><span className="text-gray-500">Certificate ID:</span> {certificate.certificate_id}</li>
                        <li><span className="text-gray-500">Issued to:</span> {certificate.name_on_certificate}</li>
                        <li><span className="text-gray-500">Issue Date:</span> {formatDate(certificate.created_at)}</li>
                        <li><span className="text-gray-500">Test Date:</span> {formatDate(certificate.test_results.test_date)}</li>
                      </ul>
                    </div>
                    
                    {results && (
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">Top 5 Strengths</h3>
                        <ul className="space-y-1">
                          {results.topStrengths.map((item: any, index: number) => (
                            <li key={index} className="flex items-center">
                              <span className="w-5 h-5 rounded-full bg-inuka-crimson text-white flex items-center justify-center text-xs mr-2">{index + 1}</span>
                              <span>{item.strength.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VerifyCertificate;
