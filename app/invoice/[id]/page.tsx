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

  console.log("id", id);
  console.log("providerWorkShopId", providerWorkShopId);

  const images = [
    "/icons/footerImage/image1.png",
    "/icons/footerImage/image2.png",
    "/icons/footerImage/image3.png",
    "/icons/footerImage/image4.png",
    "/icons/footerImage/image5.png",
    "/icons/footerImage/image6.png",
    "/icons/footerImage/image7.png",
    "/icons/footerImage/image8.png",
    "/icons/footerImage/image9.png",
    "/icons/footerImage/image10.png",
  ];

  const { data, isLoading } = useGetInvoiceQuery({ id: id, providerWorkShopId: providerWorkShopId });

  if (isLoading) return <div className='h-screen flex justify-center items-center'>Loading...</div>;

  if (!data?.data) return <div className='h-screen flex justify-center items-center'>No invoice data available</div>;

  const invoiceData = data.data;


  return (
    <div className="w-full max-w-[210mm] mx-auto flex flex-col gap-2 bg-white p-6 border border-gray-50 print:max-w-[210mm] print:mx-0">
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-5 print:flex-row">
        <div className="shrink-0">
          <Image
            src={"/icons/logoOne.png"}
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
        <div className="flex-1 text-right print:text-right">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 print:text-2xl">
            {invoiceData?.providerWorkShopId?.workshopNameArabic || 'N/A'}
          </h1>
          <p className="text-base mb-1 print:text-base">
            {invoiceData?.providerWorkShopId?.workshopNameEnglish || 'N/A'}
          </p>
          <p className="text-xs font-normal mb-3 print:text-xs">
            CR No : {invoiceData?.providerWorkShopId?.crn || 'N/A'}
          </p>
          <p className="text-xs font-normal mb-3 print:text-xs">
            VAT No : {invoiceData?.providerWorkShopId?.taxVatNumber || 'N/A'}
          </p>
          <p className="text-xs font-normal mb-3 print:text-xs">
            iBan No : {invoiceData?.providerWorkShopId?.bankAccountNumber || 'N/A'}
          </p>
        </div>
      </div>
      <div className="-mt-8 print:-mt-8">
        {/* Header Section */}
        <div className="flex justify-between items-start -mb-10 print:-mb-10">
          <div className=" w-full">
            <h1 className="text-center text-lg mb-2 print:text-lg">(Simplified tax invoice)</h1>
            <h2 className="text-center text-2xl font-bold mb-6 print:text-2xl">فاتورة ضريبية مبسطة</h2>

            <div className="space-y-3 print:space-y-3">
              <div className="flex justify-start items-center gap-2 print:gap-5">
                <span className="text-gray-700  print:text-gray-700">invoice no.</span>
                <span className="text-red-600 text-xs font-semibold print:text-red-600">{invoiceData?._id || 'N/A'}</span>
              </div>

              <div className="flex justify-start items-center gap-2 print:gap-5">
                <span className="text-gray-700 print:text-gray-700">invoice date</span>
                <span className="text-red-600 text-xs font-semibold print:text-red-600">
                  {invoiceData?.createdAt ? new Date(invoiceData.createdAt).toLocaleDateString("en-US") : 'N/A'}
                </span>
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

        <section className='flex flex-col sm:flex-row items-end justify-between gap-2 h-auto sm:h-[100px] print:flex-row print:h-[100px]'>
          <section className="bg-gray-200 rounded-sm  flex items-center justify-between w-full sm:w-9/12 px-3 print:w-9/12">
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

          <section className='w-full sm:w-4/12 print:w-4/12 mt-4 sm:mt-0 print:mt-0'>

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
                        <div className="flex-1 border-r-3 border-gray-600 px-6 py-6 flex items-center justify-center print:px-6 print:py-6">
                          <span className="text-md font-bold print:text-md">{invoiceData?.car?.plateNumberForSaudi?.numberArabic || 'N/A'}</span>
                        </div>
                        <div className="flex-1 border-r-3 border-gray-600 px-6 py-6 flex items-center justify-center print:px-6 ">
                          <span className="text-md font-bold print:text-md" style={{ fontFamily: 'Arial' }}>
                            {invoiceData?.car?.plateNumberForSaudi?.alphabetsCombinations?.[1] || 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Row */}
                      <div className="flex print:flex">
                        <div className="flex-1 border-r-3 border-gray-600 px-6 py-6 flex items-center justify-center print:px-6 print:py-6">
                          <span className="text-md font-bold print:text-md">{invoiceData?.car?.plateNumberForSaudi?.numberEnglish || 'N/A'}</span>
                        </div>
                        <div className="flex-1 border-r-3 border-gray-600 px-6 py-6 flex items-center justify-center print:px-6 print:py-6">
                          <span className="text-md font-bold tracking-wide print:text-md">
                            {invoiceData?.car?.plateNumberForSaudi?.alphabetsCombinations?.[0] || 'N/A'}
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 print:flex-row print:gap-8">
          {/* Customer Name - Right Side */}
          <div className="flex items-center gap-4 print:gap-4">
            <span className="text-gray-900 font-semibold print:text-gray-900 text-xs">VAT -{invoiceData?.providerWorkShopId?.taxVatNumber || 'N/A'}</span>
            <span className="text-gray-700 font-medium print:text-gray-700 text-xs">الرقم الضريبي</span>
          </div>

          <div className="flex items-center gap-4 print:gap-4">
            <span className="text-gray-900 font-semibold print:text-gray-900">{invoiceData?.contact || 'N/A'}</span>
            <span className="text-gray-700 font-medium print:text-gray-700">الجوال</span>
          </div>

          <div className="flex items-center gap-4 print:gap-4">
            <span className="text-gray-900 font-semibold print:text-gray-900">costumer name</span>
            <span className="text-gray-700 font-medium print:text-gray-700">{invoiceData?.customerInvoiceName || 'N/A'}</span>
          </div>
        </div>
      </div>
      {/* -------------------------------------------------- */}

      <div className="print:overflow-visible">
        {/* Works Table */}
        <div className="mb-8 print:mb-8">
          <table className="w-full border-collapse print:border-collapse">
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
              {invoiceData?.worksList && invoiceData.worksList.length > 0 ? (
                invoiceData.worksList.map((item: WorkItem, index: number) => (
                  <tr key={index} className="bg-gray-100 print:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-6 text-center print:px-4 print:py-6">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-6 text-center print:px-4 print:py-6">{item.work.code || "N/A"}</td>
                    <td className="border text-xs border-gray-300 text-center px-4 py-6 print:px-4 print:py-6">
                      {item.work.title.ar} <br />
                      {item.work.title.en}
                    </td>
                    <td className="border border-gray-300 text-center px-4 py-6 print:px-4 print:py-6">{item.quantity || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-6 text-center print:px-4 print:py-6">{item.cost || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-6 text-center print:px-4 print:py-6">{item.finalCost || "N/A"}</td>
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
        <div className="mb-8 print:mb-8">
          <table className="w-full border-collapse print:border-collapse">
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
                    <td className="border border-gray-300 text-center px-4 py-6 print:px-4 print:py-6">{index + 1}</td>
                    <td className="border border-gray-300 px-4 text-center py-6 print:px-4 print:py-6">{item.code || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-6 text-center print:px-4 print:py-6">{item.itemName || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-6 text-center print:px-4 print:py-6">{item.quantity || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-6 text-center print:px-4 print:py-6">{item.cost || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-6 text-center print:px-4 print:py-6">{item.finalCost || "N/A"}</td>
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
            <div className="bg-[#CB3640] text-white p-2 flex gap-4 items-center rounded mb-10 print:mb-10 print:gap-4 ">
              <span className="text-2xl font-bold print:text-2xl">
                <Image
                  src={"/icons/Symbol.png"}
                  height={1000}
                  width={1000}
                  className='h-9 w-9 text-black print:h-11 print:w-10'
                  alt="Symbol"
                />
              </span>
              <div className=" flex items-center  gap-6 print:gap-3">
                <div className="text-lg print:text-lg">({invoiceData?.totalCostOfSparePartsExcludingTax || 0})</div>
                <div className="text-sm font-medium print:text-lg w-full">
                  <span className='w-full'> اجمالي مبلغ قطع الغيار</span><br />
                  <span>Total of spare parts</span>

                </div>
              </div>
            </div>
            <div className="bg-gray-100 p-2 font-medium flex gap-4 items-center rounded print:gap-4">
              <span className="text-2xl font-bold print:text-2xl">
                <Image
                  src={"/icons/Symbol_black.png"}
                  height={1000}
                  width={1000}
                  className='h-9 w-9 text-black print:h-11 print:w-10'
                  alt="Symbol"
                />
              </span>
              <div className=" flex items-center gap-6 print:gap-3">
                <div className="text-lg print:text-lg">({invoiceData?.totalCostOfWorkShopExcludingTax || 0})</div>
                <div className="text-sm font-medium print:text-lg w-full">
                  <span>المبلغ الخاضع للضريب</span> <br />
                  <span>Taxable amount </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 p-2 font-medium flex gap-4 items-center rounded print:gap-4">
              <span className="text-2xl font-bold print:text-2xl">
                <Image
                  src={"/icons/Symbol_black.png"}
                  height={1000}
                  width={1000}
                  className='h-9 w-9 text-black print:h-11 print:w-10'
                  alt="Symbol"
                />
              </span>
              <div className=" flex items-center gap-6 print:gap-3">
                <div className="text-lg print:text-lg"> ({invoiceData?.finalDiscountInFlatAmount || 0})</div>
                <div className="text-sm font-medium print:text-lg w-full">
                  <span>الخصم قبل الضريبة</span> <br />
                  <span>Discount</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 p-2 font-medium flex gap-4 items-center rounded print:gap-4">
              <span className="text-2xl font-bold print:text-2xl">
                <Image
                  src={"/icons/Symbol_black.png"}
                  height={1000}
                  width={1000}
                  className='h-9 w-9 text-black print:h-11 print:w-10'
                  alt="Symbol"
                />
              </span>
              <div className=" flex items-center gap-6 print:gap-3">
                <div className="text-lg print:text-lg">({invoiceData?.taxAmount || 0})</div>
                <div className="text-sm font-medium print:text-lg w-full">
                  <span>(VAT%)الضريبة</span><br />
                  <span>VAT amount</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1771B7] text-white p-2 flex gap-4 items-center rounded print:gap-4">
              <span className="text-2xl font-bold print:text-2xl">
                <Image
                  src={"/icons/Symbol.png"}
                  height={1000}
                  width={1000}
                  className='h-9 w-9 text-black print:h-11 print:w-10'
                  alt="Symbol"
                />
              </span>
              <div className=" flex items-center gap-6 print:gap-3">
                <div className="text-lg print:text-lg">({invoiceData?.totalCostIncludingTax || 0})</div>
                <div className="text-sm font-medium print:text-lg w-full">
                  <span>الإجمالي شامل الضريبة</span><br />
                  <span>Total including tax</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ */}

      <section className="relative w-full h-20 overflow-hidden print:h-24">
        {/* RIGHT FULL WIDTH SECTION */}
        <div className="absolute inset-0 w-full print:w-full">
          {/* Logos */}
          <div className="flex items-center justify-between px-10 h-1/2 opacity-40 gap-2 pl-[29%] py-2 print:pl-[29%] print:py-2">
            {images.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`Footer image ${index + 1}`}
                width={1000}
                height={1000}
                className="w-14 h-7 object-contain print:w-14 print:h-12"
              />
            ))}
          </div>

          {/* Red Bar */}
          <div className="bg-[#CB3640] flex items-center justify-between px-10 h-1/2 pl-[32%] print:pl-[32%]">
            <h1 className="text-base font-medium text-white print:text-base">
              {invoiceData?.client?.clientId?.contact || 'N/A'}
            </h1>

            <Image
              src="/icons/footerCommunications.png"
              alt="Footer communications"
              width={1000}
              height={1000}
              className="h-6 w-auto print:h-7"
            />

            <h1 className="text-base font-medium text-white print:text-base">
              {data?.data?.providerWorkShopId?.address || "Riyadh - old Industrial - ali st."}
            </h1>
          </div>
        </div>

        {/* LEFT BLUE FIXED SECTION */}
        <div
          className="relative z-10 w-[34%] h-full bg-[#1771B7] flex flex-col justify-center text-start pl-2 text-sm font-medium text-white print:w-[34%] print:pl-5 print:text-sm"
          style={{
            clipPath: "polygon(0 0, 70% 0, 95% 100%, 0 100%)",
          }}
        >
          <h1>Thank you for your visit and</h1>
          <h1>we are always at your service</h1>
        </div>
      </section>
    </div>
  );
};

export default Page;