
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePairedTest } from '@/context/PairedTestContext';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PairedTest = () => {
  const { pairs, currentPairIndex, addResponse, calculateResults } = usePairedTest();
  const [selectedValue, setSelectedValue] = useState<number>(3);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const currentPair = pairs[currentPairIndex];
  const progress = ((currentPairIndex + 1) / pairs.length) * 100;
  
  const handleNext = async () => {
    if (!currentPair) return;
    
    addResponse({
      pairId: currentPair.id,
      score: selectedValue
    });
    
    setSelectedValue(3); // Reset to neutral for next question
    
    if (currentPairIndex >= pairs.length - 1) {
      // Test is complete
      await calculateResults();
      navigate('/results');
    }
  };

  if (!currentPair) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9F9] font-inter">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-inuka-crimson mb-4 font-poppins">Loading assessment...</h2>
          <p className="text-gray-600">Please wait while we prepare your questions.</p>
        </div>
      </div>
    );
  }
  
  const scaleLabels = [
    "Strongly describes left",
    "Slightly describes left", 
    "Neutral",
    "Slightly describes right",
    "Strongly describes right"
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9] font-inter">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="inuka-container">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg border-none">
              <CardHeader className="bg-gradient-to-r from-inuka-crimson to-[#a52323] text-white rounded-t-lg">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-poppins">
                    Strengths Africa Assessment
                  </CardTitle>
                  <Badge className="bg-white text-inuka-crimson hover:bg-inuka-offwhite">
                    Question {currentPairIndex + 1} of {pairs.length}
                  </Badge>
                </div>
                <p className="text-sm opacity-90 mt-2 font-inter">
                  Compare these statements and choose which sounds more like you
                </p>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-gray-200" />
                </div>
                
                <div className="mb-8 pt-2">
                  <h2 className="text-xl font-medium mb-8 text-inuka-charcoal text-center font-poppins">
                    Which sounds more like you?
                  </h2>
                  
                  {/* Statement Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium text-red-700">Statement A</span>
                      </div>
                      <p className="text-gray-700 font-medium">{currentPair.questionA.text}</p>
                    </div>
                    
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium text-blue-700">Statement B</span>
                      </div>
                      <p className="text-gray-700 font-medium">{currentPair.questionB.text}</p>
                    </div>
                  </div>
                  
                  {/* 5-Point Scale */}
                  <div className="space-y-6 px-4 py-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium text-red-700">Statement A</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium text-blue-700">Statement B</span>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="flex justify-between items-center mb-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            onClick={() => setSelectedValue(value)}
                            className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                              selectedValue === value
                                ? 'bg-inuka-crimson border-inuka-crimson shadow-lg scale-110'
                                : 'bg-white border-gray-300 hover:border-inuka-crimson hover:scale-105'
                            }`}
                          >
                            {selectedValue === value && (
                              <div className="w-3 h-3 bg-white rounded-full mx-auto"></div>
                            )}
                          </button>
                        ))}
                      </div>
                      
                      {/* Connecting line */}
                      <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-300 -z-10"></div>
                      
                      {/* Scale labels */}
                      <div className="grid grid-cols-5 gap-2 mt-4">
                        {scaleLabels.map((label, index) => (
                          <div key={index} className="text-xs text-center text-gray-600">
                            {label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleNext} 
                    className="bg-inuka-crimson hover:bg-opacity-90 px-8 py-6 text-base"
                  >
                    {currentPairIndex >= pairs.length - 1 ? "Submit" : "Next"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PairedTest;
