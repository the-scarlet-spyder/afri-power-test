
import React from 'react';
import { TestResponseProvider, useTestResponses } from './TestResponseContext';
import { TestResultsProvider, useTestResults } from './TestResultsContext';
import { TestHistoryProvider, useTestHistory } from './TestHistoryContext';
import { UserResponse, UserResult, CategoryResult, StrengthCategory } from '../models/strength';

// Re-export the test history item type
export type { TestHistoryItem } from './TestHistoryContext';

// Combined hook for using all test-related functionality
export const useTest = () => {
  const responses = useTestResponses();
  const results = useTestResults();
  const history = useTestHistory();

  return {
    // From TestResponseContext
    responses: responses.responses,
    currentQuestionIndex: responses.currentQuestionIndex,
    addResponse: responses.addResponse,
    questions: responses.questions,
    getCurrentQuestion: responses.getCurrentQuestion,
    
    // From TestResultsContext
    results: results.results,
    categoryResults: results.categoryResults,
    calculateResults: results.calculateResults,
    getCategoryName: results.getCategoryName,
    getCurrentCategory: results.getCurrentCategory,
    
    // From TestHistoryContext
    testHistory: history.testHistory,
    fetchTestHistory: history.fetchTestHistory,
    loadingHistory: history.loadingHistory,
    
    // Combined functions for convenience
    resetTest: () => {
      responses.resetResponses();
      results.resetResults();
    }
  };
};

// Combined provider for all test-related contexts
export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <TestResponseProvider>
      <TestResultsProvider>
        <TestHistoryProvider>
          {children}
        </TestHistoryProvider>
      </TestResultsProvider>
    </TestResponseProvider>
  );
};
