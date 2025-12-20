import PriceRangeSlider from "../components/Ui/DualRangeSlider";


const categories = [
  { name: 'Music', checked: false },
  { name: 'Video', checked: false },
  { name: 'Arts & Wallpapers', checked: false },
  { name: 'Podcast', checked: false },
  { name: 'E-Books', checked: false },
  { name: 'Courses', checked: false },
];

export default function FilterSidebar() {
  return (
    <div
      className="
        w-full
        max-w-[300px]
        bg-gray-50
        rounded-2xl
        border border-gray-200
        p-6
        space-y-6
        h-fit
        lg:sticky lg:top-24
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-gray-700" fill="white" stroke="#7077FE" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>

        <button className="px-3 py-1 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
          Reset All
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h4 className="font-bold text-gray-900">Categories</h4>

        <div className="space-y-3">
          {categories.map((category) => (
            <label
              key={category.name}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={category.checked}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-900">
                {category.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      
      {/* Price Range Slider */}
         <div className="space-y-4">
  <h4 className="font-bold text-gray-900">Price</h4>

  <PriceRangeSlider
    min={0}
    max={2400}
    onChange={(min, max) => {
      console.log("Selected price range:", min, max);
    }}
  />
</div>

      {/* Ratings */}
     <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-gray-900">Ratings</h4>
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Sellers */}
     <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-gray-900">Sellers</h4>
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
}
