import Header from "../layout/Header/Header";
import Footer from "../layout/Footer/Footer";
import Group from "../assets/Group.png";
import { motion } from "framer-motion";
import certification_engine from "../assets/certification_engine.jpg";
import WhypgAnimation from "../components/ui/WhypgAnimation";

import aware_3  from "../assets/aware_3.jpg";
import {
  Target,
  Users,
  PackageCheck,
  Handshake,
  Landmark,
  Sparkles,
} from "lucide-react";




const pillars = [
  {
    title: "Mission & Vision Statement",
    description:
      "A clear, values-driven mission and vision serve as the compass for conscious enterprises. This pillar evaluates how well an organization defines, communicates, and lives its core purpose, guiding both internal culture and external impact.",
  icon: Target
    },
  {
    title: "Team Spirit",
    description:
      "A conscious business nurtures a culture of respect, inclusion, and shared purpose. This pillar focuses on employee engagement, wellness, equitable opportunities, and the sense of belonging and co-creation within teams.",
   icon: Users
   },
  {
    title: "Client/Customer/Consumer – Ethical Offerings",
    description:
      "Beyond products and services, conscious organizations serve with integrity. This pillar assesses how businesses ethically develop, market, and deliver offerings—putting honesty, accessibility, and real value at the forefront.",
  icon: PackageCheck
    },
  {
    title: "Communities & Charities",
    description:
      "Businesses thrive in ecosystems. This pillar measures how companies contribute to community wellbeing, collaborate with social causes, and create shared value through active participation and service beyond profits.",
 icon: Handshake
    },
  {
    title: "Vision & Legacy – Long-Term Systemic Contribution",
    description:
      "Conscious enterprises think in decades, not quarters. This pillar evaluates how organizations embed sustainability, systems thinking, and legacy-minded leadership into their long-term planning and strategic actions.",
  icon: Landmark
    },
  {
    title: "Best Practices & Leadership",
    description:
      "Leadership sets the tone. This pillar recognizes ethical governance, transparency, courageous decision-making, and a demonstrated commitment to doing what's right—even when it's not easy or popular.",
  icon: Sparkles
    },
];



// const words = ["Conscious", "Enterprise", "&", "Social", "Standards"];



export default function About() {
  return (
    <>
       
   <Header />

    <section className="relative h-[400px] rounded-[12px] overflow-hidden mx-4 md:mx-8 lg:mx-[12px]">
      <WhypgAnimation />
      <img
        src={Group}
        alt="Decorative Overlay"
        className="absolute bottom-0 left-0 w-[660px] z-20 object-contain opacity-100 animate-fadeIn"
      />
      <div className="relative z-10 text-center px-5 sm:px-6 lg:px-8 py-16 md:py-20 max-w-4xl mx-auto">
        <p className="poppins text-3xl sm:text-4xl md:text-5xl text-neutral-800 font-bold mb-6">
          What is CNESS?
        </p>
        <p className="openSans text-base sm:text-lg md:text-xl text-neutral-600 mb-10 max-w-2xl mx-auto">
          Conscious Enterprise & Social Standards
        </p>
      </div>
    </section>

{/* Section 1 – What is CNESS */}
<section className="relative h-auto bg-white rounded-[12px] overflow-hidden mx-4 md:mx-8 lg:mx-[12px] py-16 px-4 md:px-8">
  <div className="bg-[#f3f1ff] rounded-3xl p-6 sm:p-10 md:p-12 max-w-[90rem] mx-auto shadow-xl mb-15">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
  className="flex justify-center items-center"
      >
        <img
          src={certification_engine}
          alt="CNESS Impact Illustration"
          className="w-full max-w-[400px] h-auto object-cover rounded-xl shadow-md"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex items-center text-gray-800 text-center md:text-left"
      >
        <div>
          <h3 className="text-2xl font-bold mb-6">What is CNESS?</h3>
    <p className="text-[20px] leading-relaxed max-w-[600px]">
            <strong>CNESS</strong> is a global certification and assessment framework that helps organisations measure, improve, and showcase their commitment to ethical, conscious, and human-centred business practices.
          </p>
        </div>
      </motion.div>

    </div>
  </div>


{/* Section 2 – Consciousness Score */}

  <div className="bg-[#f3f1ff] rounded-3xl p-6 sm:p-10 md:p-12 max-w-[90rem] mx-auto shadow-xl">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
  className="flex justify-center items-center"
      >
        <div>
    <p className="text-[20px] leading-relaxed max-w-[600px]">
            Think of it as the <span className="font-semibold italic">“Consciousness Score”</span> for your organisation — a powerful new way to assess how well a company integrates values like <strong>ethics</strong>, <strong>inclusion</strong>, <strong>sustainability</strong>, <strong>culture</strong>, and <strong>well-being</strong> into its core operations.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
  className="flex justify-center items-center"
      >
        <img
          src={aware_3}
          alt="CNESS Conscious Score"
          className="w-full max-w-[400px] h-auto object-cover rounded-xl shadow-md"
        />
      </motion.div>

    </div>
  </div>
</section>


<section className="bg-[#f3f1ff] py-16 px-4 md:px-8">
  <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 md:p-12 max-w-[90rem] mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{  duration: 1 }}
    >
      <div className="bg-[#edf3ff] border border-purple-100 rounded-2xl shadow-lg p-6 sm:p-8 md:p-12">
        <h3 className="text-2xl font-semibold text-purple-800 mb-10 text-center md:text-left">
          Why Choose CNESS?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          {[
            "Gain credibility with conscious clients and investors.",
            "Stand out with your ethical and purpose-driven values.",
            "Attract talent that aligns with your mission.",
            "Continuously improve with actionable best practices.",
          ].map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1}}
              className="flex items-start gap-3 bg-white p-5 rounded-xl shadow-sm border border-purple-100"
            >
              <div className="w-4 h-4 mt-1 bg-purple-600 rounded-full flex-shrink-0" />
        <p className="text-gray-800 text-[20px] leading-snug">
                {point}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  </div>
</section>

      {/* Pillars Section */}
      <section className="relative h-auto bg-white rounded-[12px] overflow-hidden mx-4 md:mx-8 lg:mx-[12px] py-16 px-4 md:px-8">

      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{  duration: 1 }}
        className="text-2xl font-semibold text-purple-800 mb-10 text-center"
      >
        CNESS Covers Six Pillars
      </motion.h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pillars.map((pillar, index) => {
          const Icon = pillar.icon;
          return (
          <motion.div
  key={index}
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 1 }}
  className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 hover:bg-[#E8CDFD] flex flex-col justify-between min-h-[280px]"
>
  <div>
    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-4">
      <Icon className="w-5 h-5 text-purple-700 group-hover:text-white transition" />
    </div>
    <h4 className="text-[22px] md:text-xl font-semibold text-gray-800 mb-3 transition">
      {pillar.title}
    </h4>
  </div>
  <p className="text-[20px] text-gray-700 leading-relaxed transition">
    {pillar.description}
  </p>
</motion.div>
          );
        })}
      </div>
      </section>

      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="w-full flex justify-center mt-10"
        >
          <p className="max-w-3xl text-center text-lg text-gray-700 font-poppins leading-relaxed">
            Each pillar includes specific areas (like <span className="italic">diversity</span>, <span className="italic">emissions</span>, <span className="italic">mental health</span>, <span className="italic">transparency</span>, etc.) and is measured through qualitative and quantitative questions tailored to your size and sector.
          </p>
        </motion.div>
      </div>



    <Footer />
    </>
  );
}

