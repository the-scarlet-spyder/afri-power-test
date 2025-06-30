
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generateAdvancedReportPDF = async (
  userName: string,
  results: Array<{ strength: string; score: number; category: string }>,
  reportId: string,
  onSuccess: () => void,
  onError: (error: any) => void
) => {
  try {
    // Get the report element
    const reportElement = document.getElementById('advanced-report');
    if (!reportElement) {
      throw new Error('Report element not found');
    }

    // Show the report element temporarily for capture
    reportElement.style.display = 'block';
    reportElement.style.position = 'absolute';
    reportElement.style.left = '0';
    reportElement.style.top = '0';
    reportElement.style.zIndex = '-1000';

    // Wait for a moment to ensure all elements are rendered
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create canvas from the report element
    const canvas = await html2canvas(reportElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: reportElement.scrollWidth,
      height: reportElement.scrollHeight,
    });

    // Hide the report element again
    reportElement.style.display = 'none';

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // Calculate the ratio to fit the image to PDF width
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;

    // If the image is taller than one page, we need to split it
    const scaledHeight = imgHeight * ratio;
    
    if (scaledHeight <= pdfHeight) {
      // Single page
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, scaledHeight);
    } else {
      // Multiple pages
      let position = 0;
      const pageHeight = pdfHeight;
      
      while (position < scaledHeight) {
        pdf.addImage(
          imgData, 
          'PNG', 
          imgX, 
          -position, 
          imgWidth * ratio, 
          scaledHeight
        );
        
        position += pageHeight;
        
        if (position < scaledHeight) {
          pdf.addPage();
        }
      }
    }

    // Save the PDF
    const fileName = `StrengthsAfrica_AdvancedReport_${userName.replace(/\s+/g, '_')}_${reportId}.pdf`;
    pdf.save(fileName);

    onSuccess();
  } catch (error) {
    console.error('Error generating advanced report PDF:', error);
    onError(error);
  }
};
