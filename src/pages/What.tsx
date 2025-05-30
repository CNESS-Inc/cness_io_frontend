import Header from "../layout/Header/Header";
import Footer from "../layout/Footer/Footer";
import { motion, useAnimation } from "framer-motion";
import { useEffect,useState } from "react";
import certification_engine from "../assets/certification_engine.jpg";
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



const words = ["Conscious", "Enterprise", "&", "Social", "Standards"];



export default function What() {
const controls = useAnimation();
  const [showFullForm, setShowFullForm] = useState(false);

  useEffect(() => {
    async function runAnimation() {
      await controls.start({
        x: 0,
        transition: { duration: 1.2, ease: "easeOut" },
      });
      await controls.start({
        y: [-10, 0, -6, 0],
        transition: { duration: 0.6 },
      });

      // Switch to full form after bounce
      setTimeout(() => setShowFullForm(true), 300);
    }

    runAnimation();
  }, [controls]);


  return (
    <>
       
   <Header />
    
      <div className="flex flex-col items-center justify-center h-[250px] overflow-hidden">
        {/* Step 1: Title */}
        <motion.h2
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-4xl font-extrabold text-purple-700 mb-6"
        >
          What is CNESS?
        </motion.h2>

        {/* Step 2: CNESS bounce and transition */}
        {!showFullForm ? (
          <motion.div
            initial={{ x: "-100vw", opacity: 1 }}
            animate={controls}
            className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 to-[#6269FF] text-transparent bg-clip-text"
          >
            CNESS
          </motion.div>
        ) : (
          <div className="flex gap-2 text-2xl md:text-3xl font-bold text-purple-900 mt-2 flex-wrap justify-center">
            {words.map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.25, duration: 0.5 }}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
          </div>
        )}
      </div>

      
{showFullForm && (
  <div className="font-poppins max-w-6xl mx-auto px-4 py-12 space-y-12">

    {/* Block 1: Image Left + Text Right */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="w-full"
      >
        <img
          src={certification_engine}
          alt="CNESS Impact Illustration"
          className="w-full h-auto rounded-xl shadow-lg"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="text-lg text-gray-800 leading-relaxed"
      >
       <div className="bg-gradient-to-br from-[#f8f0ff] to-[#f4f6ff] border border-purple-100 rounded-2xl shadow-lg p-6 md:p-8 max-w-5xl mx-auto font-poppins text-gray-800">
  <p className="text-base md:text-lg leading-relaxed">
          <strong>CNESS</strong> is a global certification and assessment framework that helps organisations measure, improve, and showcase their commitment to ethical, conscious, and human-centred business practices.
        </p>
        </div>
      </motion.div>
    </div>

    {/* Block 2: Text Left + Image Right */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
  <motion.div
    initial={{ x: -100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 3, duration: 1 }}
    className="text-lg text-gray-800 leading-relaxed"
      >
        <div className="bg-gradient-to-br from-[#f8f0ff] to-[#f4f6ff] border border-purple-100 rounded-2xl shadow-lg p-6 md:p-8 max-w-5xl mx-auto font-poppins text-gray-800">
  <p className="text-base md:text-lg leading-relaxed">
    Think of it as the <span className="font-semibold italic">“Consciousness Score”</span> for your organisation —
    a powerful new way to assess how well a company integrates values like <strong>ethics</strong>, <strong>inclusion</strong>, <strong>sustainability</strong>, <strong>culture</strong>, and <strong>well-being</strong> into its core operations.
  </p>
</div>
      </motion.div>

  <motion.div
    initial={{ x: 100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 4, duration: 1 }}
    className="w-full flex justify-center"
  >
        <img
          src={aware_3}
          alt="CNESS Conscious Score"
          className="w-full h-auto rounded-xl shadow-lg"
        />
      </motion.div>
    </div>


<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: 4.7, duration: 1 }}
  className="font-poppins max-w-6xl mx-auto px-4 py-12"
>
 <div className="bg-gradient-to-br from-[#f8f0ff] to-[#f4f6ff] border border-purple-100 rounded-2xl shadow-lg p-8 md:p-12">
    <h3 className="text-2xl font-semibold text-purple-800 mb-10 text-center md:text-left">
      CNESS helps answer questions like:
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        "Are you leading with integrity and fairness?",
        "Are your hiring practices inclusive and equitable?",
        "Is your workplace healthy, humane, and inspiring?",
        "Are you taking responsibility for your environmental and social impact?",
      ].map((question, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
transition={{ delay: 5.2 + index * 0.4, duration: 0.8 }}
          className="flex items-start gap-3 bg-white/60 backdrop-blur-md p-5 rounded-xl shadow-sm border border-purple-100"
        >
          <div className="w-4 h-4 mt-1 bg-purple-600 rounded-full flex-shrink-0" />
          <p className="text-gray-800 text-base md:text-lg leading-snug">{question}</p>
        </motion.div>
      ))}
    </div>
  </div>
</motion.div>


<motion.h3
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: 6, duration: 0.8 }}
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
transition={{ delay: 6.8 + index * 0.1, duration: 0.6 }}
        className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl hover:-translate-y-2 transform transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-600 hover:to-[#6269FF]"
        >


        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-5 h-5 text-purple-600 group-hover:text-white transition" />
          </div>


        <h4 className="text-lg font-semibold text-gray-1000 group-hover:text-white mb-2 transition">
            {pillar.title}
          </h4>
        <p className="text-base text-gray-900 group-hover:text-white leading-relaxed transition">
            {pillar.description}
          </p>

        </motion.div>

        
      );
    })}



  </div>



<div className="max-w-6xl mx-auto px-4">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 7, duration: 0.8 }}
    className="w-full flex justify-center mt-10"
  >
    <p className="max-w-3xl text-center text-sm text-gray-700 font-poppins leading-relaxed">
      Each pillar includes specific areas (like <span className="italic">diversity</span>, <span className="italic">emissions</span>, <span className="italic">mental health</span>, <span className="italic">transparency</span>, etc.) and is measured
      through qualitative and quantitative questions tailored to your size and sector.
    </p>
  </motion.div>
</div>

  </div>

  
)}




      <Footer />

    </>
  );
}
