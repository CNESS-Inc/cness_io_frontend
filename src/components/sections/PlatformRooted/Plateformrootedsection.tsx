import Image from "../../ui/Image";



export default function Plateformrootedsection() {
  return (
    <section className="px-4 sm:px-6 py-6 md:py-[32px] bg-[#F7F7F7]">
      <div className="mb-8 md:mb-12 text-center">
        <h2
          className="jakarta font-semibold text-3xl sm:text-4xl md:text-[52px] leading-[1.25] tracking-normal text-center text-gray-900 mb-4"
        >
          A Platform Rooted in <br/>
          <span className="text-[#7077FE]">Consciousness</span>, Not Compliance
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 py-6 md:py-[32px] px-2">
        <div className="rounded-xl md:rounded-[12px] border border-[#F1EFEC] p-4 md:p-6 bg-white backdrop-blur-[100px]">
          <div className="mb-6 md:mb-[40.55px]">
            <Image
              src="/build_docm.png"
              alt="Company Logo"
              width={56}
              height={56}
              className="bg-[#B19EFF] p-1 md:p-[4.77px] rounded-xl md:rounded-[12px] w-14 h-14 md:w-[70px] md:h-[70px]"
            />
          </div>
          <div>
            <p
              className="poppins font-semibold text-xl md:text-[25px] leading-[120%] tracking-[0%] mt-4 md:mt-[27px] mb-3 md:mb-[18px]"
            >
              Built on DoCM
            </p>
            <p
              className="openSans font-normal text-base md:text-[20px] leading-[150%] tracking-[0%] text-[#666464]"
            >
              Ethics, equity, environment, unity, and well-being
            </p>
          </div>
        </div>
        
        <div className="rounded-xl md:rounded-[12px] border border-[#F1EFEC] p-4 md:p-6 bg-white backdrop-blur-[100px]">
          <div className="mb-6 md:mb-[40.55px]">
            <Image
              src="/first_tech.png"
              alt=""
              width={56}
              height={56}
              className="bg-[#B19EFF] p-1 md:p-[4.77px] rounded-xl md:rounded-[12px] w-14 h-14 md:w-[70px] md:h-[70px]"
            />
          </div>
          <div>
            <p
              className="poppins font-semibold text-xl md:text-[25px] leading-[120%] tracking-[0%] mt-4 md:mt-[27px] mb-3 md:mb-[18px]"
            >
              Human-First Tech
            </p>
            <p
              className="openSans font-normal text-base md:text-[20px] leading-[150%] tracking-[0%] text-[#666464]"
            >
              CIS scoring + LMS + mentorship, all designed for depth
            </p>
          </div>
        </div>
        
        <div className="rounded-xl md:rounded-[12px] border border-[#F1EFEC] p-4 md:p-6 bg-white backdrop-blur-[100px]">
          <div className="mb-6 md:mb-[40.55px]">
            <Image
              src="/proof_posturing.png"
              alt=""
              width={56}
              height={56}
              className="bg-[#B19EFF] p-1 md:p-[4.77px] rounded-xl md:rounded-[12px] w-14 h-14 md:w-[70px] md:h-[70px]"
            />
          </div>
          <div>
            <p
              className="poppins font-semibold text-xl md:text-[25px] leading-[120%] tracking-[0%] mt-4 md:mt-[27px] mb-3 md:mb-[18px]"
            >
              Proof, Not Posturing
            </p>
            <p
              className="openSans font-normal text-base md:text-[20px] leading-[150%] tracking-[0%] text-[#666464]"
            >
              Upload evidence. Earn real recognition.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}