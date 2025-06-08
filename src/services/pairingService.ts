
import { questions, strengths } from '@/data/strengths';
import { Question, Strength } from '@/models/strength';

export interface StatementPair {
  id: string;
  questionA: Question;
  questionB: Question;
  traitA: Strength;
  traitB: Strength;
}

export interface PairResponse {
  pairId: string;
  score: number; // 1-7 where 1 is strongly A, 7 is strongly B
}

export interface TraitScore {
  traitId: string;
  totalScore: number;
  appearances: number;
}

// Function to create random pairs ensuring each trait appears fairly
export const createStatementPairs = (): StatementPair[] => {
  const pairs: StatementPair[] = [];
  const usedQuestions = new Set<string>();
  const traitAppearances = new Map<string, number>();
  
  // Initialize trait appearance counter
  strengths.forEach(strength => {
    traitAppearances.set(strength.id, 0);
  });
  
  // Create 50 pairs
  for (let i = 0; i < 50; i++) {
    let questionA: Question | null = null;
    let questionB: Question | null = null;
    let traitA: Strength | null = null;
    let traitB: Strength | null = null;
    
    let attempts = 0;
    const maxAttempts = 100;
    
    while ((!questionA || !questionB || traitA?.id === traitB?.id) && attempts < maxAttempts) {
      // Find available questions that haven't been used
      const availableQuestions = questions.filter(q => !usedQuestions.has(q.id));
      
      if (availableQuestions.length < 2) break;
      
      // Randomly select two questions
      const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
      const candidateA = shuffled[0];
      const candidateB = shuffled[1];
      
      const candidateTraitA = strengths.find(s => s.id === candidateA.strengthId);
      const candidateTraitB = strengths.find(s => s.id === candidateB.strengthId);
      
      // Ensure they're from different traits and neither trait has appeared too many times
      if (candidateTraitA && candidateTraitB && 
          candidateTraitA.id !== candidateTraitB.id &&
          (traitAppearances.get(candidateTraitA.id) || 0) < 6 &&
          (traitAppearances.get(candidateTraitB.id) || 0) < 6) {
        
        questionA = candidateA;
        questionB = candidateB;
        traitA = candidateTraitA;
        traitB = candidateTraitB;
      }
      
      attempts++;
    }
    
    if (questionA && questionB && traitA && traitB) {
      pairs.push({
        id: `pair-${i + 1}`,
        questionA,
        questionB,
        traitA,
        traitB
      });
      
      usedQuestions.add(questionA.id);
      usedQuestions.add(questionB.id);
      
      traitAppearances.set(traitA.id, (traitAppearances.get(traitA.id) || 0) + 1);
      traitAppearances.set(traitB.id, (traitAppearances.get(traitB.id) || 0) + 1);
    }
  }
  
  return pairs;
};

// Function to calculate scores from pair responses
export const calculateTraitScores = (responses: PairResponse[], pairs: StatementPair[]): TraitScore[] => {
  const traitScores = new Map<string, TraitScore>();
  
  // Initialize all traits
  strengths.forEach(strength => {
    traitScores.set(strength.id, {
      traitId: strength.id,
      totalScore: 0,
      appearances: 0
    });
  });
  
  // Process each response
  responses.forEach(response => {
    const pair = pairs.find(p => p.id === response.pairId);
    if (!pair) return;
    
    const score = response.score;
    let scoreA: number;
    let scoreB: number;
    
    // Assign points based on 7-point scale position
    switch (score) {
      case 1: // Strongly describes A
        scoreA = 6;
        scoreB = 0;
        break;
      case 2: // Moderately describes A
        scoreA = 5;
        scoreB = 1;
        break;
      case 3: // Slightly describes A
        scoreA = 4;
        scoreB = 2;
        break;
      case 4: // Neutral
        scoreA = 3;
        scoreB = 3;
        break;
      case 5: // Slightly describes B
        scoreA = 2;
        scoreB = 4;
        break;
      case 6: // Moderately describes B
        scoreA = 1;
        scoreB = 5;
        break;
      case 7: // Strongly describes B
        scoreA = 0;
        scoreB = 6;
        break;
      default:
        scoreA = 3;
        scoreB = 3;
    }
    
    // Add scores to traits
    const traitAScore = traitScores.get(pair.traitA.id);
    const traitBScore = traitScores.get(pair.traitB.id);
    
    if (traitAScore) {
      traitAScore.totalScore += scoreA;
      traitAScore.appearances += 1;
    }
    
    if (traitBScore) {
      traitBScore.totalScore += scoreB;
      traitBScore.appearances += 1;
    }
  });
  
  return Array.from(traitScores.values()).sort((a, b) => b.totalScore - a.totalScore);
};
