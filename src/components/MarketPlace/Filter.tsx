import React, { useState } from "react";

const categories = ["Music", "Podcasts", "Arts", "Videos", "Courses", "Ebook"];
const languages = ["English", "Spanish", "French"];
const durations = ["< 30 min", "30 - 120 min", "> 2 hrs"];
const ratings = ["4+ Stars", "3+ Stars", "2+ Stars"];

const FilterSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 📱 Mobile Filter Button */}
      <div className="md:hidden flex justify-end mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-[#7077FE] text-white rounded-lg text-sm font-semibold shadow hover:bg-[#5a5fe0] transition"
        >
          Show Filters ⚙️
        </button>
      </div>

      {/* 🩶 Overlay for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        ></div>
      )}

      {/* 🧭 Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50 
          h-full md:h-auto
          w-[80%] sm:w-[300px] md:w-[250px]
          bg-white border border-gray-200 rounded-none md:rounded-xl
          shadow-lg md:shadow-sm
          p-5 md:p-6
          overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* ❌ Close Button (Mobile Only) */}
        <div className="md:hidden flex justify-end mb-3">
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-black text-lg"
          >
            ✖
          </button>
        </div>

        {/* 🏷️ Filters Title */}
        <div>
          <h3 className="text-lg font-bold mb-4">Filters</h3>
          <div className="border-t border-gray-200 mb-5"></div>
        </div>

        {/* 📂 Category */}
        <FilterGroup title="Category" items={categories} />

        {/* 💲 Price */}
        <div className="space-y-2 mb-8">
          <h3 className="text-[16px] font-semibold">Price</h3>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="$0"
              className="w-[90px] px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              placeholder="$50"
              className="w-[90px] px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
            />
          </div>
        </div>

        {/* 🌍 Language */}
        <FilterGroup title="Language" items={languages} />

        {/* ⏱️ Duration */}
        <FilterGroup title="Duration" items={durations} />

        {/* ⭐ Ratings */}
        <FilterGroup title="Ratings" items={ratings} />

        {/* 🧑‍🎨 Creator Search */}
        <div className="mt-8">
          <h3 className="text-[16px] font-semibold mb-3">
            Creators / Publisher
          </h3>
          <input
            type="text"
            placeholder="Search"
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
          />
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;

/* 💡 Reusable Filter Group Component */
const FilterGroup = ({
  title,
  items,
}: {
  title: string;
  items: string[];
}) => (
  <div className="space-y-2 mb-8">
    <h3 className="text-[16px] font-semibold">{title}</h3>
    {items.map((item) => (
      <label
        key={item}
        className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer"
      >
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-gray-300 text-[#7077FE] focus:ring-2 focus:ring-[#7077FE]"
        />
        <span>{item}</span>
      </label>
    ))}
  </div>
);
