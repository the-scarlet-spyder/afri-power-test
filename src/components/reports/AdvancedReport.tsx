
import React, { forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import StrengthsRadarChart from './StrengthsRadarChart';
import CategoryBreakdownChart from './CategoryBreakdownChart';
import StrengthProgressBar from './StrengthProgressBar';
import RecommendationsSection from './RecommendationsSection';
import { format } from 'date-fns';

interface AdvancedReportProps {
  userName: string;
  results: Array<{ strength: string; score: number; category: string }>;
  getCategoryName: (category: string) => string;
  reportId: string;
}

const AdvancedReport = forwardRef<HTMLDivElement, AdvancedReportProps>(
  ({ userName, results, getCategoryName, reportId }, ref) => {
    const currentDate = format(new Date(), "MMMM d, yyyy");
    const topStrengths = [...results].sort((a, b) => b.score - a.score).slice(0, 5);

    return (
      <div ref={ref} className="bg-white p-8 space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-bold text-inuka-crimson mb-2">
            Strengths Africa Advanced Report
          </h1>
          <p className="text-xl text-gray-700 mb-2">{userName}</p>
          <p className="text-gray-600">Generated on {currentDate}</p>
          <p className="text-sm text-gray-500 mt-2">Report ID: {reportId}</p>
        </div>

        {/* Executive Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-inuka-crimson">Executive Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              This comprehensive strengths assessment reveals your unique talent profile based on 
              detailed analysis across five key strength categories. Your results show distinct 
              patterns that can guide your personal and professional development.
            </p>
            <div className="bg-inuka-offwhite p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Your Top 5 Strengths:</h3>
              <ul className="space-y-1">
                {topStrengths.map((strength, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{strength.strength}</span>
                    <span className="font-medium">{strength.score.toFixed(1)}/7</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Strengths Overview Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-inuka-crimson">Strengths Profile Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <StrengthsRadarChart results={results} getCategoryName={getCategoryName} />
            <p className="text-sm text-gray-600 mt-4 text-center">
              This radar chart shows your average scores across all strength categories. 
              Larger areas indicate stronger performance in those categories.
            </p>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-inuka-crimson">Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryBreakdownChart results={results} getCategoryName={getCategoryName} />
            <p className="text-sm text-gray-600 mt-4 text-center">
              This chart illustrates how your strengths are distributed across different categories,
              helping you understand your dominant areas of talent.
            </p>
          </CardContent>
        </Card>

        {/* Detailed Strength Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-inuka-crimson">Detailed Strength Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <StrengthProgressBar results={results} getCategoryName={getCategoryName} />
          </CardContent>
        </Card>

        <Separator />

        {/* Recommendations */}
        <div>
          <h2 className="text-2xl font-bold text-inuka-crimson mb-6">Development Recommendations</h2>
          <RecommendationsSection results={results} getCategoryName={getCategoryName} />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 border-t pt-6">
          <p>© 2024 Strengths Africa. This report is confidential and intended solely for {userName}.</p>
          <p className="mt-1">For more information, visit www.strengthsafrica.com</p>
        </div>
      </div>
    );
  }
);

AdvancedReport.displayName = 'AdvancedReport';

export default AdvancedReport;
