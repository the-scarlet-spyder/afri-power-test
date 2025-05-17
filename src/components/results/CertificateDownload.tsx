
import React from 'react';
import { Button } from '@/components/ui/button';

interface CertificateDownloadProps {
  userName: string;
  setUserName: (name: string) => void;
  isGeneratingPDF: boolean;
  downloadPDF: () => void;
  handleRetake: () => void;
  certificateId: string;
}

const CertificateDownload: React.FC<CertificateDownloadProps> = ({ 
  userName, 
  setUserName, 
  isGeneratingPDF, 
  downloadPDF, 
  handleRetake,
  certificateId
}) => {
  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-muted">
        <h3 className="text-xl font-semibold text-inuka-crimson mb-3 font-poppins">Download Your Certificate</h3>
        <p className="text-gray-700 mb-4">
          Enter your full name as you would like it to appear on your certificate.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input 
            type="text" 
            placeholder="Enter your full name" 
            value={userName} 
            onChange={(e) => {
              setUserName(e.target.value);
              localStorage.setItem('user_name', e.target.value);
            }}
            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mt-2">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
          Certificate ID: {certificateId}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={downloadPDF}
          disabled={isGeneratingPDF || !userName.trim()}
          className="bg-inuka-gold text-inuka-charcoal hover:bg-opacity-90"
        >
          {isGeneratingPDF ? "Generating PDF..." : "Download PDF Certificate"}
        </Button>
        <Button 
          onClick={handleRetake}
          variant="outline" 
          className="border-inuka-crimson text-inuka-crimson hover:bg-inuka-crimson hover:text-white"
        >
          Retake Test
        </Button>
      </div>
    </>
  );
};

export default CertificateDownload;
