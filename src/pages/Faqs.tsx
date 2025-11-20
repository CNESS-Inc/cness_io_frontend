import { useState } from "react";
// import GetInTouch from "../components/sections/GetInTouch";
//import Subscribe from "../components/sections/Subscribe";
import LazySection from "../components/ui/LazySection";
import Footer from "../layout/Footer/Footer";
import Header from "../layout/Header";
import FAQSection from "../components/faqs/FAQSection";
import { RxCross2 } from "react-icons/rx";

export default function Faqs() {
  const [searchText, setSearchText] = useState("");
  const faqCategories = [
    {
      id: "general",
      title: "General FAQS",
      faqs: [
        {
          id: "gen-1",
          question: "What is CNESS?",
          answer: "CNESS is a platform that helps build a conscious ecosystem.",
        },
        {
          id: "gen-2",
          question: "What does CNESS stand for?",
          answer: "Conscious Network for Ethical and Sustainable Solutions.",
        },
        {
          id: "gen-3",
          question: "Who can join CNESS?",
          answer:
            "Anyone aligned with our values of ethics, sustainability, and social impact.",
        },
        {
          id: "gen-4",
          question: "How do I join the CNESS community?",
          answer: "Visit our sign-up page and complete the onboarding process.",
        },
        {
          id: "gen-5",
          question: "What is the vision behind CNESS?",
          answer:
            "To foster a global ecosystem of ethical, conscious, and impact-driven enterprises and professionals guided by wisdom, compassion, and inclusivity.",
        },
        {
          id: "gen-6",
          question: "Is there a membership fee?",
          answer:
            "General access is free. Premium features require a subscription.",
        },
        {
          id: "gen-7",
          question: "Does CNESS offer marketing support?",
          answer: "Yes, we provide promotional resources to qualified members.",
        },
        //{
         // id: "gen-8",
         // question: "Can Visionary Council members host events?",
          //answer: "Yes, subject to approval and alignment with CNESS values.",
        //},
        {
          id: "gen-9",
          question: "Can I refer someone to CNESS?",
          answer: "Yes! Use our referral program available on your dashboard.",
        },
        //{
          //id: "gen-10",
         // question: "Is there a media kit available?",
          //answer: "Yes, it’s available in the Resources section.",
        //},
      ],
    },
    {
      id: "certification",
      title: "Certification",
      faqs: [
        {
          id: "cert-1",
          question: "What is CNESS certification?",
          answer:
            "It verifies that individuals or organizations align with CNESS values.",
        },
        {
          id: "cert-2",
          question: "Who is eligible for certification?",
          answer: "Anyone committed to ethical and sustainable practices.",
        },
        {
          id: "cert-3",
          question: "How do I apply for certification?",
          answer: "Through the Certification section in your account.",
        },
        {
          id: "cert-4",
          question: "Is there a fee for certification?",
          answer: "Yes, depending on the type of certification you apply for.",
        },
        {
          id: "cert-5",
          question: "How long does certification last?",
          answer: "Certifications are valid for one year and can be renewed.",
        },
        {
          id: "cert-6",
          question: "Will I receive a certificate?",
          answer: "Yes, you'll receive a digital certificate and badge.",
        },
        {
          id: "cert-7",
          question: "Is there an exam or assessment?",
          answer:
            "Yes, some certifications require completing a short assessment.",
        },
        {
          id: "cert-8",
          question: "Can organizations get certified?",
          answer:
            "Yes, we offer certifications for both individuals and organizations.",
        },
        {
          id: "cert-9",
          question: "What are the benefits of being certified?",
          answer:
            "Recognition, trust-building, and access to exclusive events and listings.",
        },
      ],
    },
    {
      id: "social",
      title: "Social media",
      faqs: [
        {
          id: "soc-1",
          question: "Can I promote CNESS on social media?",
          answer: "Yes! We encourage sharing your involvement with CNESS.",
        },
        {
          id: "soc-2",
          question: "Are there official hashtags?",
          answer: "#CNESS #ConsciousLeadership #SustainableImpact",
        },
        {
          id: "soc-3",
          question: "Can I tag CNESS in posts?",
          answer:
            "Yes, please tag our official profiles for visibility and reshares.",
        },
        {
          id: "soc-4",
          question: "Where can I find brand assets?",
          answer: "In the media kit or Brand Guidelines section.",
        },
        {
          id: "soc-5",
          question: "Can I post testimonials?",
          answer: "Yes, we welcome authentic stories and experiences.",
        },
        {
          id: "soc-6",
          question: "Is there a community group?",
          answer: "Yes, you’ll gain access after joining our platform.",
        },
        {
          id: "soc-7",
          question: "Can I collaborate on campaigns?",
          answer: "Reach out to the marketing team for partnerships.",
        },
        {
          id: "soc-8",
          question: "Do you have an ambassador program?",
          answer: "Yes, applications open quarterly. Watch for announcements.",
        },
      ],
    },
    {
      id: "directory",
      title: "Directory",
      faqs: [
        {
          id: "dir-1",
          question: "What is the CNESS Directory?",
          answer:
            "A searchable list of all certified individuals and organizations.",
        },
        {
          id: "dir-2",
          question: "How do I get listed?",
          answer: "You’ll be added automatically after certification approval.",
        },
        {
          id: "dir-3",
          question: "Can I update my directory profile?",
          answer: "Yes, via your account settings.",
        },
        {
          id: "dir-4",
          question: "Is the directory public?",
          answer: "Yes, but with limited info unless you opt in fully.",
        },
        {
          id: "dir-5",
          question: "Can I connect with others via the directory?",
          answer: "Yes, contact forms and direct links are available.",
        },
        {
          id: "dir-6",
          question: "Can I search by certification level?",
          answer: "Yes, filters include certification, location, and category.",
        },
        {
          id: "dir-7",
          question: "How do I report a listing?",
          answer: "Use the 'Report' button or contact our support.",
        },
        {
          id: "dir-8",
          question: "Can non-members view the directory?",
          answer: "Only limited previews. Full access requires sign-in.",
        },
      ],
    },
   
/*

 {
      id: "premium",
      title: "Premium",
      faqs: [
        {
          id: "prem-1",
          question: "What is Premium membership?",
          answer: "An upgraded plan with added features and access.",
        },
        {
          id: "prem-2",
          question: "What do I get with Premium?",
          answer:
            "Private events, advanced certification, and partner discounts.",
        },
        {
          id: "prem-3",
          question: "How much does Premium cost?",
          answer: "Pricing varies by tier. Visit our pricing page for details.",
        },
        {
          id: "prem-4",
          question: "Can I upgrade anytime?",
          answer: "Yes, just go to your billing settings.",
        },
        {
          id: "prem-5",
          question: "Is Premium refundable?",
          answer: "We offer a 14-day refund policy on new subscriptions.",
        },
        {
          id: "prem-6",
          question: "Can I downgrade later?",
          answer: "Yes, you can switch to a free plan anytime.",
        },
        {
          id: "prem-7",
          question: "Are there Premium-only forums?",
          answer: "Yes, exclusive forums are available for Premium members.",
        },
        {
          id: "prem-8",
          question: "Do Premium members get support priority?",
          answer: "Yes, including dedicated chat and early feature access.",
        },
        {
          id: "prem-9",
          question: "Is Premium available for teams?",
          answer: "Yes, we offer team and enterprise plans.",
        },
      ],
    },
*/


  ];

  const filteredFaqCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchText.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchText.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <>
      <Header />
      <LazySection effect="fade-up" delay={0.1}>
        <div className="flex flex-col items-center text-center z-10 py-16 px-4">
          <h1
            style={{ fontFamily: "Poppins, sans-serif" }}
            className="font-medium text-[32px] md:text-[42px] leading-[115%] tracking-[0.03rem] text-center antialiased bg-gradient-to-b from-[#232323] to-[#4E4E4E] text-transparent bg-clip-text transition-all duration-1000 ease-in-out"
          >
            Frequently Asked Questions
          </h1>

          <p
            className="font-['Open_Sans'] lg:text-lg md:text-[16px] text-[12px] text-[#242424] mb-5 lg:mb-10 md:mb-12 mb-4 mt-4
            max-w-4xl mx-auto transition-all duration-1000 ease-in-out font-light"
          >
            Find quick answers to common questions about our CNESS and <br />
            Ecosystem.
          </p>
          <div className="flex justify-between items-center w-[300px] sm:w-[525px] lg:w-[625px] h-[50px] md:h-[66px] px-[34px] py-[18px] border border-[#CBD5E1] rounded-[40px] bg-white">
            <input
              type="text"
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="font-['Open_Sans'] w-full bg-transparent placeholder-[#AFB1B3] outline-none text-[16px]"
            />
            {searchText ? (
              <button onClick={() => setSearchText("")}>
                <RxCross2 className="text-[#897AFF]" size={20} />
              </button>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#897AFF"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21.5 21.5l-5.25-5.25m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 015.75 13.25z"
                />
              </svg>
            )}
          </div>
        </div>
      </LazySection>
      <FAQSection faqs={filteredFaqCategories} />
      <div className="flex flex-col items-center text-center z-10 pb-10 px-4">
        <h1
          style={{ fontFamily: "Poppins, sans-serif" }}
          className="font-medium text-[42px] md:text-[42px] leading-[115%] tracking-[0.03rem] text-center antialiased bg-gradient-to-b from-[#232323] to-[#4E4E4E] text-transparent bg-clip-text transition-all duration-1000 ease-in-out"
        >
          Still have a question?
        </h1>

        <p
          className="font-['Open_Sans'] lg:text-lg md:text-[16px] text-[12px] text-[#242424] lg:mb-10 md:mb-12 mb-4 mt-4
            max-w-4xl mx-auto transition-all duration-1000 ease-in-out font-light"
        >
          If you cannot find answer to a question in your FAQ, you can always{" "}
          <br />
          contact us. we will answer to you shortly
        </p>
      </div>
      {/* <GetInTouch /> */}
      {/*<LazySection effect="fade-up" delay={0.2}>
        <Subscribe />
      </LazySection>*/}
      <Footer />
    </>
  );
}
