const SellProducts = () => {
  return (
    <>
      <div className="w-full min-h-[70vh] flex items-center justify-center px-4">
  <div className="bg-white max-w-2xl w-full shadow-lg rounded-xl p-8 text-center">
    <div className="py-8">
      <svg
        className="w-20 h-20 text-purple-500 mx-auto mb-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
      <h2 className="text-2xl font-semibold text-gray-800 mb-3">
Product Selling Coming Soon
      </h2>
      <p className="text-gray-600 text-sm sm:text-base">
        We're working hard to bring this feature to you. Please check back soon!
      </p>
    </div>
  </div>
</div>
    </>
  )
}

export default SellProducts
