import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import SellerHeader from "../components/MarketPlace/SellerHeader";
import { MdCall } from "react-icons/md";
import { IoIosMail } from "react-icons/io";

// 1. Define all possible tab names as a Type
type TabKey = "Account & Profile" | "Orders & Purchases" | "Payments & Billing" | "Support & Contact";

// 2. Create your tabs array with correct typing
const tabs: TabKey[] = [
  "Account & Profile",
  "Orders & Purchases",
  "Payments & Billing",
  "Support & Contact",
];

// 3. Map your FAQs by tab with Record type
const faqsByTab: Record<TabKey, { question: string; answer: string }[]> = {
  "Account & Profile": [
    {
      question: "How do I create an account?",
      answer: "Click 'Sign Up' at the top right and fill out your information to create a new account.",
    },
    {
      question: "How can I update my profile information?",
      answer: "Go to your account settings, select 'Edit Profile', and save your updated details.",
    },
    {
      question: "I forgot my password. What should I do?",
      answer: "Use the 'Forgot Password' link on the login page to reset your password via email.",
    },
  ],
  "Orders & Purchases": [
    {
      question: "How do I place an order?",
      answer: "Browse products, add them to your cart, and proceed to checkout. Select your payment method and confirm your purchase.",
    },
    // Add more FAQs for this tab as needed
  ],
  "Payments & Billing": [
    // Add questions for this tab if needed
  ],
  "Support & Contact": [
    // Add questions for this tab if needed
  ],
};

const SellerHelp: React.FC = () => {
  // 4. Correct typing for state
  const [activeTab, setActiveTab] = useState<TabKey>("Account & Profile");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen items-center bg-white px-4 py-3 pb-14 bg-white">
      <SellerHeader toggleMobileNav={() => {}} />

      <div className="w-full max-w-4xl text-left mt-12 mb-8">
        <h2 className="text-[22px] font-semibold font-['Poppins'] text-gray-800">Help Centre</h2>
        <p className="text-gray-500 font-['Poppins'] text-sm mt-1">
          Explore creators, brands, and digital stores offering exclusive content.
        </p>
      </div>

      {/* Unified Card: Tabs + FAQ Content with Image Background */}
      <div
        className="w-full px-6 py-10 rounded-3xl shadow-xl flex flex-col gap-8"
        style={{
          backgroundImage: "url('/Blush.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-2 mb-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setOpenIndex(null); // Close any open FAQ when switching tab
                }}
                className={`px-6 md:px-8 py-2 md:py-3 rounded-full font-medium transition-all duration-300 shadow-sm border
                  ${isActive
                    ? "bg-white text-gray-900 shadow-lg font-semibold"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                  }`}
                style={isActive ? { position: 'relative', zIndex: 2 } : {}}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <h3 className="text-center text-2xl font-semibold font-['Poppins'] text-gray-800 mb-8 mt-4">
          General FAQs
        </h3>

        {/* FAQ Grid for Active Tab */}
        <div className="grid md:grid-cols-2 gap-6">
          {faqsByTab[activeTab]?.length > 0 ? (
            faqsByTab[activeTab].map((faq, i) => (
              <div
                key={i}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="bg-white/90 rounded-2xl border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-800">{faq.question}</h4>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                  />
                </div>
                {openIndex === i && (
                  <p className="text-gray-600 mt-3">{faq.answer}</p>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center text-gray-400 py-6">
              No FAQs for this section yet.
            </div>
          )}
        </div>
      </div>

      {/* Contact Section */}
      <div className="text-center mt-16 mb-20">
        <h4 className="text-gray-800 font-['Poppins'] font-semibold text-[24px]">
          Still have a question?
        </h4>
        <p className="text-gray-500 font-['Poppins'] text-sm mt-2 max-w-lg mx-auto">
          If you cannot find an answer to your question in the FAQ, you can always contact us. We will answer you shortly.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-8 mt-10">
          {/* Phone */}
          <div className="bg-white rounded-2xl shadow-md p-8 w-72 flex flex-col items-center text-center border border-gray-100">
            <MdCall className="text-indigo-500 w-8 h-8 mb-3" />
            <p className="font-semibold font-['Poppins'] text-gray-800 text-base">
              +1 (646) 785-5080
            </p>
            <p className="text-xs font-['Poppins'] text-gray-500 mt-2">
              We are always happy to help you.
            </p>
          </div>
          {/* Email */}
          <div className="bg-white rounded-2xl shadow-md p-8 w-72 flex flex-col items-center text-center border border-gray-100">
            <IoIosMail className="text-indigo-500 w-8 h-8 mb-3" />
            <p className="font-semibold font-['Poppins'] text-gray-800 text-base">
              support@cness.com
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

export default SellerHelp;
