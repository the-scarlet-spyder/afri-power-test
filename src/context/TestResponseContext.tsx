
import React, { createContext, useContext, useState } from 'react';
import { UserResponse } from '../models/strength';
import { questions } from '../data/strengths';
import { toast } from '@/components/ui/use-toast';

interface TestResponseContextType {
  responses: UserResponse[];
  currentQuestionIndex: number;
  addResponse: (response: UserResponse) => void;
  resetResponses: () => void;
  questions: typeof questions;
  getCurrentQuestion: () => typeof questions[0] | undefined;
}

const TestResponseContext = createContext<TestResponseContextType | undefined>(undefined);

export const useTestResponses = () => {
  const context = useContext(TestResponseContext);
  if (context === undefined) {
    throw new Error('useTestResponses must be used within a TestResponseProvider');
  }
  return context;
};

export const TestResponseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const getCurrentQuestion = () => {
    if (currentQuestionIndex < questions.length) {
      return questions[currentQuestionIndex];
    }
    return undefined;
  };

  const addResponse = (response: UserResponse) => {
    try {
      // Check if we're updating an existing response
      const existingIndex = responses.findIndex(r => r.questionId === response.questionId);
      
      if (existingIndex >= 0) {
        const newResponses = [...responses];
        newResponses[existingIndex] = response;
        setResponses(newResponses);
      } else {
        setResponses([...responses, response]);
      }
      
      // Move to the next question if available
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    } catch (error) {
      console.error("Error adding response:", error);
      toast({
        title: "Error Saving Response",
        description: "There was a problem saving your answer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetResponses = () => {
    setResponses([]);
    setCurrentQuestionIndex(0);
  };

  return (
    <TestResponseContext.Provider 
      value={{ 
        responses, 
        currentQuestionIndex, 
        addResponse,
        resetResponses,
        questions,
        getCurrentQuestion
      }}
    >
      {children}
    </TestResponseContext.Provider>
  );
};
