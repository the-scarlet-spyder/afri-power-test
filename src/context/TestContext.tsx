import React, { createContext, useContext, useState } from 'react';
import { UserResponse, UserResult, Strength, CategoryResult, StrengthCategory } from '../models/strength';
import { questions, strengths, getCategoryDisplayName } from '../data/strengths';

interface TestContextType {
  responses: UserResponse[];
  currentQuestionIndex: number;
  addResponse: (response: UserResponse) => void;
  calculateResults: () => UserResult;
  resetTest: () => void;
  results: UserResult | null;
  categoryResults: CategoryResult[] | null;
  getCategoryName: (category: StrengthCategory) => string;
  getCurrentCategory: () => string;
  questions: any[]; // Add the missing questions property
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export const useTest = () => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
};

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState<UserResult | null>(null);
  const [categoryResults, setCategoryResults] = useState<CategoryResult[] | null>(null);

  const addResponse = (response: UserResponse) => {
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
  };

  const calculateResults = () => {
    // Create a map to store strength scores
    const strengthScores = new Map<string, { total: number, count: number }>();
    
    // Initialize the map with all strengths
    strengths.forEach(strength => {
      strengthScores.set(strength.id, { total: 0, count: 0 });
    });
    
    // Calculate scores for each strength
    responses.forEach(response => {
      const question = questions.find(q => q.id === response.questionId);
      if (question) {
        const scoreData = strengthScores.get(question.strengthId);
        if (scoreData) {
          scoreData.total += response.score;
          scoreData.count += 1;
        }
      }
    });
    
    // Calculate average scores and create array for sorting
    const strengthResults = Array.from(strengthScores.entries()).map(([strengthId, scoreData]) => {
      const strength = strengths.find(s => s.id === strengthId);
      const averageScore = scoreData.count > 0 ? scoreData.total / scoreData.count : 0;
      return {
        strength: strength as Strength,
        score: averageScore
      };
    });
    
    // Sort by score (descending)
    strengthResults.sort((a, b) => b.score - a.score);
    
    // Get top 5 strengths
    const topStrengths = strengthResults.slice(0, 5);
    
    const result = {
      topStrengths
    };
    
    // Group results by category
    const categoriesMap = new Map<StrengthCategory, {
      displayName: string,
      strengths: { strength: Strength; score: number }[]
    }>();
    
    strengthResults.forEach(item => {
      const category = item.strength.category;
      const categoryData = categoriesMap.get(category);
      
      if (categoryData) {
        categoryData.strengths.push(item);
      } else {
        categoriesMap.set(category, {
          displayName: getCategoryDisplayName(category),
          strengths: [item]
        });
      }
    });
    
    const categoryResults = Array.from(categoriesMap.entries()).map(([category, data]) => ({
      category,
      displayName: data.displayName,
      strengths: data.strengths.sort((a, b) => b.score - a.score)
    }));
    
    setResults(result);
    setCategoryResults(categoryResults);
    
    // In a real app, you'd save this to a database
    localStorage.setItem('inuka_results', JSON.stringify(result));
    localStorage.setItem('inuka_category_results', JSON.stringify(categoryResults));
    
    return result;
  };

  const resetTest = () => {
    setResponses([]);
    setCurrentQuestionIndex(0);
    setResults(null);
    setCategoryResults(null);
    localStorage.removeItem('inuka_results');
    localStorage.removeItem('inuka_category_results');
  };

  const getCategoryName = (category: StrengthCategory): string => {
    return getCategoryDisplayName(category);
  };

  const getCurrentCategory = (): string => {
    if (currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      const strength = strengths.find(s => s.id === currentQuestion.strengthId);
      if (strength) {
        return getCategoryDisplayName(strength.category);
      }
    }
    return "";
  };

  return (
    <TestContext.Provider 
      value={{ 
        responses, 
        currentQuestionIndex, 
        addResponse, 
        calculateResults,
        resetTest,
        results,
        categoryResults,
        getCategoryName,
        getCurrentCategory,
        questions // Add questions to the context value
      }}
    >
      {children}
    </TestContext.Provider>
  );
};
