
export default function ArabicInvoice() {
  return (
    <div className="bg-gray-300 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="text-center pt-8 px-6 pb-4">
            <div className="text-gray-400 text-sm mb-2">••• •• ••</div>
            <h1 className="text-xl font-bold text-gray-800 mb-1">
              تطبيق الصناعية .. مسجل لدى
            </h1>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              مؤسسة مرافئ التجارية
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              الرياض - العليا - طريق مكة المكرمة
            </p>
            <p className="text-sm text-gray-700 mb-1">CR: 1010347328</p>
            <p className="text-sm text-gray-700 mb-4">VAT: 300787972600003</p>

            {/* Invoice Number and Date */}
            <div className="flex items-center justify-center gap-3 text-sm mb-2">
              <span className="text-gray-600">13-01-2026 09:17 AM</span>
              <span className="text-blue-500 font-bold text-lg">abf7bb</span>
              <span className="text-gray-600">رقم الفاتورة</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mx-6"></div>

          {/* Company Info Section */}
          <div className="px-6 py-4">
            <div className="text-center mb-3">
              <h3 className="text-lg font-bold text-gray-800">(مؤسسة فهد التجارية)</h3>
            </div>
            <div className="flex justify-between text-sm text-gray-700">
              <span className="font-medium">VAT: 300787972600003</span>
              <span className="font-medium" dir="ltr">+966503343000</span>
            </div>
          </div>

          {/* Details Section */}
          <div className="px-4 pb-4 space-y-2">
            {/* Subscription Details */}
            <div className="border-2 border-gray-300 rounded-xl overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="p-3 text-center bg-gray-50">
                  <p className="text-sm text-gray-700 mb-1">الاشتراك في تطبيق الصناعية</p>
                  <p className="text-blue-500 font-bold">12 months +6 months free</p>
                </div>
                <div className="p-3 text-center border-r-2 border-gray-300">
                  <p className="text-base font-bold text-gray-800">تفاصيل الفاتورة</p>
                </div>
              </div>
            </div>

            {/* Pre-tax Amount */}
            <div className="border-2 border-gray-300 rounded-xl overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="p-3 text-center bg-gray-50 border-r-4 border-gray-300">
                  <p className="text-2xl font-bold text-gray-800">
                    <span className="text-xl">﷼</span> 417.39
                  </p>
                </div>
                <div className="p-3 text-center border-r-2 border-gray-300">
                  <p className="text-base text-gray-700">المبلغ قبل الضريبة</p>
                </div>
              </div>
            </div>

            {/* Discount Amount */}
            <div className="border-2 border-gray-300 rounded-xl overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="p-3 text-center bg-gray-50">
                  <p className="text-2xl font-bold text-red-500">
                    <span className="text-xl">﷼</span> 120.00
                  </p>
                </div>
                <div className="p-3 text-center border-r-2 border-gray-300">
                  <p className="text-base text-gray-700">مبلغ الخصم</p>
                </div>
              </div>
            </div>

            {/* Tax Amount */}
            <div className="border-2 border-gray-300 rounded-xl overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="p-3 text-center bg-gray-50">
                  <p className="text-sm text-gray-600 mb-1">(TAX 15%)</p>
                  <p className="text-2xl font-bold text-gray-800">
                    <span className="text-xl">﷼</span> 62.61
                  </p>
                </div>
                <div className="p-3 text-center border-r-2 border-gray-300">
                  <p className="text-base text-gray-700">ضريبة القيمة المضافة</p>
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="border-4 border-blue-500 rounded-xl overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="p-4 text-center bg-blue-50">
                  <p className="text-3xl font-bold text-blue-600">
                    <span className="text-2xl">﷼</span> 480.00
                  </p>
                </div>
                <div className="p-4 text-center border-r-4 border-blue-500">
                  <p className="text-base font-bold text-gray-800">المجموع شامل</p>
                  <p className="text-base font-bold text-gray-800">الضريبة</p>
                </div>
              </div>
            </div>
          </div>

          {/* Expiry Notice */}
          <div className="px-6 pb-4">
            <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-3 text-center">
              <p className="text-gray-700">
                <span className="text-red-500 font-bold">15-07-2027</span>
                <span className="text-pink-600 mx-2">ينتهي اشتراك التطبيق بتاريخ</span>
              </p>
            </div>
          </div>

          {/* QR Code */}
          <div className="px-6 pb-8 flex justify-center">
            <div className="w-48 h-48 bg-white border-4 border-gray-200 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full p-2">
                {/* QR Code pattern simulation */}
                <rect width="200" height="200" fill="white" />
                {[...Array(20)].map((_, i) =>
                  [...Array(20)].map((_, j) => {
                    const shouldFill = Math.random() > 0.5;
                    return shouldFill ? (
                      <rect
                        key={`${i}-${j}`}
                        x={j * 10}
                        y={i * 10}
                        width="10"
                        height="10"
                        fill="black"
                      />
                    ) : null;
                  })
                )}
                {/* QR corner markers */}
                <rect x="0" y="0" width="30" height="30" fill="black" />
                <rect x="5" y="5" width="20" height="20" fill="white" />
                <rect x="10" y="10" width="10" height="10" fill="black" />

                <rect x="170" y="0" width="30" height="30" fill="black" />
                <rect x="175" y="5" width="20" height="20" fill="white" />
                <rect x="180" y="10" width="10" height="10" fill="black" />

                <rect x="0" y="170" width="30" height="30" fill="black" />
                <rect x="5" y="175" width="20" height="20" fill="white" />
                <rect x="10" y="180" width="10" height="10" fill="black" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Elements */}
        <div className="flex justify-between items-end mt-4 px-8">
          <div className="w-16 h-16 rounded-full bg-purple-500 opacity-80 blur-sm"></div>
          <div className="w-16 h-16 rounded-full bg-purple-500 opacity-80 blur-sm"></div>
        </div>
      </div>
    </div>
  );
}