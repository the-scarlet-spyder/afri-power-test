
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface StrengthsRadarChartProps {
  data: Array<{ strength: string; score: number; category: string }>;
}

const StrengthsRadarChart: React.FC<StrengthsRadarChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    subject: item.strength,
    A: item.score,
    fullMark: 5
  }));

  return (
    <div className="w-full" style={{ width: '100%', height: '400px', minHeight: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fontSize: 12, fill: '#374151' }}
            className="text-sm"
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 5]} 
            tick={{ fontSize: 10, fill: '#6B7280' }}
          />
          <Radar
            name="Strength Score"
            dataKey="A"
            stroke="#C92A2A"
            fill="#C92A2A"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StrengthsRadarChart;
