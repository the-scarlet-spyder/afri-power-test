
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CategoryBreakdownChartProps {
  results: Array<{ strength: string; score: number; category: string }>;
  getCategoryName: (category: string) => string;
}

const COLORS = ['#C41E3A', '#2563EB', '#059669', '#D97706', '#7C3AED'];

const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({ results, getCategoryName }) => {
  // Group strengths by category and calculate totals
  const categoryData = results.reduce((acc, item) => {
    const categoryName = getCategoryName(item.category);
    if (!acc[categoryName]) {
      acc[categoryName] = { total: 0, count: 0 };
    }
    acc[categoryName].total += item.score;
    acc[categoryName].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const pieData = Object.entries(categoryData).map(([category, data], index) => ({
    name: category,
    value: Math.round((data.total / data.count) * 100) / 100,
    percentage: Math.round((data.total / data.count / 7) * 100)
  }));

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value.toFixed(1)}/7`, 'Average Score']}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryBreakdownChart;
