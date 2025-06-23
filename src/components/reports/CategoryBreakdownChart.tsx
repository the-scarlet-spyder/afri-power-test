
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CategoryBreakdownChartProps {
  data: Array<{ strength: string; score: number; category: string }>;
}

const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({ data }) => {
  // Group by category and calculate average scores
  const categoryData = data.reduce((acc, item) => {
    const existing = acc.find(cat => cat.category === item.category);
    if (existing) {
      existing.totalScore += item.score;
      existing.count += 1;
      existing.averageScore = existing.totalScore / existing.count;
    } else {
      acc.push({
        category: item.category,
        totalScore: item.score,
        count: 1,
        averageScore: item.score,
        displayName: getCategoryDisplayName(item.category)
      });
    }
    return acc;
  }, [] as Array<{ category: string; totalScore: number; count: number; averageScore: number; displayName: string }>);

  return (
    <div className="w-full" style={{ width: '100%', height: '300px', minHeight: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="displayName" 
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
            tick={{ fontSize: 10, fill: '#374151' }}
          />
          <YAxis 
            domain={[0, 5]}
            tick={{ fontSize: 10, fill: '#374151' }}
          />
          <Tooltip 
            formatter={(value: number) => [value.toFixed(2), 'Average Score']}
            labelFormatter={(label) => `Category: ${label}`}
          />
          <Bar 
            dataKey="averageScore" 
            fill="#C92A2A" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const getCategoryDisplayName = (category: string): string => {
  const categoryDisplayNames: Record<string, string> = {
    "thinking-learning": "Thinking & Learning",
    "interpersonal": "Interpersonal",
    "leadership-influence": "Leadership & Influence",
    "execution-discipline": "Execution & Discipline",
    "identity-purpose-values": "Identity, Purpose & Values"
  };
  return categoryDisplayNames[category] || category;
};

export default CategoryBreakdownChart;
