import { useState } from "react";
import { CircleCheckBig } from "lucide-react";
import LazySection from "../components/ui/LazySection";
import bg from "../assets/Frame why cness.png";
import Header from "../layout/Header/Header";
import Footer from "../layout/Footer/Footer";
import Button from "../components/ui/Button";
import SignupModel from "../components/OnBoarding/Signup";
import bulb from "../assets/bulb.svg";
//import Teamframe from "../components/ui/TeamFrame";
import GetInTouch from "../components/sections/GetInTouch";
//import Subscribe from "../components/sections/Subscribe";
import joinImage from "../assets/join-team.png";

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

  const scrollToGetInTouch = () => {
    const el = document.getElementById("getintouch");
    if (!el) return;
    const header = document.querySelector("header"); // if you use a sticky <Header />
    const offset = header ? (header as HTMLElement).offsetHeight : 0;
    const y = el.getBoundingClientRect().top + window.pageYOffset - offset - 8; // tiny extra gap
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <>
      <Header />
      <LazySection effect="fade-up" delay={0.2}>
        <section
          className="relative w-full py-16 md:py-20"
          style={{
            background:
              "linear-gradient(135deg, #FFFFFF 10%, #FDEDED 70%, #F9D3F2 100%)",
          }}
        >
          {/* Text container */}
          <div className="mx-auto max-w-[1100px] px-6 text-center">
            <h1
              style={{ fontFamily: "Poppins, sans-serif" }}
              className={`font-medium text-[32px] md:text-[42px] leading-[115%] tracking-[-0.02em] text-center antialiased bg-gradient-to-b from-[#4E4E4E] to-[#232323] text-transparent bg-clip-text transition-all duration-1000 ease-in-out`}
            >
              Empowering Growth. <br /> Connecting People. Creating Impact.
            </h1>

            <p
              style={{ fontFamily: "Open Sans, sans-serif" }}
              className={`md:text-base font-[300] text-[#64748B] mt-6 max-w-4xl mx-auto transition-all duration-1000 ease-in-out font-['Open Sans']`}
            >
              We’re building more than a platform—we’re shaping an ecosystem.
              From certifications and learning tools
              <br /> for professionals, to communities, marketplaces, and
              entertainment for individuals, our super app is
              <br />
              designed to help you grow, connect, and thrive with purpose.
            </p>
            <Button
              variant="gradient-primary"
              size="md"
              onClick={scrollToGetInTouch}
              className="mt-6 font-['Plus Jakarta Sans'] font-medium text-[16px] leading-[100%] tracking-[0px] text-center"
            >
              Contact Us
            </Button>
          </div>

          {/* Image container (centered with spacing on sides) */}
          <div className="w-full px-4 lg:px-16 pb-12 pt-20">
            <div className="mx-auto max-w-[1900px] rounded-[32px] overflow-hidden">
              <img
                src="https://cdn.cness.io/whycness.webp"
                alt="CNESS Marketplace preview"
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

      {/* --- Our Story + Mission / Vision (Section 2) --- */}
      <LazySection effect="fade-up" delay={0.2}>
        <section className="relative w-full py-16 md:py-20 bg-gradient-to-r from-[#FAFAFA] to-[#F6F5FA]">
          <div className="mx-auto max-w-[1200px] px-6">
            {/* Top row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
              {/* Left: title */}
              <div>
                <p className="text-[32px] md:text-[38px] lg:text-[42px] font-semibold bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                  Our Story
                </p>
                <h3 className="mt-2 font-['Poppins'] font-medium text-[30px] md:text-[36px] lg:text-[42px] leading-[1.3] tracking-[-0.02em] text-[#1F2937]">
                  Begins With a Simple Belief
                </h3>
              </div>

              {/* Right: copy + CTA */}
              <div className="flex flex-col items-start gap-6">
                <p className="max-w-[620px] font-['Open Sans'] text-[15px] md:text-[16px] leading-[24px] text-[#64748B] font-[300]">
                  We Built Our Super App To Unite Learning, Certifications,
                  Communities, And Marketplaces In One Ecosystem—Helping People
                  And Businesses Grow, Connect, And Thrive With Purpose.
                </p>

                <a
                  onClick={() => setOpenSignup(true)}
                  className="inline-flex items-center justify-center rounded-full px-5 py-3 text-[16px]
                     font-['Plus Jakarta Sans'] font-medium text-white shadow-md hover:shadow-lg
                     bg-gradient-to-r from-[#7077FE] to-[#F07EFF]"
                >
                  Join the Journey
                </a>
              </div>
            </div>

            {/* Bottom row: Mission / Vision cards */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-[32px] border border-[#ECEEF2] bg-white/90 shadow-[0_6px_28px_rgba(16,24,40,0.06)] p-[24px] md:p-[30px] flex flex-col gap-[10px]">
                <h4 className="font-['Poppins'] font-medium text-[20px] md:text-[24px] leading-[1.2] text-[#111827]">
                  Mission
                </h4>
                <p className="font-['Open Sans'] text-[15px] md:text-[16px] leading-[24px] text-[#64748B] font-[300]">
                  We Built Our Super App To Unite Learning, Certifications,
                  Communities, And Marketplaces In One Ecosystem—Helping People
                  And Businesses Grow, Connect, And Thrive With Purpose.
                </p>
              </div>

              <div className="rounded-[32px] border border-[#ECEEF2] bg-white/90 shadow-[0_6px_28px_rgba(16,24,40,0.06)] p-[24px] md:p-[30px] flex flex-col gap-[10px]">
                <h4 className="font-['Poppins'] font-medium text-[20px] md:text-[24px] leading-[1.2] text-[#111827]">
                  Vision
                </h4>
                <p className="font-['Open Sans'] text-[15px] md:text-[16px] leading-[24px] text-[#64748B] font-[300]">
                  To Be The World’s Most Trusted Ecosystem, Where Learning,
                  Business, And Community Come Together Seamlessly, Creating A
                  Future Where Opportunities Are Accessible To Everyone.
                </p>
              </div>
            </div>
          </div>

          {/* Signup Popup Modal */}
          <SignupModel open={openSignup} onClose={() => setOpenSignup(false)} />
        </section>
      </LazySection>

      <LazySection effect="fade-up" delay={0.2}>
        <section className="w-full bg-white py-12 md:py-20 px-10 md:px-[86px]">
          <div className="w-full 2xl:w-[1300px] mx-auto bg-[#F5F7F9] rounded-[24px] md:rounded-[32px] px-6 sm:px-10 md:px-12 xl:px-[120px]">
            <div className="grid xl:grid-cols-2 gap-2 w-full items-center">
              {/* Left copy */}
              <div className="text-center xl:text-left py-8 sm:py-12 md:py-[50px]">
                <h2 className="font-poppins font-medium text-[32px] md:text-[42px] leading-[1.3] tracking-[-0.02em] text-[#000]">
                  What Makes Us{" "}
                  <span className="bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                    Different
                  </span>
                </h2>
                <p className="mt-4 font-['Open_Sans'] text-[15px] md:text-[16px] leading-relaxed text-[#64748B] max-w-[500px] mx-auto xl:mx-0 font-[300]">
                  CNESS is a purpose-driven super app that unites
                  certifications, learning, marketplace, communities, OTT, and
                  social in one seamless ecosystem
                </p>

                <ul className="mt-8 space-y-5 text-left max-w-[500px] mx-auto xl:mx-0">
                  {[
                    {
                      title: "First-Of-Its-Kind Consciousness Graph",
                      desc: "Mapping verified values across people and companies.",
                    },
                    {
                      title: "Creator & Org Flywheel",
                      desc: "Unlocks user-led growth and deep engagement.",
                    },
                    {
                      title: "Layered Platform",
                      desc: "Integrates identity, learning, commerce, and content seamlessly.",
                    },
                    {
                      title: "High-Margin Monetization",
                      desc: "Blends SaaS, subscriptions, and digital commerce.",
                    },
                    {
                      title: "Strong Cultural Relevance",
                      desc: "Taps into the global demand for authenticity, wellbeing, and trust.",
                    },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CircleCheckBig className="mt-1 text-[#6340FF] w-5 h-5 shrink-0" />
                      <div>
                        <h3 className="font-['Open_Sans'] font-semibold text-[16px] text-black">
                          {item.title}
                        </h3>
                        <p className="font-['Open_Sans'] text-[14px] leading-[20px] text-[#64748B] mt-1 font-[300]">
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
                  src={bg}
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
            <h2 className="font-['Poppins'] font-medium text-[32px] md:text-[42px] leading-[1.3] tracking-[-0.02em] text-[#111] px-6 md:px-10 lg:px-16">
              Our{" "}
              <span className="bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                Road ahead
              </span>
            </h2>
            <div className="absolute bottom-0 lg:mb-[86px] w-full h-full lg:h-[493px]">
              <img
                src="https://cdn.cness.io/road.webp"
                alt="CNESS roadmap"
                className="w-full h-full pointer-events-none select-none object-contain"
              />
            </div>
          </div>
        </section>
      </LazySection>

      <LazySection effect="fade-up" delay={0.2}>
        <section className="w-full max-w-7xl flex mx-auto flex-col justify-center items-center py-16 px-4">
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
            <p
              style={{ fontFamily: "Open Sans, sans-serif" }}
              className="font-['Open Sans'] pt-2 text-center w-full font-['Open Sans'] text-[#64748B] font-[300] text-[16px] leading-[24.38px] tracking-[0px]"
            >
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
                  {/* Top right icon */}
                  <div className="absolute top-4 right-4 w-10 h-10">
                    <img src={bulb} alt="bulb" />
                  </div>

                  {/* Number */}
                  <span
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    className="font-['Open Sans'] block text-lg text-[#4B4B4B] font-normal mb-2"
                  >
                    {item.n}
                  </span>

                  {/* Title */}
                  <h3
                    style={{ fontFamily: "Poppins, sans-serif" }}
                    className="text-2xl font-medium text-black"
                  >
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    className="font-['Open Sans'] mt-2 text-base text-[#64748B] leading-relaxed font-[300]"
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

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
            <p className="mt-3 font-['Open_Sans'] text-[14px] sm:text-[15px] md:text-[16px] leading-[22px] text-[#748399] font-[300]">
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
                  Join Us
                </Button>
              </div>
            </div>
          </div>
        </section>
      </LazySection>

      <LazySection effect="fade-up" delay={0.2}>
        <section id="getintouch" className="...">
          <GetInTouch />
        </section>
      </LazySection>

      {/*<LazySection effect="fade-up" delay={0.2}>
        <section>
          <Subscribe />
        </section>
      </LazySection>*/}

      <Footer />
    </>
  );
}
