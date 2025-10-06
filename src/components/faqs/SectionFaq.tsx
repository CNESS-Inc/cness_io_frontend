import { useState } from "react";
import { FiMinusCircle, FiPlusCircle } from "react-icons/fi";

interface FaqItem {
  question: string;
  answer: string;
}

interface CertificationFaqProps {
  faqs: FaqItem[];
}

export default function SectionFaq({ faqs }: CertificationFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <section
      className="relative w-full h-full"
      style={{
        background: "linear-gradient(180deg, #FAFAFA 0%, #F6F5FA 100%)",
      }}
    >
      <div className="flex items-start w-full max-w-7xl mx-auto pt-10 pb-20 md:py-20 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 items-stretch w-full">
          {/* Left Content */}
          <div className="w-full flex flex-col items-center justify-center md:justify-start md:items-start text-center md:text-left">
            <span
              style={{ fontFamily: "Poppins, sans-serif" }}
              className="badge text-[#F07EFF] border-[#F07EFF] border text-[16px] font-[500] px-4 py-1 rounded-[100px] mb-6 inline-block 
            rounded-tl-[100px] rounded-br-[100px] rounded-tr-[10px] rounded-bl-[10px] bg-white"
            >
              Support
            </span>
            <h1
              style={{ fontFamily: "Poppins, sans-serif" }}
              className="text-[32px] md:text-[42px] font-medium text-[#222224] leading-tight pt-4 md:pt-2"
            >
              FAQs
            </h1>
            <p className="openSans font-light text-[16px] leading-[24px] tracking-[0px] text-[#64748B] pt-4 md:pt-2">
              Have questions? We’ve got you covered. Explore our FAQs to find
              quick answers 
              <br />about certifications, benefits, levels, and the
              process to get started.
            </p>
            <div className="pt-4 md:pt-2 mb-4 md:mb-6">
              <span className="font-['Open Sans'] openSans relative inline-block bg-gradient-to-r from-[#6340FF] to-[#D748EA] text-transparent bg-clip-text text-base font-semibold after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[1px] after:bg-gradient-to-r after:from-[#6340FF] after:to-[#D748EA]">
                Chat with our friendly team
              </span>
            </div>
          </div>
          <div className="w-full max-w-2xl mx-auto space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className="bg-white pt-5 pb-3 rounded-3xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggle(i)}
                    className="flex items-center justify-between w-full px-6 text-left focus:outline-none"
                  >
                    <span
                      className="text-lg font-medium text-[#222224]"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <FiMinusCircle className="text-[#64748B]" size={25} />
                    ) : (
                      <FiPlusCircle className="text-[#64748B]" size={25} />
                    )}
                  </button>

                  {/* Animated answer section */}
                  <div
                    className={`pt-3 px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-40 py-2" : "max-h-0 py-0"
                    }`}
                  >
                    <p className="openSans font-['Open Sans'] text-base text-[#64748B] font-light">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
