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
    currentQuestion,
    totalQuestions,
    currentQuestionIndex,
    selectedAnswer,
    setSelectedAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    completeTest,
    isTestComplete,
    isLoading,
    error
  } = useTest();
  
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

  const handleSubmit = () => {
    if (currentQuestionIndex === totalQuestions - 1) {
      completeTest();
      navigate('/results');
    } else {
      goToNextQuestion();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9F9]">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-inuka-crimson mb-4">Loading Test...</h2>
          <p className="text-gray-600">Please wait while we prepare your assessment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9F9]">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">There was a problem loading the test. Please try again later.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (isTestComplete) {
    navigate('/results');
    return null;
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9F9]">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-inuka-crimson mb-4">No Questions Available</h2>
          <p className="text-gray-600">There are no questions available at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9]">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-500">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}% Complete
                </span>
              </div>
              <Progress value={((currentQuestionIndex + 1) / totalQuestions) * 100} className="h-2" />
            </div>
            
            <Card className="mb-8 shadow-sm">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-6 text-inuka-charcoal">
                  {currentQuestion.text}
                </h2>
                
                <RadioGroup 
                  value={selectedAnswer?.toString() || ""} 
                  onValueChange={(value) => setSelectedAnswer(parseInt(value))}
                  className="space-y-4"
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value={value.toString()} id={`option-${value}`} />
                      <Label htmlFor={`option-${value}`} className="flex-grow cursor-pointer">
                        {value === 1 && "Strongly Disagree"}
                        {value === 2 && "Disagree"}
                        {value === 3 && "Neutral"}
                        {value === 4 && "Agree"}
                        {value === 5 && "Strongly Agree"}
                      </Label>
                      {selectedAnswer === value && (
                        <CheckCircle2 className="h-5 w-5 text-inuka-crimson" />
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
            
            <div className="flex justify-between">
              <Button
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="bg-inuka-crimson hover:bg-inuka-crimson/90 text-white flex items-center gap-2"
              >
                {currentQuestionIndex === totalQuestions - 1 ? (
                  <>
                    Complete Test
                    <CheckCircle2 className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Test;
