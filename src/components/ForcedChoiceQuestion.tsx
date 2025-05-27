
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
  
  const getButtonClass = (value: number) => {
    const isSelected = selectedValue === value;
    const baseClass = "px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 border-2";
    
    if (value > 0) {
      // Trait A buttons
      if (isSelected) {
        return `${baseClass} bg-blue-500 text-white border-blue-500`;
      }
      return `${baseClass} bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100`;
    } else {
      // Trait B buttons
      if (isSelected) {
        return `${baseClass} bg-green-500 text-white border-green-500`;
      }
      return `${baseClass} bg-green-50 text-green-700 border-green-200 hover:bg-green-100`;
    }
  };
  
  const getIntensityLabel = (value: number) => {
    switch (Math.abs(value)) {
      case 3: return "Strongly";
      case 2: return "Moderately";
      case 1: return "Slightly";
      default: return "";
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg border-none">
        <CardHeader className="bg-gradient-to-r from-inuka-crimson to-[#a52323] text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-poppins">
              Strengths Africa Assessment
            </CardTitle>
            <Badge className="bg-white text-inuka-crimson hover:bg-inuka-offwhite">
              Question {currentQuestionIndex + 1} of {forcedChoiceQuestions.length}
            </Badge>
          </div>
          <p className="text-sm opacity-90 mt-2 font-inter">
            Choose the statement that better describes you and rate how strongly it applies
          </p>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-200" />
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-8 text-center text-inuka-charcoal font-poppins">
              Which statement better describes you?
            </h2>
            
            <div className="space-y-6">
              {/* Statement A */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">Option A</h3>
                <p className="text-blue-700 mb-3">{currentQuestion.statementA}</p>
                <p className="text-sm text-blue-600 italic">({currentQuestion.traitA})</p>
              </div>
              
              {/* Response Scale */}
              <div className="grid grid-cols-6 gap-2 my-6">
                <button
                  onClick={() => handleValueSelect(3)}
                  className={getButtonClass(3)}
                >
                  Strongly A
                </button>
                <button
                  onClick={() => handleValueSelect(2)}
                  className={getButtonClass(2)}
                >
                  Moderately A
                </button>
                <button
                  onClick={() => handleValueSelect(1)}
                  className={getButtonClass(1)}
                >
                  Slightly A
                </button>
                <button
                  onClick={() => handleValueSelect(-1)}
                  className={getButtonClass(-1)}
                >
                  Slightly B
                </button>
                <button
                  onClick={() => handleValueSelect(-2)}
                  className={getButtonClass(-2)}
                >
                  Moderately B
                </button>
                <button
                  onClick={() => handleValueSelect(-3)}
                  className={getButtonClass(-3)}
                >
                  Strongly B
                </button>
              </div>
              
              {/* Statement B */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">Option B</h3>
                <p className="text-green-700 mb-3">{currentQuestion.statementB}</p>
                <p className="text-sm text-green-600 italic">({currentQuestion.traitB})</p>
              </div>
            </div>
            
            {selectedValue !== null && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  You selected: <span className="font-medium">
                    {getIntensityLabel(selectedValue)} {selectedValue > 0 ? 'A' : 'B'}
                  </span>
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            <Button 
              onClick={handlePrevious}
              disabled={!canGoBack}
              variant="outline"
              className="border-inuka-crimson text-inuka-crimson hover:bg-inuka-crimson hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={!canGoForward || selectedValue === null}
              className="bg-inuka-crimson hover:bg-opacity-90 px-8"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForcedChoiceQuestion;
