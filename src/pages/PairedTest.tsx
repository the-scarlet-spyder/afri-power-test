
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePairedTest } from '@/context/PairedTestContext';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';

const PairedTest = () => {
  const { pairs, currentPairIndex, addResponse, calculateResults } = usePairedTest();
  const [selectedValue, setSelectedValue] = useState<number>(4); // Middle of 7-point scale
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
    
    setSelectedValue(4); // Reset to neutral for next question
    
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
  
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9] font-inter">
      <Navbar />
      
      <main className="flex-grow py-8 sm:py-12">
        <div className="inuka-container">
          <div className="max-w-4xl mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-inuka-crimson mb-2 font-poppins">
                Strengths Africa Assessment
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                Question {currentPairIndex + 1} of {pairs.length}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div 
                  className="bg-inuka-crimson h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            
            {/* Question */}
            <div className="mb-8">
              <h2 className="text-lg sm:text-xl font-medium mb-6 text-inuka-charcoal text-center font-poppins">
                Which sounds more like you?
              </h2>
              
              {/* Statement Comparison - Always side by side */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-8">
                <div className="bg-[#E6F4EA] p-2 sm:p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-xs sm:text-sm font-medium text-green-700">Statement A</span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 font-medium leading-tight">
                    {currentPair.questionA.text}
                  </p>
                </div>
                
                <div className="bg-[#E7F0FB] p-2 sm:p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-xs sm:text-sm font-medium text-blue-700">Statement B</span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 font-medium leading-tight">
                    {currentPair.questionB.text}
                  </p>
                </div>
              </div>
              
              {/* 7-Point Scale */}
              <div className="space-y-6 px-4 sm:px-12 py-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-xs sm:text-sm font-medium text-green-700">Statement A</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-xs sm:text-sm font-medium text-blue-700">Statement B</span>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="flex justify-between items-center mb-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                      <button
                        key={value}
                        onClick={() => setSelectedValue(value)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md transition-all duration-200 ${
                          selectedValue === value
                            ? 'bg-inuka-crimson shadow-lg scale-110'
                            : `bg-gray-${200 + (value * 50)} hover:bg-inuka-crimson hover:bg-opacity-20 hover:scale-105`
                        }`}
                        style={{
                          backgroundColor: selectedValue === value 
                            ? undefined 
                            : `rgba(156, 163, 175, ${0.3 + (Math.abs(4 - value) * 0.1)})`
                        }}
                      >
                        {selectedValue === value && (
                          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-sm mx-auto"></div>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {/* Connecting line */}
                  <div className="absolute top-4 sm:top-5 left-4 sm:left-5 right-4 sm:right-5 h-0.5 bg-gray-300 -z-10"></div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={handleNext} 
                className="bg-inuka-crimson hover:bg-opacity-90 px-8 py-3 text-base w-full sm:w-auto"
              >
                {currentPairIndex >= pairs.length - 1 ? "Submit" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PairedTest;
