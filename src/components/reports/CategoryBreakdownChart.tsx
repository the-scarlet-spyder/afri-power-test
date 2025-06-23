
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CategoryBreakdownChartProps {
  results: Array<{ strength: string; score: number; category: string }>;
  getCategoryName: (category: string) => string;
}

const COLORS = ['#C92A2A', '#2563EB', '#059669', '#D97706', '#7C3AED'];

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
    name: category.length > 20 ? category.substring(0, 17) + '...' : category,
    value: Math.round((data.total / data.count) * 100) / 100,
    percentage: Math.round((data.total / data.count / 7) * 100),
    count: data.count
  }));

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show labels for very small slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="11"
        fontWeight="bold"
        stroke="#000000"
        strokeWidth={0.5}
        paintOrder="stroke"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">Average Score: {data.value.toFixed(1)}/7</p>
          <p className="text-sm text-gray-600">Strengths: {data.count}</p>
          <p className="text-sm text-gray-600">Percentage: {data.percentage}%</p>
        </div>
      );
    }
    return null;
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
            outerRadius={90}
            innerRadius={30}
            fill="#8884d8"
            dataKey="value"
            stroke="#FFFFFF"
            strokeWidth={2}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{ fontSize: '11px', color: '#374151', paddingTop: '10px' }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryBreakdownChart;
