
import React, { createContext, useContext, useState } from 'react';
import { TestHistoryItem } from '../models/strength';
import { useAuth } from './AuthContext';
import { getAllTestResults } from '@/lib/test-service';
import { toast } from '@/components/ui/use-toast';

interface TestHistoryContextType {
  testHistory: TestHistoryItem[] | null;
  fetchTestHistory: () => Promise<void>;
  loadingHistory: boolean;
}

const TestHistoryContext = createContext<TestHistoryContextType | undefined>(undefined);

export const useTestHistory = () => {
  const context = useContext(TestHistoryContext);
  if (context === undefined) {
    throw new Error('useTestHistory must be used within a TestHistoryProvider');
  }
  return context;
};

export const TestHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [testHistory, setTestHistory] = useState<TestHistoryItem[] | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchTestHistory = async () => {
    if (!user || !user.id) {
      console.error("Cannot fetch test history: No authenticated user");
      return;
    }
    
    try {
      setLoadingHistory(true);
      const allTestResults = await getAllTestResults(user.id);
      console.log("Fetched test history:", allTestResults);
      setTestHistory(allTestResults);
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

  return (
    <TestHistoryContext.Provider 
      value={{ 
        testHistory,
        fetchTestHistory,
        loadingHistory
      }}
    >
      {children}
    </TestHistoryContext.Provider>
  );
};
