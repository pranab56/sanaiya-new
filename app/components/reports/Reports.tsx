"use client";
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useGetReportQuery } from '../../../utils/baseApi';

export default function Reports() {
  const searchParams = useSearchParams();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const urlIsReleased = searchParams.get('isReleased');
  const urlLang = searchParams.get('lang');
  const urlWorkshopId = searchParams.get('providerWorkShopId');
  const token = searchParams.get('access_token');

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

  const handleDownloadPDF = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        Loading...
      </div>
    );
  }

  return (
    <>
      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 5mm;
          }

          body {
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          .report-print-container {
            width: 210mm !important;
            margin: 0 auto !important;
            padding: 2mm !important;
            transform: scale(0.88); /* Adjusted to fit everything on 1 page */
            transform-origin: top center;
            page-break-inside: avoid;
          }

          .report-print-container * {
            line-height: 1.25 !important;
            font-size: 10px !important; /* Base font size reduced slightly */
          }

          .report-print-container h1,
          .report-print-container h2,
          .report-print-container h3 {
            font-size: 10px !important;
          }

          .report-print-container .text-2xl {
            font-size: 10px !important;
          }

          .report-print-container .text-4xl {
            font-size: 24px !important;
          }

          .report-print-container .text-xl {
            font-size: 16px !important;
          }

          .report-print-container .text-lg {
            font-size: 14px !important;
          }

          .report-print-container .text-sm {
            font-size: 12px !important;
          }

          .report-print-container .text-xs {
            font-size: 11px !important;
          }

          /* Reduce padding/margins */
          .report-print-container .py-6 { padding-top: 8px !important; padding-bottom: 8px !important; }
          .report-print-container .py-4 { padding-top: 6px !important; padding-bottom: 6px !important; }
          .report-print-container .px-6 { padding-left: 8px !important; padding-right: 8px !important; }
          .report-print-container .px-4 { padding-left: 6px !important; padding-right: 6px !important; }
          .report-print-container .mb-6 { margin-bottom: 8px !important; }
          .report-print-container .mb-8 { margin-bottom: 10px !important; }
          .report-print-container .gap-4 > * { margin-bottom: 8px !important; }

          /* Footer height reduced */
          .report-print-container .h-20,
          .report-print-container .h-24 {
            height: 60px !important;
          }

          /* Prevent page breaks */
          .report-print-container,
          .report-print-container > * {
            page-break-inside: avoid !important;
            page-break-before: avoid !important;
            page-break-after: avoid !important;
          }
        }

        @media screen {
          .report-screen-container {
            width: 100%;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
          }
        }
      `}</style>

      {/* Download PDF Button (only visible on screen) */}
      <div className="no-print fixed top-4 right-4 z-50">
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download PDF
        </button>
      </div>

      {/* Main Report Content */}
      <div className="report-screen-container report-print-container min-h-screen bg-white p-6 print:p-0 print:bg-white">
        {/* Header */}
        <div className="bg-[#1771B7] text-white text-center py-8 px-4">
          <h1 className="text-2xl font-bold mb-2">
            {reportData?.workshop?.workshopNameEnglish || 'Business Name'}
          </h1>
          <p className="text-sm opacity-90">
            {reportData?.workshop?.workshopNameArabic || 'Business Subtitle'}
          </p>
        </div>

        {/* VAT and CR Bar */}
        <div className="bg-[#CB3640] text-white flex justify-between items-center px-6 py-2 text-sm">
          <div>VAT - {reportData?.workshop?.taxVatNumber || 'N/A'}</div>
          <div>CR - {reportData?.workshop?.crn || 'N/A'}</div>
        </div>

        {/* App Title */}
        <div className="text-center py-6">
          <h2 className="text-2xl font-bold text-[#1771B7]">
            Report issued by Senaeya App
          </h2>
        </div>

        {/* Date Range */}
        <div className="mx-6 mb-6">
          <div className="bg-gray-200 text-center py-4 px-4 rounded-lg">
            <p className="text-2xl font-bold text-gray-800">
              From {formatDateToDDMMYYYY(reportData?.range?.start)} to {formatDateToDDMMYYYY(reportData?.range?.end)} Duration: {duration} days
            </p>
          </div>
        </div>

        {/* Invoice Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mx-6 mb-6">
          <div className="text-center bg-gray-50 py-6 px-4 rounded-lg">
            <p className="text-sm text-[#CB3640] font-semibold mb-2">
              Number of<br />saved invoices
            </p>
            <p className="text-4xl font-bold text-[#CB3640]">
              {reportData?.numberOfUnpaidNonPostpaidInvoices || 0}
            </p>
          </div>
          <div className="text-center bg-gray-50 py-6 px-4 rounded-lg">
            <p className="text-sm text-orange-500 font-semibold mb-2">
              Number of<br />Postpaid invoices
            </p>
            <p className="text-4xl font-bold text-orange-500">
              {reportData?.numberOfUnpaidPostpaidInvoices || 0}
            </p>
          </div>
          <div className="text-center bg-gray-50 py-6 px-4 rounded-lg">
            <p className="text-sm text-green-600 font-semibold mb-2">
              Number of<br />completed invoices
            </p>
            <p className="text-4xl font-bold text-green-600">
              {reportData?.numberOfPaidInvoices || 0}
            </p>
          </div>
        </div>

        {/* Financial Boxes */}
        <div className="mx-6 mb-6 space-y-4">
          {/* Total Income */}
          <div className="bg-[#1771B7] text-white rounded-lg py-6 px-6 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <span className="text-3xl font-bold">ر.س</span>
              <span className="text-3xl font-bold">{reportData?.totalIncomeCollected?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="text-xl font-semibold text-center sm:text-right">Total income collected</div>
          </div>

          {/* Total Postpaid */}
          <div className="bg-[#CB3640] text-white rounded-lg py-6 px-6 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <span className="text-3xl font-bold">ر.س</span>
              <span className="text-3xl font-bold">{reportData?.totalUnpaidPostpaidFinalCost?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="text-xl font-semibold text-center sm:text-right">Total postpaid and saved income</div>
          </div>

          {/* Total Expenses */}
          <div className="bg-[#959595] text-white rounded-lg py-6 px-6 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <span className="text-3xl font-bold">ر.س</span>
              <span className="text-3xl font-bold">{reportData?.totalExpenses?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="text-xl font-semibold text-center sm:text-right">Total expenses paid</div>
          </div>
        </div>

        {/* Balance Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mx-6 mb-6">
          {/* Collected Balance */}
          <div className="bg-[#F4F5F7] rounded-lg p-6 text-center">
            <h3 className="text-lg font-bold text-[#1771B7] mb-3">
              Collected financial balance
            </h3>
            <p className="text-sm font-bold text-gray-600">All income collected</p>
            <p className="text-sm font-bold text-gray-600">-</p>
            <p className="text-sm font-bold text-gray-600 mb-4">All expenses paid</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-bold text-[#1771B7]">
                <Image
                  src={"/icons/green_symbol.png"}
                  height={1000}
                  width={1000}
                  className='w-10 h-10'
                  alt='Green symbol'
                />
              </span>
              <span className="text-2xl font-bold text-[#1771B7]">
                {reportData?.collectedFinancialBalance?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>

          {/* Recorded Balance */}
          <div className="bg-[#F4F5F7] rounded-lg p-6 text-center">
            <h3 className="text-lg font-bold text-red-600 mb-3">
              Recorded financial balance
            </h3>
            <p className="text-sm font-bold text-gray-600">All income recorded</p>
            <p className="text-sm font-bold text-gray-600">-</p>
            <p className="text-sm font-bold text-gray-600 mb-4">All expenses paid</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-bold text-red-600">
                <Image
                  src={"/icons/red_symbol.png"}
                  height={1000}
                  width={1000}
                  className='w-10 h-10'
                  alt='Red symbol'
                />
              </span>
              <span className="text-2xl font-bold text-red-600">
                {reportData?.recordedFinancialBalance?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        </div>

        {/* Cars Serviced */}
        <div className="mx-6 mb-8">
          <div className="bg-gray-200 rounded-lg py-4 px-6 flex flex-col sm:flex-row justify-between items-center">
            <div className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
              Cars <span className="ml-4">{reportData?.numberOfCars || 0}</span>
            </div>
            <div className="text-xl font-bold text-gray-800 text-center sm:text-right">
              Number of cars serviced
            </div>
          </div>

          {/* Footer Section */}
          <section className="relative w-full h-20 overflow-hidden mt-3">
            <div className="absolute inset-0 w-full">
              <div className="flex items-center justify-between px-10 h-1/2 opacity-40 gap-2 pl-[29%] py-2"></div>
              <div className="bg-[#CB3640] flex items-center justify-between px-10 h-1/2 pl-[40%]">
                <h1 className="text-base font-medium text-white">
                  {reportData?.workshop?.contact || 'Contact Number'}
                </h1>
                <Image
                  src="/icons/footerCommunications.png"
                  alt="Footer communications"
                  width={1000}
                  height={1000}
                  className="h-6 w-auto"
                />
                <h1 className="text-base font-medium text-white">
                  {reportData?.workshop?.address || 'Business Address'}
                </h1>
              </div>
            </div>
            <div
              className="relative z-10 w-[40%] h-full bg-[#1771B7] flex flex-col justify-center text-start pl-4 text-xs font-medium text-white"
              style={{
                clipPath: "polygon(0 0, 70% 0, 95% 100%, 0 100%)",
              }}
            >
              <h1>You can issue multiple reports </h1>
              <h1>via Senaeya App</h1>
              <h1>Daily - Weekly - Monthly </h1>
              <h1>- Annual Report - and more</h1>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}