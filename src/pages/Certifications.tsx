import Button from "../components/ui/Button";
import LazySection from "../components/ui/LazySection";
import Header from "../layout/Header";
import joinImage from "../assets/join-team.png";
import GetInTouch from "../components/sections/GetInTouch";
import Subscribe from "../components/sections/Subscribe";
import Footer from "../layout/Footer/Footer";
import CertificationsHero from "../components/certificationsComponents/CertificationsHero";
import Benefit from "../components/certificationsComponents/Benefit";
import CertificationLevel from "../components/certificationsComponents/CertificationLevel";
import Process from "../components/certificationsComponents/Process";
import CertificationFaq from "../components/certificationsComponents/CertificationFaq";

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
        <CertificationsHero />
        <Benefit />
        <CertificationLevel />
      </LazySection>

      {/* certification process section  */}
      <LazySection effect="fade-up" delay={0.2}>
        <Process />
      </LazySection>

      {/* faq section  */}
      <LazySection effect="fade-up" delay={0.2}>
        <CertificationFaq faqs={faqs} />
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
