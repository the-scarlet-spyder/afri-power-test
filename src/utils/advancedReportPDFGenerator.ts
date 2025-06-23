
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
    console.log("Starting advanced report PDF generation...");
    
    // Get the report element
    const reportElement = document.getElementById('advanced-report');
    if (!reportElement) {
      throw new Error('Advanced report element not found');
    }

    console.log("Report element found, preparing for capture...");

    // Show the report element temporarily for capture
    const originalDisplay = reportElement.style.display;
    const originalPosition = reportElement.style.position;
    const originalLeft = reportElement.style.left;
    const originalTop = reportElement.style.top;
    const originalZIndex = reportElement.style.zIndex;

    reportElement.style.display = 'block';
    reportElement.style.position = 'absolute';
    reportElement.style.left = '0';
    reportElement.style.top = '0';
    reportElement.style.zIndex = '-1000';
    reportElement.style.width = '210mm'; // A4 width
    reportElement.style.backgroundColor = '#ffffff';

    // Wait for charts to render properly
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("Getting report pages...");

    // Get all report pages
    const reportPages = reportElement.querySelectorAll('.report-page');
    if (reportPages.length === 0) {
      throw new Error('No report pages found');
    }

    console.log(`Found ${reportPages.length} pages to process`);

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Process each page
    for (let i = 0; i < reportPages.length; i++) {
      console.log(`Processing page ${i + 1}/${reportPages.length}`);
      
      const pageElement = reportPages[i] as HTMLElement;
      
      try {
        // Create canvas from the page element
        const canvas = await html2canvas(pageElement, {
          scale: 1.5,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          width: pageElement.scrollWidth,
          height: pageElement.scrollHeight,
          logging: false,
          onclone: (clonedDoc) => {
            // Ensure charts are visible in the cloned document
            const clonedCharts = clonedDoc.querySelectorAll('.recharts-wrapper');
            clonedCharts.forEach((chart: any) => {
              chart.style.width = '100%';
              chart.style.height = '400px';
            });
          }
        });

        const imgData = canvas.toDataURL('image/png', 0.95);
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        // Calculate the ratio to fit the image to PDF
        const ratio = Math.min(pdfWidth / (imgWidth * 0.264583), pdfHeight / (imgHeight * 0.264583));
        const scaledWidth = (imgWidth * 0.264583) * ratio;
        const scaledHeight = (imgHeight * 0.264583) * ratio;
        
        // Center the image on the page
        const imgX = (pdfWidth - scaledWidth) / 2;
        const imgY = (pdfHeight - scaledHeight) / 2;

        // Add the page to PDF
        if (i > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(imgData, 'PNG', imgX, imgY, scaledWidth, scaledHeight);
        console.log(`Page ${i + 1} added to PDF`);
      } catch (pageError) {
        console.error(`Error processing page ${i + 1}:`, pageError);
        // Continue with other pages
      }
    }

    // Restore original styles
    reportElement.style.display = originalDisplay;
    reportElement.style.position = originalPosition;
    reportElement.style.left = originalLeft;
    reportElement.style.top = originalTop;
    reportElement.style.zIndex = originalZIndex;

    // Save the PDF
    const fileName = `StrengthsAfrica_AdvancedReport_${userName.replace(/\s+/g, '_')}_${reportId}.pdf`;
    pdf.save(fileName);

    console.log("PDF generated successfully");
    onSuccess();
  } catch (error) {
    console.error('Error generating advanced report PDF:', error);
    
    // Make sure to restore the report element styles in case of error
    const reportElement = document.getElementById('advanced-report');
    if (reportElement) {
      reportElement.style.display = 'none';
    }
    
    onError(error);
  }
};
