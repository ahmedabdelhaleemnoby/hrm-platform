import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Export a DOM element as a PDF
 * @param elementId The ID of the element to capture
 * @param fileName The name of the resulting PDF file
 */
export const exportToPdf = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID ${elementId} not found`);
    return;
  }

  try {
    // Capture the element using html2canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Better resolution
      useCORS: true, // Allow cross-origin images
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');

    // PDF configuration
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error('Failed to export PDF:', error);
  }
};

/**
 * Trigger a backend Excel export download
 * @param period The dashboard period filtering
 */
export const exportToExcel = async (period: string) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/v1/dashboard/export/excel?period=${period}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept-Language': localStorage.getItem('i18nextLng') || 'en'
      }
    });

    if (!response.ok) throw new Error('Download failed');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard_stats_${period}_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Failed to export Excel:', error);
  }
};
