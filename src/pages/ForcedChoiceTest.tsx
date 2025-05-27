
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ForcedChoiceQuestion from '@/components/ForcedChoiceQuestion';
import { Button } from '@/components/ui/button';
import { useForcedChoiceTest } from '@/context/ForcedChoiceTestContext';
import { forcedChoiceQuestions } from '@/data/forcedChoiceQuestions';

const ForcedChoiceTest: React.FC = () => {
  const { responses, currentQuestionIndex, calculateResults } = useForcedChoiceTest();
  const navigate = useNavigate();
  
  const isTestComplete = responses.length === forcedChoiceQuestions.length;
  const isLastQuestion = currentQuestionIndex === forcedChoiceQuestions.length - 1;
  
  const handleSubmit = async () => {
    const results = await calculateResults();
    if (results) {
      navigate('/results');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9] font-inter">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="inuka-container">
          <ForcedChoiceQuestion />
          
          {isLastQuestion && (
            <div className="max-w-4xl mx-auto mt-8">
              <div className="text-center">
                <Button 
                  onClick={handleSubmit}
                  disabled={!isTestComplete}
                  className="bg-inuka-gold text-inuka-charcoal hover:bg-opacity-90 px-12 py-6 text-lg"
                  size="lg"
                >
                  Calculate My Strengths
                </Button>
                {!isTestComplete && (
                  <p className="text-sm text-gray-500 mt-2">
                    Please answer all questions to see your results
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ForcedChoiceTest;
