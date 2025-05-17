
import React, { forwardRef, useEffect } from 'react';
import Logo from './Logo';
import { UserResult } from '@/models/strength';

interface CertificateProps {
  userName: string;
  results: UserResult;
  date: string;
  certificateId: string;
}

const Certificate = forwardRef<HTMLDivElement, CertificateProps>(
  ({ userName, results, date, certificateId }, ref) => {
    
    useEffect(() => {
      // Log when certificate renders to help with debugging
      console.log("Certificate component rendering with data:", {
        userName, 
        resultsValid: results && results.topStrengths && Array.isArray(results.topStrengths),
        date, 
        certificateId
      });
    }, [userName, results, date, certificateId]);
    
    // Validate the results data structure
    const hasValidResults = results && 
                          results.topStrengths && 
                          Array.isArray(results.topStrengths) && 
                          results.topStrengths.length > 0;
    
    // Get category display name for styling
    const getCategoryBadgeClass = (category: string): string => {
      switch (category) {
        case "thinking-learning": return "bg-strength-blue/20 text-strength-blue";
        case "interpersonal": return "bg-strength-yellow/20 text-amber-700";
        case "leadership-influence": return "bg-strength-red/20 text-strength-red";
        case "execution-discipline": return "bg-strength-green/20 text-strength-green";
        case "identity-purpose-values": return "bg-strength-purple/20 text-strength-purple";
        default: return "";
      }
    };
    
    const getCategoryTextClass = (category: string): string => {
      switch (category) {
        case "thinking-learning": return "text-strength-blue";
        case "interpersonal": return "text-amber-600";
        case "leadership-influence": return "text-strength-red";
        case "execution-discipline": return "text-strength-green";
        case "identity-purpose-values": return "text-strength-purple";
        default: return "text-inuka-crimson";
      }
    };
    
    return (
      <div 
        ref={ref}
        data-certificate
        className="w-[210mm] h-[297mm] bg-[#F9F9F9] p-12 flex flex-col relative overflow-hidden font-inter"
        style={{ 
          boxSizing: 'border-box',
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 z-0 pointer-events-none bg-repeat" 
          style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23C92A2A\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
      
        {/* Top Section */}
        <div className="flex justify-center mb-6 relative z-10">
          <div className="w-32 h-32 flex items-center justify-center">
            <Logo size="large" />
          </div>
        </div>
      
        <div className="text-center mb-10 relative z-10">
          <h1 className="text-4xl font-bold text-inuka-crimson mb-3 font-poppins">Certificate of Strength Discovery</h1>
          <div className="h-1 w-48 bg-inuka-gold mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-inuka-charcoal">
            This certifies that
          </p>
          <p className="text-3xl font-bold text-inuka-charcoal my-4 font-poppins">
            {userName || "[User's Full Name]"}
          </p>
          <p className="text-xl text-inuka-charcoal">
            has successfully completed the Strengths Africa Discovery Test.
          </p>
        </div>
      
        {/* Middle Section - Strengths */}
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm mb-10 relative z-10">
          <h2 className="text-2xl font-bold text-inuka-crimson mb-6 text-center font-poppins">
            Top 5 Strengths
          </h2>
          
          <div className="space-y-5">
            {hasValidResults ? (
              results.topStrengths.map((item, index) => (
                <div key={item.strength.id || index} className="flex items-start">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-1" 
                    style={{ backgroundColor: getCategoryBadgeClass(item.strength.category).includes('blue') ? '#3B82F6' 
                             : getCategoryBadgeClass(item.strength.category).includes('yellow') ? '#FACC15'
                             : getCategoryBadgeClass(item.strength.category).includes('red') ? '#EF4444' 
                             : getCategoryBadgeClass(item.strength.category).includes('green') ? '#22C55E'
                             : '#8B5CF6' }}>
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold font-poppins ${getCategoryTextClass(item.strength.category)}`}>
                      {item.strength.name}
                    </h3>
                    <p className="text-gray-700 font-inter">
                      {item.strength.tagline}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-inuka-gold">
                    {item.score.toFixed(1)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>No strength data available</p>
              </div>
            )}
          </div>
        </div>
      
        {/* Bottom Section */}
        <div className="mt-auto relative z-10">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-gray-600 mb-1">Date of Completion:</p>
              <p className="text-lg font-semibold">{date}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Certificate ID:</p>
              <p className="text-lg font-semibold">{certificateId}</p>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="h-px bg-gray-300 mb-5"></div>
            <p className="text-center font-semibold text-gray-600">Certified by Strengths Africa Team</p>
          </div>
          
          <p className="text-center text-inuka-crimson font-medium italic font-poppins">
            "Empowering Africa, One Strength at a Time."
          </p>
        </div>
      </div>
    );
  }
);

Certificate.displayName = 'Certificate';

export default Certificate;
