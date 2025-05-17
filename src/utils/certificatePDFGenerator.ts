
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { UserResult } from '@/models/strength';
import { getCategoryColor } from './styleUtils';

export const generateCertificatePDF = async (
  userName: string,
  results: UserResult,
  certificateId: string,
  onComplete: () => void,
  onError: (error: Error) => void
) => {
  try {
    // First, find the certificate element in the DOM
    const certificateElement = document.querySelector('[data-certificate]');
    if (!certificateElement) {
      throw new Error('Certificate element not found in the DOM');
    }

    console.log("Starting certificate generation for:", userName);
    console.log("Certificate element found:", certificateElement);
    
    // Make certificate visible during capture if it's hidden
    const originalDisplay = (certificateElement as HTMLElement).style.display;
    (certificateElement as HTMLElement).style.display = 'block';
    
    // Use html2canvas to capture the rendered certificate
    const canvas = await html2canvas(certificateElement as HTMLElement, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Allow cross-origin images
      logging: true, // Enable logging for debugging
      backgroundColor: '#ffffff' // Ensure white background
    });
    
    console.log("Canvas generated with dimensions:", canvas.width, "x", canvas.height);
    
    // Create PDF with proper dimensions (A4)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Calculate dimensions to maintain aspect ratio
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const aspectRatio = canvas.height / canvas.width;
    const imgWidth = pdfWidth;
    const imgHeight = imgWidth * aspectRatio;
    
    // Add the image to PDF
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, Math.min(imgHeight, pdfHeight));
    
    // Restore original display style
    (certificateElement as HTMLElement).style.display = originalDisplay;
    
    // Save the PDF
    const filename = `Strength_Africa_Certificate_${userName.replace(/\s+/g, '_')}.pdf`;
    pdf.save(filename);
    
    console.log("PDF generation complete:", filename);
    onComplete();
  } catch (error) {
    console.error("Error generating PDF:", error);
    onError(error as Error);
  }
};
