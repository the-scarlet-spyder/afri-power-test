
import { format } from 'date-fns';
import jsPDF from 'jspdf';
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
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    // Background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, 210, 297, 'F');
    
    // Border (dotted)
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.5);
    pdf.setLineDashPattern([1, 2], 0);
    pdf.rect(8, 8, 194, 281);
    pdf.setLineDashPattern([], 0);
    
    // Header: Company name
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(13);
    pdf.setTextColor(80, 80, 80);
    pdf.text('Strengths Africa', 105, 25, { align: 'center' });
    
    // Certificate title
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);
    pdf.text('CERTIFICATE OF STRENGTHS FOR', 105, 35, { align: 'center' });
    
    // User Name
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(26);
    pdf.setTextColor(0,0,0);
    pdf.text(userName || 'Your Name', 105, 50, { align: 'center' });
    
    // Red ribbon badge (vertical from top right)
    const ribbonX = 160;
    const ribbonY = 0;
    const ribbonWidth = 40;
    const ribbonHeight = 50;
    pdf.setFillColor(201, 42, 42);
    pdf.setDrawColor(201, 42, 42);
    
    // Main ribbon rectangle
    pdf.rect(ribbonX, ribbonY, ribbonWidth, ribbonHeight, 'F');
    
    // Chevron/triangle tail
    pdf.triangle(
      ribbonX, ribbonY + ribbonHeight,
      ribbonX + ribbonWidth / 2, ribbonY + ribbonHeight + 12,
      ribbonX + ribbonWidth, ribbonY + ribbonHeight,
      'F'
    );
    
    // Badge text inside ribbon
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(255,255,255);
    pdf.text('STRENGTHS', ribbonX + ribbonWidth / 2, ribbonY + 17, { align: 'center' });
    pdf.text('CERTIFICATE', ribbonX + ribbonWidth / 2, ribbonY + 27, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(`Test Date: ${format(new Date(), "MMM d, yyyy")}`, ribbonX + ribbonWidth / 2, ribbonY + 39, { align: 'center' });
    
    // Traits section
    let y = 65;
    results.topStrengths.forEach((item) => {
      // Category color bar
      const color = getCategoryColor(item.strength.category);
      const rgb = [
        parseInt(color.slice(1, 3), 16),
        parseInt(color.slice(3, 5), 16),
        parseInt(color.slice(5, 7), 16)
      ];
      pdf.setFillColor(rgb[0], rgb[1], rgb[2]);
      pdf.rect(30, y, 3, 22, 'F');
      
      // Trait name
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(15);
      pdf.setTextColor(0,0,0);
      pdf.text(item.strength.name, 38, y + 7);
      
      // Trait description (full report paragraph)
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.setTextColor(80, 80, 80);
      const lines = pdf.splitTextToSize(item.strength.description, 140);
      pdf.text(lines, 38, y + 14);
      y += 28 + (lines.length-1)*6;
    });
    
    // Footer
    pdf.setFontSize(10);
    pdf.setTextColor(128, 128, 128);
    pdf.text(`Participated on: ${format(new Date(), "M/d/yyyy")}`, 105, 272, { align: 'center' });
    pdf.text('Copyright © Strengths Africa. All rights reserved.', 105, 280, { align: 'center' });
    
    // Save
    pdf.save(`Strength_Africa_Certificate_${userName.replace(/\s+/g, '_')}.pdf`);
    onComplete();
  } catch (error) {
    console.error("Error generating PDF:", error);
    onError(error as Error);
  }
};
