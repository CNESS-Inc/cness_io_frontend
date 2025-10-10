import EcoHero from "../components/ecoSystem/EcoHero";
import EcoSystemApp from "../components/ecoSystem/EcoSystemApp";
import LazySection from "../components/ui/LazySection";
import Header from "../layout/Header";
import joinImage from "../assets/join-team.png";
import Button from "../components/ui/Button";
import WhatOffer from "../components/ecoSystem/WhatOffer";
import WhyCness from "../components/ecoSystem/WhyCness";
import GetInTouch from "../components/sections/GetInTouch";
//import Subscribe from "../components/sections/Subscribe";
import Footer from "../layout/Footer/Footer";
import SectionFaq from "../components/faqs/SectionFaq";
import {  useState } from "react";
import SignupModel from "../components/OnBoarding/Signup";

export default function EcoSystem() {
      const [openSignup, setOpenSignup] = useState(false);

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
        "No, your certification remains valid and can be shared indefinitely.",
    },
    {
      question: "What if I don’t qualify right away?",
      answer:
        "No worries — you can reattempt after revisiting the learning material.",
    },
  ];
  return (
    <>
      <Header />
      <LazySection effect="fade-up" delay={0.2}>
        <EcoHero />
      </LazySection>
      <LazySection effect="fade-up" delay={0.2}>
        <EcoSystemApp />
      </LazySection>
      <LazySection effect="fade-up" delay={0.2}>
        <section className="flex flex-col items-center relative w-full ">
          <div className="relative w-full lg:h-[350px] md:h-[350px] h-[420px] overflow-hidden rounded-xl">
            <div className=" sm:flex gap-[53.5px] top-2 left-0 inline-flex items-center absolute opacity-50 join-section-bg">
              <div className="bg-[#00D2FF] relative w-[480px] h-[365px] rounded-[182.5px] blur-[175px] bg-first" />
              <div className="bg-[#6340FF] relative w-[450px] h-[365px] rounded-[182.5px] blur-[175px] bg-second" />
              <div className="bg-[#FF994A] relative w-[520px] h-[365px] rounded-[182.5px] blur-[175px] bg-third" />
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
              <div className="flex flex-col items-center sm:items-start gap-3 w-full text-center sm:text-left">
                <h2
                  style={{ fontFamily: "Poppins, sans-serif" }}
                  className="font-medium text-[#2a2a2a] text-center text-2xl sm:text-3xl md:text-[42px] tracking-normal sm:tracking-[0] leading-[1.3] sm:leading-[50px] w-full"
                >
                  Start your journey from Loneliness to <br /> Wholeness to
                  Recognition.
                </h2>
                <p className="text-center w-full font-['Open Sans'] text-[#242424] font-light text-[16px] leading-[24.38px] tracking-[0px]">
                  Join a movement that sees you, supports you, and helps your
                  conscious work shine.
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
                  Create Your Profile
                </Button>
              </div>
            </div>
          </div>
          {/* Signup Popup Modal */}
                        <SignupModel open={openSignup} onClose={() => setOpenSignup(false)} />
        </section>
      </LazySection>
      <LazySection effect="fade-up" delay={0.2}>
        <WhatOffer />
      </LazySection>
      <LazySection effect="fade-up" delay={0.2}>
        <WhyCness />
      </LazySection>
      <LazySection effect="fade-up" delay={0.2}>
        <GetInTouch />
      </LazySection>
      <LazySection effect="fade-up" delay={0.2}>
        <SectionFaq faqs={faqs} />
      </LazySection>
      {/*<LazySection effect="fade-up" delay={0.2}>
        <Subscribe />
      </LazySection>*/}
      <Footer />
    </>
  );
}
