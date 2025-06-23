
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
      <div ref={ref} className="bg-white font-inter">
        {/* Page 1: Enhanced Cover Page */}
        <div className="report-page flex flex-col justify-between bg-gradient-to-br from-inuka-offwhite via-white to-gray-50">
          <div className="flex-1 flex flex-col justify-center items-center text-center px-12">
            {/* Header with Logo Area */}
            <div className="mb-12">
              <div className="w-24 h-24 bg-gradient-to-br from-inuka-crimson to-red-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">SA</span>
              </div>
              <h1 className="text-5xl font-bold text-inuka-crimson mb-3 font-poppins">
                Strengths Africa
              </h1>
              <div className="w-32 h-1 bg-inuka-gold mx-auto mb-4"></div>
              <p className="text-2xl text-gray-700 font-medium">Advanced Talent Assessment Report</p>
            </div>

            {/* User Information Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 max-w-md w-full">
              <h2 className="text-3xl font-bold text-gray-800 mb-3 font-poppins">{userName}</h2>
              <div className="space-y-2 text-gray-600">
                <p className="text-lg">Assessment Date: {currentDate}</p>
                <p className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">ID: {reportId}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Total Strengths Assessed</span>
                  <span className="font-semibold">{results.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm">Confidential Report • © 2024 Strengths Africa • All Rights Reserved</p>
          </div>
        </div>

        {/* Page 2: Enhanced Executive Summary */}
        <div className="report-page">
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-2 h-12 bg-inuka-crimson mr-4"></div>
              <h1 className="text-4xl font-bold text-inuka-crimson font-poppins">Executive Summary</h1>
            </div>
            <Separator className="mb-8" />
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="col-span-2">
              <Card className="h-full border-l-4 border-l-inuka-crimson">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-800 font-poppins">Assessment Overview</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    This comprehensive strengths assessment has identified your unique talent patterns across five core domains. 
                    Your results reveal a distinctive profile that can guide strategic career decisions and personal development initiatives.
                  </p>
                  <div className="bg-gradient-to-r from-inuka-offwhite to-gray-50 p-5 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Key Insights</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-inuka-crimson rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Your strongest domain shows {topStrengths[0].score > 6 ? 'exceptional' : 'strong'} capabilities
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-inuka-gold rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Top 3 strengths present leadership development opportunities
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Balanced profile across multiple strength categories
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="mb-4 bg-gradient-to-br from-inuka-crimson to-red-600 text-white">
                <CardContent className="p-4 text-center">
                  <h4 className="font-bold text-lg mb-2">Overall Score</h4>
                  <div className="text-3xl font-bold">
                    {(results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1)}
                  </div>
                  <p className="text-sm opacity-90">Average Strength Rating</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-inuka-gold to-yellow-500 text-white">
                <CardContent className="p-4 text-center">
                  <h4 className="font-bold text-lg mb-2">Top Category</h4>
                  <div className="text-lg font-semibold leading-tight">
                    {getCategoryName(topStrengths[0].category)}
                  </div>
                  <p className="text-sm opacity-90 mt-1">{topStrengths[0].score.toFixed(1)}/7 Score</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-xl font-poppins text-gray-800">Top 5 Strengths Ranking</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {topStrengths.map((strength, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-inuka-crimson text-white rounded-full flex items-center justify-center font-bold mr-4">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{strength.strength}</h4>
                        <p className="text-sm text-gray-600">{getCategoryName(strength.category)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-inuka-crimson">{strength.score.toFixed(1)}</div>
                      <div className="text-xs text-gray-500">out of 7</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Page 3: Enhanced Detailed Analysis */}
        <div className="report-page">
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-2 h-12 bg-inuka-crimson mr-4"></div>
              <h1 className="text-4xl font-bold text-inuka-crimson font-poppins">Detailed Analysis</h1>
            </div>
            <Separator className="mb-8" />
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <Card className="border border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-inuka-crimson to-red-600 text-white">
                <CardTitle className="text-xl font-poppins">Strengths Radar Profile</CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <StrengthsRadarChart results={results} getCategoryName={getCategoryName} />
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Radar visualization showing your capability distribution across all strength domains
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-inuka-gold to-yellow-500 text-white">
                <CardTitle className="text-xl font-poppins">Category Distribution</CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <CategoryBreakdownChart results={results} getCategoryName={getCategoryName} />
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Proportional breakdown of your strengths by category
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-gray-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
              <CardTitle className="text-xl font-poppins">Comparative Strength Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Individual Strength Benchmarking</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Each strength is evaluated on a 7-point scale, with scores above 5.0 indicating strong natural abilities.
                </p>
              </div>
              <StrengthProgressBar results={results} getCategoryName={getCategoryName} />
            </CardContent>
          </Card>
        </div>

        {/* Page 4: Enhanced Development Plan */}
        <div className="report-page">
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-2 h-12 bg-inuka-crimson mr-4"></div>
              <h1 className="text-4xl font-bold text-inuka-crimson font-poppins">Development Roadmap</h1>
            </div>
            <Separator className="mb-8" />
          </div>

          <RecommendationsSection results={results} getCategoryName={getCategoryName} />

          <div className="mt-8 grid grid-cols-1 gap-6">
            <Card className="border border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-inuka-midnight to-gray-800 text-white">
                <CardTitle className="text-xl font-poppins">Implementation Timeline</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-600 font-bold text-xl">30</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Immediate Focus</h3>
                    <p className="text-sm text-gray-600">Apply {topStrengths[0].strength} in daily workflows and current projects</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold text-xl">90</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Short-term Development</h3>
                    <p className="text-sm text-gray-600">Develop {topStrengths[1].strength} through mentorship and training</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 font-bold text-xl">180</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Long-term Integration</h3>
                    <p className="text-sm text-gray-600">Leadership development using all top 5 strengths</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Page 5: Enhanced Next Steps */}
        <div className="report-page">
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-2 h-12 bg-inuka-crimson mr-4"></div>
              <h1 className="text-4xl font-bold text-inuka-crimson font-poppins">Next Steps & Resources</h1>
            </div>
            <Separator className="mb-8" />
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <Card className="border-l-4 border-l-inuka-gold shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-gray-800">Development Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-inuka-crimson rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Personalized Coaching Sessions</h4>
                    <p className="text-sm text-gray-600">One-on-one development with certified strengths coaches</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-inuka-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Interactive Workbook</h4>
                    <p className="text-sm text-gray-600">Structured exercises and reflection activities</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Online Learning Portal</h4>
                    <p className="text-sm text-gray-600">Video content, assessments, and progress tracking</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-inuka-crimson shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-gray-800">Get Started Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-inuka-offwhite to-gray-50 p-6 rounded-lg mb-4">
                  <h4 className="font-semibold mb-3">Schedule Your Consultation</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-inuka-crimson rounded-full mr-3"></span>
                      <span>consulting@strengthsafrica.com</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-inuka-gold rounded-full mr-3"></span>
                      <span>+27 21 123 4567</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-gray-500 rounded-full mr-3"></span>
                      <span>www.strengthsafrica.com</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-inuka-crimson text-white px-6 py-3 rounded-lg font-semibold">
                    Complimentary 30-Minute Session Available
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-inuka-offwhite p-8 rounded-xl border border-gray-200">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-inuka-crimson to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">SA</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 font-poppins">Your Strengths Journey Starts Here</h3>
              <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
                This assessment is your foundation for ongoing development. Remember that strengths grow through intentional practice and application.
              </p>
              <div className="flex justify-center space-x-8 text-sm text-gray-500">
                <span>Report ID: {reportId}</span>
                <span>Generated: {currentDate}</span>
                <span>Valid for: {userName}</span>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-300">
                <p className="text-xs text-gray-500">
                  © 2024 Strengths Africa. This report is confidential and intended solely for {userName}. 
                  Unauthorized distribution is prohibited.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

AdvancedReport.displayName = 'AdvancedReport';
export default AdvancedReport;
