import { Button } from "../../NavBarByAnima/components/ui/button";
import { Card, CardContent } from "../../NavBarByAnima/components/ui/card";

export const FrameByAnima = (): JSX.Element => {
  // Data for the statistics/bullet points
  const bulletPoints = [
    "78% of professionals seek more meaningful work",
    "$4.5T+ global wellness and purpose economy.",
    "150+ professions and 600 industries mapped to DoCM.",
    "Built on the Declaration of Consciousness Movement (DoCM).",
  ];

  return (
    <section className="flex flex-col h-[672px] items-center justify-center gap-2.5 px-8 py-2.5 relative w-full bg-white">
      <div className="flex items-center justify-center gap-[94px] py-6 relative self-stretch w-full">
        {/* Left side - Image placeholder */}
        <Card className="relative w-[462px] h-[506px] rounded-3xl bg-cover bg-[50%_50%] border-0">
          <CardContent className="p-0 h-full" />
        </Card>

        {/* Right side - Content */}
        <div className="flex flex-col w-[726px] items-start gap-6 relative">
          {/* Heading section */}
          <div className="flex flex-col items-start relative self-stretch w-full">
            <header className="inline-flex items-center p-2.5 relative">
              <h3 className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-bold text-[#7076fe] text-2xl tracking-[0] leading-[normal]">
                WHY CNESS
              </h3>
            </header>

            <div className="flex items-center p-2.5 relative self-stretch w-full">
              <h2 className="relative flex-1 mt-[-1.00px] [font-family:'Poppins',Helvetica] font-medium text-black text-[42px] tracking-[0] leading-[59px]">
                Discover the beauty of life through the art of conversation.
              </h2>
            </div>
          </div>

          {/* Bullet points section */}
          <ul className="flex flex-col items-start gap-2 relative self-stretch w-full">
            {bulletPoints.map((point, index) => (
              <li
                key={index}
                className="inline-flex items-center p-2.5 relative"
              >
                <p className="relative w-fit mt-[-1.00px] [font-family:'Open_Sans',Helvetica] font-normal text-black text-xl tracking-[0] leading-[normal]">
                  {point}
                </p>
              </li>
            ))}
          </ul>

          {/* Button */}
          <Button className="bg-[#7076fe] hover:bg-[#5a60e6] px-6 py-4 rounded-[100px]">
            <span className="[font-family:'Plus_Jakarta_Sans',Helvetica] font-medium text-white text-lg text-center tracking-[0] leading-[normal] whitespace-nowrap">
              Why Now
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};
