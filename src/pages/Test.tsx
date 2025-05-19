
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTest } from '@/context/TestContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

const Test = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    currentQuestionIndex,
    questions,
    addResponse,
    calculateResults,
    getCurrentCategory
  } = useTest();
  
  // Update default value to 4 (neutral in a 7-point scale)
  const [selectedValue, setSelectedValue] = useState<number>(4);
  const currentQuestion = questions?.[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / (questions?.length || 1)) * 100;
  const currentCategory = getCurrentCategory();
  
  // If user is not authenticated, redirect to login
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleNext = () => {
    addResponse({
      questionId: currentQuestion.id,
      score: selectedValue
    });
    
    // Reset to neutral (4) for next question
    setSelectedValue(4);
    
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
  
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F9F9F9] font-inter">
        <Navbar />
        <main className="flex-grow py-12">
          <div className="container mx-auto px-4">
            <Card className="shadow-lg border-none max-w-md mx-auto">
              <CardContent className="p-6">
                <p className="text-center py-8">Loading questions...</p>
              </CardContent>
            </Card>
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
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-lg border-none">
              <CardContent className="pt-6">
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    {currentCategory && <Badge variant="outline" className={badgeClass}>
                      {currentCategory}
                    </Badge>}
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-gray-200" indicatorClassName={progressClass} />
                </div>
                
                <div className="mb-8 pt-2">
                  <h2 className="text-xl font-medium mb-10 text-inuka-charcoal text-center font-poppins">
                    {currentQuestion?.text}
                  </h2>
                  
                  <div className="space-y-6 px-4 py-4">
                    <RadioGroup 
                      defaultValue="4" 
                      className="mt-8"
                      value={selectedValue.toString()}
                      onValueChange={(value) => setSelectedValue(parseInt(value))}
                    >
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        <div className="text-center text-xs text-gray-500">Strongly disagree</div>
                        <div className="col-span-5"></div>
                        <div className="text-center text-xs text-gray-500">Strongly agree</div>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1">
                        {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                          <div key={value} className="flex flex-col items-center">
                            <RadioGroupItem 
                              value={value.toString()} 
                              id={`r${value}`} 
                              className="peer h-5 w-5 border border-gray-300 text-inuka-crimson focus:ring-0 focus:ring-offset-0" 
                            />
                            <Label htmlFor={`r${value}`} className="mt-2 text-sm">{value}</Label>
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1 mt-4">
                        <div className="text-center text-xs">Completely<br />disagree</div>
                        <div className="text-center text-xs">Disagree</div>
                        <div className="text-center text-xs">Somewhat<br />disagree</div>
                        <div className="text-center text-xs">Neutral</div>
                        <div className="text-center text-xs">Somewhat<br />agree</div>
                        <div className="text-center text-xs">Agree</div>
                        <div className="text-center text-xs">Completely<br />agree</div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleNext} 
                    className="bg-inuka-crimson hover:bg-opacity-90 px-8 py-6 text-base"
                  >
                    Next
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
