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
      <div ref={ref} className="bg-white max-w-4xl mx-auto">
        {/* Page 1: Cover Page */}
        <div className="page flex flex-col justify-center items-center text-center border-b">
          <div className="mb-8">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-inuka-crimson mb-2">Strengths Africa</h1>
            <p className="text-2xl text-gray-700">Advanced Talent Report</p>
          </div>

          <div className="my-12">
            <h2 className="text-3xl font-semibold mb-4">{userName}</h2>
            <p className="text-xl text-gray-600">Generated on {currentDate}</p>
            <p className="text-gray-500 mt-2">Report ID: {reportId}</p>
          </div>

          <div className="mt-auto pt-8">
            <p className="text-gray-500">Confidential Report • © 2024 Strengths Africa</p>
          </div>
        </div>

        {/* Page 2: Executive Summary */}
        <div className="page border-b">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-inuka-crimson mb-2">Executive Summary</h1>
            <Separator className="my-4" />
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed mb-6">
                This comprehensive analysis identifies your core talent patterns across 
                five key strength domains. Your unique profile reveals actionable insights 
                for personal and professional development.
              </p>

              <div className="bg-inuka-offwhite p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Key Highlights</h3>
                <ul className="space-y-3">
                  {topStrengths.map((strength, index) => (
                    <li key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                      <div className="flex items-center">
                        <span className="bg-inuka-crimson text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">
                          {index + 1}
                        </span>
                        <span>{strength.strength}</span>
                      </div>
                      <span className="font-medium bg-white px-3 py-1 rounded-full">
                        {strength.score.toFixed(1)}/7
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pattern Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Your strengths show a {topStrengths[0].score > 6 ? 'dominant' : 'balanced'} 
                  pattern with particular emphasis on {getCategoryName(topStrengths[0].category)} abilities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Development Potential</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Your top 3 strengths present opportunities for leadership development 
                  and specialized role alignment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Page 3: Detailed Analysis */}
        <div className="page border-b">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-inuka-crimson mb-2">Detailed Analysis</h1>
            <Separator className="my-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Strengths Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <StrengthsRadarChart results={results} getCategoryName={getCategoryName} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryBreakdownChart results={results} getCategoryName={getCategoryName} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Strength Benchmarking</CardTitle>
            </CardHeader>
            <CardContent>
              <StrengthProgressBar results={results} getCategoryName={getCategoryName} />
              <p className="text-sm text-gray-600 mt-4">
                Comparative analysis shows your strongest capabilities in {topStrengths[0].strength} 
                and {topStrengths[1].strength} relative to other domains.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Page 4: Recommendations */}
        <div className="page border-b">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-inuka-crimson mb-2">Development Plan</h1>
            <Separator className="my-4" />
          </div>

          <RecommendationsSection results={results} getCategoryName={getCategoryName} />

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Implementation Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="border-l-4 border-inuka-crimson pl-4">
                  <h3 className="font-semibold">Short-term (0-3 months)</h3>
                  <p className="text-sm mt-2">Focus on applying {topStrengths[0].strength} in daily workflows</p>
                </div>
                <div className="border-l-4 border-inuka-midnight pl-4">
                  <h3 className="font-semibold">Mid-term (3-6 months)</h3>
                  <p className="text-sm mt-2">Develop {topStrengths[1].strength} through mentorship</p>
                </div>
                <div className="border-l-4 border-inuka-sunshine pl-4">
                  <h3 className="font-semibold">Long-term (6+ months)</h3>
                  <p className="text-sm mt-2">Leadership integration of all top 5 strengths</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Page 5: Closing */}
        <div className="last-page">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-inuka-crimson mb-2">Next Steps</h1>
            <Separator className="my-4" />
          </div>

          <div className="flex-1 grid grid-cols-2 gap-8 mb-8">
            <Card className="bg-inuka-offwhite">
              <CardHeader>
                <CardTitle className="text-xl">Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start"><span className="mr-2">•</span><span>Strengths Development Workbook</span></li>
                  <li className="flex items-start"><span className="mr-2">•</span><span>Monthly Coaching Sessions</span></li>
                  <li className="flex items-start"><span className="mr-2">•</span><span>Online Learning Portal Access</span></li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Connect With Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Book your complimentary consultation:</p>
                <div className="space-y-2 text-sm">
                  <div>consulting@strengthsafrica.com</div>
                  <div>+27 21 123 4567</div>
                  <div>www.strengthsafrica.com</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-auto pt-12 text-center">
            <div className="mb-4">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-700 mb-2">Final Report • {userName}</p>
            <p className="text-sm text-gray-500">
              © 2024 Strengths Africa. Confidential document for {userName}.
              Unauthorized distribution prohibited.
            </p>
          </div>
        </div>
      </div>
    );
  }
);

AdvancedReport.displayName = 'AdvancedReport';
export default AdvancedReport;
