import React, { useEffect, useState } from "react";

const categories = ["Music", "Podcasts", "Arts", "Videos", "Courses", "Ebook"];
// Per latest design, show status-like labels under Language section
const languages = ["Not Started", "In progress", "Completed"];
const orderedTime = ["Last 3 days", "Last week", "Last month", "2025", "2024", "2023"];
const durations = ["< 30 min", "30 - 120 min", "> 2 hrs"];

interface FilterSidebarProps {
  // When used under fixed headers, set the mobile top offset (in px) so the sheet starts below headers
  mobileTopOffset?: number;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ mobileTopOffset = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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
          className="fixed left-0 right-0 bottom-0 md:hidden"
          style={
            isMobile
              ? { top: mobileTopOffset, height: `calc(100vh - ${mobileTopOffset}px)`, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 20 }
              : undefined
          }
        ></div>
      )}

      {/* 🧭 Sidebar */}
      <aside
        className={`
          fixed md:sticky left-0 md:left-0 z-30 md:z-auto 
          h-full md:h-[1031px]
          w-[80%] sm:w-[300px] md:w-[267px]
          box-border
          bg-white border border-[#CBD5E1] rounded-none md:rounded-[16px]
          shadow-lg md:shadow-sm
          p-5 md:pt-[18px] md:pr-[15px] md:pb-[12px] md:pl-[11px]
          overflow-y-auto md:overflow-visible
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          md:top-0
        `}
        style={
          isMobile
            ? { top: mobileTopOffset, height: `calc(100vh - ${mobileTopOffset}px)` }
            : undefined
        }
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

        {/* Content wrapper sized to design (inner) including header */}
        <div className="mx-auto w-[211px] h-[1001px] space-y-[2px]">
          {/* 🏷️ Filters Title */}
          <div>
            <h3 className="text-lg font-bold mb-2">Filters</h3>
            <div className="border-t border-gray-200"></div>
          </div>
          {/* 📂 Category */}
          <FilterGroup title="Category" items={categories} heightPx={220} />
          <div className="border-t border-gray-200 mb-[10px]" />

          {/* 🌍 Language */}
          <FilterGroup title="Language" items={languages} heightPx={145} />
          <div className="border-t border-gray-200 mb-[10px]" />

          {/* 🗓️ Ordered Time */}
          <FilterGroup title="Ordered Time" items={orderedTime} heightPx={225} />
          <div className="border-t border-gray-200 mb-[10px]" />

          {/* ⏱️ Duration */}
          <FilterGroup title="Duration" items={durations} heightPx={150} />
          <div className="border-t border-gray-200 mb-[10px]" />

          {/* 🧑‍🎨 Creator Search */}
          <div className="w-[211px] h-[90px]">
            <h3 className="text-[16px] font-semibold mb-2">Creators / Publisher</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full h-[40px] pl-3 pr-8 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"></span>
            </div>
          </div>
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
  heightPx,
}: {
  title: string;
  items: string[];
  heightPx?: number;
}) => (
  <div style={heightPx ? { height: `${heightPx}px` } : undefined}>
    <h3 className="text-[16px] font-semibold mb-[6px] mt-[10px]">{title}</h3>
    <div className="flex flex-col gap-[7px]">
      {items.map((item) => (
        <label
          key={item}
          className="flex items-center gap-[10px] text-[14px] font-medium leading-[150%] tracking-[-0.019em] text-gray-700 cursor-pointer"
        >
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-[#7077FE] focus:ring-2 focus:ring-[#7077FE]"
          />
          <span style={{ fontFamily: 'poppins' }}>{item}</span>
        </label>
      ))}
    </div>
  </div>
);
