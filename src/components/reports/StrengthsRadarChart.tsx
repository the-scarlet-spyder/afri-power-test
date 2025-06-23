
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

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
    category: category.length > 15 ? category.substring(0, 12) + '...' : category,
    score: Math.round((data.total / data.count) * 10) / 10,
    fullMark: 7
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <PolarGrid 
            stroke="#E5E7EB" 
            strokeWidth={1}
            radialLines={true}
          />
          <PolarAngleAxis 
            dataKey="category" 
            className="text-xs font-medium"
            tick={{ fontSize: 11, fill: '#374151' }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 7]} 
            tick={{ fontSize: 10, fill: '#6B7280' }}
            tickCount={4}
            stroke="#9CA3AF"
            strokeWidth={1}
          />
          <Radar
            name="Strength Score"
            dataKey="score"
            stroke="#C92A2A"
            fill="#C92A2A"
            fillOpacity={0.25}
            strokeWidth={3}
            dot={{ r: 5, fill: '#C92A2A', strokeWidth: 2, stroke: '#FFFFFF' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{ fontSize: '12px', color: '#374151' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StrengthsRadarChart;
