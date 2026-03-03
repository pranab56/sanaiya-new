"use client";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useGetReportQuery } from '../../../utils/baseApi';

// Translation object
const translations = {
  en: {
    downloadPdf: 'Download PDF',
    reportIssuedBy: 'Report issued by Senaeya App',
    from: 'From',
    to: 'to',
    duration: 'Duration',
    days: 'days',
    numberOfSavedInvoices: 'Number of\nsaved invoices',
    numberOfPostpaidInvoices: 'Number of\nPostpaid invoices',
    numberOfCompletedInvoices: 'Number of\ncompleted invoices',
    totalIncomeCollected: 'Total income collected',
    totalPostpaidAndSaved: 'Total postpaid and saved income',
    totalExpensesPaid: 'Total expenses paid',
    collectedFinancialBalance: 'Collected financial balance',
    recordedFinancialBalance: 'Recorded financial balance',
    allIncomeCollected: 'All income collected',
    allIncomeRecorded: 'All income recorded',
    allExpensesPaid: 'All expenses paid',
    cars: 'Cars',
    numberOfCarsServiced: 'Number of cars serviced',
    footerText1: 'You can issue multiple reports',
    footerText2: 'via Senaeya App',
    footerText3: 'Daily - Weekly - Monthly',
    footerText4: '- Annual Report - and more',
  },
  ar: {
    downloadPdf: 'تحميل PDF',
    reportIssuedBy: 'تقرير صادر من تطبيق الصناعية',
    from: 'من',
    to: 'إلى',
    duration: 'المدة',
    days: 'يوم',
    numberOfSavedInvoices: 'عدد الفواتير\nالمحفوظة',
    numberOfPostpaidInvoices: 'عدد الفواتير\nالآجلة',
    numberOfCompletedInvoices: 'عدد الفواتير\nالمكتملة',
    totalIncomeCollected: 'إجمالي الدخل المحصل',
    totalPostpaidAndSaved: 'إجمالي الدخل الآجل والمحفوظ',
    totalExpensesPaid: 'إجمالي المصروفات المدفوعة',
    collectedFinancialBalance: 'الرصيد المالي المحصل',
    recordedFinancialBalance: 'الرصيد المالي المسجل',
    allIncomeCollected: 'جميع الدخل المحصل',
    allIncomeRecorded: 'جميع الدخل المسجل',
    allExpensesPaid: 'جميع المصروفات المدفوعة',
    cars: 'سيارة',
    numberOfCarsServiced: 'عدد السيارات التي تم خدمتها',
    footerText1: 'يمكنك إصدار تقارير متعددة',
    footerText2: 'عبر تطبيق صناعية',
    footerText3: 'يومي - أسبوعي - شهري',
    footerText4: '- تقرير سنوي - والمزيد',
  },
};

export default function Reports() {
  const searchParams = useSearchParams();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const urlIsReleased = searchParams.get('isReleased');
  const urlLang = searchParams.get('lang');
  const urlWorkshopId = searchParams.get('providerWorkShopId');
  const token = searchParams.get('access_token');
  const reportRef = React.useRef<HTMLDivElement>(null);

  // Get translations based on language
  const isArabic = urlLang === 'ar';
  const t = translations[isArabic ? 'ar' : 'en'];

  const { data, isLoading } = useGetReportQuery({
    startDate,
    endDate,
    providerWorkShopId: urlWorkshopId,
    lang: urlLang,
    isReleased: urlIsReleased,
    token,
  });

  const reportData = data?.data;

  function formatDateToDDMMYYYY(dateStr: string | undefined | null): string {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "";
      return date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "-");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  }

  function calculateDuration(startDateStr?: string, endDateStr?: string): number {
    if (!startDateStr || !endDateStr) return 0;
    try {
      const start = new Date(startDateStr);
      const end = new Date(endDateStr);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (error) {
      console.error("Error calculating duration:", error);
      return 0;
    }
  }

  const duration = reportData?.range
    ? calculateDuration(reportData.range.start, reportData.range.end)
    : 0;

  // Improved PDF generation with complete color conversion
  const handleDownloadPDF = async () => {
    const element = reportRef.current;
    if (!element) {
      return null;
    }
    try {
      const images = element.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map((img) => {
          if ((img as HTMLImageElement).complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );
      // Wait for fonts to load
      if (document.fonts) {
        await document.fonts.ready;
      }

      // Small delay to ensure everything is rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 3,
        useCORS: true,
        allowTaint: false,
        imageTimeout: 0,
        logging: false,
        windowWidth: 1024, // Use a fixed desktop width for capturing
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc: Document) => {
          const clonedElement = clonedDoc.querySelector('[data-pdf-report]') as HTMLElement;
          if (!clonedElement) return;

          // Force specific width for consistency
          clonedElement.style.width = '816px';
          clonedElement.style.maxWidth = '816px';
          clonedElement.style.margin = '0 auto';

          // Get all elements and convert colors
          const allElements = clonedDoc.querySelectorAll("*");

          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            try {
              // Get computed styles from original element
              const originalEl = element.querySelector(
                `[data-pdf-report] ${htmlEl.tagName}${htmlEl.className ? '.' + htmlEl.className.split(' ').join('.') : ''}`
              );

              if (originalEl) {
                const originalStyles = window.getComputedStyle(originalEl);

                // Handle color
                const color = originalStyles.color;
                if (color && (color.includes('lab') || color.includes('oklch') || color.includes('lch') || color.includes('color('))) {
                  // Fallback colors based on class names
                  if (htmlEl.className.includes('text-white')) {
                    htmlEl.style.color = 'rgb(255, 255, 255)';
                  } else if (htmlEl.className.includes('text-gray-800')) {
                    htmlEl.style.color = 'rgb(31, 41, 55)';
                  } else if (htmlEl.className.includes('text-gray-600')) {
                    htmlEl.style.color = 'rgb(75, 85, 99)';
                  } else if (htmlEl.className.includes('text-red-600')) {
                    htmlEl.style.color = 'rgb(220, 38, 38)';
                  } else if (htmlEl.className.includes('text-green-600')) {
                    htmlEl.style.color = 'rgb(22, 163, 74)';
                  } else if (htmlEl.className.includes('text-orange-500')) {
                    htmlEl.style.color = 'rgb(249, 115, 22)';
                  } else {
                    htmlEl.style.color = 'rgb(0, 0, 0)';
                  }
                } else if (color && !color.includes('rgb')) {
                  htmlEl.style.color = 'rgb(0, 0, 0)';
                }

                // Handle background color
                const bgColor = originalStyles.backgroundColor;
                if (bgColor && (bgColor.includes('lab') || bgColor.includes('oklch') || bgColor.includes('lch') || bgColor.includes('color('))) {
                  if (htmlEl.className.includes('bg-gray-50')) {
                    htmlEl.style.backgroundColor = 'rgb(249, 250, 251)';
                  } else if (htmlEl.className.includes('bg-gray-200')) {
                    htmlEl.style.backgroundColor = 'rgb(229, 231, 235)';
                  } else if (htmlEl.className.includes('bg-white')) {
                    htmlEl.style.backgroundColor = 'rgb(255, 255, 255)';
                  } else {
                    htmlEl.style.backgroundColor = 'transparent';
                  }
                } else if (bgColor && !bgColor.includes('rgb') && bgColor !== 'transparent') {
                  htmlEl.style.backgroundColor = 'rgb(255, 255, 255)';
                }

                // Handle border color
                const borderColor = originalStyles.borderColor;
                if (borderColor && (borderColor.includes('lab') || borderColor.includes('oklch') || borderColor.includes('lch') || borderColor.includes('color('))) {
                  if (htmlEl.className.includes('border-gray-300')) {
                    htmlEl.style.borderColor = 'rgb(209, 213, 219)';
                  } else {
                    htmlEl.style.borderColor = 'rgb(200, 200, 200)';
                  }
                } else if (borderColor && !borderColor.includes('rgb')) {
                  htmlEl.style.borderColor = 'rgb(200, 200, 200)';
                }
              }

              // Ensure inline styles are RGB
              if (htmlEl.style.color && !htmlEl.style.color.includes('rgb')) {
                htmlEl.style.color = htmlEl.style.color;
              }
              if (htmlEl.style.backgroundColor && !htmlEl.style.backgroundColor.includes('rgb')) {
                htmlEl.style.backgroundColor = htmlEl.style.backgroundColor;
              }

              // Font rendering
              (htmlEl.style as any).fontSmooth = 'always';
              (htmlEl.style as any).webkitFontSmoothing = 'antialiased';
              htmlEl.style.textRendering = 'optimizeLegibility';

              // Box sizing
              htmlEl.style.boxSizing = 'border-box';

              // Fix images — but NOT inside the PDF-only footer (those have inline styles)
              if (htmlEl.tagName === 'IMG') {
                const isInsidePdfFooter = htmlEl.closest('[data-pdf-footer]');
                if (!isInsidePdfFooter) {
                  const img = htmlEl as HTMLImageElement;
                  img.style.maxWidth = '12%';
                  img.style.height = 'auto';
                  img.style.display = 'inline-block';
                }
              }

              // Also fix other responsive elements to use desktop styles in PDF
              if (htmlEl.className.includes('grid-cols-2') || htmlEl.className.includes('sm:grid-cols-3')) {
                htmlEl.style.display = 'grid';
                htmlEl.style.gridTemplateColumns = 'repeat(3, minmax(0, 1fr))';
                htmlEl.style.gap = '1.5rem';
              }
              if (htmlEl.className.includes('flex-col') && htmlEl.className.includes('sm:flex-row')) {
                htmlEl.style.flexDirection = 'row';
              }
              if (htmlEl.className.includes('text-xl') && htmlEl.className.includes('sm:text-2xl')) {
                htmlEl.style.fontSize = '1.5rem';
              }
              if (htmlEl.className.includes('p-3') && htmlEl.className.includes('sm:p-6')) {
                htmlEl.style.padding = '1.5rem';
              }
            } catch (err) {
              console.warn('Error processing element:', err);
            }
          });

          // Swap footers AFTER the loop using querySelector (more reliable than hasAttribute inside forEach)
          const screenFooter = clonedDoc.querySelector('[data-footer-section]') as HTMLElement;
          const pdfFooter = clonedDoc.querySelector('[data-pdf-footer]') as HTMLElement;
          if (screenFooter) screenFooter.style.display = 'none';
          if (pdfFooter) pdfFooter.style.display = 'block';
        },
      });

      const imgData = canvas.toDataURL("image/png", 1.0);

      // A4 dimensions
      const pageWidth = 210;
      const pageHeight = 297;

      // Calculate dimensions
      const imgWidthPx = canvas.width;
      const imgHeightPx = canvas.height;
      const aspectRatio = imgHeightPx / imgWidthPx;

      const margin = 10;
      const contentWidth = pageWidth - (2 * margin);
      const contentHeight = contentWidth * aspectRatio;

      let pdfWidth = contentWidth;
      let pdfHeight = contentHeight;

      if (contentHeight > pageHeight - (2 * margin)) {
        pdfHeight = pageHeight - (2 * margin);
        pdfWidth = pdfHeight / aspectRatio;
      }

      const marginX = (pageWidth - pdfWidth) / 2;
      const marginY = (pageHeight - pdfHeight) / 2;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });
      pdf.addImage(imgData, "PNG", marginX, marginY, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save("report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        Loading...
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6'>
      <div className={`no-print fixed top-4 z-50 right-4`}>
        <button
          className='border border-gray-300 text-sm cursor-pointer px-5 py-2 shadow-md hover:shadow-lg bg-white rounded'
          onClick={handleDownloadPDF}
          type='button'
        >
          {t.downloadPdf}
        </button>
      </div>

      {/* Main Report Content - Using inline styles to avoid color conversion issues */}
      <div ref={reportRef} data-pdf-report className="max-w-4xl mx-auto shadow p-3 sm:p-6" style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
        {/* Header */}
        <div className="text-center px-4 pb-4 pt-4" style={{ backgroundColor: 'rgb(23, 113, 183)', color: 'rgb(255, 255, 255)' }}>
          <h1 className="text-xl sm:text-2xl font-bold mb-2">
            {reportData?.workshop?.workshopNameEnglish || 'Business Name'}
          </h1>
          <p className="text-xs sm:text-sm" style={{ opacity: 0.9 }}>
            {reportData?.workshop?.workshopNameArabic || 'Business Subtitle'}
          </p>
        </div>

        {/* VAT and CR Bar */}
        <div className="flex justify-between items-center px-3 sm:px-6 py-2 text-[10px] sm:text-sm" style={{ backgroundColor: 'rgb(203, 54, 64)', color: 'rgb(255, 255, 255)' }}>
          <div>VAT - {reportData?.workshop?.taxVatNumber || 'N/A'}</div>
          <div>CR - {reportData?.workshop?.crn || 'N/A'}</div>
        </div>

        {/* App Title */}
        <div className="text-center py-6">
          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'rgb(23, 113, 183)' }}>
            {t.reportIssuedBy}
          </h2>
        </div>

        {/* Date Range */}
        <div className="mb-6">
          <div className="text-center  py-4 px-4 rounded-lg" style={{ backgroundColor: 'rgb(229, 231, 235)', }}>
            <p className="text-sm sm:text-base md:text-2xl flex flex-wrap justify-center items-center gap-2 md:gap-3 font-bold" style={{ color: 'rgb(31, 41, 55)' }}>
              <span className="flex items-center gap-1"><span>{t.from}</span> <span>{formatDateToDDMMYYYY(reportData?.range?.start)}</span></span>
              <span className="flex items-center gap-1"><span>{t.to}</span> <span>{formatDateToDDMMYYYY(reportData?.range?.end)}</span></span>
              <span className="flex items-center gap-1"><span>{t.duration}</span>: <span>{duration}</span> <span>{t.days}</span></span>
            </p>
          </div>
        </div>

        {/* Invoice Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mb-6">
          <div className="text-center py-4 sm:py-6 px-2 sm:px-4 rounded-lg" style={{ backgroundColor: 'rgb(249, 250, 251)' }}>
            <p className="text-[10px] sm:text-sm font-semibold mb-2 whitespace-pre-line" style={{ color: 'rgb(203, 54, 64)' }}>
              {t.numberOfSavedInvoices}
            </p>
            <p className="text-2xl sm:text-4xl font-bold" style={{ color: 'rgb(203, 54, 64)' }}>
              {reportData?.numberOfUnpaidNonPostpaidInvoices || 0}
            </p>
          </div>
          <div className="text-center py-4 sm:py-6 px-2 sm:px-4 rounded-lg" style={{ backgroundColor: 'rgb(249, 250, 251)' }}>
            <p className="text-[10px] sm:text-sm font-semibold mb-2 whitespace-pre-line" style={{ color: 'rgb(249, 115, 22)' }}>
              {t.numberOfPostpaidInvoices}
            </p>
            <p className="text-2xl sm:text-4xl font-bold" style={{ color: 'rgb(249, 115, 22)' }}>
              {reportData?.numberOfUnpaidPostpaidInvoices || 0}
            </p>
          </div>
          <div className="text-center py-4 sm:py-6 px-2 sm:px-4 rounded-lg" style={{ backgroundColor: 'rgb(249, 250, 251)' }}>
            <p className="text-[10px] sm:text-sm font-semibold mb-2 whitespace-pre-line" style={{ color: 'rgb(22, 163, 74)' }}>
              {t.numberOfCompletedInvoices}
            </p>
            <p className="text-2xl sm:text-4xl font-bold" style={{ color: 'rgb(22, 163, 74)' }}>
              {reportData?.numberOfPaidInvoices || 0}
            </p>
          </div>
        </div>

        {/* Financial Boxes */}
        <div className="mb-6 space-y-4">
          {/* Total Income */}
          <div className="rounded-lg py-4 sm:py-6 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center" style={{ backgroundColor: 'rgb(23, 113, 183)', color: 'rgb(255, 255, 255)' }}>
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0">
              <span className="text-xl sm:text-3xl font-bold">ر.س</span>
              <span className="text-xl sm:text-3xl font-bold">{reportData?.totalIncomeCollected?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="text-base sm:text-xl font-semibold text-center sm:text-right">{t.totalIncomeCollected}</div>
          </div>

          {/* Total Postpaid */}
          <div className="rounded-lg py-4 sm:py-6 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center" style={{ backgroundColor: 'rgb(203, 54, 64)', color: 'rgb(255, 255, 255)' }}>
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0">
              <span className="text-xl sm:text-3xl font-bold">ر.س</span>
              <span className="text-xl sm:text-3xl font-bold">{reportData?.totalUnpaidFinalCost?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="text-base sm:text-xl font-semibold text-center sm:text-right">{t.totalPostpaidAndSaved}</div>
          </div>

          {/* Total Expenses */}
          <div className="rounded-lg py-4 sm:py-6 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center" style={{ backgroundColor: 'rgb(149, 149, 149)', color: 'rgb(255, 255, 255)' }}>
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0">
              <span className="text-xl sm:text-3xl font-bold">ر.س</span>
              <span className="text-xl sm:text-3xl font-bold">{reportData?.totalExpenses?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="text-base sm:text-xl font-semibold text-center sm:text-right">{t.totalExpensesPaid}</div>
          </div>
        </div>

        {/* Balance Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Collected Balance */}
          <div className="rounded-lg p-3 sm:p-6 text-center" style={{ backgroundColor: 'rgb(244, 245, 247)' }}>
            <h3 className="text-sm sm:text-lg font-bold mb-2 sm:mb-3" style={{ color: 'rgb(23, 113, 183)' }}>
              {t.collectedFinancialBalance}
            </h3>
            <p className="text-[10px] sm:text-sm font-bold" style={{ color: 'rgb(75, 85, 99)' }}>{t.allIncomeCollected}</p>
            <p className="text-[10px] sm:text-sm font-bold" style={{ color: 'rgb(75, 85, 99)' }}>-</p>
            <p className="text-[10px] sm:text-sm font-bold mb-2 sm:mb-4" style={{ color: 'rgb(75, 85, 99)' }}>{t.allExpensesPaid}</p>
            <div className="flex items-center justify-center gap-2">
              <Image
                src={"/icons/green_symbol.png"}
                height={40}
                width={40}
                className='w-6 h-6 sm:w-10 sm:h-10'
                alt='Green symbol'
              />
              <span className="text-xl sm:text-2xl font-bold" style={{ color: 'rgb(23, 113, 183)' }}>
                {reportData?.collectedFinancialBalance?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>

          {/* Recorded Balance */}
          <div className="rounded-lg p-3 sm:p-6 text-center" style={{ backgroundColor: 'rgb(244, 245, 247)' }}>
            <h3 className="text-sm sm:text-lg font-bold mb-2 sm:mb-3" style={{ color: 'rgb(220, 38, 38)' }}>
              {t.recordedFinancialBalance}
            </h3>
            <p className="text-[10px] sm:text-sm font-bold" style={{ color: 'rgb(75, 85, 99)' }}>{t.allIncomeRecorded}</p>
            <p className="text-[10px] sm:text-sm font-bold" style={{ color: 'rgb(75, 85, 99)' }}>-</p>
            <p className="text-[10px] sm:text-sm font-bold mb-2 sm:mb-4" style={{ color: 'rgb(75, 85, 99)' }}>{t.allExpensesPaid}</p>
            <div className="flex items-center justify-center gap-2">
              <Image
                src={"/icons/red_symbol.png"}
                height={40}
                width={40}
                className='w-6 h-6 sm:w-10 sm:h-10'
                alt='Red symbol'
              />
              <span className="text-xl sm:text-2xl font-bold" style={{ color: 'rgb(220, 38, 38)' }}>
                {reportData?.recordedFinancialBalance?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        </div>

        {/* Cars Serviced */}
        <div className="">
          <div className="rounded-lg py-3 sm:py-4 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center" style={{ backgroundColor: 'rgb(229, 231, 235)' }}>
            <div className="text-lg sm:text-2xl flex items-center gap-2 sm:gap-4 font-bold mb-2 sm:mb-0" style={{ color: 'rgb(31, 41, 55)' }}>
              <div>{t.cars}</div> <div className={isArabic ? 'mr-4' : 'ml-4'}>{reportData?.numberOfCars || 0}</div>
            </div>
            <div className="text-base sm:text-xl font-bold text-center sm:text-right" style={{ color: 'rgb(31, 41, 55)' }}>
              {t.numberOfCarsServiced}
            </div>
          </div>

          {/* Responsive footer — shown on screen, hidden in PDF */}
          <section className="relative w-full h-[100px] md:h-20 overflow-hidden mt-6" data-footer-section>
            <div className="absolute inset-0 w-full flex flex-col">
              {/* Top half - light divider */}
              <div className="h-1/2 w-full" style={{ opacity: 0.1, borderBottom: '1px solid rgba(0,0,0,0.1)' }}></div>

              {/* Bottom half - red contact bar */}
              <div className="h-1/2 w-full" style={{ backgroundColor: 'rgb(203, 54, 64)' }} data-red-section>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 w-full h-full py-1 px-4 pl-[46%] sm:pl-[40%] md:pl-[32%] justify-between items-center sm:pr-10">
                  <h1 className="text-[9px] sm:text-xs md:text-base font-medium whitespace-nowrap" style={{ color: 'rgb(255, 255, 255)' }}>
                    {reportData?.workshop?.contact || 'Contact Number'}
                  </h1>
                  <Image
                    src="/icons/footerCommunications.png"
                    alt="Footer communications"
                    width={100}
                    height={24}
                    className="h-2.5 sm:h-4 md:h-6 w-auto object-contain"
                  />
                  <h1 className="text-[9px] sm:text-xs md:text-base font-medium truncate max-w-[100px] sm:max-w-[150px] md:max-w-none" style={{ color: 'rgb(255, 255, 255)' }}>
                    {reportData?.workshop?.address || 'Business Address'}
                  </h1>
                </div>
              </div>
            </div>

            {/* Blue overlapping section */}
            <div
              className="relative z-10 h-full flex flex-col justify-center text-start pl-3 sm:pl-6 text-[9px] sm:text-[11px] md:text-xs font-bold gap-0.5 w-[45%] sm:w-[40%] md:w-[32%] max-w-[45%] sm:max-w-[40%] md:max-w-[32%]"
              style={{
                backgroundColor: 'rgb(23, 113, 183)',
                color: 'rgb(255, 255, 255)',
                clipPath: "polygon(0 0, 80% 0, 95% 100%, 0 100%)",
              }}
              data-blue-section
            >
              <div className="md:contents flex flex-col justify-center h-full">
                <h1 className="leading-tight">{t.footerText1}</h1>
                <h1 className="leading-tight">{t.footerText2}</h1>
                <h1 className="leading-tight">{t.footerText3}</h1>
                <h1 className="leading-tight">{t.footerText4}</h1>
              </div>
            </div>
          </section>

          {/* PDF-only footer — hidden on screen, shown during PDF capture */}
          <div
            data-pdf-footer
            style={{
              display: 'none',
              position: 'relative',
              width: '100%',
              height: '100px',
              overflow: 'hidden',
              marginTop: '1.5rem',
            }}
          >
            {/* Top half — light divider */}
            <div style={{ height: '50px', width: '100%', borderBottom: '1px solid rgba(0,0,0,0.1)' }}></div>

            {/* Bottom half — red contact bar (strictly 50px tall, overflow hidden) */}
            <div style={{
              height: '50px',
              width: '100%',
              backgroundColor: 'rgb(203, 54, 64)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: '34%',
              paddingRight: '2rem',
              gap: '0.75rem',
              boxSizing: 'border-box',
            }}>
              <span style={{ fontSize: '12px', color: 'rgb(255,255,255)', fontWeight: '500', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {reportData?.workshop?.contact || 'Contact Number'}
              </span>
              <img
                src="/icons/footerCommunications.png"
                alt="Footer communications"
                style={{ height: '18px', width: 'auto', display: 'inline-block', flexShrink: 0 }}
              />
              <span style={{ fontSize: '12px', color: 'rgb(255,255,255)', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 1, minWidth: 0 }}>
                {reportData?.workshop?.address || 'Business Address'}
              </span>
            </div>

            {/* Blue overlapping banner — absolutely covers full height on the left */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '32%',
                backgroundColor: 'rgb(23, 113, 183)',
                clipPath: 'polygon(0 0, 80% 0, 95% 100%, 0 100%)',
                paddingLeft: '1.25rem',
                paddingRight: '1rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '1px',
                overflow: 'hidden',
                boxSizing: 'border-box',
              }}
            >
              <span style={{ fontSize: '9px', color: 'rgb(255,255,255)', fontWeight: 'bold', lineHeight: '1.4', whiteSpace: 'nowrap' }}>{t.footerText1}</span>
              <span style={{ fontSize: '9px', color: 'rgb(255,255,255)', fontWeight: 'bold', lineHeight: '1.4', whiteSpace: 'nowrap' }}>{t.footerText2}</span>
              <span style={{ fontSize: '9px', color: 'rgb(255,255,255)', fontWeight: 'bold', lineHeight: '1.4', whiteSpace: 'nowrap' }}>{t.footerText3}</span>
              <span style={{ fontSize: '9px', color: 'rgb(255,255,255)', fontWeight: 'bold', lineHeight: '1.4', whiteSpace: 'nowrap' }}>{t.footerText4}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
