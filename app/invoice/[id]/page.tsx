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
  const invoiceRef = React.useRef(null);


  const handleDownloadPDF = async () => {
    const element = invoiceRef.current;
    if (!element) {
      return null
    }

    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      onclone: (doc) => {
        const all = doc.querySelectorAll("*");

        all.forEach((el) => {
          const htmlEl = el as HTMLElement;
          const styles = getComputedStyle(htmlEl);

          // text color
          if (
            styles.color.includes("lab") ||
            styles.color.includes("oklch")
          ) {
            htmlEl.style.color = "rgb(0,0,0)";
          }

          // background color
          if (
            styles.backgroundColor.includes("lab") ||
            styles.backgroundColor.includes("oklch")
          ) {
            htmlEl.style.backgroundColor = "rgb(255,255,255)";
          }

          // border color
          if (
            styles.borderColor.includes("lab") ||
            styles.borderColor.includes("oklch")
          ) {
            htmlEl.style.borderColor = "rgb(200,200,200)";

          }
        });
      },
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm

    // Original image size
    const imgWidthPx = canvas.width;
    const imgHeightPx = canvas.height;

    // Scale to fit exactly in A4
    const scale = Math.min(pageWidth / imgWidthPx, pageHeight / imgHeightPx);

    const pdfWidth = imgWidthPx * scale;
    const pdfHeight = imgHeightPx * scale;

    // Optional: center content horizontally
    const marginX = (pageWidth - pdfWidth) / 2;
    const marginY = (pageHeight - pdfHeight) / 2;

    pdf.addImage(imgData, "PNG", marginX, marginY, pdfWidth, pdfHeight);

    pdf.save("invoice.pdf");

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
    <div className='items-center lg:items-start flex flex-col lg:flex-row-reverse justify-center lg:justify-evenly p-4 gap-6 bg-gray-50 min-h-screen'>
      <button
        className='border border-gray-300 text-sm font-semibold cursor-pointer px-10 py-3 shadow-md hover:shadow-lg w-full lg:w-auto rounded-md bg-white transition-all duration-200 active:scale-95'
        onClick={handleDownloadPDF}
        type='button'
      >
        Download PDF
      </button>

      {/* start */}

      <div
        ref={invoiceRef}
        className="w-full max-w-4xl mx-auto flex flex-col gap-2 bg-white p-4 sm:p-8 border border-gray-200 shadow-sm print:max-w-[210mm] print:mx-0 print:p-0 print:border-none print:shadow-none"
        id="invoice-container"
      >
        {/* Your existing invoice content remains exactly the same */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-5 print:flex-row">
          <div className="shrink-0">
            <Image
              src={`${baseURL}${invoiceData?.image}`}
              height={1000}
              width={1000}
              className='w-24 h-24 print:w-24 print:h-24'
              alt='Logo One'
              priority
            />
          </div>
          <div className="shrink-0">
            {invoiceData?.invoiceQRLink && (
              <Image
                src={baseURL + invoiceData.invoiceQRLink}
                height={1000}
                width={1000}
                className='w-24 h-24 print:w-24 print:h-24'
                alt='QR Code'
                priority
              />
            )}
          </div>
          <div className="flex-1 text-center sm:text-right print:text-right">
            <p className=" text-lg sm:text-xl mb-1 font-medium print:text-base">
              {invoiceData?.providerWorkShopId?.workshopNameEnglish || 'N/A'}
            </p>
            <h1 className="text-md sm:text-lg text-gray-900 mb-2 print:text-2xl">
              {invoiceData?.providerWorkShopId?.workshopNameArabic || 'N/A'}
            </h1>

            <p className="text-[10px] sm:text-xs font-normal mb-1 sm:mb-3 print:text-xs">
              CR No : {invoiceData?.providerWorkShopId?.crn || 'N/A'}
            </p>
            <p className="text-[10px] sm:text-xs font-normal mb-1 sm:mb-3 print:text-xs">
              VAT No : {invoiceData?.providerWorkShopId?.taxVatNumber || 'N/A'}
            </p>
            <p className="text-[10px] sm:text-xs font-normal mb-1 sm:mb-3 print:text-xs">
              iBan No : {invoiceData?.providerWorkShopId?.bankAccountNumber || 'N/A'}
            </p>
          </div>
        </div>
        <div className="mt-4 md:-mt-8 print:-mt-8">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-4 md:-mb-10 print:-mb-10">
            <div className=" w-full">
              <h1 className="text-center text-lg mb-2 print:text-lg">(Simplified tax invoice)</h1>
              <h2 className="text-center text-2xl font-bold mb-6 print:text-2xl">فاتورة ضريبية مبسطة</h2>

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
          <div className="text-center mb-8 print:mb-8">
            <span className="text-2xl font-bold text-red-600 print:text-2xl">
              {invoiceData?.paymentMethod || 'N/A'} / {invoiceData?.paymentStatus || 'N/A'}
            </span>
          </div>

          {/* Vehicle Information Bar */}

          <section className='flex flex-col md:flex-row items-stretch md:items-end justify-between gap-4 md:gap-2 h-auto md:h-25 print:flex-row print:h-25'>
            <section className="bg-gray-200 rounded-sm flex items-center justify-between w-full md:w-8/12 lg:w-9/12 px-4 py-2 md:py-0 print:w-9/12">
              <div className="flex items-center gap-6 print:gap-6">
                {/* Toyota Logo */}
                <div className="print:p-4">
                  {invoiceData?.car?.brand?.image && (
                    <Image
                      src={baseURL + invoiceData.car.brand.image}
                      height={1000}
                      width={1000}
                      className='w-14 h-14 py-2'
                      alt='Brand Logo'
                    />
                  )}
                </div>

                <div className="text-xl font-bold print:text-xl">{invoiceData?.car?.brand?.title || 'N/A'}</div>
              </div>

              <div className="text-xl font-bold print:text-xl">{invoiceData?.car?.model?.title || 'N/A'}</div>

              <div className="text-xl font-bold print:text-xl">{invoiceData?.car?.year || 'N/A'}</div>
            </section>

            <section className='w-full md:w-3/12 lg:w-4/12 print:w-4/12 mt-4 md:mt-0 print:mt-0'>

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
                        <div className="border-b-3 border-gray-600 flex print:flex">
                          <div className="flex-1 border-r-3 border-gray-600 px-3 py-4 sm:px-6 sm:py-6 flex items-center justify-center print:px-6 print:py-6">
                            <span className="text-sm sm:text-md font-bold print:text-md">{invoiceData?.car?.plateNumberForSaudi?.numberArabic || 'N/A'}</span>
                          </div>

                          <div className="flex-1 border-r-3 border-gray-600 px-3 py-4 sm:px-6 sm:py-6 flex items-center justify-center print:px-6 print:py-6">
                            <span className="text-sm sm:text-md font-bold tracking-wide print:text-md">
                              {invoiceData?.car?.plateNumberForSaudi?.alphabetsCombinations?.[1]
                                ?.split('').reverse()
                                .join(' ') || 'N/A'}
                            </span>
                          </div>
                        </div>

                        {/* Bottom Row */}
                        <div className="flex print:flex">
                          <div className="flex-1 border-r-3 border-gray-600 px-3 py-4 sm:px-6 sm:py-6 flex items-center justify-center print:px-6 print:py-6">
                            <span className="text-sm sm:text-md font-bold print:text-md">{invoiceData?.car?.plateNumberForSaudi?.numberEnglish || 'N/A'}</span>
                          </div>
                          <div className="flex-1 border-r-3 border-gray-600 px-3 py-4 sm:px-6 sm:py-6 flex items-center justify-center print:px-6 ">
                            <span className="text-sm sm:text-md font-bold print:text-md" style={{ fontFamily: 'Arial' }}>
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

        <div className="w-full px-8 py-4 border border-gray-300 rounded print:px-8 print:py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 print:flex-row print:gap-8">
            {/* VAT Number */}
            <div className="flex items-center justify-between w-full md:w-auto gap-4 print:gap-4">
              <span className="text-gray-900 font-semibold text-xs whitespace-nowrap">VAT -{invoiceData?.client.documentNumber || 'N/A'}</span>
              <span className="text-gray-700 font-medium text-xs whitespace-nowrap">الرقم الضريبي</span>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between w-full md:w-auto gap-4 print:gap-4 border-t border-b border-gray-100 py-2 md:border-none md:py-0">
              <span className="text-gray-900 font-semibold whitespace-nowrap">{invoiceData?.client?.clientId?.contact || 'N/A'}</span>
              <span className="text-gray-700 font-medium whitespace-nowrap">الجوال</span>
            </div>

            {/* Customer Name */}
            <div className="flex items-center justify-between w-full md:w-auto gap-4 print:gap-4">
              <span className="text-gray-700 font-medium whitespace-nowrap">{invoiceData?.customerInvoiceName || 'N/A'}</span>
              <span className="text-gray-900 font-semibold whitespace-nowrap">اسم العميل</span>
            </div>
          </div>
        </div>
        {/* -------------------------------------------------- */}

        <div className="print:overflow-visible">
          {/* Works Table */}
          <div className="mb-8 print:mb-8 overflow-x-auto">
            <table className="w-full border-collapse min-w-[700px] print:min-w-0">
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
          <div className="mb-8 print:mb-8 overflow-x-auto">
            <table className="w-full border-collapse min-w-[700px] print:min-w-0">
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

        <div className="print:overflow-visible">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2">
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

        <section>
          <section className="relative w-full h-auto sm:h-20 overflow-hidden print:h-24">
            {/* RIGHT FULL WIDTH SECTION */}
            <div className="absolute inset-0 w-full print:w-full">
              {/* Logos */}
              <div className="flex items-center justify-between px-10 h-1/2 opacity-40 gap-2 pl-[29%] py-2 print:pl-[29%] print:py-2">
                {/* Logos section */}
              </div>

              {/* Red Bar */}
              <div className="bg-[#CB3640] flex flex-col sm:flex-row items-center justify-between px-4 sm:px-10 h-auto sm:h-1/2 py-2 sm:py-0 pl-4 sm:pl-[32%] print:pl-[32%]">
                <h1 className="text-xs sm:text-base font-medium text-white print:text-base order-2 sm:order-1">
                  {invoiceData?.providerWorkShopId?.contact || 'N/A'}
                </h1>

                <Image
                  src="/icons/footerCommunications.png"
                  alt="Footer communications"
                  width={200}
                  height={50}
                  className="h-4 sm:h-6 w-auto print:h-7 mb-1 sm:mb-0 order-1 sm:order-2"
                />

                <h1 className="text-xs sm:text-base font-medium text-white print:text-base order-3">
                  {data?.data?.providerWorkShopId?.address || "Riyadh - old Industrial - ali st."}
                </h1>
              </div>
            </div>

            {/* LEFT BLUE FIXED SECTION */}
            <div
              className="relative z-10 w-[60%] sm:w-[34%] h-full bg-[#1771B7] flex flex-col justify-center text-start pl-4 sm:pl-2 text-[10px] sm:text-sm font-medium text-white print:w-[34%] print:pl-5 print:text-sm"
              style={{
                clipPath: "polygon(0 0, 75% 0, 100% 100%, 0 100%)",
              }}
            >
              <h1>Thank you for your visit and</h1>
              <h1>we are always at your service</h1>
            </div>
          </section>
        </section>
      </div>
      {/* end */}
    </div>
  );
};
export default Page;
