import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import LazySection from "../components/ui/LazySection";
import Header from "../layout/Header";
import shine from "../assets/star.svg";
import growth from "../assets/growth.svg";
import community from "../assets/community-certificate.svg";
import benefit1 from "../assets/benefit1.png";
import benefit2 from "../assets/benefit2.png";
import benefit3 from "../assets/benefit3.png";
import benefit4 from "../assets/benefit4.png";
import benefit5 from "../assets/benefit5.png";
import benefit6 from "../assets/benefit6.png";
import group1 from "../assets/Group1.png";
import group2 from "../assets/Group2.png";
import group3 from "../assets/Group3.png";
import design from "../assets/design.png";
import line from "../assets/Line.svg";
import frame from "../assets/frame.png";
import step1 from "../assets/step1.svg";
import step2 from "../assets/step2.svg";
import step3 from "../assets/step3.svg";
import step4 from "../assets/step4.svg";
import Ellipse1 from "../assets/Ellipse 1.png";
import Ellipse2 from "../assets/Ellipse 2.png";
import { Lock } from "lucide-react";
import { FiMinusCircle, FiPlusCircle } from "react-icons/fi";
import joinImage from "../assets/join-team.png";
import GetInTouch from "../components/sections/GetInTouch";
import Subscribe from "../components/sections/Subscribe";
import Footer from "../layout/Footer/Footer";

export default function Certifications() {
  const [step, setStep] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setStep(1), 300));
    timers.push(setTimeout(() => setStep(2), 500));
    timers.push(setTimeout(() => setStep(3), 800));
    timers.push(setTimeout(() => setStep(4), 1000));
    timers.push(setTimeout(() => setStep(5), 1200));
    return () => timers.forEach(clearTimeout);
  }, []);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const benefits = [
    { icon: shine, label: "Verified credibility" },
    { icon: growth, label: "Career Growth" },
    { icon: community, label: "Community" },
  ];

  const features = [
    {
      icon: benefit1,
      title: "Gain recognition that builds trust and credibility",
      desc: "Showcase your verified values and stand apart with global validation.",
    },
    {
      icon: benefit2,
      title: "Enhance career and business opportunities",
      desc: "Open doors to collaborations, clients, and leadership roles.",
    },
    {
      icon: benefit3,
      title: "Access exclusive CNESS community and resources",
      desc: "Connect with like-minded conscious leaders and growth tools.",
    },
    {
      icon: benefit4,
      title: "Prove Your Commitment to Ethical Progress",
      desc: "Prove that you prioritize impact, ethics, and long-term value.",
    },
    {
      icon: benefit5,
      title: "Unlock Spotlight and Growth Opportunities in CNESS",
      desc: "Connect with like-minded conscious leaders and growth tools.",
    },
    {
      icon: benefit6,
      title: "Elevate Your Brand and Build Lasting Trust",
      desc: "Be recognized as a trusted voice in conscious impact.",
    },
  ];

  const levels = [
    {
      title: "Aspiring",
      description:
        "Entry-level certification for those beginning their journey of conscious growth.",
      icon: group1,
      position: "translate-y-68 -translate-x-34", // bottom-left
      lockRotation: "31.39deg",
    },
    {
      title: "Inspired",
      description:
        "Intermediate level for individuals or businesses actively practicing and applying conscious principles.",
      icon: group2,
      position: "translate-y-18", // center
      lockRotation: "1.95deg",
    },
    {
      title: "Leader",
      description:
        "Advanced recognition for change makers driving initiatives, leading communities, and creating impact.",
      icon: group3,
      position: "-translate-y-20 translate-x-34", // top-right
      lockRotation: "0deg",
    },
  ];

  const steps = [
    {
      step: "STEP–01",
      title: "Create Your Account",
      desc: "Sign up on CNESS and set up your profile to begin your journey.",
      icon: step1,
    },
    {
      step: "STEP–02",
      title: "Complete True Profile",
      desc: "Access guided modules, complete the learning steps, and take the assessment at your own pace.",
      icon: step2,
    },
    {
      step: "STEP–03",
      title: "Complete Assessment",
      desc: "Access guided modules, complete the learning steps, and take the assessment at your own pace.",
      icon: step3,
    },
    {
      step: "STEP–04",
      title: "Get Certified",
      desc: "Earn your verified digital badge and showcase your achievement with pride.",
      icon: step4,
    },
  ];

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
      {/* hero section */}
      <LazySection effect="fade-up" delay={0.2}>
        <section
          className="w-full h-full"
          style={{
            background:
              "linear-gradient(128.73deg, #FFFFFF 27.75%, #FEDFDF 100.43%, #F1A5E5 101.52%)",
          }}
        >
          <div className="flex flex-col items-center text-center z-10 pt-16 px-4">
            <h1
              style={{ fontFamily: "Poppins, sans-serif" }}
              className={
                `font-medium text-[32px] md:text-[42px] leading-[115%] tracking-[-0.02em] text-center antialiased bg-gradient-to-b from-[#232323] to-[#4E4E4E] text-transparent bg-clip-text transition-all duration-1000 ease-in-out` +
                (step >= 4
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-6")
              }
            >
              About Our Certification
            </h1>

            <p
              className={
                `openSans lg:text-lg md:text-[16px] text-[12px] text-[#64748B] lg:mb-10 md:mb-12 mb-4 mt-6
            max-w-4xl mx-auto transition-all duration-1000 ease-in-out ` +
                (step >= 5
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6")
              }
            >
              CNESS Certification is more than a credential - it’s a recognition
              of conscious growth. It validates knowledge, ethical practices,
              and positive impact in both professional and personal spaces. Our
              goal is to help individuals and organizations stand out as
              trusted, purpose-driven contributors in today’s world.
            </p>

            <div
              className={
                `flex flex-row justify-center gap-4 transition-all duration-1000 ease-in-out ` +
                (step >= 5
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6")
              }
            >
              <div className="flex justify-center items-center">
                <Button
                  variant="gradient-primary"
                  className="
                w-full sm:w-fit
                rounded-[100px] hero-section-btn
                py-2 px-4 text-[14px]
                sm:py-3 sm:px-8 sm:text-base
                font-['Open Sans'] font-normal leading-[100%] text-center
               
              "
                  onClick={() => (window.location.href = "/sign-up")}
                >
                  Get Certified
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Image */}
          <div className="w-full px-4 lg:px-16 pb-12 pt-20">
            <div className="mx-auto max-w-[1900px] rounded-[32px] overflow-hidden">
              <img
                src="https://cdn.cness.io/Rectangle%201.png"
                alt="certificate hero Section"
                className="
              mx-auto w-full max-w-[1900px] rounded-[32px]
              object-cover
              /* heights per breakpoint */
              h-[240px] sm:h-[280px] md:h-[320px] lg:h-[405px] xl:h-[460px] 2xl:h-[460px]
              /* keep the man’s face in frame as width grows */
              object-[58%_50%]       /* base: a bit right of center */
              sm:object-[60%_50%]
              md:object-[62%_50%]
              lg:object-[64%_50%]
              xl:object-[66%_50%]
              2xl:object-[68%_50%]
            "
              />
            </div>
          </div>
        </section>
      </LazySection>

      {/* benefit section  */}
      <LazySection effect="fade-up" delay={0.2}>
        <section
          className="relative w-full h-full"
          style={{
            background:
              "linear-gradient(250.1deg, #FEE2E2 0.41%, #FFFFFF 99.59%)",
          }}
        >
          <img
            src={Ellipse1}
            alt=""
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none select-none"
            aria-hidden="true"
          />
          <div className="relative flex flex-col items-center text-center z-10 pt-16 px-4">
            <div className="w-full">
              <span
                className="badge text-[#F07EFF] border-[#F07EFF] border text-[16px] font-[500] px-4 py-1 rounded-[100px] mb-6 inline-block 
            rounded-tl-[100px] rounded-br-[100px] rounded-tr-[10px] rounded-bl-[10px] bg-white"
              >
                Why it matters
              </span>
              <h3 className="font-poppins font-medium text-[32px] md:text-[42px] leading-[54px] tracking-[-0.02em] capitalize text-centerp">
                Benefits of our{" "}
                <span className="bg-gradient-to-r from-[#D747EA] to-[#7741FB] text-transparent bg-clip-text">
                  Certification
                </span>
              </h3>
            </div>
            <div className="flex flex-wrap gap-4 justify-center my-8">
              {benefits.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-full border border-[#CBD5E1] bg-white px-5 py-2 shadow-sm hover:shadow-md transition cursor-pointer"
                >
                  <img src={item.icon} alt={item.label} className="w-6 h-6" />
                  <span className="font-medium text-[#64748B]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              {features.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start text-left gap-4 rounded-2xl border border-[#DFDFDF] bg-white p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-lg bg-[#6340FF]/10">
                    <img src={item.icon} alt={item.title} className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="font-medium text-[#222224] text-xl leading-snug">
                      {item.title}
                    </h3>
                    <p className="font-normal text-base text-[#64748B] mt-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* certification section  */}
      <LazySection effect="fade-up" delay={0.2}>
        <section
          className="relative w-full h-full"
          style={{
            background:
              "linear-gradient(217.58deg, #FEE2E2 -24.89%, #FFFFFF 50.64%)",
          }}
        >
          <img
            src={Ellipse2}
            alt=""
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none select-none"
            aria-hidden="true"
          />
          <div className="relative flex flex-col items-center text-center z-10 pt-16 mb-32 px-4">
            <div className="w-full pb-8">
              <h3 className="font-poppins font-medium text-[32px] md:text-[42px] leading-[54px] tracking-[-0.02em] capitalize text-centerp">
                <span className="bg-gradient-to-r from-[#D747EA] to-[#7741FB] text-transparent bg-clip-text">
                  Certification{" "}
                </span>
                Level
              </h3>
              <p
                className={
                  `openSans lg:text-lg md:text-[16px] text-[12px] text-[#64748B] lg:mb-10 md:mb-12 my-4
            max-w-4xl mx-auto transition-all duration-1000 ease-in-out ` +
                  (step >= 5
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6")
                }
              >
                Everyone starts somewhere. We recognise progress at every stage
                of your journey
              </p>
            </div>
            <div className="relative py-20">
              {/* dashed connector line */}
              <img
                src={line}
                alt="connector"
                className="absolute left-1/2 top-[120px] -translate-x-1/2 pointer-events-none select-none w-full max-w-2xl"
                style={{ zIndex: 1 }}
              />

              {/* cards */}
              <div className="relative flex flex-col md:flex-row items-center justify-center gap-16 z-10">
                {levels.map((level, i) => (
                  <div
                    key={i}
                    className={`relative text-center flex flex-col items-center w-[260px] transform ${level.position}`}
                  >
                    <div className="group bg-white rounded-xl shadow-2xl transition-all duration-500 ease-out w-full h-[260px] flex flex-col justify-between border border-[#F3EAFB] hover:-translate-y-2 hover:border-purple-300 hover:scale-[1.03] relative overflow-hidden">
                      <div
                        className="flex items-center justify-center flex-1 rounded-xl"
                        style={{
                          backgroundImage: `url(${design})`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                        }}
                      >
                        <img
                          src={level.icon}
                          alt={level.title}
                          className="w-[120px] h-[120px]"
                        />
                      </div>
                      <div className="flex justify-start my-3 mx-4">
                        <Lock
                          className="w-5 h-5 text-yellow-500 opacity-70"
                          style={{ transform: `rotate(${level.lockRotation})` }}
                        />
                      </div>
                    </div>
                    <h3 className="text-3xl font-medium text-black mt-6 mb-2">
                      {level.title}
                    </h3>
                    <p className="text-[#64748B] text-base font-normal max-w-xl mx-auto">
                      {level.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </LazySection>

      {/* certification process section  */}
      <LazySection effect="fade-up" delay={0.2}>
        <div className="flex items-start w-full max-w-7xl mx-auto pt-42 pb-10 px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_40px_1fr] gap-10 md:gap-8 items-stretch w-full">
            {/* Left Content */}
            <div className="w-full">
              <span
                className="badge text-[#F07EFF] border-[#F07EFF] border text-[16px] font-[500] px-4 py-1 rounded-[100px] inline-block 
            rounded-tl-[100px] rounded-br-[100px] rounded-tr-[10px] rounded-bl-[10px] bg-white"
              >
                How It Works
              </span>
              <h1 className="text-[32px] md:text-[42px] font-medium text-[#222224] leading-tight pt-2">
                Our Certification Process
              </h1>
              <p className="text-base text-[#64748B] mt-2">
                We’ve made the path to certification clear and straightforward —
                so you can focus on learning, growing, and getting recognized
                without complications.
              </p>
              <div className="mt-4 mb-6">
                <Button
                  variant="gradient-primary"
                  className="rounded-full py-2 px-4 sm:py-3 sm:px-8 text-sm sm:text-base font-normal"
                  onClick={() => (window.location.href = "/sign-up")}
                >
                  Get Started
                </Button>
              </div>
              <div className="mt-4">
                <img
                  src={frame}
                  alt="Certification Process"
                  className="rounded-[20px] w-full"
                />
              </div>
              <span className="flex justify-end text-[#64748B] text-xs font-normal">
                condition apply*
              </span>
            </div>

            {/* middle */}
            <div className="flex justify-center self-center">
              <div className="relative flex flex-col justify-between items-center w-[60px] h-[35rem]">
                <div className="absolute inset-0 left-1/2 -translate-x-1/2 w-[2px] border-l-2 border-dashed border-[#E9E9E9] z-0"></div>

                {steps.map((step, i) => (
                  <div key={i} className="relative z-10 bg-white">
                    <img
                      src={step.icon}
                      alt={`Step ${i + 1}`}
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Steps */}
            <div className="flex flex-col space-y-6">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="pl-6 pr-4 py-6 bg-white border border-[#DFDFDF] shadow-sm rounded-4xl"
                >
                  <span className="bg-gradient-to-r from-[#6340FF] to-[#D748EA] text-transparent bg-clip-text text-xl font-semibold">
                    {step.step}
                  </span>
                  <h2 className="text-2xl font-medium text-[#222224] mt-1">
                    {step.title}
                  </h2>
                  <p className="text-base font-normal text-[#64748B] mt-1">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </LazySection>

      {/* faq section  */}
      <LazySection effect="fade-up" delay={0.2}>
        <section
          className="relative w-full h-full"
          style={{
            background: "linear-gradient(180deg, #FAFAFA 0%, #F6F5FA 100%)",
          }}
        >
          <div className="flex items-start w-full max-w-7xl mx-auto pt-32 pb-10 px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 items-stretch w-full">
              {/* Left Content */}
              <div className="w-full">
                <span
                  className="badge text-[#F07EFF] border-[#F07EFF] border text-[16px] font-[500] px-4 py-1 rounded-[100px] inline-block 
            rounded-tl-[100px] rounded-br-[100px] rounded-tr-[10px] rounded-bl-[10px] bg-white"
                >
                  Support
                </span>
                <h1 className="text-[32px] md:text-[42px] font-medium text-[#222224] leading-tight pt-2">
                  FAQs
                </h1>
                <p className="text-base text-[#64748B] mt-2">
                  Have questions? We’ve got you covered. Explore our FAQs to
                  find quick answers about certifications, benefits, levels, and
                  the process to get started.
                </p>
                <div className="mt-2 mb-6">
                  <span className="relative inline-block bg-gradient-to-r from-[#6340FF] to-[#D748EA] text-transparent bg-clip-text text-base font-semibold after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[1px] after:bg-gradient-to-r after:from-[#6340FF] after:to-[#D748EA]">
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
                        <span className="text-lg font-medium text-[#222224]">
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
                        <p className="text-base text-[#64748B] font-normal">
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
      </LazySection>

      <LazySection effect="fade-up" delay={0.2}>
        <section className="flex flex-col items-center relative w-full ">
          <div className="relative w-full  lg:h-[350px] md:h-[350px] h-[420px] overflow-hidden rounded-xl">
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

            <div className="flex flex-col items-center sm:items-start gap-6 sm:gap-8 p-6 sm:p-0  -translate-x-[50%] w-full max-w-4xl mx-auto sm:mx-0 absolute top-5 left-[50%] lg:top-[50%] lg:-translate-y-[50%] md:top-[50%] md:-translate-y-[50%] ">
              <div className="flex flex-col items-center sm:items-start gap-3 w-full text-center sm:text-left">
                <h2
                  style={{ fontFamily: "Poppins, sans-serif" }}
                  className="font-medium text-[#2a2a2a] text-center text-2xl sm:text-3xl md:text-[42px] tracking-normal sm:tracking-[0] leading-[1.3] sm:leading-[50px] w-full"
                >
                  Join us on this Journey to grow, connect,
                  <br />
                  and make an impact.
                </h2>
              </div>

              <div className="flex items-center justify-center w-full joining-btn ">
                <Button
                  variant="gradient-primary"
                  className="jakarta font-normal w-fit rounded-[100px] h-[42px] py-1 px-8 self-stretch text-[14px] "
                  onClick={() => (window.location.href = "/sign-up")}
                >
                  Join Us
                </Button>
              </div>
            </div>
          </div>
        </section>
      </LazySection>

      <LazySection effect="fade-up" delay={0.2}>
        <GetInTouch />
      </LazySection>
      <LazySection effect="fade-up" delay={0.2}>
        <Subscribe />
      </LazySection>
      <Footer />
    </>
  );
}
