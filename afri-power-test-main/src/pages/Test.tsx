import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
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
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

const Test = () => {
  const [checkingCode, setCheckingCode] = useState(true);
  const [hasValidCode, setHasValidCode] = useState(false);
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
  
  // Temporarily use these until we update the context
  const [selectedValue, setSelectedValue] = useState<number>(3);
  const currentQuestion = questions?.[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / (questions?.length || 1)) * 100;
  const currentCategory = getCurrentCategory();
  
  useEffect(() => {
    const checkAccessCode = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase.rpc('has_valid_access_code', {
          _user_id: user.id
        });
        
        if (error) {
          console.error('Error checking access code:', error);
          setHasValidCode(false);
        } else {
          setHasValidCode(data);
          
          // If user doesn't have a valid code, redirect to access code page
          if (!data) {
            navigate('/access-code');
          }
        }
      } catch (err) {
        console.error('Error checking access code:', err);
        setHasValidCode(false);
      } finally {
        setCheckingCode(false);
      }
    };
    
    checkAccessCode();
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

  const handleNext = () => {
    addResponse({
      questionId: currentQuestion.id,
      score: selectedValue
    });
    
    setSelectedValue(3); // Reset to neutral for next question
    
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
                  
                  <div className="space-y-10 px-4 py-4">
                    <RadioGroup 
                      defaultValue="3" 
                      className="mt-8"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="r1" className="peer h-5 w-5 border border-gray-300 text-inuka-crimson focus:ring-0 focus:ring-offset-0" />
                        <Label htmlFor="r1" className="cursor-pointer">Totally disagree</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2" id="r2" className="peer h-5 w-5 border border-gray-300 text-inuka-crimson focus:ring-0 focus:ring-offset-0" />
                        <Label htmlFor="r2" className="cursor-pointer">Disagree</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3" id="r3" className="peer h-5 w-5 border border-gray-300 text-inuka-crimson focus:ring-0 focus:ring-offset-0" />
                        <Label htmlFor="r3" className="cursor-pointer">Neutral</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="4" id="r4" className="peer h-5 w-5 border border-gray-300 text-inuka-crimson focus:ring-0 focus:ring-offset-0" />
                        <Label htmlFor="r4" className="cursor-pointer">Agree</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="5" id="r5" className="peer h-5 w-5 border border-gray-300 text-inuka-crimson focus:ring-0 focus:ring-offset-0" />
                        <Label htmlFor="r5" className="cursor-pointer">Totally agree</Label>
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
