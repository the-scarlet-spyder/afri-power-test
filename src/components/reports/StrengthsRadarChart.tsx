
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface StrengthsRadarChartProps {
  results: Array<{ strength: string; score: number; category: string }>;
  getCategoryName: (category: string) => string;
}

const StrengthsRadarChart: React.FC<StrengthsRadarChartProps> = ({ results, getCategoryName }) => {
  // Group strengths by category and calculate average scores
  const categoryData = results.reduce((acc, item) => {
    const categoryName = getCategoryName(item.category);
    if (!acc[categoryName]) {
      acc[categoryName] = { total: 0, count: 0 };
    }
    acc[categoryName].total += item.score;
    acc[categoryName].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const radarData = Object.entries(categoryData).map(([category, data]) => ({
    category: category.replace(' & ', '\n& '),
    score: Math.round((data.total / data.count) * 10) / 10, // Round to 1 decimal
    fullMark: 7
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category" className="text-xs" />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 7]} 
            tick={false}
          />
          <Radar
            name="Strength Score"
            dataKey="score"
            stroke="#C41E3A"
            fill="#C41E3A"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StrengthsRadarChart;
