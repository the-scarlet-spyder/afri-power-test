
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CategoryResult } from '@/models/strength';

interface ResultsByCategoryProps {
  categoryResults: CategoryResult[];
  getCategoryCardClass: (category: string) => string;
  getCategoryColor: (category: string) => string;
}

const ResultsByCategory: React.FC<ResultsByCategoryProps> = ({ 
  categoryResults, 
  getCategoryCardClass,
  getCategoryColor 
}) => {
  return (
    <>
      {categoryResults && categoryResults.map((category) => (
        <div key={category.category} className="mb-10">
          <h2 className="text-xl font-bold text-inuka-crimson mb-4 flex items-center font-poppins">
            <span 
              className="w-4 h-4 rounded-full mr-2" 
              style={{ backgroundColor: getCategoryColor(category.category) }}
            ></span>
            {category.displayName}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.strengths.slice(0, 4).map((item) => (
              <Card key={item.strength.id} className={`border-l-4 shadow-sm ${getCategoryCardClass(item.strength.category)}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-bold font-poppins">{item.strength.name}</CardTitle>
                    <div className="flex items-center">
                      <Progress 
                        value={(item.score / 5) * 100} 
                        className="w-16 h-1" 
                      />
                      <span className="text-xs font-medium ml-1">{item.score.toFixed(1)}</span>
                    </div>
                  </div>
                  <CardDescription className="text-inuka-gold text-sm font-medium mt-1 italic">"{item.strength.tagline}"</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm text-gray-600">{item.strength.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default ResultsByCategory;
