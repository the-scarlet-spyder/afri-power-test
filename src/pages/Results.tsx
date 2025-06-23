
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTest } from '@/context/TestContext';
import { usePairedTest } from '@/context/PairedTestContext';
import { useAuth } from '@/context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import Certificate from '@/components/Certificate';
import { format } from 'date-fns';
import { saveCertificate } from '@/lib/test-service';

// Import new components
import ResultsTopStrengths from '@/components/results/ResultsTopStrengths';
import NextSteps from '@/components/results/NextSteps';
import CertificateDownload from '@/components/results/CertificateDownload';
import AdvancedReport from '@/components/reports/AdvancedReport';

// Import utility functions
import { 
  getCategoryCardClass, 
  getCategoryBadgeClass, 
  getCategoryColor 
} from '@/utils/styleUtils';
import { generateCertificatePDF } from '@/utils/certificatePDFGenerator';
import { generateAdvancedReportPDF } from '@/utils/advancedReportPDFGenerator';

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
  const { results, resetTest, testHistory } = hasOriginalResults ? originalTest : {
    results: pairedTest.results,
    resetTest: pairedTest.resetTest,
    testHistory: pairedTest.testHistory
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
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [certificateId, setCertificateId] = useState<string>("");
  const [reportId, setReportId] = useState<string>("");
  const certificateRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  
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
    
    // Generate IDs
    setCertificateId(generateCertificateId());
    setReportId(generateReportId());
  }, [results, navigate, user, testHistory]);
  
  const handleRetake = () => {
    resetTest();
    navigate('/payment'); // Redirect to payment for new test
  };

  // Function to generate a unique certificate ID
  const generateCertificateId = () => {
    return `SA-${Math.floor(100000 + Math.random() * 900000)}`;
  };

  // Function to generate a unique report ID
  const generateReportId = () => {
    return `AR-${Math.floor(100000 + Math.random() * 900000)}`;
  };

  // Transform UserResult to the format expected by report components
  const transformResultsForReports = (userResult: any) => {
    if (!userResult || !userResult.topStrengths) return [];
    
    return userResult.topStrengths.map((item: any) => ({
      strength: item.strength.name,
      score: item.score,
      category: item.strength.category
    }));
  };

  // Function to download the certificate as PDF
  const downloadCertificatePDF = async () => {
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

  // Function to download the advanced report as PDF
  const downloadAdvancedReportPDF = async () => {
    if (!results) {
      toast({
        title: "Error",
        description: "Please make sure you have completed the test.",
        variant: "destructive",
      });
      return;
    }
    
    if (!userName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name before generating the report.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGeneratingReport(true);
    toast({
      title: "Generating your advanced report",
      description: "Please wait while we prepare your detailed report...",
    });
    
    try {
      const transformedResults = transformResultsForReports(results);
      console.log("Transformed results for report:", transformedResults);
      
      await generateAdvancedReportPDF(
        userName,
        transformedResults,
        reportId,
        () => {
          toast({
            title: "Advanced Report Downloaded",
            description: "Your detailed report has been successfully downloaded.",
          });
          setIsGeneratingReport(false);
        },
        (error) => {
          console.error("Error generating advanced report:", error);
          toast({
            title: "Error generating report",
            description: "There was a problem creating your report. Please try again.",
            variant: "destructive",
          });
          setIsGeneratingReport(false);
        }
      );
    } catch (error) {
      console.error("Error in report generation:", error);
      setIsGeneratingReport(false);
      toast({
        title: "Error generating report",
        description: "There was a problem creating your report. Please try again.",
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
            
            <div className="mb-12">
              <ResultsTopStrengths 
                results={results}
                getCategoryName={getCategoryName}
                getCategoryCardClass={getCategoryCardClass}
                getCategoryBadgeClass={getCategoryBadgeClass}
              />
            </div>
            
            <NextSteps />
            
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-muted">
              <h3 className="text-xl font-semibold text-inuka-crimson mb-3 font-poppins">Download Your Documents</h3>
              <p className="text-gray-700 mb-4">
                Enter your full name as you would like it to appear on your documents.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <input 
                  type="text" 
                  placeholder="Enter your full name" 
                  value={userName} 
                  onChange={(e) => {
                    setUserName(e.target.value);
                    localStorage.setItem('user_name', e.target.value);
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              
              <div className="flex items-center text-sm text-gray-600 mt-2 space-x-4">
                <span className="inline-flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  Certificate ID: {certificateId}
                </span>
                <span className="inline-flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  Report ID: {reportId}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                onClick={downloadCertificatePDF}
                disabled={isGeneratingPDF || !userName.trim()}
                className="bg-inuka-gold text-inuka-charcoal hover:bg-opacity-90"
              >
                {isGeneratingPDF ? "Generating PDF..." : "Download Certificate"}
              </Button>
              <Button 
                onClick={downloadAdvancedReportPDF}
                disabled={isGeneratingReport || !userName.trim()}
                className="bg-inuka-crimson text-white hover:bg-opacity-90"
              >
                {isGeneratingReport ? "Generating Report..." : "Download Advanced Report"}
              </Button>
              <Button 
                onClick={handleRetake}
                variant="outline" 
                className="border-inuka-crimson text-inuka-crimson hover:bg-inuka-crimson hover:text-white"
              >
                Retake Test
              </Button>
            </div>
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

      {/* Hidden advanced report component for PDF generation */}
      <div id="advanced-report" className="hidden">
        <AdvancedReport 
          ref={reportRef}
          userName={userName || "Your Name"}
          results={transformResultsForReports(results)}
          getCategoryName={getCategoryName}
          reportId={reportId}
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default Results;
