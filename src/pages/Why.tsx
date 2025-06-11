import Header from "../layout/Header/Header";
import Footer from "../layout/Footer/Footer";
import whycness from "../assets/whycness.jpg";
import Group from "../assets/Group.png";
import WhypgAnimation from "../components/ui/WhypgAnimation";

export default function Why() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative h-[400px] rounded-[12px] overflow-hidden mx-4 md:mx-8 lg:mx-[12px]">
        <WhypgAnimation />

        <img
          src={Group}
          alt="Decorative Overlay"
          className="absolute bottom-0 left-0 w-full max-w-[660px] z-20 object-contain opacity-100 animate-fadeIn"
        />

        <div className="relative z-10 text-center px-5 sm:px-6 lg:px-8 py-16 md:py-20 max-w-4xl mx-auto">
          <h1 className="poppins text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-b from-[#4E4E4E] to-[#232323] text-transparent bg-clip-text">
            Why CNESS?
          </h1>
          <p className="openSans text-base sm:text-lg md:text-xl text-neutral-600 mb-10 max-w-2xl mx-auto">
            The world's first conscious business platform — where individuals and organizations certify, connect, grow, and lead with integrity.
          </p>
        </div>
      </section>

      {/* Section: Why Description */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2">
            <img
              src={whycness}
              alt="Why CNESS"
              className="w-full max-w-sm mx-auto object-cover rounded-2xl shadow-md"
            />
          </div>

          <div className="w-full md:w-1/2 text-justify">
            <span className="inline-block mb-2 px-4 py-1 bg-[#EFEFFF] text-[#6B6BFF] font-semibold rounded-full text-sm">
              Why CNESS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#232323] mb-4 openSans">
              Empowering Conscious Individuals & Organizations
            </h2>
            {[
              "Through each day of building our vision is our intent — CNESS recognizes, aspires, inspires, and showcases organizations and individuals whose intent and action are for the greater good.",
              "As the Consciousness SuperApp, through the ecosystem of social media, directory, community, networking, brand enhancing, development hacks, best practice, guidance and AI.",
              "CNESS recognizes itself as the world’s most valuable company that offers the ultimate experience of transformation, interactions, trust and reliability, opportunities and growth. Our goal—Empower conscious individuals and organizations.",
              "The \"Good Guy\" wins in being the reckoning brand, trusted as reliable and dependable, inspired & innovative, ethically run with greater goodness as intent and empowered in prosperity that serves humanity."
            ].map((para, idx) => (
              <p key={idx} className="openSans text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed mb-4">
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Why CNESS Exists */}
      <section className="bg-[#F4F1FF] py-20 px-6 sm:px-8">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#232323] leading-snug openSans mb-5">
            CNESS constitutes the new paradigm that platforms<br />
            individuals and organizations that are ethical and with<br />
            vision of betterment of all.
          </h2>

          <h2 className="text-[#7077FE] font-bold uppercase text-2xl sm:text-3xl tracking-wide mb-10">
            Why CNESS Exists
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "To Set a Global Benchmark for Conscious Enterprises",
                content: "CNESS is collective hub of conscious individuals and organizations who envision, operate and serve to upgrade, evolve, innovate and grow as in brand, connectivity, global community and market, attract the best talent, lead and guide with best practices, and care about sustainability and earth.",
              },
              {
                title: "To Bridge Purpose and Practice",
                content: "CNESS inspires the greater mindset that evolves all members who engage and interact by way of self leadership in initiatives and to uplift the industry of operations through best practices and to prod revolutionary change globally as community.",
              },
              {
                title: "To Reward the Right Kind of Success",
                content: "CNESS celebrates success as in impactful existence of individuals and organizations that strive - by collective empowerment, wisdom and practical strategies of collaboration, partnerships and associations.",
              },
              {
                title: "To Build a Community of Future-Ready Enterprises",
                content: "CNESS is the new paradigm recognizing purpose driven, conscious capitalism, innovative dynamic changes, human values and intent beyond profit.",
              },
              {
                title: "To Humanise the Workplace, Systematically",
                content: "CNESS is the new paradigm recognizing purpose driven, conscious capitalism, innovative dynamic changes, human values and intent beyond profit.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 hover:bg-[#E8CDFD] flex flex-col gap-4 min-h-[320px]"
              >
                <h3 className="text-xl font-semibold text-[#232323] mb-2 openSans">
                  {item.title}
                </h3>
                <p className="text-base sm:text-lg text-gray-700 openSans leading-relaxed text-justify">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Section */}
      <section className="bg-[#F4F1FF] py-10 px-6 sm:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-10 shadow-md text-center">
          <h2 className="text-xl sm:text-2xl font-bold uppercase text-[#9747FF] tracking-widest mb-4">
            The Ultimate Why
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed openSans">
            CNESS epitomizes consciousness that is mindful, abundant & prosperous, resourceful, evolving, strategic, intelligent & smart, sustainable and uplifting to humanity.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
