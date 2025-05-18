
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { UserResult } from '@/models/strength';

interface ResultsTopStrengthsProps {
  results: UserResult;
  getCategoryName: (category: string) => string;
  getCategoryCardClass: (category: string) => string;
  getCategoryBadgeClass: (category: string) => string;
}

const ResultsTopStrengths: React.FC<ResultsTopStrengthsProps> = ({ 
  results, 
  getCategoryName,
  getCategoryCardClass,
  getCategoryBadgeClass 
}) => {
  return (
    <div className="space-y-8">
      {results.topStrengths.map((item, index) => (
        <Card key={item.strength.id} className={`border-l-4 overflow-hidden shadow-md ${getCategoryCardClass(item.strength.category)}`}>
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div>
                <Badge className={`mb-2 ${getCategoryBadgeClass(item.strength.category)}`}>
                  {getCategoryName(item.strength.category)}
                </Badge>
                <CardTitle className="text-xl font-bold font-poppins">{index + 1}. {item.strength.name}</CardTitle>
                <CardDescription className="text-inuka-gold font-medium mt-1 italic">"{item.strength.tagline}"</CardDescription>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Strength Score:</span>
                <Progress 
                  value={(item.score / 5) * 100} 
                  className="w-24 h-2" 
                />
                <span className="text-sm font-medium ml-2">{item.score.toFixed(1)}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{item.strength.description}</p>
            <h4 className="font-semibold mb-2 text-inuka-crimson font-poppins">Recommendations:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {item.strength.recommendations.map((rec, i) => (
                <li key={i} className="text-gray-700">{rec}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ResultsTopStrengths;
