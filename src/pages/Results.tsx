import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTest } from '@/context/TestContext';
import { useAuth } from '@/context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Certificate from '@/components/Certificate';
import { format } from 'date-fns';
import { saveCertificate } from '@/lib/test-service';

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
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      // Minimalist, centered layout
      // Background
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, 210, 297, 'F');
      // Border (dotted)
      pdf.setDrawColor(220, 220, 220);
      pdf.setLineWidth(0.5);
      pdf.setLineDashPattern([1, 2], 0);
      pdf.rect(8, 8, 194, 281);
      pdf.setLineDashPattern([], 0);
      // Header: Company name
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(13);
      pdf.setTextColor(80, 80, 80);
      pdf.text('Strengths Africa', 105, 25, { align: 'center' });
      // Certificate title
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(80, 80, 80);
      pdf.text('CERTIFICATE OF STRENGTHS FOR', 105, 35, { align: 'center' });
      // User Name
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(26);
      pdf.setTextColor(0,0,0);
      pdf.text(userName || 'Your Name', 105, 50, { align: 'center' });
      // Red ribbon badge (vertical from top right)
      const ribbonX = 160;
      const ribbonY = 0;
      const ribbonWidth = 40;
      const ribbonHeight = 50;
      pdf.setFillColor(201, 42, 42);
      pdf.setDrawColor(201, 42, 42);
      // Main ribbon rectangle
      pdf.rect(ribbonX, ribbonY, ribbonWidth, ribbonHeight, 'F');
      // Chevron/triangle tail
      pdf.triangle(
        ribbonX, ribbonY + ribbonHeight,
        ribbonX + ribbonWidth / 2, ribbonY + ribbonHeight + 12,
        ribbonX + ribbonWidth, ribbonY + ribbonHeight,
        'F'
      );
      // Badge text inside ribbon
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(255,255,255);
      pdf.text('STRENGTHS', ribbonX + ribbonWidth / 2, ribbonY + 17, { align: 'center' });
      pdf.text('CERTIFICATE', ribbonX + ribbonWidth / 2, ribbonY + 27, { align: 'center' });
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text(`Test Date: ${format(new Date(), "MMM d, yyyy")}`, ribbonX + ribbonWidth / 2, ribbonY + 39, { align: 'center' });
      // Traits section
      let y = 65;
      results.topStrengths.forEach((item, idx) => {
        // Category color bar
        const color = getCategoryColor(item.strength.category);
        const rgb = [
          parseInt(color.slice(1, 3), 16),
          parseInt(color.slice(3, 5), 16),
          parseInt(color.slice(5, 7), 16)
        ];
        pdf.setFillColor(rgb[0], rgb[1], rgb[2]);
        pdf.rect(30, y, 3, 22, 'F');
        // Trait name
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(15);
        pdf.setTextColor(0,0,0);
        pdf.text(item.strength.name, 38, y + 7);
        // Trait description (full report paragraph)
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        pdf.setTextColor(80, 80, 80);
        const lines = pdf.splitTextToSize(item.strength.description, 140);
        pdf.text(lines, 38, y + 14);
        y += 28 + (lines.length-1)*6;
      });
      // Footer
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Participated on: ${format(new Date(), "M/d/yyyy")}`, 105, 272, { align: 'center' });
      pdf.text('Copyright © Strengths Africa. All rights reserved.', 105, 280, { align: 'center' });
      // Save
      pdf.save(`Strength_Africa_Certificate_${userName.replace(/\s+/g, '_')}.pdf`);
      
      // Save certificate to Supabase if user is logged in
      if (user) {
        try {
          const currentTestId = testId || (testHistory && testHistory.length > 0 ? testHistory[0].id : '');
          if (currentTestId) {
            await saveCertificate(
              user.id,
              currentTestId,
              userName,
              certificateId
            );
            
            toast({
              title: "Certificate saved",
              description: "Your certificate has been saved to your account.",
            });
          }
        } catch (error) {
          console.error("Failed to save certificate to Supabase:", error);
        }
      }
      
      toast({
        title: "Certificate Downloaded",
        description: "Your certificate has been successfully downloaded.",
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
      if (certificateRef.current) {
        certificateRef.current.style.display = 'none';
      }
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
                <div className="space-y-8">
                  {results.topStrengths.map((item, index) => (
                    <Card key={item.strength.id} className={`border-l-4 overflow-hidden shadow-md ${getCategoryCardClass(item.strength.category)}`}>
                      <CardHeader className="pb-2">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                          <div>
                            <Badge className={`mb-2 ${getCategoryBadgeClass(item.strength.category)}`}>
                              {getCategoryName(item.strength.category)}
                            </Badge>
                            <CardTitle className="text-xl font-bold font-poppins">{index + 1}. {item.strength.name}</CardTitle>
                            <CardDescription className="text-inuka-gold font-medium mt-1 italic">"{item.strength.tagline}"</CardDescription>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-gray-500 mr-2">Strength Score:</span>
                            <Progress 
                              value={(item.score / 5) * 100} 
                              className="w-24 h-2" 
                            />
                            <span className="text-sm font-medium ml-2">{item.score.toFixed(1)}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{item.strength.description}</p>
                        <h4 className="font-semibold mb-2 text-inuka-crimson font-poppins">Recommendations:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {item.strength.recommendations.map((rec, i) => (
                            <li key={i} className="text-gray-700">{rec}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="by-category">
                {categoryResults && categoryResults.map((category, catIndex) => (
                  <div key={category.category} className="mb-10">
                    <h2 className="text-xl font-bold text-inuka-crimson mb-4 flex items-center font-poppins">
                      <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: getCategoryColor(category.category) }}></span>
                      {category.displayName}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.strengths.slice(0, 4).map((item, index) => (
                        <Card key={item.strength.id} className={`border-l-4 shadow-sm ${getCategoryCardClass(item.strength.category)}`}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg font-bold font-poppins">{item.strength.name}</CardTitle>
                              <div className="flex items-center">
                                <Progress 
                                  value={(item.score / 5) * 100} 
                                  className="w-16 h-1" 
                                />
                                <span className="text-xs font-medium ml-1">{item.score.toFixed(1)}</span>
                              </div>
                            </div>
                            <CardDescription className="text-inuka-gold text-sm font-medium mt-1 italic">"{item.strength.tagline}"</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-2">
                            <p className="text-sm text-gray-600">{item.strength.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
            
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
            
            {/* Name input for certificate */}
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
      
      <Footer />
    </div>
  );
};

// Helper functions for category styling
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

const getCategoryProgressClass = (category: string): string => {
  switch (category) {
    case "thinking-learning": return "bg-strength-blue";
    case "interpersonal": return "bg-strength-yellow";
    case "leadership-influence": return "bg-strength-red";
    case "execution-discipline": return "bg-strength-green";
    case "identity-purpose-values": return "bg-strength-purple";
    default: return "bg-primary";
  }
};

// Helper function to get color based on category
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

export default Results;
