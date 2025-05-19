
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserResponse, UserResult, Strength, CategoryResult, StrengthCategory } from '../models/strength';
import { questions, strengths, getCategoryDisplayName } from '../data/strengths';
import { getAllTestResults } from '@/lib/test-service';
import { useToast } from '@/components/ui/use-toast';

// Define a type for the test history items
export interface TestHistoryItem {
  id: string;
  responses: UserResponse[];
  results: UserResult;
  categoryResults: CategoryResult[];
  testDate: string;
}

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
  questions: typeof questions;
  testHistory: TestHistoryItem[] | null;
  fetchTestHistory: () => Promise<void>;
  loadingHistory: boolean;
  
  // Add the missing properties
  selectedOptions: Record<number, number>;
  startTest: (totalQuestions: number) => void;
  submitAnswer: (questionIndex: number, optionIndex: number) => void;
  moveToNextQuestion: () => void;
  isTestFinished: boolean;
  submitTest: () => Promise<void>;
  isLoading: boolean;
  error: any;
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
  const [testHistory, setTestHistory] = useState<TestHistoryItem[] | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  // Add the missing state variables
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  // Load saved responses from localStorage on initial render
  useEffect(() => {
    const storedResults = localStorage.getItem('inuka_results');
    const storedCategoryResults = localStorage.getItem('inuka_category_results');
    const storedResponses = localStorage.getItem('inuka_responses');
    const storedSelectedOptions = localStorage.getItem('inuka_selected_options');
    
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
    
    if (storedCategoryResults) {
      setCategoryResults(JSON.parse(storedCategoryResults));
    }
    
    if (storedResponses) {
      setResponses(JSON.parse(storedResponses));
    }
    
    if (storedSelectedOptions) {
      setSelectedOptions(JSON.parse(storedSelectedOptions));
    }
  }, []);

  const startTest = (totalQuestions: number) => {
    setCurrentQuestionIndex(0);
    setSelectedOptions({});
    setIsTestFinished(false);
  };

  const submitAnswer = (questionIndex: number, optionIndex: number) => {
    // Update selected options
    const newSelectedOptions = { ...selectedOptions, [questionIndex]: optionIndex };
    setSelectedOptions(newSelectedOptions);
    localStorage.setItem('inuka_selected_options', JSON.stringify(newSelectedOptions));
    
    // Get the question and update responses
    const question = questions[questionIndex];
    if (question) {
      addResponse({
        questionId: question.id,
        score: optionIndex
      });
    }
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsTestFinished(true);
    }
  };

  const submitTest = async () => {
    try {
      calculateResults();
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const addResponse = (response: UserResponse) => {
    // Check if we're updating an existing response
    const existingIndex = responses.findIndex(r => r.questionId === response.questionId);
    
    let newResponses: UserResponse[];
    if (existingIndex >= 0) {
      newResponses = [...responses];
      newResponses[existingIndex] = response;
    } else {
      newResponses = [...responses, response];
    }
    
    setResponses(newResponses);
    
    // Save to localStorage
    localStorage.setItem('inuka_responses', JSON.stringify(newResponses));
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
    
    // Save to localStorage
    localStorage.setItem('inuka_results', JSON.stringify(result));
    localStorage.setItem('inuka_category_results', JSON.stringify(categoryResults));
    
    return result;
  };

  const resetTest = () => {
    setResponses([]);
    setCurrentQuestionIndex(0);
    setResults(null);
    setCategoryResults(null);
    setSelectedOptions({});
    setIsTestFinished(false);
    localStorage.removeItem('inuka_results');
    localStorage.removeItem('inuka_category_results');
    localStorage.removeItem('inuka_responses');
    localStorage.removeItem('inuka_selected_options');
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

  // Add the fetchTestHistory function
  const fetchTestHistory = async () => {
    try {
      setLoadingHistory(true);
      const user = JSON.parse(localStorage.getItem('inuka_user') || '{}');
      
      if (!user || !user.id) {
        console.error("No user found in localStorage");
        return;
      }

      const allTestResults = await getAllTestResults(user.id);
      console.log("Fetched test history:", allTestResults);
      setTestHistory(allTestResults);
    } catch (error) {
      console.error("Failed to fetch test history:", error);
      // toast was removed because useToast is a hook and can't be used directly in this function
      setError(error);
    } finally {
      setLoadingHistory(false);
    }
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
        questions,
        testHistory,
        fetchTestHistory,
        loadingHistory,
        // Add the new properties to the context value
        selectedOptions,
        startTest,
        submitAnswer,
        moveToNextQuestion,
        isTestFinished,
        submitTest,
        isLoading,
        error
      }}
    >
      {children}
    </TestContext.Provider>
  );
};
