
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import Certificate from '@/components/Certificate';
import { UserResult } from '@/models/strength';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface CertificateDownloadProps {
  userName: string;
  setUserName: (name: string) => void;
  isGeneratingPDF: boolean;
  downloadPDF: () => void;
  handleRetake: () => void;
  certificateId: string;
  results: UserResult;
}

const CertificateDownload: React.FC<CertificateDownloadProps> = ({ 
  userName, 
  setUserName, 
  isGeneratingPDF, 
  downloadPDF, 
  handleRetake,
  certificateId,
  results
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  
  // Internal PDF generation that directly captures the certificate
  const generatePDF = async () => {
    if (!certificateRef.current) return false;
    
    try {
      // Make certificate visible for capture
      const certificate = certificateRef.current;
      const originalDisplay = certificate.style.display;
      certificate.style.display = 'block';
      
      // Capture the certificate
      const canvas = await html2canvas(certificate, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff'
      });
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const aspectRatio = canvas.height / canvas.width;
      const imgWidth = pdfWidth;
      const imgHeight = imgWidth * aspectRatio;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, Math.min(imgHeight, pdfHeight));
      
      // Save PDF
      pdf.save(`Strength_Africa_Certificate_${userName.replace(/\s+/g, '_')}.pdf`);
      
      // Reset display
      certificate.style.display = originalDisplay;
      
      return true;
    } catch (error) {
      console.error("Error generating PDF:", error);
      return false;
    }
  };
  
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
          onClick={() => {
            // Use the internal PDF generation instead of the downloadPDF prop
            if (generatePDF()) {
              // If successful, call the original downloadPDF which might handle state updates
              downloadPDF();
            }
          }}
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
      
      {/* Hidden certificate for PDF generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '210mm', height: '297mm', overflow: 'hidden' }}>
        <Certificate 
          ref={certificateRef}
          userName={userName}
          results={results}
          date={format(new Date(), "MMMM d, yyyy")}
          certificateId={certificateId}
        />
      </div>
    </>
  );
};

export default CertificateDownload;
