
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTest } from '@/context/TestContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ResultsTopStrengths from '@/components/results/ResultsTopStrengths';
import ResultsByCategory from '@/components/results/ResultsByCategory';
import NextSteps from '@/components/results/NextSteps';
import CertificateDownload from '@/components/results/CertificateDownload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

// Helper functions for category styling that will be passed to child components
const getCategoryCardClass = (category: string): string => {
  switch (category) {
    case "thinking-learning": return "strength-card-thinking";
    case "interpersonal": return "strength-card-interpersonal";
    case "leadership-influence": return "strength-card-leadership";
    case "execution-discipline": return "strength-card-execution";
    case "identity-purpose-values": return "strength-card-identity";
    default: return "border-l-primary";
  }
};

const getCategoryBadgeClass = (category: string): string => {
  switch (category) {
    case "thinking-learning": return "strength-badge-thinking";
    case "interpersonal": return "strength-badge-interpersonal";
    case "leadership-influence": return "strength-badge-leadership";
    case "execution-discipline": return "strength-badge-execution";
    case "identity-purpose-values": return "strength-badge-identity";
    default: return "";
  }
};

const getCategoryColor = (category: string): string => {
  const categoryColors: Record<string, string> = {
    "thinking-learning": "#3B82F6", // Blue
    "interpersonal": "#FACC15",     // Yellow
    "leadership-influence": "#EF4444", // Red
    "execution-discipline": "#22C55E", // Green
    "identity-purpose-values": "#8B5CF6" // Purple
  };
  
  return categoryColors[category] || "#C92A2A"; // Default to crimson
};

const Results = () => {
  const { results, categoryResults, resetTest, getCategoryName } = useTest();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userName, setUserName] = useState<string>("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  useEffect(() => {
    if (!results) {
      const storedResults = localStorage.getItem('inuka_results');
      if (!storedResults) {
        navigate('/test');
      }
    }
    
    // Try to get user's name from localStorage if available
    const storedName = localStorage.getItem('user_name');
    if (storedName) {
      setUserName(storedName);
    }
  }, [results, navigate]);
  
  const handleRetake = () => {
    resetTest();
    navigate('/test');
  };

  // Function to generate a unique certificate ID
  const generateCertificateId = () => {
    return `SA-${Math.floor(100000 + Math.random() * 900000)}`;
  };

  // Function to handle the PDF download completion
  const handlePDFComplete = () => {
    setIsGeneratingPDF(false);
    toast({
      title: "Certificate Downloaded",
      description: "Your certificate has been successfully downloaded.",
    });
  };

  // Function to handle PDF generation errors
  const handlePDFError = (error: Error) => {
    console.error("Error generating PDF:", error);
    setIsGeneratingPDF(false);
    toast({
      title: "Error generating certificate",
      description: "There was a problem creating your PDF. Please try again.",
      variant: "destructive",
    });
  };

  // Function to download the certificate as PDF
  const downloadPDF = async () => {
    if (!results) {
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
    
    // The actual PDF generation is now handled in the CertificateDownload component
    // This function is now primarily for state management
    setTimeout(() => {
      handlePDFComplete();
    }, 500);
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
                {categoryResults && (
                  <ResultsByCategory 
                    categoryResults={categoryResults} 
                    getCategoryCardClass={getCategoryCardClass}
                    getCategoryColor={getCategoryColor}
                  />
                )}
              </TabsContent>
            </Tabs>
            
            <NextSteps />
            
            <CertificateDownload
              userName={userName}
              setUserName={setUserName}
              isGeneratingPDF={isGeneratingPDF}
              downloadPDF={downloadPDF}
              handleRetake={handleRetake}
              certificateId={generateCertificateId()}
              results={results}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Results;
