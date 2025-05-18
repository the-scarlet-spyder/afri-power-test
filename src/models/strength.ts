export interface Strength {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: StrengthCategory;
  recommendations: string[];
}

export enum StrengthCategory {
  THINKING_LEARNING = "thinking-learning",
  INTERPERSONAL = "interpersonal",
  LEADERSHIP_INFLUENCE = "leadership-influence",
  EXECUTION_DISCIPLINE = "execution-discipline",
  IDENTITY_PURPOSE_VALUES = "identity-purpose-values"
}

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
