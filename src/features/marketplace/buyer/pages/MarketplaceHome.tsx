
import Herosection from "../components/Herosection";
import RecommendationCard from "../components/Recommendationcard";
import Recommendedcard1 from "../components/Recommendedcard1";
import MoodSelector from "../components/Moodselector";
export default function MarketplaceHome() {
  return (

       <div className="flex w-full flex-col gap-[30px] items-start shrink-0 flex-nowrap relative">
      {/* Main Dashboard Content */}
      <main className="flex pt-[20px] pr-[20px] pb-[20px] pl-[20px] gap-[20px] items-start self-stretch shrink-0 flex-nowrap relative overflow-hidden">
        <div className="flex w-[550px] flex-col gap-[20px] items-start shrink-0 flex-nowrap relative">
          <Herosection />
        </div>
        <div className="flex w-[265px] flex-col gap-[20px] items-start self-stretch shrink-0 flex-nowrap relative">
          <div className="flex h-[178px] pt-[10px] pr-[10px] pb-[10px] pl-[10px] flex-col justify-between items-start self-stretch shrink-0 flex-nowrap bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-18/LozECSq8m8.png)] bg-cover bg-no-repeat rounded-[15px] relative overflow-hidden" />
          <RecommendationCard />
        </div>
        <Recommendedcard1 />
      </main>

      {/* Mood Selector Section */}
      <section className="flex pt-[0px] pr-[20px] pb-[0px] pl-[20px] items-start self-stretch shrink-0 flex-nowrap relative">
        <MoodSelector />
      </section>

    
    </div>
  
  );
}

