export default function HeroCard() {
  return (
    <div className="w-full relative">
      <div
        className="
          w-full
          min-h-[200px] sm:min-h-[240px] lg:h-[266px]
          rounded-[15px]
          bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-12-18/e4bf7eaf-66e1-4fde-acd7-1afbd01faaa0.png)]
          bg-cover
          bg-center
          relative
          overflow-hidden
        "
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#464853]/70" />

        {/* Top Pills + Arrow */}
        <div className="relative flex justify-between items-start p-3 sm:p-4 lg:p-[10px]">
          {/* Pills */}
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-white rounded-full text-[11px] font-semibold text-[#242424] shadow-sm">
              Happy
            </span>
            <span className="px-3 py-1 bg-white rounded-full text-[11px] font-semibold text-[#242424] shadow-sm">
              Pleasant
            </span>
          </div>

          {/* Arrow */}
          <div className="
            w-[28px] h-[28px]
            sm:w-[32px] sm:h-[32px]
            lg:w-[34px] lg:h-[34px]
            flex items-center justify-center
            bg-white rounded-full
          ">
            <div
              className="
                w-[8px] h-[8px]
                sm:w-[9px] sm:h-[9px]
                lg:w-[10px] lg:h-[10px]
                bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-18/mA2eK0JBH1.png)]
                bg-cover bg-no-repeat
              "
            />
          </div>
        </div>

        {/* Text + CTA */}
        <div className="relative flex flex-col gap-3 px-4 sm:px-6 lg:p-[20px] mt-2 sm:mt-4">
          <h1 className="text-white leading-tight">
            <span className="
              block
              text-[28px] sm:text-[40px] lg:text-[50px]
              font-semibold
            ">
              Hi Sri!
            </span>
            <span className="
              block
              text-[18px] sm:text-[24px] lg:text-[30px]
              font-light
            ">
              Feeling Happy?
            </span>
          </h1>

          <button
            className="
              w-fit
              px-4 py-2 sm:px-5 sm:py-2.5
              bg-[#623fff]
              rounded-[10px]
              text-white
              text-[14px] sm:text-[16px]
              font-medium
            "
          >
            Yes I am!
          </button>
        </div>
      </div>
    </div>
  );
}