
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { saveCertificate, getLatestTestResult, getAllTestResults } from '@/lib/test-service';
import { supabase } from '@/lib/supabase';

const CertificateGenerator: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{total: number, created: number, errors: number}>({ 
    total: 0, 
    created: 0, 
    errors: 0 
  });
  const { toast } = useToast();

  const generateCertificates = async () => {
    setIsProcessing(true);
    setResults({ total: 0, created: 0, errors: 0 });
    
    try {
      // Get all test results
      const { data: testResults, error: testError } = await supabase
        .from('test_results')
        .select('id, user_id')
        .order('created_at', { ascending: false });
      
      if (testError) throw new Error('Failed to fetch test results');
      
      if (!testResults || testResults.length === 0) {
        toast({
          title: "No test results found",
          description: "There are no test results to generate certificates for.",
        });
        setIsProcessing(false);
        return;
      }

      setResults(prev => ({ ...prev, total: testResults.length }));
      toast({
        title: "Processing started",
        description: `Found ${testResults.length} test results. Starting certificate generation...`,
      });
      
      // Process each result
      for (const result of testResults) {
        try {
          // Check if a certificate already exists for this test
          const { data: existingCert } = await supabase
            .from('certificates')
            .select('id')
            .eq('test_result_id', result.id)
            .maybeSingle();
            
          if (existingCert) {
            // Skip this one, certificate already exists
            continue;
          }
          
          // Get user's name from profiles
          const { data: userData } = await supabase
            .from('profiles')
            .select('name, email')
            .eq('user_id', result.user_id)
            .single();
          
          // Generate a certificate ID
          const certificateId = `SA-${Math.floor(100000 + Math.random() * 900000)}`;
          
          // Use the user's name or their email prefix as fallback
          let nameOnCertificate = userData?.name || '';
          if (!nameOnCertificate && userData?.email) {
            nameOnCertificate = userData.email.split('@')[0] || 'User';
            // Capitalize and replace dots/underscores with spaces
            nameOnCertificate = nameOnCertificate
              .replace(/[._]/g, ' ')
              .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
          }
          
          if (!nameOnCertificate) nameOnCertificate = "Unnamed User";
          
          // Save the certificate
          await saveCertificate(
            result.user_id,
            result.id,
            nameOnCertificate,
            certificateId
          );
          
          // Increment success counter
          setResults(prev => ({ ...prev, created: prev.created + 1 }));
          
        } catch (error) {
          console.error("Error processing test result:", error);
          setResults(prev => ({ ...prev, errors: prev.errors + 1 }));
        }
      }
      
      toast({
        title: "Certificate generation complete",
        description: `Created ${results.created} certificates with ${results.errors} errors.`,
      });
      
    } catch (error) {
      console.error("Error generating certificates:", error);
      toast({
        title: "Error generating certificates",
        description: "An unexpected error occurred. Check the console for details.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Certificate Generator</CardTitle>
        <CardDescription>
          Generate certificates for all test results that don't have one yet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {(results.created > 0 || results.errors > 0) && (
            <Alert className={results.errors > 0 ? "bg-amber-50" : "bg-green-50"}>
              <AlertTitle>Generation Results</AlertTitle>
              <AlertDescription>
                Processed {results.created + results.errors} of {results.total} test results.<br/>
                Successfully created {results.created} certificates.
                {results.errors > 0 && (
                  <span className="text-red-600"> Encountered {results.errors} errors.</span>
                )}
              </AlertDescription>
            </Alert>
          )}
          
          <Button 
            onClick={generateCertificates}
            disabled={isProcessing}
            className="w-full md:w-auto"
          >
            {isProcessing ? "Processing..." : "Generate Missing Certificates"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificateGenerator;
