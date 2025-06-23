
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTest } from '@/context/TestContext';
import { useToast } from '@/components/ui/use-toast';
import { questions } from '@/data/strengths';
import { discQuestions } from '@/data/disc';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import DiscQuestion from '@/components/DiscQuestion';

const Test = () => {
  const { 
    currentQuestionIndex, 
    addResponse, 
    addDiscResponse,
    calculateResults, 
    getCurrentCategory,
    isDiscSection,
    totalQuestions
  } = useTest();
  
  const [selectedValue, setSelectedValue] = useState<number>(4);
  const [discScoreA, setDiscScoreA] = useState<number>(3);
  const [discScoreB, setDiscScoreB] = useState<number>(3);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const currentCategory = getCurrentCategory();
  
  // Get the current question based on section
  const getCurrentQuestion = () => {
    if (isDiscSection) {
      return discQuestions[currentQuestionIndex - questions.length];
    } else {
      return questions[currentQuestionIndex];
    }
  };
  
  const currentQuestion = getCurrentQuestion();
  
  const handleNext = async () => {
    if (isDiscSection) {
      // Handle DISC response
      const currentDiscQuestion = discQuestions[currentQuestionIndex - questions.length];
      addDiscResponse({
        questionId: currentDiscQuestion.id,
        scoreA: discScoreA,
        scoreB: discScoreB
      });
      
      setDiscScoreA(3);
      setDiscScoreB(3);
    } else {
      // Handle strengths response
      addResponse({
        questionId: currentQuestion.id,
        score: selectedValue
      });
      
      setSelectedValue(4);
    }
    
    if (currentQuestionIndex >= totalQuestions - 1) {
      // Test is complete
      await calculateResults();
      navigate('/results');
    }
  };

  const handleDiscResponse = (questionId: string, scoreA: number, scoreB: number) => {
    setDiscScoreA(scoreA);
    setDiscScoreB(scoreB);
  };

  const getCategoryStyles = () => {
    if (isDiscSection) {
      return { badgeClass: "strength-badge-identity", progressClass: "bg-strength-purple" };
    }

    switch(currentCategory) {
      case "Thinking & Learning":
        return { badgeClass: "strength-badge-thinking", progressClass: "bg-strength-blue" };
      case "Interpersonal":
        return { badgeClass: "strength-badge-interpersonal", progressClass: "bg-strength-yellow" };
      case "Leadership & Influence":
        return { badgeClass: "strength-badge-leadership", progressClass: "bg-strength-red" };
      case "Execution & Discipline":
        return { badgeClass: "strength-badge-execution", progressClass: "bg-strength-green" };
      case "Identity, Purpose & Values":
        return { badgeClass: "strength-badge-identity", progressClass: "bg-strength-purple" };
      default:
        return { badgeClass: "", progressClass: "bg-primary" };
    }
  };

  const { badgeClass, progressClass } = getCategoryStyles();
  
  // Show section transition
  if (currentQuestionIndex === questions.length && isDiscSection) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F9F9F9] font-inter">
        <Navbar />
        
        <main className="flex-grow py-12">
          <div className="inuka-container">
            <div className="max-w-3xl mx-auto">
              <Card className="shadow-lg border-none text-center">
                <CardContent className="pt-12 pb-12">
                  <Badge className="bg-inuka-crimson text-white mb-6 px-4 py-2">
                    Part 1 Complete
                  </Badge>
                  <h2 className="text-2xl font-bold text-inuka-charcoal mb-4 font-poppins">
                    Great Progress!
                  </h2>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    You've completed the Strengths Assessment. Now let's explore your behavioral style 
                    with our DISC assessment to give you a complete picture of your professional profile.
                  </p>
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg mb-8">
                    <h3 className="text-lg font-semibold text-inuka-charcoal mb-2">
                      Part 2: Behavioral Style Assessment
                    </h3>
                    <p className="text-gray-600">
                      20 questions exploring your communication style, decision-making approach, and work preferences.
                    </p>
                  </div>
                  <Button 
                    onClick={handleNext}
                    className="bg-inuka-crimson hover:bg-opacity-90 px-8 py-3 text-lg"
                  >
                    Continue to Part 2
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
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
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </Badge>
                </div>
                <p className="text-sm opacity-90 mt-2 font-inter">
                  {isDiscSection 
                    ? "Discover your behavioral style to understand how you interact and work" 
                    : "Discover your unique strengths to unlock your full potential"
                  }
                </p>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <Badge variant="outline" className={badgeClass}>
                      {isDiscSection ? `Part 2: ${currentCategory}` : `Part 1: ${currentCategory}`}
                    </Badge>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-gray-200" indicatorClassName={progressClass} />
                </div>
                
                {isDiscSection ? (
                  <DiscQuestion
                    question={discQuestions[currentQuestionIndex - questions.length]}
                    onResponse={handleDiscResponse}
                    questionNumber={currentQuestionIndex - questions.length + 1}
                    totalQuestions={discQuestions.length}
                  />
                ) : (
                  <div className="mb-8 pt-2">
                    <h2 className="text-xl font-medium mb-10 text-inuka-charcoal text-center font-poppins">
                      {(currentQuestion as any).text}
                    </h2>
                    
                    <div className="space-y-8 px-4 py-6">
                      <RadioGroup
                        className="grid grid-cols-7 gap-2"
                        value={selectedValue.toString()}
                        onValueChange={(value) => setSelectedValue(parseInt(value))}
                      >
                        {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                          <div key={value} className="flex flex-col items-center space-y-1.5">
                            <RadioGroupItem value={value.toString()} id={`value-${value}`} />
                            <Label 
                              htmlFor={`value-${value}`} 
                              className="text-xs text-center cursor-pointer"
                            >
                              {value}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      
                      <div className="flex justify-between text-sm font-medium text-inuka-charcoal mt-2">
                        <span>Strongly disagree</span>
                        <span>Strongly agree</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end mt-8">
                  <Button 
                    onClick={handleNext} 
                    className="bg-inuka-crimson hover:bg-opacity-90 px-8 py-6 text-base"
                  >
                    {currentQuestionIndex >= totalQuestions - 1 ? "Submit" : "Next"}
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

export default Test;
