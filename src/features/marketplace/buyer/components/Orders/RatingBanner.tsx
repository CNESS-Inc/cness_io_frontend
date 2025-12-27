export default function RatingBanner() {
  return (
    <div className="flex pt-2.5 px-4 md:px-5 pb-2.5 justify-between items-center self-stretch bg-[#fef7db] rounded-[10px] border-solid border border-[#e9b500] relative w-full">
      <div className="flex flex-1 gap-2 items-center relative min-w-0">
        {/* Icon Container */}
        <div className="flex-shrink-0 w-4.5 h-4.5 md:w-5 md:h-5">
          <div className="w-full h-full bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/GTUvfeW9TD.png)] bg-cover bg-no-repeat relative" />
        </div>
        
        {/* Text Container */}
        <div className="flex flex-col gap-1 justify-center items-start flex-1 min-w-0">
          <span className="font-['Open_Sans'] text-sm md:text-base font-semibold leading-tight md:leading-[21.789px] text-[#000] text-left break-words">
            Please rate your experience with the Seller
          </span>
        </div>
      </div>
      
      {/* Close/Arrow Icon */}
      <div className="flex-shrink-0 w-4.5 h-4.5 md:w-5 md:h-5 ml-2">
        <div className="w-full h-full bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/eFFKL2f5AK.png)] bg-cover bg-no-repeat relative" />
      </div>
    </div>
  );
}