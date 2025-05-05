import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportReportPDF = async (
  element: HTMLElement,
  loader: HTMLElement,
) => {
  if (!element) return;

  // Клонируем блок
  const clone = element as HTMLElement;
  loader?.classList.remove('hidden');
  // Заменяем canvas на img
  const canvases = clone.querySelectorAll('canvas');
  canvases.forEach((canvas) => {
    const img = document.createElement('img');
    img.src = (canvas as HTMLCanvasElement).toDataURL('image/png');
    img.style.width = canvas.style.width;
    img.style.height = canvas.style.height;
    canvas.parentNode?.replaceChild(img, canvas);
  });

  // Оформляем клон
  Object.assign(clone.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    zIndex: '-1',
    width: `${element.scrollWidth}px`,
    height: `${element.scrollHeight}px`,
    overflow: 'visible',
    backgroundColor: 'white',
    padding: '20px',
  });

  // ⏳ ОЖИДАЕМ, пока ВСЕ картинки (в том числе бывшие canvas) загрузятся
  await Promise.all(
    Array.from(clone.querySelectorAll('img')).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((res) => {
        img.onload = img.onerror = res;
      });
    }),
  );

  await new Promise((r) => requestAnimationFrame(r));
  // Теперь точно можно рендерить
  const canvas = await html2canvas(clone, {
    backgroundColor: '#fff',
    scrollX: 0,
    scrollY: 0,
    windowWidth: clone.scrollWidth,
    windowHeight: clone.scrollHeight,
    scale: 2,
  });

  element.removeAttribute('style');

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageHeight = 297;
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = 210;
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  let position = 0;

  while (position < pdfHeight) {
    pdf.addImage(imgData, 'PNG', 0, -position, pdfWidth, pdfHeight);
    position += pageHeight;
    if (position < pdfHeight) pdf.addPage();
  }

  pdf.save('report.pdf');
  loader?.classList.add('hidden');
};
