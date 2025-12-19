
import HeroCard from '../components/HeroCard';
import AiCard from '../components/AiCard';

export default function HeroSection() {
  return (
    <div className="flex w-[550px] flex-col gap-[20px] items-start shrink-0 flex-nowrap relative">
      <HeroCard />
      <div className="flex w-[550px] gap-[20px] items-center shrink-0 flex-nowrap relative">
        <div className="flex w-[265px] h-[178px] pt-[10px] pr-[10px] pb-[10px] pl-[10px] flex-col justify-between items-start shrink-0 flex-nowrap bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-18/0MSu7T7yvG.png)] bg-cover bg-no-repeat rounded-[15px] relative overflow-hidden" />
        <AiCard />
      </div>
    </div>
  );
}
