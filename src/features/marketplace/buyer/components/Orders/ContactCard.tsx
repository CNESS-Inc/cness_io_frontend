

export default function ContactCard() {
  return (
    <div className="flex w-[265px] pt-[20px] pr-0 pb-[20px] pl-0 gap-[10px] items-center shrink-0 flex-nowrap bg-gradient-to-t from-[#FFFFFF] to-[#F1F3FF] rounded-xl relative">
      <div className="flex w-[265px] pt-[30px] pr-0 pb-[30px] pl-0 flex-col gap-[12px] items-center shrink-0 flex-nowrap rounded-[12px] relative">
        <div className="flex pt-[4px] pr-[40px] pb-[4px] pl-[40px] gap-[8px] items-center self-stretch shrink-0 flex-nowrap relative">
          <div className="w-[48px] h-[48px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/4p0GSLQpsp.png)] bg-cover bg-no-repeat relative overflow-hidden" />
        </div>
        <div className="flex pt-[4px] pr-[40px] pb-[4px] pl-[40px] gap-[8px] items-center self-stretch shrink-0 flex-nowrap relative">
          <span className="h-[24px] shrink-0 basis-auto font-['Poppins'] text-[16px] font-medium leading-[24px] text-[#080f20] relative text-left whitespace-nowrap">
            Send us a message
          </span>
        </div>
        <div className="flex pt-[4px] pr-[40px] pb-[4px] pl-[40px] gap-[8px] items-center self-stretch shrink-0 flex-nowrap relative">
          <span className="flex w-[185px] h-[60px] justify-start items-start grow shrink-0 basis-0 font-['Open_Sans'] text-[12px] font-normal leading-[20px] text-[#363842] relative text-left">
            Have a question or need support? Send us a message, we're here to help.
          </span>
        </div>
         <button
    className="flex w-[114px] h-[30px] px-[15px] gap-[10px] justify-center items-center rounded-[7px] bg-[#7076fe] text-white"
  >
    <span className="font-['Poppins'] text-[12px] font-medium leading-[18px] tracking-[-0.23px] whitespace-nowrap">
Contact US   
 </span>
  </button>
      </div>
    </div>
  );
}
