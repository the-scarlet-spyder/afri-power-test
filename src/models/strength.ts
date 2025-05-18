
export interface Strength {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: StrengthCategory;
  recommendations: string[];
}

// Changed from enum to string union type to match usage in data/strengths.ts
export type StrengthCategory = 
  | "thinking-learning" 
  | "interpersonal" 
  | "leadership-influence" 
  | "execution-discipline" 
  | "identity-purpose-values";

export interface Question {
  id: string;
  text: string;
  strengthId: string;
}

export interface UserResponse {
  questionId: string;
  score: number;
}

export interface UserResult {
  topStrengths: {
    strength: Strength;
    score: number;
  }[];
}

export interface CategoryResult {
  category: StrengthCategory;
  displayName: string;
  strengths: {
    strength: Strength;
    score: number;
  }[];
}

// Add this export for TestHistoryItem
export interface TestHistoryItem {
  id: string;
  responses: UserResponse[];
  results: UserResult;
  categoryResults: CategoryResult[];
  testDate: string;
}
