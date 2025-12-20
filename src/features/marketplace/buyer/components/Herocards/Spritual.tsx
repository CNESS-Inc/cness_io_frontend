export default function CalmCard() {
  return (
    <div
       className="
        relative
        w-full
        h-[178px]
        rounded-[15px]
        overflow-hidden
        bg-[url(https://cdn.cness.io/spritual.jpg)]
        bg-cover
        bg-top
      "
    >
      {/* Overlay (optional, subtle) */}
      <div className="absolute inset-0 bg-[#464853]/50" />

      {/* Content */}
      <div className="relative z-10 flex h-full justify-between p-[12px]">
        
        {/* Left pill */}
        <span className="inline-flex h-fit px-[12px] py-[5px] bg-white rounded-full text-[10px] font-medium text-[#242424]">
          Spritual
        </span>

        {/* Arrow button */}
        <div className="w-[34px] h-[34px] bg-white rounded-full flex items-center justify-center">
          <img
            src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-18/afiMmzi6tn.png"
            className="w-[10px] h-[10px]"
            alt="open"
          />
        </div>

         {/* Bottom title */}
      <div className="absolute bottom-[14px] left-[14px] z-10">
        <span className="font-['Poppins']
    font-semibold
    text-[30px]
    leading-[118%]
    tracking-[-0.01em]
    text-white">
          Elevated
        </span>
      </div>
      </div>
    </div>
  );
}
