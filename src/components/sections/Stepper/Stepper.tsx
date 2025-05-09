
export default function FlowUI() {
  return (
    <div className="flex flex-col items-center space-y-8 p-8 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <ol className="flex items-center w-full text-xs text-gray-900 font-medium sm:text-base">
        <li className="flex w-full relative text-indigo-600">
          <div className="block whitespace-nowrap z-10">
            <span className="w-6 h-6 bg-indigo-600 border-2 border-transparent rounded-full flex justify-center items-center mx-auto mb-3 text-sm text-white lg:w-10 lg:h-10">
              1
            </span>
            Step 1
          </div>
          {/* Horizontal line with vertical break */}
          <div className="absolute top-1/2 w-full h-0.5 bg-indigo-600 ">
            <div className="absolute left-0 top-0  h-full bg-indigo-600"></div>
            <div className="absolute left-1/2 top-0 h-8 -translate-y-full w-0.5 bg-indigo-600"></div>
            <div className="absolute left-1/2 top-8 w-1/2 h-full bg-indigo-600"></div>
          </div>
        </li>
        
        <li className="flex w-full relative text-gray-900">
          <div className="block whitespace-nowrap z-10">
            <span className="w-6 h-6 bg-indigo-50 border-2 border-indigo-600 rounded-full flex justify-center items-center mx-auto mb-3 text-sm text-indigo-600 lg:w-10 lg:h-10">
              2
            </span>
            Step 2
          </div>
        </li>
      </ol>
    </div>
  );
}