import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useForcedChoiceTest } from '@/context/ForcedChoiceTestContext';
import { toast } from '@/components/ui/use-toast';
import Certificate from '@/components/Certificate';
import { format } from 'date-fns';
import { UserResult, Strength } from '@/models/strength';
import { ForcedChoiceResults as ForcedChoiceResultsType } from '@/models/forcedChoice';

const ForcedChoiceResults: React.FC = () => {
  const { results, resetTest } = useForcedChoiceTest();
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [certificateId, setCertificateId] = useState<string>("");
  const certificateRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!results) {
      // Try to load from localStorage
      const savedResults = localStorage.getItem('forced_choice_results');
      if (!savedResults) {
        navigate('/test');
      }
    }
    
    // Try to get user's name from localStorage if available
    const storedName = localStorage.getItem('user_name');
    if (storedName) {
      setUserName(storedName);
    }
    
    // Generate a certificate ID
    setCertificateId(generateCertificateId());
  }, [results, navigate]);
  
  const handleRetake = () => {
    resetTest();
    // Redirect to payment page for new test
    navigate('/payment');
  };

  // Function to generate a unique certificate ID
  const generateCertificateId = () => {
    return `SA-${Math.floor(100000 + Math.random() * 900000)}`;
  };

  // Convert ForcedChoiceResults to UserResult format for Certificate component
  const convertToUserResult = (forcedChoiceResults: ForcedChoiceResultsType): UserResult => {
    return {
      topStrengths: forcedChoiceResults.topStrengths.map(strengthResult => ({
        strength: {
          id: strengthResult.trait.toLowerCase().replace(/\s+/g, '-'),
          name: strengthResult.trait,
          tagline: strengthResult.tagline,
          description: strengthResult.description,
          recommendations: [`Leverage your ${strengthResult.trait} strength in daily activities`],
          category: strengthResult.category as any
        } as Strength,
        score: strengthResult.score
      }))
    };
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
      // Simple PDF generation using window.print for now
      // You can integrate a proper PDF library like jsPDF here
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Strengths Africa Certificate - ${userName}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .certificate { text-align: center; padding: 40px; border: 2px solid #C92A2A; }
                .header { color: #C92A2A; margin-bottom: 30px; }
                .name { font-size: 28px; font-weight: bold; margin: 20px 0; }
                .strengths { text-align: left; margin: 30px auto; max-width: 600px; }
                .strength-item { margin: 10px 0; padding: 10px; border-left: 4px solid #FACC15; }
              </style>
            </head>
            <body>
              <div class="certificate">
                <div class="header">
                  <h1>Strengths Africa Certificate</h1>
                  <p>Certificate of Strength Discovery</p>
                </div>
                <p>This certifies that</p>
                <div class="name">${userName}</div>
                <p>has successfully completed the Strengths Africa Assessment</p>
                <div class="strengths">
                  <h3>Top 5 Strengths:</h3>
                  ${results.topStrengths.map((strength, index) => `
                    <div class="strength-item">
                      <strong>${index + 1}. ${strength.trait}</strong><br>
                      <em>"${strength.tagline}"</em><br>
                      Score: ${strength.score}
                    </div>
                  `).join('')}
                </div>
                <p>Date: ${format(new Date(), "MMMM d, yyyy")}</p>
                <p>Certificate ID: ${certificateId}</p>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
      
      toast({
        title: "Certificate Generated",
        description: "Your certificate is ready for download/printing.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error generating certificate",
        description: "There was a problem creating your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
  const getCategoryColor = (category: string): string => {
    const categoryColors: Record<string, string> = {
      "Thinking & Learning": "#3B82F6",
      "Interpersonal": "#FACC15",
      "Leadership & Influence": "#EF4444",
      "Execution & Discipline": "#22C55E",
      "Identity, Purpose & Values": "#8B5CF6"
    };
    
    return categoryColors[category] || "#C92A2A";
  };
  
  const getCategoryCardClass = (category: string): string => {
    switch (category) {
      case "Thinking & Learning": return "border-l-blue-500";
      case "Interpersonal": return "border-l-yellow-400";
      case "Leadership & Influence": return "border-l-red-500";
      case "Execution & Discipline": return "border-l-green-500";
      case "Identity, Purpose & Values": return "border-l-purple-500";
      default: return "border-l-gray-400";
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
                Your Strengths Africa Report
              </h1>
              
              <p className="text-lg text-inuka-charcoal">
                Based on your responses, we've identified your top 5 strengths. These represent your natural abilities and tendencies that, when cultivated, can lead to exceptional performance and fulfillment.
              </p>
            </header>
            
            <div className="space-y-6 mb-12">
              {results.topStrengths.map((strength, index) => (
                <Card 
                  key={strength.trait} 
                  className={`border-l-4 overflow-hidden shadow-md ${getCategoryCardClass(strength.category)}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div>
                        <Badge 
                          className="mb-2 text-white"
                          style={{ backgroundColor: getCategoryColor(strength.category) }}
                        >
                          {strength.category}
                        </Badge>
                        <CardTitle className="text-xl font-bold font-poppins">
                          {index + 1}. {strength.trait}
                        </CardTitle>
                        <p className="text-inuka-gold font-medium mt-1 italic">
                          "{strength.tagline}"
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Score:</span>
                        <span className="text-lg font-bold text-inuka-crimson">{strength.score}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{strength.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-muted">
              <h3 className="text-xl font-semibold text-inuka-crimson mb-3 font-poppins">Next Steps</h3>
              <p className="text-gray-700 mb-4">
                Understanding your strengths is just the beginning. Here's how you can leverage this knowledge:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li className="text-gray-700">Reflect on how your strengths have contributed to past successes.</li>
                <li className="text-gray-700">Look for opportunities to apply your strengths in new ways.</li>
                <li className="text-gray-700">Share your strengths with colleagues and friends to enhance collaboration.</li>
                <li className="text-gray-700">Consider how your strengths complement those around you.</li>
                <li className="text-gray-700">Develop strategies to leverage each of your top strengths daily.</li>
              </ul>
            </div>
            
            {/* Certificate Download Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-muted">
              <h3 className="text-xl font-semibold text-inuka-crimson mb-3 font-poppins">Download Your Certificate</h3>
              <p className="text-gray-700 mb-4">
                Enter your full name as you would like it to appear on your certificate.
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
              
              <div className="flex items-center text-sm text-gray-600 mt-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                Certificate ID: {certificateId}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={downloadPDF}
                disabled={isGeneratingPDF || !userName.trim()}
                className="bg-inuka-gold text-inuka-charcoal hover:bg-opacity-90"
              >
                {isGeneratingPDF ? "Generating PDF..." : "Download PDF Certificate"}
              </Button>
              <Button 
                onClick={handleRetake}
                variant="outline" 
                className="border-inuka-crimson text-inuka-crimson hover:bg-inuka-crimson hover:text-white"
              >
                Retake Assessment
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
          results={convertToUserResult(results)}
          date={format(new Date(), "MMMM d, yyyy")}
          certificateId={certificateId}
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default ForcedChoiceResults;
