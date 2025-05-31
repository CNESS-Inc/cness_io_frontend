import Header from "../layout/Header/Header";
import Footer from "../layout/Footer/Footer";
import { motion } from "framer-motion";
import whycness from "../assets/whycness.jpg";
import Group from "../assets/Group.png";

const cardContent = [
  {
    title: "To Set a Global Benchmark for Conscious Enterprises",
    text: "CNESS offers a structured, evidence-based framework that recognises businesses not just for financial outcomes, but for ethical leadership, social equity, sustainability, culture, and human well-being.",
  },
  {
    title: "To Bridge Purpose and Practice",
    text: "Many organisations have values on paper but lack the systems and culture to bring them alive. CNESS transforms intention into implementation through measurable pillars and transparent certification.",
  },
  {
    title: "To Reward the Right Kind of Success",
    text: "We don’t just certify compliance—we celebrate conscious excellence. Whether you’re a solopreneur or a global enterprise, CNESS is your guide to leading with both integrity and impact.",
  },
  {
    title: "To Build a Community of Future-Ready Enterprises",
    text: "By joining CNESS, you align with a growing global movement of purpose-driven businesses committed to conscious capitalism and the regeneration of people, planet, and profit.",
  },
  {
    title: "To Humanise the Workplace, Systematically",
    text: "The CNESS pillars embed care, fairness, freedom, and well-being into the DNA of organisations—making workplaces not just productive, but truly humane.",
  },
];

export default function Why() {
  return (
    <>
      <Header />
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f2f3ff] to-[#fdf6ff] flex items-center justify-center px-4 pt-10 md:pt-0 pb-10">
        {/* Animated Background Panels */}
        <motion.div
          initial={{ x: "-50%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-[#E8CDFD] to-[#CFC7FF] z-0"
        >
          <img
            src={Group}
            alt="bg left"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        </motion.div>

        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-purple-100 to-indigo-100 z-0"
        >
          <img
            src={whycness}
            alt="bg right"
            className="w-full h-full object-cover opacity-20"
          />
        </motion.div>

        {/* Content Area */}
        <div className="relative z-10 max-w-5xl w-full flex flex-col items-center text-center space-y-10">
          {/* Heading */}
          <motion.h1
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold text-purple-700"
          >
            Why CNESS?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="text-lg md:text-xl text-gray-700"
          >
            Where Consciousness Meets Certification
          </motion.p>

          {/* Card from Bottom */}
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.8, duration: 1 }}
            className="bg-white/60 backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-xl text-left w-full max-w-4xl relative"
          >
            <div className="absolute inset-0 z-[-1]">
              <img
                src={Group}
                alt="network bGroup"
                className="w-full h-full object-cover opacity-10"
              />
            </div>
            <p className="text-gray-800 mb-4">
              <strong>CNESS (Conscious Enterprise & Social Standards)</strong>{" "}
              was born from a simple but powerful question:
              <em className="text-purple-600 font-medium">
                {" "}
                Can a business be both profitable and profoundly human?
              </em>
            </p>
            <p className="text-gray-800 mb-4">
              In today’s fast-paced world, enterprises are increasingly judged
              not only by what they produce—but by how they behave. Customers,
              employees, investors, and communities demand responsible, ethical,
              and sustainable practices.
            </p>
            <p className="text-gray-800 font-semibold">
              Yet, for most organisations, there has never been a clear,
              universal standard to measure these human values—
              <span className="text-purple-600 font-bold"> until now.</span>
            </p>
          </motion.div>
          {/* Section Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 2.4, duration: 0.9 }}
            className="text-3xl md:text-4xl font-bold text-purple-700 pt-5"
          >
            Why CNESS Exists
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
            {cardContent.map((item, index) => {
              // Slower step delay and slightly higher duration
              const baseDelay =
                index < 2
                  ? 3.5 + index * 0.5 // Start first row after section title
                  : 3.0 + (index - 2) * 0.1; // Second row after 5s delay

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: baseDelay,
                    duration: 1.6, // slower animation
                  }}
                  className="bg-white/50 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg text-left"
                >
                  <h3 className="text-lg font-semibold text-purple-700 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-800 text-sm">{item.text}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 3, duration: 1.2 }}
            className="mt-12 text-xl font-semibold text-purple-900"
          >
            <p>Because the world doesn’t need more businesses.</p>
            <p>
              It needs more{" "}
              <span className="text-purple-700 font-bold">
                conscious businesses
              </span>
              .
            </p>
            <p className="mt-2">
              And that’s exactly what <strong>CNESS</strong> certifies.
            </p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
