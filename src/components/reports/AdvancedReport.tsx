import React, { forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
    console.log("AdvancedReport received results:", results);
    
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
      <div ref={ref} className="bg-white font-inter" id="advanced-report" style={{ display: 'none' }}>
        {/* Page 1: Cover Page */}
        <div className="report-page min-h-screen p-12 flex flex-col justify-center items-center bg-gradient-to-br from-white via-gray-50 to-inuka-offwhite">
          <div className="text-center space-y-8 max-w-2xl">
            {/* Logo and Branding */}
            <div className="mb-12">
              <div className="w-32 h-32 bg-gradient-to-br from-inuka-crimson to-red-600 rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl">
                <span className="text-white font-bold text-4xl">SA</span>
              </div>
              <h1 className="text-6xl font-bold text-inuka-crimson mb-4 font-poppins">
                Strengths Africa
              </h1>
              <div className="w-40 h-1 bg-inuka-gold mx-auto mb-6"></div>
              <h2 className="text-3xl text-gray-700 font-semibold mb-3">Psychometric Assessment</h2>
              <h3 className="text-2xl text-gray-600 font-medium">Detailed Report</h3>
            </div>

            {/* User Information Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 max-w-lg w-full">
              <h2 className="text-4xl font-bold text-gray-800 mb-8 font-poppins">{userName}</h2>
              <div className="space-y-6 text-gray-600">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-lg">Assessment Date:</span>
                  <span className="text-lg">{currentDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-lg">Report ID:</span>
                  <span className="font-mono text-sm bg-gray-100 px-3 py-2 rounded">{reportId}</span>
                </div>
                <Separator className="my-6" />
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-inuka-crimson">{results.length}</div>
                    <div className="text-sm text-gray-500">Strengths Assessed</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-inuka-gold">{averageScore.toFixed(1)}</div>
                    <div className="text-sm text-gray-500">Overall Score</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-16">
              <p className="text-gray-500 text-sm">Confidential Assessment Report • © 2024 Strengths Africa • All Rights Reserved</p>
            </div>
          </div>
        </div>

        {/* Page 2: Executive Summary */}
        <div className="report-page min-h-screen p-12 bg-white">
          <div className="mb-12">
            <div className="flex items-center mb-8">
              <div className="w-2 h-16 bg-inuka-crimson mr-6"></div>
              <h1 className="text-5xl font-bold text-inuka-crimson font-poppins">Executive Summary</h1>
            </div>
            <Separator className="mb-12" />
          </div>

          <div className="grid grid-cols-3 gap-10 mb-12">
            <div className="col-span-2">
              <Card className="h-full border-l-4 border-l-inuka-crimson shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="text-3xl font-poppins text-gray-800">Assessment Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <p className="text-gray-700 leading-relaxed text-xl">
                    This comprehensive psychometric assessment has analyzed {userName}'s natural strengths across five core domains 
                    of human capability. The assessment reveals a unique profile that provides strategic insights for personal 
                    development, career advancement, and leadership potential.
                  </p>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-6 text-xl">Key Findings</h4>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <span className="w-4 h-4 bg-inuka-crimson rounded-full mt-2 mr-6 flex-shrink-0"></span>
                        <span className="text-gray-700 text-lg">Primary strength domain: <strong>{getCategoryName(topStrengths[0].category)}</strong> with exceptional capabilities</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-4 h-4 bg-inuka-gold rounded-full mt-2 mr-6 flex-shrink-0"></span>
                        <span className="text-gray-700 text-lg">Top 3 strengths indicate strong potential for <strong>leadership roles</strong></span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-4 h-4 bg-gray-400 rounded-full mt-2 mr-6 flex-shrink-0"></span>
                        <span className="text-gray-700 text-lg">Well-balanced profile with development opportunities across all domains</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-inuka-crimson to-red-600 text-white p-8 rounded-xl">
                    <h4 className="font-bold text-xl mb-3">Recommended Focus Areas</h4>
                    <p className="text-lg opacity-90">
                      Leverage your strongest capabilities in {getCategoryName(topStrengths[0].category)} while developing 
                      complementary skills in {getCategoryName(topStrengths[1].category)} for maximum impact.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="bg-gradient-to-br from-inuka-crimson to-red-600 text-white shadow-lg">
                <CardContent className="p-8 text-center">
                  <h4 className="font-bold text-2xl mb-4">Overall Score</h4>
                  <div className="text-5xl font-bold mb-3">{averageScore.toFixed(1)}</div>
                  <div className="text-lg opacity-90">out of 7.0</div>
                  <div className="mt-6 bg-white bg-opacity-20 rounded-full h-3">
                    <div 
                      className="bg-white rounded-full h-3 transition-all duration-500"
                      style={{ width: `${(averageScore / 7) * 100}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-inuka-gold to-yellow-500 text-white shadow-lg">
                <CardContent className="p-8 text-center">
                  <h4 className="font-bold text-2xl mb-4">Strongest Area</h4>
                  <div className="text-xl font-semibold leading-tight mb-3">
                    {getCategoryName(topStrengths[0].category)}
                  </div>
                  <div className="text-lg opacity-90">{topStrengths[0].score.toFixed(1)}/7 Score</div>
                  <Badge className="mt-4 bg-white text-yellow-600 hover:bg-white text-lg py-2 px-4">{topStrengths[0].strength}</Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-700 to-gray-800 text-white shadow-lg">
                <CardContent className="p-8 text-center">
                  <h4 className="font-bold text-2xl mb-4">Percentile Rank</h4>
                  <div className="text-5xl font-bold mb-3">
                    {Math.round((averageScore / 7) * 100)}th
                  </div>
                  <div className="text-lg opacity-90">Percentile</div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="border border-gray-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <CardTitle className="text-3xl font-poppins text-gray-800">Top 5 Strengths Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-10">
              <div className="grid grid-cols-5 gap-8">
                {topStrengths.map((strength, index) => (
                  <div key={index} className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-inuka-crimson to-red-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mb-6 mx-auto shadow-lg">
                      {index + 1}
                    </div>
                    <h4 className="font-semibold text-gray-800 text-lg mb-3 leading-tight">{strength.strength}</h4>
                    <p className="text-sm text-gray-600 mb-4">{getCategoryName(strength.category)}</p>
                    <div className="text-2xl font-bold text-inuka-crimson">{strength.score.toFixed(1)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Page 3: Introduction */}
        <div className="report-page min-h-screen p-12 bg-white">
          <div className="mb-12">
            <div className="flex items-center mb-8">
              <div className="w-2 h-16 bg-inuka-crimson mr-6"></div>
              <h1 className="text-5xl font-bold text-inuka-crimson font-poppins">Introduction</h1>
            </div>
            <Separator className="mb-12" />
          </div>

          <div className="space-y-12">
            <Card className="border-l-4 border-l-inuka-gold shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-poppins">Purpose of This Report</CardTitle>
              </CardHeader>
              <CardContent className="text-xl leading-relaxed space-y-6">
                <p>
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

            <Card className="border-l-4 border-l-inuka-crimson shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-poppins">Understanding Psychometric Testing</CardTitle>
              </CardHeader>
              <CardContent className="text-xl leading-relaxed space-y-6">
                <p>
                  Psychometric testing is a scientific method of measuring psychological attributes such as personality traits, 
                  cognitive abilities, and behavioral preferences. These assessments are based on decades of psychological 
                  research and are designed to provide objective, reliable, and valid insights into human behavior.
                </p>
                
                <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
                  <h4 className="font-semibold mb-4 text-gray-800 text-2xl">Key Benefits of Psychometric Assessment:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-inuka-crimson mr-4 font-bold text-xl">•</span>
                      <span className="text-lg">Objective measurement of natural talents and preferences</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-inuka-crimson mr-4 font-bold text-xl">•</span>
                      <span className="text-lg">Evidence-based insights for personal and professional development</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-inuka-crimson mr-4 font-bold text-xl">•</span>
                      <span className="text-lg">Enhanced self-awareness and understanding of behavioral patterns</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-inuka-crimson mr-4 font-bold text-xl">•</span>
                      <span className="text-lg">Strategic guidance for career planning and role optimization</span>
                    </li>
                  </ul>
                </div>
                
                <p>
                  This assessment measures five core domains of human capability, each containing multiple specific strengths 
                  that contribute to overall performance and satisfaction in various life contexts.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-gray-600 shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-poppins">Confidentiality and Data Use</CardTitle>
              </CardHeader>
              <CardContent className="text-xl leading-relaxed space-y-6">
                <div className="bg-red-50 border border-red-200 p-8 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-3 text-2xl">Important Notice</h4>
                  <p className="text-red-700 text-lg">
                    This report contains confidential information intended solely for {userName}. 
                    Unauthorized distribution or use of this information is strictly prohibited.
                  </p>
                </div>
                
                <p>
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

        {/* Page 4: Test Overview */}
        <div className="report-page min-h-screen p-12 bg-white">
          <div className="mb-12">
            <div className="flex items-center mb-8">
              <div className="w-2 h-16 bg-inuka-crimson mr-6"></div>
              <h1 className="text-5xl font-bold text-inuka-crimson font-poppins">Test Overview</h1>
            </div>
            <Separator className="mb-12" />
          </div>

          <div className="space-y-12">
            <Card className="border-l-4 border-l-inuka-crimson shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-poppins">Assessment Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-12">
                  <div>
                    <h4 className="font-semibold mb-6 text-xl">Assessment Components</h4>
                    <div className="space-y-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-inuka-crimson text-white rounded-full flex items-center justify-center text-lg font-bold mr-6">5</div>
                        <span className="text-lg">Core strength domains assessed</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-inuka-gold text-white rounded-full flex items-center justify-center text-lg font-bold mr-6">{results.length}</div>
                        <span className="text-lg">Individual strengths measured</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-6">7</div>
                        <span className="text-lg">Point scoring scale (1-7)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-6 text-xl">Theoretical Framework</h4>
                    <p className="text-gray-700 text-lg mb-6">
                      This assessment is based on contemporary strengths psychology and positive psychology research, 
                      focusing on identifying natural talents that can be developed into exceptional performance.
                    </p>
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h5 className="font-semibold mb-4 text-lg">Core Principles:</h5>
                      <ul className="text-base space-y-2">
                        <li>• Strengths-based development approach</li>
                        <li>• Evidence-based measurement methodology</li>
                        <li>• Culturally inclusive assessment design</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-inuka-gold shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-poppins">The Five Domains Model</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-8">
                  {Object.entries(categoryData).map(([category, data], index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-8 bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-2xl font-semibold text-gray-800">{category}</h4>
                        <Badge className="bg-inuka-crimson text-white hover:bg-inuka-crimson text-lg py-2 px-4">{data.count} strengths</Badge>
                      </div>
                      <div className="flex items-center mb-4">
                        <span className="text-lg text-gray-600 mr-6 min-w-[140px]">Domain Score:</span>
                        <Progress value={(data.total / data.count / 7) * 100} className="flex-1 h-4" />
                        <span className="ml-6 font-semibold text-xl">{(data.total / data.count).toFixed(1)}/7</span>
                      </div>
                      <p className="text-gray-600 text-lg">
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
          </div>
        </div>

        {/* Page 5: User Profile */}
        <div className="report-page min-h-screen p-12 bg-white">
          <div className="mb-12">
            <div className="flex items-center mb-8">
              <div className="w-2 h-16 bg-inuka-crimson mr-6"></div>
              <h1 className="text-5xl font-bold text-inuka-crimson font-poppins">User Profile</h1>
            </div>
            <Separator className="mb-12" />
          </div>

          <div className="grid grid-cols-2 gap-12 mb-12">
            <Card className="border-l-4 border-l-inuka-gold shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-poppins">Assessment Participant</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-2 gap-12">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-3 text-lg">Full Name:</label>
                    <p className="text-xl text-gray-800">{userName}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 block mb-3 text-lg">Assessment Date:</label>
                    <p className="text-xl text-gray-800">{currentDate}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 block mb-3 text-lg">Report ID:</label>
                    <p className="text-xl font-mono text-gray-800">{reportId}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 block mb-3 text-lg">Assessment Type:</label>
                    <p className="text-xl text-gray-800">Comprehensive Strengths Profile</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-inuka-crimson shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-poppins">Completion Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-2 gap-12">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-3 text-lg">Total Questions:</label>
                    <p className="text-xl text-gray-800">Comprehensive Assessment</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 block mb-3 text-lg">Completion Status:</label>
                    <p className="text-xl text-green-600 font-semibold flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                      Complete
                    </p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 block mb-3 text-lg">Response Quality:</label>
                    <p className="text-xl text-green-600">High Consistency</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 block mb-3 text-lg">Assessment Version:</label>
                    <p className="text-xl text-gray-800">SA-2024.1</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-l-4 border-l-gray-600 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-poppins">Assessment Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-12">
                <div className="bg-gradient-to-br from-inuka-crimson to-red-600 text-white p-8 rounded-lg text-center shadow-lg">
                  <div className="text-4xl font-bold mb-4">{results.length}</div>
                  <div className="text-lg opacity-90">Strengths Measured</div>
                </div>
                <div className="bg-gradient-to-br from-inuka-gold to-yellow-500 text-white p-8 rounded-lg text-center shadow-lg">
                  <div className="text-4xl font-bold mb-4">5</div>
                  <div className="text-lg opacity-90">Core Domains</div>
                </div>
                <div className="bg-gradient-to-br from-gray-700 to-gray-800 text-white p-8 rounded-lg text-center shadow-lg">
                  <div className="text-4xl font-bold mb-4">{averageScore.toFixed(1)}</div>
                  <div className="text-lg opacity-90">Overall Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Page 6: Overall Results Summary */}
        <div className="report-page min-h-screen p-12 bg-white">
          <div className="mb-12">
            <div className="flex items-center mb-8">
              <div className="w-2 h-16 bg-inuka-crimson mr-6"></div>
              <h1 className="text-5xl font-bold text-inuka-crimson font-poppins">Overall Results Summary</h1>
            </div>
            <Separator className="mb-12" />
          </div>

          <div className="grid grid-cols-2 gap-10 mb-12">
            <Card className="border border-gray-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-inuka-crimson to-red-600 text-white">
                <CardTitle className="text-2xl font-poppins">Strengths Profile Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-8 bg-white">
                <div className="h-96 flex items-center justify-center">
                  <StrengthsRadarChart data={results} />
                </div>
                <p className="text-lg text-gray-600 mt-6 text-center">
                  Comprehensive view of your capabilities across all five strength domains
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-inuka-gold to-yellow-500 text-white">
                <CardTitle className="text-2xl font-poppins">Domain Distribution</CardTitle>
              </CardHeader>
              <CardContent className="p-8 bg-white">
                <div className="h-96 flex items-center justify-center">
                  <CategoryBreakdownChart data={results} />
                </div>
                <p className="text-lg text-gray-600 mt-6 text-center">
                  Relative strength distribution across core capability areas
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-gray-200 shadow-xl mb-12">
            <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
              <CardTitle className="text-2xl font-poppins">Individual Strength Scores</CardTitle>
            </CardHeader>
            <CardContent className="p-8 bg-white">
              <StrengthProgressBar results={results} getCategoryName={getCategoryName} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-5 gap-6">
            {Object.entries(categoryData).map(([category, data], index) => (
              <Card key={index} className="text-center border border-gray-200 shadow-lg">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-inuka-crimson to-red-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 mx-auto">
                    {(data.total / data.count).toFixed(1)}
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-3 text-lg leading-tight">{category}</h4>
                  <div className="text-sm text-gray-600 mb-4">{data.count} strengths</div>
                  <Progress value={(data.total / data.count / 7) * 100} className="h-3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Page 7: Detailed Analysis & Recommendations */}
        <div className="report-page min-h-screen p-12 bg-white">
          <div className="mb-12">
            <div className="flex items-center mb-8">
              <div className="w-2 h-16 bg-inuka-crimson mr-6"></div>
              <h1 className="text-5xl font-bold text-inuka-crimson font-poppins">Detailed Analysis & Recommendations</h1>
            </div>
            <Separator className="mb-12" />
          </div>

          <RecommendationsSection results={results} getCategoryName={getCategoryName} />
          
          <Card className="mt-12 border-l-4 border-l-inuka-gold shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-poppins">Development Roadmap</CardTitle>
            </CardHeader>
            <CardContent className="space-y-12">
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <h4 className="font-semibold text-2xl mb-8 text-green-700">Leverage These Strengths</h4>
                  <div className="space-y-6">
                    {topStrengths.slice(0, 3).map((strength, index) => (
                      <div key={index} className="flex items-center p-6 bg-green-50 rounded-lg border border-green-200 shadow-sm">
                        <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-6">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-green-800 text-lg">{strength.strength}</div>
                          <div className="text-base text-green-600">{getCategoryName(strength.category)} • {strength.score.toFixed(1)}/7</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-2xl mb-8 text-blue-700">Development Opportunities</h4>
                  <div className="space-y-6">
                    {[...results].sort((a, b) => a.score - b.score).slice(0, 3).map((strength, index) => (
                      <div key={index} className="flex items-center p-6 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-6">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-blue-800 text-lg">{strength.strength}</div>
                          <div className="text-base text-blue-600">{getCategoryName(strength.category)} • {strength.score.toFixed(1)}/7</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Page 8: Appendix */}
        <div className="report-page min-h-screen p-12 bg-white">
          <div className="mb-12">
            <div className="flex items-center mb-8">
              <div className="w-2 h-16 bg-inuka-crimson mr-6"></div>
              <h1 className="text-5xl font-bold text-inuka-crimson font-poppins">Appendix</h1>
            </div>
            <Separator className="mb-12" />
          </div>

          <Card className="border-l-4 border-l-inuka-gold mb-12 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-poppins">Complete Score Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-4 text-left font-semibold text-lg">Strength</th>
                      <th className="border border-gray-300 p-4 text-left font-semibold text-lg">Category</th>
                      <th className="border border-gray-300 p-4 text-center font-semibold text-lg">Score</th>
                      <th className="border border-gray-300 p-4 text-center font-semibold text-lg">Percentile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 p-4 font-medium text-lg">{result.strength}</td>
                        <td className="border border-gray-300 p-4 text-lg">{getCategoryName(result.category)}</td>
                        <td className="border border-gray-300 p-4 text-center font-bold text-xl">{result.score.toFixed(1)}</td>
                        <td className="border border-gray-300 p-4 text-center text-lg">{Math.round((result.score / 7) * 100)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="bg-gradient-to-r from-gray-50 to-inuka-offwhite p-12 rounded-xl border border-gray-200 shadow-lg">
            <div className="text-center max-w-3xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-inuka-crimson to-red-600 rounded-full mx-auto mb-8 flex items-center justify-center">
                <span className="text-white font-bold text-3xl">SA</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-8 font-poppins">Thank You for Completing Your Assessment</h3>
              <p className="text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed text-lg">
                This comprehensive analysis represents the beginning of your strengths development journey. 
                We encourage you to review this report regularly and apply the insights to your personal and professional growth.
              </p>
              <div className="flex justify-center space-x-12 text-lg text-gray-500 mb-12">
                <span>Report Generated: {currentDate}</span>
                <span>Valid for: {userName}</span>
                <span>Report ID: {reportId}</span>
              </div>
              <div className="pt-6 border-t border-gray-300">
                <p className="text-base text-gray-500">
                  © 2024 Strengths Africa. This report is confidential and intended solely for {userName}. 
                  For questions about your results, please contact our support team at support@strengthsafrica.com
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
