
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Target, TrendingUp } from 'lucide-react';

interface RecommendationsSectionProps {
  results: Array<{ strength: string; score: number; category: string }>;
  getCategoryName: (category: string) => string;
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ results, getCategoryName }) => {
  // Get top 3 strengths
  const topStrengths = [...results].sort((a, b) => b.score - a.score).slice(0, 3);
  
  // Get areas for development (lowest 2 scores)
  const developmentAreas = [...results].sort((a, b) => a.score - b.score).slice(0, 2);

  const getRecommendations = (strength: string, category: string) => {
    // Simplified recommendations based on strength categories
    const recommendations: Record<string, string[]> = {
      'thinking-learning': [
        'Engage in continuous learning opportunities',
        'Seek intellectually challenging projects',
        'Share knowledge with others through teaching or mentoring'
      ],
      'interpersonal': [
        'Build and nurture professional relationships',
        'Practice active listening skills',
        'Volunteer for team collaboration projects'
      ],
      'leadership-influence': [
        'Take on leadership roles in projects',
        'Develop your public speaking skills',
        'Mentor junior colleagues'
      ],
      'execution-discipline': [
        'Set clear goals and deadlines for projects',
        'Develop systematic approaches to work',
        'Focus on consistency and reliability'
      ],
      'identity-purpose-values': [
        'Align your work with your core values',
        'Seek meaningful and purposeful projects',
        'Practice self-reflection and personal development'
      ]
    };

    return recommendations[category] || ['Focus on developing this strength area further'];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Leverage Your Top Strengths
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topStrengths.map((strength, index) => (
            <div key={index} className="border-l-4 border-green-500 pl-4">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold">{strength.strength}</h4>
                <Badge variant="secondary">{getCategoryName(strength.category)}</Badge>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                {getRecommendations(strength.strength, strength.category).map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Areas for Development
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {developmentAreas.map((strength, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold">{strength.strength}</h4>
                <Badge variant="outline">{getCategoryName(strength.category)}</Badge>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                {getRecommendations(strength.strength, strength.category).map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            Action Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-yellow-100 text-yellow-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
              <p className="text-sm">Focus on leveraging your top strength: <strong>{topStrengths[0]?.strength}</strong></p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-yellow-100 text-yellow-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
              <p className="text-sm">Seek opportunities that align with your dominant strengths in <strong>{getCategoryName(topStrengths[0]?.category)}</strong></p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-yellow-100 text-yellow-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
              <p className="text-sm">Gradually develop your <strong>{developmentAreas[0]?.strength}</strong> skills through targeted practice</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendationsSection;
