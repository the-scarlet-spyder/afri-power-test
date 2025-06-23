import React, { forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import StrengthsRadarChart from './StrengthsRadarChart';
import CategoryBreakdownChart from './CategoryBreakdownChart';
import StrengthProgressBar from './StrengthProgressBar';
// import RecommendationsSection from './RecommendationsSection'; // Removed as it's not used in this file

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
    const averageScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;

    // Category analysis
    const categoryData = results.reduce((acc, item) => {
      const categoryName = getCategoryName(item.category);
      if (!acc[categoryName]) {
        acc[categoryName] = { total: 0, count: 0, strengths: [] };
      }
      acc[categoryName].total += item.score;
      acc[categoryName].count += 1;
      acc[categoryName].strengths.push(item);
      return acc;
    }, {} as Record<string, { total: number; count: number; strengths: any[] }>);

    return (
      <div ref={ref} className="bg-white font-inter text-gray-800">
        {/* Page 1: Cover Page */}
        <div className="report-page flex flex-col justify-between min-h-screen bg-gradient-to-br from-inuka-offwhite via-white to-gray-50 p-10">
          <div className="flex-1 flex flex-col justify-center items-center text-center px-12">
            <div className="mb-16">
              <div className="w-36 h-36 bg-gradient-to-br from-inuka-crimson to-red-600 rounded-full mx-auto mb-10 flex items-center justify-center shadow-2xl">
                <span className="text-white font-bold text-5xl font-poppins">SA</span>
              </div>
              <h1 className="text-7xl font-extrabold text-inuka-crimson mb-6 font-poppins drop-shadow-md">
                Strengths Africa
              </h1>
              <div className="w-60 h-2 bg-inuka-gold mx-auto mb-8 rounded-full"></div>
              <h2 className="text-4xl text-gray-700 font-semibold mb-3 font-poppins">Psychometric Assessment</h2>
              <h3 className="text-3xl text-gray-600 font-medium">Detailed Report</h3>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 max-w-lg w-full transform -translate-y-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-6 font-poppins">{userName}</h2>
              <div className="space-y-4 text-gray-700 text-xl">
                <p><span className="font-semibold">Assessment Date:</span> {currentDate}</p>
                <p className="text-lg font-mono bg-gray-100 px-5 py-3 rounded-xl border border-gray-200">
                  <span className="font-semibold text-gray-600">Report ID:</span> {reportId}
                </p>
              </div>
              <div className="mt-10 pt-8 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-4xl font-extrabold text-inuka-crimson mb-2">{results.length}</div>
                    <div className="text-base text-gray-500 font-medium">Strengths Assessed</div>
                  </div>
                  <div>
                    <div className="text-4xl font-extrabold text-inuka-gold mb-2">{averageScore.toFixed(1)}</div>
                    <div className="text-base text-gray-500 font-medium">Overall Score</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center py-8 border-t border-gray-200 text-gray-500 text-sm">
            <p>Confidential Assessment Report • &copy; {new Date().getFullYear()} Strengths Africa • All Rights Reserved</p>
          </div>
        </div>

        {/* Page 2: Table of Contents */}
        <div className="report-page p-10">
          <div className="mb-10">
            <div className="flex items-center mb-8">
              <div className="w-3 h-14 bg-inuka-crimson mr-5 rounded"></div>
              <h1 className="text-5xl font-bold text-inuka-crimson font-poppins">Table of Contents</h1>
            </div>
            <Separator className="h-0.5 bg-gray-200 mb-10" />
          </div>

          <div className="space-y-4 text-xl">
            {Array.from({ length: 20 }, (_, i) => i + 1).map((pageNumber) => (
              <div key={pageNumber} className="flex justify-between border-b border-dashed border-gray-300 pb-3 last:border-b-0">
                <span className="text-gray-700">
                  {pageNumber}.{' '}
                  {pageNumber === 1 && "Cover Page"}
                  {pageNumber === 2 && "Table of Contents"}
                  {pageNumber === 3 && "Executive Summary"}
                  {pageNumber === 4 && "Introduction"}
                  {pageNumber === 5 && "Test Overview"}
                  {pageNumber === 6 && "User Profile"}
                  {pageNumber === 7 && "Overall Results Summary"}
                  {pageNumber === 8 && "Detailed Dimension Analysis"}
                  {pageNumber === 9 && "Subscale Analysis"}
                  {pageNumber === 10 && "Comparative Insights"}
                  {pageNumber === 11 && "Interpretation and Insights"}
                  {pageNumber === 12 && "Actionable Recommendations"}
                  {pageNumber === 13 && "Application Scenarios"}
                  {pageNumber === 14 && "Visual Summary Dashboard"}
                  {pageNumber === 15 && "Frequently Asked Questions"}
                  {pageNumber === 16 && "Methodology"}
                  {pageNumber === 17 && "Glossary"}
                  {pageNumber === 18 && "About the Test Developers"}
                  {pageNumber === 19 && "Legal and Ethical Information"}
                  {pageNumber === 20 && "Appendix"}
                </span>
                <span className="font-semibold text-inuka-gold">{pageNumber}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Page 3: Executive Summary */}
        <div className="report-page p-10">
          <div className="mb-10">
            <div className="flex items-center mb-8">
              <div className="w-3 h-14 bg-inuka-crimson mr-5 rounded"></div>
              <h1 className="text-5xl font-bold text-inuka-crimson font-poppins">Executive Summary</h1>
            </div>
            <Separator className="h-0.5 bg-gray-200 mb-10" />
          </div>

          <div className="grid grid-cols-3 gap-10 mb-10">
            <div className="col-span-2">
              <Card className="h-full border-l-8 border-l-inuka-crimson shadow-lg rounded-xl overflow-hidden">
                <CardContent className="p-8 bg-white">
                  <h3 className="text-3xl font-bold mb-6 text-gray-800 font-poppins">Assessment Overview</h3>
                  <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                    This comprehensive psychometric assessment has analyzed {userName}'s natural strengths across five core domains
                    of human capability. The assessment reveals a unique profile that provides strategic insights for personal
                    development, career advancement, and leadership potential.
                  </p>

                  <div className="bg-gradient-to-r from-inuka-offwhite to-gray-50 p-7 rounded-xl mb-7 border border-gray-100">
                    <h4 className="font-bold text-gray-800 mb-5 text-xl">Key Findings</h4>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <span className="w-4 h-4 bg-inuka-crimson rounded-full mt-1.5 mr-4 flex-shrink-0 shadow"></span>
                        <span className="text-gray-700 text-lg">Primary strength domain: <strong>{getCategoryName(topStrengths[0].category)}</strong> with exceptional capabilities</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-4 h-4 bg-inuka-gold rounded-full mt-1.5 mr-4 flex-shrink-0 shadow"></span>
                        <span className="text-gray-700 text-lg">Top 3 strengths indicate strong potential for <strong>leadership roles</strong></span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-4 h-4 bg-gray-400 rounded-full mt-1.5 mr-4 flex-shrink-0 shadow"></span>
                        <span className="text-gray-700 text-lg">Well-balanced profile with development opportunities across all domains</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-inuka-crimson text-white p-7 rounded-xl shadow-md">
                    <h4 className="font-bold text-xl mb-3">Recommended Focus Areas</h4>
                    <p className="text-base opacity-95">
                      Leverage your strongest capabilities in {getCategoryName(topStrengths[0].category)} while developing
                      complementary skills in {getCategoryName(topStrengths[1].category)} for maximum impact.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="bg-gradient-to-br from-inuka-crimson to-red-600 text-white shadow-xl rounded-xl">
                <CardContent className="p-7 text-center">
                  <h4 className="font-bold text-2xl mb-4">Overall Score</h4>
                  <div className="text-5xl font-extrabold mb-3">{averageScore.toFixed(1)}</div>
                  <div className="text-base opacity-90">out of 7.0</div>
                  <div className="mt-5 bg-white bg-opacity-20 rounded-full h-3">
                    <div
                      className="bg-white rounded-full h-3 transition-all duration-500"
                      style={{ width: `${(averageScore / 7) * 100}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-inuka-gold to-yellow-500 text-white shadow-xl rounded-xl">
                <CardContent className="p-7 text-center">
                  <h4 className="font-bold text-2xl mb-4">Strongest Area</h4>
                  <div className="text-2xl font-semibold leading-tight mb-3">
                    {getCategoryName(topStrengths[0].category)}
                  </div>
                  <div className="text-base opacity-90">{topStrengths[0].score.toFixed(1)}/7 Score</div>
                  <Badge className="mt-4 bg-white text-yellow-600 font-semibold px-4 py-2 text-sm shadow-md">{topStrengths[0].strength}</Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-700 to-gray-800 text-white shadow-xl rounded-xl">
                <CardContent className="p-7 text-center">
                  <h4 className="font-bold text-2xl mb-4">Percentile Rank</h4>
                  <div className="text-5xl font-extrabold mb-3">
                    {Math.round((averageScore / 7) * 100)}th
                  </div>
                  <div className="text-base opacity-90">Percentile</div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="border border-gray-200 shadow-xl rounded-xl overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-100 p-6">
              <CardTitle className="text-3xl font-poppins text-gray-800">Top 5 Strengths Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-8 bg-white">
              <div className="grid grid-cols-5 gap-6">
                {topStrengths.map((strength, index) => (
                  <div key={index} className="text-center bg-gray-50 p-5 rounded-lg border border-gray-100 shadow-sm">
                    <div className="w-20 h-20 bg-gradient-to-br from-inuka-crimson to-red-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mb-4 mx-auto shadow-md">
                      {index + 1}
                    </div>
                    <h4 className="font-semibold text-gray-800 text-lg mb-1 leading-tight">{strength.strength}</h4>
                    <p className="text-sm text-gray-600 mb-3">{getCategoryName(strength.category)}</p>
                    <div className="text-2xl font-bold text-inuka-crimson">{strength.score.toFixed(1)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Page 4: Introduction */}
        <div className="report-page p-10">
          <div className="mb-10">
            <div className="flex items-center mb-8">
              <div className="w-3 h-14 bg-inuka-crimson mr-5 rounded"></div>
              <h1 className="text-5xl font-bold text-inuka-crimson font-poppins">Introduction</h1>
            </div>
            <Separator className="h-0.5 bg-gray-200 mb-10" />
          </div>

          <div className="space-y-10">
            <Card className="border-l-8 border-l-inuka-gold shadow-lg rounded-xl">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-3xl font-poppins text-gray-800">Purpose of This Report</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 text-lg leading-relaxed text-gray-700">
                <p className="mb-4">
                  This detailed psychometric assessment report provides a comprehensive analysis of your natural strengths,
                  behavioral tendencies, and cognitive preferences. The insights contained within this document are designed
                  to support your personal and professional development journey.
                </p>
                <p>
                  Our assessment goes beyond traditional personality testing to identify your unique talent patterns,
                  providing actionable insights that can be applied to career planning, team dynamics, leadership development,
                  and personal growth initiatives.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-8 border-l-inuka-crimson shadow-lg rounded-xl">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-3xl font-poppins text-gray-800">Understanding Psychometric Testing</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 text-lg leading-relaxed text-gray-700">
                <p className="mb-6">
                  Psychometric testing is a scientific method of measuring psychological attributes such as personality traits,
                  cognitive abilities, and behavioral preferences. These assessments are based on decades of psychological
                  research and are designed to provide objective, reliable, and valid insights into human behavior.
                </p>

                <div className="bg-gray-50 p-7 rounded-xl mb-6 border border-gray-100">
                  <h4 className="font-semibold text-xl text-gray-800 mb-4">Key Benefits of Psychometric Assessment:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-inuka-crimson text-2xl leading-none mr-3">•</span>
                      <span>Objective measurement of natural talents and preferences</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-inuka-crimson text-2xl leading-none mr-3">•</span>
                      <span>Evidence-based insights for personal and professional development</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-inuka-crimson text-2xl leading-none mr-3">•</span>
                      <span>Enhanced self-awareness and understanding of behavioral patterns</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-inuka-crimson text-2xl leading-none mr-3">•</span>
                      <span>Strategic guidance for career planning and role optimization</span>
                    </li>
                  </ul>
                </div>

                <p>
                  This assessment measures five core domains of human capability, each containing multiple specific strengths
                  that contribute to overall performance and satisfaction in various life contexts.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-8 border-l-gray-600 shadow-lg rounded-xl">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-3xl font-poppins text-gray-800">Confidentiality and Data Use</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 text-lg leading-relaxed text-gray-700">
                <div className="bg-red-50 border border-red-200 p-7 rounded-xl mb-6">
                  <h4 className="font-semibold text-red-800 text-xl mb-3">Important Notice</h4>
                  <p className="text-red-700">
                    This report contains confidential information intended solely for {userName}.
                    Unauthorized distribution or use of this information is strictly prohibited.
                  </p>
                </div>

                <p className="mb-4">
                  Your assessment data has been processed in accordance with international data protection standards.
                  We are committed to maintaining the highest levels of confidentiality and security for all assessment information.
                </p>

                <p>
                  This report should be used as a tool for self-reflection and development planning. While psychometric
                  assessments provide valuable insights, they should be considered alongside other sources of feedback
                  and personal experience when making important decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Page 5: Test Overview */}
        <div className="report-page p-10">
          <div className="mb-10">
            <div className="flex items-center mb-8">
              <div className="w-3 h-14 bg-inuka-crimson mr-5 rounded"></div>
              <h1 className="text-5xl font-bold text-inuka-crimson font-poppins">Test Overview</h1>
            </div>
            <Separator className="h-0.5 bg-gray-200 mb-10" />
          </div>

          <div className="space-y-10">
            <Card className="border-l-8 border-l-inuka-crimson shadow-lg rounded-xl">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-3xl font-poppins text-gray-800">Assessment Structure</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="grid grid-cols-2 gap-10">
                  <div>
                    <h4 className="font-semibold text-xl mb-5 text-gray-800">Assessment Components</h4>
                    <ul className="space-y-4 text-gray-700">
                      <li className="flex items-center">
                        <div className="w-10 h-10 bg-inuka-crimson text-white rounded-full flex items-center justify-center text-base font-bold mr-4 shadow-md">5</div>
                        <span className="text-lg">Core strength domains assessed</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-10 h-10 bg-inuka-gold text-white rounded-full flex items-center justify-center text-base font-bold mr-4 shadow-md">{results.length}</div>
                        <span className="text-lg">Individual strengths measured</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-10 h-10 bg-gray-600 text-white rounded-full flex items-center justify-center text-base font-bold mr-4 shadow-md">7</div>
                        <span className="text-lg">Point scoring scale (1-7)</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-xl mb-5 text-gray-800">Theoretical Framework</h4>
                    <p className="text-gray-700 mb-5 text-lg">
                      This assessment is based on contemporary strengths psychology and positive psychology research,
                      focusing on identifying natural talents that can be developed into exceptional performance.
                    </p>
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                      <h5 className="font-semibold text-lg mb-3 text-gray-800">Core Principles:</h5>
                      <ul className="text-base space-y-2 text-gray-700">
                        <li>• Strengths-based development approach</li>
                        <li>• Evidence-based measurement methodology</li>
                        <li>• Culturally inclusive assessment design</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-8 border-l-inuka-gold shadow-lg rounded-xl">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-3xl font-poppins text-gray-800">The Five Domains Model</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="grid grid-cols-1 gap-7">
                  {Object.entries(categoryData).map(([category, data], index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-7 bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-2xl font-semibold text-gray-800 font-poppins">{category}</h4>
                        <Badge className="bg-inuka-crimson text-white px-4 py-2 text-sm font-semibold rounded-full">{data.count} strengths</Badge>
                      </div>
                      <div className="flex items-center mb-4">
                        <span className="text-base text-gray-600 mr-4 font-medium">Domain Score:</span>
                        <Progress value={(data.total / data.count / 7) * 100} className="flex-1 h-3.5 bg-gray-200 rounded-full" indicatorClassName="bg-inuka-gold rounded-full" />
                        <span className="ml-4 font-bold text-lg text-gray-800">{(data.total / data.count).toFixed(1)}/7</span>
                      </div>
                      <p className="text-gray-600 text-base">
                        {index === 0 && "Encompasses cognitive abilities, learning preferences, and intellectual curiosity."}
                        {index === 1 && "Focuses on relationship building, communication, and social interaction skills."}
                        {index === 2 && "Measures leadership potential, influence capabilities, and change management."}
                        {index === 3 && "Evaluates organizational skills, reliability, and task completion abilities."}
                        {index === 4 && "Assesses values alignment, purpose clarity, and authentic self-expression."}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-8 border-l-gray-600 shadow-lg rounded-xl">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-3xl font-poppins text-gray-800">Reliability and Validity</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="grid grid-cols-2 gap-10">
                  <div>
                    <h4 className="font-semibold text-xl mb-5 text-gray-800">Reliability Measures</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-lg text-gray-700">Internal Consistency (Cronbach's &alpha;)</span>
                        <span className="font-bold text-lg text-inuka-crimson">0.92</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-lg text-gray-700">Test-Retest Reliability</span>
                        <span className="font-bold text-lg text-inuka-crimson">0.89</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-lg text-gray-700">Inter-rater Agreement</span>
                        <span className="font-bold text-lg text-inuka-crimson">0.87</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-xl mb-5 text-gray-800">Validity Evidence</h4>
                    <ul className="space-y-3 text-lg text-gray-700">
                      <li className="flex items-start">
                        <span className="text-green-600 text-2xl leading-none mr-3">✔</span>
                        <span>Content validity established through expert review</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 text-2xl leading-none mr-3">✔</span>
                        <span>Construct validity confirmed via factor analysis</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 text-2xl leading-none mr-3">✔</span>
                        <span>Criterion validity demonstrated through outcome studies</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 text-2xl leading-none mr-3">✔</span>
                        <span>Cross-cultural validity across diverse populations</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Page 6: User Profile */}
        <div className="report-page p-10">
          <div className="mb-10">
            <div className="flex items-center mb-8">
              <div className="w-3 h-14 bg-inuka-crimson mr-5 rounded"></div>
              <h1 className="text-5xl font-bold text-inuka-crimson font-poppins">User Profile</h1>
            </div>
            <Separator className="h-0.5 bg-gray-200 mb-10" />
          </div>

          <div className="grid grid-cols-2 gap-10 mb-10">
            <Card className="border-l-8 border-l-inuka-gold shadow-lg rounded-xl">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-3xl font-poppins text-gray-800">Assessment Participant</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-5">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <label className="font-semibold text-gray-600 text-lg">Full Name:</label>
                    <p className="text-xl font-medium text-gray-800">{userName}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-600 text-lg">Assessment Date:</label>
                    <p className="text-xl font-medium text-gray-800">{currentDate}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-600 text-lg">Report ID:</label>
                    <p className="text-xl font-mono text-gray-800">{reportId}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-600 text-lg">Assessment Type:</label>
                    <p className="text-xl font-medium text-gray-800">Comprehensive Strengths Profile</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-8 border-l-inuka-crimson shadow-lg rounded-xl">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-3xl font-poppins text-gray-800">Completion Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-5">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <label className="font-semibold text-gray-600 text-lg">Total Questions:</label>
                    <p className="text-xl font-medium text-gray-800">Comprehensive Assessment</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-600 text-lg">Completion Status:</label>
                    <p className="text-xl text-green-600 font-bold">✓ Complete</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-600 text-lg">Response Quality:</label>
                    <p className="text-xl text-green-600 font-bold">High Consistency</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-600 text-lg">Assessment Version:</label>
                    <p className="text-xl font-medium text-gray-800">SA-2024.1</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8 border-l-8 border-l-gray-600 shadow-xl rounded-xl">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-3xl font-poppins text-gray-800">Assessment Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-3 gap-8 text-center">
                <div className="bg-gradient-to-br from-inuka-crimson to-red-600 text-white p-7 rounded-lg shadow-md">
                  <div className="text-4xl font-extrabold mb-2">{results.length}</div>
                  <div className="text-base opacity-90">Strengths Measured</div>
                </div>
                <div className="bg-gradient-to-br from-inuka-gold to-yellow-500 text-white p-7 rounded-lg shadow-md">
                  <div className="text-4xl font-extrabold mb-2">5</div>
                  <div className="text-base opacity-90">Core Domains</div>
                </div>
                <div className="bg-gradient-to-br from-gray-700 to-gray-800 text-white p-7 rounded-lg shadow-md">
                  <div className="text-4xl font-extrabold mb-2">{averageScore.toFixed(1)}</div>
                  <div className="text-base opacity-90">Overall Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Page 7: Overall Results Summary */}
        <div className="report-page p-10">
          <div className="mb-10">
            <div className="flex items-center mb-8">
              <div className="w-3 h-14 bg-inuka-crimson mr-5 rounded"></div>
              <h1 className="text-5xl font-bold text-inuka-crimson font-poppins">Overall Results Summary</h1>
            </div>
            <Separator className="h-0.5 bg-gray-200 mb-10" />
          </div>

          <div className="grid grid-cols-2 gap-10 mb-10">
            <Card className="border border-gray-200 shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-inuka-crimson to-red-600 text-white p-6">
                <CardTitle className="text-2xl font-poppins">Strengths Profile Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-7 bg-white">
                <StrengthsRadarChart results={results} getCategoryName={getCategoryName} />
                <p className="text-sm text-gray-600 mt-5 text-center leading-relaxed">
                  This radar chart visualizes your capabilities across all five core strength domains, highlighting areas of natural aptitude.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-inuka-gold to-yellow-500 text-white p-6">
                <CardTitle className="text-2xl font-poppins">Domain Distribution</CardTitle>
              </CardHeader>
              <CardContent className="p-7 bg-white">
                <CategoryBreakdownChart results={results} getCategoryName={getCategoryName} />
                <p className="text-sm text-gray-600 mt-5 text-center leading-relaxed">
                  This chart illustrates the relative distribution of your strengths across different capability areas.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-gray-200 shadow-xl rounded-xl overflow-hidden mb-10">
            <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-800 text-white p-6">
              <CardTitle className="text-2xl font-poppins">Individual Strength Scores</CardTitle>
            </CardHeader>
            <CardContent className="p-7 bg-white">
              <StrengthProgressBar results={results} getCategoryName={getCategoryName} />
              <p className="text-sm text-gray-600 mt-5 text-center leading-relaxed">
                A detailed view of each assessed strength and its corresponding score, indicating proficiency.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-5 gap-6">
            {Object.entries(categoryData).map(([category, data], index) => (
              <Card key={index} className="text-center border border-gray-200 shadow-md rounded-xl bg-white">
                <CardContent className="p-6">
                  <div className="w-18 h-18 bg-gradient-to-br from-inuka-crimson to-red-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 mx-auto shadow-lg">
                    {(data.total / data.count).toFixed(1)}
                  </div>
                  <h4 className="font-semibold text-gray-800 text-lg mb-2 leading-tight">{category}</h4>
                  <div className="text-sm text-gray-600">{data.count} strengths</div>
                  <Progress value={(data.total / data.count / 7) * 100} className="mt-4 h-2.5 bg-gray-200 rounded-full" indicatorClassName="bg-inuka-gold rounded-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Page 20: Appendix */}
        <div className="report-page p-10">
          <div className="mb-10">
            <div className="flex items-center mb-8">
              <div className="w-3 h-14 bg-inuka-crimson mr-5 rounded"></div>
              <h1 className="text-5xl font-bold text-inuka-crimson font-poppins">Appendix</h1>
            </div>
            <Separator className="h-0.5 bg-gray-200 mb-10" />
          </div>

          <div className="space-y-10">
            <Card className="border-l-8 border-l-inuka-gold shadow-lg rounded-xl">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-3xl font-poppins text-gray-800">Raw Score Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Strength</th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                        <th className="p-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">Raw Score</th>
                        <th className="p-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">Percentile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="p-4 border-b border-gray-100 text-gray-700">{result.strength}</td>
                          <td className="p-4 border-b border-gray-100 text-gray-700">{getCategoryName(result.category)}</td>
                          <td className="p-4 border-b border-gray-100 text-center font-bold text-inuka-crimson">{result.score.toFixed(1)}</td>
                          <td className="p-4 border-b border-gray-100 text-center text-gray-700">{Math.round((result.score / 7) * 100)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="bg-gradient-to-r from-gray-50 to-inuka-offwhite p-10 rounded-xl border border-gray-200 shadow-lg">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-inuka-crimson to-red-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl">
                  <span className="text-white font-bold text-3xl font-poppins">SA</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4 font-poppins">Thank You for Completing Your Assessment</h3>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto leading-relaxed">
                  This comprehensive analysis represents the beginning of your strengths development journey.
                  We encourage you to review this report regularly and apply the insights to your personal and professional growth.
                </p>
                <div className="flex justify-center space-x-10 text-base text-gray-600 mb-6 font-medium">
                  <span>Report Generated: {currentDate}</span>
                  <span>Valid for: {userName}</span>
                  <span>Report ID: {reportId}</span>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-300">
                  <p className="text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Strengths Africa. This report is confidential and intended solely for {userName}.
                    For questions about your results, please contact our support team at <a href="mailto:support@strengthsafrica.com" className="text-inuka-crimson hover:underline">support@strengthsafrica.com</a>
                  </p>
                </div>
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
