import React, { createContext, useContext, useState, useEffect } from 'react';
import { strengths } from '@/data/strengths';
import { UserResult } from '@/models/strength';
import { useAuth } from './AuthContext';
import { 
  StatementPair, 
  PairResponse, 
  TraitScore, 
  createStatementPairs, 
  calculateTraitScores 
} from '@/services/pairingService';
import { saveTestResults } from '@/lib/test-service';
import { toast } from '@/components/ui/use-toast';

interface PairedTestContextType {
  pairs: StatementPair[];
  currentPairIndex: number;
  responses: PairResponse[];
  addResponse: (response: PairResponse) => void;
  calculateResults: () => Promise<UserResult | null>;
  resetTest: () => void;
  results: UserResult | null;
  traitScores: TraitScore[] | null;
  categoryResults: {
    category: string;
    displayName: string;
    strengths: { strength: any; score: number; }[];
  }[] | null;
  testHistory: {
    id: string;
    testDate: string;
    results: UserResult;
  }[] | null;
  loadingHistory: boolean;
  fetchTestHistory: () => Promise<void>;
}

const PairedTestContext = createContext<PairedTestContextType | undefined>(undefined);

export const usePairedTest = () => {
  const context = useContext(PairedTestContext);
  if (context === undefined) {
    throw new Error('usePairedTest must be used within a PairedTestProvider');
  }
  return context;
};

export const PairedTestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pairs] = useState<StatementPair[]>(() => createStatementPairs());
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [responses, setResponses] = useState<PairResponse[]>([]);
  const [results, setResults] = useState<UserResult | null>(null);
  const [traitScores, setTraitScores] = useState<TraitScore[] | null>(null);
  const [categoryResults, setCategoryResults] = useState<{category: string; displayName: string; strengths: {strength: any; score: number;}[]}[] | null>(null);
  const [testHistory, setTestHistory] = useState<{id: string; testDate: string; results: UserResult}[] | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const { user } = useAuth();

  // Load results from localStorage on mount
  useEffect(() => {
    const storedResults = localStorage.getItem('paired_test_results');
    const storedResponses = localStorage.getItem('paired_test_responses');
    
    if (storedResults) {
      try {
        setResults(JSON.parse(storedResults));
      } catch (e) {
        console.error("Failed to parse stored results:", e);
      }
    }
    
    if (storedResponses) {
      try {
        setResponses(JSON.parse(storedResponses));
      } catch (e) {
        console.error("Failed to parse stored responses:", e);
      }
    }
  }, []);

  const addResponse = (response: PairResponse) => {
    const existingIndex = responses.findIndex(r => r.pairId === response.pairId);
    
    let newResponses: PairResponse[];
    if (existingIndex >= 0) {
      newResponses = [...responses];
      newResponses[existingIndex] = response;
    } else {
      newResponses = [...responses, response];
    }
    
    setResponses(newResponses);
    localStorage.setItem('paired_test_responses', JSON.stringify(newResponses));
    
    // Move to next pair if available
    if (currentPairIndex < pairs.length - 1) {
      setCurrentPairIndex(currentPairIndex + 1);
    }
  };

  const calculateResults = async (): Promise<UserResult | null> => {
    const traitScoresCalculated = calculateTraitScores(responses, pairs);
    setTraitScores(traitScoresCalculated);
    
    // Get top 5 traits
    const topTraits = traitScoresCalculated.slice(0, 5);
    
    // Convert to UserResult format
    const topStrengths = topTraits.map(traitScore => {
      const strength = strengths.find(s => s.id === traitScore.traitId);
      if (!strength) throw new Error(`Strength not found for trait ${traitScore.traitId}`);
      
      // Calculate average score (total score / appearances)
      const averageScore = traitScore.appearances > 0 ? traitScore.totalScore / traitScore.appearances : 0;
      
      return {
        strength,
        score: averageScore
      };
    });
    
    const result: UserResult = {
      topStrengths
    };
    
    // Calculate category results
    const categoryMap = new Map<string, {strength: any; score: number}[]>();
    
    traitScoresCalculated.forEach(traitScore => {
      const strength = strengths.find(s => s.id === traitScore.traitId);
      if (!strength) return;
      
      const averageScore = traitScore.appearances > 0 ? traitScore.totalScore / traitScore.appearances : 0;
      const category = strength.category;
      
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      
      categoryMap.get(category)!.push({
        strength,
        score: averageScore
      });
    });
    
    // Sort each category by score and create display names
    const categoryDisplayNames: Record<string, string> = {
      "thinking-learning": "Thinking & Learning",
      "interpersonal": "Interpersonal",
      "leadership-influence": "Leadership & Influence", 
      "execution-discipline": "Execution & Discipline",
      "identity-purpose-values": "Identity, Purpose & Values"
    };
    
    const categoriesArray = Array.from(categoryMap.entries()).map(([category, strengths]) => ({
      category,
      displayName: categoryDisplayNames[category] || category,
      strengths: strengths.sort((a, b) => b.score - a.score)
    }));
    
    setCategoryResults(categoriesArray);
    setResults(result);
    
    // Save to localStorage
    localStorage.setItem('paired_test_results', JSON.stringify(result));
    
    // Save to Supabase if user is logged in
    if (user) {
      try {
        // Convert PairResponse to the format expected by saveTestResults
        const convertedResponses = responses.map(response => ({
          questionId: response.pairId,
          score: response.score
        }));
        
        await saveTestResults(user.id, convertedResponses, result, []);
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
    // This would be implemented similar to the original TestContext
    setLoadingHistory(false);
    setTestHistory([]);
  };

  const resetTest = () => {
    setCurrentPairIndex(0);
    setResponses([]);
    setResults(null);
    setTraitScores(null);
    setCategoryResults(null);
    localStorage.removeItem('paired_test_responses');
    localStorage.removeItem('paired_test_results');
  };

  return (
    <PairedTestContext.Provider value={{
      pairs,
      currentPairIndex,
      responses,
      addResponse,
      calculateResults,
      resetTest,
      results,
      traitScores,
      categoryResults,
      testHistory,
      loadingHistory,
      fetchTestHistory
    }}>
      {children}
    </PairedTestContext.Provider>
  );
};
