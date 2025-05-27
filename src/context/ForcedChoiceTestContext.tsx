
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ForcedChoiceResponse, ForcedChoiceResults, StrengthResult } from '@/models/forcedChoice';
import { forcedChoiceQuestions, traitDefinitions } from '@/data/forcedChoiceQuestions';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

interface ForcedChoiceTestContextType {
  responses: ForcedChoiceResponse[];
  currentQuestionIndex: number;
  addResponse: (response: ForcedChoiceResponse) => void;
  calculateResults: () => Promise<ForcedChoiceResults | null>;
  resetTest: () => void;
  results: ForcedChoiceResults | null;
  goToQuestion: (index: number) => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

const ForcedChoiceTestContext = createContext<ForcedChoiceTestContextType | undefined>(undefined);

export const useForcedChoiceTest = () => {
  const context = useContext(ForcedChoiceTestContext);
  if (context === undefined) {
    throw new Error('useForcedChoiceTest must be used within a ForcedChoiceTestProvider');
  }
  return context;
};

export const ForcedChoiceTestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [responses, setResponses] = useState<ForcedChoiceResponse[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState<ForcedChoiceResults | null>(null);
  const { user } = useAuth();

  // Load saved responses from localStorage
  useEffect(() => {
    const savedResponses = localStorage.getItem('forced_choice_responses');
    const savedQuestionIndex = localStorage.getItem('forced_choice_question_index');
    
    if (savedResponses) {
      try {
        setResponses(JSON.parse(savedResponses));
      } catch (e) {
        console.error("Failed to parse saved responses:", e);
      }
    }
    
    if (savedQuestionIndex) {
      try {
        setCurrentQuestionIndex(parseInt(savedQuestionIndex));
      } catch (e) {
        console.error("Failed to parse saved question index:", e);
      }
    }
  }, []);

  const addResponse = (response: ForcedChoiceResponse) => {
    const newResponses = [...responses];
    const existingIndex = newResponses.findIndex(r => r.questionId === response.questionId);
    
    if (existingIndex >= 0) {
      newResponses[existingIndex] = response;
    } else {
      newResponses.push(response);
    }
    
    setResponses(newResponses);
    
    // Save to localStorage
    localStorage.setItem('forced_choice_responses', JSON.stringify(newResponses));
    localStorage.setItem('forced_choice_question_index', currentQuestionIndex.toString());
  };

  const calculateResults = async (): Promise<ForcedChoiceResults | null> => {
    if (responses.length !== forcedChoiceQuestions.length) {
      toast({
        title: "Incomplete Assessment",
        description: "Please answer all questions before calculating results.",
        variant: "destructive",
      });
      return null;
    }

    // Calculate trait scores
    const traitScores: Record<string, number> = {};
    
    // Initialize all traits with 0 score
    Object.keys(traitDefinitions).forEach(trait => {
      traitScores[trait] = 0;
    });
    
    // Calculate scores from responses
    responses.forEach(response => {
      const { value, traitA, traitB } = response;
      
      if (value > 0) {
        // Positive value means traitA was chosen
        traitScores[traitA] += Math.abs(value);
      } else if (value < 0) {
        // Negative value means traitB was chosen
        traitScores[traitB] += Math.abs(value);
      }
    });
    
    // Sort traits by score and get top 5
    const topStrengths: StrengthResult[] = Object.entries(traitScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([trait, score]) => ({
        trait,
        score,
        tagline: traitDefinitions[trait].tagline,
        description: traitDefinitions[trait].description,
        category: traitDefinitions[trait].category
      }));
    
    const calculatedResults = { topStrengths };
    setResults(calculatedResults);
    
    // Save results
    localStorage.setItem('forced_choice_results', JSON.stringify(calculatedResults));
    
    return calculatedResults;
  };

  const resetTest = () => {
    setResponses([]);
    setCurrentQuestionIndex(0);
    setResults(null);
    localStorage.removeItem('forced_choice_responses');
    localStorage.removeItem('forced_choice_question_index');
    localStorage.removeItem('forced_choice_results');
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < forcedChoiceQuestions.length) {
      setCurrentQuestionIndex(index);
      localStorage.setItem('forced_choice_question_index', index.toString());
    }
  };

  const canGoBack = currentQuestionIndex > 0;
  const canGoForward = currentQuestionIndex < forcedChoiceQuestions.length - 1;

  return (
    <ForcedChoiceTestContext.Provider 
      value={{ 
        responses, 
        currentQuestionIndex, 
        addResponse, 
        calculateResults,
        resetTest,
        results,
        goToQuestion,
        canGoBack,
        canGoForward
      }}
    >
      {children}
    </ForcedChoiceTestContext.Provider>
  );
};
