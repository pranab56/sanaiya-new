import Image from 'next/image';

export default function ServiceReport() {
  const reportData = {
    businessName: "مركز محمد لصيانة السيارات",
    businessSubtitle: "مؤسسة محمد علي التجارية",
    vat: "3xxxxxxxxxxxxxx3",
    cr: "1010347328",
    dateRange: "From 10-09-2025 to 17-09-2025 Duration: 7 days",
    savedInvoices: 5,
    postpaidInvoices: 8,
    completedInvoices: 13,
    totalIncomeCollected: 5642.75,
    totalPostpaidSaved: 1268.43,
    totalExpenses: 372.16,
    collectedBalance: 5270.59,
    recordedBalance: 6539.02,
    carsServiced: 26
  };


  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 bg-gray-50 print:py-0 print:px-0 print:bg-white">
      <div className="w-full max-w-[210mm] mx-auto bg-white rounded-lg shadow-lg overflow-hidden print:max-w-[210mm] print:mx-0 print:shadow-none print:rounded-none">
        {/* Header */}
        <div className="bg-[#1771B7] text-white text-center py-8 px-4 print:py-8 print:px-4">
          <h1 className="text-2xl font-bold mb-2 print:text-2xl">
            {reportData.businessName}
          </h1>
          <p className="text-sm opacity-90 print:text-sm" >
            {reportData.businessSubtitle}
          </p>
        </div>

        {/* VAT and CR Bar */}
        <div className="bg-[#CB3640] text-white flex justify-between items-center px-6 py-2 text-sm print:px-6 print:py-2 print:text-sm">
          <div>VAT - {reportData.vat}</div>
          <div>CR - {reportData.cr}</div>
        </div>

        {/* App Title */}
        <div className="text-center py-6 print:py-6">
          <h2 className="text-2xl font-bold text-[#1771B7] print:text-2xl">
            Report issued by Senaeya App
          </h2>
        </div>

        {/* Date Range */}
        <div className="mx-6 mb-6 print:mx-6 print:mb-6">
          <div className="bg-gray-200 text-center py-4 px-4 rounded-lg print:py-4 print:px-4 print:rounded-lg">
            <p className="text-2xl font-bold text-gray-800 print:text-2xl">
              {reportData.dateRange}
            </p>
          </div>
        </div>

        {/* Invoice Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mx-6 mb-6 print:grid-cols-3 print:mx-6 print:mb-6">
          <div className="text-center bg-gray-50 py-6 px-4 rounded-lg print:py-6 print:px-4 print:rounded-lg">
            <p className="text-sm text-[#CB3640] font-semibold mb-2 print:text-sm">
              Number of<br />saved invoices
            </p>
            <p className="text-4xl font-bold text-[#CB3640] print:text-4xl">
              {reportData.savedInvoices}
            </p>
          </div>
          <div className="text-center bg-gray-50 py-6 px-4 rounded-lg print:py-6 print:px-4 print:rounded-lg">
            <p className="text-sm text-orange-500 font-semibold mb-2 print:text-sm">
              Number of<br />Postpaid invoices
            </p>
            <p className="text-4xl font-bold text-orange-500 print:text-4xl">
              {reportData.postpaidInvoices}
            </p>
          </div>
          <div className="text-center bg-gray-50 py-6 px-4 rounded-lg print:py-6 print:px-4 print:rounded-lg">
            <p className="text-sm text-green-600 font-semibold mb-2 print:text-sm">
              Number of<br />completed invoices
            </p>
            <p className="text-4xl font-bold text-green-600 print:text-4xl">
              {reportData.completedInvoices}
            </p>
          </div>
        </div>

        {/* Financial Boxes */}
        <div className="mx-6 mb-6 space-y-4 print:mx-6 print:mb-6 print:space-y-4">
          {/* Total Income */}
          <div className="bg-[#1771B7] text-white rounded-lg py-6 px-6 flex flex-col sm:flex-row justify-between items-center print:flex-row print:py-6 print:px-6 print:rounded-lg">
            <div className="flex items-center gap-3 mb-4 sm:mb-0 print:mb-0">
              <span className="text-3xl font-bold print:text-3xl">ر.س</span>
              <span className="text-3xl font-bold print:text-3xl">{reportData.totalIncomeCollected}</span>
            </div>
            <div className="text-xl font-semibold text-center sm:text-right print:text-xl">Total income collected</div>
          </div>

          {/* Total Postpaid */}
          <div className="bg-[#CB3640] text-white rounded-lg py-6 px-6 flex flex-col sm:flex-row justify-between items-center print:flex-row print:py-6 print:px-6 print:rounded-lg">
            <div className="flex items-center gap-3 mb-4 sm:mb-0 print:mb-0">
              <span className="text-3xl font-bold print:text-3xl">ر.س</span>
              <span className="text-3xl font-bold print:text-3xl">{reportData.totalPostpaidSaved}</span>
            </div>
            <div className="text-xl font-semibold text-center sm:text-right print:text-xl">Total postpaid and saved income</div>
          </div>

          {/* Total Expenses */}
          <div className="bg-[#959595] text-white rounded-lg py-6 px-6 flex flex-col sm:flex-row justify-between items-center print:flex-row print:py-6 print:px-6 print:rounded-lg">
            <div className="flex items-center gap-3 mb-4 sm:mb-0 print:mb-0">
              <span className="text-3xl font-bold print:text-3xl">ر.س</span>
              <span className="text-3xl font-bold print:text-3xl">{reportData.totalExpenses}</span>
            </div>
            <div className="text-xl font-semibold text-center sm:text-right print:text-xl">Total expenses paid</div>
          </div>
        </div>

        {/* Balance Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mx-6 mb-6 print:grid-cols-2 print:mx-6 print:mb-6">
          {/* Collected Balance */}
          <div className="bg-[#F4F5F7] rounded-lg p-6 text-center print:p-6 print:rounded-lg">
            <h3 className="text-lg font-bold text-[#1771B7] mb-3 print:text-lg">
              Collected financial balance
            </h3>
            <p className="text-sm font-bold text-gray-600 print:text-sm">All income collected</p>
            <p className="text-sm font-bold text-gray-600 print:text-sm">-</p>
            <p className="text-sm font-bold text-gray-600 mb-4 print:text-sm">All expenses paid</p>
            <div className="flex items-center justify-center gap-2 print:gap-2">
              <span className="text-2xl font-bold text-[#1771B7] print:text-2xl">
                <Image
                  src={"/icons/green_symbol.png"}
                  height={1000}
                  width={1000}
                  className='w-10 h-10 print:w-10 print:h-10'
                  alt=''
                />
              </span>
              <span className="text-2xl font-bold text-[#1771B7] print:text-2xl">
                {reportData.collectedBalance}
              </span>
            </div>
          </div>

          {/* Recorded Balance */}
          <div className="bg-[#F4F5F7] rounded-lg p-6 text-center print:p-6 print:rounded-lg">
            <h3 className="text-lg font-bold text-red-600 mb-3 print:text-lg">
              Recorded financial balance
            </h3>
            <p className="text-sm font-bold text-gray-600 print:text-sm">All income recorded</p>
            <p className="text-sm font-bold text-gray-600 print:text-sm">-</p>
            <p className="text-sm font-bold text-gray-600 mb-4 print:text-sm">All expenses paid</p>
            <div className="flex items-center justify-center gap-2 print:gap-2">
              <span className="text-2xl font-bold text-red-600 print:text-2xl">
                <Image
                  src={"/icons/red_symbol.png"}
                  height={1000}
                  width={1000}
                  className='w-10 h-10 print:w-10 print:h-10'
                  alt=''
                />
              </span>
              <span className="text-2xl font-bold text-red-600 print:text-2xl">
                {reportData.recordedBalance}
              </span>
            </div>
          </div>
        </div>

        {/* Cars Serviced */}
        <div className="mx-6 mb-8 print:mx-6 print:mb-8">
          <div className="bg-gray-200 rounded-lg py-4 px-6 flex flex-col sm:flex-row justify-between items-center print:flex-row print:py-4 print:px-6 print:rounded-lg">
            <div className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0 print:mb-0 print:text-2xl">
              Cars <span className="ml-4 print:ml-4">{reportData.carsServiced}</span>
            </div>
            <div className="text-xl font-bold text-gray-800 text-center sm:text-right print:text-xl">
              Number of cars serviced
            </div>
          </div>

          {/* Footer Section */}
          <section className="relative w-full h-20 sm:h-20 overflow-hidden print:h-24 mt-3 print:mt-3">
            {/* RIGHT FULL WIDTH SECTION */}
            <div className="absolute inset-0 w-full print:w-full">
              {/* Logos */}
              <div className="flex items-center justify-between px-4 sm:px-10 h-1/2 opacity-40 gap-2 pl-[25%] sm:pl-[29%] py-2 print:pl-[29%] print:py-2">
                {/* Empty logos container - keeping structure */}
              </div>

              {/* Red Bar */}
              <div className="bg-[#CB3640] flex items-center justify-between px-4 sm:px-10 h-1/2 pl-[35%] sm:pl-[40%] print:pl-[40%]">
                <h1 className="text-xs sm:text-base font-medium text-white print:text-base">
                  966-5xxxxxxxx
                </h1>

                <Image
                  src="/icons/footerCommunications.png"
                  alt=""
                  width={1000}
                  height={1000}
                  className="h-5 sm:h-6 w-auto print:h-6"
                />

                <h1 className="text-xs sm:text-base font-medium text-white print:text-base">
                  Riyadh - old Industrial - ali st.
                </h1>
              </div>
            </div>

            {/* LEFT BLUE FIXED SECTION */}
            <div
              className="relative z-10 w-[45%] sm:w-[40%] h-full bg-[#1771B7] flex flex-col justify-center text-start pl-3 sm:pl-4 text-xs font-medium text-white print:w-[40%] print:pl-4 print:text-xs"
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
    </div>
  );
}