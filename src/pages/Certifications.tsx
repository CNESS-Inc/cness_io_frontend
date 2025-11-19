import Button from "../components/ui/Button";
import LazySection from "../components/ui/LazySection";
import Header from "../layout/Header";
import joinImage from "../assets/join-team.png";
import blush_join from "../assets/blush join.png";
import GetInTouch from "../components/sections/GetInTouch";
//import Subscribe from "../components/sections/Subscribe";
import Footer from "../layout/Footer/Footer";
import CertificationsHero from "../components/certificationsComponents/CertificationsHero";
import Benefit from "../components/certificationsComponents/Benefit";
import CertificationLevel from "../components/certificationsComponents/CertificationLevel";
import Process from "../components/certificationsComponents/Process";
import SectionFaq from "../components/faqs/SectionFaq";
import { useState } from "react";
import SignupModel from "../components/OnBoarding/Signup";

export default function Certifications() {
  
  const faqs = [
    {
      question: "Who can apply?",
      answer:
        "Anyone — whether you’re a student, professional, or simply someone committed to personal growth and impact.",
    },
    {
      question: "How long does it take?",
      answer:
        "It depends on your pace, but most users complete it in a few weeks.",
    },
    {
      question: "How to get higher certification level?",
      answer:
        "By completing advanced modules and assessments available after the base level.",
    },
    {
      question: "Does the certification expire?",
      answer:
        "Certification stays valid for one full year and can be shared indefinitely.",
    },
    {
      question: "What if I don’t qualify right away?",
      answer:
        "No worries — you can reattempt after revisiting the learning material.",
    },
  ];
  const [openSignup, setOpenSignup] = useState(false);

  return (
    <>
      <Header />
      {/* hero section */}
      {/* <LazySection effect="fade-up" delay={0.2}> */}
        <CertificationsHero />
        <Benefit />
        <CertificationLevel />
      {/* </LazySection> */}

      {/* certification process section  */}
      <LazySection effect="fade-up" delay={0.2}>
        <Process />
      </LazySection>

      {/* faq section  */}
      <LazySection effect="fade-up" delay={0.2}>
        <SectionFaq faqs={faqs} />
      </LazySection>

      <LazySection effect="fade-up" delay={0.2}>
        <section className="flex flex-col items-center relative w-full ">
          <div className="relative w-full  lg:h-[350px] md:h-[350px] h-[420px] overflow-hidden rounded-xl">
            <div className="absolute inset-0">
              <img
                className="absolute h-full left-0 top-0"
                src={blush_join}
                alt=""
                role="presentation"
              />
            </div>

            <div className="absolute inset-0">
              <img
                className="absolute h-full lg:right-0 md:right-0 -right-40"
                src={joinImage}
                alt=""
                role="presentation"
              />
            </div>

            <div className="flex flex-col h-full justify-center items-center sm:items-start gap-6 sm:gap-8 p-6 sm:p-0  -translate-x-[50%] w-full max-w-4xl mx-auto sm:mx-0 absolute top-5 left-[50%] lg:top-[50%] lg:-translate-y-[50%] md:top-[50%] md:-translate-y-[50%] ">
<div className="flex flex-col items-center justify-center text-center w-full px-4">
  <h2
    style={{ fontFamily: "Poppins, sans-serif" }}
    className="font-medium text-[#2a2a2a]
               text-2xl sm:text-3xl md:text-[42px]
               leading-[1.3] md:leading-[50px]
               tracking-normal whitespace-nowrap  max-w-none"
  >
    Your conscious journey deserves to be seen.
  </h2>

  <p
    style={{ fontFamily: "Open Sans, sans-serif" }}
    className="font-light text-[16px] leading-[26px] text-[#242424]
               max-w-[780px] mt-3 md:mt-4 mx-auto"
  >
    Join CNESS — where your growth is recognized, your values are celebrated,
    and your impact begins.
  </p>
</div>
              <div className="flex items-center justify-center w-full joining-btn ">
                <Button
                  variant="gradient-primary"
                  className="w-fit h-[42px] rounded-[100px] 
             py-1 px-8 self-stretch 
             text-[16px] font-['Open_Sans'] font-medium
             leading-[100%] tracking-[0px] text-center"
                  onClick={() => setOpenSignup(true)}

                >
                  Join Us
                </Button>
              </div>
            </div>
          </div>
                    <SignupModel open={openSignup} onClose={() => setOpenSignup(false)} />
          
        </section>
      </LazySection>

      <LazySection effect="fade-up" delay={0.2}>
        <GetInTouch />
      </LazySection>
    {/*  <LazySection effect="fade-up" delay={0.2}>
        <Subscribe />
      </LazySection>*/}
      <Footer />
    </>
  );
}
