
import React from 'react';

const NextSteps: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-muted">
      <h3 className="text-xl font-semibold text-inuka-crimson mb-3 font-poppins">Next Steps</h3>
      <p className="text-gray-700 mb-4">
        Understanding your strengths is just the beginning. Here's how you can leverage this knowledge:
      </p>
      <ul className="list-disc pl-5 space-y-2">
        <li className="text-gray-700">Reflect on how your strengths have contributed to past successes.</li>
        <li className="text-gray-700">Look for opportunities to apply your strengths in new ways.</li>
        <li className="text-gray-700">Share your strengths with colleagues and friends to enhance collaboration.</li>
        <li className="text-gray-700">Consider how your strengths complement those around you.</li>
        <li className="text-gray-700">Develop strategies to leverage each of your top strengths daily.</li>
      </ul>
    </div>
  );
};

export default NextSteps;
