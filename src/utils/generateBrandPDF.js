import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Capture a DOM node containing the Visual Identity Review and render it
 * to a multi-page A4 PDF that visually matches the on-screen layout.
 *
 * `node` must be the rendered <Stage6_VisualIdentity /> tree (or a wrapper
 * around it). Elements with the `no-print` class (e.g. StageContainer's
 * sticky Back/Continue bar) are excluded from the capture.
 */
export async function generateBrandPDF(node, fileName = 'brand-report.pdf') {
  if (!node) throw new Error('generateBrandPDF: node is required');

  await new Promise((r) => requestAnimationFrame(() => r()));
  if (document.fonts && document.fonts.ready) {
    try { await document.fonts.ready; } catch { /* noop */ }
  }

  const canvas = await html2canvas(node, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    windowWidth: node.scrollWidth,
    windowHeight: node.scrollHeight,
    ignoreElements: (el) =>
      el.classList && (el.classList.contains('no-print') || el.dataset?.noPrint === 'true'),
  });

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  if (imgHeight <= pageHeight) {
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, imgWidth, imgHeight);
  } else {
    const pxPerPage = Math.floor((pageHeight * canvas.width) / pageWidth);
    let yOffset = 0;
    let pageIndex = 0;

    while (yOffset < canvas.height) {
      const sliceHeight = Math.min(pxPerPage, canvas.height - yOffset);

      const slice = document.createElement('canvas');
      slice.width = canvas.width;
      slice.height = sliceHeight;
      const ctx = slice.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, slice.width, slice.height);
      ctx.drawImage(canvas, 0, yOffset, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

      const sliceImgHeight = (sliceHeight * imgWidth) / canvas.width;
      if (pageIndex > 0) pdf.addPage();
      pdf.addImage(slice.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, imgWidth, sliceImgHeight);

      yOffset += sliceHeight;
      pageIndex += 1;
    }
  }

  pdf.save(fileName);
  return pdf;
}
