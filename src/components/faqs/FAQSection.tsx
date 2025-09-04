import { useState } from "react";
import bg from "../../assets/Blush.svg";
import ellipse from "../../assets/Ellipse faq.png";
import { FaAngleDown } from "react-icons/fa";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  faqs: FaqItem[];
}

interface FAQSectionProps {
  faqs: FAQCategory[];
}

function splitIntoColumns<T>(array: T[], numCols: number): T[][] {
  const cols: T[][] = Array.from({ length: numCols }, () => []);
  array.forEach((item, index) => {
    cols[index % numCols].push(item);
  });
  return cols;
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  const [activeTabId, setActiveTabId] = useState(faqs[0]?.id || "");

  // Track open ID for each column separately
  const [openInCol1, setOpenInCol1] = useState<string | null>(null);
  const [openInCol2, setOpenInCol2] = useState<string | null>(null);

  const activeCategory = faqs.find((cat) => cat.id === activeTabId);
  const [col1, col2] = splitIntoColumns(activeCategory?.faqs || [], 2);

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
              className="flex items-center justify-between w-full px-6 py-5 text-left"
            >
              <span className="text-base font-semibold text-[#1A1A1A]">
                {faq.question}
              </span>
              <FaAngleDown
                className={`text-[#334155] transition-transform duration-300 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            <div
              className={`px-6 text-base text-[#64748B] font-normal transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen
                  ? "max-h-[200px] opacity-100 py-2"
                  : "max-h-0 opacity-0 py-0"
              }`}
            >
              <p>{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-5 md:pb-10 lg:pb-20">
      <div className="flex md:hidden flex-col gap-3">
        {faqs.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setActiveTabId(category.id);
              setOpenInCol1(null);
              setOpenInCol2(null);
            }}
            className={`w-full px-6 py-3 text-sm rounded-xl transition
        ${
          activeTabId === category.id
            ? "bg-[#E2F9FF] text-[#1A1A1A] font-semibold"
            : "border border-[#CBD5E1] text-[#64748B]"
        }`}
          >
            {category.title}
          </button>
        ))}
      </div>
      {/* Medium+ screens: separate buttons */}
      <div className="hidden md:flex gap-4 flex-wrap">
        {faqs.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setActiveTabId(category.id);
              setOpenInCol1(null);
              setOpenInCol2(null);
            }}
            className={`px-6 lg:px-12 py-2 lg:py-3 text-sm md:text-base transition rounded-t-xl
        ${
          activeTabId === category.id
            ? "text-[#1A1A1A] font-semibold bg-[#E2F9FF]"
            : "text-[#64748B] font-normal border-t border-l border-r border-[#CBD5E1]"
        }`}
          >
            {category.title}
          </button>
        ))}
      </div>

      <div className="mt-10 md:mt-0 relative flex flex-col gap-10 pt-10 pb-20 justify-center items-center md:rounded-tr-3xl md:rounded-br-3xl md:rounded-bl-3xl overflow-hidden">
        <img
          src={bg}
          alt="gradient"
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        />
        <img
          src={ellipse}
          alt=""
          className="absolute top-0 left-0 max-w-xl h-[30rem] pointer-events-none select-none"
          aria-hidden="true"
        />
        <div className="relative z-10 text-center text-2xl font-semibold text-[#1A1A1A]">
          {activeCategory?.title}
        </div>

        <div className="relative z-10 grid md:grid-cols-2 gap-10 w-full max-w-6xl px-4">
          {renderAccordionColumn(col1, openInCol1, setOpenInCol1)}
          {renderAccordionColumn(col2, openInCol2, setOpenInCol2)}
        </div>
      </div>
    </div>
  );
}
