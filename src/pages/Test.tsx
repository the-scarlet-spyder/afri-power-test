
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { canTakeTest } from '@/lib/test-service';
import { Skeleton } from "@/components/ui/skeleton";
import AccessCodeVerification from '@/components/AccessCodeVerification';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTest } from '@/context/TestContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Test = () => {
  const [checkingCode, setCheckingCode] = useState(true);
  const [hasValidCode, setHasValidCode] = useState(false);
  const [canTakeNewTest, setCanTakeNewTest] = useState(true);
  const [eligibilityMessage, setEligibilityMessage] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    responses, 
    currentQuestionIndex,
    questions,
    addResponse,
    calculateResults,
    getCurrentCategory
  } = useTest();
  
  const [selectedValue, setSelectedValue] = useState<number>(4);
  const currentQuestion = questions?.[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / (questions?.length || 1)) * 100;
  const currentCategory = getCurrentCategory();
  
  useEffect(() => {
    const checkUserEligibility = async () => {
      if (!user) return;
      
      setCheckingCode(true);
      
      try {
        // First check if user has a valid access code
        const { data: hasCode, error: codeError } = await supabase.rpc('has_valid_access_code', {
          _user_id: user.id
        });
        
        if (codeError) {
          console.error('Error checking access code:', codeError);
          setHasValidCode(false);
          return;
        }
        
        setHasValidCode(hasCode);
        
        // If user doesn't have a valid code, redirect to access code page
        if (!hasCode) {
          navigate('/access-code');
          return;
        }
        
        // If user has a valid code, check if they can take a test with it
        const eligibility = await canTakeTest(user.id);
        setCanTakeNewTest(eligibility.canTake);
        setEligibilityMessage(eligibility.message);
        
        if (!eligibility.canTake) {
          toast({
            title: "New Access Code Required",
            description: eligibility.message,
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error('Error checking eligibility:', err);
        setHasValidCode(false);
        setCanTakeNewTest(false);
        setEligibilityMessage("There was an error checking your eligibility. Please try again later.");
      } finally {
        setCheckingCode(false);
      }
    };
    
    checkUserEligibility();
  }, [user, navigate]);
  
  // Show loading while checking access code
  if (checkingCode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <Skeleton className="h-12 w-full max-w-md mb-4" />
        <Skeleton className="h-8 w-3/4 max-w-md mb-4" />
        <Skeleton className="h-64 w-full max-w-md" />
      </div>
    );
  }
  
  // If no valid code, show access code verification
  if (!hasValidCode) {
    return <AccessCodeVerification />;
  }
  
  // If user has a valid code but has already taken a test with it
  if (!canTakeNewTest) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow flex items-center justify-center py-12">
          <div className="inuka-container">
            <div className="max-w-lg mx-auto text-center">
              <div className="mb-6">
                <AlertCircle className="h-16 w-16 mx-auto text-amber-500" />
              </div>
              <h1 className="text-3xl font-bold text-inuka-crimson mb-4 font-poppins">
                New Access Code Required
              </h1>
              <p className="mb-6 text-lg">
                {eligibilityMessage}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  onClick={() => navigate('/access-code')}
                  className="bg-inuka-crimson hover:bg-opacity-90"
                >
                  Enter New Access Code
                </Button>
                <Button
                  onClick={() => navigate('/profile')}
                  variant="outline"
                >
                  View Your Profile
                </Button>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

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
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span>Strongly Disagree</span>
                      <span>Neutral</span>
                      <span>Strongly Agree</span>
                    </div>
                    
                    <RadioGroup 
                      defaultValue="4" 
                      className="grid grid-cols-7 gap-2"
                      onValueChange={(value) => setSelectedValue(parseInt(value))}
                    >
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="1" id="r1" className="peer h-5 w-5 border border-gray-300 text-inuka-crimson focus:ring-0 focus:ring-offset-0" />
                        <Label htmlFor="r1" className="mt-1 text-xs">1</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="2" id="r2" className="peer h-5 w-5 border border-gray-300 text-inuka-crimson focus:ring-0 focus:ring-offset-0" />
                        <Label htmlFor="r2" className="mt-1 text-xs">2</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="3" id="r3" className="peer h-5 w-5 border border-gray-300 text-inuka-crimson focus:ring-0 focus:ring-offset-0" />
                        <Label htmlFor="r3" className="mt-1 text-xs">3</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="4" id="r4" className="peer h-5 w-5 border border-gray-300 text-inuka-crimson focus:ring-0 focus:ring-offset-0" />
                        <Label htmlFor="r4" className="mt-1 text-xs">4</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="5" id="r5" className="peer h-5 w-5 border border-gray-300 text-inuka-crimson focus:ring-0 focus:ring-offset-0" />
                        <Label htmlFor="r5" className="mt-1 text-xs">5</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="6" id="r6" className="peer h-5 w-5 border border-gray-300 text-inuka-crimson focus:ring-0 focus:ring-offset-0" />
                        <Label htmlFor="r6" className="mt-1 text-xs">6</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="7" id="r7" className="peer h-5 w-5 border border-gray-300 text-inuka-crimson focus:ring-0 focus:ring-offset-0" />
                        <Label htmlFor="r7" className="mt-1 text-xs">7</Label>
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
