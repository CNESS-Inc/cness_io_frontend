

export default function RatingBanner() {
  return (
    <div className="flex pt-[10px] pr-[20px] pb-[10px] pl-[20px] justify-between items-center self-stretch shrink-0 flex-nowrap bg-[#fef7db] rounded-[10px] border-solid border border-[#e9b500] relative">
      <div className="flex w-[356px] gap-[8px] items-center shrink-0 flex-nowrap relative">
        <div className="w-[18px] h-[18px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/GTUvfeW9TD.png)] bg-cover bg-no-repeat relative overflow-hidden" />
        <div className="flex w-[330px] flex-col gap-[4px] justify-center items-start shrink-0 flex-nowrap relative">
          <span className="h-[22px] shrink-0 basis-auto font-['Open_Sans'] text-[16px] font-semibold leading-[21.789px] text-[#000] relative text-left whitespace-nowrap">
            Please rate your experience with the Seller
          </span>
        </div>
      </div>
      <div className="w-[18px] h-[18px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/eFFKL2f5AK.png)] bg-cover bg-no-repeat relative overflow-hidden" />
    </div>
  );
}
