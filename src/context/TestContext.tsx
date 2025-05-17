
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserResponse, UserResult, Strength, CategoryResult, StrengthCategory } from '../models/strength';
import { questions, strengths, getCategoryDisplayName } from '../data/strengths';
import { useAuth } from './AuthContext';
import { saveTestResults, getLatestTestResult, getAllTestResults } from '@/lib/test-service';
import { toast } from '@/components/ui/use-toast';

interface TestContextType {
  responses: UserResponse[];
  currentQuestionIndex: number;
  addResponse: (response: UserResponse) => void;
  calculateResults: () => Promise<UserResult | null>;
  resetTest: () => void;
  results: UserResult | null;
  categoryResults: CategoryResult[] | null;
  getCategoryName: (category: StrengthCategory) => string;
  getCurrentCategory: () => string;
  testHistory: {
    id: string;
    testDate: string;
    results: UserResult;
  }[] | null;
  loadingHistory: boolean;
  fetchTestHistory: () => Promise<void>;
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
  const [testHistory, setTestHistory] = useState<{id: string; testDate: string; results: UserResult}[] | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const { user } = useAuth();

  // Load latest test results if available
  useEffect(() => {
    const loadLatestResults = async () => {
      if (user) {
        try {
          const latestTest = await getLatestTestResult(user.id);
          if (latestTest) {
            setResponses(latestTest.responses);
            setResults(latestTest.results);
            setCategoryResults(latestTest.categoryResults);
          }
        } catch (error) {
          console.error("Failed to load latest test results:", error);
        }
      } else {
        // Try loading from localStorage if user is not logged in
        const storedResults = localStorage.getItem('inuka_results');
        const storedCategoryResults = localStorage.getItem('inuka_category_results');
        const storedResponses = localStorage.getItem('inuka_responses');
        
        if (storedResults) {
          try {
            setResults(JSON.parse(storedResults));
          } catch (e) {
            console.error("Failed to parse stored results:", e);
          }
        }
        
        if (storedCategoryResults) {
          try {
            setCategoryResults(JSON.parse(storedCategoryResults));
          } catch (e) {
            console.error("Failed to parse stored category results:", e);
          }
        }
        
        if (storedResponses) {
          try {
            setResponses(JSON.parse(storedResponses));
          } catch (e) {
            console.error("Failed to parse stored responses:", e);
          }
        }
      }
    };

    loadLatestResults();
  }, [user]);

  const addResponse = (response: UserResponse) => {
    // Check if we're updating an existing response
    const existingIndex = responses.findIndex(r => r.questionId === response.questionId);
    
    let newResponses: UserResponse[];
    if (existingIndex >= 0) {
      newResponses = [...responses];
      newResponses[existingIndex] = response;
      setResponses(newResponses);
    } else {
      newResponses = [...responses, response];
      setResponses(newResponses);
    }
    
    // Save to localStorage as backup
    localStorage.setItem('inuka_responses', JSON.stringify(newResponses));
    
    // Move to the next question if available
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const calculateResults = async () => {
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
    
    const categoriesResults = Array.from(categoriesMap.entries()).map(([category, data]) => ({
      category,
      displayName: data.displayName,
      strengths: data.strengths.sort((a, b) => b.score - a.score)
    }));
    
    setResults(result);
    setCategoryResults(categoriesResults);
    
    // Save to localStorage as backup
    localStorage.setItem('inuka_results', JSON.stringify(result));
    localStorage.setItem('inuka_category_results', JSON.stringify(categoriesResults));
    
    // Save to Supabase if user is logged in
    if (user) {
      try {
        await saveTestResults(user.id, responses, result, categoriesResults);
        toast({
          title: "Results saved",
          description: "Your test results have been saved to your account.",
        });
      } catch (error) {
        console.error("Failed to save results to Supabase:", error);
        toast({
          title: "Warning",
          description: "We saved your results locally, but couldn't save them to your account.",
          variant: "destructive",
        });
      }
    }
    
    return result;
  };

  const fetchTestHistory = async () => {
    if (!user) {
      setTestHistory(null);
      return;
    }
    
    setLoadingHistory(true);
    try {
      const allResults = await getAllTestResults(user.id);
      setTestHistory(allResults.map(item => ({
        id: item.id,
        testDate: item.testDate,
        results: item.results
      })));
    } catch (error) {
      console.error("Failed to fetch test history:", error);
      toast({
        title: "Error",
        description: "Failed to load your test history.",
        variant: "destructive",
      });
    } finally {
      setLoadingHistory(false);
    }
  };

  const resetTest = () => {
    setResponses([]);
    setCurrentQuestionIndex(0);
    setResults(null);
    setCategoryResults(null);
    localStorage.removeItem('inuka_responses');
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
        testHistory,
        loadingHistory,
        fetchTestHistory
      }}
    >
      {children}
    </TestContext.Provider>
  );
};
