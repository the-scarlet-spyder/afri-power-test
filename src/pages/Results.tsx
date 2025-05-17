
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTest } from '@/context/TestContext';
import { useAuth } from '@/context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import Certificate from '@/components/Certificate';
import { format } from 'date-fns';
import { saveCertificate } from '@/lib/test-service';

// Import new components
import ResultsTopStrengths from '@/components/results/ResultsTopStrengths';
import ResultsByCategory from '@/components/results/ResultsByCategory';
import NextSteps from '@/components/results/NextSteps';
import CertificateDownload from '@/components/results/CertificateDownload';

// Import utility functions
import { 
  getCategoryCardClass, 
  getCategoryBadgeClass, 
  getCategoryColor 
} from '@/utils/styleUtils';
import { generateCertificatePDF } from '@/utils/certificatePDFGenerator';

const Results = () => {
  const { results, categoryResults, resetTest, getCategoryName, testHistory } = useTest();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const testId = searchParams.get('test');
  const [userName, setUserName] = useState<string>("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [certificateId, setCertificateId] = useState<string>("");
  const certificateRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!results && !testHistory) {
      const storedResults = localStorage.getItem('inuka_results');
      if (!storedResults) {
        navigate('/test');
      }
    }
    
    // Try to get user's name from localStorage or logged in user
    if (user) {
      setUserName(user.name);
    } else {
      const storedName = localStorage.getItem('user_name');
      if (storedName) {
        setUserName(storedName);
      }
    }
    
    // Generate a certificate ID
    setCertificateId(generateCertificateId());
  }, [results, navigate, user, testHistory]);
  
  const handleRetake = () => {
    resetTest();
    navigate('/test');
  };

  // Function to generate a unique certificate ID
  const generateCertificateId = () => {
    return `SA-${Math.floor(100000 + Math.random() * 900000)}`;
  };

  // Function to download the certificate as PDF
  const downloadPDF = async () => {
    if (!certificateRef.current || !results) {
      toast({
        title: "Error",
        description: "Please make sure you have completed the test and entered your name.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGeneratingPDF(true);
    toast({
      title: "Generating your certificate",
      description: "Please wait while we prepare your PDF certificate...",
    });
    
    try {
      await generateCertificatePDF(
        userName,
        results,
        certificateId,
        () => {
          handleSaveCertificate();
          toast({
            title: "Certificate Downloaded",
            description: "Your certificate has been successfully downloaded.",
          });
          setIsGeneratingPDF(false);
          if (certificateRef.current) {
            certificateRef.current.style.display = 'none';
          }
        },
        (error) => {
          console.error("Error generating PDF:", error);
          toast({
            title: "Error generating certificate",
            description: "There was a problem creating your PDF. Please try again.",
            variant: "destructive",
          });
          setIsGeneratingPDF(false);
        }
      );
    } catch (error) {
      console.error("Error in PDF generation:", error);
      setIsGeneratingPDF(false);
      toast({
        title: "Error generating certificate",
        description: "There was a problem creating your PDF. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Function to save certificate to database
  const handleSaveCertificate = async () => {
    if (user) {
      try {
        // Get the current test result ID - either from URL params or the most recent test
        const currentTestId = testId || (testHistory && testHistory.length > 0 ? testHistory[0].id : '');
        
        if (currentTestId) {
          console.log("Saving certificate with test ID:", currentTestId);
          
          const savedCert = await saveCertificate(
            user.id,
            currentTestId,
            userName,
            certificateId
          );
          
          if (savedCert) {
            console.log("Certificate saved successfully with ID:", savedCert.id);
            
            toast({
              title: "Certificate saved",
              description: "Your certificate has been saved to your account.",
            });
          } else {
            console.error("No data returned from saveCertificate");
          }
        } else {
          console.error("No test ID available to save certificate");
          toast({
            title: "Warning",
            description: "Could not save certificate to your account: No test ID found.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Failed to save certificate to Supabase:", error);
        toast({
          title: "Warning",
          description: "Could not save certificate to your account. Please try again later.",
          variant: "destructive",
        });
      }
    } else {
      console.log("User not logged in, certificate not saved to database");
    }
  };

  if (!results) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9F9] font-inter">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-inuka-crimson mb-4 font-poppins">Loading your results...</h2>
          <p className="text-gray-600">Please wait while we analyze your strengths.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9] font-inter">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="inuka-container">
          <div className="max-w-4xl mx-auto">
            <header className="mb-12 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-inuka-crimson mb-4 font-poppins">
                Your Strength Africa Report
              </h1>
              
              <p className="text-lg text-inuka-charcoal">
                Based on your responses, we've identified your top 5 strengths. These represent your natural abilities and tendencies that, when cultivated, can lead to exceptional performance and fulfillment.
              </p>
            </header>
            
            <Tabs defaultValue="top-strengths" className="mb-12">
              <TabsList className="mb-8 bg-white border-2 border-muted p-1">
                <TabsTrigger value="top-strengths" className="font-poppins data-[state=active]:bg-inuka-crimson data-[state=active]:text-white">Top Strengths</TabsTrigger>
                <TabsTrigger value="by-category" className="font-poppins data-[state=active]:bg-inuka-crimson data-[state=active]:text-white">By Category</TabsTrigger>
              </TabsList>
              
              <TabsContent value="top-strengths">
                <ResultsTopStrengths 
                  results={results}
                  getCategoryName={getCategoryName}
                  getCategoryCardClass={getCategoryCardClass}
                  getCategoryBadgeClass={getCategoryBadgeClass}
                />
              </TabsContent>
              
              <TabsContent value="by-category">
                <ResultsByCategory 
                  categoryResults={categoryResults} 
                  getCategoryCardClass={getCategoryCardClass}
                  getCategoryColor={getCategoryColor}
                />
              </TabsContent>
            </Tabs>
            
            <NextSteps />
            
            <CertificateDownload 
              userName={userName}
              setUserName={setUserName}
              isGeneratingPDF={isGeneratingPDF}
              downloadPDF={downloadPDF}
              handleRetake={handleRetake}
              certificateId={certificateId}
            />
          </div>
        </div>
      </main>
      
      {/* Hidden certificate component for PDF generation */}
      <div className="hidden">
        <Certificate 
          ref={certificateRef}
          userName={userName || "Your Name"}
          results={results}
          date={format(new Date(), "MMMM d, yyyy")}
          certificateId={certificateId}
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default Results;
