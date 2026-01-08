"use client";

import { useGetInvoiceQuery } from "@/utils/baseApi";
import Image from 'next/image';

const page = () => {
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

  const { data } = useGetInvoiceQuery({});
  console.log("invoice data", data)

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
          />
        </div>
        <div className="shrink-0">
          <Image
            src={"/icons/logoTwo.png"}
            height={1000}
            width={1000}
            className='w-24 h-24 print:w-24 print:h-24'
            alt='Logo One'
          />
        </div>
        <div className="flex-1 text-right print:text-right" dir="rtl">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 print:text-2xl">
            مركز محمد لصيانة السيارات
          </h1>
          <p className="text-base mb-1 print:text-base">
            مؤسسة محمد للصيانة التجارية
          </p>
          <p className="text-xs font-normal mb-3 print:text-xs">
            سجل تجاري رقم : CR No
          </p>
          <p className="text-xs font-normal mb-3 print:text-xs">
            سجل تجاري رقم : VAT No
          </p>
          <p className="text-xs font-normal mb-3 print:text-xs">
            سجل تجاري رقم : iBan No
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
              <div className="flex justify-start items-center gap-5 print:gap-5">
                <span className="text-gray-700 print:text-gray-700">invoice no.</span>
                <span className="text-red-600 font-semibold print:text-red-600">رقم الفاتورة</span>
              </div>

              <div className="flex justify-start items-center gap-5 print:gap-5">
                <span className="text-gray-700 print:text-gray-700">invoice date</span>
                <span className="text-red-600 font-semibold print:text-red-600">تاريخ الفاتورة</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Type */}
        <div className="text-center mb-8 print:mb-8">
          <span className="text-2xl font-bold text-red-600 print:text-2xl">Cash / Postpaid</span>
        </div>

        {/* Vehicle Information Bar */}

        <section className='flex flex-col sm:flex-row items-end justify-between gap-2 h-auto sm:h-[100px] print:flex-row print:h-[100px]'>
          <section className="bg-gray-200 rounded-sm  flex items-center justify-between w-full sm:w-9/12 px-3 print:w-9/12">
            <div className="flex items-center gap-6 print:gap-6">
              {/* Toyota Logo */}
              <div className="bg-white rounded-full p-4 print:p-4">
                <svg className="w-16 h-16 print:w-16 print:h-16" viewBox="0 0 192 192" fill="none">
                  <ellipse cx="96" cy="96" rx="90" ry="90" fill="white" />
                  <path d="M96 20C51.82 20 16 55.82 16 100s35.82 80 80 80 80-35.82 80-80-35.82-80-80-80zm0 144c-35.35 0-64-28.65-64-64s28.65-64 64-64 64 28.65 64 64-28.65 64-64 64z" fill="#C0C0C0" />
                  <path d="M96 50c-8.284 0-15 6.716-15 15v62c0 8.284 6.716 15 15 15s15-6.716 15-15V65c0-8.284-6.716-15-15-15z" fill="#C0C0C0" />
                  <path d="M141 85c-6.075-4.413-14.563-3.038-18.976 3.037L96 122.963 69.976 88.037C65.563 81.962 57.075 80.587 51 85c-6.075 4.413-7.45 12.901-3.037 18.976l32 44c5.25 7.219 18.824 7.219 24.074 0l32-44c4.413-6.075 3.038-14.563-3.037-18.976z" fill="#C0C0C0" />
                </svg>
              </div>

              <div className="text-xl font-bold print:text-xl">TOYOTA</div>
            </div>

            <div className="text-xl font-bold print:text-xl">PRADO</div>

            <div className="text-xl font-bold print:text-xl">2020</div>
          </section>

          <section className='w-full sm:w-4/12 print:w-4/12 mt-4 sm:mt-0 print:mt-0'>

            <div className="">
              <div className="flex flex-col gap-2 print:gap-2">
                {/* Top Section - KW Number */}
                <div className="border-2 border-gray-500 rounded-sm bg-white px-1 py-2 print:py-2">
                  <div className="text-md text-center font-black tracking-wider print:text-md">
                    KW-695048
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
                          <span className="text-md font-bold print:text-md">6430</span>
                        </div>
                        <div className="flex-1 border-r-3 border-gray-600 px-6 py-6 flex items-center justify-center print:px-6 print:py-6">
                          <span className="text-md font-bold print:text-md" style={{ fontFamily: 'Arial' }}>د ق ط</span>
                        </div>
                      </div>

                      {/* Bottom Row */}
                      <div className="flex print:flex">
                        <div className="flex-1 border-r-3 border-gray-600 px-6 py-6 flex items-center justify-center print:px-6 print:py-6">
                          <span className="text-md font-bold print:text-md">6430</span>
                        </div>
                        <div className="flex-1 border-r-3 border-gray-600 px-6 py-6 flex items-center justify-center print:px-6 print:py-6">
                          <span className="text-md font-bold tracking-wide print:text-md">TGD</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Saudi Emblem */}
                    <div className=" bg-white flex flex-col items-center justify-center   print:flex-col">
                      {/* Saudi Emblem - Palm tree and crossed swords */}
                      <div className="text-md print:text-md">🌴</div>
                      <div className="text-xs font-bold text-center leading-tight print:text-xs">
                        <div>السعودية</div>
                      </div>
                      <div className="flex flex-col gap-0.5 text-md font-bold print:text-md">
                        <div>K</div>
                        <div>S</div>
                        <div>A</div>
                      </div>
                      <div className="w-4 h-4 bg-black rounded-full print:w-4 print:h-4"></div>
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
            <span className="text-gray-900 font-semibold print:text-gray-900">VAT -3xxxxxxxxxxxxx3</span>
            <span className="text-gray-700 font-medium print:text-gray-700">الرقم الضريبي</span>
          </div>

          <div className="flex items-center gap-4 print:gap-4">
            <span className="text-gray-900 font-semibold print:text-gray-900">966-5xxxxxxxx</span>
            <span className="text-gray-700 font-medium print:text-gray-700">الجوال</span>
          </div>

          <div className="flex items-center gap-4 print:gap-4">
            <span className="text-gray-900 font-semibold print:text-gray-900">costumer name</span>
            <span className="text-gray-700 font-medium print:text-gray-700">العميل</span>
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
              {[...Array(4)].map((_, index) => (
                <tr key={index} className="bg-gray-100 print:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-6 print:px-4 print:py-6"></td>
                  <td className="border border-gray-300 px-4 py-6 print:px-4 print:py-6"></td>
                  <td className="border border-gray-300 px-4 py-6 print:px-4 print:py-6"></td>
                  <td className="border border-gray-300 px-4 py-6 print:px-4 print:py-6"></td>
                  <td className="border border-gray-300 px-4 py-6 print:px-4 print:py-6"></td>
                  <td className="border border-gray-300 px-4 py-6 print:px-4 print:py-6"></td>
                </tr>
              ))}
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
              {[...Array(2)].map((_, index) => (
                <tr key={index} className="bg-gray-100 print:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-6 print:px-4 print:py-6"></td>
                  <td className="border border-gray-300 px-4 py-6 print:px-4 print:py-6"></td>
                  <td className="border border-gray-300 px-4 py-6 print:px-4 print:py-6"></td>
                  <td className="border border-gray-300 px-4 py-6 print:px-4 print:py-6"></td>
                  <td className="border border-gray-300 px-4 py-6 print:px-4 print:py-6"></td>
                  <td className="border border-gray-300 px-4 py-6 print:px-4 print:py-6"></td>
                </tr>
              ))}
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
            <div className="bg-[#CB3640] text-white p-2 flex gap-4 items-center rounded mb-10 print:mb-10 print:gap-4">
              <span className="text-2xl font-bold print:text-2xl">
                <Image
                  src={"/icons/Symbol.png"}
                  height={1000}
                  width={1000}
                  className='h-9 w-9 text-black print:h-11 print:w-10'
                  alt=""
                />
              </span>
              <div className=" flex items-center gap-3 print:gap-3">
                <div className="text-base print:text-lg">(Total of spare parts)</div>
                <div className="text-base font-bold print:text-lg">اجمالي مبلغ قطع الغيار</div>
              </div>
            </div>
            <div className="bg-gray-100 p-2 font-medium flex gap-4 items-center rounded print:gap-4">
              <span className="text-2xl font-bold print:text-2xl">
                <Image
                  src={"/icons/Symbol_black.png"}
                  height={1000}
                  width={1000}
                  className='h-9 w-9 text-black print:h-11 print:w-10'
                  alt=""
                />
              </span>
              <div className=" flex items-center gap-3 print:gap-3">
                <div className="text-base print:text-lg">(Taxable amount)</div>
                <div className="text-base font-bold print:text-lg">المبلغ الخاضع للضريبة</div>
              </div>
            </div>

            <div className="bg-gray-100 p-2 font-medium flex gap-4 items-center rounded print:gap-4">
              <span className="text-2xl font-bold print:text-2xl">
                <Image
                  src={"/icons/Symbol_black.png"}
                  height={1000}
                  width={1000}
                  className='h-9 w-9 text-black print:h-11 print:w-10'
                  alt=""
                />
              </span>
              <div className=" flex items-center gap-3 print:gap-3">
                <div className="text-base print:text-lg">(Discount)</div>
                <div className="text-base font-bold print:text-lg">الخصم قبل الضريبة</div>
              </div>
            </div>

            <div className="bg-gray-100 p-2 font-medium flex gap-4 items-center rounded print:gap-4">
              <span className="text-2xl font-bold print:text-2xl">
                <Image
                  src={"/icons/Symbol_black.png"}
                  height={1000}
                  width={1000}
                  className='h-9 w-9 text-black print:h-11 print:w-10'
                  alt=""
                />
              </span>
              <div className=" flex items-center gap-3 print:gap-3">
                <div className="text-base print:text-lg">(VAT amount)</div>
                <div className="text-base font-bold print:text-lg">(VAT 15%)الضريبة</div>
              </div>
            </div>


            <div className="bg-[#1771B7] text-white p-2 flex gap-4 items-center rounded print:gap-4">
              <span className="text-2xl font-bold print:text-2xl">
                <Image
                  src={"/icons/Symbol.png"}
                  height={1000}
                  width={1000}
                  className='h-9 w-9 text-black print:h-11 print:w-10'
                  alt=""
                />
              </span>
              <div className=" flex items-center gap-3 print:gap-3">
                <div className="text-base print:text-lg">(Total including tax)</div>
                <div className="text-base font-bold print:text-lg">الإجمالي شامل الضريبة</div>
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
                alt=""
                width={1000}
                height={1000}
                className="w-14 h-7 object-contain print:w-14 print:h-12"
              />
            ))}
          </div>

          {/* Red Bar */}
          <div className="bg-[#CB3640] flex items-center justify-between px-10 h-1/2 pl-[32%] print:pl-[32%]">
            <h1 className="text-base font-medium text-white print:text-base">
              966-5xxxxxxxx
            </h1>

            <Image
              src="/icons/footerCommunications.png"
              alt=""
              width={1000}
              height={1000}
              className="h-6 w-auto print:h-7"
            />

            <h1 className="text-base font-medium text-white print:text-base">
              Riyadh - old Industrial - ali st.
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

export default page;