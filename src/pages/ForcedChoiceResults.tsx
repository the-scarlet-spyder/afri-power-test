import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useForcedChoiceTest } from '@/context/ForcedChoiceTestContext';

const ForcedChoiceResults: React.FC = () => {
  const { results, resetTest } = useForcedChoiceTest();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!results) {
      // Try to load from localStorage
      const savedResults = localStorage.getItem('forced_choice_results');
      if (!savedResults) {
        navigate('/test');
      }
    }
  }, [results, navigate]);
  
  const handleRetake = () => {
    resetTest();
    navigate('/test');
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
            
            <div className="flex justify-center">
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
      
      <Footer />
    </div>
  );
};

export default ForcedChoiceResults;
