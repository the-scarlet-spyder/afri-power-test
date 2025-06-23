
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface StrengthProgressBarProps {
  results: Array<{ strength: string; score: number; category: string }>;
  getCategoryName: (category: string) => string;
}

const StrengthProgressBar: React.FC<StrengthProgressBarProps> = ({ results, getCategoryName }) => {
  // Sort results by score (highest first)
  const sortedResults = [...results].sort((a, b) => b.score - a.score);

  const getScoreColor = (score: number) => {
    if (score >= 6) return 'bg-green-500';
    if (score >= 5) return 'bg-blue-500';
    if (score >= 4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 6) return 'Dominant';
    if (score >= 5) return 'Strong';
    if (score >= 4) return 'Moderate';
    return 'Developing';
  };

  return (
    <div className="space-y-4">
      {sortedResults.map((result, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-gray-900">{result.strength}</h4>
              <p className="text-sm text-gray-600">{getCategoryName(result.category)}</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">{result.score.toFixed(1)}/7</span>
              <p className={`text-xs font-medium ${
                result.score >= 6 ? 'text-green-600' :
                result.score >= 5 ? 'text-blue-600' :
                result.score >= 4 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {getScoreLabel(result.score)}
              </p>
            </div>
          </div>
          <Progress 
            value={(result.score / 7) * 100} 
            className="h-3"
            indicatorClassName={getScoreColor(result.score)}
          />
        </div>
      ))}
    </div>
  );
};

export default StrengthProgressBar;
