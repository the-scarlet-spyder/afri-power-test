
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTest } from '@/context/TestContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Question from '@/components/Question';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { canTakeTest } from '@/lib/test-service';

const Test = () => {
  const { user } = useAuth();
  const {
    questions,
    currentQuestionIndex,
    selectedOptions,
    startTest,
    submitAnswer,
    moveToNextQuestion,
    resetTest,
    isTestFinished,
    submitTest,
    isLoading,
    error,
  } = useTest();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [canStart, setCanStart] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(true);

  useEffect(() => {
    const checkTestEligibility = async () => {
      if (user) {
        try {
          const canTake = await canTakeTest(user.id);
          setCanStart(canTake);
        } catch (err) {
          console.error("Error checking test eligibility:", err);
          toast({
            title: "Error",
            description: "Failed to check test eligibility. Please try again later.",
            variant: "destructive",
          });
        } finally {
          setCheckingEligibility(false);
        }
      } else {
        setCheckingEligibility(false);
      }
    };

    checkTestEligibility();

    // Start the test if questions are available and test hasn't started
    if (questions && questions.length > 0) {
      startTest(questions.length);
    }
  }, [user, questions, startTest, toast]);

  const handleAnswerSelection = (optionIndex: number) => {
    if (questions) {
      submitAnswer(currentQuestionIndex, optionIndex);
    }
  };

  const handleNext = () => {
    moveToNextQuestion();
  };

  const handleSubmit = async () => {
    try {
      await submitTest();
      navigate('/results');
    } catch (err) {
      console.error("Error submitting test:", err);
      toast({
        title: "Error",
        description: "Failed to submit the test. Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (checkingEligibility) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9F9]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-inuka-crimson mb-4">Checking your eligibility...</h2>
          <p className="text-gray-600">Please wait while we verify if you can take the test.</p>
          
          {/* Add Home button */}
          <div className="mt-8">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <Home size={18} />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!canStart) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9F9]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-inuka-crimson mb-4">Sorry, you are not eligible to take the test at this time.</h2>
          <p className="text-gray-600">Please contact support for more information.</p>
          
          {/* Add Home button */}
          <div className="mt-8">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <Home size={18} />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9F9]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-inuka-crimson mb-4">Loading questions...</h2>
          <p className="text-gray-600">Please wait while we fetch the questions for you.</p>
          
          {/* Add Home button */}
          <div className="mt-8">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <Home size={18} />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9F9]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-inuka-crimson mb-4">Oops!</h2>
          <p className="text-gray-600">An error occurred while loading the questions. Please try again later.</p>
          
          {/* Add Home button */}
          <div className="mt-8">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <Home size={18} />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9F9]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-inuka-crimson mb-4">No questions available</h2>
          <p className="text-gray-600">Please contact support.</p>
          
          {/* Add Home button */}
          <div className="mt-8">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <Home size={18} />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9]">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <Question
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            selectedOption={selectedOptions[currentQuestionIndex]}
            onSelect={handleAnswerSelection}
          />

          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={() => resetTest()}
            >
              Reset Test
            </Button>
            {currentQuestionIndex < questions.length - 1 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button onClick={handleSubmit}>Submit</Button>
            )}
          </div>
          
          {/* Add Home button at the bottom of the test page */}
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <Home size={18} />
              Back to Home
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Test;
