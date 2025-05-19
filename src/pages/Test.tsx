
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTest } from '@/context/TestContext';
import { useToast } from '@/components/ui/use-toast';
import { questions } from '@/data/strengths';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const Test = () => {
  const { currentQuestionIndex, addResponse, calculateResults, getCurrentCategory } = useTest();
  const [selectedValue, setSelectedValue] = useState<number>(4);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentCategory = getCurrentCategory();
  
  const handleNext = () => {
    addResponse({
      questionId: currentQuestion.id,
      score: selectedValue
    });
    
    setSelectedValue(4); // Reset to neutral for next question
    
    if (currentQuestionIndex >= questions.length - 1) {
      // Test is complete
      calculateResults();
      navigate('/results');
    }
  };

  const getCategoryStyles = () => {
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
  
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9] font-inter">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="inuka-container">
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-lg border-none">
              <CardHeader className="bg-gradient-to-r from-inuka-crimson to-[#a52323] text-white rounded-t-lg">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-poppins">
                    Strengths Africa Assessment
                  </CardTitle>
                  <Badge className="bg-white text-inuka-crimson hover:bg-inuka-offwhite">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </Badge>
                </div>
                <p className="text-sm opacity-90 mt-2 font-inter">
                  Discover your unique strengths to unlock your full potential
                </p>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <Badge variant="outline" className={badgeClass}>
                      {currentCategory}
                    </Badge>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-gray-200" indicatorClassName={progressClass} />
                </div>
                
                <div className="mb-8 pt-2">
                  <h2 className="text-xl font-medium mb-10 text-inuka-charcoal text-center font-poppins">
                    {currentQuestion.text}
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
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleNext} 
                    className="bg-inuka-crimson hover:bg-opacity-90 px-8 py-6 text-base"
                  >
                    {currentQuestionIndex >= questions.length - 1 ? "Submit" : "Next"}
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
