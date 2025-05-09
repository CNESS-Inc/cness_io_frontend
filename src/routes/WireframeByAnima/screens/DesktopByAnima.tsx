import { Card, CardContent } from "../../NavBarByAnima/components/ui/card";

export const DesktopByAnima = (): JSX.Element => {
  // Data for the feature cards
  const featureCards = [
    {
      icon: "https://c.animaapp.com/magbg19buoKwc2/img/frame-1.svg",
      title: "Built on DoCM",
      description: "Ethics, equity, environment, unity, and well-being",
    },
    {
      icon: "https://c.animaapp.com/magbg19buoKwc2/img/frame-6.svg",
      title: "Human-First Tech",
      description: "CIS scoring + LMS + mentorship, all designed for depth",
    },
    {
      icon: "https://c.animaapp.com/magbg19buoKwc2/img/frame-3.svg",
      title: "Proof, Not Posturing",
      description: "Upload evidence. Earn real recognition.",
    },
  ];

  return (
    <section className="flex flex-col items-center gap-2.5 px-6 py-8 relative self-stretch w-full flex-[0_0_auto] bg-[#f7f7f7]">
      <div className="flex flex-col items-center gap-[95px] px-0 py-8 relative self-stretch w-full flex-[0_0_auto]">
        <div className="inline-flex flex-col items-center gap-10 relative flex-[0_0_auto]">
          <h1 className="flex items-start justify-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
            <div className="relative w-[879px] mt-[-1.00px] [font-family:'Plus_Jakarta_Sans',Helvetica] font-normal text-transparent text-[52px] text-center tracking-[0] leading-[65.3px]">
              <span className="font-semibold text-[#3a3a3a]">
                A Platform Rooted in{" "}
              </span>
              <span className="font-bold text-[#7076fe]">Consciousness</span>
              <span className="font-semibold text-[#3a3a3a]">
                , Not Compliance
              </span>
            </div>
          </h1>
        </div>

        <div className="flex h-[284px] items-center gap-6 px-2 py-0 relative self-stretch w-full">
          {featureCards.map((card, index) => (
            <Card
              key={index}
              className="flex flex-col items-start gap-2.5 p-6 relative flex-1 self-stretch grow bg-white rounded-xl overflow-hidden border border-solid border-[#f1efec] backdrop-blur-[50px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(50px)_brightness(100%)]"
            >
              <CardContent className="flex flex-col items-start justify-between relative flex-1 self-stretch w-full grow p-0">
                <div className="inline-flex items-center gap-[1.99px] px-[9.55px] py-[4.77px] relative flex-[0_0_auto] bg-[#b19dff] rounded-xl overflow-hidden rotate-180">
                  <img
                    className="relative w-[50.91px] h-[50.91px] -rotate-180"
                    alt="Frame"
                    src={card.icon}
                  />
                </div>

                <div className="flex flex-col items-start gap-[18px] relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex flex-col h-[57px] items-start justify-end gap-3 relative self-stretch w-full">
                    <h2 className="relative self-stretch [font-family:'Poppins',Helvetica] font-semibold text-[#484747] text-[25px] tracking-[0] leading-[30.0px]">
                      {card.title}
                    </h2>
                  </div>

                  <p className="font-normal text-[#666363] text-xl leading-[30px] relative self-stretch [font-family:'Open_Sans',Helvetica] tracking-[0]">
                    {card.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
