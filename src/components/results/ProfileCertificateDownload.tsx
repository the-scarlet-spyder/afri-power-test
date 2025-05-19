
import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, FileDown } from 'lucide-react';
import { Certificate as CertificateType } from '@/lib/database.types';
import { generateCertificatePDFData } from '@/lib/test-service';
import Certificate from '../Certificate';
import { format } from 'date-fns';

interface ProfileCertificateDownloadProps {
  certificateId: string;
}

const ProfileCertificateDownload = ({ certificateId }: ProfileCertificateDownloadProps) => {
  const [downloading, setDownloading] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const downloadCertificate = async () => {
    if (!certificateId) {
      toast({
        title: "Error",
        description: "Certificate ID is missing.",
        variant: "destructive",
      });
      return;
    }

    try {
      setDownloading(true);
      
      // Fetch the certificate data
      const pdfData = await generateCertificatePDFData(certificateId);
      
      if (!pdfData || !pdfData.certificate || !pdfData.results) {
        throw new Error("Certificate data could not be loaded");
      }
      
      // Format the certificate data
      const certificate = pdfData.certificate;
      const results = pdfData.results;
      const formattedDate = format(new Date(certificate.created_at), 'PPP');
      
      // Create a temporary DOM element to render the certificate
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      document.body.appendChild(tempDiv);
      
      // Render the certificate to the temporary div
      const tempCertificateRef = React.createRef<HTMLDivElement>();
      
      // Create and render the certificate component
      const tempCertificate = (
        <div ref={tempCertificateRef}>
          <Certificate
            userName={certificate.name_on_certificate}
            results={results}
            date={formattedDate}
            certificateId={certificate.certificate_id}
          />
        </div>
      );

      // Use ReactDOM to render the certificate
      const root = document.createElement('div');
      tempDiv.appendChild(root);
      
      // Use ReactDOM render in a way that works with React 18
      const ReactDOM = await import('react-dom/client');
      const reactRoot = ReactDOM.createRoot(root);
      reactRoot.render(tempCertificate);
      
      // Wait for the certificate to render
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Generate PDF once the certificate is rendered
      if (tempCertificateRef.current) {
        const canvas = await html2canvas(tempCertificateRef.current, {
          scale: 2,
          logging: false,
          useCORS: true,
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
        pdf.save(`strengths_certificate_${certificateId}.pdf`);
        
        // Clean up
        tempDiv.remove();
        
        toast({
          title: "Download Complete",
          description: "Your certificate has been downloaded successfully.",
        });
      }
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading your certificate. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button 
      onClick={downloadCertificate}
      disabled={downloading}
      variant="outline"
      size="sm"
      className="mt-2 w-full flex items-center justify-center gap-2"
    >
      {downloading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4" />
          Download PDF
        </>
      )}
    </Button>
  );
};

export default ProfileCertificateDownload;
