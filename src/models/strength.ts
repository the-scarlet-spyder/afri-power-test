
export interface Strength {
  id: string;
  name: string;
  tagline: string;
  description: string;
  recommendations: string[];
  category: StrengthCategory;
}

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
  score: number; // 1-5 (Likert scale)
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

