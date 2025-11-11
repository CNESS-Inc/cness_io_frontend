import React from 'react';
import FAQContent from '../components/faqs/FAQContent';
import { faqCategories } from '../components/faqs/faqData';
import { MdCall } from "react-icons/md";
import { IoIosMail } from "react-icons/io";

const DashboardFaqs: React.FC = () => {
  return (
    <div className="sm:py-3 sm:px-4 py-6 px-4">
      {/* Page Heading */}
      <div className="w-full text-left mt-2 mb-4">
        <h2 className="text-[22px] font-semibold font-['Poppins'] text-gray-800">Help Centre</h2>
        <p className="text-gray-500 font-['Poppins'] text-sm mt-5">
          Explore creators, brands, and digital stores offering exclusive content.
        </p>
      </div>

      {/* FAQ Section */}
      <div className="w-full mx-auto 2xl:px-0 pt-2 md:pb-10">
        <FAQContent categories={faqCategories} />
      </div>

      {/* Contact Section */}
      <div className="text-center mb-20">
        <h4 className="text-gray-800 font-['Poppins'] font-semibold text-[24px]">
          Still have a question?
        </h4>
        <p className="text-gray-500 font-['Poppins'] text-sm mt-2 max-w-lg mx-auto">
          If you cannot find an answer to your question in the FAQ, you can always contact us. We will answer you shortly.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-8 pb-10 mt-10">
          {/* Phone */}
          <div className="bg-white rounded-2xl shadow-md p-8 w-72 flex flex-col items-center text-center border border-gray-100">
            <MdCall className="text-[#9747FF] w-8 h-8 mb-3" />
            <p className="font-semibold font-['Poppins'] text-gray-800 text-base">
              +1 (646) 785-5080
            </p>
            <p className="text-xs font-['Poppins'] text-gray-500 mt-2">
              We are always happy to help you.
            </p>
          </div>
          {/* Email */}
          <div className="bg-white rounded-2xl shadow-md p-8 w-72 flex flex-col items-center text-center border border-gray-100">
            <IoIosMail className="text-[#9747FF] w-8 h-8 mb-3" />
            <p className="font-semibold font-['Poppins'] text-gray-800 text-base">
              <a href="mailto:support@cness.com">support@cness.com</a>
            </p>
            <p className="text-xs font-['Poppins'] text-gray-500 mt-2">
              Alternative way to get answers faster.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFaqs;
