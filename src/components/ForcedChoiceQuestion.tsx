import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { forcedChoiceQuestions } from '@/data/forcedChoiceQuestions';
import { useForcedChoiceTest } from '@/context/ForcedChoiceTestContext';

const ForcedChoiceQuestion: React.FC = () => {
  const { 
    responses, 
    currentQuestionIndex, 
    addResponse, 
    goToQuestion,
    canGoBack,
    canGoForward
  } = useForcedChoiceTest();
  
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  
  const currentQuestion = forcedChoiceQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / forcedChoiceQuestions.length) * 100;
  
  // Load existing response for current question
  useEffect(() => {
    const existingResponse = responses.find(r => r.questionId === currentQuestion.id);
    setSelectedValue(existingResponse?.value || null);
  }, [currentQuestionIndex, responses, currentQuestion.id]);
  
  const handleValueSelect = (value: number) => {
    setSelectedValue(value);
    addResponse({
      questionId: currentQuestion.id,
      value,
      traitA: currentQuestion.traitA,
      traitB: currentQuestion.traitB
    });
  };
  
  const handleNext = () => {
    if (canGoForward) {
      goToQuestion(currentQuestionIndex + 1);
    }
  };
  
  const handlePrevious = () => {
    if (canGoBack) {
      goToQuestion(currentQuestionIndex - 1);
    }
  };
  
  // CliftonStrengths-style button classes
  const getButtonClass = (value: number) => {
    const isSelected = selectedValue === value;
    const baseClass = "h-12 w-12 rounded-full border-2 transition-all duration-200 flex items-center justify-center hover:scale-105";
    
    if (isSelected) {
      return `${baseClass} bg-inuka-crimson border-inuka-crimson shadow-lg transform scale-110`;
    }
    
    return `${baseClass} bg-white border-gray-300 hover:border-inuka-crimson hover:shadow-md`;
  };
  
  return (
    <div className="max-w-5xl mx-auto px-4">
      <Card className="shadow-xl border-none bg-white">
        <CardHeader className="bg-gradient-to-r from-inuka-crimson to-[#a52323] text-white">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-poppins">
              Strengths Africa Assessment
            </CardTitle>
            <Badge className="bg-white text-inuka-crimson px-3 py-1">
              {currentQuestionIndex + 1} of {forcedChoiceQuestions.length}
            </Badge>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="h-2 bg-white/20" />
          </div>
        </CardHeader>
        
        <CardContent className="py-12 px-8">
          {/* Question Layout - CliftonStrengths Style */}
          <div className="max-w-4xl mx-auto">
            
            {/* Statement A */}
            <div className="mb-12">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
                <p className="text-xl font-medium text-blue-900 leading-relaxed text-center">
                  {currentQuestion.statementA}
                </p>
              </div>
            </div>
            
            {/* Response Scale - Horizontal Layout */}
            <div className="mb-12">
              <div className="flex items-center justify-center space-x-4">
                {/* Left side - Statement A responses */}
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-blue-700 mr-2">Strongly</span>
                  <button
                    onClick={() => handleValueSelect(3)}
                    className={getButtonClass(3)}
                    title="Strongly describes me"
                  >
                    {selectedValue === 3 && <div className="w-6 h-6 bg-white rounded-full"></div>}
                  </button>
                  
                  <button
                    onClick={() => handleValueSelect(2)}
                    className={getButtonClass(2)}
                    title="Moderately describes me"
                  >
                    {selectedValue === 2 && <div className="w-6 h-6 bg-white rounded-full"></div>}
                  </button>
                  
                  <button
                    onClick={() => handleValueSelect(1)}
                    className={getButtonClass(1)}
                    title="Slightly describes me"
                  >
                    {selectedValue === 1 && <div className="w-6 h-6 bg-white rounded-full"></div>}
                  </button>
                  <span className="text-sm font-medium text-blue-700 ml-2">Slightly</span>
                </div>
                
                {/* Center divider */}
                <div className="flex flex-col items-center mx-8">
                  <div className="w-px h-16 bg-gray-300"></div>
                  <span className="text-xs text-gray-500 mt-2 font-medium">OR</span>
                </div>
                
                {/* Right side - Statement B responses */}
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-green-700 mr-2">Slightly</span>
                  <button
                    onClick={() => handleValueSelect(-1)}
                    className={getButtonClass(-1)}
                    title="Slightly describes me"
                  >
                    {selectedValue === -1 && <div className="w-6 h-6 bg-white rounded-full"></div>}
                  </button>
                  
                  <button
                    onClick={() => handleValueSelect(-2)}
                    className={getButtonClass(-2)}
                    title="Moderately describes me"
                  >
                    {selectedValue === -2 && <div className="w-6 h-6 bg-white rounded-full"></div>}
                  </button>
                  
                  <button
                    onClick={() => handleValueSelect(-3)}
                    className={getButtonClass(-3)}
                    title="Strongly describes me"
                  >
                    {selectedValue === -3 && <div className="w-6 h-6 bg-white rounded-full"></div>}
                  </button>
                  <span className="text-sm font-medium text-green-700 ml-2">Strongly</span>
                </div>
              </div>
            </div>
            
            {/* Statement B */}
            <div className="mb-12">
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
                <p className="text-xl font-medium text-green-900 leading-relaxed text-center">
                  {currentQuestion.statementB}
                </p>
              </div>
            </div>
            
            {/* Selection Feedback */}
            {selectedValue !== null && (
              <div className="text-center mb-8">
                <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full">
                  <div className="w-3 h-3 bg-inuka-crimson rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Selection recorded
                  </span>
                </div>
              </div>
            )}
            
            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button 
                onClick={handlePrevious}
                disabled={!canGoBack}
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 text-gray-600 hover:border-inuka-crimson hover:text-inuka-crimson px-6"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Previous
              </Button>
              
              <Button 
                onClick={handleNext}
                disabled={!canGoForward || selectedValue === null}
                size="lg"
                className="bg-inuka-crimson hover:bg-inuka-crimson/90 px-8 py-3 text-lg font-medium"
              >
                {currentQuestionIndex === forcedChoiceQuestions.length - 1 ? 'Complete Assessment' : 'Next Question'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForcedChoiceQuestion;
