
export interface ForcedChoiceResponse {
  questionId: number;
  value: number; // -3 to +3 (-3 = Strongly B, +3 = Strongly A)
  traitA: string;
  traitB: string;
}

export interface StrengthResult {
  trait: string;
  score: number;
  tagline: string;
  description: string;
  category: string;
}

export interface ForcedChoiceResults {
  topStrengths: StrengthResult[];
}
