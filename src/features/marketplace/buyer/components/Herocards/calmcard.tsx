export default function CalmCard() {
  return (
    <div
      className="
        relative
        w-full
        min-h-[140px] sm:min-h-[160px] lg:h-[178px]
        rounded-[15px]
        overflow-hidden
        bg-[url(https://cdn.cness.io/calm.jpg)]
        bg-cover
        bg-top
      "
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#464853]/50" />

      {/* Content */}
      <div className="relative z-10 flex h-full justify-between p-3 sm:p-4 lg:p-[12px]">
        
        {/* Left pill */}
       <span
  className="
    inline-flex h-fit
    px-5 py-[6px]
    rounded-full

    text-[12px]
    font-semibold
    text-[#1f1f1f]

    bg-white
    shadow-lg
   
  "
>
  Relaxed
</span>

        {/* Arrow button */}
        <div
          className="
            w-[28px] h-[28px]
            sm:w-[32px] sm:h-[32px]
            lg:w-[34px] lg:h-[34px]
            bg-white rounded-full
            flex items-center justify-center
            shrink-0
          "
        >
          <img
            src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-18/afiMmzi6tn.png"
            className="w-[8px] h-[8px] sm:w-[9px] sm:h-[9px] lg:w-[10px] lg:h-[10px]"
            alt="open"
          />
        </div>

        {/* Bottom title */}
        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-10">
          <span
            className="
              font-[Poppins]
              font-semibold
              text-[20px] sm:text-[26px] lg:text-[30px]
              leading-[1.15]
              tracking-[-0.01em]
              text-white
            "
          >
            Calm
          </span>
        </div>
      </div>
    </div>
  );
}
