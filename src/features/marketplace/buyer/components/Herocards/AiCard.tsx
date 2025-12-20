export default function AiCard() {
  return (
    <div
      className="
        relative
        w-full
        h-[178px]
        p-[12px]
        bg-[#623fff]
        rounded-[15px]
        overflow-hidden
        flex
        flex-col
        justify-between
      "
    >
      {/* Top content */}
      <div className="relative z-10 flex flex-col gap-[6px]">
        <img
          src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-18/jjVE8gtDMn.png"
          alt="AI"
          className="w-[44px] h-[44px]"
        />

        <h3 className="text-white text-[20px] font-semibold leading-tight">
          Need a guide?
        </h3>

        <p className="text-white text-[12px] leading-[18px] max-w-[180px]">
          Ariven AI is your conscious companion.
        </p>
      </div>

      {/* CTA */}
      <button className="relative z-10 w-fit px-[14px] py-[6px] bg-white rounded-[10px] text-[12px] font-medium text-[#242424]">
        Meet Ariven AI
      </button>

      {/* Decorative circle */}
      <div
        className="
          absolute
          -right-[40px]
          bottom-[-40px]
          w-[175px]
          h-[175px]
          rounded-full
          bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-18/n64PW6BLEn.png)]
          bg-cover
          bg-no-repeat
          opacity-90
        "
      />

      {/* Arrow */}
      <div className="absolute top-[12px] right-[12px] w-[34px] h-[34px] flex items-center justify-center bg-white rounded-full z-10">
        <div
          className="w-[10px] h-[10px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-18/afiMmzi6tn.png)] bg-cover bg-no-repeat"
        />
      </div>
    </div>
  );
}
