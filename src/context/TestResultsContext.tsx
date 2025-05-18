
import React, { createContext, useContext, useState } from 'react';
import { UserResponse, UserResult, Strength, CategoryResult, StrengthCategory } from '../models/strength';
import { questions, strengths, getCategoryDisplayName } from '../data/strengths';
import { useTestResponses } from './TestResponseContext';
import { toast } from '@/components/ui/use-toast';
import { saveTestResults } from '@/lib/test-service';
import { useAuth } from './AuthContext';

interface TestResultsContextType {
  results: UserResult | null;
  categoryResults: CategoryResult[] | null;
  calculateResults: () => UserResult | null;
  resetResults: () => void;
  getCategoryName: (category: StrengthCategory) => string;
  getCurrentCategory: () => string;
}

const TestResultsContext = createContext<TestResultsContextType | undefined>(undefined);

export const useTestResults = () => {
  const context = useContext(TestResultsContext);
  if (context === undefined) {
    throw new Error('useTestResults must be used within a TestResultsProvider');
  }
  return context;
};

export const TestResultsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { responses, currentQuestionIndex } = useTestResponses();
  const [results, setResults] = useState<UserResult | null>(null);
  const [categoryResults, setCategoryResults] = useState<CategoryResult[] | null>(null);

  const calculateResults = () => {
    try {
      if (responses.length === 0) {
        toast({
          title: "No Responses",
          description: "Please complete the test first.",
          variant: "destructive",
        });
        return null;
      }

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
      
      // Store results to localStorage as backup
      localStorage.setItem('strengths_results', JSON.stringify(result));
      localStorage.setItem('strengths_category_results', JSON.stringify(categoryResults));

      // Save to database if user is logged in
      if (user && user.id) {
        saveTestResults(
          user.id,
          responses,
          result,
          categoryResults
        ).catch(err => {
          console.error("Error saving test results:", err);
          toast({
            title: "Error Saving Results",
            description: "Your results were saved locally but couldn't be stored in your account.",
            variant: "destructive",
          });
        });
      }
      
      return result;
    } catch (error) {
      console.error("Error calculating results:", error);
      toast({
        title: "Error Calculating Results",
        description: "There was a problem calculating your results. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const resetResults = () => {
    setResults(null);
    setCategoryResults(null);
    localStorage.removeItem('strengths_results');
    localStorage.removeItem('strengths_category_results');
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
    <TestResultsContext.Provider 
      value={{ 
        results,
        categoryResults,
        calculateResults,
        resetResults,
        getCategoryName,
        getCurrentCategory
      }}
    >
      {children}
    </TestResultsContext.Provider>
  );
};
