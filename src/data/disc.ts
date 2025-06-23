
export interface DiscQuestion {
  id: string;
  statementA: string;
  statementB: string;
  discMappingA: 'D' | 'I' | 'S' | 'C';
  discMappingB: 'D' | 'I' | 'S' | 'C';
}

export interface DiscResponse {
  questionId: string;
  scoreA: number; // 1-5 rating for statement A
  scoreB: number; // 1-5 rating for statement B
}

export interface DiscResult {
  D: number; // Dominance score
  I: number; // Influence score
  S: number; // Steadiness score
  C: number; // Conscientiousness score
  primaryStyle: 'D' | 'I' | 'S' | 'C';
  secondaryStyle: 'D' | 'I' | 'S' | 'C';
}

export const discQuestions: DiscQuestion[] = [
  {
    id: "disc-1",
    statementA: "I prefer direct, straightforward communication that gets to the point quickly",
    statementB: "I prefer warm, relationship-focused communication that considers feelings",
    discMappingA: 'D',
    discMappingB: 'I'
  },
  {
    id: "disc-2",
    statementA: "I make decisions quickly based on available information",
    statementB: "I take time to carefully analyze all details before deciding",
    discMappingA: 'D',
    discMappingB: 'C'
  },
  {
    id: "disc-3",
    statementA: "I gain energy from being around people and social interactions",
    statementB: "I prefer quiet, focused work environments with minimal interruptions",
    discMappingA: 'I',
    discMappingB: 'C'
  },
  {
    id: "disc-4",
    statementA: "I embrace change and enjoy trying new approaches",
    statementB: "I prefer stability and established procedures that work well",
    discMappingA: 'I',
    discMappingB: 'S'
  },
  {
    id: "disc-5",
    statementA: "I focus on finding quick, practical solutions to problems",
    statementB: "I focus on understanding root causes and long-term implications",
    discMappingA: 'D',
    discMappingB: 'C'
  },
  {
    id: "disc-6",
    statementA: "I naturally take charge and provide direction in group settings",
    statementB: "I prefer to support others and maintain group harmony",
    discMappingA: 'D',
    discMappingB: 'S'
  },
  {
    id: "disc-7",
    statementA: "I work quickly and prefer fast-paced environments",
    statementB: "I work steadily and prefer consistent, predictable pace",
    discMappingA: 'D',
    discMappingB: 'S'
  },
  {
    id: "disc-8",
    statementA: "I'm comfortable taking calculated risks for potential big rewards",
    statementB: "I prefer safe, proven approaches with predictable outcomes",
    discMappingA: 'D',
    discMappingB: 'S'
  },
  {
    id: "disc-9",
    statementA: "I address conflicts directly and assertively",
    statementB: "I try to avoid conflict and find peaceful solutions",
    discMappingA: 'D',
    discMappingB: 'S'
  },
  {
    id: "disc-10",
    statementA: "I'm motivated by achieving results and winning",
    statementB: "I'm motivated by helping others and building relationships",
    discMappingA: 'D',
    discMappingB: 'I'
  },
  {
    id: "disc-11",
    statementA: "I prefer high-level overviews and big picture thinking",
    statementB: "I prefer detailed information and thorough analysis",
    discMappingA: 'I',
    discMappingB: 'C'
  },
  {
    id: "disc-12",
    statementA: "I perform well under pressure and tight deadlines",
    statementB: "I perform best when I have adequate time to prepare",
    discMappingA: 'D',
    discMappingB: 'C'
  },
  {
    id: "disc-13",
    statementA: "I lead by taking control and making firm decisions",
    statementB: "I lead by inspiring and encouraging others",
    discMappingA: 'D',
    discMappingB: 'I'
  },
  {
    id: "disc-14",
    statementA: "I focus primarily on completing tasks and achieving goals",
    statementB: "I focus equally on tasks and maintaining good relationships",
    discMappingA: 'D',
    discMappingB: 'I'
  },
  {
    id: "disc-15",
    statementA: "I prefer verbal communication and face-to-face discussions",
    statementB: "I prefer written communication and documented details",
    discMappingA: 'I',
    discMappingB: 'C'
  },
  {
    id: "disc-16",
    statementA: "I readily volunteer for new projects and challenges",
    statementB: "I prefer to be asked or assigned to specific tasks",
    discMappingA: 'D',
    discMappingB: 'S'
  },
  {
    id: "disc-17",
    statementA: "I see rules as guidelines that can be bent when necessary",
    statementB: "I believe rules and procedures should be followed consistently",
    discMappingA: 'D',
    discMappingB: 'C'
  },
  {
    id: "disc-18",
    statementA: "I give direct, honest feedback even if it might upset someone",
    statementB: "I give gentle, considerate feedback that preserves relationships",
    discMappingA: 'D',
    discMappingB: 'I'
  },
  {
    id: "disc-19",
    statementA: "I thrive in competitive, results-driven environments",
    statementB: "I thrive in collaborative, supportive environments",
    discMappingA: 'D',
    discMappingB: 'S'
  },
  {
    id: "disc-20",
    statementA: "I prefer flexible schedules and spontaneous decisions",
    statementB: "I prefer structured schedules and planned activities",
    discMappingA: 'I',
    discMappingB: 'C'
  }
];

// DISC scoring calculation
export const calculateDiscResults = (responses: DiscResponse[]): DiscResult => {
  const scores = { D: 0, I: 0, S: 0, C: 0 };
  
  responses.forEach(response => {
    const question = discQuestions.find(q => q.id === response.questionId);
    if (!question) return;
    
    // Add scores based on question mapping
    scores[question.discMappingA] += response.scoreA;
    scores[question.discMappingB] += response.scoreB;
  });
  
  // Find primary and secondary styles
  const sortedStyles = Object.entries(scores)
    .sort(([,a], [,b]) => b - a)
    .map(([style]) => style as 'D' | 'I' | 'S' | 'C');
  
  return {
    D: scores.D,
    I: scores.I,
    S: scores.S,
    C: scores.C,
    primaryStyle: sortedStyles[0],
    secondaryStyle: sortedStyles[1]
  };
};

export const getDiscStyleName = (style: 'D' | 'I' | 'S' | 'C'): string => {
  const styleNames = {
    D: 'Dominance',
    I: 'Influence',
    S: 'Steadiness',
    C: 'Conscientiousness'
  };
  return styleNames[style];
};

export const getDiscStyleDescription = (style: 'D' | 'I' | 'S' | 'C'): string => {
  const descriptions = {
    D: 'Direct, decisive, and results-oriented. You prefer to take charge and drive outcomes.',
    I: 'Inspiring, interactive, and people-focused. You excel at motivating others and building relationships.',
    S: 'Steady, supportive, and reliable. You value stability and prefer collaborative environments.',
    C: 'Conscientious, careful, and detail-oriented. You focus on accuracy and systematic approaches.'
  };
  return descriptions[style];
};
