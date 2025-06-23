import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTest } from '@/context/TestContext';
import { usePairedTest } from '@/context/PairedTestContext';
import { useAuth } from '@/context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from '@/components/ui/use-toast';
import Certificate from '@/components/Certificate';
import { format } from 'date-fns';
import { saveCertificate } from '@/lib/test-service';

// Import new components
import ResultsTopStrengths from '@/components/results/ResultsTopStrengths';
import NextSteps from '@/components/results/NextSteps';
import CertificateDownload from '@/components/results/CertificateDownload';

// Import utility functions
import { 
  getCategoryCardClass, 
  getCategoryBadgeClass, 
  getCategoryColor 
} from '@/utils/styleUtils';
import { generateCertificatePDF } from '@/utils/certificatePDFGenerator';
import { getDiscStyleName, getDiscStyleDescription } from '@/data/disc';

const Results = () => {
  // Try both contexts - use whichever has results
  const originalTest = useTest();
  const pairedTest = usePairedTest();
  
  // Determine which test type has results
  const hasOriginalResults = originalTest.results !== null;
  const hasPairedResults = pairedTest.results !== null;
  
  console.log("Original test results:", originalTest.results);
  console.log("Paired test results:", pairedTest.results);
  
  // Use the appropriate context
  const { results, resetTest, testHistory, discResults } = hasOriginalResults ? originalTest : {
    results: pairedTest.results,
    resetTest: pairedTest.resetTest,
    testHistory: pairedTest.testHistory,
    discResults: null
  };
  
  // Get getCategoryName function from the appropriate context
  const getCategoryName = hasOriginalResults ? originalTest.getCategoryName : (category: string): string => {
    const categoryDisplayNames: Record<string, string> = {
      "thinking-learning": "Thinking & Learning",
      "interpersonal": "Interpersonal", 
      "leadership-influence": "Leadership & Influence",
      "execution-discipline": "Execution & Discipline",
      "identity-purpose-values": "Identity, Purpose & Values"
    };
    return categoryDisplayNames[category] || category;
  };
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const testId = searchParams.get('test');
  const [userName, setUserName] = useState<string>("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [certificateId, setCertificateId] = useState<string>("");
  const certificateRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    console.log("Results changed:", results);
    
    if (!results && !testHistory) {
      const storedResults = localStorage.getItem('inuka_results') || localStorage.getItem('paired_test_results');
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
    navigate('/payment'); // Redirect to payment for new test
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
                Your Complete Strength Africa Report
              </h1>
              
              <p className="text-lg text-inuka-charcoal">
                Based on your responses, we've identified your top 5 strengths and behavioral style. These represent your natural abilities that, when cultivated, can lead to exceptional performance and fulfillment.
              </p>
            </header>
            
            <div className="mb-12">
              <ResultsTopStrengths 
                results={results}
                getCategoryName={getCategoryName}
                getCategoryCardClass={getCategoryCardClass}
                getCategoryBadgeClass={getCategoryBadgeClass}
              />
            </div>
            
            {/* DISC Results Section */}
            {discResults && (
              <div className="mb-12">
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold text-inuka-charcoal mb-6 font-poppins">
                    Your Behavioral Style (DISC)
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-inuka-crimson text-white rounded-full text-2xl font-bold mb-4">
                        {discResults.primaryStyle}
                      </div>
                      <h3 className="text-xl font-semibold text-inuka-charcoal mb-2">
                        Primary Style: {getDiscStyleName(discResults.primaryStyle)}
                      </h3>
                      <p className="text-gray-600">
                        {getDiscStyleDescription(discResults.primaryStyle)}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-600 text-white rounded-full text-2xl font-bold mb-4">
                        {discResults.secondaryStyle}
                      </div>
                      <h3 className="text-xl font-semibold text-inuka-charcoal mb-2">
                        Secondary Style: {getDiscStyleName(discResults.secondaryStyle)}
                      </h3>
                      <p className="text-gray-600">
                        {getDiscStyleDescription(discResults.secondaryStyle)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(discResults).filter(([key]) => ['D', 'I', 'S', 'C'].includes(key)).map(([style, score]) => (
                      <div key={style} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-inuka-charcoal">{style}</div>
                        <div className="text-sm text-gray-600 mb-2">{getDiscStyleName(style as 'D' | 'I' | 'S' | 'C')}</div>
                        <div className="text-lg font-semibold text-inuka-crimson">{score}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
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
