import Image from "../../ui/Image";

export default function Plateformrootedsection() {
  return (
    <section className="px-4 sm:px-6 py-6 md:py-10 bg-[#F7F7F7]">
      {/* Title Section */}
      <div className="mb-8 md:mb-12 text-center px-2">
        <h2 className="jakarta font-semibold text-3xl sm:text-4xl md:text-[48px] leading-tight tracking-normal text-gray-900">
          A Platform Rooted in <br />
          <span className="text-[#7077FE]">Consciousness</span>, Not Compliance
        </h2>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-2">
        {[
          {
            title: "Built on DoCM",
            desc: "Ethics, equity, environment, unity, and well-being",
            img: "/build_docm.png",
          },
          {
            title: "Human-First Tech",
            desc: "CIS scoring + LMS + mentorship, all designed for depth",
            img: "/first_tech.png",
          },
          {
            title: "Proof, Not Posturing",
            desc: "Upload evidence. Earn real recognition.",
            img: "/proof_posturing.png",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[#F1EFEC] p-5 sm:p-6 bg-white shadow-sm"
          >
            <div className="mb-5 sm:mb-7">
              <Image
                src={item.img}
                alt={item.title}
                width={56}
                height={56}
                className="bg-[#B19EFF] p-2 rounded-xl w-14 h-14 sm:w-[70px] sm:h-[70px]"
              />
            </div>
            <h3 className="poppins font-semibold text-xl sm:text-2xl mb-2 text-gray-800">
              {item.title}
            </h3>
            <p className="openSans text-sm sm:text-base text-[#666464] leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
