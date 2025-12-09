import { useState } from "react";
import { CircleCheckBig } from "lucide-react";
import LazySection from "../components/ui/LazySection";
//import bg from "../assets/Frame why cness.png";
import Header from "../layout/Header/Header";
import Footer from "../layout/Footer/Footer";
import Button from "../components/ui/Button";
import SignupModel from "../components/OnBoarding/Signup";
//import bulb from "../assets/bulb.svg";
//import WhatOffer from "../components/ecoSystem/WhatOffer";

//import Teamframe from "../components/ui/TeamFrame";
// import GetInTouch from "../components/sections/GetInTouch";
//import Subscribe from "../components/sections/Subscribe";
import joinImage from "../assets/join-team.png";
import { useEffect, useRef } from "react";

export default function WhyCness() {
  {
    /*const people = [
    {
      name: "John Doe",
      role: "Founder & CEO",
      imageUrl: "https://cdn.cness.io/team.webp",
      socials: {
        linkedin: "#",
        instagram: "#",
        //x: "#",
        facebook: "#",
      },
    },
    // duplicate for demo (replace with real people)
    {
      name: "John Doe",
      role: "Founder & CEO",
      imageUrl: "https://cdn.cness.io/team.webp",
      socials: { linkedin: "#", instagram: "#", facebook: "#" },
    },
    {
      name: "John Doe",
      role: "Founder & CEO",
      imageUrl: "https://cdn.cness.io/team.webp",
      socials: { linkedin: "#", instagram: "#", facebook: "#" },
    },
    {
      name: "John Doe",
      role: "Founder & CEO",
      imageUrl: "https://cdn.cness.io/team.webp",
      socials: { linkedin: "#", instagram: "#", facebook: "#" },
    },
    {
      name: "John Doe",
      role: "Founder & CEO",
      imageUrl: "https://cdn.cness.io/team.webp",
      socials: { linkedin: "#", instagram: "#", facebook: "#" },
    },
  ];*/
  }
  //const [selected, setSelected] = useState<number>(2);
  const [openSignup, setOpenSignup] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const videoUrl =
    "https://cdn.cness.io/WhatsApp%20Video%202025-11-11%20at%204.48.38%20PM.mp4";
  const videoRef = useRef(null);

  //const scrollToGetInTouch = () => {
    //const el = document.getElementById("getintouch");
   // if (!el) return;
   // const header = document.querySelector("header"); // if you use a sticky <Header />
   // const offset = header ? (header as HTMLElement).offsetHeight : 0;
   // const y = el.getBoundingClientRect().top + window.pageYOffset - offset - 8; // tiny extra gap
   // window.scrollTo({ top: y, behavior: "smooth" });
  //};

  useEffect(() => {
    if (!isVideoOpen) return;
    const video = document.createElement("video");
    video.src = videoUrl;
    video.onloadedmetadata = () => {
      setIsPortrait(video.videoHeight > video.videoWidth);
    };
  }, [isVideoOpen]);

  return (
    <>
      <Header />
      {/* <LazySection effect="fade-up" delay={0.2}>
        <section
          className="relative w-full py-12 sm:py-16 md:py-20 px-4"
          style={{
            background:
              "linear-gradient(135deg, #FFFFFF 10%, #FDEDED 70%, #F9D3F2 100%)",
          }}
        >
          {/* Text container 
          <div className="mx-auto max-w-[1100px] px-6 text-center">
            <h1
              style={{ fontFamily: "Poppins, sans-serif" }}
              className="font-medium text-[32px] md:text-[42px] leading-[120%] md:leading-[130%] tracking-[-0.02em] text-center antialiased bg-linear-to-b from-[#4E4E4E] to-[#232323] text-transparent bg-clip-text transition-all duration-1000 ease-in-out"
            >
              Grow With Purpose, Together.
            </h1>

            <p
              className={`font-['Open_Sans'] md:text-base font-light text-[#242424] mt-6 max-w-4xl mx-auto transition-all duration-1000 ease-in-out`}
            >
              We built CNESS because we believe growth should be conscious and
              connected.
              <br /> Our community helps individuals and organizations learn,
              share and
              <br />
              create positive change.
            </p>
            <Button
              variant="gradient-primary"
              size="md"
              onClick={scrollToGetInTouch}
              className="mt-5 sm:mt-6 px-5 py-2 sm:px-6 sm:py-3 text-[14px] sm:text-[16px] font-['Plus Jakarta Sans'] font-medium text-[16px] leading-[100%] tracking-[0px] text-center"
            >
              Contact Us
            </Button>
          </div>

          {/* Image container (centered with spacing on sides)
          <div className="w-full px-4 lg:px-16 pb-12 pt-20">
            <div className="mx-auto max-w-[1900px] rounded-4xl overflow-hidden">
              <img
                src="https://cdn.cness.io/whycness.webp"
                alt="CNESS Marketplace preview"
                className="
          mx-auto w-full max-w-[1900px] rounded-4xl
              object-cover
             
              h-[220px] sm:h-[280px] md:h-[360px] lg:h-[405px] xl:h-[460px] 2xl:h-[460px]
           
              object-[58%_50%]       
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
      </LazySection> */}

      {/* --- Our Story + Mission / Vision (Section 2) --- 
      <LazySection effect="fade-up" delay={0.2}>
        <section className="relative w-full py-16 lg:py-20 bg-linear-to-r from-[#FAFAFA] to-[#F6F5FA]">
          <div className="mx-auto max-w-[1200px] px-6">
            {/* Top row 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start px-4 sm:px-6">
              {/* Left: title
              <div className="text-center lg:text-left">
                <p className="text-[32px] md:text-[38px] lg:text-[42px] font-semibold bg-linear-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                  Our Story
                </p>
                <h3 className="mt-2 font-['Poppins'] font-medium text-[30px] md:text-[36px] lg:text-[42px] leading-[1.3] tracking-[-0.02em] text-[#1F2937]">
                  Begins With a Simple Belief
                </h3>
              </div>

              {/* Right: copy + CTA 
              <div className="flex flex-col items-center lg:items-start gap-6">
                <p className="max-w-[620px] font-['Open_Sans'] text-[15px] md:text-[16px] leading-[26px] text-[#242424] font-light text-justify">
                  CNESS was born from the vision of our founder, Nandiji, whose
                  life and teachings embody conscious living. He believed that
                  true growth goes beyond fleeting online inspiration — it’s
                  about nurturing the soul and connecting with others on a
                  deeper level. Guided by this belief, he envisioned a space
                  where people could be authentic, nourish their spirits, and
                  support one another on a shared journey toward mindful,
                  meaningful living. That space became CNESS.
                </p>

                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 mt-6">
                  <a
                    onClick={() => setOpenSignup(true)}
                    className="inline-flex items-center justify-center rounded-full px-5 py-3 text-[16px]
               font-['Plus Jakarta Sans'] font-medium text-white shadow-md hover:shadow-lg
               bg-linear-to-r from-[#7077FE] to-[#F07EFF] transition-all duration-300"
                  >
                    Join the Journey
                  </a>

                  <Button
                    variant="white-outline"
                    size="md"
                    onClick={() => setIsVideoOpen(true)}
                    className="hero-section-btn flex items-center gap-2 w-full sm:w-auto py-3 px-4 sm:py-4 sm:px-8 
                   text-[16px] sm:text-base font-['Plus Jakarta Sans'] font-medium leading-[100%] 
                   tracking-[0px] text-center rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    >
                      <path d="M6.5 5.5v9l7-4.5-7-4.5z" />
                    </svg>
                    Play Video
                  </Button>

                  {/* 🎬 Video Modal 
                  {isVideoOpen && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center  p-4"
                      onClick={() => setIsVideoOpen(false)}
                    >
                      {/* Auto layout container 
                      <div
                        className={`relative w-full ${
                          isPortrait
                            ? "max-w-[900px] aspect-video"
                            : "max-w-[900px] aspect-video"
                        } rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.3)] bg-black`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Close Button 
                        <button
                          onClick={() => setIsVideoOpen(false)}
                          className="absolute top-3 right-3 z-10 text-white/80 hover:text-white bg-black/40 hover:bg-black/60
                   w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200"
                        >
                          ×
                        </button>

                        {/* Portrait Video: Blurred Background Layer 
                        {isPortrait && (
                          <video
                            className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40"
                            src={videoUrl}
                            muted
                            loop
                            autoPlay
                          />
                        )}

                        {/* Main Video (auto detect portrait or landscape) 
                        <video
                          ref={videoRef}
                          className={`relative z-10 rounded-3xl ${
                            isPortrait
                              ? "w-auto h-full mx-auto object-contain" // Portrait → center with height fit
                              : "w-full h-full object-cover" // Landscape → fill the container
                          }`}
                          src={videoUrl}
                          controls
                          autoPlay
                          onLoadedMetadata={(e) => {
                            const video = e.target as HTMLVideoElement;
                            setIsPortrait(video.videoHeight > video.videoWidth);
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom row: Mission / Vision cards 
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-4xl border border-[#ECEEF2] bg-white/90 shadow-[0_6px_28px_rgba(16,24,40,0.06)] p-6 md:p-[30px] flex flex-col gap-2.5">
                <h4 className="font-['Poppins'] font-medium text-[20px] md:text-[24px] leading-[1.2] text-[#111827]">
                  Mission
                </h4>
                <p className="font-['Open_Sans'] text-[15px] md:text-[16px] leading-6 text-[#242424] font-light">
                  To connect people and organizations who care about mindful
                  living so they can learn, grow and make a positive impact
                  together.
                </p>
              </div>

              <div className="rounded-4xl border border-[#ECEEF2] bg-white/90 shadow-[0_6px_28px_rgba(16,24,40,0.06)] p-6 md:p-[30px] flex flex-col gap-2.5">
                <h4 className="font-['Poppins'] font-medium text-[20px] md:text-[24px] leading-[1.2] text-[#111827]">
                  Vision
                </h4>
                <p className="font-['Open_Sans'] text-[15px] md:text-[16px] leading-6 text-[#242424] font-light">
                  A world where opportunities are open to everyone and growth is
                  guided by heart and conscience.
                </p>
              </div>
            </div>
          </div>

          {/* Signup Popup Modal 
          <SignupModel open={openSignup} onClose={() => setOpenSignup(false)} />
        </section>
      </LazySection>*/}

      {/*new hersection*/}
      <LazySection effect="fade-up" delay={0.1}>
        <section
          className="w-full bg-hero-gradient"
          style={{
            background:
              "linear-gradient(129.63deg, #FFFFFF 27.35%, #FEDEDE 91.53%, #EE9CE5 99.09%)",
          }}
        >
          <div
            className="flex items-center justify-center 
  px-6 sm:px-10 lg:px-20 
  py-10 sm:py-16 lg:py-20 
  min-h-auto lg:min-h-[722px]"
          >
            <div className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-0 max-w-7xl w-full">
              <div className="flex-1 max-w-[729px] text-center lg:text-left">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <h1
                      style={{ fontFamily: "Poppins, sans-serif" }}
                      className="font-medium 
text-[26px] sm:text-[32px] md:text-[38px] lg:text-[42px]
leading-[120%] tracking-[-0.02em]
bg-linear-to-b from-[#4E4E4E] to-[#232323] text-transparent bg-clip-text"
                    >
                      {" "}
                      Empowering Growth. Connecting People. Creating Impact.
                    </h1>
                    <p
                      className="font-['Open_Sans'] 
text-[14px] sm:text-[15px] md:text-[16px] font-light
leading-6 text-[#242424]
mt-4 sm:mt-6 max-w-[620px] mx-auto lg:mx-0"
                    >
                      We're building more than a platform—we're shaping an
                      ecosystem. From certifications and learning tools for
                      professionals, to communities, marketplaces, and
                      entertainment for individuals, our super app is designed
                      to help you grow, connect, and thrive with purpose.
                    </p>
                    <Button
                      variant="gradient-primary"
                      size="md"
                  onClick={() => setOpenSignup(true)}
                      className="mt-5 sm:mt-6 
px-5 sm:px-6 
py-3 sm:py-4 
text-[14px] sm:text-[16px] font-['Plus Jakarta Sans'] font-medium text-[16px] leading-[100%] tracking-[0px] text-center"
                    >
                      Join the Movement
                    </Button>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex justify-center lg:justify-end w-full lg:w-auto">
                <img
                  src="https://cdn.cness.io/whycnesshero.svg"
                  alt="Hero Illustration"
                  className="w-[260px] sm:w-[340px] md:w-[420px] lg:w-[509px] 
               h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </section>
      </LazySection>

      <LazySection effect="fade-up" delay={0.2}>
        <section className="w-full bg-linear-to-r from-[#FAFAFA] to-[#F6F5FA]">
          <div className="px-6 sm:px-10 lg:px-20 py-10 sm:py-16 lg:py-[86px] max-w-7xl mx-auto">
            <div className="space-y-8">
              <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-[54px]">
                <div className="shrink-0">
                  <img
                    src="https://cdn.cness.io/nandhiji.svg"
                    alt="Our Story"
                    className="w-[90%] sm:w-[450px] md:w-[550px] lg:w-[628px] 
           h-auto object-cover mx-auto"
                  />
                </div>

                <div className="flex-1 max-w-[596px] space-y-[22px]">
                  <div className="text-center lg:text-left">
                    <p className="text-[32px] md:text-[38px] lg:text-[42px] font-semibold bg-linear-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                      Our Story
                    </p>
                    <h3
                      className="mt-2 font-['Poppins'] font-medium
    text-[24px] sm:text-[30px] md:text-[36px] lg:text-[42px]
    leading-[1.3] tracking-[-0.02em] text-[#1F2937]
    text-center lg:text-left
    whitespace-normal lg:whitespace-nowrap"
                    >
                      Begins With a Simple Belief
                    </h3>
                  </div>

                  <p
                    className="max-w-[620px] text-[14px] sm:text-[15px] md:text-[16px]
  leading-[24.4px] text-[#242424] capitalize font-['Open_Sans'] font-light
  text-center lg:text-left mx-auto lg:mx-0"
                  >
                    CNESS was born from the vision of our founder, Nandiji,
                    whose life and teachings embody conscious living. He
                    believed that true growth goes beyond fleeting online
                    inspiration — it's about nurturing the soul and connecting
                    with others on a deeper level. Guided by this belief, he
                    envisioned a space where people could be authentic, nourish
                    their spirits, and support one another on a shared journey
                    toward mindful, meaningful living. That space became CNESS.
                  </p>

                  <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 mt-5">
                    <button className="bg-button-gradient rounded-[81.26px] px-5 py-[13px] hover:opacity-90 transition-opacity">
                      <a
                        onClick={() => setOpenSignup(true)}
                        className="inline-flex items-center justify-center rounded-full
px-6 sm:px-8 py-3 sm:py-4
font-['Plus_Jakarta_Sans'] font-medium text-[16px] leading-[100%] tracking-[0px]
  text-center text-white shadow-md hover:shadow-lg
  bg-linear-to-r from-[#7077FE] to-[#F07EFF] transition-all duration-300"
                      >
                        Join the Journey
                      </a>
                    </button>

                    <Button
                      variant="white-outline"
                      size="md"
                      onClick={() => setIsVideoOpen(true)}
                      className="
  inline-flex items-center justify-center
px-6 sm:px-8 py-3 sm:py-4
rounded-full border border-gray-300
font-['Plus_Jakarta_Sans'] font-medium text-[16px] leading-[100%]
shadow-[0_1px_2px_rgba(0,0,0,0.1)]
gap-2
  "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        className="w-4 h-4 sm:w-5 sm:h-5"
                      >
                        <path d="M6.5 5.5v9l7-4.5-7-4.5z" />
                      </svg>
                      Play Video
                    </Button>

                    {isVideoOpen && (
                      <div
                        className="fixed inset-0 z-50 flex items-center justify-center  p-4"
                        onClick={() => setIsVideoOpen(false)}
                      >
                        <div
                          className={`relative w-full ${
                            isPortrait
                              ? "max-w-[900px] aspect-video"
                              : "max-w-[900px] aspect-video"
                          } rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.3)] bg-black`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => setIsVideoOpen(false)}
                            className="absolute top-3 right-3 z-10 text-white/80 hover:text-white bg-black/40 hover:bg-black/60
                   w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200"
                          >
                            ×
                          </button>

                          {isPortrait && (
                            <video
                              className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40"
                              src={videoUrl}
                              muted
                              loop
                              autoPlay
                            />
                          )}

                          <video
                            ref={videoRef}
                            className={`relative z-10 rounded-3xl ${
                              isPortrait
                                ? "w-auto h-full mx-auto object-contain" // Portrait → center with height fit
                                : "w-full h-full object-cover" // Landscape → fill the container
                            }`}
                            src={videoUrl}
                            controls
                            autoPlay
                            onLoadedMetadata={(e) => {
                              const video = e.target as HTMLVideoElement;
                              setIsPortrait(
                                video.videoHeight > video.videoWidth
                              );
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6 lg:gap-[30px] mt-10">
                <div className="flex-1 bg-white rounded-4xl p-6 sm:p-[30px]">
                  <div className="space-y-[13px]">
                    <h3 className="font-poppins font-medium text-2xl tracking-tight-vision text-black">
                      Mission
                    </h3>
                    <p
                      className=" font-['Open_Sans'] font-light 
  text-[16px] leading-[24.4px] 
  capitalize text-[#242424]"
                    >
                      We built our super app to unite learning, certifications,
                      communities, and marketplaces in one ecosystem—helping
                      people and businesses grow, connect, and thrive with
                      purpose.
                    </p>
                  </div>
                </div>

                <div className="flex-1 bg-white rounded-4xl p-6 sm:p-[30px]">
                  <div className="space-y-[13px]">
                    <h3 className="font-poppins font-medium text-2xl tracking-tight-vision text-black">
                      Vision
                    </h3>
                    <p
                      className="font-['Open_Sans'] font-light 
  text-[16px] leading-[24.4px] 
  capitalize text-[#242424]"
                    >
                      To be the world's most trusted ecosystem, where learning,
                      business, and community come together seamlessly. Creating
                      a future where opportunities are accessible to everyone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <SignupModel open={openSignup} onClose={() => setOpenSignup(false)} />
        </section>
      </LazySection>

      <LazySection effect="fade-up" delay={0.2}>
        <section className="w-full bg-white py-10 sm:py-14 md:py-20 px-4 sm:px-8 md:px-[60px]">
          <div className="w-full 2xl:w-[1300px] mx-auto bg-[#F5F7F9] rounded-3xl md:rounded-4xl px-6 sm:px-10 md:px-12 xl:px-[120px]">
            <div className="grid xl:grid-cols-2 gap-2 w-full items-center">
              {/* Left copy */}
              <div className="text-center xl:text-left py-8 sm:py-12 md:py-[50px]">
                <h2 className="font-poppins font-medium text-[32px] md:text-[42px] leading-[1.3] tracking-[-0.02em] text-black">
                  What Makes Us{" "}
                  <span className="bg-linear-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                    Different
                  </span>
                </h2>
                <p className="mt-4 font-['Open_Sans'] text-[15px] md:text-[16px] leading-relaxed text-[#242424] max-w-[500px] mx-auto xl:mx-0 font-light">
                  CNESS is a purpose-driven super app that unites
                  certifications, learning, marketplace, communities, OTT, and
                  social in one seamless ecosystem
                </p>

                <ul className="mt-8 space-y-5 text-left max-w-[500px] mx-auto xl:mx-0">
                  {[
                    {
                      title: "We measure what matters",
                      desc: "We focus on values and purpose — not just numbers.",
                    },
                    {
                      title: "A creator‑first platform",
                      desc: "We help you tell your story, build your community and grow your impact.",
                    },
                    {
                      title: "Layered experience",
                      desc: "Learn, connect and trade all in one place.",
                    },
                    {
                      title: "Fair Monetization",
                      desc: "We make sure creators earn what they deserve.",
                    },
                    {
                      title: "Strong Cultural Presence",
                      desc: "Our global community celebrates authenticity and respect.",
                    },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CircleCheckBig className="mt-1 text-[#6340FF] w-5 h-5 shrink-0" />
                      <div>
                        <h3 className="font-['Open_Sans'] font-semibold text-[16px] text-black">
                          {item.title}
                        </h3>
                        <p className="font-['Open_Sans'] text-[14px] leading-5 text-[#242424] mt-1 font-light">
                          {item.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right image + popup */}
              <div className="flex justify-center xl:justify-end">
                <img
                  src="https://cdn.cness.io/whycness.jpg"
                  alt="Seller"
                  className="w-full max-w-[400px] md:max-w-[480px] xl:max-w-[500px] h-auto object-contain"
                />
                {/* <img
                    src="https://cdn.cness.io/Group.webp"
                    alt="Feature popups"
                    className="pointer-events-none absolute z-10 h-auto
                       w-[120px] sm:w-[150px] md:w-[160px]
                       left-[52%] top-[46%] sm:left-[50%] sm:top-[45%] md:left-[49%] md:top-[44%]
                       -translate-x-1/2 -translate-y-1/2 drop-shadow-xl"
                  /> */}
              </div>
            </div>
          </div>
        </section>
      </LazySection>

      <LazySection effect="fade-up" delay={0.2}>
        <section
          className="relative w-full h-[350px] sm:h-[400px] md:h-[500px] lg:h-[719px] overflow-hidden py-10 lg:py-[86px]"
          style={{
            background:
              "linear-gradient(180deg, #F8F6FF 0%, #FFFFFF 35%, #FFFFFF 65%, #F8F6FF 100%)",
          }}
        >
          <div className="w-full">
            <h2 className="text-center lg:text-left font-['Poppins'] font-medium text-[32px] md:text-[42px] leading-[1.3] tracking-[-0.02em] text-[#111] px-6 md:px-10 lg:px-16">
              Our{" "}
              <span className="bg-linear-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                Road ahead
              </span>
            </h2>
            <div className="absolute top-8 lg:top-auto bottom-0 lg:mb-[86px] w-full h-full lg:h-[493px]">
              <img
                src="https://cdn.cness.io/roadmap_2026.svg"
                alt="CNESS roadmap"
                className="w-full h-full pointer-events-none select-none object-contain"
              />
            </div>
          </div>
        </section>
      </LazySection>

      {/*<LazySection effect="fade-up" delay={0.2}>
       {/* <section className="w-full max-w-7xl flex mx-auto flex-col justify-center items-center py-16 px-4">
          <div className="w-full text-center">
            <h3
              style={{ fontFamily: "Poppins, sans-serif" }}
              className="font-poppins font-medium text-[32px] md:text-[42px] leading-[54px] tracking-[-0.02em] capitalize text-centerp"
            >
              What{" "}
              <span className="bg-gradient-to-r from-[#D747EA] to-[#7741FB] text-transparent bg-clip-text">
                We Offer
              </span>
            </h3>
            <p className="font-['Open_Sans'] pt-2 text-center w-full text-[#242424] font-light text-[16px] leading-[24.38px]">
              CNESS is a super app that brings together tools for professional
              growth and <br />
              personal connection in one ecosystem.
            </p>
          </div>
          <div className="w-full pt-16 pb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  n: "001",
                  title: "Social Media",
                  desc: "Share stories, inspire others, and build your personal brand.",
                },
                {
                  n: "002",
                  title: "Certification",
                  desc: "Gain knowledge, upskill, and get certified with ease.",
                },
                {
                  n: "003",
                  title: "Marketplace",
                  desc: "A digital space to buy, sell, and showcase meaningful products.",
                },
                {
                  n: "004",
                  title: "LMS",
                  desc: "Access courses and structured learning paths to upskill at your pace.",
                },
                {
                  n: "005",
                  title: "Directory",
                  desc: "A hub to discover verified businesses, professionals, communities, and creators.",
                },
                {
                  n: "006",
                  title: "Best Practices",
                  desc: "Ensure ethical learning, responsible selling & conscious growth.",
                },
                {
                  n: "007",
                  title: "AriOme",
                  desc: "Explore curated content that informs, entertains, and inspires.",
                },
                {
                  n: "008",
                  title: "Communities",
                  desc: "Connect, collaborate, and grow with like-minded individuals.",
                },
              ].map((item) => (
                <div
                  key={item.n}
                  className="relative rounded-4xl bg-[#FAFAFA] hover:shadow-md transition p-6"
                >
                 
                  <div className="absolute top-4 right-4 w-10 h-10">
                    <img src={bulb} alt="bulb" />
                  </div>

                 
                  <span className="font-['Open_Sans'] block text-lg text-[#4B4B4B] font-normal mb-2">
                    {item.n}
                  </span>

             
                  <h3
                    style={{ fontFamily: "Poppins, sans-serif" }}
                    className="text-2xl font-medium text-black"
                  >
                    {item.title}
                  </h3>

                 
                  <p className="font-['Open_Sans'] mt-2 text-base text-[#242424] leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
         <WhatOffer />
      </LazySection>*/}

      {/* <LazySection effect="fade-up" delay={0.2}>
        <section
          className="w-full py-12 md:py-16"
          style={{
            background: "linear-gradient(180deg, #FAFAFA 0%, #F6F5FA 100%)",
          }}
        >
           Heading 
          <div className="mx-auto max-w-[900px] px-4 sm:px-6 text-center">
            <h2 className="font-['Poppins'] font-medium text-[28px] sm:text-[32px] md:text-[42px] leading-tight md:leading-[54px] tracking-[-0.02em] text-[#0F172A]">
              Meet{" "}
              <span className="bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                Our Team
              </span>
            </h2>
            <p className="mt-3 font-['Open_Sans'] text-[14px] sm:text-[15px] md:text-[16px] leading-[22px] text-[#748399] font-light">
              we’re a team of innovators, creators, and changemakers united by
              one belief:
              <br className="hidden md:block" />
              technology should serve both growth and purpose.
            </p>
          </div>

          {/* Team Grid 
          <div className="mx-auto mt-8 md:mt-12 max-w-[1800px] px-4 sm:px-6">
            <div
              className="
        grid 
        justify-items-center
        grid-cols-1 
        xs:grid-cols-2 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4 
        xl:grid-cols-5 
        gap-5 sm:gap-6 md:gap-8
      "
            >
              {people.map((p, i) => (
                <Teamframe
                  key={`${p.name}-${i}`}
                  name={p.name}
                  role={p.role}
                  imageUrl={p.imageUrl}
                  socials={p.socials}
                  selected={selected === i}
                  onClick={() => setSelected(i)}
                  gradientFrom="#F2CEDA"
                  gradientTo="#8575E8"
                />
              ))}
            </div>
          </div>
        </section>
      </LazySection>*/}

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
                  className="jakarta font-medium w-fit rounded-[100px] h-[42px] py-1 px-8 self-stretch text-[16px] "
                  onClick={() => setOpenSignup(true)}
                >
                  Start Your Journey
                </Button>
              </div>
            </div>
          </div>
        </section>
      </LazySection>

      {/* <LazySection effect="fade-up" delay={0.2}>
        <section id="getintouch" className="...">
          <GetInTouch />
        </section>
      </LazySection> */}

      {/*<LazySection effect="fade-up" delay={0.2}>
        <section>
          <Subscribe />
        </section>
      </LazySection>*/}

      <Footer />
    </>
  );
}
