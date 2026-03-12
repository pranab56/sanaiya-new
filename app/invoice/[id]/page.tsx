"use client";

import { useGetInvoiceQuery } from "@/utils/baseApi";
import { baseURL } from "@/utils/BaseUrl";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import React from 'react';

// Define types for the invoice data
interface WorkItem {
  work: {
    code: string;
    title: {
      ar: string;
      en: string;
    };
  };
  quantity: number;
  cost: number;
  finalCost: number;
}

interface SparePartItem {
  code: string;
  itemName: string;
  quantity: number;
  cost: number;
  finalCost: number;
}

const Page = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id;
  const providerWorkShopId = searchParams.get("providerWorkShopId");
  const { data, isLoading } = useGetInvoiceQuery({ id: id, providerWorkShopId: providerWorkShopId });
  const invoiceRef = React.useRef<HTMLDivElement>(null);


  const handleDownloadPDF = async () => {
    const element = invoiceRef.current;
    if (!element) {
      return null
    }

    // Wait a brief moment to ensure all images are fully loaded and rendered
    await new Promise(resolve => setTimeout(resolve, 1000));

    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 3, // Increased scale for better image quality
      useCORS: true,
      allowTaint: true,
      logging: false,
      // Removed windowWidth to let html2canvas use the exact current viewport size natively
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc: Document) => {
        const clonedElement = clonedDoc.querySelector('#invoice-container') as HTMLElement;
        if (!clonedElement) return;

        // Preserve native rendered styles instead of forcing A4 dimensions
        clonedElement.style.overflow = 'visible';

        const all = clonedDoc.querySelectorAll("*");
        all.forEach((el) => {
          const htmlEl = el as HTMLElement;
          try {
            const styles = getComputedStyle(htmlEl);

            // ── Color fixes (oklch / lab not rendered by html2canvas) ──
            const isRedText = htmlEl.classList.contains('text-red-600') ||
              htmlEl.classList.contains('text-red-500') ||
              htmlEl.classList.contains('text-[#CB3640]');

            if (isRedText) {
              htmlEl.style.color = 'rgb(203, 54, 64)';
            } else if (styles.color.includes('lab') || styles.color.includes('oklch')) {
              htmlEl.style.color = 'rgb(0,0,0)';
            }

            if (styles.backgroundColor.includes('lab') || styles.backgroundColor.includes('oklch')) {
              if (htmlEl.classList.contains('bg-[#CB3640]') || htmlEl.classList.contains('bg-red-600')) {
                htmlEl.style.backgroundColor = 'rgb(203, 54, 64)';
              } else if (htmlEl.classList.contains('bg-[#1771B7]') || htmlEl.classList.contains('bg-blue-600')) {
                htmlEl.style.backgroundColor = 'rgb(23, 113, 183)';
              } else if (htmlEl.classList.contains('bg-gray-100')) {
                htmlEl.style.backgroundColor = 'rgb(243, 244, 246)';
              } else if (htmlEl.classList.contains('bg-gray-200')) {
                htmlEl.style.backgroundColor = 'rgb(229, 231, 235)';
              } else {
                htmlEl.style.backgroundColor = 'transparent';
              }
            }

            if (styles.borderColor.includes('lab') || styles.borderColor.includes('oklch')) {
              htmlEl.style.borderColor = 'rgb(209, 213, 219)';
            }

            // ── Image fixes (keep basic scaling constraint but don't force desktop sizes) ──
            if (htmlEl.tagName === 'IMG') {
              const isInsidePdfFooter = htmlEl.closest('[data-pdf-footer]');
              if (!isInsidePdfFooter) {
                const img = htmlEl as HTMLImageElement;
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.style.display = 'inline-block';
              }
            }
            // Removed manual flex/grid overrides so the native Tailwind UI renders exactly as seen.
            if (htmlEl.tagName === 'TABLE') {
              htmlEl.style.minWidth = '0';
              htmlEl.style.width = '100%';
            }
          } catch (e) {
            console.warn(e);
          }
        });

        // Swap screen footer ↔ PDF footer
        const screenFooter = clonedDoc.querySelector('[data-footer-section]') as HTMLElement;
        const pdfFooter = clonedDoc.querySelector('[data-pdf-footer]') as HTMLElement;
        if (screenFooter) screenFooter.style.display = 'none';
        if (pdfFooter) pdfFooter.style.display = 'block';
      },
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = 297;
    const imgWidthPx = canvas.width;
    const imgHeightPx = canvas.height;

    const scale = Math.min(pageWidth / imgWidthPx, pageHeight / imgHeightPx);
    const pdfWidth = imgWidthPx * scale;
    const pdfHeight = imgHeightPx * scale;

    const marginX = (pageWidth - pdfWidth) / 2;
    const marginY = 0; // Top align for invoices

    pdf.addImage(imgData, "PNG", marginX, marginY, pdfWidth, pdfHeight);
    pdf.save(`invoice-${invoiceData?.recieptNumber || 'output'}.pdf`);

  };

  const formatDateDMY = (dateValue: string) => {
    if (!dateValue) return "N/A";

    return new Date(dateValue).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };


  const formatTimeHM = (dateValue: string) => {
    if (!dateValue) return "N/A";
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };


  if (isLoading) return <div className='h-screen flex justify-center items-center'>Loading...</div>;

  if (!data?.data) return <div className='h-screen flex justify-center items-center'>No invoice data available</div>;

  const invoiceData = data.data;

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Sticky download bar — matches Reports style */}
      <div className='no-print sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm'>
        <div className='max-w-4xl mx-auto px-3 sm:px-6 py-2.5 flex justify-end'>
          <button
            onClick={handleDownloadPDF}
            className='border border-gray-300 text-sm cursor-pointer px-4 sm:px-6 py-2 shadow-sm hover:shadow-md hover:border-gray-400 bg-white rounded transition-all duration-200 active:scale-95'
            type='button'
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className='p-2 sm:p-4'>
        <div
          ref={invoiceRef}
          className="w-full max-w-4xl mx-auto flex flex-col gap-4 bg-white p-4 sm:p-6 border border-gray-200 shadow-sm overflow-hidden print:max-w-[210mm] print:mx-0 print:p-0 print:border-none print:shadow-none"
          id="invoice-container"
          style={{ backgroundColor: 'rgb(255, 255, 255)' }}
        >
          {/* ── HEADER ──
            Mobile  : [Logo + QR grouped left] | [Workshop info right]
            Desktop : [Logo] | [Workshop info center] | [QR right]  — unchanged
        */}

          {/* MOBILE layout (hidden on sm+) */}
          <div className="flex sm:hidden flex-row items-center gap-3">
            {/* Left group: Logo and QR side by side */}
            <div className="shrink-0 flex flex-row items-center gap-1.5">
              {/* Logo */}
              <Image
                src={`${baseURL}${invoiceData?.image}`}
                height={200}
                width={200}
                className='w-14 h-14 object-contain'
                alt='Workshop Logo'
                priority
              />
              {/* QR — with border frame on mobile */}
              {invoiceData?.invoiceQRLink && (
                <div className="border-2 border-gray-400 rounded-sm p-0.5">
                  <Image
                    src={baseURL + invoiceData.invoiceQRLink}
                    height={200}
                    width={200}
                    className='w-14 h-14 object-contain'
                    alt='QR Code'
                    priority
                  />
                </div>
              )}
            </div>

            {/* Right: Workshop info */}
            <div className="flex-1 text-right">
              <p className="text-xs font-semibold leading-tight mb-0.5">
                {invoiceData?.providerWorkShopId?.workshopNameEnglish || 'N/A'}
              </p>
              <h1 className="text-sm font-bold text-gray-900 mb-1 leading-tight">
                {invoiceData?.providerWorkShopId?.workshopNameArabic || 'N/A'}
              </h1>
              <p className="text-[9px] text-gray-500 leading-snug">
                CR No: <span className="font-medium text-gray-700">{invoiceData?.providerWorkShopId?.crn || 'N/A'}</span>
              </p>
              <p className="text-[9px] text-gray-500 leading-snug">
                VAT No: <span className="font-medium text-gray-700">{invoiceData?.providerWorkShopId?.taxVatNumber || 'N/A'}</span>
              </p>
              <p className="text-[9px] text-gray-500 leading-snug">
                iBan: <span className="font-medium text-gray-700 break-all">{invoiceData?.providerWorkShopId?.bankAccountNumber || 'N/A'}</span>
              </p>
            </div>
          </div>

          {/* DESKTOP layout (hidden on mobile, visible sm+) */}
          <div className="hidden sm:flex flex-row items-center justify-between gap-5 print:flex">
            <div className="flex items-center gap-5">
              {/* Logo */}
              <div className="shrink-0">
                <Image
                  src={`${baseURL}${invoiceData?.image}`}
                  height={1000}
                  width={1000}
                  className='w-24 h-24 object-contain print:w-24 print:h-24'
                  alt='Workshop Logo'
                  priority
                />
              </div>
              {/* QR */}
              <div className="shrink-0">
                {invoiceData?.invoiceQRLink && (
                  <Image
                    src={baseURL + invoiceData.invoiceQRLink}
                    height={1000}
                    width={1000}
                    className='w-24 h-24 object-contain print:w-24 print:h-24'
                    alt='QR Code'
                    priority
                  />
                )}
              </div>
            </div>

            {/* Workshop Info */}
            <div className="flex-1 text-center sm:text-right print:text-right">
              <p className="text-xl font-semibold mb-1 print:text-base">
                {invoiceData?.providerWorkShopId?.workshopNameEnglish || 'N/A'}
              </p>
              <h1 className="text-lg font-bold text-gray-900 mb-2 print:text-2xl">
                {invoiceData?.providerWorkShopId?.workshopNameArabic || 'N/A'}
              </h1>
              <p className="text-xs text-gray-500 mb-1 print:text-xs">
                CR No: <span className="font-medium text-gray-700">{invoiceData?.providerWorkShopId?.crn || 'N/A'}</span>
              </p>
              <p className="text-xs text-gray-500 mb-1 print:text-xs">
                VAT No: <span className="font-medium text-gray-700">{invoiceData?.providerWorkShopId?.taxVatNumber || 'N/A'}</span>
              </p>
              <p className="text-xs text-gray-500 print:text-xs">
                iBan No: <span className="font-medium text-gray-700">{invoiceData?.providerWorkShopId?.bankAccountNumber || 'N/A'}</span>
              </p>
            </div>
          </div>
          <div className="mt-2">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-4">
              <div className=" w-full text-center">
                <h1 className="text-lg mb-1">(Simplified tax invoice)</h1>
                <h2 className="text-2xl font-bold mb-4">فاتورة ضريبية مبسطة</h2>

                <div className="space-y-3 print:space-y-3">
                  <div className="flex justify-start items-center gap-2 print:gap-5">
                    <span className="text-gray-700  print:text-gray-700">invoice no.</span>
                    <span className="text-red-600 text-xs font-semibold print:text-red-600">{invoiceData?.recieptNumber || 'N/A'}</span>
                  </div>

                  <div className="flex justify-start items-center gap-2 print:gap-5">
                    <span className="text-gray-700 print:text-gray-700">invoice date</span>
                    <span className="text-red-600 text-xs font-semibold print:text-red-600">
                      {invoiceData?.createdAt ? formatDateDMY(invoiceData.createdAt) : 'N/A'}
                    </span>
                    {invoiceData?.createdAt && (
                      <span className="text-red-600 text-xs font-semibold print:text-red-600">
                        {formatTimeHM(invoiceData.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Type */}
            <div className="text-center mb-6">
              <span className="text-2xl font-bold text-red-600">
                {invoiceData?.paymentMethod || 'N/A'} / {invoiceData?.paymentStatus || 'N/A'}
              </span>
            </div>

            {/* Vehicle Information Bar */}

            <section className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 h-auto print:flex-row'>
              <section className="bg-gray-100 rounded-sm flex items-center justify-between w-full sm:w-[65%] lg:w-[70%] px-3 sm:px-4 py-3 print:w-[70%] min-h-[50px]">
                <div className="flex items-center gap-4 sm:gap-6 print:gap-6">
                  {/* Brand Logo */}
                  <div className="shrink-0">
                    {invoiceData?.car?.brand?.image && (
                      <Image
                        src={baseURL + invoiceData.car.brand.image}
                        height={40}
                        width={40}
                        className='w-10 h-10 sm:w-14 sm:h-14 object-contain'
                        alt='Brand Logo'
                      />
                    )}
                  </div>

                  <div className="text-base sm:text-lg font-bold print:text-lg">{invoiceData?.car?.brand?.title || 'N/A'}</div>
                </div>

                <div className="text-base sm:text-lg font-bold print:text-lg">{invoiceData?.car?.model?.title || 'N/A'}</div>

                <div className="text-base sm:text-lg font-bold print:text-lg">{invoiceData?.car?.year || 'N/A'}</div>
              </section>

              <section className='w-full sm:w-[32%] lg:w-[28%] print:w-[28%]'>

                <div className="">
                  <div className="flex flex-col gap-2 print:gap-2">
                    {/* Top Section - KW Number */}
                    <div className={`border-2 border-gray-500 rounded-sm bg-white px-1 ${invoiceData?.car?.plateNumberForInternational ? "py-2" : "py-4"}`}>
                      <div className="text-md text-center font-black tracking-wider print:text-md">
                        {invoiceData?.car?.plateNumberForInternational}
                      </div>
                    </div>

                    {/* Bottom Section - Main Plate */}
                    <div className="border-3 border-gray-600 rounded-sm bg-white overflow-hidden print:overflow-hidden">
                      <div className="flex print:flex">
                        {/* Left Column - Numbers and Arabic */}
                        <div className="flex-1 flex flex-col print:flex-col">
                          {/* Top Row */}
                          <div className="border-b-3 border-gray-600 flex flex-1 print:flex">
                            <div className="flex-1 border-r-3 border-gray-600 py-2 px-0 sm:px-3 sm:py-2 flex items-center justify-center print:px-3 print:py-2">
                              <span className="text-sm sm:text-md font-bold whitespace-nowrap print:text-md">{invoiceData?.car?.plateNumberForSaudi?.numberArabic || 'N/A'}</span>
                            </div>

                            <div className="flex-1 border-r-3 border-gray-600 py-2 px-0 sm:px-3 sm:py-2 flex items-center justify-center print:px-3 print:py-2">
                              <span className="text-sm sm:text-md font-bold whitespace-nowrap tracking-wide print:text-md">
                                {invoiceData?.car?.plateNumberForSaudi?.alphabetsCombinations?.[1]
                                  ?.split('').reverse()
                                  .join(' ') || 'N/A'}
                              </span>
                            </div>
                          </div>

                          {/* Bottom Row */}
                          <div className="flex flex-1 print:flex">
                            <div className="flex-1 border-r-3 border-gray-600 py-2 px-0 sm:px-3 sm:py-2 flex items-center justify-center print:px-3 print:py-2">
                              <span className="text-sm sm:text-md font-bold whitespace-nowrap print:text-md">{invoiceData?.car?.plateNumberForSaudi?.numberEnglish || 'N/A'}</span>
                            </div>
                            <div className="flex-1 border-r-3 border-gray-600 py-2 px-0 sm:px-3 sm:py-2 flex items-center justify-center print:px-3 print:py-2">
                              <span className="text-sm sm:text-md font-bold whitespace-nowrap print:text-md" style={{ fontFamily: 'Arial' }}>
                                {invoiceData?.car?.plateNumberForSaudi?.alphabetsCombinations?.[0]
                                  ?.split('')
                                  .join(' ') || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right Column - Saudi Emblem */}
                        <div className=" bg-white flex flex-col items-center justify-center   print:flex-col">
                          {invoiceData?.car?.plateNumberForSaudi?.symbol?.image && (
                            <Image
                              src={baseURL + invoiceData.car.plateNumberForSaudi.symbol.image}
                              height={10000}
                              width={10000}
                              className='w-10 h-full'
                              alt='Saudi Emblem'
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </section>
          </div>

          <div className="w-full px-3 sm:px-8 py-3 sm:py-4 border border-gray-300 rounded print:px-8 print:py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-8 print:flex-row print:gap-8">
              {/* VAT Number */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-3 sm:gap-4 print:gap-4">
                <span className="text-gray-900 font-semibold text-xs whitespace-nowrap">VAT -{invoiceData?.client.documentNumber || 'N/A'}</span>
                <span className="text-gray-700 font-medium text-xs whitespace-nowrap">الرقم الضريبي</span>
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-3 sm:gap-4 print:gap-4 border-t border-b border-gray-100 py-2 sm:border-none sm:py-0">
                <span className="text-gray-900 font-semibold whitespace-nowrap">{invoiceData?.client?.clientId?.contact || 'N/A'}</span>
                <span className="text-gray-700 font-medium whitespace-nowrap">الجوال</span>
              </div>

              {/* Customer Name */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-3 sm:gap-4 print:gap-4">
                <span className="text-gray-700 font-medium whitespace-nowrap">{invoiceData?.customerInvoiceName || 'N/A'}</span>
                <span className="text-gray-900 font-semibold whitespace-nowrap">اسم العميل</span>
              </div>
            </div>
          </div>
          {/* -------------------------------------------------- */}

          <div className="mt-6 sm:mt-8">
            {/* Works Table */}
            <div className="mb-6 sm:mb-8 -mx-3 sm:mx-0 overflow-x-auto">
              <table className="w-full border-collapse min-w-[560px] sm:min-w-[700px] print:min-w-0">
                <thead>
                  <tr className="bg-[#1771B7] text-white print:bg-[#1771B7]">
                    <th className="border-2 border-white px-4 py-3 text-center font-semibold print:px-4 print:py-3">N</th>
                    <th className="border-2 border-white px-4 py-3 text-center font-semibold print:px-4 print:py-3">
                      الرمز<br />Code
                    </th>
                    <th className="border-2 border-white px-4 py-3 text-center font-semibold print:px-4 print:py-3">
                      الأعمـــال<br />Works
                    </th>
                    <th className="border-2 border-white px-4 py-3 text-center font-semibold print:px-4 print:py-3">
                      عدد<br />Qt.
                    </th>
                    <th className="border-2 border-white px-4 py-3 text-center font-semibold print:px-4 print:py-3">
                      السعر<br />Price
                    </th>
                    <th className="border-2 border-white px-4 py-3 text-center font-semibold print:px-4 print:py-3">
                      الإجمالي<br />Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData?.worksList && invoiceData?.worksList?.length > 0 ? (
                    invoiceData.worksList.map((item: WorkItem, index: number) => (
                      <tr key={index} className="bg-gray-100 print:bg-gray-100">
                        <td className="border border-gray-300 px-3 py-4 sm:px-4 sm:py-6 text-center print:px-4 print:py-6">{index + 1}</td>
                        <td className="border border-gray-300 px-3 py-4 sm:px-4 sm:py-6 text-center print:px-4 print:py-6">{item?.work?.code || "N/A"}</td>
                        <td className="border text-[10px] sm:text-xs border-gray-300 text-center px-3 py-4 sm:px-4 sm:py-6 print:px-4 print:py-6">
                          {item?.work?.title?.ar} <br />
                          {item.work?.title?.en}
                        </td>
                        <td className="border border-gray-300 text-center px-3 py-4 sm:px-4 sm:py-6 print:px-4 print:py-6">{item?.quantity || "N/A"}</td>
                        <td className="border border-gray-300 px-3 py-4 sm:px-4 sm:py-6 text-center print:px-4 print:py-6">{item?.cost || "N/A"}</td>
                        <td className="border border-gray-300 px-3 py-4 sm:px-4 sm:py-6 text-center print:px-4 print:py-6">{item?.finalCost || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="border border-gray-300 px-4 py-8 text-center print:px-4 print:py-8">
                        <div className="text-gray-500 italic">No work items available</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Spare Parts Table */}
            <div className="mb-6 sm:mb-8 -mx-3 sm:mx-0 overflow-x-auto">
              <table className="w-full border-collapse min-w-[560px] sm:min-w-[700px] print:min-w-0">
                <thead>
                  <tr className="bg-[#1771B7] text-white print:bg-[#1771B7]">
                    <th className="border-2 border-white px-4 py-3 text-center font-semibold print:px-4 print:py-3">N</th>
                    <th className="border-2 border-white px-4 py-3 text-center font-semibold print:px-4 print:py-3">
                      الرمز<br />Code
                    </th>
                    <th className="border-2 border-white px-4 py-3 text-center font-semibold print:px-4 print:py-3">
                      قطع غيار<br />Spare Parts
                    </th>
                    <th className="border-2 border-white px-4 py-3 text-center font-semibold print:px-4 print:py-3">
                      عدد<br />Qt.
                    </th>
                    <th className="border-2 border-white px-4 py-3 text-center font-semibold print:px-4 print:py-3">
                      السعر<br />Price
                    </th>
                    <th className="border-2 border-white px-4 py-3 text-center font-semibold print:px-4 print:py-3">
                      الإجمالي<br />Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData?.sparePartsList && invoiceData.sparePartsList.length > 0 ? (
                    invoiceData.sparePartsList.map((item: SparePartItem, index: number) => (
                      <tr key={index} className="bg-gray-100 print:bg-gray-100">
                        <td className="border border-gray-300 text-center px-3 py-4 sm:px-4 sm:py-6 print:px-4 print:py-6">{index + 1}</td>
                        <td className="border border-gray-300 px-3 text-center py-4 sm:px-4 sm:py-6 print:px-4 print:py-6">{item?.code || "N/A"}</td>
                        <td className="border border-gray-300 px-3 py-4 sm:px-4 sm:py-6 text-center print:px-4 print:py-6">{item.itemName || "N/A"}</td>
                        <td className="border border-gray-300 px-3 py-4 sm:px-4 sm:py-6 text-center print:px-4 print:py-6">{item.quantity || "N/A"}</td>
                        <td className="border border-gray-300 px-3 py-4 sm:px-4 sm:py-6 text-center print:px-4 print:py-6">{item.cost || "N/A"}</td>
                        <td className="border border-gray-300 px-3 py-4 sm:px-4 sm:py-6 text-center print:px-4 print:py-6">{item.finalCost || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="border border-gray-300 px-4 py-8 text-center print:px-4 print:py-8">
                        <div className="text-gray-500 italic">No spare parts available</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ------------------------------------------------ */}

          <div className="print:overflow-visible mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-2">
              {/* Right Section - Warranty Terms */}
              <div className="space-y-4 print:space-y-4">
                <div className='border p-2 rounded print:p-2'>
                  <h2 className="text-xl font-bold text-center mb-4 print:text-xl">
                    شروط الضمان والصيانة
                    <div className="text-sm font-normal text-gray-600 print:text-sm">
                      (Warranty and maintenance terms)
                    </div>
                  </h2>

                  <div className="space-y-3  text-sm leading-relaxed text-right print:text-sm print:space-y-3">
                    <p>
                      المركز يضمن أعمال شغل اليد فقط إذا كانت القطع المستبدلة أصليه ومدة الضمان
                      لا تتجاوز شهر من تاريخ الفاتورة
                    </p>
                    <p>
                      المركز غير مسئول عن قطع الغيار القديمة بعد استبدالها وعدم قيام العميل بطلبها وأخذها
                      بعد الصيانة مباشرة وبعد تصريح مباشر بالاستغناء عنها ولا يُسأل عنها الورشة مطلقاً
                    </p>
                    <p>
                      المركز غير مسئول عن تركيب قطع الغيار المستعملة وفي حالة وجود خلل بها يتطلب
                      الفك والتركيب أكثر من مرة يتحمل العميل قيمة شغل اليد عن الفك والتركيب في كل مرة
                    </p>
                    <p>
                      المركز غير مسئول عن رسوب السيارة بالفحص الدوري
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 print:gap-3">
                  <div className="text-base font-medium text-gray-600 print:text-base">(Workshop Manager)</div>
                  <h3 className="text-lg font-bold text-center print:text-lg">مدير الورشة</h3>
                </div>
              </div>

              {/* Left Section - Invoice Totals */}
              <div className="space-y-3 print:space-y-3">
                {/* Total of spare parts */}
                <div className="bg-[#CB3640] text-white p-3 sm:p-2 flex gap-4 items-center rounded mb-4 sm:mb-10 print:mb-10 print:gap-4 ">
                  <span className="shrink-0">
                    <Image
                      src={"/icons/Symbol.png"}
                      height={100}
                      width={100}
                      className='h-8 w-8 sm:h-9 sm:w-9 text-black print:h-11 print:w-10'
                      alt="Symbol"
                    />
                  </span>
                  <div className="flex flex-1 items-center justify-between sm:justify-start gap-4 sm:gap-6 print:gap-3">
                    <div className="text-md sm:text-lg font-bold print:text-lg">({invoiceData?.totalCostOfSparePartsExcludingTax || 0})</div>
                    <div className="text-[10px] sm:text-sm font-medium print:text-lg text-right sm:text-left">
                      <span> اجمالي مبلغ قطع الغيار</span><br />
                      <span>Total of spare parts</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-100 p-3 sm:p-2 font-medium flex gap-4 items-center rounded print:gap-4">
                  <span className="shrink-0">
                    <Image
                      src={"/icons/Symbol_black.png"}
                      height={100}
                      width={100}
                      className='h-8 w-8 sm:h-9 sm:w-9 text-black print:h-11 print:w-10'
                      alt="Symbol"
                    />
                  </span>
                  <div className="flex flex-1 items-center justify-between sm:justify-start gap-4 sm:gap-6 print:gap-3">
                    <div className="text-md sm:text-lg font-bold print:text-lg">({invoiceData?.totalCostOfWorkShopExcludingTax || 0})</div>
                    <div className="text-[10px] sm:text-sm font-medium print:text-lg text-right sm:text-left">
                      <span>المبلغ الخاضع للضريبة</span> <br />
                      <span>Taxable amount </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 p-3 sm:p-2 font-medium flex gap-4 items-center rounded print:gap-4">
                  <span className="shrink-0">
                    <Image
                      src={"/icons/Symbol_black.png"}
                      height={100}
                      width={100}
                      className='h-8 w-8 sm:h-9 sm:w-9 text-black print:h-11 print:w-10'
                      alt="Symbol"
                    />
                  </span>
                  <div className="flex flex-1 items-center justify-between sm:justify-start gap-4 sm:gap-6 print:gap-3">
                    <div className="text-md sm:text-lg font-bold print:text-lg"> ({invoiceData?.finalDiscountInFlatAmount || 0})</div>
                    <div className="text-[10px] sm:text-sm font-medium print:text-lg text-right sm:text-left">
                      <span>الخصم قبل الضريبة</span> <br />
                      <span>Discount</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 p-3 sm:p-2 font-medium flex gap-4 items-center rounded print:gap-4">
                  <span className="shrink-0">
                    <Image
                      src={"/icons/Symbol_black.png"}
                      height={100}
                      width={100}
                      className='h-8 w-8 sm:h-9 sm:w-9 text-black print:h-11 print:w-10'
                      alt="Symbol"
                    />
                  </span>
                  <div className="flex flex-1 items-center justify-between sm:justify-start gap-4 sm:gap-6 print:gap-3">
                    <div className="text-md sm:text-lg font-bold print:text-lg">({invoiceData?.taxAmount || 0})</div>
                    <div className="text-[10px] sm:text-sm font-medium print:text-lg text-right sm:text-left">
                      <span>(15%)الضريبة</span><br />
                      <span>VAT amount</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1771B7] text-white p-3 sm:p-2 flex gap-4 items-center rounded print:gap-4">
                  <span className="shrink-0">
                    <Image
                      src={"/icons/Symbol.png"}
                      height={100}
                      width={100}
                      className='h-8 w-8 sm:h-9 sm:w-9 text-black print:h-11 print:w-10'
                      alt="Symbol"
                    />
                  </span>
                  <div className="flex flex-1 items-center justify-between sm:justify-start gap-4 sm:gap-6 print:gap-3">
                    <div className="text-md sm:text-lg font-bold print:text-lg">({invoiceData?.totalCostIncludingTax || 0})</div>
                    <div className="text-[10px] sm:text-sm font-medium print:text-lg text-right sm:text-left">
                      <span>الإجمالي شامل الضريبة</span><br />
                      <span>Total including tax</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------ */}

          <section className="mt-4 sm:mt-8">
            <section className="relative w-full h-[60px] sm:h-20 overflow-hidden" data-footer-section>
              {/* RIGHT FULL WIDTH SECTION */}
              <div className="absolute inset-0 w-full h-full flex flex-col justify-end">
                {/* Spacer for top half */}
                <div className="h-[25px] sm:h-1/2 w-full opacity-10 border-b border-black"></div>

                {/* Red Bar */}
                <div className="bg-[#CB3640] flex items-center justify-between px-2 sm:px-10 h-[35px] sm:h-1/2 pl-[46%] sm:pl-[42%] md:pl-[34%] gap-1 sm:gap-4">
                  <h1 className="text-[7px] sm:text-xs md:text-sm lg:text-base font-medium text-white whitespace-nowrap">
                    {invoiceData?.providerWorkShopId?.contact || 'N/A'}
                  </h1>

                  <Image
                    src="/icons/footerCommunications.png"
                    alt="Footer communications"
                    width={200}
                    height={50}
                    className="h-3 sm:h-5 md:h-6 w-auto object-contain flex-shrink-0"
                  />

                  <h1 className="text-[7px] sm:text-xs md:text-sm lg:text-base font-medium text-white truncate max-w-[70px] sm:max-w-none">
                    {invoiceData?.providerWorkShopId?.address || "Riyadh-old Industrial"}
                  </h1>
                </div>
              </div>

              {/* LEFT BLUE FIXED SECTION */}
              <div
                className="relative z-10 w-[46%] sm:w-[42%] md:w-[34%] h-full bg-[#1771B7] flex flex-col justify-center text-start pl-2 sm:pl-6 font-bold text-white gap-0.5"
                style={{
                  clipPath: "polygon(0 0, 80% 0, 100% 100%, 0 100%)",
                  fontSize: 'clamp(5px, 1.4vw, 12px)',
                }}
              >
                <h1 className="leading-tight">Thank you for your visit</h1>
                <h1 className="leading-tight">we are at your service</h1>
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
                paddingLeft: '42%', // Increased to avoid overlap
                paddingRight: '2rem',
                gap: '15px', // Added gap between items
                boxSizing: 'border-box',
              }}>
                <span style={{ fontSize: '14px', color: 'rgb(255,255,255)', fontWeight: '500', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {invoiceData?.providerWorkShopId?.contact || 'Contact Number'}
                </span>
                <img
                  src="/icons/footerCommunications.png"
                  alt="Footer communications"
                  style={{ height: '22px', width: 'auto', display: 'inline-block', flexShrink: 0 }}
                />
                <span style={{ fontSize: '14px', color: 'rgb(255,255,255)', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 1, minWidth: 0 }}>
                  {invoiceData?.providerWorkShopId?.address || 'Business Address'}
                </span>
              </div>

              {/* Blue overlapping banner — absolutely covers full height on the left */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: '38%', // Slightly wider for better text fit
                  backgroundColor: 'rgb(23, 113, 183)',
                  clipPath: 'polygon(0 0, 80% 0, 95% 100%, 0 100%)',
                  paddingLeft: '1.5rem',
                  paddingRight: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '2px',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                }}
              >
                <span style={{ fontSize: '13px', color: 'rgb(255,255,255)', fontWeight: 'bold', lineHeight: '1.4', whiteSpace: 'nowrap' }}>Thank you for your visit and</span>
                <span style={{ fontSize: '13px', color: 'rgb(255,255,255)', fontWeight: 'bold', lineHeight: '1.4', whiteSpace: 'nowrap' }}>we are always at your service</span>
              </div>
            </div>
          </section>
        </div>
        {/* end */}
      </div>
    </div>
  );
};

export default Page;
