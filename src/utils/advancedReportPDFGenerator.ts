
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

    // Get all report pages
    const reportPages = reportElement.querySelectorAll('.report-page');
    if (reportPages.length === 0) {
      throw new Error('No report pages found');
    }

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Process each page
    for (let i = 0; i < reportPages.length; i++) {
      const pageElement = reportPages[i] as HTMLElement;
      
      // Create canvas from the page element
      const canvas = await html2canvas(pageElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: pageElement.scrollWidth,
        height: pageElement.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculate the ratio to fit the image to PDF
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;
      
      // Center the image on the page
      const imgX = (pdfWidth - scaledWidth) / 2;
      const imgY = (pdfHeight - scaledHeight) / 2;

      // Add the page to PDF
      if (i > 0) {
        pdf.addPage();
      }
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, scaledWidth, scaledHeight);
    }

    // Hide the report element again
    reportElement.style.display = 'none';

    // Save the PDF
    const fileName = `StrengthsAfrica_AdvancedReport_${userName.replace(/\s+/g, '_')}_${reportId}.pdf`;
    pdf.save(fileName);

    onSuccess();
  } catch (error) {
    console.error('Error generating advanced report PDF:', error);
    
    // Make sure to hide the report element in case of error
    const reportElement = document.getElementById('advanced-report');
    if (reportElement) {
      reportElement.style.display = 'none';
    }
    
    onError(error);
  }
};
