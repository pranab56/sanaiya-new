"use client";

import { useGetInvoiceQuery } from "@/utils/baseApi";
import { baseURL } from "@/utils/BaseUrl";
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';

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

  const formatDateDMY = (dateValue: string) => {
    if (!dateValue) return "N/A";

    return new Date(dateValue).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const { data, isLoading } = useGetInvoiceQuery({ id: id, providerWorkShopId: providerWorkShopId });

  if (isLoading) return <div className='h-screen flex justify-center items-center'>Loading...</div>;

  if (!data?.data) return <div className='h-screen flex justify-center items-center'>No invoice data available</div>;

  const invoiceData = data.data;

  return (
    <>
      {/* Print-specific CSS */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 3mm;
          }
          
          body {
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .no-print {
            display: none !important;
          }
          
          .invoice-print-container {
            width: 210mm !important;
            margin: 0 auto !important;
            padding: 2mm !important;
            transform: scale(0.6); /* Reduced from 0.68 to 0.6 for better fit */
            transform-origin: top center;
            page-break-inside: avoid;
          }
          
          /* Smaller text for print */
          .invoice-print-container * {
            line-height: 1.2 !important;
          }
          
          .invoice-print-container .text-xs {
            font-size: 7px !important; /* Reduced from 8px */
          }
          
          .invoice-print-container .text-sm {
            font-size: 8px !important; /* Reduced from 9px */
          }
          
          .invoice-print-container .text-base {
            font-size: 9px !important; /* Reduced from 10px */
          }
          
          .invoice-print-container .text-lg {
            font-size: 11px !important; /* Reduced from 12px */
          }
          
          .invoice-print-container .text-xl {
            font-size: 13px !important; /* Reduced from 14px */
          }
          
          .invoice-print-container .text-2xl {
            font-size: 15px !important; /* Reduced from 16px */
          }
          
          /* Reduce padding for print */
          .invoice-print-container .px-4 {
            padding-left: 5px !important;
            padding-right: 5px !important;
          }
          
          .invoice-print-container .py-2 {
            padding-top: 2px !important;
            padding-bottom: 2px !important;
          }
          
          .invoice-print-container .py-3 {
            padding-top: 3px !important;
            padding-bottom: 3px !important;
          }
          
          .invoice-print-container .py-4 {
            padding-top: 4px !important;
            padding-bottom: 4px !important;
          }
          
          .invoice-print-container .py-6 {
            padding-top: 5px !important;
            padding-bottom: 5px !important;
          }
          
          .invoice-print-container .px-6 {
            padding-left: 7px !important;
            padding-right: 7px !important;
          }
          
          .invoice-print-container .px-8 {
            padding-left: 8px !important;
            padding-right: 8px !important;
          }
          
          .invoice-print-container .gap-2 {
            gap: 2px !important;
          }
          
          .invoice-print-container .gap-3 {
            gap: 3px !important;
          }
          
          .invoice-print-container .gap-4 {
            gap: 4px !important;
          }
          
          .invoice-print-container .gap-6 {
            gap: 6px !important;
          }
          
          .invoice-print-container .gap-8 {
            gap: 7px !important;
          }
          
          .invoice-print-container .mb-2 {
            margin-bottom: 2px !important;
          }
          
          .invoice-print-container .mb-3 {
            margin-bottom: 3px !important;
          }
          
          .invoice-print-container .mb-4 {
            margin-bottom: 4px !important;
          }
          
          .invoice-print-container .mb-6 {
            margin-bottom: 5px !important;
          }
          
          .invoice-print-container .mb-8 {
            margin-bottom: 6px !important;
          }
          
          .invoice-print-container .mb-10 {
            margin-bottom: 8px !important;
          }
          
          .invoice-print-container .-mb-10 {
            margin-bottom: -8px !important;
          }
          
          .invoice-print-container .-mt-8 {
            margin-top: -6px !important;
          }
          
          /* Smaller images for print */
          .invoice-print-container img {
            max-height: 80% !important;
          }
          
          /* Reduce table cell padding */
          .invoice-print-container table td,
          .invoice-print-container table th {
            padding: 3px 5px !important;
          }
          
          /* Make vehicle info section more compact */
          .invoice-print-container .h-auto,
          .invoice-print-container .sm\\:h-\\[100px\\] {
            height: auto !important;
          }
          
          /* Footer section */
          .invoice-print-container .h-20 {
            height: 50px !important;
          }
          
          /* Force single page by preventing page breaks */
          .invoice-print-container {
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
          }
          
          /* Ensure all sections stay together */
          .invoice-print-container > * {
            page-break-inside: avoid !important;
          }
        }
        
        /* Screen styles - normal size */
        @media screen {
          .invoice-screen-container {
            width: 100%;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
          }
        }
      `}</style>

      {/* Download PDF Button */}
      <div className="no-print fixed top-4 right-4 z-50">
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-400 hover:bg-blue-700 cursor-pointer text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2"
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

      {/* Invoice Content */}
      <div className="invoice-screen-container invoice-print-container w-full flex flex-col gap-2 bg-white p-6 border border-gray-50">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="shrink-0">
            <Image
              src={"/icons/logoOne.png"}
              height={1000}
              width={1000}
              className='w-24 h-24'
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
                className='w-24 h-24'
                alt='QR Code'
                priority
              />
            )}
          </div>
          <div className="flex-1 text-right">
            <p className="text-xl mb-1 font-medium">
              {invoiceData?.providerWorkShopId?.workshopNameEnglish || 'N/A'}
            </p>
            <h1 className="text-lg text-gray-900 mb-2">
              {invoiceData?.providerWorkShopId?.workshopNameArabic || 'N/A'}
            </h1>
            <p className="text-xs font-normal mb-3">
              CR No : {invoiceData?.providerWorkShopId?.crn || 'N/A'}
            </p>
            <p className="text-xs font-normal mb-3">
              VAT No : {invoiceData?.providerWorkShopId?.taxVatNumber || 'N/A'}
            </p>
            <p className="text-xs font-normal mb-3">
              iBan No : {invoiceData?.providerWorkShopId?.bankAccountNumber || 'N/A'}
            </p>
          </div>
        </div>

        <div className="-mt-8">
          {/* Header Section */}
          <div className="flex justify-between items-start -mb-10">
            <div className="w-full">
              <h1 className="text-center text-lg mb-2">(Simplified tax invoice)</h1>
              <h2 className="text-center text-2xl font-bold mb-6">فاتورة ضريبية مبسطة</h2>

              <div className="space-y-3">
                <div className="flex justify-start items-center gap-2">
                  <span className="text-gray-700">invoice no.</span>
                  <span className="text-red-600 text-xs font-semibold">{invoiceData?._id || 'N/A'}</span>
                </div>
                <div className="flex justify-start items-center gap-2">
                  <span className="text-gray-700">invoice date</span>
                  <span className="text-red-600 text-xs font-semibold">
                    {invoiceData?.createdAt ? formatDateDMY(invoiceData.createdAt) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Type */}
          <div className="text-center mb-8">
            <span className="text-2xl font-bold text-red-600">
              {invoiceData?.paymentMethod || 'N/A'} / {invoiceData?.paymentStatus || 'N/A'}
            </span>
          </div>

          {/* Vehicle Information Bar */}
          <section className='flex flex-col sm:flex-row items-end justify-between gap-2 h-auto sm:h-[100px]'>
            <section className="bg-gray-200 rounded-sm flex items-center justify-between w-full sm:w-9/12 px-3">
              <div className="flex items-center gap-6">
                <div>
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
                <div className="text-xl font-bold">{invoiceData?.car?.brand?.title || 'N/A'}</div>
              </div>
              <div className="text-xl font-bold">{invoiceData?.car?.model?.title || 'N/A'}</div>
              <div className="text-xl font-bold">{invoiceData?.car?.year || 'N/A'}</div>
            </section>

            <section className='w-full sm:w-4/12 mt-4 sm:mt-0'>
              <div className="">
                <div className="flex flex-col gap-2">
                  <div className={`border-2 border-gray-500 rounded-sm bg-white px-1 ${invoiceData?.car?.plateNumberForInternational ? "py-2" : "py-4"}`}>
                    <div className="text-md text-center font-black tracking-wider">
                      {invoiceData?.car?.plateNumberForInternational}
                    </div>
                  </div>

                  <div className="border-3 border-gray-600 rounded-sm bg-white overflow-hidden">
                    <div className="flex">
                      <div className="flex-1 flex flex-col">
                        <div className="border-b-3 border-gray-600 flex">
                          <div className="flex-1 border-r-3 border-gray-600 px-6 py-6 flex items-center justify-center">
                            <span className="text-md font-bold">{invoiceData?.car?.plateNumberForSaudi?.numberArabic || 'N/A'}</span>
                          </div>
                          <div className="flex-1 border-r-3 border-gray-600 px-6 py-6 flex items-center justify-center">
                            <span className="text-md font-bold" style={{ fontFamily: 'Arial' }}>
                              {invoiceData?.car?.plateNumberForSaudi?.alphabetsCombinations?.[1] || 'N/A'}
                            </span>
                          </div>
                        </div>
                        <div className="flex">
                          <div className="flex-1 border-r-3 border-gray-600 px-6 py-6 flex items-center justify-center">
                            <span className="text-md font-bold">{invoiceData?.car?.plateNumberForSaudi?.numberEnglish || 'N/A'}</span>
                          </div>
                          <div className="flex-1 border-r-3 border-gray-600 px-6 py-6 flex items-center justify-center">
                            <span className="text-md font-bold tracking-wide">
                              {invoiceData?.car?.plateNumberForSaudi?.alphabetsCombinations?.[0] || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white flex flex-col items-center justify-center">
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

        <div className="w-full px-8 py-4 border border-gray-300 rounded">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <span className="text-gray-900 font-semibold text-xs">VAT -{invoiceData?.providerWorkShopId?.taxVatNumber || 'N/A'}</span>
              <span className="text-gray-700 font-medium text-xs">الرقم الضريبي</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-900 font-semibold">{invoiceData?.client?.clientId?.contact || 'N/A'}</span>
              <span className="text-gray-700 font-medium">الجوال</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">{invoiceData?.customerInvoiceName || 'N/A'}</span>
              <span className="text-gray-900 font-semibold">اسم العميل</span>
            </div>
          </div>
        </div>

        <div>
          {/* Works Table */}
          <div className="mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#1771B7] text-white">
                  <th className="border-2 border-white px-4 py-3 text-center font-semibold">N</th>
                  <th className="border-2 border-white px-4 py-3 text-center font-semibold">
                    الرمز<br />Code
                  </th>
                  <th className="border-2 border-white px-4 py-3 text-center font-semibold">
                    الأعمـــال<br />Works
                  </th>
                  <th className="border-2 border-white px-4 py-3 text-center font-semibold">
                    عدد<br />Qt.
                  </th>
                  <th className="border-2 border-white px-4 py-3 text-center font-semibold">
                    السعر<br />Price
                  </th>
                  <th className="border-2 border-white px-4 py-3 text-center font-semibold">
                    الإجمالي<br />Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoiceData?.worksList && invoiceData.worksList.length > 0 ? (
                  invoiceData.worksList.map((item: WorkItem, index: number) => (
                    <tr key={index} className="bg-gray-100">
                      <td className="border border-gray-300 px-4 py-6 text-center">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-6 text-center">{item.work.code || "N/A"}</td>
                      <td className="border text-xs border-gray-300 text-center px-4 py-6">
                        {item.work.title.ar} <br />
                        {item.work.title.en}
                      </td>
                      <td className="border border-gray-300 text-center px-4 py-6">{item.quantity || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-6 text-center">{item.cost || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-6 text-center">{item.finalCost || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="border border-gray-300 px-4 py-8 text-center">
                      <div className="text-gray-500 italic">No work items available</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Spare Parts Table */}
          <div className="mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#1771B7] text-white">
                  <th className="border-2 border-white px-4 py-3 text-center font-semibold">N</th>
                  <th className="border-2 border-white px-4 py-3 text-center font-semibold">
                    الرمز<br />Code
                  </th>
                  <th className="border-2 border-white px-4 py-3 text-center font-semibold">
                    قطع غيار<br />Spare Parts
                  </th>
                  <th className="border-2 border-white px-4 py-3 text-center font-semibold">
                    عدد<br />Qt.
                  </th>
                  <th className="border-2 border-white px-4 py-3 text-center font-semibold">
                    السعر<br />Price
                  </th>
                  <th className="border-2 border-white px-4 py-3 text-center font-semibold">
                    الإجمالي<br />Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoiceData?.sparePartsList && invoiceData.sparePartsList.length > 0 ? (
                  invoiceData.sparePartsList.map((item: SparePartItem, index: number) => (
                    <tr key={index} className="bg-gray-100">
                      <td className="border border-gray-300 text-center px-4 py-6">{index + 1}</td>
                      <td className="border border-gray-300 px-4 text-center py-6">{item.code || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-6 text-center">{item.itemName || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-6 text-center">{item.quantity || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-6 text-center">{item.cost || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-6 text-center">{item.finalCost || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="border border-gray-300 px-4 py-8 text-center">
                      <div className="text-gray-500 italic">No spare parts available</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Right Section - Warranty Terms */}
            <div className="space-y-4">
              <div className='border p-2 rounded'>
                <h2 className="text-xl font-bold text-center mb-4">
                  شروط الضمان والصيانة
                  <div className="text-sm font-normal text-gray-600">
                    (Warranty and maintenance terms)
                  </div>
                </h2>

                <div className="space-y-3 text-sm leading-relaxed text-right">
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

              <div className="flex items-center justify-center gap-3">
                <div className="text-base font-medium text-gray-600">(Workshop Manager)</div>
                <h3 className="text-lg font-bold text-center">مدير الورشة</h3>
              </div>
            </div>

            {/* Left Section - Invoice Totals */}
            <div className="space-y-3">
              <div className="bg-[#CB3640] text-white p-2 flex gap-4 items-center rounded mb-10">
                <span className="text-2xl font-bold">
                  <Image
                    src={"/icons/Symbol.png"}
                    height={1000}
                    width={1000}
                    className='h-9 w-9 text-black'
                    alt="Symbol"
                  />
                </span>
                <div className="flex items-center gap-6">
                  <div className="text-lg">({invoiceData?.totalCostOfSparePartsExcludingTax || 0})</div>
                  <div className="text-sm font-medium w-full">
                    <span className='w-full'>اجمالي مبلغ قطع الغيار</span><br />
                    <span>Total of spare parts</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 p-2 font-medium flex gap-4 items-center rounded">
                <span className="text-2xl font-bold">
                  <Image
                    src={"/icons/Symbol_black.png"}
                    height={1000}
                    width={1000}
                    className='h-9 w-9 text-black'
                    alt="Symbol"
                  />
                </span>
                <div className="flex items-center gap-6">
                  <div className="text-lg">({invoiceData?.totalCostOfWorkShopExcludingTax || 0})</div>
                  <div className="text-sm font-medium w-full">
                    <span>المبلغ الخاضع للضريبة</span> <br />
                    <span>Taxable amount </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 p-2 font-medium flex gap-4 items-center rounded">
                <span className="text-2xl font-bold">
                  <Image
                    src={"/icons/Symbol_black.png"}
                    height={1000}
                    width={1000}
                    className='h-9 w-9 text-black'
                    alt="Symbol"
                  />
                </span>
                <div className="flex items-center gap-6">
                  <div className="text-lg">({invoiceData?.finalDiscountInFlatAmount || 0})</div>
                  <div className="text-sm font-medium w-full">
                    <span>الخصم قبل الضريبة</span> <br />
                    <span>Discount</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 p-2 font-medium flex gap-4 items-center rounded">
                <span className="text-2xl font-bold">
                  <Image
                    src={"/icons/Symbol_black.png"}
                    height={1000}
                    width={1000}
                    className='h-9 w-9 text-black'
                    alt="Symbol"
                  />
                </span>
                <div className="flex items-center gap-6">
                  <div className="text-lg">({invoiceData?.taxAmount || 0})</div>
                  <div className="text-sm font-medium w-full">
                    <span>(15%)الضريبة</span><br />
                    <span>VAT amount</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1771B7] text-white p-2 flex gap-4 items-center rounded">
                <span className="text-2xl font-bold">
                  <Image
                    src={"/icons/Symbol.png"}
                    height={1000}
                    width={1000}
                    className='h-9 w-9 text-black'
                    alt="Symbol"
                  />
                </span>
                <div className="flex items-center gap-6">
                  <div className="text-lg">({invoiceData?.totalCostIncludingTax || 0})</div>
                  <div className="text-sm font-medium w-full">
                    <span>الإجمالي شامل الضريبة</span><br />
                    <span>Total including tax</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="relative w-full h-20 overflow-hidden">
          <div className="absolute inset-0 w-full">
            <div className="flex items-center justify-between px-10 h-1/2 opacity-40 gap-2 pl-[29%] py-2">
            </div>

            <div className="bg-[#CB3640] flex items-center justify-between px-10 h-1/2 pl-[32%]">
              <h1 className="text-base font-medium text-white">
                {invoiceData?.client?.clientId?.contact || 'N/A'}
              </h1>

              <Image
                src="/icons/footerCommunications.png"
                alt="Footer communications"
                width={1000}
                height={1000}
                className="h-6 w-auto"
              />

              <h1 className="text-base font-medium text-white">
                {data?.data?.providerWorkShopId?.address || "Riyadh - old Industrial - ali st."}
              </h1>
            </div>
          </div>

          <div
            className="relative z-10 w-[34%] h-full bg-[#1771B7] flex flex-col justify-center text-start pl-2 text-sm font-medium text-white"
            style={{
              clipPath: "polygon(0 0, 70% 0, 95% 100%, 0 100%)",
            }}
          >
            <h1>Thank you for your visit and</h1>
            <h1>we are always at your service</h1>
          </div>
        </section>
      </div>
    </>
  );
};

export default Page;