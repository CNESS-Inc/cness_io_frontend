import { useState } from "react";
import bg from "../../assets/blush faq.png";
import { FaAngleDown } from "react-icons/fa";
import type { FAQCategory, FaqItem } from "./faqData";

interface FAQContentProps {
  categories: FAQCategory[];
}

function splitIntoColumns<T>(array: T[], numCols: number): T[][] {
  const cols: T[][] = Array.from({ length: numCols }, () => []);
  array.forEach((item, index) => {
    cols[index % numCols].push(item);
  });
  return cols;
}

const buttonBgColors = [
  "#E2F9FF",
  "#E2F2FF",
  "#E7E5FF",
  "#EDE6FB",
  "#F8EEEF",
];

export default function FAQContent({ categories }: FAQContentProps) {
  const [activeTabId, setActiveTabId] = useState(categories[0]?.id || "");
  const [openInCol1, setOpenInCol1] = useState<string | null>(null);
  const [openInCol2, setOpenInCol2] = useState<string | null>(null);

  const activeCategory = categories.find((c) => c.id === activeTabId);
  const [col1, col2] = splitIntoColumns<FaqItem>(activeCategory?.faqs || [], 2);

  const renderAccordionColumn = (
    items: FaqItem[],
    openId: string | null,
    setOpenId: (id: string | null) => void
  ) => (
    <div className="flex flex-col gap-5">
      {items.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div
            key={faq.id}
            className={`bg-white border border-[#CBD5E1] rounded-[14px] transition-all duration-300 overflow-hidden ${
              isOpen ? "pb-3" : ""
            }`}
          >
            <button
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="flex items-center justify-between w-full xs:px-2 sm:px-2 px-6 py-5 text-left"
            >
              <span className="text-base font-[poppins] font-semibold pl-4 text-[#1A1A1A]">{faq.question}</span>
              <FaAngleDown
                className={`text-[#334155] transition-transform duration-300 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            <div
              className={`px-6 text-base font-[poppins] text-[#242424] font-light transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? "max-h-[200px] opacity-100 py-2" : "max-h-0 opacity-0 py-0"
              }`}
            >
              <p className="font-[300]">{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-full 2xl:max-w-full mx-auto 2xl:px-0 pt-5 md:pb-10 lg:pb-4">
      {/* <div className="flex md:hidden flex-col gap-3">
        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => {
              setActiveTabId(category.id);
              setOpenInCol1(null);
              setOpenInCol2(null);
            }}
            className={`w-full px-6 py-3 text-sm rounded-xl transition ${
              activeTabId === category.id ? "text-[#1A1A1A] font-semibold" : "border border-[#CBD5E1] text-[#64748B]"
            }`}
            style={{ backgroundColor: activeTabId === category.id ? buttonBgColors[index] : "transparent" }}
          >
            {category.title}
          </button>
        ))}
      </div> */}

      <div className="flex md:hidden gap-2 overflow-x-auto pb-1">
  {categories.map((category, index) => (
    <button
      key={category.id}
      onClick={() => {
        setActiveTabId(category.id);
        setOpenInCol1(null);
        setOpenInCol2(null);
      }}
      className={`flex-shrink-0 font-[poppins] px-3 py-2 text-xs rounded-t-xl transition whitespace-nowrap ${
        activeTabId === category.id ? "text-[#1A1A1A] font-semibold" : "text-[#64748B] font-normal border-t border-l border-r border-[#CBD5E1] "
      }`}
      style={{ backgroundColor: activeTabId === category.id ? buttonBgColors[index] : "transparent" }}
    >
      {category.title}
    </button>
  ))}
</div>

      <div className="hidden md:flex gap-4 flex">
        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => {
              setActiveTabId(category.id);
              setOpenInCol1(null);
              setOpenInCol2(null);
            }}
            className={`flex-shrink-0 font-[poppins] px-6 py-4 text-xs rounded-t-xl transition whitespace-nowrap ${
              activeTabId === category.id ? "text-[#1A1A1A] font-semibold" : "text-[#64748B] font-normal border-t border-l border-r border-[#CBD5E1]"
            }`}
            style={{ backgroundColor: activeTabId === category.id ? buttonBgColors[index] : "transparent" }}
          >
            {category.title}
          </button>
        ))}
      </div>

      <div className=" md:mt-0 relative flex flex-col gap-10 pt-10 pb-20 justify-center items-center md:rounded-tr-3xl md:rounded-br-3xl md:rounded-bl-3xl overflow-hidden">
        {/* Use non-negative z-index to avoid being hidden behind parent backgrounds on some pages */}
        <img src={bg} alt="gradient" className="absolute top-0 left-0 w-full h-full object-cover z-0" />
        <div className="relative z-10 text-center text-2xl font-semibold text-[#1A1A1A]">{activeCategory?.title}</div>

        <div className="relative z-10 grid md:grid-cols-2 gap-10 w-full max-w-6xl px-4">
          {renderAccordionColumn(col1, openInCol1, setOpenInCol1)}
          {renderAccordionColumn(col2, openInCol2, setOpenInCol2)}
        </div>
      </div>
    </div>
  );
}
